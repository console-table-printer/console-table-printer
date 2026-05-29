import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Testing clearRows output verification', () => {
  it('should preserve columns when rows are cleared', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'id' },
        { name: 'status', alignment: 'left' },
        { name: 'count' },
      ],
    });

    p.addRows([
      { id: 1, status: 'Queued', count: 5 },
      { id: 2, status: 'Running', count: 10 },
    ]);

    p.clearRows();

    expect(p.table.rows).toEqual([]);
    expect(p.table.columns.map((column) => column.name)).toEqual([
      'id',
      'status',
      'count',
    ]);
    expect(getTableHeader(p)).toEqual('│ id │ status │ count │');
    expect(getTableBody(p)).toEqual([]);
  });

  it('should not render cleared row values after new rows are added', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'task' }, { name: 'state' }],
    });

    p.addRows([
      { task: 'old task', state: 'stale' },
      { task: 'older task', state: 'stale' },
    ]);

    p.clearRows().addRows([{ task: 'new task', state: 'fresh' }]);

    const rendered = p.render();
    expect(rendered).toContain('new task');
    expect(rendered).toContain('fresh');
    expect(rendered).not.toContain('old task');
    expect(rendered).not.toContain('older task');
    expect(rendered).not.toContain('stale');
  });
});
