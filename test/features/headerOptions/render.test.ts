import { Table } from '../../../index';

describe('Header Options Tests: Rendering', () => {
  it('should render a table without the header row when headers are hidden', () => {
    const table = new Table({
      shouldDisableColors: true,
      defaultColumnOptions: {
        header: { visible: false },
      },
    });

    table.addRows([
      { name: 'Alice', status: 'Active', score: 95 },
      { name: 'Bob', status: 'Paused', score: 82 },
    ]);

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌───────┬────────┬────┐',
      '│ Alice │ Active │ 95 │',
      '│   Bob │ Paused │ 82 │',
      '└───────┴────────┴────┘',
    ]);
  });

  it('should render the header below the body when requested', () => {
    const table = new Table({
      shouldDisableColors: true,
      defaultColumnOptions: {
        header: { position: 'bottom' },
      },
    });

    table.addRows([
      { name: 'Alice', status: 'Active', score: 95 },
      { name: 'Bob', status: 'Paused', score: 82 },
    ]);

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌───────┬────────┬───────┐',
      '│ Alice │ Active │    95 │',
      '│   Bob │ Paused │    82 │',
      '├───────┼────────┼───────┤',
      '│  name │ status │ score │',
      '└───────┴────────┴───────┘',
    ]);
  });

  it('should render the header above and below the body when requested', () => {
    const table = new Table({
      shouldDisableColors: true,
      defaultColumnOptions: {
        header: { position: 'both' },
      },
    });

    table.addRows([
      { name: 'Alice', status: 'Active', score: 95 },
      { name: 'Bob', status: 'Paused', score: 82 },
    ]);

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌───────┬────────┬───────┐',
      '│  name │ status │ score │',
      '├───────┼────────┼───────┤',
      '│ Alice │ Active │    95 │',
      '│   Bob │ Paused │    82 │',
      '├───────┼────────┼───────┤',
      '│  name │ status │ score │',
      '└───────┴────────┴───────┘',
    ]);
  });
});
