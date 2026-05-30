import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Table Construction Tests: Rendering', () => {
  it('should render rows passed during table construction', () => {
    const table = new Table({
      shouldDisableColors: true,
      rows: [{ ticket: 'BUG-1', owner: 'Ana' }],
    });

    expect(getTableHeader(table)).toEqual('│ ticket │ owner │');
    expect(getTableBody(table)).toEqual(['│  BUG-1 │   Ana │']);
  });

  it('should infer columns from row keys when columns are not configured', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({ ticket: 'BUG-1', owner: 'Ana' });

    expect(getTableHeader(table)).toEqual('│ ticket │ owner │');
    expect(getTableBody(table)).toEqual(['│  BUG-1 │   Ana │']);
  });

  it('should render mixed cell values with empty null and undefined cells', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({
      count: 7,
      ready: true,
      missing: null,
      skipped: undefined,
    });

    expect(getTableHeader(table)).toEqual(
      '│ count │ ready │ missing │ skipped │'
    );
    expect(getTableBody(table)).toEqual([
      '│     7 │  true │         │         │',
    ]);
  });
});
