import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch expenses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const expense = await db.expense.create({
      data: {
        category: body.category,
        amount: body.amount,
        description: body.description || null,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: expense,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create expense",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}