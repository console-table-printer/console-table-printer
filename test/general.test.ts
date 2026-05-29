import { Table } from '../index';
import { getTableBody, getTableHeader } from './testUtils/getRawData';

describe('General Table Functionality', () => {
  it('should create identical tables whether rows are added during or after instantiation', () => {
    const rows = [{ foo: '1', bar: '2' }];

    const table1 = new Table();
    table1.addRows(rows);

    const table2 = new Table({ rows });

    expect(table1.table).toStrictEqual(table2.table);
  });

  it('should handle empty table creation', () => {
    const table = new Table();
    expect(table.render()).toMatchSnapshot();
  });

  it('should handle table with no columns but with rows', () => {
    const table = new Table();
    table.addRow({ dynamicCol1: 'value1', dynamicCol2: 'value2' });
    expect(table.render()).toMatchSnapshot();
  });

  it('should maintain data consistency across operations', () => {
    const table = new Table();

    // Add columns first
    table.addColumns(['col1', 'col2']);

    // Add rows one by one
    table.addRow({ col1: 'value1', col2: 'value2' });
    table.addRow({ col1: 'value3', col2: 'value4' });

    // Add multiple rows
    table.addRows([
      { col1: 'value5', col2: 'value6' },
      { col1: 'value7', col2: 'value8' },
    ]);

    expect(table.render()).toMatchSnapshot();
  });

  it('should handle mixed data types in cells', () => {
    const table = new Table();
    table.addRows([
      {
        number: 42,
        string: 'text',
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        object: { key: 'value' },
      },
    ]);

    expect(table.render()).toMatchSnapshot();
  });

  it('should support method chaining for all operations', () => {
    const table = new Table()
      .addColumn('col1')
      .addColumns(['col2', 'col3'])
      .addRow({ col1: 'v1', col2: 'v2', col3: 'v3' })
      .addRows([
        { col1: 'v4', col2: 'v5', col3: 'v6' },
        { col1: 'v7', col2: 'v8', col3: 'v9' },
      ]);

    expect(table.render()).toMatchSnapshot();
  });

  it('should make sure each column is what its expected to be', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    // Add columns first
    table.addColumns(['col1', 'col2']);

    // Add rows one by one
    table.addRow({ col1: 'value1', col2: 'value2' });
    table.addRow({ col1: 'value3', col2: 'value4' });

    // Add multiple rows
    table.addRows([
      { col1: 'value5', col2: 'value6' },
      { col1: 'value7', col2: 'value8' },
    ]);

    const [renderedHeader, renderedBody] = [
      getTableHeader(table),
      getTableBody(table),
    ];
    expect(renderedHeader).toEqual('│   col1 │   col2 │');
    expect(renderedBody).toEqual([
      '│ value1 │ value2 │',
      '│ value3 │ value4 │',
      '│ value5 │ value6 │',
      '│ value7 │ value8 │',
    ]);
  });
});
