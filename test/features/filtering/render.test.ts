import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Filtering Tests: Rendering', () => {
  it('should render only rows accepted by the filter', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'assignee' }, { name: 'active' }, { name: 'score' }],
      filter: (row) => row.active === true,
    });

    table.addRows([
      { assignee: 'Ana', active: true, score: 30 },
      { assignee: 'Ben', active: false, score: 20 },
      { assignee: 'Cara', active: true, score: 40 },
    ]);

    expect(getTableHeader(table)).toEqual('│ assignee │ active │ score │');
    expect(getTableBody(table)).toEqual([
      '│      Ana │   true │    30 │',
      '│     Cara │   true │    40 │',
    ]);
  });

  it('should preserve the source order of matching rows', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'ticket' }, { name: 'priority' }],
      filter: (row) => row.priority >= 2,
    });

    table.addRows([
      { ticket: 'ISSUE-3', priority: 3 },
      { ticket: 'ISSUE-1', priority: 1 },
      { ticket: 'ISSUE-2', priority: 2 },
      { ticket: 'ISSUE-4', priority: 4 },
    ]);

    expect(getTableBody(table)).toEqual([
      '│ ISSUE-3 │        3 │',
      '│ ISSUE-2 │        2 │',
      '│ ISSUE-4 │        4 │',
    ]);
  });

  it('should render an empty body when no rows match the filter', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'assignee' }, { name: 'score' }],
      filter: (row) => row.score > 100,
    });

    table.addRows([
      { assignee: 'Ana', score: 30 },
      { assignee: 'Ben', score: 20 },
    ]);

    expect(getTableHeader(table)).toEqual('│ assignee │ score │');
    expect(getTableBody(table)).toEqual([]);
  });
});
