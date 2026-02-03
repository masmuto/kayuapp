import { createClient } from "@libsql/client";
import { PrismaClient } from "@prisma/client";

// Database configuration
const isProduction = process.env.NODE_ENV === "production";
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

// Check if both URL and token are properly set and not empty
const useTurso = tursoUrl && tursoToken && 
                   tursoUrl.startsWith('libsql://') && 
                   tursoToken.length > 50; // Basic validation

console.log("🔍 Database Configuration:");
console.log("  - TURSO_DATABASE_URL:", tursoUrl ? "✅ Set" : "❌ Not set");
console.log("  - TURSO_AUTH_TOKEN:", tursoToken ? "✅ Set" : "❌ Not set");
console.log("  - tursoUrl length:", tursoUrl?.length || 0);
console.log("  - tursoToken length:", tursoToken?.length || 0);
console.log("  - useTurso:", useTurso);
console.log("  - isProduction:", isProduction);

// Create Turso client if configured
let tursoClient: ReturnType<typeof createClient> | null = null;

if (useTurso) {
  console.log("🚀 Connecting to Turso database...");
  tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
} else {
  console.log("📁 Using local SQLite database");
}

// Enhanced Prisma client with Turso support
class ExtendedPrismaClient extends PrismaClient {
  private tursoClient: ReturnType<typeof createClient> | null;

  constructor() {
    // Always create Turso client if configured
    if (useTurso) {
      console.log("🚀 Creating Turso client...");
      tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      console.log("✅ Turso client created successfully");
    } else {
      console.log("📁 Using local SQLite database");
    }
    
    const datasourceUrl = useTurso 
      ? "file:./dev.db" // Dummy URL for Prisma, we'll use Turso client
      : process.env.DATABASE_URL || "file:./db/custom.db";
    
    super({
      datasources: {
        db: {
          url: datasourceUrl,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
    this.tursoClient = tursoClient;
    
    // Test Turso connection immediately
    if (this.tursoClient) {
      this.tursoClient.execute("SELECT 'Turso client initialized'").then(() => {
        console.log("✅ Turso client created successfully");
      }).catch((err: any) => {
        console.error("❌ Turso client test failed:", err);
      });
    }
  }

  // Custom query method for Turso
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.tursoClient) {
      try {
        console.log("🔍 Executing Turso query:", sql);
        const result = await this.tursoClient.execute({
          sql,
          args: params,
        });
        return result.rows as T[];
      } catch (error) {
        console.error("Turso query error:", error);
        throw error;
      }
    } else {
      // Fallback to Prisma query raw for local SQLite
      try {
        console.log("🔍 Executing local SQLite query:", sql);
        const result = await this.$queryRawUnsafe<T[]>(sql, ...params);
        return result;
      } catch (error) {
        console.error("Prisma query error:", error);
        throw error;
      }
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; database: string }> {
    try {
      if (this.tursoClient) {
        // Use Turso client directly for health check
        await this.tursoClient.execute("SELECT 1");
        return { status: "healthy", database: "turso" };
      } else {
        await this.$queryRaw`SELECT 1`;
        return { status: "healthy", database: "local" };
      }
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "unhealthy", database: this.tursoClient ? "turso" : "local" };
    }
  }

  // Get database info
  getDatabaseInfo() {
    const actuallyUsingTurso = !!this.tursoClient;
    
    return {
      type: actuallyUsingTurso ? "turso" : "local",
      url: actuallyUsingTurso ? process.env.TURSO_DATABASE_URL : process.env.DATABASE_URL,
      isProduction,
      configured: useTurso || !!process.env.DATABASE_URL,
      hasTursoClient: !!this.tursoClient,
      useTurso: useTurso,
    };
  }

  // Override methods to use Turso when available
  async $queryRaw<T = any>(query: TemplateStringsArray | string, ...values: any[]): Promise<T> {
    if (this.tursoClient && typeof query === 'string') {
      // Replace any reference to 'Transaction' table with 'TransactionLog'
      const modifiedQuery = query.replace(/Transaction/g, 'TransactionLog');
      return this.tursoClient.execute({ sql: modifiedQuery, args: values }) as T;
    }
    return super.$queryRaw<T>(query, ...values);
  }

  async $queryRawUnsafe<T = any>(query: string, ...values: any[]): Promise<T> {
    if (this.tursoClient) {
      // Replace any reference to 'Transaction' table with 'TransactionLog'
      const modifiedQuery = query.replace(/Transaction/g, 'TransactionLog');
      return this.tursoClient.execute({ sql: modifiedQuery, args: values }) as T;
    }
    return super.$queryRawUnsafe<T>(query, ...values);
  }
}

// Singleton pattern for database client
declare global {
  var __db: ExtendedPrismaClient | undefined;
}

function createDatabaseInstance(): ExtendedPrismaClient {
  return new ExtendedPrismaClient();
}

export const db = globalThis.__db ?? (globalThis.__db = createDatabaseInstance());

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

export default db;