import { NextResponse } from "next/server";

import { triggerEvaluation } from "@/features/data/services/w3bstream/client";

// A route for triggering rewards minting
export async function POST() {
  try {
    await triggerEvaluation();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.response.data.error || e.message || "Unknown error" },
      { status: e.response.status || 500 }
    );
  }
}
