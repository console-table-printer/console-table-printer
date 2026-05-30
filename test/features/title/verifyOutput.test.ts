import { Table } from '../../../index';

describe('Title Tests: Output Verification', () => {
  it('should keep the configured title on the internal table', () => {
    const table = new Table({
      shouldDisableColors: true,
      title: 'Ticket Report',
    });

    expect(table.table.title).toBe('Ticket Report');
  });
});
