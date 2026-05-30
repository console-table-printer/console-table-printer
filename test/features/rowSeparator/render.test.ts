import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Row Separator Tests: Rendering', () => {
  it('should render separators between rows when enabled on the table', () => {
    const table = new Table({
      shouldDisableColors: true,
      rowSeparator: true,
      columns: [{ name: 'step' }, { name: 'owner' }],
    });

    table.addRows([
      { step: 'Setup', owner: 'Ana' },
      { step: 'Build', owner: 'Ben' },
    ]);

    expect(getTableHeader(table)).toEqual('│  step │ owner │');
    expect(getTableBody(table)).toEqual([
      '│ Setup │   Ana │',
      '├───────┼───────┤',
      '│ Build │   Ben │',
    ]);
  });

  it('should render a separator only after rows that request it', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'step' }, { name: 'owner' }],
    });

    table.addRow({ step: 'Setup', owner: 'Ana' }, { separator: true });
    table.addRow({ step: 'Build', owner: 'Ben' });
    table.addRow({ step: 'Deploy', owner: 'Cara' }, { separator: true });

    expect(getTableBody(table)).toEqual([
      '│  Setup │   Ana │',
      '├────────┼───────┤',
      '│  Build │   Ben │',
      '│ Deploy │  Cara │',
    ]);
  });

  it('should keep row separators attached to rows after sorting', () => {
    const table = new Table({
      shouldDisableColors: true,
      rowSeparator: true,
      columns: [{ name: 'stepOrder' }, { name: 'step' }],
      sort: (row1, row2) => row1.stepOrder - row2.stepOrder,
    });

    table.addRow({ stepOrder: 3, step: 'Deploy' }, { separator: false });
    table.addRow({ stepOrder: 1, step: 'Setup' });
    table.addRow({ stepOrder: 2, step: 'Build' }, { separator: false });

    expect(getTableBody(table)).toEqual([
      '│         1 │  Setup │',
      '├───────────┼────────┤',
      '│         2 │  Build │',
      '│         3 │ Deploy │',
    ]);
  });
});
