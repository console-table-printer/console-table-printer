import { Table } from '../../../index';
import { getTableBody } from '../../testUtils/getRawData';

describe('Row Separator Tests: Output Verification', () => {
  it('should not render a separator after the last row', () => {
    const table = new Table({
      shouldDisableColors: true,
      rowSeparator: true,
    });

    table.addRows([
      { step: 'Setup', owner: 'Ana' },
      { step: 'Build', owner: 'Ben' },
    ]);

    const body = getTableBody(table);

    expect(body[body.length - 1]).toEqual('│ Build │   Ben │');
  });
});
