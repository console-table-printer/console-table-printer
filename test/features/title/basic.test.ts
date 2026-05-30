import { Table } from '../../../index';

describe('Title Tests: Basic', () => {
  it('should render the title before the table borders', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Ticket Report',
    });

    table.addRow({ ticket: 'BUG-1', owner: 'Ana' });

    expect(table.render().split('\n')[0]).toContain('Ticket Report');
  });
});
