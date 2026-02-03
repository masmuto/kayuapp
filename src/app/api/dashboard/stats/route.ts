import { NextResponse } from "next/server";
import db from "@/lib/db-turso";

export async function GET() {
  try {
    // Get total stock volume and value using Turso client
    const inventoryStats = await db.query(`
      SELECT 
        COUNT(*) as totalInventory,
        COALESCE(SUM(netVolume), 0) as totalStockVolume,
        COALESCE(SUM(totalValue), 0) as totalAssetValue
      FROM Inventory 
      WHERE status = 'available'
    `) as Array<{
      totalInventory: number;
      totalStockVolume: number;
      totalAssetValue: number;
    }>;

    // Get total supplier debt (negative balance for suppliers)
    const supplierDebt = await db.query(`
      SELECT COALESCE(SUM(CASE WHEN balance < 0 THEN ABS(balance) ELSE 0 END), 0) as totalDebt
      FROM Contact 
      WHERE type = 'supplier'
    `) as Array<{ totalDebt: number }>;

    // Get total customer receivables (positive balance for customers)
    const customerReceivables = await db.query(`
      SELECT COALESCE(SUM(CASE WHEN balance > 0 THEN balance ELSE 0 END), 0) as totalReceivable
      FROM Contact 
      WHERE type = 'customer'
    `) as Array<{ totalReceivable: number }>;

    // Get total sales count
    const salesCount = await db.query(`SELECT COUNT(*) as count FROM Sales`) as Array<{ count: number }>;

    // Get total contacts count
    const contactsCount = await db.query(`SELECT COUNT(*) as count FROM Contact`) as Array<{ count: number }>;

    // Get stock by wood type
    const stockByType = await db.query(`
      SELECT 
        woodType, 
        SUM(netVolume) as totalVolume, 
        SUM(totalValue) as totalValue, 
        COUNT(*) as count
      FROM Inventory 
      WHERE status = 'available'
      GROUP BY woodType
      ORDER BY totalVolume DESC
    `) as Array<{
      woodType: string;
      totalVolume: number;
      totalValue: number;
      count: number;
    }>;

    // Get recent activity
    const recentInventory = await db.query(`
      SELECT invoiceNumber, woodType, createdAt
      FROM Inventory 
      ORDER BY createdAt DESC
      LIMIT 3
    `) as Array<{
      invoiceNumber: string;
      woodType: string;
      createdAt: string;
    }>;

    const recentSales = await db.query(`
      SELECT invoiceNumber, status, createdAt
      FROM Sales
      ORDER BY createdAt DESC
      LIMIT 3
    `) as Array<{
      invoiceNumber: string;
      status: string;
      createdAt: string;
    }>;

    const recentExpenses = await db.query(`
      SELECT category, amount, createdAt
      FROM Expense
      ORDER BY createdAt DESC
      LIMIT 3
    `) as Array<{
      category: string;
      amount: number;
      createdAt: string;
    }>;

    const stats = {
      totalStockVolume: inventoryStats[0]?.totalStockVolume || 0,
      totalAssetValue: inventoryStats[0]?.totalAssetValue || 0,
      totalInventory: inventoryStats[0]?.totalInventory || 0,
      totalSupplierDebt: supplierDebt[0]?.totalDebt || 0,
      totalCustomerReceivable: customerReceivables[0]?.totalReceivable || 0,
      totalSales: salesCount[0]?.count || 0,
      totalContacts: contactsCount[0]?.count || 0,
      stockByType: stockByType.map(item => ({
        woodType: item.woodType,
        volume: item.totalVolume,
        value: item.totalValue,
        count: item.count,
      })),
      recentActivity: {
        inventory: recentInventory.map(item => ({
          type: "inventory",
          description: `Inventory Baru - ${item.invoiceNumber}`,
          timestamp: item.createdAt,
        })),
        sales: recentSales.map(item => ({
          type: "sales",
          description: `Penjualan - ${item.invoiceNumber}`,
          timestamp: item.createdAt,
        })),
        expenses: recentExpenses.map(item => ({
          type: "expense",
          description: `Biaya Operasional - ${item.category}`,
          timestamp: item.createdAt,
        })),
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}