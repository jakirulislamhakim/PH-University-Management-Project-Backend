import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(query: Record<string, unknown>, modelQuery: Query<T[], T>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }




  
}

export default QueryBuilder;
