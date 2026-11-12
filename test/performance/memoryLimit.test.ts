/**
 * Memory Limit Performance Tests
 *
 * This test suite measures memory usage of console-table-printer operations to ensure
 * they don't consume excessive memory and don't cause memory leaks during repeated operations.
 *
 * Test Categories:
 * - Memory Usage for Different Table Sizes: Tests memory consumption with various dataset sizes
 * - Memory Leak Detection: Tests for memory leaks with repeated operations
 * - Memory Usage with Advanced Features: Tests memory usage with complex configurations
 * - Memory Usage with Edge Cases: Tests memory handling for edge cases
 * - Memory Cleanup Tests: Ensures proper memory cleanup after operations
 *
 * Memory Thresholds:
 * - Small tables: 5MB
 * - Medium tables: 20MB
 * - Large tables: 100MB
 * - Very large tables: 500MB
 * - Memory leak tolerance: 50MB max increase after repeated operations
 * - Garbage collection tolerance: 100MB max after forced GC
 *
 * Methodology:
 * - Uses process.memoryUsage() to measure heap usage
 * - Forces garbage collection when available to test cleanup
 * - Measures memory before and after operations
 * - Tests repeated operations to detect memory leaks
 * - Captures console output to prevent test output pollution
 *
 * Memory Measurement:
 * - Combines heapUsed and heapTotal for comprehensive memory measurement
 * - Reports memory usage in MB for readability
 * - Accounts for garbage collection variance
 *
 * Usage:
 * Run with: yarn test test/performance/memoryLimit.test.ts
 *
 * Note: These tests may be affected by Node.js garbage collection behavior.
 * For more accurate results, run with --expose-gc flag to enable manual GC.
 *
 * @author Performance Test Suite
 * @version 1.0.0
 */

import { printTable, Table } from '../../index';

describe('Memory Limit Performance Tests', () => {
  // Add retry configuration for all tests in this suite
  jest.retryTimes(2); // This means each test will run up to 3 times (initial + 2 retries)

  // Memory thresholds (in MB)
  const MEMORY_LIMITS = {
    smallTable: 5, // 5MB for small tables
    mediumTable: 20, // 20MB for medium tables
    largeTable: 100, // 100MB for large tables
    veryLargeTable: 500, // 500MB for very large tables
    memoryLeak: 50, // 50MB max increase after repeated operations
    garbageCollection: 100, // 100MB max after forced GC
  };

  // Helper function to get memory usage in MB
  const getMemoryUsageMB = (): number => {
    const usage = process.memoryUsage();
    return (usage.heapUsed + usage.heapTotal) / 1024 / 1024;
  };

  // Helper function to capture console output
  const captureConsoleOutput = (operation: () => void): void => {
    const originalLog = console.log;
    console.log = jest.fn();
    operation();
    console.log = originalLog;
  };

  // Helper function to force garbage collection if available
  const forceGarbageCollection = (): void => {
    if (global.gc) {
      global.gc();
    }
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
      description: `This is a long description for user ${i + 1} that contains more data to test memory usage.`,
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
      description: `This is a very long description for user ${i + 1} that contains extensive data to test memory usage under heavy load conditions.`,
      joinDate: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ).toISOString(),
      metadata: {
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: ['light', 'dark'][Math.floor(Math.random() * 2)],
          language: ['en', 'es', 'fr'][Math.floor(Math.random() * 3)],
          notifications: Math.random() > 0.5,
        },
      },
    }));

  describe('Memory Usage for Different Table Sizes', () => {
    it('should use minimal memory for small tables', () => {
      const initialMemory = getMemoryUsageMB();
      const smallData = createSmallDataset();

      captureConsoleOutput(() => printTable(smallData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.smallTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Small table memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should use reasonable memory for medium tables', () => {
      const initialMemory = getMemoryUsageMB();
      const mediumData = createMediumDataset();

      captureConsoleOutput(() => printTable(mediumData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.mediumTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Medium table memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should use acceptable memory for large tables', () => {
      const initialMemory = getMemoryUsageMB();
      const largeData = createLargeDataset();

      captureConsoleOutput(() => printTable(largeData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.largeTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Large table memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should handle very large tables without excessive memory usage', () => {
      const initialMemory = getMemoryUsageMB();
      const veryLargeData = createVeryLargeDataset();

      captureConsoleOutput(() => printTable(veryLargeData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.veryLargeTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Very large table memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not cause memory leaks with repeated table operations', () => {
      const initialMemory = getMemoryUsageMB();

      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        const table = new Table();
        table.addRows(createMediumDataset());
        captureConsoleOutput(() => table.printTable());
      }

      // Force garbage collection
      forceGarbageCollection();

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.memoryLeak);
      expect(memoryIncrease).toBeGreaterThan(-MEMORY_LIMITS.garbageCollection); // Allow some GC variance
      console.log(
        `Memory increase after 10 operations: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should not leak memory with repeated printTable calls', () => {
      const initialMemory = getMemoryUsageMB();
      const mediumData = createMediumDataset();

      // Call printTable multiple times
      for (let i = 0; i < 20; i++) {
        captureConsoleOutput(() => printTable(mediumData));
      }

      // Force garbage collection
      forceGarbageCollection();

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.memoryLeak);
      expect(memoryIncrease).toBeGreaterThan(-MEMORY_LIMITS.garbageCollection);
      console.log(
        `Memory increase after 20 printTable calls: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should not leak memory with table instance reuse', () => {
      const initialMemory = getMemoryUsageMB();
      const table = new Table();

      // Reuse the same table instance
      for (let i = 0; i < 15; i++) {
        table.addRows(createSmallDataset());
        captureConsoleOutput(() => table.printTable());
      }

      // Force garbage collection
      forceGarbageCollection();

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.memoryLeak);
      expect(memoryIncrease).toBeGreaterThan(-MEMORY_LIMITS.garbageCollection);
      console.log(
        `Memory increase with table reuse: ${memoryIncrease.toFixed(2)}MB`
      );
    });
  });

  describe('Memory Usage with Advanced Features', () => {
    it('should handle column configuration without excessive memory usage', () => {
      const initialMemory = getMemoryUsageMB();

      const table = new Table({
        title: 'Memory Test Table',
        columns: [
          { name: 'id', alignment: 'right', color: 'blue' },
          { name: 'name', alignment: 'center', maxLen: 50 },
          { name: 'score', alignment: 'left', minLen: 10 },
        ],
        colorMap: {
          red: '\x1b[31m',
          green: '\x1b[32m',
          blue: '\x1b[34m',
        },
      });

      table.addRows(createMediumDataset());
      captureConsoleOutput(() => table.printTable());

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.mediumTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Column configuration memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should handle sorting and filtering without memory issues', () => {
      const initialMemory = getMemoryUsageMB();

      const table = new Table({
        sort: (a, b) => b.score - a.score,
        filter: (row) => row.score > 500,
        rowSeparator: true,
      });

      table.addRows(createLargeDataset());
      captureConsoleOutput(() => table.printTable());

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.largeTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Sorting and filtering memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });
  });

  describe('Memory Usage with Edge Cases', () => {
    it('should handle empty datasets with minimal memory', () => {
      const initialMemory = getMemoryUsageMB();

      captureConsoleOutput(() => printTable([]));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(1); // Should be very minimal
      // Allow negative values due to GC or memory reuse
      console.log(
        `Empty dataset memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should handle wide datasets efficiently', () => {
      const initialMemory = getMemoryUsageMB();

      const wideData = Array.from({ length: 100 }, (_, i) => ({
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
        col11: `data${i}`,
        col12: `data${i}`,
        col13: `data${i}`,
        col14: `data${i}`,
        col15: `data${i}`,
      }));

      captureConsoleOutput(() => printTable(wideData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.mediumTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Wide dataset memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });

    it('should handle deep nested objects without memory explosion', () => {
      const initialMemory = getMemoryUsageMB();

      const nestedData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        user: {
          profile: {
            personal: {
              name: `User ${i + 1}`,
              age: 20 + Math.floor(Math.random() * 50),
              address: {
                street: `Street ${i + 1}`,
                city: `City ${i + 1}`,
                country: `Country ${i + 1}`,
              },
            },
            preferences: {
              theme: ['light', 'dark'][Math.floor(Math.random() * 2)],
              language: ['en', 'es', 'fr'][Math.floor(Math.random() * 3)],
            },
          },
          settings: {
            notifications: {
              email: Math.random() > 0.5,
              push: Math.random() > 0.5,
              sms: Math.random() > 0.5,
            },
          },
        },
      }));

      captureConsoleOutput(() => printTable(nestedData));

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.mediumTable);
      // Allow negative values due to GC or memory reuse
      console.log(
        `Nested objects memory increase: ${memoryIncrease.toFixed(2)}MB`
      );
    });
  });

  describe('Memory Cleanup Tests', () => {
    it('should properly cleanup memory after table operations', () => {
      const initialMemory = getMemoryUsageMB();

      // Create and use multiple tables
      for (let i = 0; i < 5; i++) {
        const table = new Table();
        table.addRows(createMediumDataset());
        captureConsoleOutput(() => table.printTable());
      }

      // Force garbage collection
      forceGarbageCollection();

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.memoryLeak);
      expect(memoryIncrease).toBeGreaterThan(-MEMORY_LIMITS.garbageCollection);
      console.log(`Memory cleanup test: ${memoryIncrease.toFixed(2)}MB`);
    });

    it('should handle memory pressure gracefully', () => {
      const initialMemory = getMemoryUsageMB();

      // Create many small tables to simulate memory pressure
      const tables: Table[] = [];
      for (let i = 0; i < 100; i++) {
        const table = new Table();
        table.addRows(createSmallDataset());
        tables.push(table);
      }

      // Use some tables
      for (let i = 0; i < 20; i++) {
        captureConsoleOutput(() => tables[i].printTable());
      }

      // Clear references to allow GC
      tables.length = 0;
      forceGarbageCollection();

      const finalMemory = getMemoryUsageMB();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(MEMORY_LIMITS.memoryLeak);
      expect(memoryIncrease).toBeGreaterThan(-MEMORY_LIMITS.garbageCollection);
      console.log(`Memory pressure test: ${memoryIncrease.toFixed(2)}MB`);
    });
  });
});
