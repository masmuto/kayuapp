import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    const health = await db.healthCheck();
    const info = db.getDatabaseInfo();
    
    return NextResponse.json({
      success: true,
      data: {
        health,
        info,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Database health check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}