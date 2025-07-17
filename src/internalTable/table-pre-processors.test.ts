import { preProcessColumns, preProcessRows } from './table-pre-processors';
import TableInternal from './internal-table';
import { CellValue } from '../models/external-table';

// Test preProcessColumns function
describe('preProcessColumns', () => {
  it('should process computed columns and enable/disable columns', () => {
    const table = new TableInternal({
      columns: [{ name: 'col1' }, { name: 'col2' }],
      computedColumns: [
        { name: 'computedCol', function: (row) => row.col1 + row.col2 },
      ],
      enabledColumns: ['col1', 'computedCol'],
    });
    preProcessColumns(table);
    expect(table.columns.length).toBe(2);
    expect(table.columns[1].name).toBe('computedCol');
  });
});

// Test preProcessRows function
describe('preProcessRows', () => {
  it('should filter and sort rows', () => {
    const table = new TableInternal({
      rows: [{ col1: 1 }, { col1: 2 }],
      filter: (row) => row.col1 > 1,
      sort: (a, b) => b.col1 - a.col1,
    });
    preProcessRows(table);
    expect(table.rows.length).toBe(1);
    expect(table.rows[0].text.col1).toBe(2);
  });
});
