import { Table } from '../../../index';

describe('Filtering Tests: Output Verification', () => {
  it('should replace internal rows with filtered rows after render', () => {
    const table = new Table({
      shouldDisableColors: true,
      filter: (row) => row.priority >= 2,
    });

    table.addRows([
      { ticket: 'ISSUE-3', priority: 3 },
      { ticket: 'ISSUE-1', priority: 1 },
      { ticket: 'ISSUE-2', priority: 2 },
    ]);

    table.render();

    expect(table.table.rows.map((row) => row.text.ticket)).toEqual([
      'ISSUE-3',
      'ISSUE-2',
    ]);
  });
});
