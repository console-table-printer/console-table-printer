import { Table } from '../../../index';
import {
  ANSI_COLOR_CODES,
  getAnsiColorCodes,
  stripAnsiColorCodes,
} from '../../testUtils/getRawData';

describe('Row Color Tests: Rendering', () => {
  it('should apply row colors to every cell in the row', () => {
    const table = new Table().addColumn('owner').addColumn('status');

    table.addRow({ owner: 'Ana', status: 'Ready' }, { color: 'green' });
    table.addRow({ owner: 'Ben', status: 'Blocked' }, { color: 'red' });

    const rendered = table.render();

    expect(stripAnsiColorCodes(rendered).split('\n')).toEqual([
      '┌───────┬─────────┐',
      '│ owner │  status │',
      '├───────┼─────────┤',
      '│   Ana │   Ready │',
      '│   Ben │ Blocked │',
      '└───────┴─────────┘',
    ]);
    expect(getAnsiColorCodes(rendered)).toEqual(
      expect.arrayContaining([
        ANSI_COLOR_CODES.white_bold,
        ANSI_COLOR_CODES.green,
        ANSI_COLOR_CODES.red,
        ANSI_COLOR_CODES.reset,
      ])
    );
  });

  it('should apply the same row color to rows added in a batch', () => {
    const table = new Table().addColumn('owner').addColumn('status');

    table.addRows(
      [
        { owner: 'Ana', status: 'Ready' },
        { owner: 'Ben', status: 'Ready' },
      ],
      { color: 'green' }
    );

    const rendered = table.render();

    expect(stripAnsiColorCodes(rendered).split('\n')).toEqual([
      '┌───────┬────────┐',
      '│ owner │ status │',
      '├───────┼────────┤',
      '│   Ana │  Ready │',
      '│   Ben │  Ready │',
      '└───────┴────────┘',
    ]);
    expect(getAnsiColorCodes(rendered)).toEqual(
      expect.arrayContaining([
        ANSI_COLOR_CODES.white_bold,
        ANSI_COLOR_CODES.green,
        ANSI_COLOR_CODES.reset,
      ])
    );
  });

  it('should let column color override row color for that column', () => {
    const table = new Table({
      columns: [{ name: 'status', color: 'blue' }, { name: 'owner' }],
    });

    table.addRow({ owner: 'Ana', status: 'Column wins' }, { color: 'red' });

    const rendered = table.render();

    expect(stripAnsiColorCodes(rendered).split('\n')).toEqual([
      '┌─────────────┬───────┐',
      '│      status │ owner │',
      '├─────────────┼───────┤',
      '│ Column wins │   Ana │',
      '└─────────────┴───────┘',
    ]);
    expect(getAnsiColorCodes(rendered)).toEqual(
      expect.arrayContaining([
        ANSI_COLOR_CODES.blue,
        ANSI_COLOR_CODES.red,
        ANSI_COLOR_CODES.reset,
      ])
    );
  });
});
