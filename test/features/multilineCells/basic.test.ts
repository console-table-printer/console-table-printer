import { Table } from '../../../index';

describe('Multiline Cell Tests: Basic', () => {
  it('should render newline content on multiple table lines', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({
      summary: 'Fix login',
      notes: 'first line\nsecond line',
    });

    expect(table.render()).toContain('second');
  });
});
