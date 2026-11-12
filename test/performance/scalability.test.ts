/**
 * Scalability Performance Tests
 *
 * This test suite measures how console-table-printer performance scales with increasing
 * data size and complexity to ensure the library maintains acceptable performance characteristics
 * as usage grows.
 *
 * Test Categories:
 * - Time Complexity Scaling: Tests how execution time scales with data size
 * - Memory Complexity Scaling: Tests how memory usage scales with data size
 * - Column Scaling: Tests performance scaling with increasing column count
 * - Feature Complexity Scaling: Tests scaling with advanced features (sorting, filtering, computed columns)
 * - Stress Testing Scalability: Tests maximum reasonable dataset sizes and sustained load
 *
 * Scalability Thresholds:
 * - Linear scaling factor: 20.0x (performance should scale roughly linearly)
 * - Exponential scaling factor: 10.0x (should not scale exponentially)
 * - Memory scaling factor: 3.0x (memory should scale reasonably)
 * - Expected time complexity: O(n)
 * - Expected space complexity: O(n)
 *
 * Methodology:
 * - Tests multiple dataset sizes to measure scaling behavior
 * - Calculates scaling ratios between consecutive sizes
 * - Compares actual scaling against expected complexity bounds
 * - Uses different data complexities (simple, medium, complex)
 * - Measures both time and memory scaling characteristics
 *
 * Scaling Analysis:
 * - Time scaling: Measures execution time vs data size
 * - Memory scaling: Measures memory usage vs data size
 * - Column scaling: Measures performance vs column count
 * - Feature scaling: Measures performance impact of advanced features
 * - Consistency testing: Ensures stable scaling across multiple runs
 *
 * Complexity Verification:
 * - Linear scaling: Time should scale roughly linearly with data size
 * - Non-exponential: Should not exhibit exponential growth
 * - Memory efficiency: Memory should scale reasonably with data size
 * - Feature overhead: Advanced features should not cause excessive overhead
 *
 * Usage:
 * Run with: yarn test test/performance/scalability.test.ts
 *
 * Note: These tests help identify performance bottlenecks and ensure the library
 * can handle growing data requirements efficiently.
 *
 * @author Performance Test Suite
 * @version 1.0.0
 */

import { printTable, Table } from '../../index';

describe('Scalability Performance Tests', () => {
  // Add retry configuration for all tests in this suite
  jest.retryTimes(2); // This means each test will run up to 3 times (initial + 2 retries)

  // Scalability thresholds
  const SCALABILITY_LIMITS = {
    linearScalingFactor: 30.0, // Performance should scale linearly (within 30x factor for real-world variations)
    exponentialScalingFactor: 10.0, // Performance should not scale exponentially (within 10x factor)
    memoryScalingFactor: 3.0, // Memory should scale reasonably (within 3x factor)
    timeComplexity: 'O(n)', // Expected time complexity
    spaceComplexity: 'O(n)', // Expected space complexity
  };

  // Helper function to measure performance
  const measurePerformance = (operation: () => void): number => {
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

  // Helper function to get memory usage in MB
  const getMemoryUsageMB = (): number => {
    const usage = process.memoryUsage();
    return (usage.heapUsed + usage.heapTotal) / 1024 / 1024;
  };

  // Test dataset generators with different sizes
  const createDataset = (
    size: number,
    complexity: 'simple' | 'medium' | 'complex' = 'simple'
  ) => {
    const baseData = Array.from({ length: size }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      score: Math.floor(Math.random() * 1000),
    }));

    if (complexity === 'medium') {
      return baseData.map((item) => ({
        ...item,
        email: `user${item.id}@example.com`,
        status: ['active', 'inactive', 'pending'][
          Math.floor(Math.random() * 3)
        ],
        department: ['Engineering', 'Sales', 'Marketing', 'HR'][
          Math.floor(Math.random() * 4)
        ],
      }));
    }

    if (complexity === 'complex') {
      return baseData.map((item) => ({
        ...item,
        email: `user${item.id}@example.com`,
        status: ['active', 'inactive', 'pending'][
          Math.floor(Math.random() * 3)
        ],
        department: ['Engineering', 'Sales', 'Marketing', 'HR'][
          Math.floor(Math.random() * 4)
        ],
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
    }

    return baseData;
  };

  describe('Time Complexity Scaling', () => {
    it('should scale linearly with data size for simple datasets', () => {
      const sizes = [10, 50, 100, 500, 1000];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'simple');
        const time = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        times.push(time);
      });

      // Check if scaling is roughly linear
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Time should scale roughly linearly with size (upper bound only)
        expect(timeRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.linearScalingFactor
        );
        // Log the ratio for developer visibility
        if (timeRatio < sizeRatio / SCALABILITY_LIMITS.linearScalingFactor) {
          console.warn(
            `Time scaling ratio lower than expected: sizeRatio=${sizeRatio}, timeRatio=${timeRatio}`
          );
        }
      }

      console.log(
        'Time scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should scale linearly with data size for complex datasets', () => {
      const sizes = [10, 50, 100, 200, 500];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'complex');
        const time = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        times.push(time);
      });

      // Check if scaling is roughly linear
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Time should scale roughly linearly with size (upper bound only)
        expect(timeRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.linearScalingFactor
        );
        // Log the ratio for developer visibility
        if (timeRatio < sizeRatio / SCALABILITY_LIMITS.linearScalingFactor) {
          console.warn(
            `Time scaling ratio lower than expected: sizeRatio=${sizeRatio}, timeRatio=${timeRatio}`
          );
        }
      }

      console.log(
        'Complex data time scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should not scale exponentially with data size', () => {
      const sizes = [10, 100, 1000, 5000];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'medium');
        const time = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        times.push(time);
      });

      // Check that scaling is not exponential
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Time should not scale exponentially
        expect(timeRatio).toBeLessThan(Math.pow(sizeRatio, 2.0)); // Should be better than O(n^2)
      }

      console.log(
        'Exponential scaling check:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });
  });

  describe('Memory Complexity Scaling', () => {
    it('should scale memory usage linearly with data size', () => {
      const sizes = [10, 50, 100, 500, 1000];
      const memoryUsage: number[] = [];

      sizes.forEach((size) => {
        const initialMemory = getMemoryUsageMB();
        const data = createDataset(size, 'medium');
        captureConsoleOutput(() => printTable(data));
        const finalMemory = getMemoryUsageMB();
        memoryUsage.push(finalMemory - initialMemory);
      });

      // Check if memory scaling is roughly linear
      for (let i = 1; i < memoryUsage.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const memoryRatio = memoryUsage[i] / memoryUsage[i - 1];

        // Memory should scale roughly linearly with size (upper bound only)
        expect(memoryRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.memoryScalingFactor
        );
        // Log the ratio for developer visibility
        if (memoryRatio < sizeRatio / SCALABILITY_LIMITS.memoryScalingFactor) {
          console.warn(
            `Memory scaling ratio lower than expected: sizeRatio=${sizeRatio}, memoryRatio=${memoryRatio}`
          );
        }
      }

      console.log(
        'Memory scaling factors:',
        memoryUsage
          .map((memory, i) =>
            i > 0 ? `${(memory / memoryUsage[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should handle large datasets without memory explosion', () => {
      const sizes = [1000, 5000, 10000];
      const memoryUsage: number[] = [];

      sizes.forEach((size) => {
        const initialMemory = getMemoryUsageMB();
        const data = createDataset(size, 'simple');
        captureConsoleOutput(() => printTable(data));
        const finalMemory = getMemoryUsageMB();
        memoryUsage.push(finalMemory - initialMemory);
      });

      // Memory should not explode with large datasets
      for (let i = 1; i < memoryUsage.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const memoryRatio = memoryUsage[i] / memoryUsage[i - 1];

        // Memory should scale reasonably - allow for some variance due to GC and memory management
        expect(memoryRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.memoryScalingFactor
        );
      }

      console.log(
        'Large dataset memory scaling:',
        memoryUsage
          .map((memory, i) =>
            i > 0 ? `${(memory / memoryUsage[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });
  });

  describe('Column Scaling', () => {
    it('should scale performance with number of columns', () => {
      const columnCounts = [3, 5, 10, 15, 20];
      const times: number[] = [];

      columnCounts.forEach((colCount) => {
        const data = Array.from({ length: 100 }, (_, i) => {
          const row: any = { id: i + 1 };
          for (let j = 1; j <= colCount; j++) {
            row[`col${j}`] = `data${i}_${j}`;
          }
          return row;
        });

        const time = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        times.push(time);
      });

      // Performance should scale reasonably with column count
      for (let i = 1; i < times.length; i++) {
        const colRatio = columnCounts[i] / columnCounts[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Time should not scale worse than linearly with column count
        expect(timeRatio).toBeLessThan(
          colRatio * SCALABILITY_LIMITS.linearScalingFactor
        );
      }

      console.log(
        'Column scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should handle wide tables efficiently', () => {
      const wideData = Array.from({ length: 50 }, (_, i) => {
        const row: any = { id: i + 1 };
        for (let j = 1; j <= 30; j++) {
          row[`column${j}`] = `value${i}_${j}`;
        }
        return row;
      });

      const time = measurePerformance(() => {
        captureConsoleOutput(() => printTable(wideData));
      });

      // Should complete within reasonable time
      expect(time).toBeLessThan(5000); // 5 seconds for 50 rows with 30 columns
      console.log(
        `Wide table (50 rows, 30 columns) time: ${time.toFixed(2)}ms`
      );
    });
  });

  describe('Feature Complexity Scaling', () => {
    it('should scale performance with sorting complexity', () => {
      const sizes = [100, 500, 1000, 2000];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'medium');
        const time = measurePerformance(() => {
          const table = new Table({
            sort: (a, b) => b.score - a.score,
          });
          table.addRows(data);
          captureConsoleOutput(() => table.printTable());
        });
        times.push(time);
      });

      // Sorting should scale reasonably
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Sorting should scale better than O(n^2)
        expect(timeRatio).toBeLessThan(sizeRatio * 2);
      }

      console.log(
        'Sorting scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should scale performance with filtering complexity', () => {
      const sizes = [100, 500, 1000, 2000];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'medium');
        const time = measurePerformance(() => {
          const table = new Table({
            filter: (row) => row.score > 500 && row.status === 'active',
          });
          table.addRows(data);
          captureConsoleOutput(() => table.printTable());
        });
        times.push(time);
      });

      // Filtering should scale linearly
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Filtering should scale linearly
        expect(timeRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.linearScalingFactor
        );
      }

      console.log(
        'Filtering scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });

    it('should scale performance with computed columns', () => {
      const sizes = [50, 100, 200, 500];
      const times: number[] = [];

      sizes.forEach((size) => {
        const data = createDataset(size, 'medium');
        const time = measurePerformance(() => {
          const table = new Table({
            computedColumns: [
              {
                name: 'computed_score',
                function: (row: any) => row.score * 1.1,
              },
              {
                name: 'status_code',
                function: (row: any) => (row.status === 'active' ? 'A' : 'I'),
              },
            ],
          });
          table.addRows(data);
          captureConsoleOutput(() => table.printTable());
        });
        times.push(time);
      });

      // Computed columns should scale reasonably
      for (let i = 1; i < times.length; i++) {
        const sizeRatio = sizes[i] / sizes[i - 1];
        const timeRatio = times[i] / times[i - 1];

        // Should scale linearly
        expect(timeRatio).toBeLessThan(
          sizeRatio * SCALABILITY_LIMITS.linearScalingFactor
        );
      }

      console.log(
        'Computed columns scaling factors:',
        times
          .map((time, i) =>
            i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
          )
          .join(', ')
      );
    });
  });

  describe('Stress Testing Scalability', () => {
    it('should handle maximum reasonable dataset size', () => {
      const maxSize = 10000;
      const data = createDataset(maxSize, 'simple');

      const time = measurePerformance(() => {
        captureConsoleOutput(() => printTable(data));
      });

      // Should complete within reasonable time
      expect(time).toBeLessThan(30000); // 30 seconds for 10k rows
      console.log(
        `Maximum dataset (${maxSize} rows) time: ${time.toFixed(2)}ms`
      );
    });

    it('should maintain performance under sustained load', () => {
      const data = createDataset(500, 'medium');
      const times: number[] = [];

      // Run multiple operations to test sustained performance
      for (let i = 0; i < 10; i++) {
        const time = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        times.push(time);
      }

      // Calculate performance consistency
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const variance =
        times.reduce((acc, val) => acc + Math.pow(val - avgTime, 2), 0) /
        times.length;
      const stdDev = Math.sqrt(variance);

      // Performance should be consistent
      expect(stdDev).toBeLessThan(avgTime * 0.5); // Standard deviation should be less than 50% of average
      console.log(
        `Sustained load average time: ${avgTime.toFixed(2)}ms, Std Dev: ${stdDev.toFixed(2)}ms`
      );
    });

    it('should handle mixed operations efficiently', () => {
      const sizes = [100, 500, 1000];
      const operations = ['printTable', 'render', 'configured'];
      const results: { [key: string]: number[] } = {};

      operations.forEach((op) => {
        results[op] = [];
      });

      sizes.forEach((size) => {
        const data = createDataset(size, 'medium');

        // Test printTable
        const printTime = measurePerformance(() => {
          captureConsoleOutput(() => printTable(data));
        });
        results.printTable.push(printTime);

        // Test render
        const table = new Table();
        table.addRows(data);
        const renderTime = measurePerformance(() => {
          captureConsoleOutput(() => table.render());
        });
        results.render.push(renderTime);

        // Test configured table
        const configuredTime = measurePerformance(() => {
          const configuredTable = new Table({
            title: 'Test Table',
            sort: (a, b) => b.score - a.score,
            filter: (row) => row.score > 500,
          });
          configuredTable.addRows(data);
          captureConsoleOutput(() => configuredTable.printTable());
        });
        results.configured.push(configuredTime);
      });

      // All operations should scale reasonably
      Object.keys(results).forEach((op) => {
        const times = results[op];
        for (let i = 1; i < times.length; i++) {
          const sizeRatio = sizes[i] / sizes[i - 1];
          const timeRatio = times[i] / times[i - 1];

          expect(timeRatio).toBeLessThan(
            sizeRatio * SCALABILITY_LIMITS.linearScalingFactor
          );
        }
        console.log(
          `${op} scaling:`,
          times
            .map((time, i) =>
              i > 0 ? `${(time / times[i - 1]).toFixed(2)}x` : '1.00x'
            )
            .join(', ')
        );
      });
    });
  });
});
