import { Parser } from 'simple-text-parser';
import { CmsGlobals } from '../api/content/types/globals';
import { CmsMenu, MenuItem } from '../api/content/types/menu';
import { CmsPage } from '../api/content/types/page';
import { CmsFooter, CmsTenant } from '../api/content/types/tenant';
import { CmsTokens } from '../api/types';
import { formatUserAddress } from '../business/address';
import { NA_SYMBOL } from '../business/constants';
import { currencyValue } from '../business/currency';
import { formatDate, isoTimeToText, isoTimeToYears } from '../business/dates';
import { extractLabelByKey } from '../business/globals';
import { formatFirstName } from '../business/names';
import { sequencedNumber } from '../business/numbers';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';
import { useTenantContext } from '../core/contexts/TenantContext';
import { useCachedCmsTokens } from '../core/contexts/contentData/useCachedCmsTokens';
import {
  PersistentAppState,
  usePersistentAppState,
} from '../core/contexts/persistentAppState/PersistentAppStateContext';
import { InterpolationTokens } from './types';

export const injectTokenValuesToPage = (
  tenant: CmsTenant | null,
  page: CmsPage | null,
  globals: CmsGlobals | null,
  footer: CmsFooter | null,
  menuItems: MenuItem[] | null,
  cmsTokens: CmsTokens | null,
  persistentAppState: PersistentAppState,
): { page: CmsPage | null; globals: CmsGlobals | null; footer: CmsFooter | null; menu: CmsMenu | null } => {
  const menu = { value: menuItems };
  if (!tenant || !page || !globals || !footer || !menu) {
    return { page, globals, footer, menu };
  }

  const parser = createCmsTokenParser(tenant, globals, cmsTokens, persistentAppState);
  const enrichedPage = injectCmsTokenValues(page, parser);
  const enrichedGlobals = injectCmsTokenValues(globals, parser);
  const enrichedFooter = injectCmsTokenValues(footer, parser);
  const enrichedMenu = injectCmsTokenValues(menu, parser);

  return {
    page: enrichedPage as CmsPage,
    globals: enrichedGlobals as CmsGlobals,
    footer: enrichedFooter as CmsFooter,
    menu: enrichedMenu as CmsMenu,
  };
};

export const useTokenEnrichedValue = <T extends Object>(value?: T | null) => {
  const { tenant } = useTenantContext();
  const { globals } = useGlobalsContext();
  const cmsTokens = useCachedCmsTokens();
  const persistentAppState = usePersistentAppState();

  if (!globals || !value) {
    return value;
  }

  const parser = createCmsTokenParser(tenant, globals, cmsTokens.data, persistentAppState);
  const enrichedValue = injectCmsTokenValues(value, parser);
  return enrichedValue as T;
};

export const createCmsTokenParser = (
  tenant: CmsTenant,
  globals: CmsGlobals,
  cmsTokens: CmsTokens | null,
  persistentAppState: PersistentAppState,
) => {
  const parser = new Parser();

  const TOKEN_VALUE_PAIRS = {
    todays_date: formatDate(Date.now()),
    tenant_name: tenant.tenantName.value,
    name: formatFirstName(cmsTokens?.name),
    normal_retirement_date: cmsTokens?.normalRetirementDate ? formatDate(cmsTokens.normalRetirementDate) : null,
    target_retirement_date: cmsTokens?.targetRetirementDate ? formatDate(cmsTokens.targetRetirementDate) : null,
    target_retirement_age: cmsTokens?.targetRetirementAgeIso
      ? isoTimeToText(globals, cmsTokens.targetRetirementAgeIso, 2)
      : null,
    time_to_target_retirement: cmsTokens?.timeToTargetRetirementIso
      ? isoTimeToText(globals, cmsTokens.timeToTargetRetirementIso, 2)
      : null,
    target_retirement_age_years: cmsTokens?.targetRetirementAgeIso
      ? isoTimeToYears(cmsTokens.targetRetirementAgeIso)?.toString()
      : null,
    selected_retirement_date: cmsTokens?.selectedRetirementDate ? formatDate(cmsTokens.selectedRetirementDate) : null,
    submission_date: cmsTokens?.submissionDate ? formatDate(cmsTokens.submissionDate) : null,
    selected_retirement_age: cmsTokens?.selectedRetirementAge?.toString(),
    normal_retirement_age: cmsTokens?.normalRetirementAge?.toString(),
    earliest_retirement_age: cmsTokens?.earliestRetirementAge?.toString(),
    earliest_retirement_date: cmsTokens?.earliestRetirementDate ? formatDate(cmsTokens.earliestRetirementDate) : null,
    latest_retirement_age: cmsTokens?.latestRetirementAge?.toString(),
    chosen_LTA_percentage: cmsTokens?.chosenLtaPercentage?.toString() || NA_SYMBOL,
    remaining_LTA_percentage: cmsTokens?.remainingLtaPercentage?.toString(),
    LTA_limit: cmsTokens?.ltaLimit ? currencyValue(cmsTokens.ltaLimit) : null,
    email: persistentAppState.bereavement.form.values?.reporter?.unverifiedEmail || cmsTokens?.email?.toString(),
    phone_number: cmsTokens?.phoneNumber
      ? `+${cmsTokens.phoneNumber}`
      : extractLabelByKey(globals, 'phone_number_is_not_available'),
    retirement_journey_expiration_date: cmsTokens?.retirementJourneyExpirationDate
      ? formatDate(cmsTokens.retirementJourneyExpirationDate)
      : null,
    GMP_Age: yearsMonthsString(globals, cmsTokens?.gmpAgeYears, cmsTokens?.gmpAgeMonths),
    GMP_Age_Year: cmsTokens?.gmpAgeYears?.toString(),
    GMP_Age_Month: cmsTokens?.gmpAgeMonths?.toString(),
    pre88_GMP_GMPAge: cmsTokens?.pre88GMPAtGMPAge ? currencyValue(cmsTokens.pre88GMPAtGMPAge) : null,
    post88_GMP_GMPAge: cmsTokens?.post88GMPAtGMPAge ? currencyValue(cmsTokens.post88GMPAtGMPAge) : null,
    post88_GMP_Increase_Cap: cmsTokens?.post88GMPIncreaseCap ? currencyValue(cmsTokens.post88GMPIncreaseCap) : null,
    state_Pension_Deduction: cmsTokens?.statePensionDeduction ? currencyValue(cmsTokens.statePensionDeduction) : null,
    PA04_Date: cmsTokens?.pa04Date ? formatDate(cmsTokens.pa04Date) : null,
    system_date: cmsTokens?.systemDate ? formatDate(cmsTokens.systemDate) : null,
    normal_minimum_pension_age: yearsMonthsString(
      globals,
      cmsTokens?.normalMinimumPensionAgeYears,
      cmsTokens?.normalMinimumPensionAgeMonths,
    ),
    insurance_number: cmsTokens?.insuranceNumber,
    date_of_birth: cmsTokens?.dateOfBirth ? formatDate(cmsTokens.dateOfBirth) : null,
    multiline_address: cmsTokens?.address
      ? formatUserAddress(cmsTokens.address, ', ')
      : extractLabelByKey(globals, 'address_is_not_available'),
    address_with_lines: cmsTokens?.address
      ? formatUserAddress(cmsTokens.address, '<br>')
      : extractLabelByKey(globals, 'address_is_not_available'),
    earliest_start_ra_date_for_selected_retirement_date: cmsTokens?.earliestStartRaDateForSelectedDate
      ? formatDate(cmsTokens.earliestStartRaDateForSelectedDate)
      : null,
    latest_start_ra_date_for_selected_retirement_date: cmsTokens?.latestStartRaDateForSelectedDate
      ? formatDate(cmsTokens.latestStartRaDateForSelectedDate)
      : null,
    selected_option_number: cmsTokens?.selectedOptionNumber?.toString(),
    transfer_guarantee_expiry_date: cmsTokens?.transferGuaranteeExpiryDate
      ? formatDate(cmsTokens.transferGuaranteeExpiryDate)
      : null,
    transfer_guarantee_period: cmsTokens?.transferGuaranteePeriodMonths
      ? `${cmsTokens.transferGuaranteePeriodMonths} ${
          cmsTokens.transferGuaranteePeriodMonths === 1
            ? extractLabelByKey(globals, 'month')
            : extractLabelByKey(globals, 'months')
        }`
      : null,
    transfer_reply_by_date: cmsTokens?.transferReplyByDate ? formatDate(cmsTokens.transferReplyByDate) : null,
    transfer_quote_original_run_date: cmsTokens?.transferQuoteRunDate
      ? formatDate(cmsTokens.transferQuoteRunDate)
      : null,
    pension_payment_date: cmsTokens?.pensionPaymentDay ? sequencedNumber(cmsTokens.pensionPaymentDay) : null,
    time_to_normal_retirement: cmsTokens?.timeToNormalRetirementIso
      ? isoTimeToText(globals, cmsTokens.timeToNormalRetirementIso, 2)
      : null,
    bereavement_case_no: cmsTokens?.bereavementCaseNumber,
    current_age_formatted: cmsTokens?.currentAgeIso ? isoTimeToText(globals, cmsTokens.currentAgeIso, 2) : null,
    pension_per_year: cmsTokens?.totalPension ? currencyValue(cmsTokens.totalPension) : null,
    total_avcs: cmsTokens?.totalAVCFund ? currencyValue(cmsTokens.totalAVCFund) : null,
    dc_balance: cmsTokens?.dcBalance ? currencyValue(cmsTokens.dcBalance) : NA_SYMBOL,
    dc_projected_balance: cmsTokens?.dcProjectedBalance ? currencyValue(cmsTokens.dcProjectedBalance) : NA_SYMBOL,
  };

  Object.entries(TOKEN_VALUE_PAIRS).forEach(([key, value]) =>
    parser.addRule(`[[token:${key}]]`, () => value ?? `[[token:${key}]]`),
  );

  globals?.labels?.forEach(({ elements: { labelKey, labelText } }) => {
    const resolvedText = parser.render(labelText.value);
    parser.addRule(`[[label:${labelKey.value}]]`, () => resolvedText);
  });

  return parser;
};

export const injectCmsTokenValues = <T extends Object>(content: T, parser: Parser): T => {
  if (typeof content === 'string') {
    return cleanRenderedText(parser.render(content)) as unknown as T;
  }
  Object.entries(content ?? {}).forEach(([key, val]) => {
    if (typeof val === 'object') {
      injectCmsTokenValues(val, parser);
    }
    if (typeof val === 'string') {
      (content as unknown as { [key: string]: string })[key] = cleanRenderedText(parser.render(val));
    }
  });
  return content;
};

export const injectTokensToText = (text: string, tokens: InterpolationTokens) => {
  const parser = new Parser();
  Object.entries(tokens).forEach(([key, value]) =>
    parser.addRule(`[[token:${key}]]`, () => value ?? `[[token:${key}]]`),
  );
  return parser.render(text);
};

const yearsMonthsString = (globals: CmsGlobals | null, years?: number | null, months?: number | null) => {
  if (!years && years !== 0 && !months) {
    return null;
  }
  const yearsText = `${years} ${extractLabelByKey(globals, years === 1 ? 'year' : 'years')}`;
  const monthsText = months ? ` ${months} ${extractLabelByKey(globals, months === 1 ? 'month' : 'months')}` : '';
  return yearsText + monthsText;
};

const cleanRenderedText = (text: string) => {
  return text
    .replace(/\s*,\s*(?=\s|$|<)|\s+,\s*(?=\s|$|<)/g, ',')
    .replace(/(\s*,\s*<br\s*\/?>)/, ',<br/>')
    .replace(/>\s*,\s*</g, '>,<')
    .trim();
};

const rulePatterns = [
  /\[\[modal:([^\]]*)]]/gi,
  /\[\[tooltip:([^\]]*)]]/gi,
  /\[\[message:([^\]]*)]]/gi,
  /\[\[button:([^\]]*)]]/gi,
  /\[\[timer:([^\]]*)]]/gi,
  /\[\[icon:([^\]]*)]]/gi,
  /\[\[badge:([^\]]*)]]/gi,
];

export function hasMatchingParserRule(text: string): boolean {
  return rulePatterns.some(pattern => pattern.test(text));
}
