import { Table } from '../../../index';

describe('Header Options Tests: Output Verification', () => {
  it('should not size hidden-header columns from their title text', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'veryLongHeaderName' }],
      defaultColumnOptions: {
        header: { visible: false },
      },
    });

    table.addRow({ veryLongHeaderName: 'OK' });

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌────┐',
      '│ OK │',
      '└────┘',
    ]);
  });

  it('should allow a column to hide its own header text without sizing from it', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'name', title: 'User' },
        { name: 'score', title: 'Score', header: { visible: false } },
      ],
    });

    table.addRow({ name: 'Alice', score: 95 });

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌───────┬────┐',
      '│  User │    │',
      '├───────┼────┤',
      '│ Alice │ 95 │',
      '└───────┴────┘',
    ]);
  });

  it('should render more than three columns with mixed hidden header cells', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'name', title: 'User' },
        { name: 'region', title: 'Region' },
        { name: 'secret', title: 'Secret', header: { visible: false } },
        { name: 'status', title: 'State' },
        { name: 'score', title: 'Score', header: { visible: false } },
      ],
    });

    table.addRow({
      name: 'Alice',
      region: 'EU',
      secret: 'x1',
      status: 'Active',
      score: 95,
    });

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      '┌───────┬────────┬────┬────────┬────┐',
      '│  User │ Region │    │  State │    │',
      '├───────┼────────┼────┼────────┼────┤',
      '│ Alice │     EU │ x1 │ Active │ 95 │',
      '└───────┴────────┴────┴────────┴────┘',
    ]);
  });

  it('should keep table title while a hidden long header title is gone', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Sprint Tasks',
      columns: [
        {
          name: 'id',
          title: 'IdentifierThatShouldDisappear',
          header: { visible: false },
        },
        { name: 'task', title: 'Task' },
      ],
    });

    table.addRow({ id: 1, task: 'Build' });

    table.printTable();
    expect(table.render().split('\n')).toEqual([
      'Sprint Tasks ',
      '┌───┬───────┐',
      '│   │  Task │',
      '├───┼───────┤',
      '│ 1 │ Build │',
      '└───┴───────┘',
    ]);
  });
});
