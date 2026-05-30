import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Header Title Tests: Rendering', () => {
  it('should render column titles instead of column names', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'employeeId', title: 'ID' },
        { name: 'fullName', title: 'Full Name' },
        { name: 'score' },
      ],
    });

    table.addRow({ employeeId: 1, fullName: 'Ana Bell', score: 42 });

    expect(getTableHeader(table)).toEqual('│ ID │ Full Name │ score │');
    expect(getTableBody(table)).toEqual(['│  1 │  Ana Bell │    42 │']);
  });

  it('should render an empty string title as a blank header cell', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'internalId', title: '' },
        { name: 'status', title: 'Current Status' },
      ],
    });

    table.addRow({ internalId: 1, status: 'Ready' });

    expect(getTableHeader(table)).toEqual('│   │ Current Status │');
    expect(getTableBody(table)).toEqual(['│ 1 │          Ready │']);
  });

  it('should size and align body cells using the header title width', () => {
    const table = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'name', title: 'Display Name', alignment: 'left' },
        { name: 'amount', title: 'Amount', alignment: 'right', minLen: 8 },
      ],
    });

    table.addRow({ name: 'Ana', amount: 5 });

    expect(getTableHeader(table)).toEqual('│ Display Name │   Amount │');
    expect(getTableBody(table)).toEqual(['│ Ana          │        5 │']);
  });
});
