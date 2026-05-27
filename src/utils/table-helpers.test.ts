import {
  cellText,
  convertRawRowOptionsToStandard,
  createTableHorizontalBorders,
  createColumFromOnlyName,
  createRow,
  findLenOfColumn,
  createHeaderAsRow,
  getWidthLimitedColumnsArray,
  CreateRowFunction,
} from './table-helpers';
import { DEFAULT_ROW_SEPARATOR } from './table-constants';
import { ComputedColumn } from '../models/external-table';

describe('table-helpers', () => {
  describe('cellText', () => {
    it('should convert number to string', () => {
      expect(cellText(123)).toBe('123');
    });

    it('should handle undefined', () => {
      expect(cellText(undefined as any)).toBe('');
    });

    it('should handle null', () => {
      expect(cellText(null as any)).toBe('');
    });

    it('should return string as is', () => {
      expect(cellText('test')).toBe('test');
    });

    it('should convert bigint to string', () => {
      const value = (globalThis as any).BigInt('9007199254740993') as bigint;
      expect(cellText(value)).toBe('9007199254740993');
    });
  });

  describe('convertRawRowOptionsToStandard', () => {
    it('should return undefined for undefined input', () => {
      expect(convertRawRowOptionsToStandard(undefined)).toBeUndefined();
    });

    it('should use default separator when not provided', () => {
      expect(convertRawRowOptionsToStandard({ color: 'red' })).toEqual({
        color: 'red',
        separator: DEFAULT_ROW_SEPARATOR,
      });
    });

    it('should use provided separator', () => {
      expect(
        convertRawRowOptionsToStandard({ color: 'blue', separator: true })
      ).toEqual({
        color: 'blue',
        separator: true,
      });
    });
  });

  describe('createTableHorizontalBorders', () => {
    it('should create border with single column', () => {
      const style = { left: '╚', mid: '╩', right: '╝', other: '═' };
      expect(createTableHorizontalBorders(style, [5])).toBe('╚═══════╝');
    });

    it('should create border with multiple columns', () => {
      const style = { left: '╚', mid: '╩', right: '╝', other: '═' };
      expect(createTableHorizontalBorders(style, [3, 4])).toBe(
        '╚═════╩══════╝'
      );
    });
  });

  describe('createColumFromOnlyName', () => {
    it('should create column with name as title', () => {
      expect(createColumFromOnlyName('test')).toEqual({
        name: 'test',
        title: 'test',
      });
    });
  });

  describe('createRow', () => {
    it('should create row with provided properties', () => {
      const text = { col1: 'value1' };
      expect(createRow('red', text, true)).toEqual({
        color: 'red',
        separator: true,
        text,
      });
    });
  });

  describe('findLenOfColumn', () => {
    const rows = [
      { color: 'white', separator: false, text: { col1: 'short' } },
      { color: 'white', separator: false, text: { col1: 'longer text' } },
    ];

    it('should respect minLen', () => {
      const column = { name: 'col1', title: 'Col', minLen: 20 };
      expect(findLenOfColumn(column, rows)).toBe(20);
    });

    it('should find max length of content', () => {
      const column = { name: 'col1', title: 'Column 1' };
      expect(findLenOfColumn(column, rows)).toBe(11); // 'longer text' length including space
    });

    it('should handle maxLen constraint', () => {
      const column = { name: 'col1', title: 'Col', maxLen: 5 };
      expect(findLenOfColumn(column, rows)).toBe(6); // maxLen of 5 plus 1 for padding
    });
  });

  describe('createHeaderAsRow', () => {
    it('should create header row from columns', () => {
      const columns = [
        { name: 'col1', title: 'Column 1' },
        { name: 'col2', title: 'Column 2' },
      ];
      const createRowFn: CreateRowFunction = (
        color: string,
        text: any,
        separator: boolean
      ) => ({
        color,
        text,
        separator,
      });

      expect(createHeaderAsRow(createRowFn, columns)).toEqual({
        color: 'white_bold',
        separator: false,
        text: {
          col1: 'Column 1',
          col2: 'Column 2',
        },
      });
    });
  });

  describe('getWidthLimitedColumnsArray', () => {
    it('should split text into arrays based on column length', () => {
      const columns = [{ name: 'col1', title: 'Col 1', length: 5 }];
      const row = {
        color: 'white',
        separator: false,
        text: { col1: 'This is a long text' },
      };

      expect(getWidthLimitedColumnsArray(columns, row)).toEqual({
        col1: ['This', 'is a', 'long', 'text'],
      });
    });

    it('should handle undefined column length', () => {
      const columns = [{ name: 'col1', title: 'Col 1' }];
      const row = { color: 'white', separator: false, text: { col1: 'Short' } };

      expect(getWidthLimitedColumnsArray(columns, row)).toEqual({
        col1: ['Short'],
      });
    });
  });
});
