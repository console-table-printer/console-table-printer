import { rawColumnToInternalColumn, objIfExists } from './input-converter';

// Test rawColumnToInternalColumn function
describe('rawColumnToInternalColumn', () => {
  it('should convert raw column options to internal column format', () => {
    const rawColumn = { name: 'col1', alignment: 'left', color: 'red' };
    const internalColumn = rawColumnToInternalColumn(rawColumn);
    expect(internalColumn).toStrictEqual({
      alignment: 'left',
      color: 'red',
      name: 'col1',
      title: 'col1',
      transformer: undefined
    });
  });

  it('should convert raw column options to internal column format with default styles', () => {
    const rawColumn = { name: 'col1' };
    const defaultColumnStyles = {
      alignment: 'right',
      color: 'blue',
      maxLen: 18,
      minLen: 8,
    };
    const internalColumn = rawColumnToInternalColumn(
      rawColumn,
      defaultColumnStyles
    );
    expect(internalColumn).toStrictEqual({
      alignment: 'right',
      color: 'blue',
      maxLen: 18,
      minLen: 8,
      name: 'col1',
      title: 'col1',
      transformer: undefined
    });
  });

  it('should convert raw computed column options to internal column format', () => {
    const rawColumn = {
      name: 'col1',
      alignment: 'left',
      color: 'red',
      function: () => 'test',
    };
    const internalColumn = rawColumnToInternalColumn(rawColumn);
    expect(internalColumn).toStrictEqual({
      alignment: 'left',
      color: 'red',
      name: 'col1',
      title: 'col1',
      transformer: undefined
    });
  });
});

// Test objIfExists function
describe('objIfExists', () => {
  it('should return an object if value exists', () => {
    const result = objIfExists('key', 'value');
    expect(result).toEqual({ key: 'value' });
  });

  it('should return an empty object if value does not exist', () => {
    const result = objIfExists('key', null);
    expect(result).toEqual({});
  });
});
