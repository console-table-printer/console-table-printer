import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Column Max/Min Length Tests', () => {
  it('should handle basic column maxLen', () => {
    const p = new Table()
      .addColumn({ name: 'limited', maxLen: 10 })
      .addColumn({ name: 'unlimited' });

    p.addRows([
      { limited: 'This text is longer than 10 chars', unlimited: 'Short' },
      { limited: 'Short', unlimited: 'This can be as long as it needs to be' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle basic column minLen', () => {
    const p = new Table()
      .addColumn({ name: 'padded', minLen: 15 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { padded: 'Hi', normal: 'Normal text' },
      { padded: 'Hello', normal: 'Another row' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle both maxLen and minLen together', () => {
    const p = new Table()
      .addColumn({ name: 'constrained', minLen: 10, maxLen: 20 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { constrained: 'Short', normal: 'Normal column' },
      { constrained: 'This is exactly twenty chars plus more', normal: 'Another' },
      { constrained: 'Medium length', normal: 'Row 3' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle maxLen with different alignments', () => {
    const p = new Table()
      .addColumn({ name: 'left', maxLen: 10, alignment: 'left' })
      .addColumn({ name: 'center', maxLen: 10, alignment: 'center' })
      .addColumn({ name: 'right', maxLen: 10, alignment: 'right' });

    p.addRows([
      {
        left: 'This will be wrapped to multiple lines',
        center: 'Center aligned text wrapping',
        right: 'Right aligned text wrapping'
      },
      { left: 'Short', center: 'Mid', right: 'End' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle minLen with different alignments', () => {
    const p = new Table()
      .addColumn({ name: 'left', minLen: 15, alignment: 'left' })
      .addColumn({ name: 'center', minLen: 15, alignment: 'center' })
      .addColumn({ name: 'right', minLen: 15, alignment: 'right' });

    p.addRows([
      { left: 'L', center: 'C', right: 'R' },
      { left: 'Left', center: 'Center', right: 'Right' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle edge case where maxLen equals text length', () => {
    const p = new Table()
      .addColumn({ name: 'exact', maxLen: 5 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { exact: '12345', normal: 'Exactly 5 chars' },
      { exact: '1234', normal: 'Less than 5' },
      { exact: '123456', normal: 'More than 5' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle edge case where minLen equals text length', () => {
    const p = new Table()
      .addColumn({ name: 'exact', minLen: 5 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { exact: '12345', normal: 'Exactly 5 chars' },
      { exact: '1234', normal: 'Less than 5' },
      { exact: '123456', normal: 'More than 5' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle very small maxLen values', () => {
    const p = new Table()
      .addColumn({ name: 'tiny', maxLen: 1 })
      .addColumn({ name: 'small', maxLen: 3 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { tiny: 'Word', small: 'Testing', normal: 'Normal column' },
      { tiny: 'A', small: 'OK', normal: 'Second row' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle numeric values with maxLen and minLen', () => {
    const p = new Table()
      .addColumn({ name: 'numbers', minLen: 10, maxLen: 15 });

    p.addRows([
      { numbers: 42 },
      { numbers: 3.14159265359 },
      { numbers: 1000000000000000 },
      { numbers: 0 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle empty values with minLen', () => {
    const p = new Table()
      .addColumn({ name: 'padded', minLen: 10 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { padded: '', normal: 'Empty padded' },
      { padded: null, normal: 'Null padded' },
      { padded: undefined, normal: 'Undefined padded' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle maxLen/minLen with colored columns', () => {
    const p = new Table()
      .addColumn({ name: 'colored', color: 'red', maxLen: 10, minLen: 5 })
      .addColumn({ name: 'normal' });

    p.addRows([
      { colored: 'Hi', normal: 'Short colored text' },
      { colored: 'This is a very long text that should wrap', normal: 'Long colored text' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle global maxLen and minLen from table options', () => {
    const p = new Table({
      columns: [
        { name: 'col1' },
        { name: 'col2' },
        { name: 'col3', maxLen: 5 }, // Override global maxLen
      ],
      defaultColumnOptions: {
        maxLen: 12,
        minLen: 8,
      }
    });

    p.addRows([
      { col1: 'Short', col2: 'Medium text', col3: 'Override' },
      { col1: 'This is longer than 12 characters', col2: 'Hi', col3: 'Test' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });
});