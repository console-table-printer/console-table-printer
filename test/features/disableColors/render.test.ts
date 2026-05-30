import { Table } from '../../../index';

describe('Disable Colors Tests: Rendering', () => {
  it('should remove ANSI color codes while preserving rendered spacing', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'status', color: 'green' }],
    });

    table.addRow({ status: 'Ready' }, { color: 'red' });

    expect(table.render().split('\n')).toEqual([
      '┌────────┐',
      '│ status │',
      '├────────┤',
      '│  Ready │',
      '└────────┘',
    ]);
    expect(table.render()).not.toMatch(/\x1b\[[0-9;]*m/);
  });

  it('should keep ANSI color codes when colors are enabled', () => {
    const table = new Table({
      columns: [{ name: 'status', color: 'green' }],
    });

    table.addRow({ status: 'Ready' }, { color: 'red' });

    expect(table.render().split('\n')).toEqual([
      '┌────────┐',
      '│\x1b[37m \x1b[0m\x1b[01mstatus\x1b[0m │',
      '├────────┤',
      '│\x1b[37m \x1b[0m\x1b[32m Ready\x1b[0m │',
      '└────────┘',
    ]);
  });
});
