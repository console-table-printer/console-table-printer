import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Column Max/Min Length Tests: Rendering', () => {
  it('should properly render columns with maxLen restrictions', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'short', maxLen: 5 },
        { name: 'medium', maxLen: 10 },
        { name: 'normal' },
      ],
    });

    p.addRows([
      {
        short: 'This is very long text',
        medium: 'Medium length text here',
        normal: 'This text has no length restrictions',
      },
      {
        short: 'OK',
        medium: 'Good',
        normal: 'Perfect',
      },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual(
      ' short      medium                                normal '
    );

    // First row should have wrapped text due to maxLen
    expect(renderedBody[0]).toMatch(/ This /);
    expect(renderedBody[1]).toMatch(/ is ve/);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should properly render columns with minLen restrictions', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'padded', minLen: 15, alignment: 'left' },
        { name: 'normal' },
      ],
    });

    p.addRows([
      { padded: 'Short', normal: 'Normal text' },
      { padded: 'X', normal: 'Another row' },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    // Header should respect minLen
    expect(renderedHeader).toMatch(/\s+padded\s+\s+normal\s+/);

    // Body should have padded content
    expect(renderedBody[0]).toMatch(/ Short\s{10} /);
    expect(renderedBody[1]).toMatch(/ X\s{14} /);

    expect(p.render()).toMatchSnapshot();
  });

  it('should handle text wrapping with maxLen on multiple rows', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'wrapped', maxLen: 8 },
        { name: 'count' },
      ],
    });

    p.addRows([
      { wrapped: 'abcdefghijklmnopqrstuvwxyz', count: 1 },
      { wrapped: 'Short', count: 2 },
      { wrapped: '12345678901234567890', count: 3 },
    ]);

    const renderedBody = getTableBody(p);

    // First row should be wrapped into multiple lines
    expect(renderedBody[0]).toMatch(/ abcdefgh  1 /);
    expect(renderedBody[1]).toMatch(/ ijklmnop    /);
    expect(renderedBody[2]).toMatch(/ qrstuvwx    /);
    expect(renderedBody[3]).toMatch(/ yz\s+   /);

    // Second row should not wrap
    expect(renderedBody[4]).toMatch(/ Short\s+ 2 /);

    // Third row should be wrapped
    expect(renderedBody[5]).toMatch(/ 12345678  3 /);
    expect(renderedBody[6]).toMatch(/ 90123456    /);
    expect(renderedBody[7]).toMatch(/ 7890\s+   /);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render with both maxLen and minLen constraints', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'constrained', minLen: 10, maxLen: 15 },
        { name: 'value' },
      ],
    });

    p.addRows([
      { constrained: 'Hi', value: 'Too short' },
      { constrained: 'Perfect size', value: 'Just right' },
      { constrained: 'This text is definitely way too long for the column', value: 'Too long' },
    ]);

    const renderedBody = getTableBody(p);

    // First row should be padded to minLen
    expect(renderedBody[0]).toMatch(/ Hi\s{8} /);

    // Second row should fit normally
    expect(renderedBody[1]).toMatch(/ Perfect size\s+/);

    // Third row should be wrapped at maxLen
    expect(renderedBody[2]).toMatch(/ This text is d /);
    expect(renderedBody[3]).toMatch(/ efinitely way\s+/);

    expect(p.render()).toMatchSnapshot();
  });

  it('should correctly render with different alignments and length constraints', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'left', maxLen: 10, alignment: 'left' },
        { name: 'center', maxLen: 10, alignment: 'center' },
        { name: 'right', maxLen: 10, alignment: 'right' },
      ],
    });

    p.addRows([
      {
        left: 'Left aligned wrapping text',
        center: 'Center aligned wrapping text',
        right: 'Right aligned wrapping text',
      },
    ]);

    const renderedBody = getTableBody(p);

    // Check that text is wrapped and properly aligned
    // Left aligned
    expect(renderedBody[0]).toMatch(/ Left align /);
    expect(renderedBody[1]).toMatch(/ ed wrappin /);
    expect(renderedBody[2]).toMatch(/ g text\s+/);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render table with global maxLen and minLen settings', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'col1' },
        { name: 'col2' },
        { name: 'col3', maxLen: 5 }, // Override global
      ],
      defaultColumnOptions: {
        maxLen: 10,
        minLen: 8,
      }
    });

    p.addRows([
      { col1: 'Hi', col2: 'Hello', col3: 'Testing' },
      { col1: 'This is longer than ten', col2: 'OK', col3: 'X' },
    ]);

    const renderedBody = getTableBody(p);

    // col1 should respect global minLen (8) and maxLen (10)
    expect(renderedBody[0]).toMatch(/ Hi\s{6} /); // Padded to 8

    // col2 should also respect global settings
    expect(renderedBody[0]).toMatch(/ Hello\s{3} /); // Padded to 8

    // col3 should use its own maxLen (5)
    expect(renderedBody[0]).toMatch(/ Testi /);
    expect(renderedBody[1]).toMatch(/ ng\s+/);

    expect(p.render()).toMatchSnapshot();
  });

  it('should handle empty cells with minLen', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'required', minLen: 10 },
        { name: 'optional', minLen: 10 },
      ],
    });

    p.addRows([
      { required: '', optional: null },
      { required: undefined, optional: '' },
      { required: 'Value', optional: 'Value' },
    ]);

    const renderedBody = getTableBody(p);

    // Empty values should be padded to minLen
    expect(renderedBody[0]).toMatch(/\s{10} \s{10} /);
    expect(renderedBody[1]).toMatch(/\s{10} \s{10} /);
    expect(renderedBody[2]).toMatch(/ Value\s{4}  Value\s{4} /);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render numeric values with length constraints', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'id', minLen: 5 },
        { name: 'amount', maxLen: 8 },
        { name: 'percentage' },
      ],
    });

    p.addRows([
      { id: 1, amount: 1234567890.123, percentage: 45.67 },
      { id: 999, amount: 42, percentage: 100 },
      { id: 42, amount: 0.0001, percentage: 0 },
    ]);

    const renderedBody = getTableBody(p);

    // ID should be padded to minLen
    expect(renderedBody[0]).toMatch(/\s+1\s+/);
    expect(renderedBody[1]).toMatch(/\s+999\s+/);

    // Amount should wrap if longer than maxLen
    expect(renderedBody[0]).toMatch(/ 12345678/);
    expect(renderedBody[1]).toMatch(/ 90.123\s+/);

    expect(p.render()).toMatchSnapshot();
  });
});