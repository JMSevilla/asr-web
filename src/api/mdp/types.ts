import { BereavementFormValues } from '../../core/contexts/persistentAppState/hooks/bereavement/form';
import { JourneyTypeSelection } from '../content/types/page';

export interface MdpUserParams {
  preRetirementAgePeriod: number;
  newlyRetiredRange: number;
  retirementApplicationPeriod: number;
}

export type AnalyticsParams = Partial<{
  businessGroup: string;
  status: string;
  schemeType: string;
  schemeCode: string;
  categoryCode: string;
  locationCode: string;
  employerCode: string;
  gender: string;
  income: string;
  isAvc: boolean;
  tenure: number;
  lifeStage: string;
  dbCalculationStatus: string;
  earliestRetirementAge: number;
  hasAdditionalContributions: boolean;
  latestRetirementAge: number;
  maritalStatus: string;
  normalRetirementAge: number;
  normalRetirementDate: string;
  retirementApplicationStatus: string;
  targetRetirementAge: number;
  targetRetirementDate: string;
  tenantUrl: string;
  transferApplicationStatus: string;
  userId: string;
  dcRetirementJourney?: string;
  dcexploreoptionsStarted?: boolean;
  dcretirementapplicationStarted?: boolean;
  dcretirementapplicationSubmitted?: boolean;
  currentAge?: string;
  dcLifeStage?: string;
}>;

export interface UserAddress {
  streetAddress1: string;
  streetAddress2?: string;
  streetAddress3?: string;
  streetAddress4?: string;
  streetAddress5?: string;
  country?: string;
  postCode?: string;
  countryCode: string;
}

export interface UserPersonalDetails {
  title: string;
  gender: string;
  name: string;
  dateOfBirth: string;
  insuranceNumber: string;
}

export interface UserEmail {
  email: string;
}

export interface UserRetirementApplicationStatus {
  retirementApplicationStatus: string;
  earliestStartRaDateForSelectedDate: string | null;
  latestStartRaDateForSelectedDate: string | null;
  expirationRaDateForSelectedDate: string | null;
  lifeStage: string;
}

export interface EmailTokenParams {
  emailAddress: string;
  contentAccessKey: string;
}

export interface VerificationEmailTokenParams {
  emailAddress: string;
  contentAccessKey: string;
}

export interface EngagementEvents {
  events: Events[];
}

export type EngagementEventStatus = 'INCOMPLETE' | 'REVIEW' | 'COMPLETE';

interface Events {
  event: string;
  status: EngagementEventStatus;
}

export interface EmailToken {
  tokenExpirationDate: string;
}

export interface SubmitEmailParams {
  emailConfirmationToken: string;
}

export interface UserPhone {
  number: string;
  code: string;
}

export interface PhoneTokenParams {
  number: string;
  code: string;
  contentAccessKey: string;
  countryCode: string;
}

export interface PhoneToken {
  tokenExpirationDate: string;
}

export interface SubmitPhoneParams {
  mobilePhoneConfirmationToken: string;
  mobilePhoneCountry: string | undefined;
}

export type UserBankDetails = Partial<{
  accountName: string;
  accountNumber: string;
  accountCurrency: string;
  iban: string;
  sortCode: string;
  bic: string;
  clearingCode: string;
  bankName: string;
  bankCity: string;
  bankCountry: string;
  bankCountryCode: string;
}>;

export interface UserValidatedDetails {
  accountNumber: string;
  bankName: string;
  branchName: string;
  city: string;
  country: string;
  countryCode: string;
  name: string;
  postCode: string;
  sortCode: string;
  streetAddress: string;
}

export type TimeToRetirement = {
  years?: number;
  months?: number;
  ageAtRetirement?: number;
  timeToNormalRetirement?: RetirementTime;
  ageAtNormalRetirement?: RetirementTime;
  currentAge?: RetirementTime;
};

export interface RetirementTime {
  years: number;
  months: number;
  days: number;
  weeks: number;
}
export interface RetirementCalculation {
  isCalculationSuccessful: boolean;
  totalPension: number;
  totalAVCFund: number | null;
}

export interface RetirementOptions {
  fullPensionYearlyIncome?: number;
  maxLumpSum?: number;
  maxLumpSumYearlyIncome?: number;
  isCalculationSuccessful?: boolean;
}

export type RetirementDCContributions = { contributionTypes: RetirementDCContribution[] };

interface RetirementDCContribution {
  contributionType: string;
  funds?: RetirementDCFund[];
  strategies?: RetirementDCFund[];
}

export interface RetirementDCFund {
  code: string;
  name: string;
}

export interface RetirementDate {
  isCalculationSuccessful: boolean;
  retirementDate: string;
  dateOfBirth: string;
  availableRetirementDateRange: {
    from: string;
    to: string;
  };
  guaranteedQuoteEffectiveDateList?: string[];
}

export interface MemberQuote extends QuotesOption {
  lastSearchedRetirementDate?: string;
  expirationDate?: string;
  selectedRetirementDate?: string;
  retirementApplicationStatus?: string;
  submissionDate?: string | null;
  hasAvcs?: boolean;
  summaryFigures?: SummaryFigure[];
  journeyGenericDataList?: JourneyGenericData[];
}

export interface SummaryFigure {
  label: string;
  value: string;
  description?: string;
}

export interface JourneyStepParams {
  selectedQuoteName: string;
  currentPageKey: string;
  nextPageKey: string;
}

export interface StartTransferJourneyParams extends Omit<JourneyStepParams, 'selectedQuoteName'> {
  contentAccessKey: string;
}

export interface SelectedQuoteResponse {
  selectedQuoteName: string;
}

export interface RetirementJourneyStart {
  nextPageKey: string;
}

export interface RetirementJourneyEnd {
  nextPageKey: string;
}

export interface JourneyIntegrityResponse {
  redirectStepPageKey: string;
}

export interface ParseUrlParams {
  key: string;
}

export interface ParsedRetirementUrl {
  url: string;
}

export interface QuotesOption {
  label:
    | 'FullPensionDCAsOMOAnnuity'
    | 'FullPensionDCAsTransfer'
    | 'FullPensionDCAsUFPLS'
    | 'ReducedPensionDCAsOMOAnnuity'
    | 'ReducedPensionDCAsLumpSum'
    | 'ReducedPensionDCAsTransfer'
    | 'ReducedPensionDCAsUFPLS'
    | 'FullPension'
    | 'ReducedPension'
    | 'FullCommutation'
    | 'TrivialCommutation'
    | 'SmallPotCommutation';
  lumpSumFromDb?: number | null;
  lumpSumFromDc?: number | null;
  minimumLumpSum?: number | null;
  maximumLumpSum?: number | null;
  smallPotLumpSum?: number | null;
  taxFreeUfpls?: number | null;
  taxableUfpls?: number | null;
  totalLumpSum?: number | null;
  sequenceNumber: number;
  totalPension: number;
  totalSpousePension: number;
  totalUfpls?: number | null;
  transferValueOfDc?: number | null;
  trivialCommutationLumpSum?: number | null;
  pensionTranches: QuotePensionTranche[];
  annuityPurchaseAmount: number | null;
  summaryFigures?: { label: string; value: string; description?: string }[];
}

export interface QuotePensionTranche {
  trancheTypeCode: string;
  increaseTypeCode: string;
  value: number;
}

export interface NavigationKeys {
  previousPageKey: string;
  nextPageKey: string;
}
export interface NavigationPreviousKey {
  previousPageKey: string;
}

export interface SubmitStepParams {
  currentPageKey: string;
  nextPageKey: string;
}

export interface StartGenericJourneyParams extends SubmitStepParams {
  removeOnLogin: boolean;
}

export interface StartDcJourneyParams extends SubmitStepParams {
  journeyStatus: string;
  selectedQuoteName: string;
}

export interface StartDbCoreJourneyParams extends SubmitStepParams {
  retirementDate: Date;
  journeyStatus: string;
}

export interface SwitchStepParams {
  switchPageKey: string;
  nextPageKey: string;
}

export interface SubmitQuestionStepParams {
  currentPageKey: string;
  nextPageKey: string;
  answerKey: string;
  questionKey: string;
}

export interface SubmitRetirementQuestionStepParams extends SubmitQuestionStepParams {
  answerValue: string;
}
export interface SubmitGenericQuestionStepParams extends SubmitQuestionStepParams {
  answerValue: string;
}

export interface SubmitBereavementQuestionParams extends SubmitQuestionStepParams {
  answerValue: string;
  avoidBranching: boolean;
}

export interface SubmitOptOutPensionWiseParams {
  optOutPensionWise: boolean;
}

export interface OptOutPensionWiseResponse {
  optOutPensionWise?: boolean;
}

export interface SubmitLTAParams {
  percentage: number;
}

export interface SubmitPensionWiseParams {
  pensionWiseDate: Date;
}

export interface SubmitFinancialAdviseParams {
  financialAdviseDate: Date;
}

export interface FinancialAdviseResponse {
  financialAdviseDate?: string;
}

export interface PensionWiseResponse {
  pensionWiseDate?: string;
}

export interface LifetimeAllowanceResponse {
  percentage: number;
}

export interface QuestionFormResponse {
  questionKey: string;
  answerKey: string;
}

export interface DisplayableQuestionFormResponse extends QuestionFormResponse {
  answerValue: string;
}

export interface RetirementQuoteParams {
  quoteName: QuotesOption['label'];
  requestedLumpSum: number;
}

export interface RetirementQuotesV3Response {
  totalAvcFundValue: number;
  wordingFlags: string[] | null;
  isCalculationSuccessful: boolean;
  quotes: RetirementQuotesV3Option;
}

export interface RetirementQuotesV3Option {
  quotation?: { guaranteed: boolean; expiryDate: string };
  minimumPermittedTotalLumpSum?: number | null;
  maximumPermittedTotalLumpSum?: number | null;
  maximumPermittedStandardLumpSum?: number | null;
  attributes?: Record<string, number | string | null | RetirementQuotesV3PensionTranches>;
  options?: Record<string, RetirementQuotesV3Option>;
}

export type RetirementQuotesV3PensionTranches = Record<string, number | string | null>;

export interface TransferOptions {
  isCalculationSuccessful: boolean;
  transferOption: string;
  totalGuaranteedTransferValue: number;
  totalNonGuaranteedTransferValue: number;
  minimumPartialTransferValue: number;
  maximumPartialTransferValue: number;
  maximumResidualPension: number;
  minimumResidualPension: number;
  totalTransferValue: number;
  totalPensionAtDOL: number;
}

export interface TransferApplicationStatusResponse {
  status?: TransferApplicationStatus;
}

export type TransferApplicationStatus = 'StartedTA' | 'SubmitStarted' | 'NotStartedTA' | 'UnavailableTA';

export interface PensionTranches {
  nonGuaranteed: number;
  pensionTranchesResidualTotal: number;
}

export interface TransferValues {
  nonGuaranteed: number;
  transferValuesFullTotal: number;
  transferValuesPartialTotal: number;
}

export interface TransferValuesParams {
  requestedResidualPension: number;
}

export interface AgeLines {
  ageLines: number[];
}

export interface PartialTransferDownloadPdfParams {
  contentAccessKey: string;
  requestedTransferValue?: number;
  requestedResidualPension?: number;
}

export interface PaginationData {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends PaginationData {
  items: T[];
}

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  dateReceived: string;
  isRead: boolean;
}

export interface DocumentRequest {
  name?: string;
  type?: string;
  receivedDateFrom?: string;
  receivedDateTo?: string;
  ascending: boolean;
  propertyName: string;
  pageNumber: number;
  pageSize: number;
}

export interface DocumentTypes {
  types: string[];
}

export interface RetirementJourneySubmitData {
  contentAccessKey: string;
  acknowledgement: boolean;
  acknowledgementPensionWise: boolean;
  acknowledgementFinancialAdvisor: boolean;
}

export interface TransferJourneySubmitData {
  contentAccessKey: string;
}

export interface Membership {
  dateOfBirth: string | null;
  title: string | null;
  age: number | null;
  floorRoundedAge: number | null;
  forenames: string | null;
  surname: string | null;
  referenceNumber: string | null;
  normalRetirementAge: number | null;
  normalRetirementDate: string | null;
  datePensionableServiceCommenced: string | null;
  dateOfLeaving: string | null;
  transferInServiceYears: number | null;
  transferInServiceMonths: number | null;
  totalPensionableServiceYears: number | null;
  totalPensionableServiceMonths: number | null;
  finalPensionableSalary: number | null;
  schemeName: string;
  membershipNumber: string | null;
  insuranceNumber: string | null;
  status: string | null;
  payrollNumber: string | null;
  dateJoinedScheme: string | null;
  dateLeftScheme: string | null;
  hasAdditionalContributions: boolean;
  category: string | null;
  datePensionableServiceStarted: string | null;
}

export interface GbgAccessToken {
  accessToken: string;
}

export interface ContactPreference {
  email: boolean;
  sms: boolean;
  post: boolean;
}

export enum TypeToUpdate {
  Email = 'EMAIL',
  Sms = 'SMS',
  Post = 'POST',
}
export interface SubmitContactPreferenceParams {
  typeToUpdate: TypeToUpdate;
  email: boolean;
  sms: boolean;
  post: boolean;
}

export interface Address {
  city: string;
  countryIso2: string;
  addressId: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  postalCode: string;
  type: string;
}

export interface AddressSummary {
  addressId: string;
  description: string;
  type: 'Address' | 'Postcode' | 'Residential' | 'Street';
  text: string;
  highlight: string;
}

export interface SearchAddressParams {
  text: string;
  language?: string;
  container?: string;
  countries?: string | null;
}

export interface AccessKey {
  contentAccessKey: string;
  schemeType?: 'DC' | 'DB';
  schemeCodeAndCategory?: string;
}

export interface RetirementTimeline {
  retirementDate: string;
  earliestStartRaDateForSelectedDate: string;
  latestStartRaDateForSelectedDate: string;
  retirementConfirmationDate: string;
  firstMonthlyPensionPayDate: string;
  lumpSumPayDate: string;
}

export interface LinkedMember {
  referenceNumber: string;
  businessGroup: string;
  linkedReferenceNumber: string;
  linkedBusinessGroup: string;
}

export interface LinkedMembersResponse {
  linkedMembers: LinkedMember[];
}

export interface MemberRecord {
  referenceNumber: string;
  businessGroup: string;
  schemeCode: string;
  schemeDescription: string;
  dateJoinedCompany: string;
  dateJoinedScheme: string;
  dateLeft: string;
  memberStatus: string;
  recordNumber: number;
  recordType: string;
}

export interface LinkedRecordsResponse {
  hasOutsideRecords: boolean;
  members: MemberRecord[];
}

export interface ReferralHistories {
  referralHistories: ReferralHistory[];
}

export interface ReferralHistory {
  referralStatus: string;
  referralBadgeStatus: ReferralHistoryStatus;
  referralDate: string;
}

export type ReferralHistoryStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface BeneficiaryListUpdateRequest {
  beneficiaries: BeneficiaryUpdateRequest[];
  contentAccessKey: string;
}

export interface BeneficiaryAddressUpdateRequest {
  city?: string;
  country?: string;
  countryCode?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  line5?: string;
  postCode?: string;
}

export interface BeneficiaryUpdateRequest {
  address: BeneficiaryAddressUpdateRequest;
  id?: number;
  relationship: string;
  forenames: string;
  surname: string;
  charityName: string;
  lumpSumPercentage: number;
  dateOfBirth?: string | null;
  isPensionBeneficiary: boolean;
}

export interface BeneficiaryAddress {
  city: string;
  country: string;
  countryCode: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  postCode: string;
}

export interface Beneficiary {
  address: BeneficiaryAddress;
  id: number;
  relationship: string;
  forenames: string;
  surname: string;
  charityName?: string;
  charityNumber?: number;
  lumpSumPercentage: number;
  dateOfBirth: string;
  isPensionBeneficiary: boolean;
  notes: string;
}

export interface Beneficiaries {
  beneficiaries: Beneficiary[];
}
export interface Dependant {
  address: BeneficiaryAddress;
  id: number;
  relationship: string;
  forenames: string;
  surname: string;
  charityName: string;
  lumpSumPercentage: number;
  dateOfBirth: string;
  isPensionBeneficiary: boolean;
  notes: string;
}

export interface UserBeneficiaries {
  people: UserBeneficiaryPerson[] | null;
  organizations: UserBeneficiaryOrganization[] | null;
}

interface UserBeneficiary {
  address?: BeneficiaryAddress;
  pensionPercentage: number;
  lumpSumPercentage: number;
  nominationDate: string;
  revokedDate: string | null;
  remarks: string;
}

export interface UserBeneficiaryPerson extends UserBeneficiary {
  relationship: string;
  title: string;
  forenames: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
}

export interface UserBeneficiaryOrganization extends UserBeneficiary {
  organizationType: string;
  organizationName: string;
  organizationReference: string;
}

export interface Dependants {
  dependants: Dependant[];
}

export interface RelationshipStatuses {
  statuses: string[];
}

export interface ExpirationDate {
  expirationDate: string;
}

export type BereavementSubmitParams = BereavementFormValues;

export type BereavementSubmitResponse = { caseNumber: string };

export interface BereavementCaptchaVerifyResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export interface TransferFlexibleBenefits {
  nameOfPlan?: string | null;
  typeOfPayment?: string | null;
  dateOfPayment?: string | null;
}

export interface TransferJourneyApplication {
  startDate: string;
  flexibleBenefits?: TransferFlexibleBenefits;
  pensionWiseDate?: string;
  financialAdviseDate?: string;
  transferJourneyContacts?: TransferJourneyContact[];
  questionForms: DisplayableQuestionFormResponse[];
  journeyGenericDataList: JourneyGenericData[];
  totalGuaranteedTransferValue: number;
  totalNonGuaranteedTransferValue: number;
  transferApplicationStatus: string;
  submissionDate: string | null;
  submitByDate?: string | null;
}

export interface TransferJourneyContact
  extends Partial<{
    type: string;
    name: string;
    companyName: string;
    email: string;
    phoneNumber: string;
    phoneCode: string;
    address: {
      line1?: string;
      line2?: string;
      line3?: string;
      line4?: string;
      line5?: string;
      country?: string;
      countryCode?: string;
      postCode?: string;
    };
  }> {}

export type SaveTransferJourneyContactParams = Omit<TransferJourneyContact, 'address'>;

export type SaveTransferJourneyContactAddressParams = TransferJourneyContact['address'] &
  Pick<TransferJourneyContact, 'type'>;

export type UploadedFile = {
  uuid: string;
  filename: string;
  tags: string[] | null;
  documentType?: string;
};

export type FileUploadResponse = { uuid: string };

export type FileUploadParams = {
  file: File;
  journeyType: JourneyTypeSelection;
  tags: string[];
  documentType?: string;
};

export type FileUpdateParams = { fileUuid: string; tags: string[] };

export interface CaseDocumentsList {
  caseNumber: string;
  caseCode: string;
  documents: CaseDocumentsListItem[];
}

export interface CaseDocumentsListItem {
  tag: string;
  imageId: string;
  narrative: string;
  receivedDate: string | null;
  status: 'INC' | 'MIR' | 'AWR' | 'COMP' | 'NA';
  notes: string;
}

export interface CheckboxListParams {
  journeyType: JourneyTypeSelection;
  pageKey: string;
  checkboxesListKey: string;
}

export interface AddCheckboxListParams extends CheckboxListParams {
  checkboxes: Checkbox[];
}

export interface Checkbox {
  key: string;
  answerValue: boolean;
}

export interface CheckboxListResponse {
  checkboxesListKey: string;
  checkboxes: Checkbox[];
}

export interface JourneyGenericData {
  formKey: string;
  genericDataJson: string;
}

export interface GenericAllData extends Record<string, object | null> {
  journey: Partial<{
    expirationDate: string;
    status: string;
    stepsWithCheckboxes: Record<string, Record<string, Record<string, { answerValue: boolean }>>>;
    stepsWithData: Record<string, Record<string, Record<string, object>>>;
    stepsWithQuestions: {};
    type: string;
  }> | null;
}

export interface ChartData {
  chart: Nullable<{
    numberSuffix: string;
    numberPrefix: string;
  }>;
  data: ChartDataItem[] | null;
  datasets: { name: string; data: ChartDataItem[] }[] | null;
}

type ChartDataItem = { label: string; value: string };

export type CountryListResponse = Array<
  Partial<CountryCurrencyItem> & {
    code: string;
    name: string;
  }
>;
export type CountryCurrencyItem = {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencyName: string;
};

export type PhoneCodeListResponse = {
  code: string;
  dial_code: string;
  name: string;
};

export interface DataSource {
  numberOfDataItems?: number;
}
export interface SingleAuthLoginResponse {
  businessGroup: string;
  referenceNumber: string;
  hasMultipleRecords: boolean;
}

export interface CheckOnGrowthResponse {
  personalRateOfReturn: number;
  changeInValue: number;
}

type contributionsItem = {
  label: string;
  value: number;
};

export interface LatestContributionsResponse {
  totalValue: number;
  currency: string;
  paymentDate: string;
  contributions: contributionsItem[];
}

export interface AlertsResponse {
  alerts: Alert[];
}

export interface Alert {
  alertID: number;
  messageText: string;
  effectiveDate: string;
}

export interface SsoOutboundLookupCodeResponse {
  lookupCode: string;
}

export interface SingleAuthLoginResponse {
  businessGroup: string;
  referenceNumber: string;
  hasMultipleRecords: boolean;
}

export interface VerifyIdentityResponse {
  identityVerificationStatus: string;
  documentValidationStatus: string;
}

export interface IntentContext {
  intent: string;
  ttl: string;
  sessionId?: string;
}
