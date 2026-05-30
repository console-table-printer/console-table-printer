import { Table } from '../../../index';
import { getAnsiColorCodes } from '../../testUtils/getRawData';

describe('Disable Colors Tests: Basic', () => {
  it('should render plain text when colors are disabled', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'status', color: 'green' }],
    });

    table.addRow({ status: 'Ready' }, { color: 'red' });

    expect(getAnsiColorCodes(table.render())).toEqual([]);
  });
});
