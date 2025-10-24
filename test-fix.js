const { Table } = require('./dist/src/index');

const p = new Table({
  columns: [
    { name: 'item', alignment: 'left' },
    {
      name: 'price',
      alignment: 'right',
      transform: (value) => `$${Number(value).toFixed(2)}`,
      maxLen: 80,
    },
  ],
});

p.addRows([
  { item: 'Coffee', price: 3.5 },
  { item: 'Sandwich', price: 7.99 },
  { item: 'Water', price: 1 },
]);

console.log('With maxLen: 80 (after fix - should use minimal width):');
p.printTable();

// Test without maxLen for comparison
const p2 = new Table({
  columns: [
    { name: 'item', alignment: 'left' },
    {
      name: 'price',
      alignment: 'right',
      transform: (value) => `$${Number(value).toFixed(2)}`,
    },
  ],
});

p2.addRows([
  { item: 'Coffee', price: 3.5 },
  { item: 'Sandwich', price: 7.99 },
  { item: 'Water', price: 1 },
]);

console.log('\nWithout maxLen (for comparison):');
p2.printTable();