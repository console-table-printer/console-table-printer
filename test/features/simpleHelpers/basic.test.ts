import { renderTable } from '../../../index';

describe('Simple Helper Tests: Basic', () => {
  it('should render table text through the direct helper', () => {
    const rendered = renderTable([{ ticket: 'BUG-1', owner: 'Ana' }], {
      shouldDisableColors: true,
    });

    expect(rendered).toContain('BUG-1');
    expect(rendered).toContain('owner');
  });
});
