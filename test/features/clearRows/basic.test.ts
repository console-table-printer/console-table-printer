import { Table } from '../../../index';

describe('Testing clearRows', () => {
  it('should allow clearing rows in a chain way', () => {
    const p = new Table(['id', 'status'])
      .addRows([
        { id: 1, status: 'Queued' },
        { id: 2, status: 'Running' },
      ])
      .clearRows()
      .addRows([{ id: 3, status: 'Done' }]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should clear rows added during table creation', () => {
    const p = new Table({
      columns: [{ name: 'task' }, { name: 'state' }],
      rows: [
        { task: 'fetch', state: 'pending' },
        { task: 'build', state: 'running' },
      ],
    });

    p.clearRows().addRow({ task: 'deploy', state: 'done' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });
});
