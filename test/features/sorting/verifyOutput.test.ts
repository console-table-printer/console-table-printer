import { Table } from '../../../index';

describe('Sorting Tests: Output Verification', () => {
  it('should replace internal rows with sorted rows after render', () => {
    const table = new Table({
      shouldDisableColors: true,
      sort: (row1, row2) => row2.score - row1.score,
    });

    table.addRows([
      { player: 'Ana', score: 30 },
      { player: 'Ben', score: 20 },
      { player: 'Cara', score: 40 },
    ]);

    table.render();

    expect(table.table.rows.map((row) => row.text.player)).toEqual([
      'Cara',
      'Ana',
      'Ben',
    ]);
  });
});
