export type ColumnType = {
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
};

export type TableType = {
  name: string;
  sql: string;
  columns: ColumnType[];
};

export type schemaType = {
  tables: TableType[];
  relationships: {
    from: string;
    to: string;
  }[];
};
