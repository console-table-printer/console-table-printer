import { Table } from '../../../index';

describe('Column Visibility Tests: Basic', () => {
  it('should render enabled columns and hide non-enabled columns', () => {
    const table = new Table({
      shouldDisableColors: true,
      enabledColumns: ['account', 'status'],
    });

    table.addRow({
      account: 'Acme',
      status: 'active',
      internalNote: 'hidden',
    });

    const rendered = table.render();

    expect(rendered).toContain('account');
    expect(rendered).toContain('status');
    expect(rendered).not.toContain('internalNote');
    expect(rendered).not.toContain('hidden');
  });
});
