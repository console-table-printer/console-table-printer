import { Table } from '../../../index';
import { GroupedColumnsHeader } from '../../../src/models/external-table';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Grouped columns headers', () => {
  const buildTestTable = (groupedHeaders?: GroupedColumnsHeader[]): Table => {
    const table = new Table({
      groupedColumnsHeaders: groupedHeaders,
    });

    table.addRow({
      A: `A1`,
      B: `B1`,
      C: `C1`,
      D: `D1`,
      E: `E1`,
      F: `F1`,
      G: `G1`,
      H: `H1`,
      I: `I 00001`,
    });

    table.addRow({
      A: `A2`,
      B: `B2`,
      C: `C2`,
      D: `D 00002`,
      E: `E2`,
      F: `F2`,
      G: `G2`,
      H: `H2`,
      I: `I2`,
    });

    return table;
  };

  it('should render single group', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['A', 'B'] },
      { name: 'G2', childNames: ['C', 'D'] },
      { name: 'G3', childNames: ['E', 'F', 'G', 'H', 'I'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder at the start', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['B', 'C'] },
      { name: 'G2', childNames: ['D', 'E'] },
      { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder at the end', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['A', 'B'] },
      { name: 'G2', childNames: ['C', 'D'] },
      { name: 'G3', childNames: ['E', 'F', 'G', 'H'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder in between', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['A', 'B'] },
      { name: 'G2', childNames: ['C', 'D'] },
      { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with placeholders', () => {
    const p = buildTestTable([
      { name: 'G1', childNames: ['B', 'C'] },
      { name: 'G2', childNames: ['E', 'F'] },
      { name: 'G3', childNames: ['G', 'H'] },
    ]);

    p.printTable();

    // ensure we didn't mutate the original input when normalizing
    expect(p.table.groupedColumnsHeaders.length).toBe(3);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render placeholders spanning multiple columns', () => {
    const p = buildTestTable([{ name: 'G1', childNames: ['F', 'G'] }]);

    p.printTable();

    // ensure we don't mutate the original input when normalizing
    expect(p.table.groupedColumnsHeaders.length).toBe(1);

    expect(p.render()).toMatchSnapshot();
  });

  it('should cope with very long group names', () => {
    // Note: Current rendering strategy produces the following output
    // where the group name is truncated to fit the width of spanned columns:
    //
    //                                         ┌──────────────┐
    //                                         │  VERY LONG   │
    // ┌────┬────┬────┬─────────┬────┬────┬────┼────┬─────────┤
    // │  A │  B │  C │       D │  E │  F │  G │  H │       I │
    // ├────┼────┼────┼─────────┼────┼────┼────┼────┼─────────┤
    // │ A1 │ B1 │ C1 │      D1 │ E1 │ F1 │ G1 │ H1 │ I 00001 │
    // │ A2 │ B2 │ C2 │ D 00002 │ E2 │ F2 │ G2 │ H2 │      I2 │
    // └────┴────┴────┴─────────┴────┴────┴────┴────┴─────────┘
    //
    // An alternative rendering strategy could be put in place to produce the following:
    // However, it would be far more involved to implement.
    //
    //                                         ┌──────────────────────┐
    //                                         │ VERY LONG GROUP NAME │
    // ┌────┬────┬────┬─────────┬────┬────┬────┼─────────┬────────────┤
    // │  A │  B │  C │       D │  E │  F │  G │       H │          I │
    // ├────┼────┼────┼─────────┼────┼────┼────┼─────────┼────────────┤
    // │ A1 │ B1 │ C1 │      D1 │ E1 │ F1 │ G1 │      H1 │    I 00001 │
    // │ A2 │ B2 │ C2 │ D 00002 │ E2 │ F2 │ G2 │      H2 │         I2 │
    // └────┴────┴────┴─────────┴────┴────┴────┴─────────┴────────────┘

    const p = buildTestTable([
      { name: 'VERY LONG GROUP NAME', childNames: ['H', 'I'] },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  describe('should throw when grouped columns headers are misconfigured', () => {
    it('having a group with empty child names', () => {
      const p = buildTestTable([
        { name: 'G1', childNames: ['A', 'B', 'C'] },
        { name: 'G2', childNames: [] },
        { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('having a group with duplicate child names', () => {
      const p = buildTestTable([
        { name: 'G1', childNames: ['A', 'B', 'C'] },
        { name: 'G2', childNames: ['D', 'E', 'D'] },
        { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('having multiple group referencing the same child name', () => {
      const p = buildTestTable([
        { name: 'G1', childNames: ['A', 'B', 'C'] },
        { name: 'G2', childNames: ['D', 'A'] },
        { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('having a group referencing a non existing column', () => {
      const p = buildTestTable([
        { name: 'G1', childNames: ['A', 'B', 'C'] },
        { name: 'G2', childNames: ['D', 'NOPE'] },
        { name: 'G3', childNames: ['F', 'G', 'H', 'I'] },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('having a group referencing non consecutive columns', () => {
      const p = buildTestTable([
        { name: 'G1', childNames: ['C', 'A', 'B'] },
        { name: 'G2', childNames: ['D', 'I'] },
        { name: 'G3', childNames: ['G', 'F', 'H'] },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });
  });
});
