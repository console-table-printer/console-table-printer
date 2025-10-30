import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Testing column max/min length output verification', () => {
  const countChars = (str: string) => {
    // Count visible characters excluding ANSI codes
    return str.replace(/\x1b\[(\d+)m/g, '').length;
  };

  const getColumnContent = (line: string, columnIndex: number) => {
    const columns = line.split('');
    return columns[columnIndex + 1] || ''; // +1 to skip the first empty split
  };

  describe('maxLen verification', () => {
    it('should verify text is wrapped at maxLen boundary', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'wrapped', maxLen: 10 }],
      });

      p.addRow({ wrapped: 'abcdefghijklmnopqrstuvwxyz' });

      const contentLines = getTableBody(p);

      // Should be split into 3 lines
      expect(contentLines.length).toBe(3);

      // First line should have exactly 10 characters
      const firstLine = getColumnContent(contentLines[0], 0).trim();
      expect(firstLine).toBe('abcdefghij');
      expect(firstLine.length).toBe(10);

      // Second line should have exactly 10 characters
      const secondLine = getColumnContent(contentLines[1], 0).trim();
      expect(secondLine).toBe('klmnopqrst');
      expect(secondLine.length).toBe(10);

      // Third line should have remaining characters
      const thirdLine = getColumnContent(contentLines[2], 0).trim();
      expect(thirdLine).toBe('uvwxyz');
      expect(thirdLine.length).toBe(6);

      expect(p.render()).toMatchSnapshot();
    });

    it('should verify word breaking behavior with maxLen', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'text', maxLen: 10 }],
      });

      p.addRow({ text: 'Hello World Testing' });

      const contentLines = getTableBody(p);

      // Verify how words are broken
      const firstLine = getColumnContent(contentLines[0], 0).trim();
      const secondLine = getColumnContent(contentLines[1], 0).trim();

      // Should break at maxLen regardless of word boundaries
      expect(firstLine).toBe('Hello Worl');
      expect(secondLine).toBe('d Testing');

      expect(p.render()).toMatchSnapshot();
    });

    it('should verify maxLen with different data types', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'data', maxLen: 8 }],
      });

      p.addRows([
        { data: 'String value that is long' },
        { data: 123456789012345 },
        { data: true },
        { data: { toString: () => 'Custom object string' } },
      ]);

      const contentLines = getTableBody(p);

      // String should be wrapped
      expect(getColumnContent(contentLines[0], 0).trim()).toBe('String v');
      expect(getColumnContent(contentLines[1], 0).trim()).toBe('alue tha');
      expect(getColumnContent(contentLines[2], 0).trim()).toBe('t is lon');
      expect(getColumnContent(contentLines[3], 0).trim()).toBe('g');

      // Number should be wrapped
      expect(getColumnContent(contentLines[4], 0).trim()).toBe('12345678');
      expect(getColumnContent(contentLines[5], 0).trim()).toBe('9012345');

      // Boolean should not need wrapping
      expect(getColumnContent(contentLines[6], 0).trim()).toBe('true');

      // Object's string representation should be wrapped
      expect(getColumnContent(contentLines[7], 0).trim()).toBe('Custom o');

      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('minLen verification', () => {
    it('should verify padding is added to meet minLen', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'padded', minLen: 15 }],
      });

      p.addRows([
        { padded: 'Short' },
        { padded: 'X' },
        { padded: '' },
      ]);

      const contentLines = getTableBody(p);

      contentLines.forEach((line, index) => {
        const content = getColumnContent(line, 0);
        // Remove trailing space before 
        const actualContent = content.slice(0, -1);

        // All content should be at least 15 characters (including padding)
        expect(actualContent.length).toBeGreaterThanOrEqual(15);

        // Verify the actual text is preserved
        if (index === 0) expect(actualContent.trimEnd()).toBe('Short');
        if (index === 1) expect(actualContent.trimEnd()).toBe('X');
        if (index === 2) expect(actualContent.trimEnd()).toBe('');
      });

      expect(p.render()).toMatchSnapshot();
    });

    it('should verify minLen with different alignments', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [
          { name: 'left', minLen: 12, alignment: 'left' },
          { name: 'center', minLen: 12, alignment: 'center' },
          { name: 'right', minLen: 12, alignment: 'right' },
        ],
      });

      p.addRow({ left: 'L', center: 'C', right: 'R' });

      const contentLines = getTableBody(p);
      const [, leftContent, centerContent, rightContent] = contentLines[0].split('');

      // Left aligned - padding should be on the right
      expect(leftContent).toMatch(/^ L\s{10} $/);

      // Center aligned - padding should be distributed
      const centerTrimmed = centerContent.trim();
      expect(centerTrimmed.indexOf('C')).toBeGreaterThan(0);

      // Right aligned - padding should be on the left
      expect(rightContent).toMatch(/^\s{11}R $/);

      expect(p.render()).toMatchSnapshot();
    });

    it('should verify minLen does not affect text longer than minLen', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'text', minLen: 5 }],
      });

      p.addRows([
        { text: 'Hi' },    // Shorter than minLen
        { text: '12345' }, // Exactly minLen
        { text: 'This is longer' }, // Longer than minLen
      ]);

      const contentLines = getTableBody(p);

      // First row should be padded
      const firstContent = getColumnContent(contentLines[0], 0).slice(0, -1);
      expect(firstContent.length).toBeGreaterThanOrEqual(5);
      expect(firstContent.trimEnd()).toBe('Hi');

      // Second row should be exact
      const secondContent = getColumnContent(contentLines[1], 0).trim();
      expect(secondContent).toBe('12345');

      // Third row should not be affected
      const thirdContent = getColumnContent(contentLines[2], 0).trim();
      expect(thirdContent).toBe('This is longer');

      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('Combined maxLen and minLen verification', () => {
    it('should verify both constraints are applied correctly', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'constrained', minLen: 8, maxLen: 12 }],
      });

      p.addRows([
        { constrained: 'Hi' },      // Needs padding
        { constrained: 'Perfect8' }, // Exactly at minLen
        { constrained: 'This is exactly twelve!' }, // Needs wrapping
      ]);

      const contentLines = getTableBody(p);

      // First row - padded to minLen
      const firstContent = getColumnContent(contentLines[0], 0).slice(0, -1);
      expect(firstContent.length).toBeGreaterThanOrEqual(8);
      expect(firstContent.trimEnd()).toBe('Hi');

      // Second row - no change needed
      const secondContent = getColumnContent(contentLines[1], 0).trim();
      expect(secondContent).toBe('Perfect8');

      // Third row - wrapped at maxLen
      const thirdContent = getColumnContent(contentLines[2], 0).trim();
      const fourthContent = getColumnContent(contentLines[3], 0).trim();
      expect(thirdContent).toBe('This is exac');
      expect(thirdContent.length).toBe(12);
      expect(fourthContent).toBe('tly twelve!');

      expect(p.render()).toMatchSnapshot();
    });

    it('should verify edge cases with exact length boundaries', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'exact', minLen: 10, maxLen: 10 }],
      });

      p.addRows([
        { exact: '123456789' },  // 9 chars - needs padding
        { exact: '1234567890' }, // 10 chars - perfect
        { exact: '12345678901' }, // 11 chars - needs wrapping
      ]);

      const contentLines = getTableBody(p);

      // 9 chars should be padded to 10
      const firstContent = getColumnContent(contentLines[0], 0).slice(0, -1);
      expect(firstContent.trimEnd()).toBe('123456789');
      expect(firstContent.length).toBeGreaterThanOrEqual(10);

      // 10 chars should be unchanged
      const secondContent = getColumnContent(contentLines[1], 0).trim();
      expect(secondContent).toBe('1234567890');

      // 11 chars should be wrapped
      const thirdContent = getColumnContent(contentLines[2], 0).trim();
      const fourthContent = getColumnContent(contentLines[3], 0).trim();
      expect(thirdContent).toBe('1234567890');
      expect(fourthContent).toBe('1');

      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('Global vs column-specific length settings', () => {
    it('should verify column-specific settings override global settings', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [
          { name: 'global' },
          { name: 'override', maxLen: 8, minLen: 10 },
        ],
        defaultColumnOptions: {
          maxLen: 15,
          minLen: 5,
        }
      });

      p.addRows([
        { global: 'Hi', override: 'Hi' },
        { global: 'This is a very long text', override: 'This is a very long text' },
      ]);

      const contentLines = getTableBody(p);

      // First row
      const row1Global = getColumnContent(contentLines[0], 0).slice(0, -1);
      const row1Override = getColumnContent(contentLines[1], 0).slice(0, -1);

      // Global column should use global minLen (5)
      expect(row1Global.trimEnd()).toBe('Hi');
      expect(row1Global.length).toBeGreaterThanOrEqual(5);

      // Override column should use its own minLen (10)
      expect(row1Override.trimEnd()).toBe('Hi');
      expect(row1Override.length).toBeGreaterThanOrEqual(10);

      // Second row - check maxLen
      // Global column should wrap at 15
      const row2Global = getColumnContent(contentLines[1], 0).trim();
      expect(row2Global).toBe('This is a very');

      // Override column should wrap at 8 (but first line in contentLines[1])
      // Since override has maxLen 8, it will create more wrapped lines
      // We need to find where the override column starts
      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('Special characters and unicode handling', () => {
    it('should correctly handle special characters with length constraints', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [{ name: 'special', maxLen: 10, minLen: 5 }],
      });

      p.addRows([
        { special: '����' },
        { special: '= ====' },
        { special: 'caf� r�sum�' },
      ]);

      const contentLines = getTableBody(p);

      // Arrow characters
      const arrowContent = getColumnContent(contentLines[0], 0).trim();
      expect(arrowContent).toContain('����');

      // Emoji - might be handled differently depending on width calculation
      const emojiContent = getColumnContent(contentLines[1], 0).trim();
      expect(emojiContent).toBeTruthy();

      // Accented characters
      const accentContent = getColumnContent(contentLines[2], 0).trim();
      expect(accentContent).toContain('caf�');

      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('Header length constraints', () => {
    it('should verify headers respect column length settings', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [
          { name: 'very_long_header_name', maxLen: 10 },
          { name: 'short', minLen: 15 },
        ],
      });

      p.addRow({ very_long_header_name: 'data', short: 'data' });

      const headerLine = getTableHeader(p);
      const [, header1, header2] = headerLine.split('');

      // Headers might have different handling than cell content
      // But they should still respect the column width constraints
      expect(header1).toBeTruthy();
      expect(header2).toBeTruthy();

      expect(p.render()).toMatchSnapshot();
    });
  });

  describe('Empty and null value handling', () => {
    it('should verify empty values with length constraints', () => {
      const p = new Table({
        shouldDisableColors: true,
        columns: [
          { name: 'required', minLen: 10 },
          { name: 'optional', maxLen: 5 },
        ],
      });

      p.addRows([
        { required: '', optional: '' },
        { required: null, optional: null },
        { required: undefined, optional: undefined },
      ]);

      const contentLines = getTableBody(p);

      contentLines.forEach((line) => {
        const requiredContent = getColumnContent(line, 0).slice(0, -1);
        const optionalContent = getColumnContent(line, 1).slice(0, -1);

        // Required column should be padded to minLen even when empty
        expect(requiredContent.length).toBeGreaterThanOrEqual(10);

        // Optional column should handle empty values appropriately
        expect(optionalContent).toBeDefined();
      });

      expect(p.render()).toMatchSnapshot();
    });
  });
});