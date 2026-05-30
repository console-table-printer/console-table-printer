import { Table } from '../../../index';

describe('Table Construction Tests: Basic', () => {
  it('should construct a table from columns and rows together', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'ticket' }, { name: 'owner' }],
      rows: [{ ticket: 'BUG-1', owner: 'Ana' }],
    });

    const rendered = table.render();

    expect(rendered).toContain('ticket');
    expect(rendered).toContain('BUG-1');
  });
});
