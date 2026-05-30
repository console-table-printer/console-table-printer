import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Sorting Tests: Rendering', () => {
  it('should render rows sorted by a numeric column in ascending order', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'rank' }, { name: 'player' }, { name: 'score' }],
      sort: (row1, row2) => row1.rank - row2.rank,
    });

    table.addRows([
      { rank: 3, player: 'Cara', score: 10 },
      { rank: 1, player: 'Ana', score: 30 },
      { rank: 2, player: 'Ben', score: 20 },
    ]);

    expect(getTableHeader(table)).toEqual('│ rank │ player │ score │');
    expect(getTableBody(table)).toEqual([
      '│    1 │    Ana │    30 │',
      '│    2 │    Ben │    20 │',
      '│    3 │   Cara │    10 │',
    ]);
  });

  it('should render rows sorted by a numeric column in descending order', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'player' }, { name: 'score' }],
      sort: (row1, row2) => row2.score - row1.score,
    });

    table.addRows([
      { player: 'Ana', score: 30 },
      { player: 'Ben', score: 20 },
      { player: 'Cara', score: 40 },
    ]);

    expect(getTableBody(table)).toEqual([
      '│   Cara │    40 │',
      '│    Ana │    30 │',
      '│    Ben │    20 │',
    ]);
  });

  it('should keep the same sorted output across repeated renders', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'task' }, { name: 'priority' }],
      sort: (row1, row2) => row1.priority - row2.priority,
    });

    table.addRows([
      { task: 'docs', priority: 3 },
      { task: 'tests', priority: 1 },
      { task: 'release', priority: 2 },
    ]);

    const firstRenderRows = getTableBody(table);
    const secondRenderRows = getTableBody(table);

    expect(firstRenderRows).toEqual([
      '│   tests │        1 │',
      '│ release │        2 │',
      '│    docs │        3 │',
    ]);
    expect(secondRenderRows).toEqual(firstRenderRows);
  });
});
