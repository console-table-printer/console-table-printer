import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Add Column Tests: Rendering', () => {
  it('should make sure each column is what its expected to be', () => {
    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({
        name: 'reviewState',
        alignment: 'center',
        color: 'blue',
        title: 'Review State',
      })
      .addColumn('reviewOwner')
      .addRow({ reviewState: 'Approved', reviewOwner: 'Dana' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ Review State │ reviewOwner │');
    expect(renderedBody).toEqual(['│   Approved   │        Dana │']);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify that addColumn preserves existing data', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    // Add initial columns and data
    p.addColumns(['task', 'owner']).addRows([
      { task: 'Docs', owner: 'Ana' },
      { task: 'API', owner: 'Ben' },
    ]);

    // Add a new column
    p.addColumn('status');
    p.addRows([{ task: 'Release', owner: 'Cam', status: 'Done' }]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│    task │ owner │ status │');
    expect(renderedBody).toEqual([
      '│    Docs │   Ana │        │',
      '│     API │   Ben │        │',
      '│ Release │   Cam │   Done │',
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify addColumn with custom properties', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    p.addColumns(['task']).addRows([{ task: 'Prepare' }]);

    // Add a column with alignment and title
    p.addColumn({
      name: 'durationMinutes',
      alignment: 'right',
      title: 'Duration',
    });
    p.addRows([{ task: 'Build', durationMinutes: '45' }]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│    task │ Duration │');
    expect(renderedBody).toEqual([
      '│ Prepare │          │',
      '│   Build │       45 │',
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });
});
