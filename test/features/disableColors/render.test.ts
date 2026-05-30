import { Table } from '../../../index';
import {
  ANSI_COLOR_CODES,
  getAnsiColorCodes,
  stripAnsiColorCodes,
} from '../../testUtils/getRawData';

describe('Disable Colors Tests: Rendering', () => {
  it('should remove ANSI color codes while preserving rendered spacing', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'status', color: 'green' }],
    });

    table.addRow({ status: 'Ready' }, { color: 'red' });

    const rendered = table.render();

    expect(rendered.split('\n')).toEqual([
      '┌────────┐',
      '│ status │',
      '├────────┤',
      '│  Ready │',
      '└────────┘',
    ]);
    expect(getAnsiColorCodes(rendered)).toEqual([]);
  });

  it('should keep ANSI color codes when colors are enabled', () => {
    const table = new Table({
      columns: [{ name: 'status', color: 'green' }],
    });

    table.addRow({ status: 'Ready' }, { color: 'red' });

    const rendered = table.render();

    expect(stripAnsiColorCodes(rendered).split('\n')).toEqual([
      '┌────────┐',
      '│ status │',
      '├────────┤',
      '│  Ready │',
      '└────────┘',
    ]);
    expect(getAnsiColorCodes(rendered)).toEqual(
      expect.arrayContaining([
        ANSI_COLOR_CODES.white_bold,
        ANSI_COLOR_CODES.green,
        ANSI_COLOR_CODES.reset,
      ])
    );
  });
});
