/**
 * Throughput Performance Tests
 *
 * This test suite measures the throughput (operations per second) of console-table-printer
 * operations to ensure the library can handle high-frequency usage scenarios efficiently.
 *
 * Test Categories:
 * - Table Creation Throughput: Tests how many table instances can be created per second
 * - Row Addition Throughput: Tests row addition operations per second
 * - Render Operation Throughput: Tests table rendering operations per second
 * - Print Operation Throughput: Tests table printing operations per second
 * - printTable Function Throughput: Tests the main printTable function throughput
 * - Complex Operations Throughput: Tests complex workflows and configurations
 * - Stress Testing Throughput: Tests sustained load and rapid operations
 * - Edge Cases Throughput: Tests edge cases for throughput performance
 *
 * Throughput Thresholds:
 * - Table creations: 1000 ops/sec
 * - Row additions: 10000 ops/sec
 * - Render operations: 100 ops/sec
 * - Print operations: 50 ops/sec
 * - Bulk operations: 20 ops/sec
 *
 * Methodology:
 * - Measures operations completed within a fixed time window (default: 1 second)
 * - Calculates operations per second for throughput measurement
 * - Uses performance.now() for high-precision timing
 * - Captures console output to prevent test output pollution
 * - Tests different data sizes and complexities
 *
 * Throughput Calculation:
 * - Runs operations continuously for a specified duration
 * - Counts total operations completed
 * - Calculates ops/sec = (operations / duration_ms) * 1000
 * - Accounts for actual execution time vs target duration
 *
 * Usage:
 * Run with: yarn test test/performance/throughput.test.ts
 *
 * Note: Throughput may vary based on system performance and current load.
 * These tests provide relative performance indicators rather than absolute benchmarks.
 *
 * @author Performance Test Suite
 * @version 1.0.0
 */

import { printTable, Table } from '../../index';

describe('Throughput Performance Tests', () => {
  // Add retry configuration for all tests in this suite
  jest.retryTimes(2); // This means each test will run up to 3 times (initial + 2 retries)

  // Throughput thresholds
  const THROUGHPUT_LIMITS = {
    tableCreationsPerSecond: 1000, // 1000 table creations per second
    rowAdditionsPerSecond: 10000, // 10000 row additions per second
    renderOperationsPerSecond: 100, // 100 render operations per second
    printOperationsPerSecond: 50, // 50 print operations per second
    bulkOperationsPerSecond: 20, // 20 bulk operations per second
  };

  // Test datasets
  const createSmallDataset = () => [
    { id: 1, name: 'Alice', score: 100 },
    { id: 2, name: 'Bob', score: 95 },
    { id: 3, name: 'Charlie', score: 87 },
  ];

  const createMediumDataset = () =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      score: Math.floor(Math.random() * 1000),
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
    }));

  const createLargeDataset = () =>
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      score: Math.floor(Math.random() * 1000),
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      department: ['Engineering', 'Sales', 'Marketing', 'HR'][
        Math.floor(Math.random() * 4)
      ],
    }));

  // Helper function to measure throughput
  const measureThroughput = (
    operation: () => void,
    durationMs: number = 1000
  ): number => {
    const start = performance.now();
    let operations = 0;

    while (performance.now() - start < durationMs) {
      operation();
      operations++;
    }

    const actualDuration = performance.now() - start;
    return (operations / actualDuration) * 1000; // operations per second
  };

  // Helper function to capture console output
  const captureConsoleOutput = (operation: () => void): void => {
    const originalLog = console.log;
    console.log = jest.fn();
    operation();
    console.log = originalLog;
  };

  describe('Table Creation Throughput', () => {
    it('should create tables at high throughput', () => {
      const throughput = measureThroughput(() => new Table());

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.tableCreationsPerSecond
      );
      console.log(
        `Table creation throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should create configured tables at reasonable throughput', () => {
      const throughput = measureThroughput(
        () =>
          new Table({
            title: 'Test Table',
            columns: [
              { name: 'id', alignment: 'right' },
              { name: 'name', alignment: 'center' },
            ],
          })
      );

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.tableCreationsPerSecond * 0.1
      ); // 10% of basic creation
      console.log(
        `Configured table creation throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Row Addition Throughput', () => {
    it('should add single rows at high throughput', () => {
      const table = new Table();
      const throughput = measureThroughput(() => {
        table.addRow({ id: 1, name: 'Test', value: 100 });
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.rowAdditionsPerSecond
      );
      console.log(
        `Single row addition throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should add rows with options at reasonable throughput', () => {
      const table = new Table();
      const throughput = measureThroughput(() => {
        table.addRow({ id: 1, name: 'Test', value: 100 }, { color: 'green' });
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.rowAdditionsPerSecond * 0.5
      ); // 50% of basic addition
      console.log(
        `Row addition with options throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should add bulk rows at reasonable throughput', () => {
      const table = new Table();
      const smallData = createSmallDataset();
      const throughput = measureThroughput(() => {
        table.addRows(smallData);
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.bulkOperationsPerSecond
      );
      console.log(
        `Bulk row addition throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Render Operation Throughput', () => {
    it('should render small tables at high throughput', () => {
      const table = new Table();
      table.addRows(createSmallDataset());

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => table.render());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.renderOperationsPerSecond
      );
      console.log(
        `Small table render throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should render medium tables at reasonable throughput', () => {
      const table = new Table();
      table.addRows(createMediumDataset());

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => table.render());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.renderOperationsPerSecond * 0.1
      ); // 10% of small table
      console.log(
        `Medium table render throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should render large tables at acceptable throughput', () => {
      const table = new Table();
      table.addRows(createLargeDataset());

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => table.render());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.renderOperationsPerSecond * 0.01
      ); // 1% of small table
      console.log(
        `Large table render throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Print Operation Throughput', () => {
    it('should print small tables at reasonable throughput', () => {
      const table = new Table();
      table.addRows(createSmallDataset());

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => table.printTable());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond
      );
      console.log(
        `Small table print throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should print medium tables at acceptable throughput', () => {
      const table = new Table();
      table.addRows(createMediumDataset());

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => table.printTable());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond * 0.1
      ); // 10% of small table
      console.log(
        `Medium table print throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('printTable Function Throughput', () => {
    it('should handle printTable at reasonable throughput', () => {
      const smallData = createSmallDataset();
      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => printTable(smallData));
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond
      );
      console.log(
        `printTable function throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should handle printTable with medium data at acceptable throughput', () => {
      const mediumData = createMediumDataset();
      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => printTable(mediumData));
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond * 0.1
      );
      console.log(
        `printTable with medium data throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Complex Operations Throughput', () => {
    it('should handle table creation and population at reasonable throughput', () => {
      const smallData = createSmallDataset();
      const throughput = measureThroughput(() => {
        const table = new Table();
        table.addRows(smallData);
        captureConsoleOutput(() => table.printTable());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.bulkOperationsPerSecond
      );
      console.log(
        `Full table workflow throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should handle configured tables with sorting at acceptable throughput', () => {
      const mediumData = createMediumDataset();
      const throughput = measureThroughput(() => {
        const table = new Table({
          title: 'Sorted Table',
          sort: (a, b) => b.score - a.score,
        });
        table.addRows(mediumData);
        captureConsoleOutput(() => table.printTable());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.bulkOperationsPerSecond * 0.1
      );
      console.log(
        `Configured table with sorting throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should handle tables with filtering at acceptable throughput', () => {
      const mediumData = createMediumDataset();
      const throughput = measureThroughput(() => {
        const table = new Table({
          title: 'Filtered Table',
          filter: (row) => row.score > 500,
        });
        table.addRows(mediumData);
        captureConsoleOutput(() => table.printTable());
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.bulkOperationsPerSecond * 0.1
      );
      console.log(
        `Table with filtering throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Stress Testing Throughput', () => {
    it('should maintain throughput under sustained load', () => {
      const smallData = createSmallDataset();
      const durations: number[] = [];

      // Run multiple throughput measurements
      for (let i = 0; i < 5; i++) {
        const throughput = measureThroughput(() => {
          captureConsoleOutput(() => printTable(smallData));
        }, 500); // 500ms per measurement

        durations.push(throughput);
      }

      // Calculate average and variance
      const avgThroughput =
        durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance =
        durations.reduce(
          (acc, val) => acc + Math.pow(val - avgThroughput, 2),
          0
        ) / durations.length;
      const stdDev = Math.sqrt(variance);

      // Throughput should be consistent (low variance)
      expect(stdDev).toBeLessThan(avgThroughput * 0.3); // Standard deviation should be less than 30% of average
      expect(avgThroughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond
      );

      console.log(
        `Sustained load average throughput: ${avgThroughput.toFixed(2)} ops/sec, Std Dev: ${stdDev.toFixed(2)}`
      );
    });

    it('should handle rapid successive operations', () => {
      const table = new Table();
      const operations: (() => void)[] = [
        () => table.addRow({ id: 1, name: 'Test', value: 100 }),
        () => table.addRow({ id: 2, name: 'Test2', value: 200 }),
        () => table.render(),
        () => table.printTable(),
      ];

      let totalOperations = 0;
      const start = performance.now();

      // Perform rapid successive operations
      for (let i = 0; i < 100; i++) {
        const operation = operations[i % operations.length];
        captureConsoleOutput(operation);
        totalOperations++;
      }

      const duration = performance.now() - start;
      const throughput = (totalOperations / duration) * 1000;

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.bulkOperationsPerSecond
      );
      console.log(
        `Rapid successive operations throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });
  });

  describe('Edge Cases Throughput', () => {
    it('should handle empty datasets at high throughput', () => {
      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => printTable([]));
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond * 2
      ); // Should be very fast
      console.log(`Empty dataset throughput: ${throughput.toFixed(2)} ops/sec`);
    });

    it('should handle single row datasets at high throughput', () => {
      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => printTable([{ id: 1, name: 'Single' }]));
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond
      );
      console.log(
        `Single row dataset throughput: ${throughput.toFixed(2)} ops/sec`
      );
    });

    it('should handle wide datasets at reasonable throughput', () => {
      const wideData = Array.from({ length: 10 }, (_, i) => ({
        col1: `data${i}`,
        col2: `data${i}`,
        col3: `data${i}`,
        col4: `data${i}`,
        col5: `data${i}`,
        col6: `data${i}`,
        col7: `data${i}`,
        col8: `data${i}`,
        col9: `data${i}`,
        col10: `data${i}`,
      }));

      const throughput = measureThroughput(() => {
        captureConsoleOutput(() => printTable(wideData));
      });

      expect(throughput).toBeGreaterThan(
        THROUGHPUT_LIMITS.printOperationsPerSecond * 0.5
      );
      console.log(`Wide dataset throughput: ${throughput.toFixed(2)} ops/sec`);
    });
  });
});
