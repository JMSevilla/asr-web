import { render, screen } from '@testing-library/react';
import { IFrameFormBlock } from '../../components/blocks/IFrameFormBlock';

describe('IFrameFormBlock', () => {
  it('should render an iframe with the correct id', () => {
    const props = {
      id: 'test-iframe',
      parameters: [],
    };

    render(<IFrameFormBlock {...props} />);

    const iframe = screen.getByRole('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('id', 'test-iframe');
  });

  it('should pass parameters as iframe attributes', () => {
    const props = {
      id: 'test-iframe',
      parameters: [
        { key: 'src', value: 'https://example.com' },
        { key: 'title', value: 'Test IFrame' },
      ],
    };

    render(<IFrameFormBlock {...props} />);

    const iframe = screen.getByRole('iframe');
    expect(iframe).toHaveAttribute('src', 'https://example.com');
    expect(iframe).toHaveAttribute('title', 'Test IFrame');
  });

  it('should render iframe with default width and height', () => {
    const props = {
      id: 'test-iframe',
      parameters: [],
    };

    render(<IFrameFormBlock {...props} />);

    const iframe = screen.getByRole('iframe');
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '100%');
  });
});
