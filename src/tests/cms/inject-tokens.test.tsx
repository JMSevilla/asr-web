import { Parser } from 'simple-text-parser';
import { CmsGlobals } from '../../api/content/types/globals';
import { MenuItem } from '../../api/content/types/menu';
import { CmsPage } from '../../api/content/types/page';
import { CmsFooter, CmsTenant } from '../../api/content/types/tenant';
import { CmsTokens } from '../../api/types';
import {
  createCmsTokenParser,
  hasMatchingParserRule,
  injectCmsTokenValues,
  injectTokenValuesToPage,
  injectTokensToText,
} from '../../cms/inject-tokens';
import { InterpolationTokens } from '../../cms/types';
import { TENANT } from '../mock';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../business/address', () => ({
  formatUserAddress: jest.fn((address, separator) =>
    address ? `formatted-address${separator}mock` : 'address-not-available',
  ),
}));

jest.mock('../../business/currency', () => ({
  currencyValue: jest.fn(value => `£${value}`),
}));

jest.mock('../../business/dates', () => ({
  formatDate: jest.fn(() => '01/01/2023'),
  isoTimeToText: jest.fn(() => '5 years, 2 months'),
  isoTimeToYears: jest.fn(() => 5),
}));

jest.mock('../../business/globals', () => ({
  extractLabelByKey: jest.fn((globals, key) => `translated-${key}`),
}));

jest.mock('../../business/names', () => ({
  formatFirstName: jest.fn(name => (name ? `formatted-${name}` : null)),
}));

jest.mock('../../business/numbers', () => ({
  sequencedNumber: jest.fn(num => `${num}${num === 1 ? 'st' : 'th'}`),
}));

describe('inject-tokens', () => {
  // Test data for additional tests
  const mockTenant: CmsTenant = {
    ...TENANT,
    tenantName: { elementType: 'text', value: 'Test Tenant' },
  };

  const mockGlobals: CmsGlobals = {
    labels: [
      {
        elements: {
          labelKey: { value: 'test_label', elementType: 'text' },
          labelText: { value: 'This is a [[token:tenant_name]] test', elementType: 'text' },
          linkTarget: { value: '', elementType: 'text' },
        },
        type: 'Label',
      },
      {
        elements: {
          labelKey: { value: 'month', elementType: 'text' },
          labelText: { value: 'month', elementType: 'text' },
          linkTarget: { value: '', elementType: 'text' },
        },
        type: 'Label',
      },
      {
        elements: {
          labelKey: { value: 'months', elementType: 'text' },
          labelText: { value: 'months', elementType: 'text' },
          linkTarget: { value: '', elementType: 'text' },
        },
        type: 'Label',
      },
      {
        elements: {
          labelKey: { value: 'year', elementType: 'text' },
          labelText: { value: 'year', elementType: 'text' },
          linkTarget: { value: '', elementType: 'text' },
        },
        type: 'Label',
      },
      {
        elements: {
          labelKey: { value: 'years', elementType: 'text' },
          labelText: { value: 'years', elementType: 'text' },
          linkTarget: { value: '', elementType: 'text' },
        },
        type: 'Label',
      },
    ],
  };

  const mockTokens: Partial<CmsTokens> = {
    name: 'John',
    normalRetirementDate: '2030-01-01',
    phoneNumber: '441234567890',
    email: 'test@example.com',
    totalPension: 50000,
    address: {
      streetAddress1: '123 Main St',
      streetAddress2: 'Apt 4B',
      country: 'UK',
      postCode: 'W1A 1AA',
      countryCode: 'GB',
    },
  };

  const mockPersistentAppState = {
    bereavement: {
      form: {
        values: {
          reporter: {
            unverifiedEmail: 'bereaved@example.com',
          },
        },
      },
      expiration: {},
    },
    transfer: {},
    checkbox: {},
    fastForward: {},
  };

  describe('injectCmsTokenValues', () => {
    it('should replace tokens in a string', () => {
      const parser = new Parser();
      parser.addRule('[[token:name]]', () => 'John');

      const result = injectCmsTokenValues('Hello [[token:name]]', parser);
      expect(result).toBe('Hello John');
    });

    it('should replace tokens in nested objects', () => {
      const parser = new Parser();
      parser.addRule('[[token:name]]', () => 'John');
      parser.addRule('[[token:email]]', () => 'john@example.com');

      const obj = {
        greeting: 'Hello [[token:name]]',
        details: {
          email: 'Your email is [[token:email]]',
        },
      };

      const result = injectCmsTokenValues(obj, parser);
      expect(result.greeting).toBe('Hello John');
      expect(result.details.email).toBe('Your email is john@example.com');
    });

    it('should clean rendered text', () => {
      const parser = new Parser();
      parser.addRule('[[token:address]]', () => 'formatted-address , mock');

      const result = injectCmsTokenValues('Address: [[token:address]] , Test', parser);
      expect(result).toBe('Address: formatted-address, mock, Test');
    });
  });

  describe('injectTokensToText', () => {
    it('should inject tokens into text using a custom token map', () => {
      const tokens: InterpolationTokens = {
        name: 'John',
        age: '30',
      };

      const result = injectTokensToText('Hello [[token:name]], you are [[token:age]] years old', tokens);
      expect(result).toBe('Hello John, you are 30 years old');
    });

    it('should handle missing token values', () => {
      const tokens: InterpolationTokens = {
        name: 'John',
      };

      const result = injectTokensToText('Hello [[token:name]], you are [[token:age]] years old', tokens);
      expect(result).toBe('Hello John, you are [[token:age]] years old');
    });
  });

  describe('createCmsTokenParser', () => {
    it('should create a parser that replaces tokens', () => {
      const parser = createCmsTokenParser(
        mockTenant,
        mockGlobals,
        mockTokens as CmsTokens,
        mockPersistentAppState as any,
      );

      // Test token replacement
      const result = parser.render('Hello [[token:name]]');
      expect(result).toBe('Hello formatted-John');
    });

    it('should handle token values that use other tokens', () => {
      // Test a case where labels can contain tokens that need to be resolved
      const parser = createCmsTokenParser(
        mockTenant,
        mockGlobals,
        mockTokens as CmsTokens,
        mockPersistentAppState as any,
      );

      // Test label token resolution (defined in mockGlobals)
      const result = parser.render('[[label:test_label]]');
      expect(result).toBe('This is a Test Tenant test');
    });

    it('should keep tokens that cannot be resolved', () => {
      const parser = createCmsTokenParser(
        mockTenant,
        mockGlobals,
        mockTokens as CmsTokens,
        mockPersistentAppState as any,
      );

      const result = parser.render('Value: [[token:non_existent_token]]');
      expect(result).toBe('Value: [[token:non_existent_token]]');
    });
  });

  describe('injectTokenValuesToPage', () => {
    it('should enrich page, globals, footer and menu with token values', () => {
      const mockPage: CmsPage = {
        pageHeader: { value: 'Welcome [[token:name]]' },
        pageUrl: { value: '/test', elementType: 'text' },
        pageKey: { value: 'test_page', elementType: 'text' },
        content: { values: [] },
      };

      const mockFooter: CmsFooter = {
        elementType: 'string',
        elements: {
          accessGroups: { value: '', elementType: 'text' },
          defaultHeaderLabel: { value: '', elementType: 'text' },
          panelHeaderLabel: { value: '', elementType: 'text' },
          linkGroups: {
            elementType: 'string',
            values: [],
          },
        },
      };

      const mockMenuItems: MenuItem[] = [
        {
          elements: {
            link: { value: '/dashboard', elementType: 'text' },
            name: { value: 'Hello [[token:name]]', elementType: 'text' },
            position: {
              value: {
                label: 'Left',
                selection: 'Left',
              },
            },
            orderNo: { value: 1, elementType: 'number' },
            relatedLinks: { value: '', elementType: 'text' },
          },
          type: 'Menu Item',
        },
      ];

      const result = injectTokenValuesToPage(
        mockTenant,
        mockPage,
        mockGlobals,
        mockFooter,
        mockMenuItems,
        mockTokens as CmsTokens,
        mockPersistentAppState as any,
      );

      expect(result.page?.pageHeader?.value).toBe('Welcome formatted-John');
      expect(result.menu?.value?.[0].elements.name.value).toBe('Hello formatted-John');
    });

    it('should return unmodified objects when inputs are null', () => {
      const result = injectTokenValuesToPage(null, null, null, null, null, null, mockPersistentAppState as any);

      expect(result.page).toBeNull();
      expect(result.globals).toBeNull();
      expect(result.footer).toBeNull();
      expect(result.menu?.value).toBeNull();
    });
  });

  describe('hasMatchingParserRule', () => {
    it('returns true for matching [[modal:...]]', () => {
      const input = 'Open this [[modal:InfoModal]] for more info';
      expect(hasMatchingParserRule(input)).toBe(true);
    });

    it('returns true for matching [[tooltip:...]]', () => {
      const input = 'Hover for [[tooltip:TooltipText]]';
      expect(hasMatchingParserRule(input)).toBe(true);
    });

    it('returns false for plain text with no patterns', () => {
      const input = 'This is just a normal sentence.';
      expect(hasMatchingParserRule(input)).toBe(false);
    });

    it('returns true for multiple patterns in one string', () => {
      const input = '[[badge:Gold]] and [[icon:Star]]';
      expect(hasMatchingParserRule(input)).toBe(true);
    });

    it('is case-insensitive', () => {
      const input = '[[TOOLTIP:Help]]';
      expect(hasMatchingParserRule(input)).toBe(true);
    });
  });
});
