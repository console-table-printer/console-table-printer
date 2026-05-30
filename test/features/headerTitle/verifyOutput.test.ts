import { Table } from '../../../index';

describe('Header Title Tests: Output Verification', () => {
  it('should keep configured titles on internal columns', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'employeeId', title: 'ID' },
        { name: 'status', title: 'Current Status' },
      ],
    });

    expect(table.table.columns.map((column) => column.title)).toEqual([
      'ID',
      'Current Status',
    ]);
  });
});
