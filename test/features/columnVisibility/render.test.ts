import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Column Visibility Tests: Rendering', () => {
  it('should render only enabled columns', () => {
    const table = new Table({
      shouldDisableColors: true,
      enabledColumns: ['account', 'status'],
    });

    table.addRows([
      {
        account: 'Acme',
        status: 'active',
        internalNote: 'hidden',
        owner: 'Ana',
      },
      {
        account: 'Beta',
        status: 'paused',
        internalNote: 'hidden',
        owner: 'Ben',
      },
    ]);

    expect(getTableHeader(table)).toEqual('│ account │ status │');
    expect(getTableBody(table)).toEqual([
      '│    Acme │ active │',
      '│    Beta │ paused │',
    ]);
    expect(table.render()).not.toContain('internalNote');
    expect(table.render()).not.toContain('owner');
  });

  it('should render all columns except disabled columns', () => {
    const table = new Table({
      shouldDisableColors: true,
      disabledColumns: ['internalNote'],
      columns: [
        { name: 'account' },
        { name: 'owner' },
        { name: 'internalNote' },
        { name: 'status' },
      ],
    });

    table.addRow({
      account: 'Acme',
      owner: 'Ana',
      internalNote: 'hidden',
      status: 'active',
    });

    expect(getTableHeader(table)).toEqual('│ account │ owner │ status │');
    expect(getTableBody(table)).toEqual(['│    Acme │   Ana │ active │']);
    expect(table.render()).not.toContain('hidden');
  });

  it('should keep disabled columns hidden when enabled columns are also set', () => {
    const table = new Table({
      shouldDisableColors: true,
      enabledColumns: ['account', 'owner', 'status'],
      disabledColumns: ['status'],
    });

    table.addRow({
      account: 'Acme',
      owner: 'Ana',
      internalNote: 'hidden',
      status: 'active',
    });

    expect(getTableHeader(table)).toEqual('│ account │ owner │');
    expect(getTableBody(table)).toEqual(['│    Acme │   Ana │']);
    expect(table.render()).not.toContain('status');
    expect(table.render()).not.toContain('active');
    expect(table.render()).not.toContain('internalNote');
  });
});
