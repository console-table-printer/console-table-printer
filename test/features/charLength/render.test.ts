import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Character Length Tests: Rendering', () => {
  it('should align emoji values using configured character widths', () => {
    const table = new Table({
      shouldDisableColors: true,
      charLength: {
        '🎯': 2,
        '🎨': 2,
        '🎲': 2,
      },
      columns: [
        { name: 'leftTask', alignment: 'left' },
        { name: 'centerIcon', alignment: 'center' },
        { name: 'rightIcon', alignment: 'right' },
      ],
    });

    table.addRows([
      { leftTask: '🎯 Target', centerIcon: '🎨 Art', rightIcon: '🎲 Game' },
      { leftTask: 'Target 🎯', centerIcon: 'Art 🎨', rightIcon: 'Game 🎲' },
    ]);

    expect(getTableHeader(table)).toEqual(
      '│ leftTask  │ centerIcon │ rightIcon │'
    );
    expect(getTableBody(table)).toEqual([
      '│ 🎯 Target │   🎨 Art   │   🎲 Game │',
      '│ Target 🎯 │   Art 🎨   │   Game 🎲 │',
    ]);
  });

  it('should use custom widths for different wide symbols', () => {
    const table = new Table({
      shouldDisableColors: true,
      charLength: {
        '🌍': 3,
        '📱': 2,
      },
      columns: [{ name: 'symbol' }, { name: 'description' }],
    });

    table.addRows([
      { symbol: '🌍', description: 'Globe width three' },
      { symbol: '📱', description: 'Phone width two' },
    ]);

    expect(getTableHeader(table)).toEqual('│ symbol │       description │');
    expect(getTableBody(table)).toEqual([
      '│    🌍 │ Globe width three │',
      '│     📱 │   Phone width two │',
    ]);
  });
});
