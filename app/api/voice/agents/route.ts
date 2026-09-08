import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OMNIDIMENSION_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'OMNIDIMENSION_API_KEY is not set' }, { status: 500 });
  }

  try {
    const response = await fetch('https://backend.omnidim.io/api/v1/agents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        error: 'OmniDimension API error',
        status: response.status,
        details: data,
      }, { status: response.status });
    }

    // Return the agents list so we can find the correct numeric agent_id
    return NextResponse.json({
      message: 'Successfully fetched agents from OmniDimension',
      agents: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
