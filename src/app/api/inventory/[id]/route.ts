import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventory = await db.inventory.findUnique({
      where: { id: params.id },
      include: {
        contact: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!inventory) {
      return NextResponse.json(
        {
          success: false,
          error: "Inventory item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inventory item",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const inventory = await db.inventory.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        contact: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: inventory,
      message: "Inventory item updated successfully",
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update inventory item",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.inventory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete inventory item",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}