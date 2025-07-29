import { Table } from '../index';
import {
  ValueTransformer,
  CellValue,
  ComplexOptions,
} from '../src/models/external-table';

describe('Table Data Transformers Tests', () => {
  it('should render transformed table correctly', () => {
    const testData = [
      { firstName: 'John', lastName: 'Doe', salary: 50000 },
      { firstName: 'Jane', lastName: 'Smith', salary: 60000 },
    ];
    const tranformer: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toFixed(2);

    const options = {
      columns: [
        { name: 'firstName' },
        { name: 'lastName' },
        { name: 'salary', transformer: tranformer },
      ],
      computedColumns: [
        {
          name: 'fullName',
          title: 'Full Name',
          function: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          name: 'taxed_salary',
          title: 'After Tax',
          function: (row) => (row.salary * 0.8).toFixed(2),
        },
      ],
    } as ComplexOptions;

    const table = new Table(options);

    table.addRows(testData);

    const rendered = table.render();
    expect(rendered).toMatchSnapshot();
    table.printTable();
  });

  it('should not transform data when print multiple times', () => {
    const testData = [
      { firstName: 'John', lastName: 'Doe', salary: 50000 },
      { firstName: 'Jane', lastName: 'Smith', salary: 60000 },
    ];
    const tranformer: ValueTransformer = (data: CellValue): CellValue =>
      Number(data).toFixed(2);

    const options = {
      columns: [
        { name: 'firstName' },
        { name: 'lastName' },
        { name: 'salary', transformer: tranformer },
      ],
      computedColumns: [
        {
          name: 'fullName',
          title: 'Full Name',
          function: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          name: 'taxed_salary',
          title: 'After Tax',
          function: (row) => (row.salary * 0.8).toFixed(2),
        },
      ],
    } as ComplexOptions;

    const table = new Table(options);

    table.addRows(testData);

    const firstRendered = table.render();
    const secondRendered = table.render();
    expect(firstRendered).toMatchSnapshot();
    expect(secondRendered).toMatchSnapshot();
    expect(firstRendered).toEqual(secondRendered);
    table.printTable();
  });
});
