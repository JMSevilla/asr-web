import { ComponentProps } from 'react';
import { TrackerBlock } from '../../../components/blocks/tracker/TrackerBlock';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ update: jest.fn() }),
}));
jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));
jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn() }),
}));
jest.mock('../../../components/ParsedHtml', () => ({
  ParsedHtml: ({ html }: { html: string; fontSize: string }) => <span>{html}</span>,
}));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: [
      {
        stageKey: 'stage1',
        completedDate: '2021-01-01',
        inProgress: false,
        status: 'completed',
        trackerItemHeader: 'header1',
        firstPage: 'first1',
        endPage: 'end1',
      },
      {
        stageKey: 'stage2',
        completedDate: null,
        inProgress: true,
        status: 'incomplete',
        trackerItemHeader: 'header2',
        firstPage: 'first2',
        endPage: 'end2',
      },
      {
        stageKey: 'stage3',
        completedDate: null,
        inProgress: false,
        status: 'missing',
        trackerItemHeader: 'header3',
        firstPage: 'first3',
        endPage: 'end3',
      },
    ],
  }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false, data: null, error: false }),
}));

const DEFAULT_PROPS: ComponentProps<typeof TrackerBlock> = {
  id: 'id',
  pageKey: 'page',
  parameters: [],
  trackerItems: [],
};

describe('TrackerBlock', () => {
  it('renders', () => {
    render(<TrackerBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('tracker-block')).toBeInTheDocument();
  });

  it('renders loader', () => {
    (useApi as jest.Mock).mockReturnValueOnce({ loading: true });
    render(<TrackerBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('tracker-block-loader')).toBeInTheDocument();
  });

  it('renders correct statuses based on api response', () => {
    render(<TrackerBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('stage1-completed')).toBeInTheDocument();
    expect(screen.queryByTestId('stage1-incomplete')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stage1-missing')).not.toBeInTheDocument();

    expect(screen.queryByTestId('stage2-completed')).not.toBeInTheDocument();
    expect(screen.getByTestId('stage2-incomplete')).toBeInTheDocument();
    expect(screen.queryByTestId('stage2-missing')).not.toBeInTheDocument();

    expect(screen.queryByTestId('stage3-completed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stage3-incomplete')).not.toBeInTheDocument();
    expect(screen.getByTestId('stage3-missing')).toBeInTheDocument();
  });

  it('renders correct buttons', () => {
    render(<TrackerBlock {...DEFAULT_PROPS} />, undefined, {
      buttons: [
        { elements: { buttonKey: { value: 'tracking_undefined_stage1_button' } }, type: 'button' },
        { elements: { buttonKey: { value: 'tracking_undefined_stage2_button' } }, type: 'button' },
        { elements: { buttonKey: { value: 'tracking_undefined_stage3_button' } }, type: 'button' },
      ],
    });
    expect(screen.getByTestId('tracker-item-stage1-button')).toBeInTheDocument();
    expect(screen.queryByTestId('tracker-item-stage2-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tracker-item-stage3-button')).not.toBeInTheDocument();
  });

  it('should not render buttons for items with hideButton set to true', () => {
    (useApi as jest.Mock).mockReturnValueOnce({
      result: [
        {
          stageKey: 'stage1',
          completedDate: '2021-01-01',
          inProgress: false,
          status: 'completed',
          trackerItemHeader: 'header1',
          firstPage: 'first1',
          endPage: 'end1',
          hideButton: true,
        },
      ],
    });
    render(<TrackerBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('tracker-item-stage1-button')).not.toBeInTheDocument();
  });
});
