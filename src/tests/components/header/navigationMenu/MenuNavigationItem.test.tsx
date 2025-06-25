import React, { ComponentProps } from 'react';
import { MenuNavigationItem } from '../../../../components/header/navigationMenu/MenuNavigationItem';
import { render, screen } from '../../../common';

const DEFAULT_PROPS: ComponentProps<typeof MenuNavigationItem> = {
  id: 1,
  item: {
    elements: {
      icon: { elementType: 'text', value: '' },
      link: { elementType: 'text', value: '' },
      name: { elementType: 'text', value: 'Resources' },
      openDialog: {
        value: {
          elements: {
            callToAction: {
              values: [
                {
                  elements: {
                    analyticsKey: { elementType: 'text', value: 'value' },
                    anchor: { elementType: 'text', value: 'value' },
                    buttonKey: { elementType: 'text', value: 'menu_resources_modal_button' },
                    buttonLink: {
                      elementType: 'text',
                      value: 'https://epast.internal.towerswatson.com/page-id/PYE_SCHDOC1',
                    },
                    buttonText: { elementType: 'text', value: 'Continue to view your resources' },
                    buttonType: { value: { label: 'Primary', selection: 'Primary' } },
                    disabledReason: { elementType: 'text', value: '' },
                    notification: { elementType: 'text', value: 'value' },
                    openInTheNewTab: { elementType: 'toggle', value: false },
                    pageKey: { elementType: 'text', value: 'value' },
                    postToEndpoint: { elementType: 'text', value: 'value' },
                    reuseUrlParameters: { elementType: 'toggle', value: false },
                    rightSideIcon: { elementType: 'toggle', value: false },
                  },
                },
              ],
            },
            closeDialogButtonText: { elementType: 'text', value: '' },
            dataSourceUrl: { elementType: 'text', value: 'value' },
            dialogKey: { elementType: 'text', value: 'value' },
            header: { elementType: 'text', value: "We're updating this feature" },
            text: {
              elementType: 'formattedtext',
              value:
                '<p>You can still access your resources in your secure digital pension area, but the look and feel will be different.</p>\n',
            },
            panel: {
              value: {
                elements: {
                  columns: { values: [] },
                  header: { value: 'header' },
                  layout: {
                    value: {
                      label: '50/50',
                      selection: '50/50',
                    },
                  },
                },
              },
            },
          },
          type: 'Dialog',
        },
      },
      relatedLinks: { elementType: 'text', value: '' },
      buttonAsMenuItem: {
        value: {
          elements: {
            analyticsKey: { elementType: 'text', value: '' },
            anchor: { elementType: 'text', value: '' },
            buttonKey: { elementType: 'text', value: 'db_hub_menu_transfer_quote_button' },
            buttonLink: { elementType: 'text', value: '' },
            buttonText: { elementType: 'text', value: 'Transferring my benefits' },
            buttonType: { value: { label: 'Link', selection: 'Link' } },
            customActionKey: { elementType: 'text', value: 'start-journey-action' },
            disabledReason: { elementType: 'text', value: '' },
            fastForwardComparisonPageKey: { elementType: 'text', value: '' },
            fastForwardRedirectPageKey: { elementType: 'text', value: '' },
            openInTheNewTab: { elementType: 'toggle', value: false },
            pageKey: { elementType: 'text', value: 'quote_request_transfer' },
            reuseUrlParameters: { elementType: 'toggle', value: false },
            widthPercentage: { elementType: 'number', value: 0 },
          },
        },
      },
    },
    type: 'Sub menu item',
  },
  firstMenuSubItemRef: {} as React.RefObject<HTMLLIElement>,
  queryParams: {},
  length: 3,
  active: true,
  isButton: false,
  handleItemClick: jest.fn(),
  close: jest.fn(),
};

jest.mock('../../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

describe('MenuNavigationItem', () => {
  it('should render menu item', () => {
    const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });
    render(
      <MenuNavigationItem
        {...DEFAULT_PROPS}
        firstMenuSubItemRef={useRefSpy as unknown as React.RefObject<HTMLLIElement>}
      />,
    );
    expect(screen.getByTestId('navigation-hover-menu-item-1')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });
  it('should render menu item as button', () => {
    const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });
    render(
      <MenuNavigationItem
        {...DEFAULT_PROPS}
        firstMenuSubItemRef={useRefSpy as unknown as React.RefObject<HTMLLIElement>}
        isButton={true}
      />,
    );

    expect(screen.getByTestId('content-button-block')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });
});
