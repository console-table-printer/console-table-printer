import { Table } from '../../../index';
import { GroupedColumnsHeaderOrPlaceholder } from '../../../src/models/external-table';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Grouped columns headers', () => {
  const buildTestTable = (
    groupedHeaders?: GroupedColumnsHeaderOrPlaceholder[]
  ): Table => {
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
    const p = buildTestTable([{ name: 'G1', width: 9 }]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups', () => {
    const p = buildTestTable([
      { name: 'G1', width: 2 },
      { name: 'G2', width: 2 },
      { name: 'G3', width: 5 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder at the start', () => {
    const p = buildTestTable([
      { kind: 'PLACEHOLDER', width: 1 },
      { name: 'G1', width: 2 },
      { name: 'G2', width: 2 },
      { name: 'G3', width: 4 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder at the end', () => {
    const p = buildTestTable([
      { name: 'G1', width: 2 },
      { name: 'G2', width: 2 },
      { name: 'G3', width: 4 },
      { kind: 'PLACEHOLDER', width: 1 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with a placeholder in between', () => {
    const p = buildTestTable([
      { name: 'G1', width: 2 },
      { name: 'G2', width: 2 },
      { kind: 'PLACEHOLDER', width: 1 },
      { name: 'G3', width: 4 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should render consecutive groups with placeholders', () => {
    const p = buildTestTable([
      { kind: 'PLACEHOLDER', width: 1 },
      { name: 'G1', width: 2 },
      { kind: 'PLACEHOLDER', width: 1 },
      { name: 'G2', width: 2 },
      { name: 'G3', width: 2 },
    ]);

    p.printTable();

    // ensure we didn't mutate the original input when normalizing
    expect(p.table.groupedColumnsHeaders.length).toBe(5);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render placeholders spanning multiple columns', () => {
    const p = buildTestTable([
      { kind: 'PLACEHOLDER', width: 2 },
      { kind: 'PLACEHOLDER', width: 3 },
      { name: 'G1', width: 2 },
    ]);

    p.printTable();

    // ensure we don't mutate the original input when normalizing
    expect(p.table.groupedColumnsHeaders.length).toBe(3);

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
      { kind: 'PLACEHOLDER', width: 7 },
      { name: 'VERY LONG GROUP NAME', width: 2 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should ignore headers only made of placeholders', () => {
    const p = buildTestTable([
      { kind: 'PLACEHOLDER', width: 2 },
      { kind: 'PLACEHOLDER', width: 3 },
    ]);

    p.printTable();

    // ensure we didn't mutate the original input when normalizing
    expect(p.table.groupedColumnsHeaders.length).toBe(2);

    expect(p.render()).toMatchSnapshot();
  });

  describe('should throw when total table width is narrower than total width of group headers', () => {
    it('ending with a group header', () => {
      const p = buildTestTable([
        { kind: 'PLACEHOLDER', width: 3 },
        { name: 'G1', width: 2 },
        { kind: 'PLACEHOLDER', width: 1 },
        { name: 'G2', width: 2 },
        { name: 'G3', width: 2 },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('ending with a placeholder', () => {
      const p = buildTestTable([
        { kind: 'PLACEHOLDER', width: 3 },
        { name: 'G1', width: 2 },
        { kind: 'PLACEHOLDER', width: 1 },
        { name: 'G2', width: 2 },
        { kind: 'PLACEHOLDER', width: 2 },
      ]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('being one too large group header', () => {
      const p = buildTestTable([{ name: 'G1', width: 99 }]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });

    it('being one too large placeholder', () => {
      const p = buildTestTable([{ kind: 'PLACEHOLDER', width: 99 }]);

      expect(() => p.render()).toThrowErrorMatchingSnapshot();
    });
  });
});
