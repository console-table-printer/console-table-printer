import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Testing add columns and verifying the output', () => {
  [20, 30, 40, 50, 60, 100].forEach((len) => {
    it(`should handle columns with maxLen constraint ${len}`, () => {
      const columnName = `taskNoteMax${len}`;

      const p = new Table({
        shouldDisableColors: true,
      })
        .addColumn({ name: columnName, maxLen: len })
        .addColumn({ name: 'unwrappedTaskNote' });

      p.addRow({
        [columnName]: 'This task note should wrap at the configured width',
        unwrappedTaskNote: 'This task note should keep its full width',
        emptyColumn: '',
      });

      const contentLines = getTableBody(p);

      p.printTable();

      const paddingSize = 2;

      contentLines.forEach((line) => {
        // Verify the truncated column's content length
        const truncatedContent = line.split('│')[1];
        expect(truncatedContent.length).toBeLessThanOrEqual(len + paddingSize);
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  [20, 30, 40, 50, 60, 100].forEach((len) => {
    it(`should handle columns with minLen constraint ${len}`, () => {
      const columnName = `paddedTaskNote:minLen:${len}`;

      const p = new Table({
        shouldDisableColors: true,
      })
        .addColumn({ name: columnName, minLen: len })
        .addColumn({ name: 'unpaddedTaskNote' })
        .addRows([
          {
            [columnName]: 'This task note should be padded',
            unpaddedTaskNote: 'This task note keeps natural width',
            emptyColumn: '',
          },
          {
            [columnName]: 'This task note should be padded again',
            unpaddedTaskNote: 'This task note keeps natural width again',
            emptyColumn: '',
          },
          {
            [columnName]: 'This task note should be padded again and again',
            unpaddedTaskNote:
              'This task note keeps natural width again and again',
            emptyColumn: '',
          },
        ]);
      const contentLines = getTableBody(p);

      p.printTable();

      const paddingSize = 2;

      contentLines.forEach((line) => {
        // Verify the truncated column's content length
        const truncatedContent = line.split('│')[1];
        expect(truncatedContent.length).toBeGreaterThanOrEqual(
          len + paddingSize
        );
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  [15, 20, 30].forEach((fixedLen) => {
    it(`should handle column with fixed length ${fixedLen} (minLen = maxLen)`, () => {
      const p = new Table({
        shouldDisableColors: true,
      }).addColumn({
        name: `fixedWidth:${fixedLen}`,
        minLen: fixedLen,
        maxLen: fixedLen,
      });

      // Test various content lengths
      const testData = [
        { input: 'short', description: 'shorter than fixed length' },
        { input: 'x'.repeat(fixedLen), description: 'exactly fixed length' },
        {
          input: 'this fixed-width task note needs wrapping',
          description: 'longer than fixed length',
        },
      ];

      testData.forEach(({ input }) => {
        p.addRow({ [`fixedWidth:${fixedLen}`]: input });
      });

      const contentLines = getTableBody(p);
      const headerLine = getTableHeader(p);
      const paddingSize = 2; // Account for standard padding

      p.printTable();

      // All lines should have exactly the same length
      const expectedLength = Math.max(fixedLen + paddingSize);
      contentLines.forEach((line) => {
        const content = line.split('│')[1];
        expect(content.length).toBe(expectedLength);
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  [10, 5].forEach((fixedLen) => {
    it(`should handle column with fixed length ${fixedLen} (minLen = maxLen), but headers are longer`, () => {
      const p = new Table({
        shouldDisableColors: true,
      }).addColumn({
        name: `fixedWidth:${fixedLen}`,
        minLen: fixedLen,
        maxLen: fixedLen,
      });

      // Test various content lengths
      const testData = [
        { input: 'short', description: 'shorter than fixed length' },
        { input: 'x'.repeat(fixedLen), description: 'exactly fixed length' },
        {
          input: 'this fixed-width task note needs wrapping',
          description: 'longer than fixed length',
        },
      ];

      testData.forEach(({ input }) => {
        p.addRow({ [`fixedWidth:${fixedLen}`]: input });
      });

      const contentLines = getTableBody(p);
      const headerLine = getTableHeader(p);
      const paddingSize = 2; // Account for standard padding

      p.printTable();

      // All lines should have exactly the same length
      const expectedLength = Math.max(fixedLen + paddingSize);
      contentLines.forEach((line) => {
        const content = line.split('│')[1];
        const headerLength = headerLine.split('│')[1].length;
        expect(content.length).toBe(Math.max(headerLength, expectedLength));
      });

      expect(p.render()).toMatchSnapshot();
    });
  });

  [
    { min: 10, max: 15 },
    { min: 15, max: 25 },
    { min: 20, max: 30 },
    { min: 30, max: 40 },
  ].forEach(({ min, max }) => {
    it(`should handle column with minLen ${min} and maxLen ${max}`, () => {
      const columnName = `taskNote${min}to${max}`;

      const p = new Table({
        shouldDisableColors: true,
      }).addColumn({
        name: columnName,
        minLen: min,
        maxLen: max,
      });

      // Test various content lengths
      const testData = [
        { input: 'short', description: 'shorter than minLen' },
        { input: 'x'.repeat(min), description: 'exactly minLen' },
        {
          input: 'this bounded task note needs wrapping',
          description: 'longer than maxLen',
        },
      ];

      testData.forEach(({ input }) => {
        p.addRow({ [columnName]: input });
      });

      const contentLines = getTableBody(p);
      const paddingSize = 2; // Account for standard padding

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

  it('should make sure each column is what its expected to be', () => {
    const p = new Table({
      shouldDisableColors: true,
    })
      .addColumn({
        name: 'reviewState',
        alignment: 'center',
        color: 'blue',
        title: 'Review State',
      })
      .addColumn('reviewOwner')
      .addRow({ reviewState: 'Approved', reviewOwner: 'Dana' });

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ Review State │ reviewOwner │');
    expect(renderedBody).toEqual(['│   Approved   │        Dana │']);

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify that addColumn adds a new column while preserving existing data', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    // Add initial columns and data
    p.addColumns(['task', 'owner']).addRows([
      { task: 'Docs', owner: 'Ana' },
      { task: 'API', owner: 'Ben' },
    ]);

    // Add a new column
    p.addColumn('status');
    p.addRows([{ task: 'Release', owner: 'Cam', status: 'Done' }]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    // Verify header structure
    const headerParts = renderedHeader.split('│').map((part) => part.trim());
    expect(headerParts).toContain('status');
    expect(renderedBody).toHaveLength(3); // Three rows

    // Verify body structure and content
    const lastRowParts = renderedBody[2].split('│').map((part) => part.trim());
    const firstRowParts = renderedBody[0].split('│').map((part) => part.trim());
    const secondRowParts = renderedBody[1]
      .split('│')
      .map((part) => part.trim());

    // Check empty spaces in first two rows' last column
    expect(firstRowParts[3]).toBe('');
    expect(secondRowParts[3]).toBe('');

    // Check the value in the last row's last column
    expect(lastRowParts[3]).toBe('Done');

    // Verify all rows have correct number of columns
    expect(firstRowParts.length).toBe(5); // Including empty parts at start/end
    expect(secondRowParts.length).toBe(5);
    expect(lastRowParts.length).toBe(5);

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify addColumn with custom column properties', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    p.addColumns(['task']).addRows([{ task: 'Prepare' }]);

    // Add a column with alignment and title
    p.addColumn({
      name: 'durationMinutes',
      alignment: 'right',
      title: 'Duration',
    });
    p.addRows([{ task: 'Build', durationMinutes: '45' }]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    const headerParts = renderedHeader.split('│').map((part) => part.trim());
    const bodyParts = renderedBody[1].split('│').map((part) => part.trim());

    // Verify custom title is used
    expect(headerParts).toContain('Duration');
    // Verify right alignment (value should be at the end of its cell)
    expect(bodyParts[2]).toBe('45');

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify addColumn with multiple data types', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    p.addColumn('rowLabel').addRows([{ rowLabel: 'baseline' }]);

    // Add a column and test different data types
    p.addColumn('renderedValue');
    p.addRows([
      { rowLabel: 'number row', renderedValue: 123 },
      { rowLabel: 'boolean row', renderedValue: true },
      { rowLabel: 'null row', renderedValue: null },
      { rowLabel: 'undefined row', renderedValue: undefined },
    ]);

    const renderedBody = getTableBody(p);
    const rows = renderedBody.map((row) =>
      row.split('│').map((part) => part.trim())
    );

    // Verify different data types are rendered correctly
    expect(rows[1][2]).toBe('123'); // number
    expect(rows[2][2]).toBe('true'); // boolean
    expect(rows[3][2]).toBe(''); // null
    expect(rows[4][2]).toBe(''); // undefined

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify addColumn maintains column order', () => {
    const p = new Table({
      shouldDisableColors: true,
    });

    // Add columns in sequence
    p.addColumn('stepName');
    p.addColumn('stepOwner');
    p.addColumn('stepStatus');

    p.addRows([{ stepName: 'Design', stepOwner: 'Mira', stepStatus: 'Ready' }]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    const headerParts = renderedHeader.split('│').map((part) => part.trim());
    const bodyParts = renderedBody[0].split('│').map((part) => part.trim());

    // Verify column order is maintained
    expect(headerParts[1]).toBe('stepName');
    expect(headerParts[2]).toBe('stepOwner');
    expect(headerParts[3]).toBe('stepStatus');

    // Verify data order matches column order
    expect(bodyParts[1]).toBe('Design');
    expect(bodyParts[2]).toBe('Mira');
    expect(bodyParts[3]).toBe('Ready');

    expect(p.render()).toMatchSnapshot();
  });
});
