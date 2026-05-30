import { Table } from '../../../index';

describe('Character Length Tests: Basic', () => {
  it('should render emoji content with configured character widths', () => {
    const table = new Table({
      shouldDisableColors: true,
      charLength: {
        '🎯': 2,
      },
    });

    table.addRow({ task: '🎯 Target' });

    expect(table.render()).toContain('🎯 Target');
  });
});
