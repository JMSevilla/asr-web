import { SvgDataIcon } from '../../components/SvgDataIcon';
import { render, screen } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

describe('SvgDataIcon', () => {
  it('should render', () => {
    render(<SvgDataIcon svgData="<svg />" />);
    expect(screen.getByTestId('svg-data-icon')).toBeTruthy();
  });

  it('should replace color', () => {
    render(<SvgDataIcon svgData='<svg fill=\"#000\" />' swapColor="#000" />);
    const icon = screen.getByTestId('svg-data-icon');
    const color = icon.innerHTML.match(/fill="#000"/g);
    expect(color).toBeNull();
  });

  it('should replace size', () => {
    render(<SvgDataIcon svgData='<svg width="24" height="24" />' width={20} height={20} />);
    const icon = screen.getByTestId('svg-data-icon');
    const width = icon.innerHTML.match(/width="20"/g);
    const height = icon.innerHTML.match(/height="20"/g);
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
  });
});
