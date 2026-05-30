import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Multiline Cell Tests: Rendering', () => {
  it('should render newline-delimited content across multiple table lines', () => {
    const table = new Table({
      shouldDisableColors: true,
    })
      .addColumn('summary')
      .addColumn('notes');

    table.addRow({
      summary: 'Fix login',
      notes: 'first line\nsecond line',
    });

    expect(getTableHeader(table)).toEqual('│   summary │ notes │');
    expect(getTableBody(table)).toEqual([
      '│ Fix login │ first │',
      '│           │  line │',
      '│           │ second │',
      '│           │  line │',
    ]);
  });

  it('should pad shorter multiline cells while longer cells continue rendering', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'leftNote', alignment: 'left' },
        { name: 'rightNote', alignment: 'right' },
      ],
    });

    table.addRow({
      leftNote: 'Start\nMiddle\nEnd',
      rightNote: 'One\nTwo',
    });

    expect(getTableHeader(table)).toEqual('│ leftNote │ rightNote │');
    expect(getTableBody(table)).toEqual([
      '│ Start    │       One │',
      '│ Middle   │       Two │',
      '│ End      │           │',
    ]);
  });
});
