import { CmsPage } from '../api/content/types/page';
import { CmsTenant } from '../api/content/types/tenant';
import { MemberQuote } from '../api/mdp/types';

export const TENANT: CmsTenant = {
  businessGroup: { elementType: 'text', values: [] },
  headerText: { elementType: 'text', value: 'Willis Towers Watson' },
  primaryColor: { elementType: 'text', value: '#8E2ADD' },
  secondaryColor: { elementType: 'text', value: '#00C488' },
  tertiaryColor: { elementType: 'text', value: '#C8B9D7' },
  tenantName: { elementType: 'text', value: 'WTW' },
  realm: { elementType: 'text', value: 'Realm1' },
  tenantLogo: {
    asset: {
      altText: '',
      fileName: 'NatWestWTWLogo.png',
      fileSize: 2151,
      height: 50,
      id: '1d822b17-9b37-4db7-9800-390df5d467a5',
      mediaType: 'image/png',
      resourceUri: '/delivery/v1/resources/fd9be909-f009-464a-a5bd-f8c2af17ddc5',
      width: 208,
    },
    elementType: 'image',
    mode: 'shared',
    renditions: {
      default: {
        height: 50,
        source: '/delivery/v1/resources/fd9be909-f009-464a-a5bd-f8c2af17ddc5',
        url: '/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/fd9b/fd9be909-f009-464a-a5bd-f8c2af17ddc5.png',
        width: 208,
      },
    },
    url: '/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/fd9b/fd9be909-f009-464a-a5bd-f8c2af17ddc5.png',
  },
  tenantUrl: { elementType: 'text', value: 'wtw-mdp-hbtas-dev-web.m3tasite.net' },
  logoutUrl: { elementType: 'text', value: '' },
  expiredSessionUrl: { elementType: 'text', value: '' },
};

export const MEMBER_QUOTES: MemberQuote = {
  label: 'ReducedPensionDCAsLumpSum',
  totalPension: 100,
  totalSpousePension: 100,
  lastSearchedRetirementDate: '2022-08-24T00:00:00+00:00',
  expirationDate: '2022-04-04T10:24:48.171791+00:00',
  selectedRetirementDate: '2022-08-24T00:00:00+00:00',
  retirementApplicationStatus: 'StartedRA',
  submissionDate: null,
  pensionTranches: [],
  annuityPurchaseAmount: null,
  sequenceNumber: 1,
};

export const PAGE: CmsPage = {
  content: { values: null },
  pageHeader: { value: 'pageHeader' },
  pageUrl: { value: 'pageUrl', elementType: 'text' },
  pageKey: { value: 'page_key', elementType: 'text' },
};

export const LINK_GROUPS: NonNullable<NonNullable<CmsTenant['footer']>['value']>['elements']['linkGroups'] = {
  elementType: 'string',
  values: [
    {
      links: {
        draft: { href: 'string' },
        retire: { href: 'string' },
        self: { href: 'string' },
        type: { href: 'string' },
      },
      id: 'string',
      name: 'string',
      status: 'string',
      type: 'string',
      typeId: 'string',
      description: 'string',
      elements: {
        accessGroups: { value: 'string' },
        defaultHeaderLabel: { value: 'string' },
        groupNameLabel: { value: 'string' },
        header: {
          elementType: 'text',
          value: 'Legal',
        },

        items: {
          elementType: ' string',
          values: [
            {
              elements: {
                content: {
                  elementType: 'formattedtext',
                  value: 'string',
                },
                header: {
                  elementType: 'text',
                  value: 'Terms & Conditions',
                },
                headerLink: {
                  elementType: 'text',
                  value: '/terms',
                },
              },
              type: 'Content HTML block',
            },
            {
              elements: {
                content: {
                  elementType: 'formattedtext',
                  value: 'string',
                },

                header: {
                  elementType: 'text',
                  value: 'Site Cookie Notice',
                },
                headerLink: {
                  elementType: 'text',
                  value: '/sitecookie',
                },
              },
              type: 'Content HTML block',
            },
            {
              elements: {
                content: {
                  elementType: 'formattedtext',
                  value: '',
                },

                header: {
                  elementType: 'text',
                  value: 'Site Privacy Notice',
                },
                headerLink: {
                  elementType: 'text',
                  value: '/siteprivacy',
                },
              },
              type: 'Content HTML block',
            },
          ],
        },
      },
    },
  ],
};

export function generateFormValues<T>(validForm: T, value?: DeepPartial<T>): DeepPartial<T> {
  return { ...validForm, ...((value ?? {}) as any) };
}
