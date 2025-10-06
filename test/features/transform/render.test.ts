import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';
import { ValueTransformer, CellValue } from '../../../src/models/external-table';

describe('Transform Tests: Rendering', () => {
  it('should verify transformed values are rendered correctly', () => {
    const currencyFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `$${Number(data).toFixed(2)}`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('name')
      .addColumn({ name: 'salary', transformer: currencyFormatter })
      .addRow({ name: 'John', salary: 50000 })
      .addRow({ name: 'Jane', salary: 75000.5 });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│   name │    salary │');
    expect(renderedBody).toEqual([
      '│   John │ $50000.00 │',
      '│   Jane │ $75000.50 │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify multiple transformers work independently', () => {
    const uppercaseFormatter: ValueTransformer = (data: CellValue): CellValue =>
      String(data).toUpperCase();
    
    const numberFormatter: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toFixed(1);

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({ name: 'name', transformer: uppercaseFormatter })
      .addColumn({ name: 'score', transformer: numberFormatter })
      .addColumn('department')
      .addRow({ name: 'john', score: 95.678, department: 'Engineering' })
      .addRow({ name: 'jane', score: 87.2, department: 'Marketing' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ name │ score │ department │');
    expect(renderedBody).toEqual([
      '│ JOHN │  95.7 │ Engineering │',
      '│ JANE │  87.2 │  Marketing │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers handle edge cases correctly', () => {
    const safeFormatter: ValueTransformer = (data: CellValue): CellValue => {
      if (data === null || data === undefined) {
        return 'EMPTY';
      }
      return `[${data}]`;
    };

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('id')
      .addColumn({ name: 'value', transformer: safeFormatter })
      .addRow({ id: 1, value: 'test' })
      .addRow({ id: 2, value: null })
      .addRow({ id: 3, value: undefined })
      .addRow({ id: 4 }); // missing value

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ id │ value │');
    expect(renderedBody).toEqual([
      '│  1 │ [test] │',
      '│  2 │  EMPTY │',
      '│  3 │  EMPTY │',
      '│  4 │  EMPTY │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with column alignment', () => {
    const formatter: ValueTransformer = (data: CellValue): CellValue =>
      `***${data}***`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({ 
        name: 'left', 
        alignment: 'left',
        transformer: formatter 
      })
      .addColumn({ 
        name: 'center', 
        alignment: 'center',
        transformer: formatter 
      })
      .addColumn({ 
        name: 'right', 
        alignment: 'right',
        transformer: formatter 
      })
      .addRow({ left: 'A', center: 'B', right: 'C' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│  left │ center │  right │');
    expect(renderedBody).toEqual([
      '│ ***A*** │ ***B*** │ ***C*** │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with custom titles', () => {
    const percentFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `${Number(data)}%`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('name')
      .addColumn({ 
        name: 'score', 
        title: 'Score Percentage',
        transformer: percentFormatter 
      })
      .addRow({ name: 'Test1', score: 85 })
      .addRow({ name: 'Test2', score: 92 });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ name │ Score Percentage │');
    expect(renderedBody).toEqual([
      '│ Test1 │              85% │',
      '│ Test2 │              92% │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers preserve original data when rendering multiple times', () => {
    const doubleFormatter: ValueTransformer = (data: CellValue): CellValue =>
      Number(data) * 2;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('original')
      .addColumn({ name: 'doubled', transformer: doubleFormatter })
      .addRow({ original: 5, doubled: 5 })
      .addRow({ original: 10, doubled: 10 });

    // Render multiple times to ensure data isn't mutated
    const firstRender = p.render();
    const secondRender = p.render();
    const thirdRender = p.render();

    expect(firstRender).toEqual(secondRender);
    expect(secondRender).toEqual(thirdRender);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ original │ doubled │');
    expect(renderedBody).toEqual([
      '│        5 │      10 │',
      '│       10 │      20 │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with addColumns method', () => {
    const formatter1: ValueTransformer = (data: CellValue): CellValue =>
      `<${data}>`;
    
    const formatter2: ValueTransformer = (data: CellValue): CellValue =>
      `{${data}}`;

    const p = new Table({
      shouldDisableColors: true,
    });

    // Add multiple columns with transformers at once
    p.addColumns([
      { name: 'col1', transformer: formatter1 },
      { name: 'col2' },
      { name: 'col3', transformer: formatter2 }
    ]);

    p.addRow({ col1: 'A', col2: 'B', col3: 'C' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ col1 │ col2 │ col3 │');
    expect(renderedBody).toEqual([
      '│ <A> │    B │  {C} │'
    ]);

    // Add snapshot test
    expect(p.render()).toMatchSnapshot();
  });
});
