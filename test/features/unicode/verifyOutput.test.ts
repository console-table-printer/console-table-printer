import { Table } from '../../../index';
import { getTableBody } from '../../testUtils/getRawData';

describe('Unicode Tests: Output Verification', () => {
  it('should keep wide Chinese text aligned in the rendered row', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({
      description: 'Description 这里是中文',
      ticket: 'ISSUE-1',
    });

    expect(getTableBody(table)).toEqual([
      '│ Description 这里是中文 │ ISSUE-1 │',
    ]);
  });
});
