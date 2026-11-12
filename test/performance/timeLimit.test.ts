/**
 * Time Limit Performance Tests
 *
 * This test suite measures the execution time of various console-table-printer operations
 * to ensure they complete within acceptable time limits for different table sizes and complexities.
 *
 * Test Categories:
 * - printTable Performance: Tests the main printTable function with different dataset sizes
 * - Table Instance Performance: Tests Table class operations (creation, row addition, rendering)
 * - Advanced Features Performance: Tests complex features like sorting, filtering, column configuration
 * - Edge Cases Performance: Tests edge cases like empty datasets, single rows, wide datasets
 * - Consistent Performance Tests: Ensures performance stability across multiple runs
 *
 * Performance Thresholds:
 * - Small tables (1-10 rows): 50ms
 * - Medium tables (100 rows): 200ms
 * - Large tables (1000 rows): 1000ms
 * - Very large tables (5000 rows): 5000ms
 * - Table creation: 5ms
 * - Single row addition: 1ms
 * - Bulk row addition (100 rows): 50ms
 * - Render operation: 100ms
 * - Print operation: 150ms
 *
 * Methodology:
 * - Uses performance.now() for high-precision timing
 * - Captures console output to prevent test output pollution
 * - Measures actual execution time and compares against thresholds
 * - Includes minimum performance checks to ensure operations complete
 *
 * Usage:
 * Run with: yarn test test/performance/timeLimit.test.ts
 *
 * @author Performance Test Suite
 * @version 1.0.0
 */

import { printTable, Table } from '../../index';

describe('Time Limit Performance Tests', () => {
  // Add retry configuration for all tests in this suite
  jest.retryTimes(2); // This means each test will run up to 3 times (initial + 2 retries)

  // Performance thresholds (in milliseconds)
  const TIME_LIMITS = {
    smallTable: 50, // 50ms for small tables (1-10 rows)
    mediumTable: 200, // 200ms for medium tables (100 rows)
    largeTable: 1000, // 1 second for large tables (1000 rows)
    veryLargeTable: 5000, // 5 seconds for very large tables (5000 rows)
    tableCreation: 5, // 5ms for table creation
    singleRowAddition: 1, // 1ms for adding a single row
    bulkRowAddition: 50, // 50ms for adding 100 rows
    renderOperation: 100, // 100ms for render operation
    printOperation: 150, // 150ms for print operation
    columnConfig: 10, // 10ms for column configuration
    sorting: 100, // 100ms for sorting
    filtering: 100, // 100ms for filtering
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

  const createVeryLargeDataset = () =>
    Array.from({ length: 5000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      score: Math.floor(Math.random() * 1000),
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      department: ['Engineering', 'Sales', 'Marketing', 'HR'][
        Math.floor(Math.random() * 4)
      ],
      joinDate: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ).toISOString(),
    }));

  // Helper function to measure performance
  const measureTime = (operation: () => void): number => {
    const start = performance.now();
    operation();
    const end = performance.now();
    return end - start;
  };

  // Helper function to capture console output
  const captureConsoleOutput = (operation: () => void): void => {
    const originalLog = console.log;
    console.log = jest.fn();
    operation();
    console.log = originalLog;
  };

  describe('printTable Performance', () => {
    it('should render small tables within time limit', () => {
      const smallData = createSmallDataset();
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable(smallData));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.smallTable);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Small table (${smallData.length} rows): ${duration.toFixed(2)}ms`
      );
    });

    it('should render medium tables within time limit', () => {
      const mediumData = createMediumDataset();
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable(mediumData));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.mediumTable);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Medium table (${mediumData.length} rows): ${duration.toFixed(2)}ms`
      );
    });

    it('should render large tables within time limit', () => {
      const largeData = createLargeDataset();
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable(largeData));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.largeTable);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Large table (${largeData.length} rows): ${duration.toFixed(2)}ms`
      );
    });

    it('should render very large tables within time limit', () => {
      const veryLargeData = createVeryLargeDataset();
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable(veryLargeData));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.veryLargeTable);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Very large table (${veryLargeData.length} rows): ${duration.toFixed(2)}ms`
      );
    });
  });

  describe('Table Instance Performance', () => {
    it('should create table instances quickly', () => {
      const duration = measureTime(() => new Table());
      expect(duration).toBeLessThan(TIME_LIMITS.tableCreation);
      expect(duration).toBeGreaterThan(0);
      console.log(`Table creation: ${duration.toFixed(2)}ms`);
    });

    it('should add single rows quickly', () => {
      const table = new Table();
      const duration = measureTime(() => {
        table.addRow({ id: 1, name: 'Test', value: 100 });
      });

      expect(duration).toBeLessThan(TIME_LIMITS.singleRowAddition);
      expect(duration).toBeGreaterThan(0);
      console.log(`Single row addition: ${duration.toFixed(2)}ms`);
    });

    it('should add multiple rows efficiently', () => {
      const table = new Table();
      const rows = createMediumDataset();
      const duration = measureTime(() => {
        table.addRows(rows);
      });

      expect(duration).toBeLessThan(TIME_LIMITS.bulkRowAddition);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Bulk row addition (${rows.length} rows): ${duration.toFixed(2)}ms`
      );
    });

    it('should render table efficiently', () => {
      const table = new Table();
      table.addRows(createMediumDataset());

      const duration = measureTime(() => {
        captureConsoleOutput(() => table.render());
      });

      expect(duration).toBeLessThan(TIME_LIMITS.renderOperation);
      expect(duration).toBeGreaterThan(0);
      console.log(`Table render: ${duration.toFixed(2)}ms`);
    });

    it('should print table efficiently', () => {
      const table = new Table();
      table.addRows(createMediumDataset());

      const duration = measureTime(() => {
        captureConsoleOutput(() => table.printTable());
      });

      expect(duration).toBeLessThan(TIME_LIMITS.printOperation);
      expect(duration).toBeGreaterThan(0);
      console.log(`Table print: ${duration.toFixed(2)}ms`);
    });
  });

  describe('Advanced Features Performance', () => {
    it('should handle column configuration efficiently', () => {
      const duration = measureTime(() => {
        const table = new Table({
          title: 'Performance Test',
          columns: [
            { name: 'id', alignment: 'right', color: 'blue' },
            { name: 'name', alignment: 'center' },
            { name: 'score', alignment: 'left' },
          ],
        });
        table.addRows(createMediumDataset());
        captureConsoleOutput(() => table.printTable());
      });

      expect(duration).toBeLessThan(
        TIME_LIMITS.columnConfig + TIME_LIMITS.mediumTable
      );
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Column configuration with ${createMediumDataset().length} rows: ${duration.toFixed(2)}ms`
      );
    });

    it('should handle sorting efficiently', () => {
      const duration = measureTime(() => {
        const table = new Table({
          sort: (a, b) => b.score - a.score,
        });
        table.addRows(createMediumDataset());
        captureConsoleOutput(() => table.printTable());
      });

      expect(duration).toBeLessThan(
        TIME_LIMITS.sorting + TIME_LIMITS.mediumTable
      );
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Sorting with ${createMediumDataset().length} rows: ${duration.toFixed(2)}ms`
      );
    });

    it('should handle filtering efficiently', () => {
      const duration = measureTime(() => {
        const table = new Table({
          filter: (row) => row.score > 500,
        });
        table.addRows(createMediumDataset());
        captureConsoleOutput(() => table.printTable());
      });

      expect(duration).toBeLessThan(
        TIME_LIMITS.filtering + TIME_LIMITS.mediumTable
      );
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Filtering with ${createMediumDataset().length} rows: ${duration.toFixed(2)}ms`
      );
    });
  });

  describe('Edge Cases Performance', () => {
    it('should handle empty datasets quickly', () => {
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable([]));
      });

      expect(duration).toBeLessThan(10); // Should be very fast
      expect(duration).toBeGreaterThan(0);
      console.log(`Empty dataset: ${duration.toFixed(2)}ms`);
    });

    it('should handle single row datasets efficiently', () => {
      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable([{ id: 1, name: 'Single' }]));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.smallTable);
      expect(duration).toBeGreaterThan(0);
      console.log(`Single row dataset: ${duration.toFixed(2)}ms`);
    });

    it('should handle wide datasets efficiently', () => {
      const wideData = Array.from({ length: 50 }, (_, i) => ({
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

      const duration = measureTime(() => {
        captureConsoleOutput(() => printTable(wideData));
      });

      expect(duration).toBeLessThan(TIME_LIMITS.mediumTable);
      expect(duration).toBeGreaterThan(0);
      console.log(
        `Wide dataset (${wideData.length} rows, 10 columns): ${duration.toFixed(2)}ms`
      );
    });
  });

  describe('Consistent Performance Tests', () => {
    it('should maintain consistent performance across multiple runs', () => {
      const smallData = createSmallDataset();
      const durations: number[] = [];

      // Run the same test multiple times
      for (let i = 0; i < 5; i++) {
        const duration = measureTime(() => {
          captureConsoleOutput(() => printTable(smallData));
        });
        durations.push(duration);
      }

      // Calculate average and standard deviation
      const avgDuration =
        durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance =
        durations.reduce(
          (acc, val) => acc + Math.pow(val - avgDuration, 2),
          0
        ) / durations.length;
      const stdDev = Math.sqrt(variance);

      // Performance should be consistent (low standard deviation)
      // Increased threshold for CI environments where performance can be more variable
      expect(stdDev).toBeLessThan(avgDuration * 2.0); // Standard deviation should be less than 200% of average

      // All runs should be within reasonable limits
      durations.forEach((duration) => {
        expect(duration).toBeLessThan(TIME_LIMITS.smallTable);
        expect(duration).toBeGreaterThan(0);
      });

      console.log(
        `Average duration: ${avgDuration.toFixed(2)}ms, Std Dev: ${stdDev.toFixed(2)}ms`
      );
    });
  });
});
