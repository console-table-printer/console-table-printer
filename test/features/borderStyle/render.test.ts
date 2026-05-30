import { Table } from '../../../index';

describe('Border Style Tests: Rendering', () => {
  it('should render an ASCII border style', () => {
    const table = new Table({
      shouldDisableColors: true,
      style: {
        headerTop: {
          left: '+',
          mid: '+',
          right: '+',
          other: '-',
        },
        headerBottom: {
          left: '+',
          mid: '+',
          right: '+',
          other: '-',
        },
        tableBottom: {
          left: '+',
          mid: '+',
          right: '+',
          other: '-',
        },
        vertical: '|',
      },
      columns: [{ name: 'item' }, { name: 'status' }],
    });

    table.addRow({ item: 'Build', status: 'Ready' });

    expect(table.render().split('\n')).toEqual([
      '+-------+--------+',
      '|  item | status |',
      '+-------+--------+',
      '| Build |  Ready |',
      '+-------+--------+',
    ]);
  });
});
