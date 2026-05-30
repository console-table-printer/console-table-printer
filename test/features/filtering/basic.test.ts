import { Table } from '../../../index';

describe('Filtering Tests: Basic', () => {
  it('should render matching rows and hide filtered rows', () => {
    const table = new Table({
      shouldDisableColors: true,
      filter: (row) => row.active === true,
    });

    table.addRows([
      { assignee: 'Ana', active: true },
      { assignee: 'Ben', active: false },
    ]);

    const rendered = table.render();

    expect(rendered).toContain('Ana');
    expect(rendered).not.toContain('Ben');
  });
});
