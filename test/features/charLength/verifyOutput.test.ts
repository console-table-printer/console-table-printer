import { Table } from '../../../index';

describe('Character Length Tests: Output Verification', () => {
  it('should keep custom character widths on the internal table', () => {
    const table = new Table({
      charLength: {
        '🎯': 2,
        '🌍': 3,
      },
    });

    expect(table.table.charLength).toEqual({
      '🎯': 2,
      '🌍': 3,
    });
  });
});
