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
      '│ short │     medium │                               normal │'
    );
    expect(renderedBody).toEqual([
      '│  This │     Medium │ This text has no length restrictions │',
      '│    is │     length │                                      │',
      '│  very │  text here │                                      │',
      '│  long │            │                                      │',
      '│  text │            │                                      │',
      '│    OK │       Good │                              Perfect │',
    ]);

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
    expect(renderedHeader).toEqual('│ padded          │      normal │');
    expect(renderedBody).toEqual([
      '│ Short           │ Normal text │',
      '│ X               │ Another row │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should handle text wrapping with maxLen on multiple rows', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [{ name: 'wrapped', maxLen: 8 }, { name: 'count' }],
    });

    p.addRows([
      { wrapped: 'abcdefghijklmnopqrstuvwxyz', count: 1 },
      { wrapped: 'Short', count: 2 },
      { wrapped: '12345678901234567890', count: 3 },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│                    wrapped │ count │');
    expect(renderedBody).toEqual([
      '│ abcdefghijklmnopqrstuvwxyz │     1 │',
      '│                      Short │     2 │',
      '│       12345678901234567890 │     3 │',
    ]);

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
      {
        constrained: 'This text is definitely way too long for the column',
        value: 'Too long',
      },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│     constrained │      value │');
    expect(renderedBody).toEqual([
      '│              Hi │  Too short │',
      '│    Perfect size │ Just right │',
      '│    This text is │   Too long │',
      '│  definitely way │            │',
      '│    too long for │            │',
      '│      the column │            │',
    ]);

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

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ left       │   center   │      right │');
    expect(renderedBody).toEqual([
      '│ Left       │   Center   │      Right │',
      '│ aligned    │  aligned   │    aligned │',
      '│ wrapping   │  wrapping  │   wrapping │',
      '│ text       │    text    │       text │',
    ]);

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
      },
    });

    p.addRows([
      { col1: 'Hi', col2: 'Hello', col3: 'Testing' },
      { col1: 'This is longer than ten', col2: 'OK', col3: 'X' },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│       col1 │       col2 │     col3 │');
    expect(renderedBody).toEqual([
      '│         Hi │      Hello │  Testing │',
      '│    This is │         OK │        X │',
      '│     longer │            │          │',
      '│   than ten │            │          │',
    ]);

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

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│   required │   optional │');
    expect(renderedBody).toEqual([
      '│            │            │',
      '│            │            │',
      '│      Value │      Value │',
    ]);

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

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│    id │         amount │ percentage │');
    expect(renderedBody).toEqual([
      '│     1 │ 1234567890.123 │      45.67 │',
      '│   999 │             42 │        100 │',
      '│    42 │         0.0001 │          0 │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });
});
