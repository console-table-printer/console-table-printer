import { Table } from '../../../index';

describe('Border Style Tests: Output Verification', () => {
  it('should keep custom border style on the internal table', () => {
    const table = new Table({
      style: {
        headerTop: { left: '+', mid: '+', right: '+', other: '-' },
        headerBottom: { left: '+', mid: '+', right: '+', other: '-' },
        tableBottom: { left: '+', mid: '+', right: '+', other: '-' },
        vertical: '|',
      },
    });

    expect(table.table.tableStyle.vertical).toBe('|');
    expect(table.table.tableStyle.headerTop.left).toBe('+');
  });
});
