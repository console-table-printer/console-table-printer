import {
  renderTable,
  renderSimpleTable,
  printSimpleTable,
} from './internal-table-printer';
import TableInternal from './internal-table';
import { CellValue } from '../models/external-table';

// Test renderTable function
describe('renderTable', () => {
  it('should render a table with headers and rows', () => {
    const table = new TableInternal(['col1', 'col2']);
    table.addRow({ col1: 'value1', col2: 'value2' });
    const rendered = renderTable(table);
    expect(rendered).toContain('col1');
    expect(rendered).toContain('value1');
  });

  it('should render a table with title', () => {
    const table = new TableInternal({
      title: 'Test Report',
      columns: [{ name: 'name' }, { name: 'score' }],
    });
    table.addRow({ name: 'John', score: 95 });
    const rendered = renderTable(table);
    expect(rendered).toContain('Test Report');
    expect(rendered).toContain('name');
    expect(rendered).toContain('John');
  });

  it('should render a table without title when title is undefined', () => {
    const table = new TableInternal(['col1', 'col2']);
    table.addRow({ col1: 'value1', col2: 'value2' });
    const rendered = renderTable(table);
    expect(rendered).toContain('col1');
    expect(rendered).not.toContain('Title');
  });

  it('should render table with row separators', () => {
    const table = new TableInternal(['col1', 'col2']);
    table.addRow(
      { col1: 'row1', col2: 'data1' },
      { color: 'red', separator: true }
    );
    table.addRow({ col1: 'row2', col2: 'data2' });
    const rendered = renderTable(table);
    expect(rendered).toContain('row1');
    expect(rendered).toContain('row2');
    // Should contain horizontal separator line
    expect(rendered).toMatch(/[─┼╬─]/);
  });

  it('should not render separator for last row', () => {
    const table = new TableInternal(['col1', 'col2']);
    table.addRow({ col1: 'row1', col2: 'data1' });
    table.addRow(
      { col1: 'last_row', col2: 'last_data' },
      { color: 'blue', separator: true }
    );
    const rendered = renderTable(table);
    expect(rendered).toContain('last_row');
    // Count separator lines - should be minimal for headers only
    const separatorLines = rendered
      .split('\n')
      .filter(
        (line) => line.includes('─') || line.includes('╬') || line.includes('┼')
      );
    expect(separatorLines.length).toBeLessThan(5); // Only header separators
  });

  it('should render table with multiple rows and separators', () => {
    const table = new TableInternal(['id', 'name', 'status']);
    table.addRow(
      { id: 1, name: 'Alice', status: 'Active' },
      { color: 'green', separator: true }
    );
    table.addRow(
      { id: 2, name: 'Bob', status: 'Inactive' },
      { color: 'yellow', separator: true }
    );
    table.addRow({ id: 3, name: 'Charlie', status: 'Pending' });
    const rendered = renderTable(table);

    expect(rendered).toContain('Alice');
    expect(rendered).toContain('Bob');
    expect(rendered).toContain('Charlie');

    // Should have separators between first two rows but not after last row
    const lines = rendered.split('\n');
    const separatorCount = lines.filter(
      (line) => line.includes('─') && line.includes('┼')
    ).length;
    expect(separatorCount).toBeGreaterThan(2); // At least header + row separators
  });

  it('should handle table with custom column lengths in title calculation', () => {
    const table = new TableInternal({
      title: 'Wide Title That Should Be Centered',
      columns: [
        { name: 'short', minLen: 5 },
        { name: 'very_long_column_name', minLen: 25 },
        { name: 'med', minLen: 10 },
      ],
    });
    table.addRow({
      short: 'A',
      very_long_column_name: 'Long content here',
      med: 'Medium',
    });
    const rendered = renderTable(table);

    expect(rendered).toContain('Wide Title That Should Be Centered');
    expect(rendered).toContain('short');
    expect(rendered).toContain('very_long_column_name');
  });

  it('should render table with colored title', () => {
    const table = new TableInternal({
      title: 'Colored Report',
      columns: [{ name: 'item' }, { name: 'value' }],
    });
    table.addRow({ item: 'test', value: 123 });
    const rendered = renderTable(table);

    expect(rendered).toContain('Colored Report');
    expect(rendered).toContain('test');
  });

  it('should render table with transformed data and never transform title', () => {
    const table = new TableInternal({
      columns: [
        { name: 'id' },
        { name: 'name' },
        {
          name: 'score',
          transformer: (data: CellValue): CellValue => {
            return Number(data?.toString()).toFixed(2);
          }
        }
      ]
    });

    table.addRows([
      { id: 1, name: 'John', score: 85 },
      { id: 2, name: 'Jane', score: 92 },
      { id: 3, name: 'Bob', score: 78 },
    ]);

    const rendered = renderTable(table);
    expect(rendered).toContain('score');
    expect(rendered).not.toContain('NaN');
    expect(rendered).toContain('85.00');
    expect(rendered).toContain('92.00');
    expect(rendered).toContain('78.00');
  });

  it('should render table with transformed data without modifying the original data values', () => {
    const table = new TableInternal({
      columns: [
        {
          name: 'double',
          transformer: (data: CellValue): CellValue => {
            return Number(data?.toString()) * 2;
          }
        }
      ]
    });

    table.addRows([
      { double: 1 },
      { double: 3 },
      { double: 5 },
    ]);

    // Call renderTable twice to make see if the values are mutated
    renderTable(table);
    const rendered = renderTable(table);
    expect(rendered).toContain('2');
    expect(rendered).toContain('6');
    expect(rendered).toContain('10');
  });
});

// Test renderSimpleTable function
describe('renderSimpleTable', () => {
  it('should render a simple table from rows', () => {
    const rows = [{ col1: 'value1', col2: 'value2' }];
    const rendered = renderSimpleTable(rows);
    expect(rendered).toContain('col1');
    expect(rendered).toContain('value1');
  });

  it('should render simple table with options', () => {
    const rows = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];
    const options = {
      title: 'People List',
      columns: [
        { name: 'name', alignment: 'left' as const },
        { name: 'age', alignment: 'right' as const },
      ],
    };
    const rendered = renderSimpleTable(rows, options);

    expect(rendered).toContain('People List');
    expect(rendered).toContain('Alice');
    expect(rendered).toContain('Bob');
  });

  it('should handle empty rows array', () => {
    const rows: any[] = [];
    const rendered = renderSimpleTable(rows);
    expect(rendered).toBeDefined();
    expect(typeof rendered).toBe('string');
  });

  it('should render simple table with row separators', () => {
    const rows = [
      { id: 1, status: 'active' },
      { id: 2, status: 'pending' },
    ];
    const options = {
      title: 'Status Report',
    };
    const rendered = renderSimpleTable(rows, options);

    expect(rendered).toContain('Status Report');
    expect(rendered).toContain('active');
    expect(rendered).toContain('pending');
  });
});

// Test printSimpleTable function
describe('printSimpleTable', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should print a simple table to the console', () => {
    const rows = [{ col1: 'value1', col2: 'value2' }];
    printSimpleTable(rows);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toContain('col1');
    expect(consoleSpy.mock.calls[0][0]).toContain('value1');
  });

  it('should print table with title and options', () => {
    const rows = [{ name: 'John', score: 95 }];
    const options = {
      title: 'Test Results',
      columns: [
        { name: 'name', alignment: 'center' as const },
        { name: 'score', alignment: 'right' as const },
      ],
    };
    printSimpleTable(rows, options);

    expect(console.log).toHaveBeenCalledTimes(1);
    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('Test Results');
    expect(output).toContain('John');
    expect(output).toContain('95');
  });

  it('should print empty table gracefully', () => {
    const rows: any[] = [];
    printSimpleTable(rows);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(typeof consoleSpy.mock.calls[0][0]).toBe('string');
  });
});
