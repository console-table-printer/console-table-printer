import { Table } from '../../../index';

describe('Sorting Tests: Basic', () => {
  it('should sort tasks by priority before rendering', () => {
    const table = new Table({
      shouldDisableColors: true,
      sort: (row1, row2) => row1.priority - row2.priority,
    });

    table.addRows([
      { task: 'write docs', priority: 3 },
      { task: 'fix bug', priority: 1 },
      { task: 'ship release', priority: 2 },
    ]);

    const rendered = table.render();

    expect(rendered.indexOf('fix bug')).toBeLessThan(
      rendered.indexOf('ship release')
    );
    expect(rendered.indexOf('ship release')).toBeLessThan(
      rendered.indexOf('write docs')
    );
  });
});
