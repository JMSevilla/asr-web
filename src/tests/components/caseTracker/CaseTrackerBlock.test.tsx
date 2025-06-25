import { CaseTrackerBlock } from '../../../components/blocks/caseTracker/CaseTrackerBlock';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ update: jest.fn() }),
}));
jest.mock('../../../components/ParsedHtml', () => ({
  ParsedHtml: ({ html }: { html: string; fontSize: string }) => <span>{html}</span>,
}));
jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: {
      data: {
        documents: [
          { tag: 'code1', status: 'INC' },
          { tag: 'code2', status: 'MIR' },
          { tag: 'code3', status: 'COMP' },
          { tag: 'code4', status: 'AWR' },
          { tag: 'code5', status: 'INC' },
          { tag: 'code6', status: 'NA' },
        ],
      },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false, data: null, error: false }),
}));

describe('CaseTrackerBlock', () => {
  it('renders', () => {
    render(<CaseTrackerBlock id="id" pageKey="page" parameters={[]} />);
    expect(screen.getByTestId('case-tracker-block')).toBeInTheDocument();
  });

  it('filters documents based on document_codes parameter', () => {
    render(
      <CaseTrackerBlock
        id="id"
        pageKey="page"
        parameters={[
          { key: 'document_codes', value: 'code6;code3;code2;code1' },
          { key: 'case_type', value: 'type' },
        ]}
      />,
    );
    expect(screen.getByTestId('case-doc-code1')).toBeInTheDocument();
    expect(screen.getByTestId('case-doc-code2')).toBeInTheDocument();
    expect(screen.getByTestId('case-doc-code3')).toBeInTheDocument();
    expect(screen.queryByTestId('case-doc-code4')).not.toBeInTheDocument();
    expect(screen.queryByTestId('case-doc-code5')).not.toBeInTheDocument();
    expect(screen.queryByTestId('case-doc-code6')).toBeInTheDocument();
  });
});
