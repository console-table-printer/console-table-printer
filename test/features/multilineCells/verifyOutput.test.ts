import { Table } from '../../../index';
import { getTableBody } from '../../testUtils/getRawData';

describe('Multiline Cell Tests: Output Verification', () => {
  it('should pad cells that have fewer rendered lines than their neighbors', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({
      summary: 'Fix login',
      notes: 'first line\nsecond line',
    });

    const body = getTableBody(table);

    expect(body[body.length - 1]).toEqual('│           │  line │');
  });
});
