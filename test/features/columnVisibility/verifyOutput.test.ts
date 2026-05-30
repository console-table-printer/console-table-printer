import { Table } from '../../../index';

describe('Column Visibility Tests: Output Verification', () => {
  it('should remove disabled columns from internal render columns', () => {
    const table = new Table({
      shouldDisableColors: true,
      disabledColumns: ['internalNote'],
    });

    table.addRow({
      account: 'Acme',
      owner: 'Ana',
      internalNote: 'hidden',
    });

    table.render();

    expect(table.table.columns.map((column) => column.name)).toEqual([
      'account',
      'owner',
    ]);
  });
});
