import { LinksGroupBlock } from '../../components';
import { render, screen } from '../common';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {} } }),
}));

describe('LinksGroupBlock', () => {
  const links = [
    {
      labelHeader: 'labelHeader',
      groupItems: [
        {
          label: 'label1',
          html: '<div><p>html text1</p></div>',
          link: '/1',
        },
        {
          label: 'label2',
          html: '<div><p data-testid="inserted-html">html text2</p></div>',
          link: '/2',
        },
      ],
    },
  ];
  it('should render group items', () => {
    render(<LinksGroupBlock links={links} />);

    expect(screen.getByText('labelHeader')).toBeInTheDocument();
    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByTestId('inserted-html')).toBeInTheDocument();
  });
});
