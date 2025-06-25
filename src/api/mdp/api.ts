import { AxiosInstance } from 'axios';
import { saveAs } from 'file-saver';
import qs from 'query-string';
import { normalizeDate } from '../../business/dates';
import { fileNameFromResponse } from '../../business/files';
import { JourneyTypeSelection } from '../content/types/page';
import { CmsTokens } from '../types';
import {
  AccessKey,
  AddCheckboxListParams,
  Address,
  AddressSummary,
  AgeLines,
  AlertsResponse,
  AnalyticsParams,
  Beneficiaries,
  BeneficiaryListUpdateRequest,
  BereavementCaptchaVerifyResponse,
  BereavementSubmitParams,
  BereavementSubmitResponse,
  CaseDocumentsList,
  ChartData,
  CheckboxListParams,
  CheckboxListResponse,
  ContactPreference,
  CountryListResponse,
  Dependants,
  DisplayableQuestionFormResponse,
  DocumentRequest,
  DocumentTypes,
  EmailToken,
  EmailTokenParams,
  EngagementEvents,
  ExpirationDate,
  FileUpdateParams,
  FileUploadParams,
  FileUploadResponse,
  FinancialAdviseResponse,
  GbgAccessToken,
  GenericAllData,
  IntentContext,
  JourneyIntegrityResponse,
  JourneyStepParams,
  LifetimeAllowanceResponse,
  LinkedMembersResponse,
  LinkedRecordsResponse,
  MdpUserParams,
  MemberQuote,
  Membership,
  NavigationKeys,
  NavigationPreviousKey,
  OptOutPensionWiseResponse,
  PaginatedResponse,
  PartialTransferDownloadPdfParams,
  PensionTranches,
  PensionWiseResponse,
  PhoneCodeListResponse,
  PhoneToken,
  PhoneTokenParams,
  QuestionFormResponse,
  ReferralHistories,
  RelationshipStatuses,
  RetirementCalculation,
  RetirementDCContributions,
  RetirementDate,
  RetirementJourneyEnd,
  RetirementJourneyStart,
  RetirementJourneySubmitData,
  RetirementOptions,
  RetirementQuotesV3Response,
  RetirementTimeline,
  SaveTransferJourneyContactAddressParams,
  SaveTransferJourneyContactParams,
  SearchAddressParams,
  SelectedQuoteResponse,
  SingleAuthLoginResponse,
  SsoOutboundLookupCodeResponse,
  StartDbCoreJourneyParams,
  StartDcJourneyParams,
  StartGenericJourneyParams,
  StartTransferJourneyParams,
  SubmitBereavementQuestionParams,
  SubmitContactPreferenceParams,
  SubmitEmailParams,
  SubmitFinancialAdviseParams,
  SubmitGenericQuestionStepParams,
  SubmitLTAParams,
  SubmitOptOutPensionWiseParams,
  SubmitPensionWiseParams,
  SubmitPhoneParams,
  SubmitQuestionStepParams,
  SubmitRetirementQuestionStepParams,
  SubmitStepParams,
  SwitchStepParams,
  TimeToRetirement,
  TransferApplicationStatus,
  TransferApplicationStatusResponse,
  TransferFlexibleBenefits,
  TransferJourneyApplication,
  TransferJourneySubmitData,
  TransferOptions,
  TransferValues,
  TransferValuesParams,
  UploadedFile,
  UserAddress,
  UserBankDetails,
  UserBeneficiaries,
  UserDocument,
  UserEmail,
  UserPersonalDetails,
  UserPhone,
  UserRetirementApplicationStatus,
  UserValidatedDetails,
  VerificationEmailTokenParams,
  VerifyIdentityResponse,
} from './types';

export class MdpApi {
  constructor(private readonly axios: AxiosInstance, private readonly ssrAxios: AxiosInstance) {}

  private postWithNonce<T>(url: string, params: object, nonce?: string) {
    const headers = nonce ? { nonce: nonce } : {};
    return this.axios.post<T>(url, params, { headers });
  }

  public getByUrl<T = unknown>(url: string) {
    return this.axios.get<T>(url);
  }

  public postByUrl<T = unknown>(url: string, body: object) {
    return this.axios.post<T>(url, body);
  }

  public chartData(url: string, params: Record<string, any> = {}) {
    return this.axios.get<ChartData>(`${url}?${qs.stringify({ params })}`);
  }

  public dataSummary<T = Record<string, object>>(url: string, params: Record<string, any> = {}) {
    return this.axios.get<T>(`${url}?${qs.stringify(params)}`);
  }

  public initializeJourneys() {
    return this.axios.post(`/mdp-api/initialize`);
  }

  public userTimeToRetirement() {
    return this.axios.get<TimeToRetirement>(`/mdp-api/api/members/current/time-to-retirement`);
  }

  public userPersonalDetails() {
    return this.axios.get<UserPersonalDetails>(`/mdp-api/api/members/personal-details`);
  }

  public userBankDetails() {
    return this.axios.get<UserBankDetails>(`/mdp-api/api/v2/bank-accounts/current`);
  }

  public userAddress() {
    return this.axios.get<UserAddress>(`/mdp-api/api/members/current/contacts/address`);
  }

  public updateUserAddress(params: UserAddress) {
    return this.axios.put<UserAddress>(`/mdp-api/api/members/current/contacts/address`, params);
  }

  public engagementEvents() {
    return this.axios.get<EngagementEvents>(`/mdp-api/api/members/engagement-events`);
  }

  public userEmail() {
    return this.axios.get<UserEmail>(`/mdp-api/api/members/current/contacts/email`);
  }

  public userBeneficiaries() {
    return this.axios.get<UserBeneficiaries>(
      `/mdp-api/api/v2/members/current/beneficiaries?${qs.stringify(
        { refreshCache: true },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public bereavementCountryList() {
    return this.ssrAxios.get<CountryListResponse>(`/api/bereavement/address/countries`);
  }

  public bereavementPhoneCodeList() {
    return this.ssrAxios.get<PhoneCodeListResponse[]>(`/api/bereavement/contact/countries`);
  }

  public countryList() {
    return this.axios.get<CountryListResponse>(`/mdp-api/api/v2/bank-accounts/countries-and-currencies`);
  }

  public phoneCodeList() {
    return this.axios.get<PhoneCodeListResponse[]>(`/mdp-api/api/contact/countries`);
  }

  public userRetirementApplicationStatus(params: MdpUserParams) {
    return this.axios.get<UserRetirementApplicationStatus>(
      `/mdp-api/api/members/current/retirement-application-status-v2?${qs.stringify(params, {
        encode: false,
        skipNull: true,
      })}`,
    );
  }

  public checkDBUserRetirementApplicationStatus(params: MdpUserParams, date: Date) {
    return this.axios.get<UserRetirementApplicationStatus>(
      `/mdp-api/api/retirement/db-core/application-status?${qs.stringify(
        { ...params, selectedDbCoreRetirementDate: date ? normalizeDate(date).toISOString() : undefined },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public emailToken(params: EmailTokenParams) {
    return this.axios.post<EmailToken>(`/mdp-api/api/v2/members/contacts/confirmation/email/send`, params);
  }

  public submitEmail(params: SubmitEmailParams, nonce?: string) {
    return this.postWithNonce(`/mdp-api/api/members/contacts/confirmation/email/confirm`, params, nonce);
  }

  public userPhone() {
    return this.axios.get<UserPhone>(`/mdp-api/api/members/current/contacts/mobile-phone`);
  }

  public phoneToken(params: PhoneTokenParams) {
    return this.axios.post<PhoneToken>(`/mdp-api/api/v2/members/contacts/confirmation/mobile-phone/send`, params);
  }

  public submitPhone(params: SubmitPhoneParams, nonce?: string) {
    return this.postWithNonce(`/mdp-api/api/members/contacts/confirmation/mobile-phone/confirm`, params, nonce);
  }

  public submitUKBankDetails(params: UserBankDetails) {
    return this.axios.post<UserValidatedDetails>(`/mdp-api/api/v2/bank-accounts/submit-uk-bank-account`, params);
  }

  public submitNonUKBankDetails(params: UserBankDetails) {
    return this.axios.post<UserValidatedDetails>(`/mdp-api/api/v2/bank-accounts/submit-iban-bank-account`, params);
  }

  public validateUKBankDetails(params: UserBankDetails) {
    return this.axios.post<UserValidatedDetails>(`/mdp-api/api/v2/bank-accounts/validate-uk-bank-account`, params);
  }

  public validateNonUKBankDetails(params: UserBankDetails) {
    return this.axios.post<UserValidatedDetails>(`/mdp-api/api/v2/bank-accounts/validate-iban-bank-account`, params);
  }

  public retirementCalculations() {
    return this.axios.get<RetirementCalculation>(`/mdp-api/api/retirement/calculation`);
  }

  public retirementOptions(age: number) {
    return this.axios.get<RetirementOptions>(
      `/mdp-api/api/retirement/options?${qs.stringify({ age }, { encode: false })}`,
    );
  }

  public retirementDcSpendingStrategies(schemeCode: string, category: string, contType?: string) {
    return this.axios.get<RetirementDCContributions>(`/mdp-api/api/retirement/dc/spending-strategies`, {
      params: { schemeCode, contType, category },
    });
  }

  public retirementDcSpendingFunds(schemeCode: string, category: string, contType?: string) {
    return this.axios.get<RetirementDCContributions>(`/mdp-api/api/retirement/dc/spending-funds`, {
      params: { schemeCode, contType, category },
    });
  }

  public retirementDate(eventType?: string) {
    const query = eventType ? `?${qs.stringify({ eventType })}` : '';
    return this.axios.get<RetirementDate>(`/mdp-api/api/v2/retirement/retirement-date${query}`);
  }

  public retirementJourneySubmit(data: RetirementJourneySubmitData) {
    return this.axios.put(`/mdp-api/api/v2/retirement-journey/submit`, data);
  }

  public async retirementJourneyDocument() {
    const response = await this.axios.get<Blob>(`/mdp-api/api/retirement-journey/download/summary-pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    saveAs(blob, 'retirement-journey-summary.pdf');
  }

  public async retirementJourneyOptionsDocument(contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v3/retirement/quotes/download/options-pdf?${qs.stringify({ contentAccessKey })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, 'retirement-journey-options.pdf');
  }

  public retirementJourneyPostDocumentsSubmission() {
    return this.axios.post(`/mdp-api/api/retirement-journey/documents/post-submission`);
  }

  public async partialTransferDocument(params: PartialTransferDownloadPdfParams) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/transfer-journeys/download/partial-transfer-pdf?${qs.stringify(params, { encode: false })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, 'partial-transfer-calculations.pdf');
  }

  public async transferDocument() {
    const response = await this.axios.get<Blob>(`/mdp-api/api/transfer-journeys/download/transfer-pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    saveAs(blob, 'transfer-journey.pdf');
  }

  public async retirementApplicationDownload(contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v2/retirement-journey/download/pdf?${qs.stringify({ contentAccessKey })}`,
      { responseType: 'blob' },
    );

    saveAs(new Blob([response.data]), 'retirement-application.pdf');
  }

  public async retirementOptionSummaryDownload(contentAccessKey: string, summaryKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v3/retirement/quotes/download/summary-pdf?${qs.stringify({ contentAccessKey, summaryKey })}`,
      { responseType: 'blob' },
    );

    saveAs(new Blob([response.data]), 'retirement-application.pdf');
  }

  public userDocumentsTypes() {
    return this.axios.get<DocumentTypes>(`/mdp-api/api/members/current/documents/types`);
  }

  public userDocuments(data: DocumentRequest) {
    return this.axios.get<PaginatedResponse<UserDocument>>(
      `/mdp-api/api/members/current/documents?${qs.stringify(data, { encode: false })}`,
    );
  }

  public async userDocumentsDownload(data: { ids: string[] }) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/members/current/documents/download?${qs.stringify(data, { encode: false })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data], { type: 'application/zip' });
    saveAs(blob, 'documents.zip');
  }

  public async userDocument(id: string) {
    return this.axios.get<Blob>(`/mdp-api/api/members/current/documents/${id}/download`, {
      responseType: 'blob',
    });
  }

  public async downloadUserDocument(id: string) {
    const response = await this.axios.get<Blob>(`/mdp-api/api/members/current/documents/${id}/download`, {
      responseType: 'blob',
    });

    const file = new File([response.data], 'user_document', { type: 'application/pdf' });

    return {
      file,
      url: URL.createObjectURL(file),
    };
  }

  public async userDocumentDownload(id: string) {
    const response = await this.axios.get<Blob>(`/mdp-api/api/members/current/documents/${id}/download`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    saveAs(blob, `document-${id}.pdf`);
  }

  public retirementJourneyStartV2(params: JourneyStepParams) {
    return this.axios.post<RetirementJourneyStart>(`/mdp-api/api/v3/retirement-journey/start`, params);
  }

  public retirementJourneyEnd() {
    return this.axios.post<RetirementJourneyEnd>(`/mdp-api/api/retirement-journey/complete`);
  }

  public retirementJourneyDelete() {
    return this.axios.delete(`/mdp-api/api/retirement-journey`);
  }

  public retirementTimeline() {
    return this.axios.get<RetirementTimeline>(`/mdp-api/api/retirement/timeline`);
  }

  public retirementQuotesV3(retirementDate?: Date, bypassCache?: boolean) {
    return this.axios.get<RetirementQuotesV3Response>(
      `/mdp-api/api/v3/retirement/quotes?${qs.stringify(
        {
          selectedRetirementDate: retirementDate ? normalizeDate(retirementDate).toISOString() : undefined,
          bypassCache,
        },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public retirementRecalculateLumpSum(requestedLumpSum: number) {
    return this.axios.get<RetirementQuotesV3Response>(
      `/mdp-api/api/v3/retirement/quotes/recalculate-lumpsum?${qs.stringify(
        { requestedLumpSum },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public retirementSubmitRecalculatedLumpSum(requestedLumpSum: number) {
    return this.axios.post<RetirementQuotesV3Response>(
      `/mdp-api/api/v3/retirement/quotes/submit-recalculated-lumpsum?${qs.stringify(
        { requestedLumpSum },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public clearLumpSum() {
    return this.axios.put('/mdp-api/api/v3/retirement/quotes/clear-lumpsum');
  }

  public transferOptions() {
    return this.axios.get<TransferOptions>(`/mdp-api/api/retirement/transfer-quote`);
  }

  public transferJourneyStart(params: StartTransferJourneyParams) {
    return this.axios.post<RetirementJourneyStart>(`/mdp-api/api/transfer-journeys/start`, params);
  }

  public transferApplicationStatus() {
    return this.axios.get<TransferApplicationStatusResponse>(
      `/mdp-api/api/transfer-journeys/transfer-application-status`,
    );
  }

  public sendIfaEmails(params: AccessKey) {
    return this.axios.post(`/mdp-api/api/transfer-journeys/emails/ifa/send`, params);
  }

  public pensionTranches(requestedTransferValue: number) {
    return this.axios.get<PensionTranches>(
      `/mdp-api/api/v2/transfer-journeys/pension-tranches?${qs.stringify(
        { requestedTransferValue },
        { encode: false, skipNull: true },
      )}`,
    );
  }

  public transferValues(params: TransferValuesParams) {
    return this.axios.get<TransferValues>(
      `/mdp-api/api/v2/transfer-journeys/transfer-values?${qs.stringify(params, { encode: false, skipNull: true })}`,
    );
  }

  public journeyPreviousKey(currentPage: string) {
    return this.axios.get<NavigationPreviousKey>(`/mdp-api/api/retirement-journey/previous-step/${currentPage}`);
  }

  public submitJourneyStep(params: SubmitStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/retirement-journey/submit-step`, params);
  }

  public updateSwitchStep(params: SwitchStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/retirement-journey/switch-step`, params);
  }

  public submitJourneyQuestionStep(params: SubmitRetirementQuestionStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/retirement-journey/submit-question-step`, params);
  }

  public buttonCustomRequest<T = Record<string, object>>(url: string, contentAccessKey: string) {
    return this.axios.post<T>(url, { contentAccessKey });
  }

  public questionsStepData(currentPage: string) {
    return this.axios.get<QuestionFormResponse>(`/mdp-api/api/retirement-journey/question-form/${currentPage}`);
  }

  public journeyQuestionAnswers(questionKeys?: string[]) {
    return this.axios.get<QuestionFormResponse[]>(
      `/mdp-api/api/retirement-journey/answers?${qs.stringify({ questionKeys }, { encode: false, skipNull: true })}`,
    );
  }

  public tokenInformation() {
    return this.axios.get<CmsTokens>('/mdp-api/api/retirement/cms-token-information', {
      params: { timestamp: Date.now() },
    });
  }

  public submitLifetimeAllowance(params: SubmitLTAParams) {
    return this.axios.post(`/mdp-api/api/retirement-journey/submit-lifetime-allowance`, params);
  }

  public submitPensionWise(params: SubmitPensionWiseParams) {
    return this.axios.post(`/mdp-api/api/retirement-journey/submit-pension-wise`, params);
  }

  public submitFinancialAdvise(params: SubmitFinancialAdviseParams) {
    return this.axios.post(`/mdp-api/api/retirement-journey/submit-financial-advise`, params);
  }

  public financialAdvice() {
    return this.axios.get<FinancialAdviseResponse>(`/mdp-api/api/retirement-journey/financial-advise`);
  }

  public pensionWise() {
    return this.axios.get<PensionWiseResponse>(`/mdp-api/api/retirement-journey/pension-wise`);
  }

  public lifetimeAllowance() {
    return this.axios.get<LifetimeAllowanceResponse>(`/mdp-api/api/retirement-journey/lifetime-allowance`);
  }

  public submitPensionWiseOptOut(params: SubmitOptOutPensionWiseParams) {
    return this.axios.post(`/mdp-api/api/retirement-journey/submit-opt-out-pension-wise`, params);
  }

  public pensionWiseOptOut() {
    return this.axios.get<OptOutPensionWiseResponse>(`/mdp-api/api/retirement-journey/pension-wise-opt-out`);
  }

  public lineAges() {
    return this.axios.get<AgeLines>(`/mdp-api/api/members/current/age-lines`);
  }

  public retirementApplication(contentAccessKey: string) {
    return this.axios.get<MemberQuote>(
      `/mdp-api/api/retirement-journey/retirement-application?${qs.stringify({ contentAccessKey })}`,
    );
  }

  public journeyIntegrityResponse(pageKey: string) {
    return this.axios.get<JourneyIntegrityResponse>(`/mdp-api/api/retirement-journey/integrity/${pageKey}`);
  }

  public membershipData() {
    return this.axios.get<Membership>(`/mdp-api/api/members/current/membership-summary`);
  }

  public saveRetirementGBGScanId(journeyId: string) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/retirement-journey/gbg/${journeyId}`);
  }
  public saveTransferGBGScanId(journeyId: string) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/v2/transfer-journeys/gbg/${journeyId}`);
  }

  public createGbgAccessToken() {
    return this.axios.post<GbgAccessToken>(`/mdp-api/api/identity/verification/gbg/token`);
  }

  public memberContactPreference() {
    return this.axios.get<ContactPreference>(`/mdp-api/api/members/current/contacts/notifications-settings`);
  }

  public submitMemberContactPreference(params: SubmitContactPreferenceParams) {
    return this.axios.put<ContactPreference>(`/mdp-api/api/members/current/contacts/notifications-settings`, params);
  }

  public analyticsParams(contentAccessKey: string) {
    return this.axios.get<AnalyticsParams>(`mdp-api/api/members/analytics?${qs.stringify({ contentAccessKey })}`);
  }

  public addressSummary(params: SearchAddressParams) {
    return this.axios.get<AddressSummary[]>(
      `/mdp-api/api/addresses/search/?${qs.stringify(params, {
        encode: false,
        skipNull: true,
      })}`,
    );
  }

  public addressDetails(addressId: string) {
    return this.axios.get<Address[]>(`/mdp-api/api/addresses/${addressId}`);
  }

  public refreshAccessKey(
    tenantUrl: string,
    newlyRetiredRangeInMonth: number,
    preRetirementAgePeriodInYears: number,
    basicMode?: boolean,
  ) {
    return this.axios.get<AccessKey>(
      `/mdp-api/api/content/recalculate-access-key?${qs.stringify({
        tenantUrl,
        newlyRetiredRangeInMonth,
        preRetirementAgePeriodInYears,
        timestamp: Date.now(),
        ...(basicMode ? { basicMode: 'true' } : {}),
      })}`,
    );
  }

  public accessKey(
    tenantUrl: string,
    newlyRetiredRangeInMonth: number,
    preRetirementAgePeriodInYears: number,
    basicMode?: boolean,
  ) {
    return this.axios.get<AccessKey>(
      `/mdp-api/api/content/access-key?${qs.stringify({
        tenantUrl,
        newlyRetiredRangeInMonth,
        preRetirementAgePeriodInYears,
        timestamp: Date.now(),
        ...(basicMode ? { basicMode: 'true' } : {}),
      })}`,
    );
  }

  public linkedMembers() {
    return this.axios.get<LinkedMembersResponse>(`/mdp-api/api/members/linked-members`);
  }

  public referralHistories() {
    return this.axios.get<ReferralHistories>(`/mdp-api/api/members/current/referral-history`);
  }

  public beneficiaries() {
    return this.axios.get<Beneficiaries>('/mdp-api/api/members/current/beneficiaries');
  }

  public async downloadBeneficiaries(params: AccessKey) {
    const response = await this.axios.get<Blob>(`/mdp-api/api/members/current/beneficiaries/download`, {
      responseType: 'blob',
      params,
    });

    const blob = new Blob([response.data]);
    saveAs(blob, 'beneficiaries-summary.pdf');
  }

  public dependants() {
    return this.axios.get<Dependants>('/mdp-api/api/members/current/dependants');
  }

  public async updateBeneficiaryList(params: BeneficiaryListUpdateRequest) {
    const result = await this.axios.put('/mdp-api/api/members/current/beneficiaries', params);
    await this.axios.get<Beneficiaries>('/mdp-api/api/members/current/beneficiaries');
    return result;
  }

  public relationshipStatuses() {
    return this.axios.get<RelationshipStatuses>('/mdp-api/api/tenants/current/relationship-statuses');
  }

  public caseDocuments(caseCode: string) {
    return this.axios.get<CaseDocumentsList>('mdp-api/api/case/documents/list', { params: { caseCode } });
  }

  // Quote Selection

  public quoteSelectionJourneySubmitStep(params: JourneyStepParams) {
    return this.axios.post('/mdp-api/api/quote-selection-journey/submit-selection-step', params);
  }

  public quoteSelectionJourneyPreviousStep(currentPageKey: string) {
    return this.axios.get<NavigationPreviousKey>(
      `/mdp-api/api/quote-selection-journey/previous-step/${currentPageKey}`,
    );
  }

  public quoteSelectionJourneyQuestionForm(currentPageKey: string) {
    return this.axios.get<SelectedQuoteResponse>(
      `/mdp-api/api/quote-selection-journey/question-form/${currentPageKey}`,
    );
  }

  public quoteSelectionJourneySelections() {
    return this.axios.get<SelectedQuoteResponse>(`/mdp-api/api/quote-selection-journey/selections`);
  }

  public quoteSelectionJourneyIntegrity(currentPageKey: string) {
    return this.axios.get<JourneyIntegrityResponse>(`/mdp-api/api/quote-selection-journey/integrity/${currentPageKey}`);
  }

  public async retirementQuoteDocument() {
    const response = await this.axios.get<Blob>(`/mdp-api/api/retirement/quote`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    saveAs(blob, 'retirement-quote.pdf');
  }

  // Bereavement

  public bereavementJourneyStart(params: SubmitStepParams) {
    return this.ssrAxios.post('/api/bereavement/journey-start', params);
  }

  public bereavementJourneyCaptchaVerify(token: string) {
    return this.ssrAxios.post<BereavementCaptchaVerifyResponse>('/api/bereavement/journey-captcha-verify', {
      response: token,
    });
  }

  public bereavementJourneySubmitStep(params: SubmitStepParams) {
    return this.ssrAxios.post('/api/bereavement/journey-submit-step', params);
  }

  public bereavementJourneySubmitQuestionStep(params: SubmitBereavementQuestionParams) {
    return this.ssrAxios.post(`/api/bereavement/journey-submit-question-step`, params);
  }

  public bereavementJourneyQuestionForm(currentPageKey: string) {
    return this.ssrAxios.get<DisplayableQuestionFormResponse>(
      `/api/bereavement/journey-question-form/${currentPageKey}`,
    );
  }

  public bereavementJourneyPreviousStep(currentPageKey: string) {
    return this.ssrAxios.get<NavigationPreviousKey>(`/api/bereavement/journey-previous-step/${currentPageKey}`);
  }

  public bereavementJourneyIntegrity(currentPageKey: string) {
    return this.ssrAxios.get<JourneyIntegrityResponse>(`/api/bereavement/journey-integrity/${currentPageKey}`);
  }

  public bereavementJourneyEmailToken(params: VerificationEmailTokenParams) {
    return this.ssrAxios.post<EmailToken>('/api/bereavement/journey-email-token', params);
  }

  public bereavementJourneySubmitEmail(params: SubmitEmailParams) {
    return this.ssrAxios.post('/api/bereavement/journey-submit-email', params);
  }

  public bereavementJourneyKeepAlive() {
    return this.ssrAxios.post<ExpirationDate>('/api/bereavement/keep-alive');
  }

  public bereavementAddressDetails(addressId: string) {
    return this.ssrAxios.get<Address[]>(`/api/bereavement/address/${addressId}`);
  }

  public bereavementAddressSummary(params: SearchAddressParams) {
    return this.ssrAxios.get<AddressSummary[]>(
      `/api/bereavement/address/search?${qs.stringify(params, {
        encode: false,
        skipNull: true,
      })}`,
    );
  }

  public bereavementSubmit(tenantUrl: string, params: BereavementSubmitParams) {
    return this.ssrAxios.post<BereavementSubmitResponse>(`/api/bereavement/journey-submit`, { tenantUrl, ...params });
  }

  public bereavementEnd() {
    return this.ssrAxios.post(`/api/bereavement/journey-end`);
  }

  public bereavementUploadDocument(params: FileUploadParams) {
    const form = new FormData();
    form.append('file', params.file);
    form.append('journeyType', 'bereavement');
    form.append('tags', JSON.stringify(params.tags));
    return this.ssrAxios.post<FileUploadResponse>(`/api/bereavement/documents/create`, form);
  }

  public bereavementUpdateDocumentTags(params: FileUpdateParams) {
    const form = new FormData();
    form.append('fileUuid', params.fileUuid);
    form.append('tags', JSON.stringify(params.tags));
    return this.ssrAxios.post<FileUploadResponse>(`/api/bereavement/documents/update`, form);
  }

  public bereavementDocuments() {
    return this.ssrAxios.get<UploadedFile[]>(`/api/bereavement/documents/list`, {
      params: { journeyType: 'bereavement' },
    });
  }

  public bereavementDeleteDocument(uuid: string) {
    return this.ssrAxios.put(`/api/bereavement/documents/delete`, { uuid });
  }

  public bereavementDeleteAllDocuments() {
    return this.ssrAxios.put(`/api/bereavement/documents/delete-all`, { journeyType: 'bereavement' });
  }

  public bereavementPostDocumentsSubmission() {
    return this.ssrAxios.post(`/api/bereavement/documents/post-submission`, { journeyType: 'bereavement' });
  }

  // Transfer

  public transferV2JourneyStart(params: StartTransferJourneyParams) {
    return this.axios.post<RetirementJourneyStart>(`/mdp-api/api/v2/transfer-journeys/start`, params);
  }

  public transferJourneyStatus() {
    return this.axios.get<TransferApplicationStatusResponse>(
      `/mdp-api/api/v2/transfer-journeys/transfer-application-status`,
    );
  }

  public transferJourneyDelete() {
    return this.axios.put(`/mdp-api/api/v2/transfer-journeys/delete-application`);
  }

  public transferJourneyChangeStatus(status: TransferApplicationStatus) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/transfer-application-status`, { status });
  }

  public transferJourneySubmit(params: TransferJourneySubmitData) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/submit`, params);
  }

  public transferJourneySubmitV3(params: TransferJourneySubmitData) {
    return this.axios.post(`/mdp-api/api/v3/transfer-journeys/submit`, params);
  }

  public transferJourneyContactSave(params: SaveTransferJourneyContactParams) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/contact`, params);
  }

  public transferJourneyContactAddressSave(params: SaveTransferJourneyContactAddressParams) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/contact/address`, params);
  }

  public transferJourneyIntegrity(pageKey: string) {
    return this.axios.get<JourneyIntegrityResponse>(`/mdp-api/api/v2/transfer-journeys/integrity/${pageKey}`);
  }

  public transferJourneyQuestionForm(currentPage: string) {
    return this.axios.get<DisplayableQuestionFormResponse>(
      `/mdp-api/api/v2/transfer-journeys/question-form/${currentPage}`,
    );
  }

  public transferJourneyRemoveStepFrom(pageKey: string) {
    return this.axios.post<NavigationPreviousKey>(`/mdp-api/api/v2/transfer-journeys/remove-steps-from/${pageKey}`);
  }

  public transferJourneyPreviousStep(currentPage: string) {
    return this.axios.get<NavigationPreviousKey>(`/mdp-api/api/v2/transfer-journeys/previous-step/${currentPage}`);
  }

  public transferJourneySubmitStep(params: SubmitStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/v2/transfer-journeys/submit-step`, params);
  }

  public transferJourneySubmitQuestionStep(params: SubmitQuestionStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/v2/transfer-journeys/submit-question-step`, params);
  }

  public transferJourneyTransferApplication() {
    return this.axios.get<TransferJourneyApplication>(`/mdp-api/api/v2/transfer-journeys/transfer-application`);
  }

  public async transferDocumentV2(contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v2/transfer-journeys/download/pdf?${qs.stringify({ contentAccessKey })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, 'TransferApplicationSummary.pdf');
  }

  public async transferNewDocumentV2(contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v2/transfer-journeys/download/newPdf?${qs.stringify({ contentAccessKey })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, 'TransferApplicationSummary.pdf');
  }

  public async guaranteedTransferQuoteDocument(contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/v2/transfer-journeys/download-guaranteed-transfer?${qs.stringify({ contentAccessKey })}`,
      {
        responseType: 'blob',
      },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, 'guaranteed-transfer-quote.pdf');
  }

  public transferFlexibleBenefitsSave(params: TransferFlexibleBenefits) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/flexible-benefits`, params);
  }

  public transferFlexibleBenefits() {
    return this.axios.get<TransferFlexibleBenefits>(`/mdp-api/api/v2/transfer-journeys/flexible-benefits`);
  }

  public transferPensionWiseSubmit(params: SubmitPensionWiseParams) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/submit-pension-wise`, params);
  }

  public transferPensionWise() {
    return this.axios.get<PensionWiseResponse>(`/mdp-api/api/v2/transfer-journeys/pension-wise`);
  }

  public transferFinancialAdviceSubmit(params: SubmitFinancialAdviseParams) {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/submit-financial-advise`, params);
  }

  public transferFinancialAdvice() {
    return this.axios.get<FinancialAdviseResponse>(`/mdp-api/api/v2/transfer-journeys/financial-advise`);
  }

  // Journey Documents

  public submitTransferJourneyDocuments() {
    return this.axios.post(`/mdp-api/api/v2/transfer-journeys/documents/post-submission`);
  }

  public uploadDocument(params: FileUploadParams) {
    const form = new FormData();
    form.append('file', params.file);
    form.append('journeyType', params.journeyType);
    params.tags.forEach(tag => form.append('tags[]', tag));
    if (params.documentType) {
      form.append('documentType', params.documentType);
    }
    return this.axios.post<FileUploadResponse>(`/mdp-api/api/journeys/documents/create`, form);
  }

  public updateDocumentTags(params: FileUpdateParams) {
    const form = new FormData();
    form.append('fileUuid', params.fileUuid);
    params.tags.forEach(tag => form.append('tags[]', tag));
    return this.axios.post<FileUploadResponse>(`/mdp-api/api/journeys/documents/tags/update`, form);
  }

  public documents(journeyType: JourneyTypeSelection) {
    return this.axios.get<UploadedFile[]>(`/mdp-api/api/journeys/documents/list`, { params: { journeyType } });
  }

  public deleteDocument(uuid: string) {
    return this.axios.put(`/mdp-api/api/journeys/documents/delete`, { uuid });
  }

  public deleteAllDocuments(journeyType: JourneyTypeSelection) {
    return this.axios.put(`/mdp-api/api/journeys/documents/delete/all`, { journeyType });
  }

  public postDocumentsSubmission(journeyType: JourneyTypeSelection) {
    return this.axios.post(`/mdp-api/api/journeys/documents/post-submission`, { journeyType });
  }

  public checkboxList({ journeyType, pageKey, checkboxesListKey }: CheckboxListParams) {
    return this.axios.get<CheckboxListResponse>(
      `/mdp-api/api/journeys/${journeyType}/page/${pageKey}/checkboxesLists/${checkboxesListKey}`,
    );
  }

  public addCheckboxList({ journeyType, pageKey, checkboxes, checkboxesListKey }: AddCheckboxListParams) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/page/${pageKey}/checkboxesLists`, {
      checkboxes,
      checkboxesListKey,
    });
  }

  // Generic Journeys

  public genericJourneyAllData<T = GenericAllData>(journeyType: JourneyTypeSelection) {
    return this.axios.get<T>(`/mdp-api/api/journeys/${journeyType}/data`);
  }

  public genericJourneyStepData<T>(journeyType: JourneyTypeSelection, pageKey: string, formKey: string) {
    return this.axios.get<{ genericDataJson: T }>(
      `/mdp-api/api/journeys/${journeyType}/page/${pageKey}/stepData/${formKey}`,
    );
  }

  public genericJourneySubmitStepData<T>(journeyType: JourneyTypeSelection, pageKey: string, formKey: string, data: T) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/page/${pageKey}/stepData/${formKey}`, {
      genericDataJson: JSON.stringify(data),
    });
  }

  public genericJourneyStart(journeyType: JourneyTypeSelection, params: StartGenericJourneyParams) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/start`, params);
  }

  public genericJourneySubmitStep(journeyType: JourneyTypeSelection, params: SubmitStepParams) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/submit-step`, params);
  }

  public genericJourneySubmit(journeyType: JourneyTypeSelection, contentAccessKey: string) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/submit`, { contentAccessKey });
  }

  public genericJourneyPreviousStep(journeyType: JourneyTypeSelection, currentPageKey: string) {
    return this.axios.get<NavigationPreviousKey>(`/mdp-api/api/journeys/${journeyType}/${currentPageKey}`);
  }

  public genericJourneyIntegrity(journeyType: JourneyTypeSelection, currentPageKey: string) {
    return this.axios.get<JourneyIntegrityResponse>(`/mdp-api/api/journeys/${journeyType}/integrity/${currentPageKey}`);
  }

  public genericJourneyDelete(journeyType: string) {
    return this.axios.delete(`/mdp-api/api/journeys/${journeyType}/delete`);
  }

  public genericJourneySubmitCase(caseType: string, accessKey: string) {
    return this.axios.post(`/mdp-api/api/journeys/submit-case`, { caseType, accessKey });
  }

  public genericJourneyQuestionForm(journeyType: string, currentPage: string) {
    return this.axios.get<DisplayableQuestionFormResponse>(
      `/mdp-api/api/journeys/${journeyType}/question-form/${currentPage}`,
    );
  }

  public genericJourneySubmitQuestionStep(journeyType: string, params: SubmitGenericQuestionStepParams) {
    return this.axios.post<NavigationKeys>(`/mdp-api/api/journeys/${journeyType}/submit-question-step`, params);
  }

  public genericDcJourneyStart(journeyType: string, params: StartDcJourneyParams) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/start-dc-journey`, params);
  }

  public async genericJourneyDownloadTemplate(journeyType: string, templateName: string, contentAccessKey: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/journeys/${journeyType}/pdf/download?${qs.stringify({ templateName, contentAccessKey })}`,
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, fileNameFromResponse(response));
  }

  public dBCoreJourneyStart(journeyType: string, params: StartDbCoreJourneyParams) {
    return this.axios.post(`/mdp-api/api/journeys/${journeyType}/start-db-core-journey`, params);
  }

  public async singleAuthLogin() {
    return this.axios.get<SingleAuthLoginResponse>(`/mdp-api/api/login`);
  }

  public async singleAuthRegister(tenantUrl: string) {
    return this.axios.post<void>(`/mdp-api/api/registration?${qs.stringify({ tenantUrl })}`);
  }

  public async linkedRecords() {
    return this.axios.get<LinkedRecordsResponse>(`/mdp-api/api/linked-records`);
  }

  public async alerts() {
    return this.axios.get<AlertsResponse>(`/mdp-api/api/members/alerts`);
  }

  public async outboundSsoLookupCode(recordNumber: number, hasMultipleRecords: boolean) {
    return this.axios.get<SsoOutboundLookupCodeResponse>('/mdp-api/api/sso/outbound', {
      params: { recordNumber, hasMultipleRecords },
    });
  }

  public verifyIdentity(journeyType: JourneyTypeSelection) {
    return this.axios.post<VerifyIdentityResponse>(`/mdp-api/api/identity/verification/${journeyType}/verifyIdentity`);
  }

  public async downloadProtectedQuote(id: string) {
    const response = await this.axios.get<Blob>(
      `/mdp-api/api/members/current/documents/${id}/download/protected-quote`,
      {
        responseType: 'blob',
      },
    );

    const blob = new Blob([response.data]);
    saveAs(blob, `protected-quote-document.pdf`);
  }

  public investmentAnnuityQuote() {
    return this.axios.post(`/mdp-api/api/investment/annuity/quote`);
  }

  public getIntentContext() {
    return this.axios.get<IntentContext>(`/mdp-api/api/telephone-note/intent-context`);
  }
}
