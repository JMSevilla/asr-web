import { Typography } from '@mui/material';
import { CallToAction } from '../api/content/types/common';
import {
  CmsPage,
  ColorSchemesValue,
  JourneyTypeSelection,
  PageContentValues,
  ThemeBackgroundColorSelection,
  TimelineItemStatus,
} from '../api/content/types/page';
import { CmsTenant } from '../api/content/types/tenant';
import {
  AcknowledgementsFormBlock,
  AddressBlock,
  AlertsNonPriorityListBlock,
  AlertsPriorityListBlock,
  AvailableFundsListBlock,
  BackButtonBlock,
  BadgeBlock,
  BankDetailsBlock,
  BeneficiariesListBlock,
  BeneficiariesSummaryBlock,
  BeneficiaryWizardBlock,
  BereavementDeleteFormBlock,
  BereavementStartFormBlock,
  BereavementSubmitFormBlock,
  BereavementSummaryBlock,
  BereavementSummaryBlockV2,
  ButtonClipBlock,
  CallEndpointBlock,
  Card,
  CaseTrackerBlock,
  ChartBlock,
  CheckOnGrowthBlock,
  CheckboxListFormBlock,
  ContentButtonBlock,
  CustomStartTransferApplicationButtonBlock,
  DCOptionsSelectedRetirementDateBlock,
  DCRetirementOptionC2SLumpSumBlock,
  DataSummaryBlock,
  DataTableBlockV2,
  DcRetirementLumpSumBlock,
  DeleteJourneysBlock,
  DesignationOfFundsBlock,
  DocumentListBlock,
  DownloadOptionSummaryButtonBlock,
  DownloadRetirementApplicationButtonBlock,
  DownloadTransferApplicationButtonBlock,
  DownloadTransferFileBlock,
  EmailFormBlock,
  EmailVerificationBlock,
  FailedCalculationNotificationBlock,
  FinancialAdviseFormBlock,
  FlexibleBenefitsFormBlock,
  FormBoundRetirementDateBlock,
  GBGScanFormBlock,
  GuaranteedTransferBlock,
  GuaranteedTransferMessageBlock,
  HeaderTitleBlock,
  IFrameFormBlock,
  InfoTileBlock,
  InformationBlock,
  InformationModalBlock,
  IphoneTranferDownloadPack,
  JourneyContinueControlBlock,
  JourneyEndingBlock,
  JourneyQuestionsBlock,
  JourneySummaryV2Block,
  JourneySwitchBlock,
  LSAQuestionFormBlock,
  LTAPercentageFormBlock,
  LTAUsedAnswersBlock,
  LTAUsedPercentageBlock,
  LVFAStracingProgressBlock,
  LatestContributionsBlock,
  LeavePensionBenefitsBlock,
  LinksGroupBlock,
  LoginFormBlock,
  LumpSumInstallmentBlock,
  MemberContactPreferenceBlock,
  MemberContactsBlock,
  MemberPersonalDetailsBlock,
  MembershipDataPanelBlock,
  MembershipDetailsBlock,
  MessageBlock,
  MessageType,
  OrderedAccordionsList,
  PageFeedWidgetsBlock,
  PageGrid,
  PageMenuBlock,
  PanelBlock,
  PartialTransferCalculatorBlock,
  PartialTransferDownloadBlock,
  PartialTransferLimitsBenefitsBlock,
  PensionProjectionsOptionsBlock,
  PensionWiseFormBlock,
  PensionWiseOptOutDeclarationFormBlock,
  PensionsProjectionsBlock,
  PensionsProjectionsBlockV2,
  PersonAddressBlock,
  PersonContactsSelectionBlock,
  PersonFormBlock,
  PersonIdentificationBlock,
  PersonalDetailsBlock,
  PhoneFormBlock,
  QuoteTransferEstimateBlock,
  RefNoSelectionBlock,
  ResourceListBlock,
  ResourceListItemBlock,
  ResourceListItemProps,
  RetirementApplicationDeleteBlock,
  RetirementApplicationInformationPanelBlock,
  RetirementDateBlock,
  RetirementDatePickerBlock,
  RetirementJourneyInitiationBlock,
  RetirementLumpSumBlock,
  RetirementOptionSummaryBlock,
  RetirementOptionsFilterBlock,
  RetirementOptionsListBlock,
  RetirementTimelineBlock,
  SingleAuthRedirectingFormBlock,
  StageIndicatorBlock,
  StartTransferApplicationButtonBlock,
  StrategiesListBlock,
  SubmissionBlock,
  SubscriptionPreferencesBlock,
  Tabs,
  TaskListContainerBlock,
  TextBlock,
  TimelineBlock,
  TrackerBlock,
  TransferApplicationDetailsBlock,
  TransferIFAAcknowledgementsFormBlock,
  TransferLoaderBlock,
  TransferSubmissionFormBlock,
  TransferSummaryBlock,
  UploadFormBlock,
} from '../components';
import { config } from '../config';
import { appColorsFromPrimary } from '../core/theme/theme';
import { CmsButton } from './types';

export const parseImageUrl = (partialUrl: string) => config.value.CMS_URL + partialUrl;

export const parseContent = (
  contents: PageContentValues[],
  page: CmsPage,
  tenant: CmsTenant | null,
  queryParams = {},
) => {
  const hideBackButton = page.journeyHideBackButton?.value ?? false;
  const journeyType = page.journeyType?.value?.selection.toLowerCase() as JourneyTypeSelection;
  const isRetirementJourney = journeyType === 'retirement';
  const isBereavementJourney = journeyType === 'bereavement';
  const pageKey = page.pageKey.value;
  const journeyStage = page.journeyStage?.value;
  const journeyStep = page.journeyStepNumber?.value;
  const backPageKey = page.backPageKey?.value;
  const grid = page.content?.values?.[0];
  const gridBackgroundColour = grid
    ? grid.elements.gridBackgroundColour?.value || parseBackgroundColor(tenant, grid.elements.themeColorForBackround)
    : '';

  return contents.map(content => {
    const type = (content?.elements?.formKey?.value || content?.type).trim();
    const elements = content?.elements;

    switch (type) {
      case 'Panel': {
        return (
          <PanelBlock
            id={type}
            page={page}
            tenant={tenant}
            header={elements.header}
            layout={elements.layout}
            columns={elements.columns}
            reverseStacking={elements.reverseStacking}
            panelKey={elements.panelKey?.value}
          />
        );
      }
      case 'Page feed': {
        return (
          <PageFeedWidgetsBlock
            pageUrl={page.pageUrl.value}
            defaultImage={elements.defaultItemImage}
            showAll={elements.showAllItems?.value ?? false}
            pageUrlsString={elements.items?.value}
            header={elements.header?.value}
            cards={content?.elements?.cards?.values}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }

      case 'Task List Container': {
        return <TaskListContainerBlock id={type} elements={elements} />;
      }

      case 'Grid': {
        return (
          <PageGrid
            page={page}
            tenant={tenant}
            contentBlocksList={elements?.contentBlocks?.values}
            gridItemsBackgroundColor={
              elements.gridBackgroundColour?.value || parseBackgroundColor(tenant, elements.themeColorForBackround)
            }
            columns={elements.columns?.value}
            rows={elements.rows?.value}
            gridKey={elements?.gridKey?.value}
          />
        );
      }
      case 'header': {
        return (
          <HeaderTitleBlock
            id={type}
            isInStickOutPage={page.showAsStickOut?.value}
            pageHeader={page.pageHeader?.value}
            icon={page.headerIcon}
            pageKey={pageKey}
            backPageKey={backPageKey}
            journeyType={journeyType}
            indicatorExists={contents[0].type === 'Journey stage indicator'}
          />
        );
      }
      case 'back_button': {
        return (
          !hideBackButton && (
            <BackButtonBlock
              id={type}
              isInStickOutPage={page.showAsStickOut?.value}
              journeyType={journeyType}
              pageKey={pageKey}
            />
          )
        );
      }
      case 'back_button_by_page_key': {
        return (
          <BackButtonBlock
            id={type}
            isInStickOutPage={page.showAsStickOut?.value}
            pageKey={pageKey}
            backPageKey={backPageKey}
          />
        );
      }
      case 'Button clip': {
        return (
          <ButtonClipBlock
            id={type}
            journeyType={journeyType}
            pageKey={pageKey}
            buttons={
              content.elements.buttons?.values?.map(button => parseButtonProps(button.elements, journeyType)) ?? []
            }
          />
        );
      }
      case 'Content HTML block': {
        return (
          <TextBlock
            id={elements?.contentBlockKey?.value ?? type}
            header={elements?.header?.value}
            blockHeader={elements?.blockHeader}
            subHeader={elements?.subHeader?.value}
            html={elements?.content?.value}
            sourceUrl={elements?.dataSourceUrl?.value}
            backgroundColor={parseBackgroundColor(tenant, content.elements.themeColorForBackround)}
            showInAccordion={elements?.showInAccordion?.value}
            smallerFonts={page.showAsStickOut?.value}
            insideHeroBlock={isHeroBlockContent(elements, page)}
            errorContent={elements.errorContent?.value}
            alternateTableStyle={elements?.alternateTableStyle?.value?.selection}
          />
        );
      }
      case 'Checkbox list': {
        return (
          <CheckboxListFormBlock
            key={elements?.checkboxListKey?.value}
            checkboxes={elements?.checkbox?.values ?? []}
            description={elements?.description?.value}
            checkboxesListKey={elements?.checkboxListKey?.value ?? ''}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }
      case 'Tabs': {
        return <Tabs panels={content?.elements?.panels?.values ?? []} page={page} tenant={tenant} />;
      }
      case 'authentication_form': {
        return (
          <LoginFormBlock
            id={type}
            parameters={parseCmsParams(elements!.parameters!.values)}
            backgroundColor={parseBackgroundColor(tenant, content.elements.themeColorForBackround)}
          />
        );
      }
      case 'pension_projections': {
        return <PensionsProjectionsBlock id={type} />;
      }
      case 'pension_projections_v2': {
        return <PensionsProjectionsBlockV2 id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'transfer_hub_details_v2': {
        return <TransferApplicationDetailsBlock id={type} />;
      }
      case 'financial_advise_date_form': {
        return (
          <FinancialAdviseFormBlock
            id={type}
            formKey="financial_advise_date_form"
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
            journeyType={journeyType}
          />
        );
      }
      case 'pension_wise_date_form': {
        return (
          <PensionWiseFormBlock
            id={type}
            formKey="pension_wise_date_form"
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
            journeyType={journeyType}
          />
        );
      }
      case 'pw_opt_out_form': {
        return (
          <PensionWiseOptOutDeclarationFormBlock
            id={type}
            formKey="pw_opt_out_form"
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'pension_projections_options_table': {
        return <PensionProjectionsOptionsBlock id={type} />;
      }
      case 'Link Panel': {
        return (
          <LinksGroupBlock
            id={type}
            links={parseLinkGroups(elements?.linkGroups?.values)}
            backgroundColor={parseBackgroundColor(tenant, content.elements.themeColorForBackround)}
          />
        );
      }
      case 'retirement_app_file_download': {
        return <InformationBlock id={type} />;
      }
      case 'Message': {
        if (elements?.showAlwaysOnTop?.value) return null;
        return (
          <MessageBlock
            id={type}
            html={elements?.text?.value}
            sourceUrl={elements.dataSourceUrl?.value}
            header={elements?.header?.value}
            icon={elements?.icon?.value}
            type={elements?.type?.value?.selection as MessageType}
            isInfoBlock={elements?.type?.value?.selection === 'Info block'}
            buttons={callToActionValuesToCmsButtons(elements?.callToAction?.values ?? [])}
          />
        );
      }
      case 'retirement_start_v2': {
        return (
          <RetirementJourneyInitiationBlock
            id={type}
            parameters={parseCmsParams(elements.parameters!.values)}
            tenant={tenant}
          />
        );
      }
      case 'retirement_end': {
        return <JourneyEndingBlock id={type} />;
      }
      case 'retirement_journey_switch': {
        return <JourneySwitchBlock parameters={parseCmsParams(elements.parameters!.values)} pageKey={pageKey} />;
      }
      case 'retirement_app_submission': {
        return <SubmissionBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} tenant={tenant} />;
      }
      case 'retirement_application_acknowledgements': {
        return <AcknowledgementsFormBlock id={type} />;
      }
      case 'retirement_application_information_panel': {
        return (
          <RetirementApplicationInformationPanelBlock
            id={type}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
            tenant={tenant}
          />
        );
      }
      case 'Journey question': {
        return (
          <JourneyQuestionsBlock
            id={type}
            answers={parseAnswersData(elements.answers!.values)}
            questionKey={elements.questionKey!.value}
            questionText={elements.questionText?.value}
            bottomPanel={elements.bottomPanel?.value}
            showInDropdown={elements.showInDropdown?.value}
            hideSaveAndExit={elements.hideSaveAndExit?.value}
            pageKey={pageKey}
            journeyType={journeyType}
            avoidBranching={elements.avoidBranching?.value ?? false}
            buttons={elements.buttons?.values?.map(button => parseButtonProps(button.elements, journeyType)) ?? []}
          />
        );
      }
      case 'retirement_date': {
        return (
          <RetirementDateBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
            buttons={
              elements.actionButtons?.values?.map(button => parseButtonProps(button.elements, journeyType)) ?? []
            }
          />
        );
      }
      case 'DC_options_filter': {
        return (
          <RetirementOptionsFilterBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
            panelList={elements.panelList?.values}
          />
        );
      }
      case 'DC_options_selected_retirement_date': {
        return <DCOptionsSelectedRetirementDateBlock id={type} />;
      }
      case 'options_list': {
        return (
          <RetirementOptionsListBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
          />
        );
      }
      case 'dc_retirement_option_change_lump_sum': {
        return (
          <DcRetirementLumpSumBlock
            id={type}
            parameters={parseCmsParams(elements.parameters!.values)}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }
      case 'retirement_option_change_lump_sum_v2': {
        return <RetirementLumpSumBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'transfer_estimate': {
        return <QuoteTransferEstimateBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'Journey stage indicator': {
        return (
          <StageIndicatorBlock
            id={type}
            stages={parseStages(elements.stage!.values)}
            journeyStage={journeyStage!}
            maxJourneySteps={elements.maxNumberOfJourneySteps!.value}
            journeyStep={journeyStep!}
            singleStepSize={10}
          />
        );
      }
      case 'bank_details_form': {
        return (
          <BankDetailsBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'address_form': {
        return (
          <AddressBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'person_id_data': {
        return (
          <PersonIdentificationBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
            panelList={content?.elements?.panelList?.values}
            isStandAlone={page.showAsStickOut?.value}
            journeyType={journeyType}
          />
        );
      }
      case 'person_address_data': {
        return (
          <PersonAddressBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
            panelList={content?.elements?.panelList?.values}
            journeyType={journeyType}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'bereavement_contact_selection': {
        return (
          <PersonContactsSelectionBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'email_verification_form': {
        return (
          <EmailVerificationBlock
            id={type}
            pageKey={pageKey}
            isJourney={isBereavementJourney}
            parameters={parseCmsParams(elements!.parameters!.values)}
            panelList={content?.elements?.panelList?.values}
          />
        );
      }

      case 'email_confirmation_form': {
        return (
          <EmailFormBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }

      case 'phone_confirmation_form': {
        return (
          <PhoneFormBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'personal_details_retirement': {
        return <PersonalDetailsBlock id={type} />;
      }
      case 'lta_used_answers': {
        return (
          <LTAUsedAnswersBlock
            id={type}
            formKey="lta_used_answers"
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'lta_entering_of_percentage': {
        return (
          <LTAPercentageFormBlock
            id={type}
            formKey="lta_entering_of_percentage"
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'lta_used_percentage': {
        return <LTAUsedPercentageBlock id={type} formKey="lta_used_percentage" />;
      }
      case 'Button': {
        return (
          <ContentButtonBlock
            id={type}
            queryParams={queryParams}
            pageKey={pageKey}
            {...parseButtonProps(elements, journeyType)}
          />
        );
      }
      case 'start_transfer_application': {
        return (
          <StartTransferApplicationButtonBlock id={type} parameters={parseCmsParams(elements!.parameters!.values)} />
        );
      }
      case 'start_transfer_application_v2': {
        return (
          <CustomStartTransferApplicationButtonBlock
            id={type}
            parameters={parseCmsParams(elements!.parameters!.values)}
            buttons={
              elements.actionButtons?.values?.map(button => parseButtonProps(button.elements, journeyType)) ?? []
            }
          />
        );
      }
      case 'iphone_download_transfer_pack': {
        return (
          <IphoneTranferDownloadPack id={type} pageKey={pageKey} journeyType={journeyType} queryParams={queryParams} />
        );
      }
      case 'transfer_pdf_download': {
        return <DownloadTransferApplicationButtonBlock id={type} />;
      }
      case 'transfer_file_download': {
        return <DownloadTransferFileBlock id={type} />;
      }
      case 'retirement_app_pdf_genereator': {
        return <DownloadRetirementApplicationButtonBlock id={type} />;
      }
      case 'option_summary_pdf_download': {
        return <DownloadOptionSummaryButtonBlock id={type} />;
      }
      case 'transfer_IFA_ack_form': {
        return (
          <TransferIFAAcknowledgementsFormBlock id={type} parameters={parseCmsParams(elements!.parameters!.values)} />
        );
      }
      case 'journey_continue_control': {
        return (
          <JourneyContinueControlBlock
            id={type}
            pageKey={pageKey}
            isJourney={isRetirementJourney}
            parameters={parseCmsParams(elements!.parameters!.values)}
          />
        );
      }
      case 'gbg_user_identification_form': {
        return (
          <GBGScanFormBlock
            id={type}
            pageKey={pageKey}
            tenant={tenant}
            parameters={parseCmsParams(elements!.parameters!.values)}
            journeyType={journeyType}
          />
        );
      }
      case 'retirement_application_summary_v2': {
        return (
          <JourneySummaryV2Block
            id={type}
            parameters={parseCmsParams(elements!.parameters!.values)}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }
      case 'failed_calculation_notification': {
        return <FailedCalculationNotificationBlock />;
      }
      case 'delete_retirement_app': {
        return <RetirementApplicationDeleteBlock id={type} tenant={tenant} />;
      }
      case 'selected_option_summary': {
        return (
          <RetirementOptionSummaryBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'Data summary': {
        return (
          <DataSummaryBlock
            id={type}
            sourceUrl={elements.dataSourceUrl?.value}
            summaryBlocks={elements.summaryBlocks?.values}
            journeyType={journeyType}
            pageKey={pageKey}
          />
        );
      }
      case 'Data table': {
        return (
          <DataTableBlockV2
            id={type}
            tableKey={elements.dataTableKey?.value}
            sourceUrl={elements.dataSourceUrl?.value}
            paramName={elements.dataArray?.value}
            columns={elements.dataColumns?.values}
            withLabelPrefix={elements.addPrefixForLabelFields?.value}
            defaultOrderingColumn={elements.defaultOrderingColumn?.value}
            defaultOrderingOrder={elements.defaultOrderingOrder?.value?.selection}
            selectableRows={elements.selectableRows?.value}
            actionColumn={{
              column: elements.actionableColumn?.value,
              status: elements.actionableStatus?.value,
              customization: elements.actionColumnCustomisation?.values,
            }}
          />
        );
      }
      case 'document_list': {
        return <DocumentListBlock id={type} tenant={tenant} />;
      }
      case 'Modal information': {
        return (
          <InformationModalBlock
            id={type}
            header={elements.header!.value}
            linkText={elements.linkText!.value}
            text={elements.text!.value!}
            isAlternateStyle={elements.showInAlternateStyle?.value}
            hideCloseInAlternateStyle={elements.hideCloseInAlternateStyle?.value}
            buttons={
              elements?.callToAction?.values ? callToActionValuesToCmsButtons(elements?.callToAction.values) : []
            }
          />
        );
      }
      case 'my_personal_details_panel': {
        return <MemberPersonalDetailsBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'membership_data_panel': {
        return <MembershipDataPanelBlock id={type} />;
      }
      case 'Page menu': {
        return <PageMenuBlock id={type} items={elements.pageMenuItem?.values ?? []} />;
      }
      case 'my_membership_details_panel': {
        return <MembershipDetailsBlock id={type} />;
      }
      case 'my_contact_details_panel': {
        return <MemberContactsBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'my_contact_subscriptions_details_panel': {
        return <MemberContactPreferenceBlock id={type} />;
      }
      case 'subscription_preferences': {
        return <SubscriptionPreferencesBlock id={type} />;
      }
      case 'Ordered list': {
        return (
          <OrderedAccordionsList
            id={elements.orderedListKey?.value ?? type}
            listItems={elements?.orderedListItems?.values}
            header={elements?.header?.value}
            isHiddenNumbers={elements?.hideNumber?.value}
          />
        );
      }
      case 'retirement_timeline': {
        return <RetirementTimelineBlock id={type} />;
      }
      case 'Track_LVFAS_form': {
        return <LVFAStracingProgressBlock id={type} />;
      }
      case 'beneficiaries_summary': {
        return <BeneficiariesSummaryBlock id={type!} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'beneficiaries_wizard': {
        return (
          <BeneficiaryWizardBlock
            panelList={content?.elements?.panelList?.values}
            id={type!}
            backPageKey={backPageKey}
          />
        );
      }
      case 'ref_no_selection_form': {
        return (
          <RefNoSelectionBlock
            id={type}
            preRetirementAgePeriod={tenant?.preRetiremetAgePeriod?.value ?? 0}
            newlyRetiredRange={tenant?.newlyRetiredRange?.value ?? 0}
          />
        );
      }
      case 'guaranteed_transfer_value': {
        return <GuaranteedTransferBlock id={type} prefix="transfer_quote" />;
      }
      case 'guaranteed_transfer_value_msg': {
        return (
          <GuaranteedTransferMessageBlock
            id={type}
            prefix="transfer_quote_v2"
            headerKey="transfer_quote_v2_header"
            isMessage
            buttons={
              elements.actionButtons?.values?.map(button => parseButtonProps(button.elements, journeyType)) ?? []
            }
          />
        );
      }
      case 'partial_transfer_limits': {
        return <PartialTransferLimitsBenefitsBlock id={type} />;
      }
      case 'leave_pension_benefits': {
        return <LeavePensionBenefitsBlock id={type} />;
      }
      case 'partial_transfer_calculator': {
        return <PartialTransferCalculatorBlock id={type} />;
      }
      case 'partial_transfer_download': {
        return <PartialTransferDownloadBlock id={type} />;
      }
      case 'person_data': {
        return (
          <PersonFormBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements.parameters!.values)}
            panelList={content?.elements?.panelList?.values}
            journeyType={journeyType}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'upload_data': {
        return (
          <UploadFormBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements.parameters!.values)}
            panelList={content?.elements?.panelList?.values}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'bereavement_delete': {
        return <BereavementDeleteFormBlock />;
      }
      case 'bereavement_start_form': {
        return (
          <BereavementStartFormBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'bereavement_submit_form': {
        return (
          <BereavementSubmitFormBlock
            id={type}
            pageKey={pageKey}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'bereavement_summary_form': {
        return (
          <BereavementSummaryBlock
            id={type}
            parameters={parseCmsParams(elements.parameters!.values)}
            pageKey={pageKey}
          />
        );
      }
      case 'bereavement_summary_form_v2': {
        return (
          <BereavementSummaryBlockV2
            id={type}
            parameters={parseCmsParams(elements.parameters!.values)}
            pageKey={pageKey}
          />
        );
      }
      case 'Resource list': {
        return (
          <ResourceListBlock
            id={type}
            header={elements.header?.value}
            resourceListKey={elements.resourceListKey?.value}
            displayType={elements.displayType?.value?.selection}
            resources={parseResourceListItems(elements.resources?.values || [])}
          />
        );
      }
      case 'Resource': {
        return (
          <ResourceListItemBlock
            id={type}
            title={elements.title?.value!}
            resourceKey={elements.resourceKey?.value}
            link={elements.link?.value}
            image={elements.image}
            icon={elements.icon}
            document={elements.document}
            documentType={elements.documentType?.value?.selection}
            standaloneSize={elements.standaloneSize?.value?.selection}
          />
        );
      }
      case 't2_review_application_form': {
        return (
          <TransferSummaryBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'transfer_v2_submit': {
        return (
          <TransferSubmissionFormBlock
            id={type}
            tenant={tenant}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'flexible_benefits_form': {
        return (
          <FlexibleBenefitsFormBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            parameters={parseCmsParams(elements.parameters!.values)}
            isStandAlone={page.showAsStickOut?.value}
          />
        );
      }
      case 'case_tracker': {
        return (
          <CaseTrackerBlock
            id={type}
            pageKey={pageKey}
            panelList={elements?.panelList?.values}
            parameters={parseCmsParams(elements.parameters!.values)}
          />
        );
      }
      case 'Tracker': {
        return (
          <TrackerBlock
            id={type}
            pageKey={pageKey}
            journeyType={(elements.journeyType?.value as unknown as JourneyTypeSelection) || journeyType}
            panelList={elements.panelList?.values}
            dataSourceUrl={elements.dataSourceUrl?.value}
            trackerItems={
              elements.trackerItems?.values.map(item => ({
                endPage: item.endPage.value,
                firstPage: item.firstPage.value,
                stageKey: item.stageKey.value,
                trackerItemHeader: item.trackerItemText.value,
                hideButton: item.hideButton?.value,
              })) || []
            }
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
          />
        );
      }
      case 'iframe': {
        return <IFrameFormBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} />;
      }
      case 'Card': {
        return (
          <Card
            id={type}
            pageKey={pageKey}
            title={content?.elements?.header?.value}
            titleIcon={content?.elements?.icon}
            caption={content?.elements?.caption?.value}
            captionIfData={content?.elements?.captionIfData?.value}
            footerIcon={content?.elements?.footerIcon}
            image={content?.elements?.image}
            html={content?.elements?.mainContent?.value}
            panel={content?.elements?.panel?.value}
            chart={content?.elements?.chart?.value?.elements}
            content={content?.elements?.chart?.value as PageContentValues}
            button={
              elements?.callToAction?.value?.elements
                ? parseButtonProps(elements?.callToAction?.value?.elements, journeyType)
                : null
            }
            buttonIfData={
              elements?.callToActionIfData?.value?.elements
                ? parseButtonProps(elements?.callToActionIfData?.value?.elements, journeyType)
                : null
            }
            disabledButton={!!content?.elements?.disableCallToAction?.value}
            sourceUrl={content?.elements?.dataSourceUrl?.value}
            errorContent={content?.elements?.errorText?.value}
            elementsColor={parseBackgroundColor(tenant, content.elements.elementsColor)}
            backgroundColor={
              content?.elements?.backgroundColour?.value ||
              parseBackgroundColor(tenant, content.elements.themeColorForBackround) ||
              gridBackgroundColour
            }
          />
        );
      }
      case 'Info tile': {
        return (
          <InfoTileBlock
            id={type}
            data={elements.data?.value}
            iconName={elements.iconName?.value}
            tileKey={elements.tileKey?.value}
            title={elements.title?.value}
            tooltip={elements.tooltip?.value}
            sourceUrl={elements.dataSourceUrl?.value}
            backgroundColor={parseBackgroundColor(tenant, content.elements.backgroundColor)}
            textColor={parseBackgroundColor(tenant, content.elements.textColor)}
            iconColor={parseBackgroundColor(tenant, content.elements.iconColor)}
          />
        );
      }
      case 'delete_journeys': {
        return (
          <DeleteJourneysBlock id={type} pageKey={pageKey} parameters={parseCmsParams(elements.parameters!.values)} />
        );
      }
      case 'Chart': {
        return (
          <ChartBlock
            id={type}
            xAxisName={elements.xAxisName?.value}
            yAxisName={elements.yAxisName?.value}
            hideLegend={elements.hideLegend?.value}
            chartKey={elements.chartKey?.value}
            sourceUrl={elements.dataSourceUrl?.value}
            type={elements.type?.value?.selection}
            heightToWidthRatio={elements.heightWidthRatio?.value}
            labelLengthLimit={elements.labelLengthLimit?.value}
            customColors={parseColorsFromSchemes(elements.customColors?.value)}
            defaultColors={parseColorsFromSchemes(elements.defaultColors?.value)}
          />
        );
      }
      case 'date_picker_with_age': {
        return (
          <FormBoundRetirementDateBlock
            id={type}
            parameters={parseCmsParams(elements!.parameters!.values)}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }
      case 'pre_journey_retirement_date_picker': {
        return <RetirementDatePickerBlock id={type} parameters={parseCmsParams(elements!.parameters!.values)} />;
      }
      case 'Timeline': {
        return (
          <TimelineBlock
            id={type}
            key={elements?.key?.value}
            sourceUrl={elements?.dataSourceUrl?.value}
            simplified={elements?.simplifiedVersion?.value}
            items={
              elements?.timelineItems?.values.map(item => ({
                description: item.description.value,
                header: item.header.value,
                status: item.status.value?.selection as TimelineItemStatus,
              })) || []
            }
          />
        );
      }
      case 'transfer_loading': {
        return <TransferLoaderBlock id={type} parameters={parseCmsParams(elements.parameters!.values)} pageKey="hub" />;
      }
      case 'lump_sum_installment_2': {
        return <LumpSumInstallmentBlock id={type} journeyType={journeyType} pageKey={pageKey} />;
      }
      case 'LSA_LSDBA_allowance_form': {
        return <LSAQuestionFormBlock id={type} journeyType={journeyType} pageKey={pageKey} />;
      }
      case 'designation_of_funds': {
        return (
          <DesignationOfFundsBlock
            id={type}
            journeyType={journeyType}
            pageKey={pageKey}
            panelList={elements.panelList?.values}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
          />
        );
      }
      case 'show_available_funds': {
        return <AvailableFundsListBlock id={type} pageKey={pageKey} panelList={elements.panelList?.values} />;
      }
      case 'beneficiaries_list': {
        return (
          <BeneficiariesListBlock
            id={type}
            panelList={elements.panelList?.values}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
          />
        );
      }
      case 'call_endpoint_in_background': {
        return (
          <CallEndpointBlock id={type} pageKey={pageKey} parameters={parseCmsParams(elements.parameters!.values)} />
        );
      }
      case 'designation_of_funds_strategies': {
        return (
          <StrategiesListBlock
            id={type}
            pageKey={pageKey}
            journeyType={journeyType}
            panelList={elements.panelList?.values}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
          />
        );
      }
      case 'check-on-growth-display': {
        return <CheckOnGrowthBlock id={type} parameters={parseCmsParams(elements.parameters?.values ?? [])} />;
      }
      case 'latest-contributions-display': {
        return <LatestContributionsBlock id={type} parameters={parseCmsParams(elements.parameters?.values ?? [])} />;
      }
      case 'alerts_priority_list': {
        return <AlertsPriorityListBlock id={type} parameters={parseCmsParams(elements.parameters?.values ?? [])} />;
      }
      case 'alerts_nonpriority_list': {
        return <AlertsNonPriorityListBlock id={type} parameters={parseCmsParams(elements.parameters?.values ?? [])} />;
      }
      case 'sa_redirecting_form': {
        return (
          <SingleAuthRedirectingFormBlock id={type} parameters={parseCmsParams(elements.parameters?.values ?? [])} />
        );
      }
      case 'Badge': {
        return (
          <BadgeBlock
            id={elements?.badgeKey?.value}
            accessibilityText={elements?.title?.value}
            text={elements?.title?.value}
            backgroundColor={parseBackgroundColor(tenant, elements.themeColorForBackground)}
            color={parseBackgroundColor(tenant, elements.elementColor)}
            urls={elements?.dataSourceUrl?.value}
            addBorder={elements?.addBorder?.value ?? false}
          />
        );
      }
      case 'dc_retirement_option_c2s_lump_sum': {
        return (
          <DCRetirementOptionC2SLumpSumBlock
            id={type}
            parameters={parseCmsParams(elements.parameters?.values ?? [])}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        );
      }
      default:
        return (
          <Typography data-testid="default-component" id={type}>
            {content?.elements?.panelNameLabel?.value}
          </Typography>
        );
    }
  });
};

export const parseCmsParams = (params: NonNullable<PageContentValues['elements']['parameters']>['values']) =>
  params.map(parameter => ({ key: parameter.key.value, value: parameter.value.value }));

const parseResourceListItems = (
  items: NonNullable<PageContentValues['elements']['resources']>['values'],
): ResourceListItemProps[] =>
  items.map(item => ({
    id: item.elements.resourceKey.value || item.elements.title.value,
    title: item.elements.title.value,
    resourceKey: item.elements.resourceKey.value,
    link: item.elements.link.value,
    image: item.elements.image,
    icon: item.elements.icon,
    document: item.elements.document,
    documentType: item.elements.documentType.value?.selection,
    standaloneSize: item.elements.standaloneSize.value?.selection,
  }));

const parseStages = (stages: NonNullable<PageContentValues['elements']['stage']>['values']) => {
  return stages?.map(stage => ({
    text: stage.key.value,
    value: Number(stage.value.value),
  }));
};

export const parseButtonProps = (
  element: Partial<NonNullable<PageContentValues['elements']>>,
  journeyType?: JourneyTypeSelection,
) => {
  return {
    key: element.buttonKey?.value,
    customActionKey: element.customActionKey?.value,
    linkKey: element.pageKey?.value,
    link: element.buttonLink?.value,
    anchor: element.anchor?.value ? formatAnchor(element.anchor.value) : '',
    type: element.buttonType?.value?.selection,
    text: element.buttonText?.value,
    icon: element.icon,
    iconName: element.iconName?.value,
    rightSideIcon: element.rightSideIcon?.value,
    notification: element.notification?.value,
    reuseUrlParameters: element.reuseUrlParameters?.value,
    openInTheNewTab: element.openInTheNewTab?.value,
    widthPercentage: element.widthPercentage?.value,
    disabledReason: element.disabledReason?.value,
    analyticsKey: element.analyticsKey?.value,
    fileUrl: element?.openFile?.url ? config.value.CMS_URL + element.openFile.url : '',
    dialogElement: element.openDialog,
    journeyType:
      (element.journeyType?.value?.selection?.toLowerCase() as JourneyTypeSelection | undefined) ||
      (element.journeyType?.value as JourneyTypeSelection | undefined) ||
      journeyType,
    fastForwardComparisonPageKey: element.fastForwardComparisonPageKey?.value,
    fastForwardRedirectPageKey: element.fastForwardRedirectPageKey?.value,
    postRequestUrl: element.postToEndpoint?.value,
    largeIcon: element.largeIcon?.value,
    disabled: element.disabled?.value,
  };
};

export type ParsedButtonProps = ReturnType<typeof parseButtonProps>;

const parseLinkGroups = (groups: NonNullable<PageContentValues['elements']['linkGroups']>['values']) => {
  return groups
    ?.filter(groupItem => groupItem?.elements)
    .map(group => ({
      labelHeader: group.elements?.header?.value ?? group.elements?.defaultHeaderLabel?.value,
      groupItems: group.elements?.items?.values?.map(item => {
        return {
          label: item?.elements?.header.value,
          html: item?.elements?.content.value,
          link: item?.elements?.headerLink.value,
        };
      }),
    }));
};

const isHeroBlockContent = (elements: PageContentValues['elements'], page: CmsPage) => {
  return page.heroBlocks?.values?.[0]?.elements?.heroContent?.value?.elements?.header?.value === elements.header?.value;
};

const parseAnswersData = (answers: NonNullable<PageContentValues['elements']['answers']>['values']) => {
  return answers?.map(item => ({
    answer: item.answer.value,
    answerKey: item.answerKey.value,
    nextPageKey: item.pageKey?.value ?? '',
    descriptionPanels: item.descriptionPanels?.values,
  }));
};

export const parseBackgroundColor = (
  tenant?: CmsTenant | null,
  themeColorSelection?: ThemeBackgroundColorSelection | null,
) => {
  const primaryColor = tenant?.primaryColor.value;
  const selection = themeColorSelection?.value?.selection;
  if (!primaryColor) {
    return;
  }

  const appColors = appColorsFromPrimary(primaryColor);

  switch (selection) {
    case 'Primary':
      return appColors.primary;
    case 'Secondary':
      return appColors.secondary.transparentLight;
    case 'SecondaryDark':
      return appColors.secondary.dark;
    case 'Tertiary':
      return appColors.tertiary.transparentLight;
    case 'TertiaryDark':
      return appColors.tertiary.dark;
    case 'Support60':
      return appColors.support60.transparentLight;
    case 'Support60Dark':
      return appColors.support60.dark;
    case 'Support80':
      return appColors.support80.transparentLight;
    case 'Support80Dark':
      return appColors.support80.dark;
    case 'White':
      return appColors.incidental['000'];
    case 'Black':
      return appColors.essential[1000];
    case 'None':
      return 'transparent';
    default:
      return undefined;
  }
};

export const callToActionValuesToCmsButtons = (buttons: CallToAction['values']) => {
  return buttons?.map(button => ({
    link: button.elements?.buttonLink?.value,
    linkKey: button.elements?.pageKey?.value,
    journeyType: button.elements?.journeyType?.value as unknown as JourneyTypeSelection | undefined,
    anchor: button.elements?.anchor?.value ? formatAnchor(button.elements.anchor.value) : '',
    text: button.elements?.buttonText?.value,
    key: button.elements?.buttonKey?.value,
    type: button.elements?.buttonType?.value?.selection,
    pageKey: button.elements?.pageKey?.value,
    icon: button.elements?.icon,
    iconName: button.elements?.iconName?.value,
    rightSideIcon: button.elements?.rightSideIcon?.value,
    disabledReason: button.elements?.disabledReason?.value,
    customActionKey: button.elements?.customActionKey?.value,
    openInTheNewTab: button.elements?.openInTheNewTab?.value,
    largeIcon: button?.elements.largeIcon?.value,
    disabled: button?.elements.disabled?.value,
  }));
};

export const callToActionValueToCmsButton = (button: CallToAction['value']): CmsButton | null => {
  if (!button) return null;

  return {
    link: button.elements?.buttonLink?.value,
    anchor: button.elements?.anchor?.value ? formatAnchor(button.elements.anchor.value) : '',
    text: button.elements?.buttonText?.value,
    key: button.elements?.buttonKey?.value,
    type: button.elements?.buttonType?.value?.selection,
    pageKey: button.elements?.pageKey?.value,
    icon: button.elements?.icon,
    disabledReason: button.elements?.disabledReason?.value,
    customActionKey: button.elements?.customActionKey?.value,
  };
};

export function parseColorsFromSchemes(value?: ColorSchemesValue['value']): string[] | undefined {
  return value?.elements.colorSchemes.values
    .flatMap(color => color.colors.value.replace(/\n/g, '').split(';'))
    .filter(Boolean);
}

function formatAnchor(anchor: string) {
  return `#${encodeURIComponent(anchor).trim()}`;
}
