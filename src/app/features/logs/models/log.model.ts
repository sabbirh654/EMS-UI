export interface OperationLog {
  id: object;
  operationType: string;
  entityName: string;
  entityId: string;
  details: string;
  date: string;
  time: string;
}

export interface LogFilter {
  id: number;
  entityName: string;
}
