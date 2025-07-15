import { preProcessColumns, preProcessRows, preProcessTransforms } from './table-pre-processors';
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

// Test preProcessTransforms function
describe('preProcessTransforms', () => {
  it('should transform values', () => {
    const table = new TableInternal({
      rows: [{ col1: 1, col2: 10 }, { col1: 2, col2: 20 }],
      columns: [
        {
          name: 'col1',
          transformer: (data: CellValue) =>
            parseInt(data?.toString() || '0', 10).toFixed(2)
        },
        {
          name: 'col2',
          transformer: (data: CellValue) =>
            'x' + data?.toString() + 'x'
        }],
    });
    preProcessTransforms(table);
    expect(table.rows[0].text.col1).toBe('1.00');
    expect(table.rows[0].text.col2).toBe('x10x');
    expect(table.rows[1].text.col1).toBe('2.00');
    expect(table.rows[1].text.col2).toBe('x20x');
  });
});
