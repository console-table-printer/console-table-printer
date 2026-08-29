import { Table } from '../../../index';

describe('Header Options Tests: Basic', () => {
  it('should hide headers through default column options', () => {
    const table = new Table({
      shouldDisableColors: true,
      defaultColumnOptions: {
        header: { visible: false },
      },
    });

    table.addRow({ name: 'Alice', status: 'Active' });

    table.printTable();
    expect(table.render()).not.toContain('name');
    expect(table.render()).toContain('Alice');
  });

  it('should render headers at the bottom', () => {
    const table = new Table({
      shouldDisableColors: true,
      defaultColumnOptions: {
        header: { position: 'bottom' },
      },
    });

    table.addRow({ name: 'Alice', status: 'Active' });

    table.printTable();
    const renderedLines = table.render().split('\n');
    expect(renderedLines[renderedLines.length - 1]).toBe('└───────┴────────┘');
    expect(renderedLines[renderedLines.length - 2]).toBe('│  name │ status │');
  });
});
