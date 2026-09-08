import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { symptomAnalysisSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    const body = await request.json();
    const validated = symptomAnalysisSchema.parse(body);

    const text = validated.symptoms.toLowerCase();
    const { age, severity } = validated;

    // Rule-based clinical triage engine for preliminary health guidance
    let emergencyWarning: string | null = null;
    let suggestedDoctor = 'General Physician';
    let possibleConditions: string[] = [];
    let precautions: string[] = [];
    let medicineInformation: string[] = [];
    let dos: string[] = [];
    let donts: string[] = [];

    // Red flag / Emergency symptom check
    const emergencyKeywords = [
      'chest pain',
      'shortness of breath',
      'difficulty breathing',
      'sudden numbness',
      'stroke',
      'paralysis',
      'unconscious',
      'fainting',
      'severe bleeding',
      'coughing blood',
      'suicidal',
      'anaphylaxis',
    ];

    const hasEmergencySymptom = emergencyKeywords.some((keyword) => text.includes(keyword));

    if (hasEmergencySymptom || severity === 'Critical') {
      emergencyWarning =
        '🚨 EMERGENCY ALERT: Your symptoms suggest a potentially life-threatening emergency. Please seek immediate emergency medical care (Call 108 / 911 or visit the nearest ER emergency room right away). Do not delay.';
    }

    // Specialization Triage & Preliminary Analysis
    if (text.includes('heart') || text.includes('chest') || text.includes('palpitations') || text.includes('high bp')) {
      suggestedDoctor = 'Cardiologist';
      possibleConditions = [
        'Cardiovascular Fatigue or Angina (Possible)',
        'Hypertension / Blood Pressure Fluctuation',
        'Acid Reflux / Gastroesophageal Reflux (GERD) mimicking chest discomfort',
        'Stress or Anxiety-induced Palpitations',
      ];
      precautions = [
        'Avoid physical exertion and heavy weight lifting.',
        'Rest in a comfortable, upright seated position.',
        'Monitor blood pressure and pulse rate closely.',
        'Avoid caffeine, alcohol, and high-sodium meals.',
      ];
      medicineInformation = [
        'General Info: Non-prescription anti-acids or salt reduction may help indigestion, but cardiac evaluation is mandatory.',
        'Note: Never take nitrate medications or aspirin without explicit doctor advice.',
      ];
      dos = [
        'Sit upright and keep calm in a well-ventilated area.',
        'Keep emergency contact details ready.',
        'Note down exact frequency and timing of chest pain episodes.',
      ];
      donts = [
        'Do not engage in strenuous physical exercise.',
        'Do not consume heavy or greasy food.',
        'Do not ignore persistent chest tightness or radiating arm pain.',
      ];
    } else if (
      text.includes('skin') ||
      text.includes('rash') ||
      text.includes('itching') ||
      text.includes('acne') ||
      text.includes('eczema') ||
      text.includes('spots')
    ) {
      suggestedDoctor = 'Dermatologist';
      possibleConditions = [
        'Allergic Dermatitis or Contact Rash',
        'Eczema / Dry Skin Flare-up',
        'Fungal or Bacterial Skin Reaction',
        'Hives (Urticaria) from dietary or environmental trigger',
      ];
      precautions = [
        'Keep the affected area clean, dry, and cool.',
        'Avoid harsh chemical soaps, fragrance products, or synthetic clothes.',
        'Avoid scratching or picking at affected skin lesions.',
      ];
      medicineInformation = [
        'General Info: Mild fragrance-free moisturizers or calamine lotion can soothe surface irritation.',
        'Note: Topical steroid creams should only be used under dermatologist direction.',
      ];
      dos = [
        'Apply cold compress gently if itching is intense.',
        'Wear loose, breathable cotton clothing.',
        'Stay well hydrated with fresh water.',
      ];
      donts = [
        'Do not scratch or pop blisters or rashes.',
        'Do not apply unverified home remedies or harsh alcohol wipes.',
        'Do not expose irritated skin to direct hot sunlight.',
      ];
    } else if (
      text.includes('ear') ||
      text.includes('nose') ||
      text.includes('throat') ||
      text.includes('cough') ||
      text.includes('sinus') ||
      text.includes('tonsil')
    ) {
      suggestedDoctor = 'ENT Specialist';
      possibleConditions = [
        'Upper Respiratory Tract Infection (Common Cold / Viral Rhinitis)',
        'Acute Sinusitis or Nasal Congestion',
        'Pharyngitis / Tonsillitis',
        'Allergic Rhinitis',
      ];
      precautions = [
        'Gargle with warm salt water 2-3 times daily.',
        'Inhale steam twice daily for sinus congestion.',
        'Stay warm and protect throat from cold drafts.',
      ];
      medicineInformation = [
        'General Info: Warm fluids, honey with turmeric, and OTC saline spray can relieve irritation.',
        'Note: Antibiotics are ineffective against viral infections and require prescription.',
      ];
      dos = [
        'Drink plenty of warm fluids (herbal teas, warm water, soups).',
        'Get adequate rest for fast immune recovery.',
        'Use a clean room humidifier if air is dry.',
      ];
      donts = [
        'Do not consume icy drinks or excessive frozen dairy products.',
        'Do not smoke or stay near secondhand tobacco smoke.',
        'Do not insert cotton swabs deep into ear canals.',
      ];
    } else if (
      text.includes('joint') ||
      text.includes('bone') ||
      text.includes('knee') ||
      text.includes('back pain') ||
      text.includes('fracture') ||
      text.includes('sprain')
    ) {
      suggestedDoctor = 'Orthopedic';
      possibleConditions = [
        'Lumbar Strain / Acute Musculoskeletal Back Pain',
        'Ligament Strain or Joint Inflammation (Arthritis flare)',
        'Postural Muscle Stiffness',
        'Tendonitis or Overuse Injury',
      ];
      precautions = [
        'Apply R.I.C.E protocol (Rest, Ice, Compression, Elevation) for acute injuries.',
        'Maintain correct lumbar posture while sitting and standing.',
        'Avoid sudden twisting or heavy lifting.',
      ];
      medicineInformation = [
        'General Info: Topical pain relief gels (diclofenac) or cold gel packs help relieve local discomfort.',
        'Note: Extended oral painkiller use can harm kidney and stomach lining.',
      ];
      dos = [
        'Apply ice packs for initial 48 hours, then mild warm compress.',
        'Use ergonomic chair support when working at desk.',
        'Perform light stretching if approved by specialist.',
      ];
      donts = [
        'Do not lift heavy objects with bent back posture.',
        'Do not sit continuously for over 60 minutes without walking.',
        'Do not push through severe sharp joint pain.',
      ];
    } else if (age <= 14) {
      suggestedDoctor = 'Pediatrician';
      possibleConditions = [
        'Pediatric Viral Fever / Common Cold',
        'Gastroenteritis / Stomach Bug',
        'Pediatric Allergy',
        'Childhood Viral Exanthem',
      ];
      precautions = [
        'Ensure continuous liquid intake (electrolyte solution / ORS).',
        'Monitor temperature every 3-4 hours.',
        'Keep child comfortable in lightweight cotton clothes.',
      ];
      medicineInformation = [
        'General Info: Pediatric paracetamol syrup dosage is strictly weight-dependent.',
        'Note: Aspirin must NEVER be given to children under 18 due to Reye Syndrome risk.',
      ];
      dos = [
        'Offer frequent small sips of ORS or water.',
        'Maintain a calm, quiet rest environment.',
        'Keep track of wet diapers / urination frequency.',
      ];
      donts = [
        'Do not over-wrap child in heavy blankets when feverish.',
        'Do not administer adult medications by halving doses.',
        'Do not ignore lethargy or refusal to take fluids.',
      ];
    } else {
      // Default General Physician
      suggestedDoctor = 'General Physician';
      possibleConditions = [
        'Acute Viral Syndrome / Seasonal Flu',
        'Systemic Fatigue or Mild Dehydration',
        'Inflammatory Response / General Fatigue',
        'Non-specific Metabolic or Digestive Upset',
      ];
      precautions = [
        'Ensure 8 hours of restful sleep and drink at least 2.5-3L water daily.',
        'Eat light, freshly cooked nutritious meals.',
        'Track daily symptom progress and body temperature.',
      ];
      medicineInformation = [
        'General Info: Hydration with electrolyte fluids and rest are primary non-prescription measures.',
        'Note: Always consult a licensed doctor before starting any prescription course.',
      ];
      dos = [
        'Get thorough rest and stay in a ventilated, clean room.',
        'Eat balanced light meals rich in Vitamin C and antioxidants.',
        'Book an appointment with a General Physician if symptoms persist > 48 hours.',
      ];
      donts = [
        'Do not self-prescribe antibiotics or strong steroids.',
        'Do not skip meals or skip hydration.',
        'Do not ignore worsening shortness of breath or persistent high fever.',
      ];
    }

    // Format output JSON string fields
    const analysisData = {
      possibleConditions: JSON.stringify(possibleConditions),
      suggestedDoctor,
      precautions: JSON.stringify(precautions),
      medicineInformation: JSON.stringify(medicineInformation),
      dos: JSON.stringify(dos),
      donts: JSON.stringify(donts),
      emergencyWarning,
    };

    // Save record to DB if user is logged in
    let savedRecord = null;
    if (session?.userId) {
      savedRecord = await prisma.symptomAnalysis.create({
        data: {
          userId: session.userId,
          symptoms: validated.symptoms,
          age: validated.age,
          gender: validated.gender,
          duration: validated.duration,
          severity: validated.severity,
          ...analysisData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      analysis: {
        id: savedRecord?.id || `temp_${Date.now()}`,
        symptoms: validated.symptoms,
        age: validated.age,
        gender: validated.gender,
        duration: validated.duration,
        severity: validated.severity,
        possibleConditions,
        suggestedDoctor,
        precautions,
        medicineInformation,
        dos,
        donts,
        emergencyWarning,
        disclaimer:
          '⚠️ MEDICAL DISCLAIMER: Medicare AI provides preliminary AI-generated health assistance for informational purpose only. This analysis is NOT a definitive medical diagnosis, prescription, or substitute for professional clinical advice.',
      },
    });
  } catch (error: unknown) {
    console.error('Symptom analysis error:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to analyze symptoms';
    return NextResponse.json({ error: errMessage }, { status: 400 });
  }
}
