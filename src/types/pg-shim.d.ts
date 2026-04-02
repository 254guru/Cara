declare module 'pg' {
  export interface QueryResult {
    rowCount: number | null;
    rows: unknown[];
  }

  export class Client {
    constructor(config?: { connectionString?: string });
    connect(): Promise<void>;
    query(queryText: string, values?: unknown[]): Promise<QueryResult>;
    end(): Promise<void>;
  }
}
