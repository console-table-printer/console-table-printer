import { Dictionary } from '../models/common';
import { GroupedColumnsHeaderOrPlaceholder } from '../models/external-table';
import TableInternal from './internal-table';
import { renderTableInternal } from './internal-table-printer';

type TableTransformer = (input: string[]) => string[];

export const enrichWithGroupedColumnsHeaders = (
  table: TableInternal
): TableTransformer => {
  // Create a temporary table to render the grouped columns headers
  // and benefit from the existing rendering logic
  const gchTable = new TableInternal();

  let currentAsciiPos = 0;
  let columnIndex = 0;
  let wasPreviousGroupAPlaceHolder: boolean | undefined = undefined;

  const groups = normalizeGroupedColumnsHeaders(table);

  if (groups.length === 1 && 'kind' in groups[0]) {
    // Only placeholders. Let's return early.
    return (input) => {
      return input;
    };
  }

  // Depending on the grouped columns headers configuration and the existing columns,
  // create a map of where to fix the top border of the existing table.
  //
  // This map will also be used to rewrite the top border of the grouped columns headers table.
  //
  // - p: placeholder start (when exists, occurs only at the beginning of the table)
  // - P: placeholder end (when exists, occurs only at the end of the table)
  // - g: group start
  // - G: group end
  // - M: group middle
  const fixupsMap: [number, string][] = [];

  for (let g = 0; g < groups.length; g++) {
    const group = groups[g];

    let renderedGroupAsciiWidth = 0;
    for (let i = 0; i < group.width; i++) {
      renderedGroupAsciiWidth += table.columns[columnIndex + i].length! + 3;
    }

    columnIndex += group.width;

    if ('kind' in group) {
      if (wasPreviousGroupAPlaceHolder === undefined) {
        fixupsMap.push([currentAsciiPos, 'p']);
      } else if (wasPreviousGroupAPlaceHolder === false) {
        fixupsMap.push([currentAsciiPos, 'G']);
      }
      wasPreviousGroupAPlaceHolder = true;
    } else {
      if (wasPreviousGroupAPlaceHolder === undefined) {
        fixupsMap.push([currentAsciiPos, 'g']);
      } else if (wasPreviousGroupAPlaceHolder === true) {
        fixupsMap.push([currentAsciiPos, 'g']);
      } else if (wasPreviousGroupAPlaceHolder === false) {
        fixupsMap.push([currentAsciiPos, 'M']);
      }
      wasPreviousGroupAPlaceHolder = false;
    }

    currentAsciiPos += renderedGroupAsciiWidth;

    AddHeaderTo(gchTable, group, renderedGroupAsciiWidth - 3);
  }

  if (wasPreviousGroupAPlaceHolder === true) {
    fixupsMap.push([currentAsciiPos, 'P']);
  } else if (wasPreviousGroupAPlaceHolder === false) {
    fixupsMap.push([currentAsciiPos, 'G']);
  }

  const gch = renderGroupedColumnsHeaders(table, gchTable, fixupsMap);

  applyTableStyleToFixUps(table, fixupsMap);

  const transformer: TableTransformer = (input: string[]) => {
    for (let i = 0; i < fixupsMap.length; i++) {
      const fix = fixupsMap[i];
      input[0] =
        input[0].substring(0, fix[0]) + fix[1] + input[0].substring(fix[0] + 1);
    }

    input.unshift(gch[0], gch[1]);

    return input;
  };

  return transformer;
};

const normalizeGroupedColumnsHeaders = (
  table: TableInternal
): GroupedColumnsHeaderOrPlaceholder[] => {
  // deep copy to avoid mutating the original input
  const normalized = table.groupedColumnsHeaders.map((gch) => ({ ...gch }));

  addATrailingPlaceholderIfNeeded(normalized, table.columns.length);

  mergeConsecutivePlaceholders(normalized);

  const totalWidth = evaluateTotalWidth(normalized);

  if (totalWidth > table.columns.length) {
    throw new Error(
      `Grouped columns width (${totalWidth}) exceeds total columns width (${table.columns.length})`
    );
  }

  return normalized;
};

const addATrailingPlaceholderIfNeeded = (
  groups: GroupedColumnsHeaderOrPlaceholder[],
  numberOfColumns: number
): void => {
  const totalGroupHeadersWidth = evaluateTotalWidth(groups);

  if (numberOfColumns <= totalGroupHeadersWidth) {
    return;
  }

  groups.push({
    kind: 'PLACEHOLDER',
    width: numberOfColumns - totalGroupHeadersWidth,
  });
};

const mergeConsecutivePlaceholders = (
  groups: GroupedColumnsHeaderOrPlaceholder[]
): void => {
  if (groups.length < 2) {
    return;
  }

  let pos = 0;
  while (pos < groups.length - 1) {
    const current = groups[pos];
    const next = groups[pos + 1];

    if ('kind' in current && 'kind' in next) {
      current.width += next.width;
      groups.splice(pos + 1, 1);
      continue;
    }

    pos += 1;
  }
};

const AddHeaderTo = (
  gchTable: TableInternal,
  group: GroupedColumnsHeaderOrPlaceholder,
  columnMaxLen: number
) => {
  const colName = 'kind' in group ? '' : group.name;

  gchTable.addColumn({
    name: colName,
    maxLen: columnMaxLen,
  });

  const column = gchTable.columns[gchTable.columns.length - 1];

  if (!('kind' in group)) {
    column.alignment = group.alignment ?? 'center';
  }

  // Fill the row with spaces to ensure the header column has
  // a width equal to all the grouped columns
  const colOptions: Dictionary = {};
  colOptions[colName] = ' '.repeat(columnMaxLen);
  gchTable.addRow(colOptions);
};

const evaluateTotalWidth = (groups: GroupedColumnsHeaderOrPlaceholder[]) => {
  return groups.reduce((a, b) => a + b.width, 0);
};

const renderGroupedColumnsHeaders = (
  table: TableInternal,
  groupedColumnsHeadersTable: TableInternal,
  fixupsMap: [number, string][]
) => {
  const gch = renderTableInternal(groupedColumnsHeadersTable);

  gch[0] = '';

  for (let i = 0; i < fixupsMap.length; i++) {
    const state = fixupsMap[i][1];

    switch (state) {
      case 'p':
        gch[1] = ' ' + gch[1].substring(1);
        break;

      case 'g': {
        gch[0] += ' '.repeat(fixupsMap[i][0] - gch[0].length);
        gch[0] += table.tableStyle.headerTop.left;
        break;
      }
      case 'G':
        gch[0] += table.tableStyle.headerTop.other.repeat(
          fixupsMap[i][0] - gch[0].length
        );
        gch[0] += table.tableStyle.headerTop.right;
        break;

      case 'P':
        gch[1] = gch[1].substring(0, gch[1].length - 1) + ' ';
        break;

      case 'M':
        gch[0] += table.tableStyle.headerTop.other.repeat(
          fixupsMap[i][0] - gch[0].length
        );
        gch[0] += table.tableStyle.headerTop.mid;
        break;

      default:
        throw new Error(`Unexpected state '${state}'`);
    }
  }

  return gch;
};

const applyTableStyleToFixUps = (
  table: TableInternal,
  fixupsMap: [number, string][]
) => {
  for (let i = 1; i < fixupsMap.length - 1; i++) {
    fixupsMap[i][1] = table.tableStyle.headerBottom.mid; // ╬
  }

  const leftFix = fixupsMap[0];
  leftFix[1] =
    leftFix[1] == 'p'
      ? table.tableStyle.headerTop.left // ╔
      : table.tableStyle.headerBottom.left; // ╟

  const rightFix = fixupsMap[fixupsMap.length - 1];
  rightFix[1] =
    rightFix[1] == 'P'
      ? table.tableStyle.headerTop.right // ╗
      : table.tableStyle.headerBottom.right; // ╢
};
