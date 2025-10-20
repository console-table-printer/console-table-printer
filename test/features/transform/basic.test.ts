import { Table } from '../../../index';

describe('Basic Transform Functionality', () => {
  it('should apply simple string transform', () => {
    const p = new Table({
      columns: [
        { name: 'original', alignment: 'left' },
        {
          name: 'uppercase',
          alignment: 'left',
          transform: (value) => String(value).toUpperCase()
        },
      ],
    });

    p.addRow({ original: 'hello', uppercase: 'hello' });
    p.addRow({ original: 'world', uppercase: 'world' });
    p.addRow({ original: 'test', uppercase: 'test' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should apply currency transform to numbers', () => {
    const p = new Table({
      columns: [
        { name: 'item', alignment: 'left' },
        {
          name: 'price',
          alignment: 'right',
          transform: (value) => `$${Number(value).toFixed(2)}`
        },
      ],
    });

    p.addRow({ item: 'Coffee', price: 3.5 });
    p.addRow({ item: 'Sandwich', price: 7.99 });
    p.addRow({ item: 'Water', price: 1 });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should combine transform with column colors', () => {
    const p = new Table({
      columns: [
        { name: 'status', alignment: 'left', color: 'green' },
        {
          name: 'code',
          alignment: 'center',
          color: 'blue',
          transform: (value) => `[${value}]`
        },
        {
          name: 'value',
          alignment: 'right',
          color: 'yellow',
          transform: (value) => `${value}%`
        },
      ],
    });

    p.addRow({ status: 'Success', code: 200, value: 100 });
    p.addRow({ status: 'Partial', code: 206, value: 75 });
    p.addRow({ status: 'Failed', code: 500, value: 0 });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should apply transforms to multiple columns independently', () => {
    const p = new Table({
      columns: [
        {
          name: 'firstName',
          transform: (value) => String(value).toUpperCase()
        },
        {
          name: 'lastName',
          transform: (value) => String(value).toLowerCase()
        },
        {
          name: 'age',
          alignment: 'right'
        },
      ],
    });

    p.addRows([
      { firstName: 'John', lastName: 'DOE', age: 30 },
      { firstName: 'jane', lastName: 'SMITH', age: 25 },
      { firstName: 'Bob', lastName: 'WILSON', age: 35 },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should transform boolean values to readable text', () => {
    const p = new Table({
      columns: [
        { name: 'feature', alignment: 'left' },
        {
          name: 'enabled',
          alignment: 'center',
          transform: (value) => value ? 'YES' : 'NO'
        },
      ],
    });

    p.addRows([
      { feature: 'Dark Mode', enabled: true },
      { feature: 'Notifications', enabled: false },
      { feature: 'Auto-save', enabled: true },
      { feature: 'Sync', enabled: false },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should work with row colors and transforms', () => {
    const p = new Table({
      columns: [
        { name: 'id', alignment: 'left' },
        {
          name: 'score',
          alignment: 'right',
          transform: (value) => `${value} pts`
        },
      ],
    });

    p.addRow({ id: 'Player 1', score: 100 }, { color: 'green' });
    p.addRow({ id: 'Player 2', score: 85 }, { color: 'blue' });
    p.addRow({ id: 'Player 3', score: 92 }, { color: 'yellow' });

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle transforms with different alignments', () => {
    const p = new Table()
      .addColumn({
        name: 'left',
        alignment: 'left',
        transform: (value) => `<<${value}>>`
      })
      .addColumn({
        name: 'center',
        alignment: 'center',
        transform: (value) => `~~${value}~~`
      })
      .addColumn({
        name: 'right',
        alignment: 'right',
        transform: (value) => `[[${value}]]`
      });

    p.addRows([
      { left: 'A', center: 'B', right: 'C' },
      { left: 'Short', center: 'Medium Text', right: 'Very Long Text' },
      { left: '123', center: '456', right: '789' },
    ]);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });

  it('should maintain original data when using transforms', () => {
    const p = new Table({
      columns: [
        { name: 'original' },
        {
          name: 'transformed',
          transform: (value) => `Modified: ${value}`
        },
      ],
    });

    p.addRows([
      { original: 'data1', transformed: 'data1' },
      { original: 'data2', transformed: 'data2' },
    ]);

    // Render multiple times to ensure transform is idempotent
    const firstRender = p.render();
    const secondRender = p.render();

    expect(firstRender).toEqual(secondRender);

    p.printTable();
    expect(p.render()).toMatchSnapshot();
  });
});
