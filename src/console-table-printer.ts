import TableInternal from './internalTable/internal-table';
import { Dictionary } from './models/common';
import { ColumnOptionsRaw, ComplexOptions } from './models/external-table';
import {
  convertRawRowOptionsToStandard,
  RowOptionsRaw,
} from './utils/table-helpers';

export default class Table {
  table: TableInternal;

  constructor(options?: ComplexOptions | string[]) {
    this.table = new TableInternal(options);
  }

  addColumn(column: string | ColumnOptionsRaw) {
    this.table.addColumn(column);
    return this;
  }

  addColumns(columns: string[] | ColumnOptionsRaw[]) {
    this.table.addColumns(columns);
    return this;
  }

  addRow(text: Dictionary, rowOptions?: RowOptionsRaw) {
    this.table.addRow(text, convertRawRowOptionsToStandard(rowOptions));
    return this;
  }

  addRows(toBeInsertedRows: Dictionary[], rowOptions?: RowOptionsRaw) {
    this.table.addRows(
      toBeInsertedRows,
      convertRawRowOptionsToStandard(rowOptions)
    );
    return this;
  }

  clearRows() {
    this.table.clearRows();
    return this;
  }

  printTable() {
    const tableRendered = this.table.renderTable();
    console.log(tableRendered);
  }

  render() {
    return this.table.renderTable();
  }
}
