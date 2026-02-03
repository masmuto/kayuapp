import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contacts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const contact = await db.contact.create({
      data: {
        name: body.name,
        type: body.type,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        balance: body.balance || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: contact,
      message: "Contact created successfully",
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create contact",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}