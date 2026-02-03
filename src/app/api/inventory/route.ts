import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    const inventory = await db.inventory.findMany({
      include: {
        contact: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inventory",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create multiple inventory items (batch)
    const items = Array.isArray(body) ? body : [body];
    
    const results = await Promise.all(
      items.map(async (item) => {
        return await db.inventory.create({
          data: {
            invoiceNumber: item.invoiceNumber,
            contactId: item.contactId,
            woodType: item.woodType,
            length: item.length,
            d1: item.d1,
            d2: item.d2,
            d3: item.d3,
            d4: item.d4,
            trim: item.trim || 0,
            gr: item.gr || 0,
            avgDiameter: item.avgDiameter,
            effectiveLength: item.effectiveLength,
            grossVolume: item.grossVolume,
            grVolume: item.grVolume,
            netVolume: item.netVolume,
            unitPrice: item.unitPrice,
            totalValue: item.totalValue,
            status: item.status || "available",
          },
          include: {
            contact: {
              select: {
                name: true,
              },
            },
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
      message: `Successfully created ${results.length} inventory items`,
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create inventory",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}