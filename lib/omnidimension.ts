import { prisma } from './db';

interface CallTriggerParams {
  appointmentId: string;
  userId: string | null;
  userName: string;
  userPhone: string;
  appointmentNumber: string;
  doctorName: string;
  doctorSpecialization: string;
  clinicName: string;
  clinicAddress: string;
  appointmentDate: string;
  appointmentTime: string;
  language?: string;
}

export interface CallTriggerResult {
  success: boolean;
  callId?: string;
  status: 'PENDING' | 'INITIATED' | 'RINGING' | 'ANSWERED' | 'COMPLETED' | 'FAILED';
  message: string;
  voiceCallRecordId?: string;
  debugError?: string;
}

export async function triggerAppointmentConfirmationCall(
  params: CallTriggerParams
): Promise<CallTriggerResult> {
  const apiKey = process.env.OMNIDIMENSION_API_KEY;
  const agentIdRaw = process.env.OMNIDIMENSION_AGENT_ID;

  // agent_id MUST be a numeric integer per OmniDimension API spec
  const agentId = agentIdRaw ? parseInt(agentIdRaw, 10) : NaN;
  const language = params.language || 'en';

  // Normalize phone — OmniDimension requires +country_code prefix
  let formattedPhone = params.userPhone.replace(/\s+/g, '').trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.length === 10
      ? `+91${formattedPhone}`
      : `+${formattedPhone}`;
  }

  console.log('[OmniDimension] Dispatching call:', {
    agentId,
    formattedPhone,
    appointmentNumber: params.appointmentNumber,
    apiKeyPresent: !!apiKey,
  });

  // Create a PENDING VoiceCall record in DB
  let voiceCallRecord;
  try {
    voiceCallRecord = await prisma.voiceCall.create({
      data: {
        appointmentId: params.appointmentId,
        ...(params.userId ? { userId: params.userId } : {}),
        phoneNumber: formattedPhone,
        agentId: String(agentId),
        status: 'PENDING',
        language,
      },
    });
  } catch (err) {
    console.error('[OmniDimension] Failed to create VoiceCall record:', err);
  }

  // Guard: missing API key
  if (!apiKey) {
    const reason = 'OMNIDIMENSION_API_KEY is not set in environment variables.';
    console.error('[OmniDimension]', reason);
    if (voiceCallRecord) {
      await prisma.voiceCall.update({
        where: { id: voiceCallRecord.id },
        data: { status: 'FAILED', failureReason: reason },
      }).catch(() => {});
    }
    return {
      success: false,
      status: 'FAILED',
      message: 'Appointment booked successfully. Voice confirmation API key is not configured.',
      debugError: reason,
      voiceCallRecordId: voiceCallRecord?.id,
    };
  }

  // Guard: agent_id must be a valid integer
  if (isNaN(agentId)) {
    const reason = `OMNIDIMENSION_AGENT_ID "${agentIdRaw}" is not a valid integer. Set it to the numeric agent ID from your OmniDimension dashboard (e.g. 158910).`;
    console.error('[OmniDimension]', reason);
    if (voiceCallRecord) {
      await prisma.voiceCall.update({
        where: { id: voiceCallRecord.id },
        data: { status: 'FAILED', failureReason: reason },
      }).catch(() => {});
    }
    return {
      success: false,
      status: 'FAILED',
      message: 'Appointment booked successfully. Voice confirmation could not be completed (invalid agent ID configured — please set OMNIDIMENSION_AGENT_ID to a numeric value from your OmniDimension dashboard).',
      debugError: reason,
      voiceCallRecordId: voiceCallRecord?.id,
    };
  }

  const callPayload = {
    agent_id: agentId,           // integer, required
    to_number: formattedPhone,   // string with country code
    call_context: {
      user_name: params.userName,
      appointment_date: params.appointmentDate,
      appointment_time: params.appointmentTime,
      doctor_name: params.doctorName,
      doctor_specialization: params.doctorSpecialization,
      clinic_name: params.clinicName,
      clinic_address: params.clinicAddress,
      appointment_id: params.appointmentNumber,
    },
    metadata: {
      appointment_id: params.appointmentId,
      appointment_number: params.appointmentNumber,
      source: 'medicare_ai_platform',
    },
  };

  console.log('[OmniDimension] API Payload:', JSON.stringify(callPayload, null, 2));

  try {
    const response = await fetch('https://backend.omnidim.io/api/v1/calls/dispatch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callPayload),
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // non-JSON response
    }

    console.log('[OmniDimension] API Response:', response.status, JSON.stringify(data));

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        data?.detail ||
        `HTTP ${response.status}: ${JSON.stringify(data)}`;

      console.error('[OmniDimension] Dispatch failed:', errorMsg);

      if (voiceCallRecord) {
        await prisma.voiceCall.update({
          where: { id: voiceCallRecord.id },
          data: { status: 'FAILED', failureReason: errorMsg },
        }).catch(() => {});
      }

      return {
        success: false,
        status: 'FAILED',
        message: 'Appointment booked successfully. Voice confirmation could not be completed.',
        debugError: errorMsg,
        voiceCallRecordId: voiceCallRecord?.id,
      };
    }

    const externalCallId = data.call_id || data.id || `call_${Date.now()}`;
    console.log('[OmniDimension] Call dispatched successfully, callId:', externalCallId);

    if (voiceCallRecord) {
      await prisma.voiceCall.update({
        where: { id: voiceCallRecord.id },
        data: { callId: externalCallId, status: 'INITIATED', startedAt: new Date() },
      }).catch(() => {});
    }

    return {
      success: true,
      callId: externalCallId,
      status: 'INITIATED',
      message: 'Appointment booked successfully. AI voice confirmation call has been initiated.',
      voiceCallRecordId: voiceCallRecord?.id,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Network error connecting to OmniDimension';
    console.error('[OmniDimension] Network/fetch error:', error);

    if (voiceCallRecord) {
      await prisma.voiceCall.update({
        where: { id: voiceCallRecord.id },
        data: { status: 'FAILED', failureReason: errMessage },
      }).catch(() => {});
    }

    return {
      success: false,
      status: 'FAILED',
      message: 'Appointment booked successfully. Voice confirmation could not be completed.',
      debugError: errMessage,
      voiceCallRecordId: voiceCallRecord?.id,
    };
  }
}
