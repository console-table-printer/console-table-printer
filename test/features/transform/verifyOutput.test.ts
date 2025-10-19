import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';
import { Valuetransform, CellValue } from '../../../src/models/external-table';

describe('Testing transform functionality and verifying the output', () => {
  it('should verify transform is applied consistently', () => {
    const testTransform: Valuetransform = (value: CellValue) => {
      return `[${String(value).toUpperCase()}]`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'original' },
        { 
          name: 'transformed',
          transform: testTransform
        },
      ],
    });

    const testData = [
      { original: 'hello', transformed: 'hello' },
      { original: 'world', transformed: 'world' },
      { original: 'test', transformed: 'test' },
    ];

    p.addRows(testData);
    
    const bodyLines = getTableBody(p);
    
    bodyLines.forEach((line, index) => {
      const [, originalCol, transformedCol] = line.split('│');
      const original = originalCol.trim();
      const transformed = transformedCol.trim();
      
      expect(original).toBe(testData[index].original);
      expect(transformed).toBe(`[${testData[index].transformed.toUpperCase()}]`);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify numeric transforms maintain precision', () => {
    const precisionTransform: Valuetransform = (value: CellValue) => {
      return Number(value).toFixed(3);
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'label' },
        { 
          name: 'value',
          alignment: 'right',
          transform: precisionTransform
        },
      ],
    });

    const testData = [
      { label: 'PI', value: Math.PI },
      { label: 'E', value: Math.E },
      { label: 'SQRT2', value: Math.SQRT2 },
      { label: 'Integer', value: 42 },
    ];

    p.addRows(testData);
    
    const bodyLines = getTableBody(p);
    
    bodyLines.forEach((line, index) => {
      const [, , valueCol] = line.split('│');
      const transformedValue = valueCol.trim();
      const expectedValue = testData[index].value.toFixed(3);
      
      expect(transformedValue).toBe(expectedValue);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform with conditional logic', () => {
    const conditionalTransform: Valuetransform = (value: CellValue) => {
      const num = Number(value);
      if (num < 0) return '❌ Negative';
      if (num === 0) return '⚪ Zero';
      if (num > 0 && num < 10) return '✅ Small';
      return '🔵 Large';
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'description' },
        { 
          name: 'value',
          alignment: 'center'
        },
        { 
          name: 'category',
          transform: conditionalTransform
        },
      ],
    });

    const testData = [
      { description: 'Negative value', value: -5, category: -5 },
      { description: 'Zero value', value: 0, category: 0 },
      { description: 'Small positive', value: 3, category: 3 },
      { description: 'Large positive', value: 100, category: 100 },
    ];

    p.addRows(testData);
    
    const bodyLines = getTableBody(p);
    
    const expectedCategories = [
      '❌ Negative',
      '⚪ Zero',
      '✅ Small',
      '🔵 Large'
    ];
    
    bodyLines.forEach((line, index) => {
      const [, , , categoryCol] = line.split('│');
      const category = categoryCol.trim();
      expect(category).toBe(expectedCategories[index]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform does not affect sorting', () => {
    const displayTransform: Valuetransform = (value: CellValue) => {
      return `Score: ${value}`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'player' },
        { 
          name: 'score',
          transform: displayTransform
        },
      ],
      sort: (row1, row2) => Number(row2.score) - Number(row1.score),
    });

    p.addRows([
      { player: 'Alice', score: 50 },
      { player: 'Bob', score: 100 },
      { player: 'Charlie', score: 25 },
      { player: 'David', score: 75 },
    ]);
    
    const bodyLines = getTableBody(p);
    
    const expectedOrder = [
      ['Bob', 'Score: 100'],
      ['David', 'Score: 75'],
      ['Alice', 'Score: 50'],
      ['Charlie', 'Score: 25'],
    ];
    
    bodyLines.forEach((line, index) => {
      const [, playerCol, scoreCol] = line.split('│');
      expect(playerCol.trim()).toBe(expectedOrder[index][0]);
      expect(scoreCol.trim()).toBe(expectedOrder[index][1]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform works with computed columns', () => {
    const currencyTransform: Valuetransform = (value: CellValue) => {
      return `$${Number(value).toLocaleString()}`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'item' },
        { 
          name: 'price',
          transform: currencyTransform
        },
        { 
          name: 'quantity'
        },
      ],
      computedColumns: [
        {
          name: 'total',
          title: 'Total',
          function: (row) => {
            const total = Number(row.price) * Number(row.quantity);
            return currencyTransform(total);
          }
        }
      ],
    });

    p.addRows([
      { item: 'Laptop', price: 1200, quantity: 2 },
      { item: 'Mouse', price: 25, quantity: 5 },
      { item: 'Keyboard', price: 80, quantity: 3 },
    ]);
    
    const bodyLines = getTableBody(p);
    
    const expectedTotals = ['$2,400', '$125', '$240'];
    
    bodyLines.forEach((line, index) => {
      const columns = line.split('│');
      const total = columns[4].trim();
      expect(total).toBe(expectedTotals[index]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform handles special characters correctly', () => {
    const escapeTransform: Valuetransform = (value: CellValue) => {
      const str = String(value);
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'original' },
        { 
          name: 'escaped',
          transform: escapeTransform
        },
      ],
    });

    const testData = [
      { original: '<script>', escaped: '<script>' },
      { original: 'A & B', escaped: 'A & B' },
      { original: '"Quote"', escaped: '"Quote"' },
      { original: "It's", escaped: "It's" },
    ];

    p.addRows(testData);
    
    const bodyLines = getTableBody(p);
    
    const expectedEscaped = [
      '&lt;script&gt;',
      'A &amp; B',
      '&quot;Quote&quot;',
      'It&#039;s',
    ];
    
    bodyLines.forEach((line, index) => {
      const [, , escapedCol] = line.split('│');
      expect(escapedCol.trim()).toBe(expectedEscaped[index]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform with boolean values', () => {
    const boolTransform: Valuetransform = (value: CellValue) => {
      if (value === 'true' || value === true) return '✅ Yes';
      if (value === 'false' || value === false) return '❌ No';
      return '❓ Unknown';
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'feature' },
        { 
          name: 'enabled',
          transform: boolTransform,
          alignment: 'center'
        },
      ],
    });

    p.addRows([
      { feature: 'Dark Mode', enabled: true },
      { feature: 'Notifications', enabled: false },
      { feature: 'Auto-save', enabled: true },
      { feature: 'Beta Features', enabled: null },
    ]);
    
    const bodyLines = getTableBody(p);
    
    const expectedValues = ['✅ Yes', '❌ No', '✅ Yes', '❓ Unknown'];
    
    bodyLines.forEach((line, index) => {
      const [, , enabledCol] = line.split('│');
      expect(enabledCol.trim()).toBe(expectedValues[index]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform is isolated per column', () => {
    let column1Count = 0;
    let column2Count = 0;
    
    const transform1: Valuetransform = (value: CellValue) => {
      column1Count++;
      return `C1-${column1Count}: ${value}`;
    };
    
    const transform2: Valuetransform = (value: CellValue) => {
      column2Count++;
      return `C2-${column2Count}: ${value}`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { 
          name: 'col1',
          transform: transform1
        },
        { 
          name: 'col2',
          transform: transform2
        },
      ],
    });

    p.addRows([
      { col1: 'A', col2: 'X' },
      { col1: 'B', col2: 'Y' },
      { col1: 'C', col2: 'Z' },
    ]);
    
    p.render();
    
    expect(column1Count).toBe(3);
    expect(column2Count).toBe(3);
    
    const bodyLines = getTableBody(p);
    
    expect(bodyLines[0]).toContain('C1-1: A');
    expect(bodyLines[0]).toContain('C2-1: X');
    expect(bodyLines[2]).toContain('C1-3: C');
    expect(bodyLines[2]).toContain('C2-3: Z');

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform with empty and whitespace strings', () => {
    const trimTransform: Valuetransform = (value: CellValue) => {
      const str = String(value).trim();
      return str || '[EMPTY]';
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'label' },
        { 
          name: 'value',
          transform: trimTransform
        },
      ],
    });

    p.addRows([
      { label: 'Normal', value: 'text' },
      { label: 'Empty', value: '' },
      { label: 'Spaces', value: '   ' },
      { label: 'Padded', value: '  hello  ' },
    ]);
    
    const bodyLines = getTableBody(p);
    
    const expectedValues = ['text', '[EMPTY]', '[EMPTY]', 'hello'];
    
    bodyLines.forEach((line, index) => {
      const [, , valueCol] = line.split('│');
      expect(valueCol.trim()).toBe(expectedValues[index]);
    });

    expect(p.render()).toMatchSnapshot();
  });

  it('should verify transform with override behavior', () => {
    const globalTransform: Valuetransform = (value: CellValue) => {
      return `~${value}~`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { 
          name: 'withTransform',
          transform: globalTransform
        },
        { 
          name: 'overridden',
          transform: (v: CellValue) => `*${v}*`
        },
        { 
          name: 'noTransform'
        },
      ],
    });

    p.addRows([
      { 
        withTransform: 'test1', 
        overridden: 'test2', 
        noTransform: 'test3' 
      },
    ]);
    
    const bodyLines = getTableBody(p);
    const [, col1, col2, col3] = bodyLines[0].split('│');
    
    expect(col1.trim()).toBe('~test1~');
    expect(col2.trim()).toBe('*test2*');
    expect(col3.trim()).toBe('test3');

    expect(p.render()).toMatchSnapshot();
  });
});