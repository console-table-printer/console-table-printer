import { Table } from '../../../index';

describe('Border Style Tests: Basic', () => {
  it('should render a table with custom vertical borders', () => {
    const table = new Table({
      shouldDisableColors: true,
      style: {
        headerTop: { left: '+', mid: '+', right: '+', other: '-' },
        headerBottom: { left: '+', mid: '+', right: '+', other: '-' },
        tableBottom: { left: '+', mid: '+', right: '+', other: '-' },
        vertical: '|',
      },
    });

    table.addRow({ item: 'Build', status: 'Ready' });

    expect(table.render()).toContain('|  item | status |');
  });
});
