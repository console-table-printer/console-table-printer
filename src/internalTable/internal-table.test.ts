import TableInternal from './internal-table';
import { renderTable } from './internal-table-printer';
import { ComputedColumn } from '../models/external-table';

// Test initialization of TableInternal

describe('TableInternal Initialization', () => {
  it('should initialize with simple options', () => {
    const table = new TableInternal(['col1', 'col2']);
    expect(table.columns.length).toBe(2);
    expect(table.columns[0].name).toBe('col1');
  });

  it('should initialize with detailed options', () => {
    const options = {
      title: 'Test Table',
      columns: [{ name: 'col1' }, { name: 'col2' }],
    };
    const table = new TableInternal(options);
    expect(table.title).toBe('Test Table');
    expect(table.columns.length).toBe(2);
  });

  it('should initialize with color disabled', () => {
    const options = {
      title: 'No Color Table',
      columns: [{ name: 'col1' }],
      shouldDisableColors: true,
    };
    const table = new TableInternal(options);
    expect(table.colorMap).toEqual({});
  });

  it('should initialize with custom color map', () => {
    const customColorMap = {
      customRed: '\x1b[31m',
      customBlue: '\x1b[34m',
    };
    const options = {
      title: 'Custom Color Table',
      columns: [{ name: 'col1' }],
      colorMap: customColorMap,
    };
    const table = new TableInternal(options);
    expect(table.colorMap).toMatchObject(customColorMap);
  });

  it('should initialize with rows in options', () => {
    const options = {
      columns: [{ name: 'name' }, { name: 'age' }],
      rows: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ],
    };
    const table = new TableInternal(options);
    expect(table.rows.length).toBe(2);
    expect(table.rows[0].text.name).toBe('Alice');
    expect(table.rows[1].text.age).toBe(25);
  });

  it('should initialize with undefined options', () => {
    const table = new TableInternal();
    expect(table.columns.length).toBe(0);
    expect(table.rows.length).toBe(0);
    expect(table.title).toBeUndefined();
  });

  it('should initialize with all possible table options', () => {
    const customColorMap = {
      customRed: '\x1b[31m',
      customBlue: '\x1b[34m',
      reset: '\x1b[0m',
    };

    const customCharLength = {
      '👋': 2,
      '🌟': 2,
    };

    const customStyle = {
      headerTop: { left: '╔', mid: '╦', right: '╗', other: '═' },
      headerBottom: { left: '╠', mid: '╬', right: '╣', other: '═' },
      tableBottom: { left: '╚', mid: '╩', right: '╝', other: '═' },
      rowSeparator: { left: '╟', mid: '╫', right: '╢', other: '─' },
      vertical: '║',
    };

    const options = {
      // Basic options
      title: 'Complete Test Table',
      columns: [
        {
          name: 'col1',
          title: 'Column 1',
          alignment: 'left' as const,
          color: 'red' as const,
          maxLen: 20,
          minLen: 10,
        },
        {
          name: 'col2',
          title: 'Column 2',
          alignment: 'right' as const,
          color: 'blue' as const,
          maxLen: 15,
        },
      ],
      rows: [
        { col1: 'Row 1', col2: 'Value 1' },
        { col1: 'Row 2', col2: 'Value 2' },
      ],

      // Column management
      defaultColumnOptions: {
        alignment: 'center' as const,
        color: 'green' as const,
      },

      // Computed columns
      computedColumns: [
        {
          name: 'computed',
          title: 'Computed',
          function: (row: any) => `${row.col1}-${row.col2}`,
        },
      ],

      // Styling and formatting
      style: customStyle,
      colorMap: customColorMap,
      charLength: customCharLength,
      shouldDisableColors: false,
      rowSeparator: true,

      // Data manipulation
      sort: (a: any, b: any) => a.col1.localeCompare(b.col1),
      filter: (row: any) => row.col1?.includes('Row'),
    };

    const table = new TableInternal(options);

    // Verify basic options
    expect(table.title).toBe('Complete Test Table');
    expect(table.columns.length).toBe(2); // 2 regular + (Not 1 computed)
    expect(table.rows.length).toBe(2);

    // Verify column configuration
    expect(table.columns[0].name).toBe('col1');
    expect(table.columns[0].title).toBe('Column 1');
    expect(table.columns[0].alignment).toBe('left');
    expect(table.columns[0].color).toBe('red');
    expect(table.columns[0].maxLen).toBe(20);
    expect(table.columns[0].minLen).toBe(10);
    expect(table.columns[1].maxLen).toBe(15);

    // Verify column management
    expect(table.defaultColumnOptions).toEqual({
      alignment: 'center',
      color: 'green',
    });

    // Verify computed columns
    expect(table.computedColumns.length).toBe(1);
    expect(table.computedColumns[0].name).toBe('computed');
    expect(typeof table.computedColumns[0].function).toBe('function');

    // Verify styling and formatting
    expect(table.tableStyle).toEqual(customStyle);
    expect(table.colorMap).toMatchObject(customColorMap);
    expect(table.charLength).toEqual(customCharLength);
    expect(table.rowSeparator).toBe(true);

    // Verify data manipulation functions
    expect(typeof table.sortFunction).toBe('function');
    expect(typeof table.filterFunction).toBe('function');

    // Verify rendered output contains expected elements
    const rendered = table.renderTable();
    expect(rendered).toContain('Complete Test Table');
    expect(rendered).toContain('Column 1');
    expect(rendered).toContain('Row 1');
    expect(rendered).toContain('Value 1');
    expect(rendered).toContain('╔'); // Custom style character

    // After table print, the computed column is added to the columns array
    expect(table.columns.length).toBe(3); // 2 regular + 1 computed
  });

  it('should handle partial options and fallbacks', () => {
    // First create a table with some initial values
    const table = new TableInternal({
      title: 'Initial Title',
      style: {
        headerTop: { left: '┌', mid: '┬', right: '┐', other: '─' },
        headerBottom: { left: '├', mid: '┼', right: '┤', other: '─' },
        tableBottom: { left: '└', mid: '┴', right: '┘', other: '─' },
        rowSeparator: { left: '├', mid: '┼', right: '┤', other: '─' },
        vertical: '│',
      },
      enabledColumns: ['col1'],
      disabledColumns: ['col2'],
      computedColumns: [{ name: 'computed', function: (row: any) => row.col1 }],
      rowSeparator: true,
      charLength: { '😊': 2 },
    });

    // Then update with partial options to test fallbacks
    const partialOptions = {
      // Deliberately omit title, style, etc to test fallbacks
      columns: [{ name: 'newCol' }],
    };

    table.initDetailed(partialOptions);

    // Verify that unspecified options retain their previous values
    expect(table.title).toBe('Initial Title');
    expect(table.enabledColumns).toEqual(['col1']);
    expect(table.disabledColumns).toEqual(['col2']);
    expect(table.computedColumns[0].name).toBe('computed');
    expect(table.rowSeparator).toBe(true);
    expect(table.charLength).toEqual({ '😊': 2 });
  });

  it('should handle color map options correctly', () => {
    // Test with shouldDisableColors true
    const tableNoColors = new TableInternal({
      shouldDisableColors: true,
      colorMap: { custom: 'value' }, // This should be ignored due to shouldDisableColors
    });
    expect(tableNoColors.colorMap).toEqual({});

    // Test with only colorMap
    const tableWithColorMap = new TableInternal({
      colorMap: { custom: 'value' },
    });
    expect(tableWithColorMap.colorMap).toMatchObject({ custom: 'value' });

    // Test with neither option
    const tableDefaultColors = new TableInternal({});
    expect(tableDefaultColors.colorMap).toBeTruthy(); // Should have default colors
  });

  it('should handle undefined values in options', () => {
    const table = new TableInternal({
      title: undefined,
      style: undefined,
      sort: undefined,
      filter: undefined,
      enabledColumns: undefined,
      disabledColumns: undefined,
      computedColumns: undefined,
      columns: undefined,
      rowSeparator: undefined,
      charLength: undefined,
      defaultColumnOptions: undefined,
    });

    // Verify default values are used
    expect(table.title).toBeUndefined();
    expect(table.columns).toEqual([]);
    expect(table.enabledColumns).toEqual([]);
    expect(table.disabledColumns).toEqual([]);
    expect(table.computedColumns).toEqual([]);
    expect(table.rowSeparator).toBe(false); // Default value from constructor
    expect(table.charLength).toEqual({});
    expect(table.defaultColumnOptions).toBeUndefined();
    expect(typeof table.sortFunction).toBe('function');
    expect(typeof table.filterFunction).toBe('function');
  });
});

// Test adding columns and rows
describe('TableInternal Additions', () => {
  it('should add columns and rows', () => {
    const table = new TableInternal();
    table.addColumn('col1');
    table.addRow({ col1: 'value1' });
    expect(table.columns.length).toBe(1);
    expect(table.rows.length).toBe(1);
  });

  it('should add string column', () => {
    const table = new TableInternal();
    table.addColumn('stringColumn');
    expect(table.columns.length).toBe(1);
    expect(table.columns[0].name).toBe('stringColumn');
    expect(table.columns[0].title).toBe('stringColumn');
  });

  it('should add computed column', () => {
    const table = new TableInternal();
    const computedColumn: ComputedColumn = {
      name: 'computed',
      title: 'Computed Value',
      function: (row: any) => row.a + row.b,
    };
    table.addColumn(computedColumn);
    expect(table.columns.length).toBe(1);
    expect(table.columns[0].name).toBe('computed');
    expect(table.columns[0].title).toBe('Computed Value');
  });

  it('should add raw column options', () => {
    const table = new TableInternal();
    const rawColumn = {
      name: 'rawCol',
      title: 'Raw Column',
      alignment: 'center' as const,
      color: 'red' as const,
    };
    table.addColumn(rawColumn);
    expect(table.columns.length).toBe(1);
    expect(table.columns[0].name).toBe('rawCol');
    expect(table.columns[0].title).toBe('Raw Column');
  });

  it('should add multiple columns at once', () => {
    const table = new TableInternal();
    const columns = ['col1', 'col2', 'col3'];
    table.addColumns(columns);
    expect(table.columns.length).toBe(3);
    expect(table.columns[0].name).toBe('col1');
    expect(table.columns[2].name).toBe('col3');
  });

  it('should add multiple raw column options at once', () => {
    const table = new TableInternal();
    const columns = [
      { name: 'name', title: 'Full Name' },
      { name: 'age', title: 'Age' },
    ];
    table.addColumns(columns);
    expect(table.columns.length).toBe(2);
    expect(table.columns[0].title).toBe('Full Name');
    expect(table.columns[1].title).toBe('Age');
  });

  it('should create columns from row data', () => {
    const table = new TableInternal();
    // Start with no columns
    expect(table.columns.length).toBe(0);

    // Add row with new columns
    table.addRow({ newCol1: 'value1', newCol2: 'value2' });
    expect(table.columns.length).toBe(2);
    expect(table.columns.find((col) => col.name === 'newCol1')).toBeDefined();
    expect(table.columns.find((col) => col.name === 'newCol2')).toBeDefined();
  });

  it('should not duplicate columns when adding row with existing column names', () => {
    const table = new TableInternal(['existingCol']);
    expect(table.columns.length).toBe(1);

    // Add row with mix of existing and new columns
    table.addRow({ existingCol: 'value1', newCol: 'value2' });
    expect(table.columns.length).toBe(2); // Should only add 1 new column
    expect(
      table.columns.find((col) => col.name === 'existingCol')
    ).toBeDefined();
    expect(table.columns.find((col) => col.name === 'newCol')).toBeDefined();
  });

  it('should add rows with options', () => {
    const table = new TableInternal(['name', 'status']);
    const rowsData = [
      { name: 'Alice', status: 'Active' },
      { name: 'Bob', status: 'Inactive' },
    ];
    const options = { color: 'blue' as const, separator: true };

    table.addRows(rowsData, options);
    expect(table.rows.length).toBe(2);
    expect(table.rows[0].color).toBe('blue');
    expect(table.rows[0].separator).toBe(true);
    expect(table.rows[1].color).toBe('blue');
    expect(table.rows[1].separator).toBe(true);
  });

  it('should preserve an explicit false row separator option', () => {
    const table = new TableInternal({
      columns: [{ name: 'name' }],
      rowSeparator: true,
    });

    table.addRow(
      { name: 'Alice' },
      { color: 'blue' as const, separator: false }
    );

    expect(table.rows[0].separator).toBe(false);
  });

  it('should add rows without options', () => {
    const table = new TableInternal(['id', 'value']);
    const rowsData = [
      { id: 1, value: 'first' },
      { id: 2, value: 'second' },
    ];

    table.addRows(rowsData);
    expect(table.rows.length).toBe(2);
    expect(table.rows[0].text.id).toBe(1);
    expect(table.rows[1].text.value).toBe('second');
  });

  it('should clear rows while preserving columns', () => {
    const table = new TableInternal(['id', 'value']);
    table.addRows([
      { id: 1, value: 'first' },
      { id: 2, value: 'second' },
    ]);

    table.clearRows();

    expect(table.rows).toEqual([]);
    expect(table.columns.map((column) => column.name)).toEqual(['id', 'value']);
  });
});

// Test rendering
describe('TableInternal Rendering', () => {
  it('should render the table', () => {
    const table = new TableInternal(['col1']);
    table.addRow({ col1: 'value1' });
    const rendered = renderTable(table);
    expect(rendered).toContain('value1');
  });

  it('should use renderTable method', () => {
    const table = new TableInternal(['test']);
    table.addRow({ test: 'data' });
    const rendered = table.renderTable();
    expect(rendered).toContain('test');
    expect(rendered).toContain('data');
    expect(typeof rendered).toBe('string');
  });
});

// Test edge cases and error conditions
describe('TableInternal Edge Cases', () => {
  it('should handle empty table rendering', () => {
    const table = new TableInternal();
    const rendered = table.renderTable();
    expect(typeof rendered).toBe('string');
  });

  it('should handle table with columns but no rows', () => {
    const table = new TableInternal(['col1', 'col2']);
    const rendered = table.renderTable();
    expect(rendered).toContain('col1');
    expect(rendered).toContain('col2');
  });

  it('should handle rows with partial data', () => {
    const table = new TableInternal(['col1', 'col2', 'col3']);
    table.addRow({ col1: 'value1' }); // Missing col2 and col3
    table.addRow({ col2: 'value2', col3: 'value3' }); // Missing col1
    expect(table.rows.length).toBe(2);
    const rendered = table.renderTable();
    expect(rendered).toContain('value1');
    expect(rendered).toContain('value2');
  });
});
