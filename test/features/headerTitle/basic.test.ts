import { Table } from '../../../index';

describe('Header Title Tests: Basic', () => {
  it('should render display titles instead of internal column names', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'fullName', title: 'Full Name' }],
    });

    table.addRow({ fullName: 'Ana Bell' });

    const rendered = table.render();

    expect(rendered).toContain('Full Name');
    expect(rendered).not.toContain('fullName');
  });
});
