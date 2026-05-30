import { Table } from '../../../index';

describe('Unicode Tests: Basic', () => {
  it('should render mixed-language text', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRow({
      language: 'Japanese',
      greeting: 'こんにちは世界',
    });

    expect(table.render()).toContain('こんにちは世界');
  });
});
