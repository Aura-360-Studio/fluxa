import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Try to get location from Vercel/Cloudflare headers
  const city = request.headers.get('x-vercel-ip-city');
  const country = request.headers.get('x-vercel-ip-country');
  const region = request.headers.get('x-vercel-ip-country-region');

  if (city && country) {
    return NextResponse.json({
      city,
      country,
      region,
      node: `${city} Node`
    });
  }

  // Fallback if not on Vercel or headers missing
  return NextResponse.json({
    city: 'Bengaluru',
    country: 'IN',
    region: 'KA',
    node: 'Bengaluru Node'
  });
}
