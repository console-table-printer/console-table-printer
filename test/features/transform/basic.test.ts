import { Table } from '../../../index';
import { ValueTransformer, CellValue } from '../../../src/models/external-table';

describe('Testing transform functionality', () => {
  it('should allow adding columns with transformers', () => {
    const numberFormatter: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toFixed(2);

    const p = new Table()
      .addColumn('name')
      .addColumn({ name: 'salary', transformer: numberFormatter })
      .addRow({ name: 'John', salary: 50000 })
      .addRow({ name: 'Jane', salary: 60000.5 });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should allow adding multiple columns with different transformers', () => {
    const currencyFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `$${Number(data).toFixed(2)}`;
    
    const uppercaseFormatter: ValueTransformer = (data: CellValue): CellValue =>
      String(data).toUpperCase();

    const p = new Table()
      .addColumn({ name: 'name', transformer: uppercaseFormatter })
      .addColumn({ name: 'salary', transformer: currencyFormatter })
      .addColumn('department')
      .addRow({ name: 'john doe', salary: 50000, department: 'Engineering' })
      .addRow({ name: 'jane smith', salary: 75000.5, department: 'Marketing' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle null and undefined values in transformers', () => {
    const safeFormatter: ValueTransformer = (data: CellValue): CellValue => {
      if (data === null || data === undefined) {
        return 'N/A';
      }
      return `Formatted: ${data}`;
    };

    const p = new Table()
      .addColumn('id')
      .addColumn({ name: 'value', transformer: safeFormatter })
      .addRow({ id: 1, value: 'test' })
      .addRow({ id: 2, value: null })
      .addRow({ id: 3, value: undefined })
      .addRow({ id: 4 }); // missing value property

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle string transformers', () => {
    const stringFormatter: ValueTransformer = (data: CellValue): CellValue =>
      String(data).replace(/\s+/g, '_').toLowerCase();

    const p = new Table()
      .addColumn('original')
      .addColumn({ name: 'transformed', transformer: stringFormatter })
      .addRow({ original: 'Hello World', transformed: 'Hello World' })
      .addRow({ original: 'Test String', transformed: 'Test String' })
      .addRow({ original: 'Multiple   Spaces', transformed: 'Multiple   Spaces' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle number transformers with different formats', () => {
    const percentageFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `${(Number(data) * 100).toFixed(1)}%`;

    const scientificFormatter: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toExponential(2);

    const p = new Table()
      .addColumn('decimal')
      .addColumn({ name: 'percentage', transformer: percentageFormatter })
      .addColumn({ name: 'scientific', transformer: scientificFormatter })
      .addRow({ decimal: 0.25, percentage: 0.25, scientific: 0.25 })
      .addRow({ decimal: 0.1234, percentage: 0.1234, scientific: 0.1234 })
      .addRow({ decimal: 1.5, percentage: 1.5, scientific: 1.5 });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should work with chained column additions', () => {
    const formatter1: ValueTransformer = (data: CellValue): CellValue =>
      `[${data}]`;
    
    const formatter2: ValueTransformer = (data: CellValue): CellValue =>
      `{${data}}`;

    const p = new Table()
      .addColumn({ name: 'col1', transformer: formatter1 })
      .addColumn('col2')
      .addColumn({ name: 'col3', transformer: formatter2 })
      .addRow({ col1: 'A', col2: 'B', col3: 'C' })
      .addRow({ col1: 'X', col2: 'Y', col3: 'Z' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle transformers with complex column configurations', () => {
    const complexFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `*** ${String(data).toUpperCase()} ***`;

    const p = new Table()
      .addColumn({
        name: 'complexColumn',
        title: 'Complex Transformed Column',
        alignment: 'center',
        color: 'blue',
        transformer: complexFormatter,
      })
      .addColumn('simpleColumn')
      .addRow({ complexColumn: 'hello', simpleColumn: 'world' })
      .addRow({ complexColumn: 'test', simpleColumn: 'data' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle transformers that return different data types', () => {
    const mixedFormatter: ValueTransformer = (data: CellValue): CellValue => {
      if (typeof data === 'number') {
        return data * 2;
      }
      if (typeof data === 'string') {
        return data.length;
      }
      return 'unknown';
    };

    const p = new Table()
      .addColumn('input')
      .addColumn({ name: 'transformed', transformer: mixedFormatter })
      .addRow({ input: 'hello', transformed: 'hello' })
      .addRow({ input: 42, transformed: 42 })
      .addRow({ input: 'world', transformed: 'world' })
      .addRow({ input: 100, transformed: 100 });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle mathematical transformers correctly across multiple renders', () => {
    // Test with a mathematical transformer to ensure no double-transformation
    const cubeTransformer: ValueTransformer = (data: CellValue): CellValue => {
      const num = Number(data);
      return num * num * num; // Cube the number
    };

    const p = new Table()
      .addColumn('number')
      .addColumn({ name: 'cubed', transformer: cubeTransformer })
      .addRow({ number: 2, cubed: 2 })   // 2³ = 8
      .addRow({ number: 3, cubed: 3 })   // 3³ = 27
      .addRow({ number: 4, cubed: 4 });  // 4³ = 64

    // Render multiple times to ensure consistency
    const render1 = p.render();
    const render2 = p.render();
    const render3 = p.render();

    // All renders should be identical
    expect(render1).toEqual(render2);
    expect(render2).toEqual(render3);

    // Verify the output contains the correct cubed values
    expect(render1).toContain('8');   // 2³ = 8
    expect(render1).toContain('27');  // 3³ = 27  
    expect(render1).toContain('64');  // 4³ = 64

    // Verify it doesn't contain values that would result from double-cubing
    expect(render1).not.toContain('512');   // 2³³ = 512
    expect(render1).not.toContain('19683'); // 3³³ = 19683
    expect(render1).not.toContain('262144'); // 4³³ = 262144

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });
});
