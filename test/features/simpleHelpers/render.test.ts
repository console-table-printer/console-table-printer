import { printTable, renderTable } from '../../../index';

describe('Simple Helper Tests: Rendering', () => {
  it('should render rows without creating a Table instance', () => {
    const rendered = renderTable([{ ticket: 'BUG-1', owner: 'Ana' }], {
      shouldDisableColors: true,
    });

    expect(rendered.split('\n')).toEqual([
      '┌────────┬───────┐',
      '│ ticket │ owner │',
      '├────────┼───────┤',
      '│  BUG-1 │   Ana │',
      '└────────┴───────┘',
    ]);
  });

  it('should print rows without creating a Table instance', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    printTable([{ ticket: 'BUG-1', owner: 'Ana' }], {
      shouldDisableColors: true,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      [
        '┌────────┬───────┐',
        '│ ticket │ owner │',
        '├────────┼───────┤',
        '│  BUG-1 │   Ana │',
        '└────────┴───────┘',
      ].join('\n')
    );

    consoleLogSpy.mockRestore();
  });
});
