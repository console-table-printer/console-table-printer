import { Table } from '../../../index';

describe('Row Color Tests: Output Verification', () => {
  it('should store row colors on internal rows', () => {
    const table = new Table();

    table.addRow({ owner: 'Ana', status: 'Ready' }, { color: 'green' });
    table.addRow({ owner: 'Ben', status: 'Blocked' }, { color: 'red' });

    expect(table.table.rows.map((row) => row.color)).toEqual(['green', 'red']);
  });
});
