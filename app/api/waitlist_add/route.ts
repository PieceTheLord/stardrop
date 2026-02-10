import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { email } = req;
    const supabase = await createClient()
    console.log("Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const { data, error } = await supabase.from('waitlist').insert({ email });
    if (error) {
      console.error("Error adding email to waitlist:", error);
      return NextResponse.json({ error: 'Failed to add email to waitlist' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Email added successfully!', email }, { status: 200 });

  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: 'Failed to process POST request' }, { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({ message: 'CORS preflight successful' }, { status: 200 });
}