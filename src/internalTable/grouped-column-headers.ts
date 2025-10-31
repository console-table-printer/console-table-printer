import { Dictionary } from '../models/common';
import { GroupedColumnsHeader } from '../models/external-table';
import { Column } from '../models/internal-table';
import TableInternal from './internal-table';
import { renderTableInternal } from './internal-table-printer';

type TableTransformer = (input: string[]) => string[];

interface Placeholder {
  kind: 'PLACEHOLDER';
  width: number;
}

interface Group extends GroupedColumnsHeader {
  width: number;
}

type GroupOrPlaceholder = Group | Placeholder;

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
): GroupOrPlaceholder[] => {
  validateGroups(table);

  const normalized: GroupOrPlaceholder[] = materializePlaceholders(table);

  return normalized;
};

const validateGroups = (table: TableInternal): void => {
  ensureNoEmptyChildNames(table);
  ensureNoDuplicateEntryInChildNames(table);
  ensureNoSharedChildNameBetweenGroups(table);
  ensureAllChildNamesMatchColumnNames(table);
  ensureChildNamesAreConsecutiveInTableColumns(table);
};

const ensureNoEmptyChildNames = (table: TableInternal): void => {
  for (const group of table.groupedColumnsHeaders) {
    if (group.childNames.length > 0) {
      continue;
    }

    throw new Error(
      `Grouped columns header '${group.name}' must have at least one child name`
    );
  }
};

const ensureNoDuplicateEntryInChildNames = (table: TableInternal): void => {
  for (const group of table.groupedColumnsHeaders) {
    const seenChildNames: Set<string> = new Set();

    for (const childName of group.childNames) {
      if (!seenChildNames.has(childName)) {
        seenChildNames.add(childName);
        continue;
      }

      throw new Error(
        `Grouped columns header '${group.name}' has duplicate child name '${childName}'`
      );
    }
  }
};

const ensureNoSharedChildNameBetweenGroups = (table: TableInternal): void => {
  const seenChildNames: Set<string> = new Set();
  for (const group of table.groupedColumnsHeaders) {
    for (const childName of group.childNames) {
      if (!seenChildNames.has(childName)) {
        seenChildNames.add(childName);
        continue;
      }

      throw new Error(
        `Grouped columns header '${group.name}' has a child name '${childName}' that is already used in another group`
      );
    }
  }
};

const ensureAllChildNamesMatchColumnNames = (table: TableInternal): void => {
  const columnNamesSet: Set<string> = new Set(
    table.columns.map((col) => col.name)
  );

  for (const group of table.groupedColumnsHeaders) {
    for (const childName of group.childNames) {
      if (columnNamesSet.has(childName)) {
        continue;
      }

      throw new Error(
        `Grouped columns header '${group.name}' has a child name '${childName}' that does not match any existing column name`
      );
    }
  }
};

const ensureChildNamesAreConsecutiveInTableColumns = (
  table: TableInternal
): void => {
  const columns = table.columns;

  for (const group of table.groupedColumnsHeaders) {
    if (consecutiveColumnsIrrespectiveOfOrder(group, columns)) {
      continue;
    }

    throw new Error(
      `Grouped columns header '${group.name}' reference columns that are non-consecutive in the table`
    );
  }
};

const consecutiveColumnsIrrespectiveOfOrder = (
  group: GroupedColumnsHeader,
  columns: Column[]
): boolean => {
  const childIndices = group.childNames
    .map((childName) => columns.filter((col) => col.name === childName)[0])
    .map((col) => columns.indexOf(col));

  childIndices.sort((a, b) => a - b);

  for (let i = 1; i < childIndices.length; i++) {
    if (childIndices[i] !== childIndices[i - 1] + 1) {
      return false;
    }
  }

  return true;
};

const materializePlaceholders = (
  table: TableInternal
): GroupOrPlaceholder[] => {
  const groups: GroupOrPlaceholder[] = [];

  for (const column of table.columns) {
    const previousNormalizedGroup =
      groups.length > 0 ? groups[groups.length - 1] : undefined;

    if (
      previousNormalizedGroup !== undefined &&
      !('kind' in previousNormalizedGroup) &&
      previousNormalizedGroup.childNames.includes(column.name)
    ) {
      continue;
    }

    const group = table.groupedColumnsHeaders.find((gch) =>
      gch.childNames.includes(column.name)
    );

    if (group === undefined) {
      if (
        previousNormalizedGroup != undefined &&
        'kind' in previousNormalizedGroup
      ) {
        previousNormalizedGroup.width += 1;
        continue;
      }

      groups.push({
        kind: 'PLACEHOLDER',
        width: 1,
      });

      continue;
    }

    groups.push({
      ...group,
      width: group.childNames.length,
    });
  }

  return groups;
};

const AddHeaderTo = (
  gchTable: TableInternal,
  group: GroupOrPlaceholder,
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
