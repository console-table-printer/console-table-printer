import { Table } from '../../../index';

describe('Row Separator Tests: Basic', () => {
  it('should render row separator borders when enabled', () => {
    const table = new Table({
      shouldDisableColors: true,
      rowSeparator: true,
    });

    table.addRows([
      { step: 'Setup', owner: 'Ana' },
      { step: 'Build', owner: 'Ben' },
    ]);

    expect(table.render()).toContain('├───────┼───────┤');
  });
});
