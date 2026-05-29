import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Clear Rows Tests: Rendering', () => {
  it('should clear existing rows and render replacement rows', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'id' }, { name: 'status' }],
    });

    p.addRows([
      { id: 1, status: 'Queued' },
      { id: 2, status: 'Running' },
    ]);

    p.clearRows();
    p.addRow({ id: 3, status: 'Done' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ id │ status │');
    expect(renderedBody).toEqual(['│  3 │   Done │']);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render an empty table after rows are cleared', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'name' }, { name: 'score' }],
    });

    p.addRows([
      { name: 'Alice', score: 10 },
      { name: 'Bob', score: 20 },
    ]);

    p.clearRows();

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ name │ score │');
    expect(renderedBody).toEqual([]);

    expect(p.render()).toMatchSnapshot();
  });
});
