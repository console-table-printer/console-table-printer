import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// This test ensures that Jest test discovery is working correctly in CI/CD environments
// and that all test files are properly detected and executed.
describe('Jest Test Discovery', () => {
  // Run Jest with --listTests flag and capture output once for all tests
  const output: string = execSync(
    'yarn jest --config jestconfig.json --listTests',
    {
      encoding: 'utf8',
    }
  );

  // Extract detected test files from Jest output
  const detectedFiles: string[] = output
    .split('\n')
    .filter((line) => line.endsWith('.test.ts') || line.endsWith('.test.js'))
    .map((line) => line.trim())
    .filter(Boolean)
    // Convert to relative paths, normalizing path separators for cross-platform compatibility
    .map((file) => path.relative(process.cwd(), file).replace(/\\/g, '/'));

  // Expected test files (using relative paths)
  const expectedFiles: string[] = [
    // Root Level Tests
    'test/charLen.test.ts',
    'test/foreignLanguage.test.ts',
    'test/general.test.ts',
    'test/lineWidthLimit.test.ts',
    'test/newLines.test.ts',
    'test/printTable.test.ts',
    'test/render.test.ts',
    'test/transform.test.ts',
    'test/types.test.ts',

    // Feature Tests
    'test/features/addColumn/basic.test.ts',
    'test/features/addColumn/render.test.ts',
    'test/features/addColumn/verifyOutput.test.ts',

    'test/features/alignment/basic.test.ts',
    'test/features/alignment/render.test.ts',
    'test/features/alignment/verifyOutput.test.ts',

    'test/features/columnColor/basic.test.ts',
    'test/features/columnColor/render.test.ts',
    'test/features/columnColor/verifyOutput.test.ts',

    'test/features/computedColumns/computedColumns.test.ts',
    'test/features/computedColumns/render.test.ts',
    'test/features/computedColumns/verifyOutput.test.ts',

    'test/features/customColor/basic.test.ts',
    'test/features/customColor/render.test.ts',

    'test/features/defaultColumnStyles/render.test.ts',
    'test/features/defaultColumnStyles/verify.test.ts',
    'test/features/defaultColumnStyles/verifyInternalTable.test.ts',

    'test/features/transform/basic.test.ts',
    'test/features/transform/render.test.ts',
    'test/features/transform/verifyOutput.test.ts',

    // Internal Table Tests
    'test/internalTable/alignment.test.ts',
    'test/internalTable/borderStyle.test.ts',
    'test/internalTable/columnColor.test.ts',
    'test/internalTable/computedColumn.test.ts',
    'test/internalTable/enableDisable.test.ts',
    'test/internalTable/filter.test.ts',
    'test/internalTable/headerTitle.test.ts',
    'test/internalTable/rowColor.test.ts',
    'test/internalTable/rowSeparator.test.ts',
    'test/internalTable/simpleTable.test.ts',
    'test/internalTable/sorting.test.ts',
    'test/internalTable/title.test.ts',

    // Documentation Tests (Version 1)
    'test/readme/Version1/readmeExamples1Basic.test.ts',
    'test/readme/Version1/readmeExamples2Instance.test.ts',
    'test/readme/Version1/readmeExamples3Color.test.ts',
    'test/readme/Version1/readmeExamples4Columns.test.ts',

    // Documentation Tests (Version 2)
    'test/readme/Version2/readmeExamples1Basic.test.ts',
    'test/readme/Version2/readmeExamples2Instance.test.ts',
    'test/readme/Version2/readmeExamples3Color.test.ts',
    'test/readme/Version2/readmeExamples4Columns.test.ts',
    'test/readme/Version2/readmeExamples5DetailedConfig.test.ts',

    // Infrastructure Tests
    'test/infrastructuralTest/jest-discovery.test.ts',
    'test/infrastructuralTest/package-test.test.js',

    // Performance Tests
    'test/performance/timeLimit.test.ts',
    'test/performance/memoryLimit.test.ts',
    'test/performance/throughput.test.ts',
    'test/performance/scalability.test.ts',

    // Source Code Tests
    'src/internalTable/internal-table.test.ts',
    'src/internalTable/internal-table-printer.test.ts',
    'src/internalTable/table-pre-processors.test.ts',
    'src/internalTable/input-converter.test.ts',
    'src/utils/table-helpers.test.ts',
    'src/utils/console-utils.test.ts',
    'src/utils/colored-console-line.test.ts',
    'src/utils/string-utils.test.ts',
  ];

  describe('Test File Detection', () => {
    // Test each detected file
    detectedFiles.forEach((file) => {
      it(`should be a valid test file: ${file}`, () => {
        // Check if file exists
        const fullPath = path.join(process.cwd(), file);
        expect(fs.existsSync(fullPath)).toBe(true);

        // Check if file is in expected list
        expect(expectedFiles).toContain(file);
      });
    });

    // Test for missing expected files
    expectedFiles.forEach((file) => {
      it(`should detect expected file: ${file}`, () => {
        expect(detectedFiles).toContain(file);
      });
    });

    // Verify total number of files
    it('should have the correct number of test files', () => {
      expect(detectedFiles.length).toBe(expectedFiles.length);
    });
  });

  describe('Jest Configuration', () => {
    it('should have correct configuration', () => {
      // Get jest config from jestconfig.json
      const configPath = path.join(process.cwd(), 'jestconfig.json');
      const jestConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Expected configuration values
      const expectedConfig = {
        transform: {
          '^.+\\.(t|j)sx?$': 'ts-jest',
        },
        testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      };

      // Verify essential configuration
      expect(jestConfig.transform['^.+\\.(t|j)sx?$']).toBe(
        expectedConfig.transform['^.+\\.(t|j)sx?$']
      );
      expect(jestConfig.testRegex).toBe(expectedConfig.testRegex);
      expect(jestConfig.moduleFileExtensions).toEqual(
        expect.arrayContaining(expectedConfig.moduleFileExtensions)
      );
    });
  });
});
