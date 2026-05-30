import { Table } from '../../../index';
import {
  ANSI_COLOR_CODES,
  getAnsiColorCodes,
} from '../../testUtils/getRawData';

describe('Row Color Tests: Basic', () => {
  it('should render row color codes for colored rows', () => {
    const table = new Table().addColumn('owner').addColumn('status');

    table.addRow({ owner: 'Ana', status: 'Ready' }, { color: 'green' });

    expect(getAnsiColorCodes(table.render())).toContain(ANSI_COLOR_CODES.green);
  });
});
