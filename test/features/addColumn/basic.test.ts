import { Table } from '../../../index';

describe('Testing adding columns', () => {
  it('should allow add new columns in a chain way', () => {
    const p = new Table()
      .addColumn('taskId')
      .addColumns(['taskOwner'])
      .addRow({ taskId: 'TASK-1' })
      .addRows([{ taskOwner: 'Ops' }]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding a single column', () => {
    const p = new Table().addColumn('ticketStatus');
    p.addRow({ ticketStatus: 'Ready' });
    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding multiple columns', () => {
    const p = new Table().addColumns(['taskName', 'priority']);
    p.addRow({ taskName: 'Deploy', priority: 'High' });
    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding columns with different alignments', () => {
    const p = new Table()
      .addColumn({ name: 'leftAligned', alignment: 'left' })
      .addColumn({ name: 'rightAligned', alignment: 'right' });
    p.addRow({ leftAligned: 'left', rightAligned: 'right' });
    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding columns with colors', () => {
    const p = new Table().addColumn({ name: 'coloredColumn', color: 'red' });
    p.addRow({ coloredColumn: 'redValue' });
    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding a complex column object with chaining', () => {
    const p = new Table()
      .addColumn({
        name: 'reviewState',
        alignment: 'center',
        color: 'blue',
        title: 'Review State',
      })
      .addColumn('reviewOwner')
      .addRow({ reviewState: 'Approved', reviewOwner: 'Dana' });
    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });
});
