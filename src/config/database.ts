import { MongoClient, Db } from 'mongodb';

export interface DatabaseConfig {
  url: string;
  dbName: string;
}

export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(config: DatabaseConfig): Promise<void> {
    try {
      this.client = new MongoClient(config.url);
      await this.client.connect();
      this.db = this.client.db(config.dbName);
      console.log(`Connected to MongoDB database: ${config.dbName}`);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const mongoUri = process.env['MONGO_URI'] || 'mongodb://localhost:27017/todoapp';
  
  // Extract database name from URI or use default
  let dbName = 'todoapp';
  try {
    const url = new URL(mongoUri);
    if (url.pathname && url.pathname.length > 1) {
      dbName = url.pathname.substring(1); // Remove leading slash
    }
  } catch (error) {
    console.warn('Could not parse MONGO_URI, using default database name:', dbName);
  }

  return {
    url: mongoUri,
    dbName: dbName
  };
};
