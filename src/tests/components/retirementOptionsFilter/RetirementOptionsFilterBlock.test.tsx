import { RetirementOptionsFilterBlock } from '../../../components/blocks/retirementOptionsFilter/RetirementOptionsFilterBlock';
import { useRetirementOptionsFilterState } from '../../../components/blocks/retirementOptionsFilter/hooks';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { act, fireEvent, render, screen, waitFor } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({ values: {}, save: jest.fn() }),
}));

jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: null,
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

jest.mock('../../../components/blocks/retirementOptionsFilter/hooks', () => ({
  useRetirementOptionsFilterState: jest.fn().mockReturnValue({
    date: new Date(),
    checkboxes: {},
  }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parseUrlAndPush: jest.fn() }),
}));

const panelList = [
  {
    elements: {
      columns: {
        values: [
          {
            contentBlocks: {
              values: [
                {
                  elements: {
                    checkbox: {
                      values: [
                        {
                          checkboxKey: {
                            value: 'early',
                          },
                          checkboxText: {
                            value: 'early',
                          },
                          defaultState: {
                            value: true,
                          },
                          isMandatory: {
                            value: false,
                          },
                        },
                        {
                          checkboxKey: {
                            value: 'invested',
                          },
                          checkboxText: {
                            value: 'invested',
                          },
                          defaultState: {
                            value: true,
                          },
                          isMandatory: {
                            value: false,
                          },
                        },
                        {
                          checkboxKey: {
                            value: 'cash',
                          },
                          checkboxText: {
                            value: 'cash',
                          },
                          defaultState: {
                            value: true,
                          },
                          isMandatory: {
                            value: false,
                          },
                        },
                        {
                          checkboxKey: {
                            value: 'additional',
                          },
                          checkboxText: {
                            value: 'additional',
                          },
                          defaultState: {
                            value: true,
                          },
                          isMandatory: {
                            value: false,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
] as any;

describe('RetirementOptionsFilterBlock', () => {
  it('should render', () => {
    render(
      <RetirementOptionsFilterBlock
        id={''}
        pageKey={''}
        parameters={[]}
        journeyType={'retirement'}
        panelList={panelList}
      />,
    );
    expect(screen.getByTestId('retirement-options-filter-form')).toBeInTheDocument();
  });

  it('should display loader', () => {
    jest.mocked(useJourneyStepData).mockReturnValue({ loading: true, save: jest.fn() } as any);
    render(
      <RetirementOptionsFilterBlock
        id={''}
        pageKey={''}
        parameters={[]}
        journeyType={'retirement'}
        panelList={panelList}
      />,
    );
    expect(screen.getByTestId('retirement-options-filter-loader')).toBeInTheDocument();
  });

  it('should render checkboxes', async () => {
    jest.mocked(useJourneyStepData).mockReturnValue({
      checkboxes: {
        early: false,
        invested: true,
        cash: false,
        additional: false,
      },
      isDirty: true,
      save: jest.fn(),
    } as any);

    render(
      <RetirementOptionsFilterBlock
        id={''}
        pageKey={''}
        parameters={[]}
        journeyType={'retirement'}
        panelList={panelList}
      />,
    );
    expect(screen.getByTestId('cash')).toBeInTheDocument();
    expect(screen.getByTestId('early')).toBeInTheDocument();
    expect(screen.getByTestId('invested')).toBeInTheDocument();
    expect(screen.getByTestId('additional')).toBeInTheDocument();
  });

  it('should save generic data on continue button click', async () => {
    const saveFn = jest.fn();
    const refreshFn = jest.fn();
    jest.mocked(useCachedCmsTokens).mockReturnValue({ refresh: refreshFn, loading: true } as any);
    jest.mocked(useJourneyStepData).mockReturnValue({ save: saveFn, loading: false } as any);
    jest.mocked(useRetirementOptionsFilterState).mockReturnValue({
      date: new Date(),
      checkboxes: {
        early: false,
        invested: true,
        cash: false,
        additional: false,
      },
      isDirty: true,
      isDateFilterDirty: true,
      isAnyCheckboxDirty: true,
      updateDate: jest.fn(),
      updateCheckbox: jest.fn(),
      saveLastSubmittedValues: jest.fn(),
    });

    render(
      <RetirementOptionsFilterBlock
        id={''}
        pageKey={''}
        parameters={[]}
        journeyType={'retirement'}
        panelList={panelList}
      />,
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId('cash'), { target: { value: true } });
      expect(screen.getAllByRole('button')[1]).toBeEnabled();
      fireEvent.click(screen.getAllByRole('button')[1]);
    });

    await waitFor(() => {
      expect(saveFn).toBeCalledTimes(1);
      expect(refreshFn).toBeCalledTimes(1);
    });
  });
});
