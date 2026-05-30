import { Table } from '../../../index';
import { getTableBody, getTableHeader } from '../../testUtils/getRawData';

describe('Unicode Tests: Rendering', () => {
  it('should render Chinese text with expected column widths', () => {
    const table = new Table({
      shouldDisableColors: true,
    });

    table.addRows([
      {
        description: 'Some alphabets 这里是中文这里是中文这里是中文',
        ticket: 'ISSUE-1231',
      },
      {
        description: 'Some Summary 这里是中文这里是中文',
        ticket: 'ISSUE-22222',
      },
    ]);

    expect(getTableHeader(table)).toEqual(
      '│                                   description │      ticket │'
    );
    expect(getTableBody(table)).toEqual([
      '│ Some alphabets 这里是中文这里是中文这里是中文 │  ISSUE-1231 │',
      '│             Some Summary 这里是中文这里是中文 │ ISSUE-22222 │',
    ]);
  });

  it('should render mixed-script greetings without breaking alignment', () => {
    const table = new Table({
      shouldDisableColors: true,
    })
      .addColumn('language')
      .addColumn('greeting')
      .addColumn('meaning');

    table.addRows([
      {
        language: 'Japanese',
        greeting: 'こんにちは世界',
        meaning: 'Hello world',
      },
      {
        language: 'Arabic',
        greeting: 'مرحبا',
        meaning: 'Hello',
      },
    ]);

    expect(getTableHeader(table)).toEqual(
      '│ language │       greeting │     meaning │'
    );
    expect(getTableBody(table)).toEqual([
      '│ Japanese │ こんにちは世界 │ Hello world │',
      '│   Arabic │          مرحبا │       Hello │',
    ]);
  });
});
