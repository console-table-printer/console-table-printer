import Table from './src/console-table-printer';
import {
  printSimpleTable as printTable,
  renderSimpleTable as renderTable,
} from './src/internalTable/internal-table-printer';

import {
  COLOR,
  ALIGNMENT,
  ValueTransformer,
  CellValue,
} from './src/models/external-table';

export {
  Table,
  printTable,
  renderTable,
  COLOR,
  ALIGNMENT,
  ValueTransformer,
  CellValue,
};
