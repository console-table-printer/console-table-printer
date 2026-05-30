<h1 align="center">console-table-printer</h1>

> 🖥️🍭 Printing pretty tables in your console

![NPM Downloads](https://img.shields.io/npm/dw/console-table-printer)
[![install size](https://packagephobia.com/badge?p=console-table-printer)](https://packagephobia.com/result?p=console-table-printer)
[![npm version](https://badge.fury.io/js/console-table-printer.svg)](https://badge.fury.io/js/console-table-printer)
[![codecov](https://codecov.io/gh/console-table-printer/console-table-printer/graph/badge.svg?token=SWX9VBuYUs)](https://codecov.io/gh/console-table-printer/console-table-printer)

## Synopsis

Print simple tables with colored rows in your console. It's useful when you want to present tables in console output using JS.

## Installation

```bash
npm install console-table-printer --save
```

## Basic Example

```typescript
import { printTable } from 'console-table-printer';

// Create a simple task list
const tasks = [
  { id: 1, task: 'Fix login bug', priority: 'High', status: 'In Progress' },
  { id: 2, task: 'Update documentation', priority: 'Medium', status: 'Done' },
  { id: 3, task: 'Add unit tests', priority: 'High', status: 'Todo' },
];

// Print the table
printTable(tasks);
```

![Screenshot](https://cdn.jsdelivr.net/gh/console-table-printer/console-table-printer@master/static-resources/Example-1-basic.png)

## 🚨🚨Announcement🚨🚨 Official documentation has moved [here](https://console-table.netlify.app/docs)

You can also create a Table instance and print it:

```typescript
import { Table } from 'console-table-printer';

// Create a game leaderboard
const leaderboard = new Table();

// Add players with their scores
leaderboard.addRow({ rank: 1, player: 'Alice', score: 1250, level: 'Master' });
leaderboard.addRow({ rank: 2, player: 'Bob', score: 1180, level: 'Expert' });
leaderboard.addRows([
  { rank: 3, player: 'Charlie', score: 1050, level: 'Advanced' },
  { rank: 4, player: 'Diana', score: 920, level: 'Intermediate' },
]);

// Print the leaderboard
leaderboard.printTable();
```

![Screenshot](https://cdn.jsdelivr.net/gh/console-table-printer/console-table-printer@master/static-resources/Example-2-instance.png)

You can also add color to your table like this:

```typescript
import { Table } from 'console-table-printer';

const p = new Table();
p.addRow({ item: 'Pizza', price: 12.99, rating: '5/5' }, { color: 'red' });
p.addRow({ item: 'Burger', price: 8.99, rating: '4/5' }, { color: 'green' });
p.addRow({ item: 'Ramen', price: 15.99, rating: '5/5' }, { color: 'yellow' });
p.addRow({ item: 'Salad', price: 6.99, rating: '3/5' }, { color: 'cyan' });
p.printTable();
```

![Screenshot](https://cdn.jsdelivr.net/gh/console-table-printer/console-table-printer@master/static-resources/Example-3-color.png)

You can also configure column properties (color/alignment/title).

```typescript
import { Table } from 'console-table-printer';

const p = new Table({
  title: 'Project Status',
  columns: [
    { name: 'id', alignment: 'left', color: 'blue' },
    { name: 'project', alignment: 'left' },
    { name: 'status', title: 'Current Status' },
  ],
  colorMap: {
    urgent: '\x1b[31m',
    on_track: '\x1b[32m',
  },
});

p.addRow({ id: 1, project: 'Website Redesign', status: 'On Track' }, { color: 'on_track' });
p.addRow({ id: 2, project: 'Mobile App', status: 'Behind Schedule' }, { color: 'urgent' });
p.addRow({ id: 3, project: 'API Integration', status: 'Completed' }, { color: 'green' });

p.printTable();
```

![Screenshot](https://cdn.jsdelivr.net/gh/console-table-printer/console-table-printer@master/static-resources/Example-4-columns.png)

## CLI

There is also a CLI tool for printing tables directly in the terminal: [table-printer-cli](https://www.npmjs.com/package/table-printer-cli)

## Documentation

Official documentation has moved here: [console-table-documentation](https://console-table.netlify.app)

### Table instance creation

Three ways to create a Table instance:

1. Simplest way: `new Table()`

2. With column names only: `new Table(['column1', 'column2', 'column3'])`

3. Detailed table instance creation:

```typescript
import { Table } from 'console-table-printer';

new Table({
  title: '📊 Sales Report Q4 2024', // Text shown above the table (optional)
  columns: [
    { name: 'region', alignment: 'left', color: 'blue' }, // with alignment and color
    { name: 'sales', alignment: 'right', maxLen: 30 }, // lines bigger than this will be split into multiple lines
    { name: 'growth', title: 'Growth %' }, // Title is shown while printing; by default, title = name
    { name: 'price', transform: (value) => `$${Number(value).toFixed(2)}` }, // Transform function to format cell values before display
  ],
  rows: [
    { region: 'North America', sales: '$2.5M', growth: '+15%' },
    { region: 'Europe', sales: '$1.8M', growth: '+8%' },
    { region: 'Asia Pacific', sales: '$3.2M', growth: '+22%' },
  ],
  sort: (row1, row2) => row2.sales - row1.sales, // sorting order of rows (optional), using the same comparator shape as Array.sort
  filter: (row) => row.growth > '+10%', // filtering rows (optional)
  enabledColumns: ['region', 'sales'], // array of columns that you want to see; all others will be ignored (optional)
  disabledColumns: ['growth'], // array of columns that you don't want to see, these will always be hidden
  colorMap: {
    high_growth: '\x1b[32m', // define a custom color
  },
  charLength: {
    '👋': 2,
    '😅': 2,
  }, // custom character widths in the console
  defaultColumnOptions: {
    alignment: 'center',
    color: 'red',
    maxLen: 40,
    minLen: 20,
  },
});
```

### Functions

- `addRow(rowObject, options)` Adds a single row. This can be chained.
- `addRows(rowObjects, options)` Adds multiple rows. This accepts an array of row objects. In this case, options will be applied to all rows.
- `clearRows()` Removes all rows while keeping the table columns and options. This can be chained.
- `addColumn(columnObject)` Adds a single column.
- `addColumns(columnObjects)` Adds multiple columns.
- `printTable()` Prints the table in your console.

### Possible `color` values for rows

Check docs: [color-vals](https://console-table.netlify.app/docs/doc-color)

Example usage: To create a blue row

```typescript
table.addRow(rowObject, { color: 'blue' });
```

Example usage: To apply blue to all rows

```typescript
table.addRows(rowsArray, { color: 'blue' });
```

### Possible `alignment` values for columns

Check docs: [alignment-vals](https://console-table.netlify.app/docs/doc-alignment)

### TypeScript Support

You can get color and alignment as types. Check docs: [types-docs](https://console-table.netlify.app/docs/doc-typescript)

## License

[MIT](https://github.com/console-table-printer/console-table-printer/blob/master/LICENSE)
