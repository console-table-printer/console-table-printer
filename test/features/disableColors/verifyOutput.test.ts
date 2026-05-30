import { Table } from '../../../index';

describe('Disable Colors Tests: Output Verification', () => {
  it('should replace the internal color map with an empty map', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    expect(table.table.colorMap).toEqual({});
  });
});
