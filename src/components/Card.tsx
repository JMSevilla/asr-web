import { Box, Stack, Typography, TypographyProps } from '@mui/material';
import Image from 'next/image';
import { createContext, useContext } from 'react';
import { FileValue } from '../api/content/types/common';
import { ChartElements, PageContentValues, PanelListItem } from '../api/content/types/page';
import { ChartData, DataSource } from '../api/mdp/types';
import { ParsedButtonProps, parseColorsFromSchemes, parseContent } from '../cms/parse-cms';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';
import { useTenantContext } from '../core/contexts/TenantContext';
import { useContentDataContext } from '../core/contexts/contentData/ContentDataContext';
import { useCachedCmsAsset } from '../core/hooks/useCmsAsset';
import { DataSourceTypes, useDataSource } from '../core/hooks/useDataSource';
import { EvaIcon } from './EvaIcon';
import { ParsedHtml } from './ParsedHtml';
import { ContentButtonBlock } from './blocks/ContentButtonBlock';
import { PanelBlock } from './blocks/PanelBlock';
import { BeneficiariesListLoader } from './blocks/beneficiariesList/BeneficiariesListLoader';
import { ChartBlock } from './blocks/chart/ChartBlock';
import { ChartLoader } from './blocks/chart/ChartLoader';
import { ButtonLoader } from './loaders/ButtonLoader';

interface Props extends TypographyProps {
  id: string;
  pageKey: string;
  title?: string;
  titleIcon?: FileValue;
  caption?: string;
  captionIfData?: string;
  image?: FileValue;
  html?: string;
  footerIcon?: FileValue;
  button?: ParsedButtonProps | null;
  buttonIfData?: ParsedButtonProps | null;
  disabledButton: boolean;
  chart?: ChartElements;
  panel?: PanelListItem;
  content?: PageContentValues;
  sourceUrl?: string;
  errorContent?: string;
  elementsColor?: string;
  backgroundColor?: string;
}

interface UsePanelCardContextValue {
  isCard: boolean;
  url?: string;
  dataSource?: DataSourceTypes;
}

const PanelCardContext = createContext<UsePanelCardContextValue>({
  isCard: false,
  url: '',
  dataSource: {} as DataSourceTypes,
});
export const usePanelCardContext = () => useContext(PanelCardContext);

export const Card: React.FC<Props> = ({
  id,
  pageKey,
  html,
  title,
  titleIcon,
  caption,
  captionIfData,
  image,
  footerIcon,
  button,
  buttonIfData,
  chart,
  disabledButton,
  panel,
  sourceUrl,
  errorContent,
  elementsColor,
  backgroundColor,
  content,
}) => {
  const imageSrc = useCachedCmsAsset(image?.url);
  const { page } = useContentDataContext();
  const { tenant } = useTenantContext();
  const { labelByKey } = useGlobalsContext();
  const showDataItemsValue = chart?.showDataItems?.value;
  const params: DataSource = { ...(showDataItemsValue ? { numberOfDataItems: showDataItemsValue } : {}) };
  const dataSource = useDataSource({ url: sourceUrl, params });
  const isBeneficiariesList = checkIfKeyIsInContent('beneficiaries_list');
  const isDataTable = checkIfKeyIsInContent('Data table');
  const shouldNotCenterContent =
    (isBeneficiariesList && dataSource.isLoading) || (isDataTable && !dataSource.isError && !dataSource.isEmpty);

  return (
    <Stack
      data-testid={id}
      bgcolor={backgroundColor ?? 'appColors.support80.transparentLight'}
      borderRadius="8px"
      p={6}
      gap={{ xs: 2, lg: 4 }}
      height="400px"
      width="100%"
      flexDirection="column"
      flexWrap="nowrap"
      lineHeight="normal"
    >
      <Stack direction="row" alignItems="center">
        {renderIcon()}
        <Typography
          variant="h3"
          fontWeight={700}
          fontSize={{ xs: 'h5.fontSize', md: 'h3.fontSize' }}
          color={elementsColor}
        >
          {title}
        </Typography>
      </Stack>
      {renderCaption()}
      <Stack
        className="card-content"
        flex={1}
        position="relative"
        justifyContent={shouldNotCenterContent ? 'flex-start' : 'center'}
        alignItems="center"
        width="100%"
        overflow="hidden"
        sx={{ '& > div': { width: '100%' }, color: elementsColor }}
      >
        {renderContent()}
      </Stack>
      <Box display="flex" justifyContent="flex-end" height={26}>
        {renderButton()}
      </Box>
    </Stack>
  );

  function renderIcon(): React.ReactNode {
    if (!titleIcon?.value) return null;

    if (titleIcon?.value?.includes('custom-eva-icon')) {
      return (
        <Typography
          aria-hidden="true"
          mr={4}
          height={22}
          width={22}
          maxHeight={22}
          maxWidth={22}
          lineHeight="22px"
          fontSize="h3.fontSize"
          fontWeight={700}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={elementsColor}
        >
          <span>{labelByKey(titleIcon.value.replace('custom-eva-icon-', ''))}</span>
        </Typography>
      );
    }

    return (
      <Box mr={4} mt="5px" mb="1px">
        <EvaIcon name={titleIcon.value} width={22} height={22} ariaHidden fill={elementsColor} />
      </Box>
    );
  }

  function renderCaption(): React.ReactNode {
    if (imageSrc || !sourceUrl) {
      return <Typography color={elementsColor}>{caption}</Typography>;
    }

    if ((dataSource.isError && errorContent) || dataSource.isEmpty) {
      return null;
    }

    if (captionIfData) {
      return (
        <Typography variant="body1" color={elementsColor}>
          {captionIfData}
        </Typography>
      );
    }

    return null;
  }

  function renderContent(): React.ReactNode {
    const details = renderDetails();
    if (details) {
      return details;
    }

    if (dataSource.isSuccess && content && page && content?.type) {
      const dataSourceUrlValue = sourceUrl || content?.elements?.dataSourceUrl?.value;
      const dataSourceUrl = dataSourceUrlValue ? { value: dataSourceUrlValue } : undefined;
      return (
        <PanelCardContext.Provider value={{ isCard: true, url: sourceUrl, dataSource }}>
          {parseContent([{ ...content, elements: { ...content.elements, dataSourceUrl } }], page, tenant)}
        </PanelCardContext.Provider>
      );
    }

    return <Box flex={1} />;
  }

  function renderDetails(): React.ReactNode {
    if (imageSrc) {
      return (
        <Image
          data-testid="card-image"
          src={imageSrc}
          style={{ objectFit: 'cover' }}
          alt={image?.asset?.altText || ''}
          fill
        />
      );
    }

    if (dataSource.isLoading && isBeneficiariesList) {
      return <BeneficiariesListLoader id={id} light={false} noBorderRadius />;
    }

    if (dataSource.isLoading) {
      return <ChartLoader id="block-loader" message={labelByKey('chart_loading')} light={false} />;
    }

    if (dataSource.isError && errorContent) {
      return <ParsedHtml html={errorContent} justifyContent="center" color={elementsColor} />;
    }

    if (dataSource.isEmpty && html) {
      return <ParsedHtml html={html} sx={{ display: 'block', width: '100%' }} color={elementsColor} />;
    }

    if (dataSource.isSuccess && panel) {
      return (
        <PanelCardContext.Provider value={{ isCard: true, url: sourceUrl, dataSource }}>
          <PanelBlock
            page={page!}
            tenant={tenant}
            header={panel.elements?.header}
            columns={panel.elements?.columns}
            layout={panel.elements?.layout}
            reverseStacking={panel.elements?.reverseStacking}
            panelKey={panel.elements?.panelKey?.value}
          />
        </PanelCardContext.Provider>
      );
    }

    if (dataSource.isSuccess && chart?.chartKey?.value) {
      return (
        <ChartBlock
          id={chart.chartKey?.value}
          xAxisName={chart.xAxisName?.value}
          yAxisName={chart.yAxisName?.value}
          hideLegend={chart.hideLegend?.value}
          chartKey={chart.chartKey?.value}
          sourceUrl={sourceUrl ?? chart.dataSourceUrl?.value}
          type={chart.type?.value?.selection}
          labelLengthLimit={chart.labelLengthLimit?.value}
          customColors={parseColorsFromSchemes(chart.customColors?.value)}
          defaultColors={parseColorsFromSchemes(chart.defaultColors?.value)}
          loading={dataSource.isLoading}
          lightLoader={false}
          data={dataSource.dataSource.result?.data as unknown as ChartData}
          fullHeight
        />
      );
    }

    return null;
  }

  function renderButton(): React.ReactNode {
    if (dataSource.isError) return null;

    if (dataSource.isLoading) {
      return <ButtonLoader light={false} width={{ xs: 175, md: 250 }} />;
    }

    if ((dataSource.isSuccess && buttonIfData) || button) {
      const buttonData = dataSource.isSuccess && buttonIfData ? buttonIfData : button;
      return (
        <ContentButtonBlock
          pageKey={pageKey}
          {...buttonData}
          disabled={disabledButton || dataSource.isError || dataSource.isLoading}
          text={
            <Stack gap={{ xs: 2, md: 2 }} direction="row" justifyContent="flex-end" alignItems="center" width="100%">
              <Typography component="span" sx={{ '&': { whiteSpace: 'normal', textAlign: 'right' } }}>
                {buttonData?.text}
              </Typography>
              {footerIcon?.value && (
                <EvaIcon
                  name={footerIcon.value}
                  width={21.5}
                  height={21.5}
                  fill={theme => theme.palette.primary.main}
                  ariaHidden
                />
              )}
            </Stack>
          }
        />
      );
    }

    return null;
  }

  function checkIfKeyIsInContent(key: string): boolean {
    const isDataTable = content?.type === key;
    const isDataTableForm = content?.elements.formKey?.value === key;
    const isDataTableInPanel = !!panel?.elements?.columns.values?.some(column =>
      column.contentBlocks?.values?.some(cb => cb.type === key),
    );
    return isDataTable || isDataTableForm || isDataTableInPanel;
  }
};
