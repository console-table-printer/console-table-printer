import { Table } from '../../../index';

describe('Table Construction Tests: Output Verification', () => {
  it('should create row state from constructor rows', () => {
    const table = new Table({
      shouldDisableColors: true,
      rows: [{ ticket: 'BUG-1', owner: 'Ana' }],
    });

    expect(table.table.rows).toHaveLength(1);
    expect(table.table.rows[0].text).toEqual({
      ticket: 'BUG-1',
      owner: 'Ana',
    });
  });
});
