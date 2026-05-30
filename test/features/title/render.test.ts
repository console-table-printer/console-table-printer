import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Title Tests: Rendering', () => {
  it('should render a centered title above the table', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Report',
      columns: [{ name: 'ticket' }, { name: 'owner' }],
    });

    table.addRow({ ticket: 'BUG-1', owner: 'Ana' });

    const renderedLines = table.render().split('\n');

    expect(renderedLines[0]).toEqual('      Report      ');
    expect(getTableHeader(table)).toEqual('│ ticket │ owner │');
    expect(getTableBody(table)).toEqual(['│  BUG-1 │   Ana │']);
  });

  it('should wrap a long title to the table width', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Very Long Report Title',
      columns: [{ name: 'ticket' }, { name: 'owner' }],
    });

    table.addRow({ ticket: 'BUG-1', owner: 'Ana' });

    const renderedLines = table.render().split('\n');

    expect(renderedLines.slice(0, 2)).toEqual([
      ' Very Long Report ',
      '      Title       ',
    ]);
    expect(getTableHeader(table)).toEqual('│ ticket │ owner │');
  });

  it('should size the title using the rendered table width', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Inventory',
      columns: [{ name: 'sku' }, { name: 'qty' }],
    });

    table.addRows([
      { sku: 'A-1', qty: 2 },
      { sku: 'B-22', qty: 15 },
    ]);

    const renderedLines = table.render().split('\n');

    expect(renderedLines[0]).toEqual('  Inventory   ');
    expect(getTableHeader(table)).toEqual('│  sku │ qty │');
    expect(getTableBody(table)).toEqual(['│  A-1 │   2 │', '│ B-22 │  15 │']);
  });
});
