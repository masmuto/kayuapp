import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    const sales = await db.sales.findMany({
      include: {
        contact: {
          select: {
            name: true,
          },
        },
        inventory: {
          select: {
            woodType: true,
            netVolume: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sales",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const sale = await db.sales.create({
      data: {
        invoiceNumber: body.invoiceNumber,
        contactId: body.contactId,
        inventoryId: body.inventoryId || null,
        woodType: body.woodType || null,
        length: body.length || null,
        d1: body.d1 || null,
        d2: body.d2 || null,
        d3: body.d3 || null,
        d4: body.d4 || null,
        trim: body.trim || 0,
        gr: body.gr || 0,
        avgDiameter: body.avgDiameter || null,
        effectiveLength: body.effectiveLength || null,
        grossVolume: body.grossVolume || null,
        grVolume: body.grVolume || 0,
        netVolume: body.netVolume || null,
        unitPrice: body.unitPrice,
        totalPrice: body.totalPrice,
        status: body.status || "pending",
        notes: body.notes || null,
      },
      include: {
        contact: {
          select: {
            name: true,
          },
        },
        inventory: {
          select: {
            woodType: true,
            netVolume: true,
          },
        },
      },
    });

    // Update inventory status if sold from inventory
    if (body.inventoryId) {
      await db.inventory.update({
        where: { id: body.inventoryId },
        data: { status: "sold" },
      });
    }

    return NextResponse.json({
      success: true,
      data: sale,
      message: "Sale created successfully",
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sale",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}