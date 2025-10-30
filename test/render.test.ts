import { Table } from '../index';
import { getTableBody, getTableHeader } from './testUtils/getRawData';

describe('Table Rendering Tests', () => {
  it('should render basic table correctly', () => {
    const table = new Table()
      .addColumn('id')
      .addColumn('name')
      .addColumn('score');

    table.addRows([
      { id: 1, name: 'John', score: 85 },
      { id: 2, name: 'Jane', score: 92 },
      { id: 3, name: 'Bob', score: 78 },
    ]);

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render table with different alignments', () => {
    const table = new Table({
      columns: [
        { name: 'left_col', alignment: 'left' },
        { name: 'center_col', alignment: 'center' },
        { name: 'right_col', alignment: 'right' },
      ],
    });

    table.addRows([
      { left_col: 'Left', center_col: 'Center', right_col: 'Right' },
      { left_col: '111', center_col: '222', right_col: '333' },
    ]);

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render table with colors', () => {
    const table = new Table({
      columns: [
        { name: 'red_col', color: 'red' },
        { name: 'green_col', color: 'green' },
        { name: 'blue_col', color: 'blue' },
      ],
    });

    table.addRows([
      { red_col: 'Red text', green_col: 'Green text', blue_col: 'Blue text' },
      { red_col: '111', green_col: '222', blue_col: '333' },
    ]);

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render table with row colors', () => {
    const table = new Table()
      .addColumn('name')
      .addColumn('status')
      .addColumn('score');

    table.addRow(
      { name: 'John', status: 'Pass', score: 95 },
      { color: 'green' }
    );
    table.addRow({ name: 'Jane', status: 'Fail', score: 45 }, { color: 'red' });
    table.addRow(
      { name: 'Bob', status: 'Pass', score: 85 },
      { color: 'green' }
    );

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render table with mixed styling', () => {
    const table = new Table({
      columns: [
        { name: 'id', alignment: 'right', color: 'blue' },
        { name: 'name', alignment: 'left' },
        { name: 'status', alignment: 'center', color: 'green' },
      ],
    });

    table.addRow(
      { id: 1, name: 'John', status: 'Active' },
      { color: 'yellow' }
    );
    table.addRow(
      { id: 2, name: 'Jane', status: 'Inactive' },
      { color: 'gray' }
    );

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render empty table correctly', () => {
    const table = new Table({
      columns: [{ name: 'col1' }, { name: 'col2' }],
    });

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should render table with special characters', () => {
    const table = new Table().addColumn('symbols').addColumn('description');

    table.addRows([
      { symbols: '!@#$%^&*()', description: 'Special characters' },
      { symbols: '│─┌┐└┘├┤┬┴┼', description: 'Box drawing characters' },
      { symbols: '♠♣♥♦', description: 'Card suits' },
    ]);

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should make sure each column is what its expected to be', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'id', alignment: 'right', color: 'blue' },
        { name: 'name', alignment: 'left' },
        { name: 'status', alignment: 'center', color: 'green' },
      ],
    });

    table.addRows([
      { id: 1, name: 'John', status: 'Active' },
      { id: 2, name: 'Jane', status: 'Inactive' },
    ]);

    const [renderedHeader, renderedBody] = [
      getTableHeader(table),
      getTableBody(table),
    ];
    expect(renderedHeader).toEqual('│ id │ name │  status  │');
    expect(renderedBody).toEqual([
      '│  1 │ John │  Active  │',
      '│  2 │ Jane │ Inactive │',
    ]);
  });

  it('should render grouped columns headers', () => {
    const table = new Table({
      groupedColumnsHeaders: [
        { name: 'G1', childNames: ['D', 'C'], alignment: 'left' },
        { name: 'VERY LONG GROUP NAME', childNames: ['F', 'G', 'H'] },
      ],
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

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });
});
