import { printTable } from '../../../index';

describe('Simple Helper Tests: Output Verification', () => {
  it('should log exactly once through the print helper', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    printTable([{ ticket: 'BUG-1', owner: 'Ana' }], {
      shouldDisableColors: true,
    });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

    consoleLogSpy.mockRestore();
  });
});
