import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';
import { Valuetransform } from '../../../src/models/external-table';

describe('Transform Tests: Rendering', () => {
  it('should render basic number transform', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'product', alignment: 'left' },
        {
          name: 'price',
          alignment: 'right',
          transform: (value) => `$${Number(value).toFixed(2)}`,
        },
      ],
    });

    p.addRows([
      { product: 'Apple', price: 1.5 },
      { product: 'Banana', price: 0.75 },
      { product: 'Orange', price: 2.25 },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ product │ price │');
    expect(renderedBody).toEqual([
      '│ Apple   │ $1.50 │',
      '│ Banana  │ $0.75 │',
      '│ Orange  │ $2.25 │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render string transform with uppercase', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        {
          name: 'username',
          transform: (value) => String(value).toUpperCase(),
        },
        {
          name: 'email',
          transform: (value) => String(value).toLowerCase(),
        },
      ],
    });

    p.addRows([
      { username: 'john_doe', email: 'JOHN@EXAMPLE.COM' },
      { username: 'jane_smith', email: 'Jane.Smith@EXAMPLE.COM' },
      { username: 'bob_wilson', email: 'Bob@EXAMPLE.COM' },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│   username │                  email │');
    expect(renderedBody).toEqual([
      '│   JOHN_DOE │       john@example.com │',
      '│ JANE_SMITH │ jane.smith@example.com │',
      '│ BOB_WILSON │        bob@example.com │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render date transform', () => {
    const dateTransform: Valuetransform = (value) => {
      const date = new Date(String(value));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'event' },
        {
          name: 'date',
          transform: dateTransform,
        },
      ],
    });

    p.addRows([
      { event: 'Meeting', date: '2024-01-15' },
      { event: 'Conference', date: '2024-02-28' },
      { event: 'Workshop', date: '2024-03-10' },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│      event │         date │');
    expect(renderedBody).toEqual([
      '│    Meeting │ Jan 15, 2024 │',
      '│ Conference │ Feb 28, 2024 │',
      '│   Workshop │ Mar 10, 2024 │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should render percentage transform', () => {
    const percentTransform: Valuetransform = (value) => {
      const percent = (Number(value) * 100).toFixed(1);
      return `${percent}%`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'metric' },
        {
          name: 'value',
          alignment: 'right',
          transform: percentTransform,
        },
      ],
    });

    p.addRows([
      { metric: 'CPU Usage', value: 0.65 },
      { metric: 'Memory Usage', value: 0.823 },
      { metric: 'Disk Usage', value: 0.457 },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    expect(renderedHeader).toEqual('│       metric │ value │');

    expect(renderedBody).toEqual([
      '│    CPU Usage │ 65.0% │',
      '│ Memory Usage │ 82.3% │',
      '│   Disk Usage │ 45.7% │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should handle transform with null and undefined values', () => {
    const safeTransform: Valuetransform = (value) => {
      if (value === null || value === undefined) {
        return 'N/A';
      }
      return String(value).toUpperCase();
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'id' },
        {
          name: 'status',
          transform: safeTransform,
        },
      ],
    });

    p.addRows([
      { id: 1, status: 'active' },
      { id: 2, status: null },
      { id: 3, status: undefined },
      { id: 4, status: 'pending' },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];

    expect(renderedHeader).toEqual('│ id │  status │');
    expect(renderedBody).toEqual([
      '│  1 │  ACTIVE │',
      '│  2 │     N/A │',
      '│  3 │     N/A │',
      '│  4 │ PENDING │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should apply multiple transforms to different columns', () => {
    const p = new Table({
      shouldDisableColors: true,
      columns: [
        {
          name: 'name',
          transform: (v) => String(v).toUpperCase(),
        },
        {
          name: 'age',
          transform: (v) => `${v} years`,
        },
        {
          name: 'salary',
          alignment: 'right',
          transform: (v) => {
            const formatted = Number(v).toLocaleString('en-US');
            return `$${formatted}`;
          },
        },
        {
          name: 'active',
          transform: (v) => (v ? '✓' : '✗'),
        },
      ],
    });

    p.addRows([
      { name: 'John', age: 30, salary: 50000, active: true },
      { name: 'Jane', age: 28, salary: 65000, active: false },
      { name: 'Bob', age: 35, salary: 80000, active: true },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│ name │      age │  salary │ active │');
    expect(renderedBody).toEqual([
      '│ JOHN │ 30 years │ $50,000 │      ✓ │',
      '│ JANE │ 28 years │ $65,000 │      ✗ │',
      '│  BOB │ 35 years │ $80,000 │      ✓ │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });

  it('should preserve original data when rendering multiple times', () => {
    let callCount = 0;
    const countingTransform: Valuetransform = (value) => {
      callCount++;
      return `Call ${callCount}: ${value}`;
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'id' },
        {
          name: 'value',
          transform: countingTransform,
        },
      ],
    });

    p.addRows([
      { id: 1, value: 'first' },
      { id: 2, value: 'second' },
    ]);

    const firstRender = p.render();
    callCount = 0;
    const secondRender = p.render();

    expect(firstRender).toEqual(secondRender);
    expect(p.render()).toMatchSnapshot();
  });

  it('should handle complex object transform', () => {
    const objectTransform: Valuetransform = (value) => {
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return String(value);
    };

    const p = new Table({
      shouldDisableColors: true,
      columns: [
        { name: 'type' },
        {
          name: 'data',
          transform: objectTransform,
        },
      ],
    });

    p.addRows([
      { type: 'Simple', data: 'text' },
      { type: 'Number', data: 42 },
      { type: 'Object', data: { key: 'value' } },
      { type: 'Array', data: [1, 2, 3] },
    ]);

    const [renderedHeader, renderedBody] = [getTableHeader(p), getTableBody(p)];
    expect(renderedHeader).toEqual('│   type │            data │');
    expect(renderedBody).toEqual([
      '│ Simple │            text │',
      '│ Number │              42 │',
      '│ Object │ {"key":"value"} │',
      '│  Array │         [1,2,3] │',
    ]);

    expect(p.render()).toMatchSnapshot();
  });
});
