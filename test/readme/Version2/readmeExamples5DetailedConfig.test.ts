import { Table } from '../../../index';

describe('Example: 5', () => {
  it('Detailed Configuration', () => {
    const salesTable = new Table({
      title: '📊 Sales Report Q4 2024', // A text showsup on top of table (optional)
      columns: [
        { name: 'region', alignment: 'left', color: 'blue' }, // with alignment and color
        { name: 'sales', alignment: 'right', maxLen: 30 }, // lines bigger than this will be splitted in multiple lines
        { name: 'growth', title: 'Growth %' }, // Title is what will be shown while printing, by default title = name
        { name: 'price', transform: (value) => `$${Number(value).toFixed(2)}` }, // Transform function to format cell values before display
      ],
      rows: [
        { region: 'North America', sales: '$2.5M', growth: '+15%' },
        { region: 'Europe', sales: '$1.8M', growth: '+8%' },
        { region: 'Asia Pacific', sales: '$3.2M', growth: '+22%' },
      ],
      sort: (row1, row2) => row2.sales - row1.sales, // sorting order of rows (optional), this is normal js sort function for Array.sort
      filter: (row) => row.growth > '+10%', // filtering rows (optional)
      enabledColumns: ['region', 'sales'], // array of columns that you want to see, all other will be ignored (optional)
      disabledColumns: ['growth'], // array of columns that you DONT want to see, these will always be hidden
      colorMap: {
        high_growth: '\x1b[32m', // define customized color
      },
      charLength: {
        '👋': 2,
        '😅': 2,
      }, // custom len of chars in console
      defaultColumnOptions: {
        alignment: 'center',
        color: 'red',
        maxLen: 40,
        minLen: 20,
      },
    });

    // print
    const returned = salesTable.printTable();
    expect(returned).toBeUndefined();
  });
});
