import { createClient } from "@libsql/client";

// Create Turso client for setup
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addTransactionLogTable() {
  console.log("🔧 Adding TransactionLog table to Turso...");
  
  try {
    // Create TransactionLog table
    const createTableSQL = `
      CREATE TABLE TransactionLog (
        id TEXT PRIMARY KEY,
        contactId TEXT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        referenceId TEXT,
        referenceType TEXT,
        paymentMethod TEXT,
        expenseId TEXT UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await tursoClient.execute({ sql: createTableSQL });
    console.log("✅ TransactionLog table created successfully");
    
    // Test the table
    await tursoClient.execute("SELECT COUNT(*) FROM TransactionLog");
    console.log("✅ TransactionLog table is working correctly");
    
    console.log("🎉 TransactionLog table added successfully!");
    
  } catch (error) {
    console.error("❌ Error adding TransactionLog table:", error);
    process.exit(1);
  }
}

// Run setup
addTransactionLogTable().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});