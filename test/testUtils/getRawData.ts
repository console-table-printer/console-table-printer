import { Table } from '../..';

export const ANSI_COLOR_CODES = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  white_bold: '\x1b[01m',
  reset: '\x1b[0m',
};

export const getAnsiColorCodes = (value: string) =>
  value.match(/\x1b\[[0-9;]*m/g) || [];

export const stripAnsiColorCodes = (value: string) =>
  value.replace(/\x1b\[[0-9;]*m/g, '');

export const getTableHeader = (table: Table) => {
  const rendered = table.render().split('\n');
  const separatorIndex = rendered.findIndex((line) => line.includes('│'));
  return rendered[separatorIndex];
};

export const getTableBody = (table: Table) => {
  const rendered = table.render().split('\n');
  // Find the separator line index
  const separatorIndex = rendered.findIndex((line) => line.includes('├'));
  // Return all lines after the separator until the footer
  return rendered.slice(separatorIndex + 1, -1);
};
