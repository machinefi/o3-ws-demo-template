import { NextResponse } from "next/server";

// A route for retrieving data from 3p APIs and pushing it to WS
export async function POST() {
  try {
    // try to retrieve data from 3p API
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { error: e.response?.data?.error || e.message || "Unknown error" },
      { status: e.response?.status || 500 }
    );
  }
}

