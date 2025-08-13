import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';
import { ValueTransformer, CellValue } from '../../../src/models/external-table';

describe('Testing transform functionality and verifying the output', () => {
  it('should verify transformer output length constraints', () => {
    const longFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `This is a very long formatted version of: ${data}`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({ name: 'short', maxLen: 10, transformer: longFormatter })
      .addColumn('normal')
      .addRow({ short: 'A', normal: 'Normal text' })
      .addRow({ short: 'B', normal: 'Another normal text' });

    const contentLines = getTableBody(p);
    const paddingSize = 2;
    const maxLen = 10;

    p.printTable();

    contentLines.forEach((line) => {
      // Verify the transformed column respects maxLen constraint
      const transformedContent = line.split('│')[1];
      expect(transformedContent.length).toBeLessThanOrEqual(maxLen + paddingSize);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformer output with minLen constraints', () => {
    const shortFormatter: ValueTransformer = (data: CellValue): CellValue =>
      String(data).charAt(0);

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({ name: 'expanded', minLen: 15, transformer: shortFormatter })
      .addColumn('normal')
      .addRow({ expanded: 'Hello', normal: 'World' })
      .addRow({ expanded: 'Test', normal: 'Data' });

    const contentLines = getTableBody(p);
    const paddingSize = 2;
    const minLen = 15;

    p.printTable();

    contentLines.forEach((line) => {
      // Verify the transformed column respects minLen constraint
      const transformedContent = line.split('│')[1];
      expect(transformedContent.length).toBeGreaterThanOrEqual(minLen + paddingSize);
    });

    expect(p.render()).toMatchSnapshot();
  });

  [5, 10, 15, 20].forEach((fixedLen) => {
    it(`should handle transformer with fixed length ${fixedLen} (minLen = maxLen)`, () => {
      const fixedFormatter: ValueTransformer = (data: CellValue): CellValue =>
        `Formatted: ${data}`;

      const p = new Table({
        shouldDisableColors: true,
      }).addColumn({
        name: `fixedTransform:${fixedLen}`,
        minLen: fixedLen,
        maxLen: fixedLen,
        transformer: fixedFormatter,
      });

      // Test various input lengths
      const testData = [
        { input: 'A', description: 'short input' },
        { input: 'Medium', description: 'medium input' },
        { input: 'This is a very long input that should be truncated', description: 'long input' },
      ];

      testData.forEach(({ input }) => {
        p.addRow({ [`fixedTransform:${fixedLen}`]: input });
      });

      const contentLines = getTableBody(p);
      const paddingSize = 2;

      p.printTable();

      // All transformed content should have exactly the same length
      const expectedLength = fixedLen + paddingSize;
      contentLines.forEach((line) => {
        const content = line.split('│')[1];
        expect(content.length).toBe(expectedLength);
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  [
    { min: 8, max: 15 },
    { min: 10, max: 20 },
    { min: 15, max: 25 },
  ].forEach(({ min, max }) => {
    it(`should handle transformer with minLen ${min} and maxLen ${max}`, () => {
      const variableFormatter: ValueTransformer = (data: CellValue): CellValue =>
        `[Transformed: ${data}]`;

      const p = new Table({
        shouldDisableColors: true,
      }).addColumn({
        name: `varTransform:min${min}:max${max}`,
        minLen: min,
        maxLen: max,
        transformer: variableFormatter,
      });

      // Test various content lengths
      const testData = [
        { input: 'A', description: 'short' },
        { input: 'Medium', description: 'medium' },
        { input: 'This is a very long input', description: 'long' },
      ];

      testData.forEach(({ input }) => {
        p.addRow({ [`varTransform:min${min}:max${max}`]: input });
      });

      const contentLines = getTableBody(p);
      const paddingSize = 2;

      p.printTable();

      contentLines.forEach((line) => {
        const content = line.split('│')[1];
        // Content should be between minLen and maxLen (including padding)
        expect(content.length).toBeGreaterThanOrEqual(min + paddingSize);
        expect(content.length).toBeLessThanOrEqual(max + paddingSize);
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  it('should verify transformer consistency across multiple renders', () => {
    let callCount = 0;
    const countingFormatter: ValueTransformer = (data: CellValue): CellValue => {
      callCount++;
      return `Call #${callCount}: ${data}`;
    };

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('id')
      .addColumn({ name: 'transformed', transformer: countingFormatter })
      .addRow({ id: 1, transformed: 'A' })
      .addRow({ id: 2, transformed: 'B' });

    // First render
    const firstRender = p.render();
    const firstCallCount = callCount;

    // Second render - should not call transformer again
    const secondRender = p.render();
    const secondCallCount = callCount;

    // Third render - should not call transformer again
    const thirdRender = p.render();
    const finalCallCount = callCount;

    // Verify renders are identical
    expect(firstRender).toEqual(secondRender);
    expect(secondRender).toEqual(thirdRender);

    // Verify transformer was only called during first render
    expect(firstCallCount).toBe(2); // Called once per row
    expect(secondCallCount).toBe(firstCallCount); // No additional calls
    expect(finalCallCount).toBe(firstCallCount); // No additional calls

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with different data types', () => {
    const typeAwareFormatter: ValueTransformer = (data: CellValue): CellValue => {
      if (typeof data === 'number') {
        return `NUM:${data.toFixed(2)}`;
      }
      if (typeof data === 'string') {
        return `STR:${data.toUpperCase()}`;
      }
      if (data === null) {
        return 'NULL';
      }
      if (data === undefined) {
        return 'UNDEFINED';
      }
      return 'UNKNOWN';
    };

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('input')
      .addColumn({ name: 'transformed', transformer: typeAwareFormatter })
      .addRow({ input: 'hello', transformed: 'hello' })
      .addRow({ input: 42.567, transformed: 42.567 })
      .addRow({ input: null, transformed: null })
      .addRow({ input: undefined, transformed: undefined })
      .addRow({ input: 0, transformed: 0 });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    
    p.printTable();

    // Verify specific transformations
    const bodyParts = renderedBody.map(row => 
      row.split('│').map(part => part.trim())
    );

    expect(bodyParts[0][2]).toBe('STR:HELLO'); // string
    expect(bodyParts[1][2]).toBe('NUM:42.57'); // number
    expect(bodyParts[2][2]).toBe('NULL'); // null
    expect(bodyParts[3][2]).toBe('UNDEFINED'); // undefined
    expect(bodyParts[4][2]).toBe('NUM:0.00'); // zero

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with complex column configurations', () => {
    const complexFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `>>>${String(data).toUpperCase()}<<<`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({
        name: 'complexColumn',
        title: 'Complex Transformed',
        alignment: 'center',
        minLen: 20,
        maxLen: 25,
        transformer: complexFormatter,
      })
      .addColumn('simpleColumn')
      .addRow({ complexColumn: 'test', simpleColumn: 'normal' })
      .addRow({ complexColumn: 'data', simpleColumn: 'regular' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    const paddingSize = 2;

    p.printTable();

    // Verify header uses custom title
    expect(renderedHeader).toContain('Complex Transformed');

    // Verify content respects length constraints and transformation
    renderedBody.forEach((line) => {
      const transformedContent = line.split('│')[1];
      expect(transformedContent.length).toBeGreaterThanOrEqual(20 + paddingSize);
      expect(transformedContent.length).toBeLessThanOrEqual(25 + paddingSize);
      expect(transformedContent).toContain('>>>');
      expect(transformedContent).toContain('<<<');
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work when adding data after column definition', () => {
    const timestampFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `[${new Date(Number(data)).toISOString().split('T')[0]}]`;

    const p = new Table({
      shouldDisableColors: true,
    });

    // Add columns first
    p.addColumn('id');
    p.addColumn({ name: 'date', transformer: timestampFormatter });

    // Add data later
    p.addRow({ id: 1, date: 1640995200000 }); // 2022-01-01
    p.addRow({ id: 2, date: 1672531200000 }); // 2023-01-01

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    p.printTable();

    // Verify transformation worked
    expect(renderedBody[0]).toContain('[2022-01-01]');
    expect(renderedBody[1]).toContain('[2023-01-01]');

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transformers work with chained operations', () => {
    const prefixFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `PREFIX_${data}`;
    
    const suffixFormatter: ValueTransformer = (data: CellValue): CellValue =>
      `${data}_SUFFIX`;

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({ name: 'col1', transformer: prefixFormatter })
      .addColumn('col2')
      .addColumn({ name: 'col3', transformer: suffixFormatter })
      .addRow({ col1: 'A', col2: 'B', col3: 'C' })
      .addRows([
        { col1: 'X', col2: 'Y', col3: 'Z' },
        { col1: '1', col2: '2', col3: '3' }
      ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    p.printTable();

    // Verify transformations in all rows
    expect(renderedBody[0]).toContain('PREFIX_A');
    expect(renderedBody[0]).toContain('C_SUFFIX');
    expect(renderedBody[1]).toContain('PREFIX_X');
    expect(renderedBody[1]).toContain('Z_SUFFIX');
    expect(renderedBody[2]).toContain('PREFIX_1');
    expect(renderedBody[2]).toContain('3_SUFFIX');

    // Verify untransformed column remains unchanged
    expect(renderedBody[0]).toContain('B');
    expect(renderedBody[1]).toContain('Y');
    expect(renderedBody[2]).toContain('2');

    expect(p.render()).toMatchSnapshot();
  });

  it('should not apply transformer multiple times when render() is called repeatedly', () => {
    // This test verifies that transformers don't get applied multiple times
    // If this test fails, it indicates a bug where data gets transformed repeatedly
    const squareTransformer: ValueTransformer = (data: CellValue): CellValue => {
      const num = Number(data);
      return num * num;
    };

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('original')
      .addColumn({ name: 'squared', transformer: squareTransformer })
      .addRow({ original: 2, squared: 2 })
      .addRow({ original: 3, squared: 3 })
      .addRow({ original: 4, squared: 4 });

    // Render multiple times
    const firstRender = p.render();
    const secondRender = p.render();
    const thirdRender = p.render();

    // All renders should be identical
    expect(firstRender).toEqual(secondRender);
    expect(secondRender).toEqual(thirdRender);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    p.printTable();

    // Verify the values are squared only once (2²=4, 3²=9, 4²=16)
    // NOT squared multiple times (2²²=16, 3²²=81, 4²²=256)
    expect(renderedBody[0]).toContain('4');   // 2² = 4, not 2²² = 16
    expect(renderedBody[1]).toContain('9');   // 3² = 9, not 3²² = 81  
    expect(renderedBody[2]).toContain('16');  // 4² = 16, not 4²² = 256

    // Additional verification: check that we don't have the "double-squared" values
    expect(renderedBody[0]).not.toContain('16');  // Should not be 2²²
    expect(renderedBody[1]).not.toContain('81');  // Should not be 3²²
    expect(renderedBody[2]).not.toContain('256'); // Should not be 4²²

    expect(p.render()).toMatchSnapshot();
  });

  it('should not mutate original data when using transformers', () => {
    // This test ensures that the original data remains unchanged
    const doubleTransformer: ValueTransformer = (data: CellValue): CellValue => {
      return Number(data) * 2;
    };

    const originalData = [
      { id: 1, value: 5 },
      { id: 2, value: 10 },
      { id: 3, value: 15 }
    ];

    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn('id')
      .addColumn({ name: 'value', transformer: doubleTransformer });

    p.addRows(originalData);

    // Render multiple times
    p.render();
    p.render();
    p.render();

    // Verify original data is unchanged
    expect(originalData[0].value).toBe(5);   // Should still be 5, not 10 or 20
    expect(originalData[1].value).toBe(10);  // Should still be 10, not 20 or 40
    expect(originalData[2].value).toBe(15);  // Should still be 15, not 30 or 60

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    // But the rendered output should show transformed values
    expect(renderedBody[0]).toContain('10');  // 5 * 2 = 10
    expect(renderedBody[1]).toContain('20');  // 10 * 2 = 20
    expect(renderedBody[2]).toContain('30');  // 15 * 2 = 30

    expect(p.render()).toMatchSnapshot();
  });
});
