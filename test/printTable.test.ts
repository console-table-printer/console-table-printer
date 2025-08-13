import { printTable } from '../index';
import {
  CellValue,
  ComplexOptions,
  ValueTransformer,
} from '../src/models/external-table';

describe('Testing printTable function', () => {
  // Basic test without any options
  it('should print table without any options', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
    ];

    const result = printTable(testData);
    expect(result).toBeUndefined();
  });

  // Empty data test
  it('should handle empty data array', () => {
    const testData: any[] = [];
    const result = printTable(testData);
    expect(result).toBeUndefined();
  });

  // Test with critical length options
  it('should handle minLen and maxLen options', () => {
    const testData = [
      {
        id: 1,
        description: 'This is a very long description that should be truncated',
        count: 42,
      },
      { id: 2, description: 'Short desc', count: 10 },
    ];

    const result = printTable(testData, {
      defaultColumnOptions: {
        minLen: 10,
        maxLen: 15,
        color: 'red',
      },
    });
    expect(result).toBeUndefined();
  });

  // Test with title and row separators
  it('should print table with title and row separators', () => {
    const testData = [
      { id: 1, status: 'Active', priority: 'High' },
      { id: 2, status: 'Pending', priority: 'Medium' },
    ];

    const result = printTable(testData, {
      title: 'Task Status Report',
      rowSeparator: true,
      defaultColumnOptions: {
        alignment: 'center',
      },
    });
    expect(result).toBeUndefined();
  });

  // Test with custom border style
  it('should print table with custom border style', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
    ];

    const result = printTable(testData, {
      style: {
        headerTop: {
          left: '╔',
          mid: '╦',
          right: '╗',
          other: '═',
        },
        headerBottom: {
          left: '╟',
          mid: '╬',
          right: '╢',
          other: '═',
        },
        tableBottom: {
          left: '╚',
          mid: '╩',
          right: '╝',
          other: '═',
        },
        vertical: '║',
      },
    });
    expect(result).toBeUndefined();
  });

  // Original test with defaultColumnOptions
  it('should print table with defaultColumnOptions', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
    ];

    const result = printTable(testData, {
      defaultColumnOptions: {
        alignment: 'center',
        color: 'blue',
        maxLen: 20,
      },
    });

    expect(result).toBeUndefined();
  });

  // Original test with mixed column options
  it('should print table with mixed column options', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Smith', age: 25 },
    ];

    const result = printTable(testData, {
      columns: [
        { name: 'id', alignment: 'left' },
        { name: 'name' },
        { name: 'age', color: 'green' },
      ],
      defaultColumnOptions: {
        alignment: 'center',
        color: 'blue',
        maxLen: 20,
      },
    });

    expect(result).toBeUndefined();
  });

  // Test with enabled/disabled columns
  it('should print table with enabled and disabled columns', () => {
    const testData = [
      { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    ];

    const result = printTable(testData, {
      enabledColumns: ['id', 'name'],
      disabledColumns: ['email'],
      defaultColumnOptions: {
        alignment: 'left',
      },
    });
    expect(result).toBeUndefined();
  });

  // Test with computed columns
  it('should print table with computed columns', () => {
    const testData = [
      { firstName: 'John', lastName: 'Doe', salary: 50000 },
      { firstName: 'Jane', lastName: 'Smith', salary: 60000 },
    ];

    const options = {
      columns: [
        { name: 'firstName' },
        { name: 'lastName' },
        { name: 'salary' },
      ],
      computedColumns: [
        {
          name: 'fullName',
          title: 'Full Name',
          function: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          name: 'taxed_salary',
          title: 'After Tax',
          function: (row) => (row.salary * 0.8).toFixed(2),
        },
      ],
    } as ComplexOptions;

    const result = printTable(testData, options);
    expect(result).toBeUndefined();
  });

  // Test with transform function
  it('should print table with transform columns', () => {
    const testData = [
      { firstName: 'John', lastName: 'Doe', salary: 50000 },
      { firstName: 'Jane', lastName: 'Smith', salary: 60000 },
    ];
    const tranformer: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toFixed(2);

    const options = {
      columns: [
        { name: 'firstName' },
        { name: 'lastName' },
        { name: 'salary', transformer: tranformer },
      ],
      computedColumns: [
        {
          name: 'fullName',
          title: 'Full Name',
          function: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          name: 'taxed_salary',
          title: 'After Tax',
          function: (row) => (row.salary * 0.8).toFixed(2),
        },
      ],
    } as ComplexOptions;

    const result = printTable(testData, options);
    expect(result).toBeUndefined();
  });
});
