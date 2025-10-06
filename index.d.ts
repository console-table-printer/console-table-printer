// Console Table Printer Type Definitions
// This file manually exports all types and interfaces for the console-table-printer library

// ============================================================================
// MAIN EXPORTS
// ============================================================================

/**
 * Main Table class for creating and managing console tables
 */
export declare class Table {
  table: any; // TableInternal instance

  constructor(options?: ComplexOptions | string[]);

  /**
   * Add a single column to the table
   * @param column - Column name or configuration object
   * @returns The table instance for chaining
   */
  addColumn(column: string | ColumnOptionsRaw): Table;

  /**
   * Add multiple columns to the table
   * @param columns - Array of column names or configuration objects
   * @returns The table instance for chaining
   */
  addColumns(columns: string[] | ColumnOptionsRaw[]): Table;

  /**
   * Add a single row to the table
   * @param text - Row data object
   * @param rowOptions - Optional row styling options
   * @returns The table instance for chaining
   */
  addRow(text: Dictionary, rowOptions?: RowOptionsRaw): Table;

  /**
   * Add multiple rows to the table
   * @param toBeInsertedRows - Array of row data objects
   * @param rowOptions - Optional row styling options
   * @returns The table instance for chaining
   */
  addRows(toBeInsertedRows: any, rowOptions?: RowOptionsRaw): Table;

  /**
   * Print the table to the console
   */
  printTable(): void;

  /**
   * Render the table as a string without printing
   * @returns The rendered table string
   */
  render(): string;
}

/**
 * Print a simple table directly to the console
 * @param rows - Array of row data objects
 * @param tableOptions - Optional table configuration
 */
export declare function printTable(rows: any[], tableOptions?: ComplexOptions): void;

/**
 * Render a simple table as a string
 * @param rows - Array of row data objects
 * @param tableOptions - Optional table configuration
 * @returns The rendered table string
 */
export declare function renderTable(rows: any[], tableOptions?: ComplexOptions): string;

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Text alignment options
 */
export declare const ALIGNMENT: {
  readonly LEFT: "left";
  readonly CENTER: "center";
  readonly RIGHT: "right";
};

/**
 * Color options for text styling
 */
export declare const COLOR: {
  readonly BLACK: "black";
  readonly RED: "red";
  readonly GREEN: "green";
  readonly YELLOW: "yellow";
  readonly BLUE: "blue";
  readonly MAGENTA: "magenta";
  readonly CYAN: "cyan";
  readonly WHITE: "white";
  readonly GRAY: "gray";
  readonly GREY: "grey";
  readonly BRIGHT_RED: "bright_red";
  readonly BRIGHT_GREEN: "bright_green";
  readonly BRIGHT_YELLOW: "bright_yellow";
  readonly BRIGHT_BLUE: "bright_blue";
  readonly BRIGHT_MAGENTA: "bright_magenta";
  readonly BRIGHT_CYAN: "bright_cyan";
  readonly BRIGHT_WHITE: "bright_white";
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Text alignment type
 */
export type ALIGNMENT = "left" | "center" | "right";

/**
 * Color type for text styling
 */
export type COLOR = 
  | "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey"
  | "bright_red" | "bright_green" | "bright_yellow" | "bright_blue" | "bright_magenta" | "bright_cyan" | "bright_white";

/**
 * Generic dictionary type for row data
 */
export interface Dictionary {
  [key: string]: any;
}

/**
 * Character length mapping for special characters (e.g., emojis)
 */
export interface CharLengthDict {
  [key: string]: number;
}

/**
 * Internal row representation
 */
export interface Row {
  color: COLOR;
  separator: boolean;
  text: Dictionary;
}

/**
 * Configuration options for a table column
 */
export interface ColumnOptionsRaw {
  /** Unique identifier for the column */
  name: string;
  /** Display name for the column header. If not provided, uses the name property */
  title?: string;
  /** Text alignment within the column: 'left', 'center', or 'right' */
  alignment?: ALIGNMENT;
  /** Text color for the column content */
  color?: COLOR;
  /** Maximum length of text in the column. Longer text will be wrapped to multiple lines */
  maxLen?: number;
  /** Minimum length of text in the column. Shorter text will be padded with spaces */
  minLen?: number;
}

/**
 * Configuration for a computed column that generates values dynamically
 */
export interface ComputedColumn extends ColumnOptionsRaw {
  /** Function that computes the column value for each row
   * @param arg0 - The current row data object
   * @param index - The index of the current row in the data array
   * @param array - The complete array of row data
   * @returns The computed value for this column
   */
  function: (arg0: any, index: number, array: any[]) => any;
}

/**
 * Function type for sorting table rows
 * @param row1 - First row to compare
 * @param row2 - Second row to compare
 * @returns Negative number if row1 should come before row2, positive if row2 should come before row1, 0 if equal
 */
export type RowSortFunction = (row1: any, row2: any) => number;

/**
 * Function type for filtering table rows
 * @param row - The row data to evaluate
 * @returns True if the row should be included, false if it should be filtered out
 */
export type RowFilterFunction = (row: any) => boolean;

/**
 * Default styling options applied to all columns unless overridden
 */
export interface DefaultColumnOptions {
  /** Default text alignment for all columns */
  alignment?: ALIGNMENT;
  /** Default text color for all columns */
  color?: COLOR;
  /** Default title prefix for all columns */
  title?: string;
  /** Default maximum length for all columns */
  maxLen?: number;
  /** Default minimum length for all columns */
  minLen?: number;
}

/**
 * Complete configuration options for table creation and styling
 */
export interface ComplexOptions {
  /** Table styling configuration including borders and colors */
  style?: TableStyleDetails;
  /** Title displayed at the top of the table */
  title?: string;
  /** Array of column configurations */
  columns?: ColumnOptionsRaw[];
  /** Initial data rows for the table */
  rows?: Dictionary[];
  /** Function to sort rows before display */
  sort?: RowSortFunction;
  /** Function to filter rows before display */
  filter?: RowFilterFunction;
  /** Array of column names to include (all others will be hidden) */
  enabledColumns?: string[];
  /** Array of column names to exclude (these will always be hidden) */
  disabledColumns?: string[];
  /** Array of computed columns that generate values dynamically */
  computedColumns?: ComputedColumn[];
  /** Whether to add separator lines between rows */
  rowSeparator?: boolean;
  /** Whether to disable color output (useful for non-color terminals) */
  shouldDisableColors?: boolean;
  /** Custom color mapping for special characters or values */
  colorMap?: ColorMap;
  /** Custom character length mapping for special characters (e.g., emojis) */
  charLength?: CharLengthDict;
  /** Default options applied to all columns unless overridden */
  defaultColumnOptions?: DefaultColumnOptions;
}

/**
 * Row styling options in raw format
 */
export interface RowOptionsRaw {
  /** Text color for the row */
  color?: string;
  /** Whether to add a separator line after this row */
  separator?: boolean;
}

/**
 * Standardized row styling options
 */
export interface RowOptions {
  /** Text color for the row */
  color: COLOR;
  /** Whether to add a separator line after this row */
  separator: boolean;
}

/**
 * Internal column representation
 */
export interface Column {
  name: string;
  title: string;
  alignment?: ALIGNMENT;
  color?: COLOR;
  length?: number;
  minLen?: number;
  maxLen?: number;
}

/**
 * Table border style configuration
 */
export interface TableStyleDetails {
  headerTop: BorderStyle;
  headerBottom: BorderStyle;
  tableBottom: BorderStyle;
  vertical: string;
}

/**
 * Border style configuration
 */
export interface BorderStyle {
  left: string;
  mid: string;
  right: string;
  other: string;
}

/**
 * Custom color mapping for special characters or values
 */
export interface ColorMap {
  [key: string]: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Utility type for creating a table with specific options
 */
export type TableOptions = ComplexOptions | string[];

/**
 * Utility type for row data that can be added to a table
 */
export type TableRow = Dictionary;

/**
 * Utility type for column configuration
 */
export type TableColumn = string | ColumnOptionsRaw; 