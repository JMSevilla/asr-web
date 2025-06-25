import { Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Column, FilterProps, FilterValue, Row } from 'react-table';
import { CmsTenant } from '../../../api/content/types/tenant';
import { DocumentRequest, PaginationData, UserDocument } from '../../../api/mdp/types';
import { formatDate } from '../../../business/dates';
import { openInNewTab } from '../../../business/navigation';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useResolution } from '../../../core/hooks/useResolution';
import { trackButtonClick } from '../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import {
  DateRangeColumnFilter,
  DefaultColumnFilter,
  PaginatedTable,
  SelectColumnFilter,
  usePaginatedTable,
} from '../../table';
import { MessageType } from '../../topAlertMessages';
import { DocumentViewModal } from './DocumentViewModal';

interface Props {
  id?: string;
  tenant: CmsTenant | null;
}

interface TableDocument extends Record<string, unknown> {
  id: string;
  name: string;
  dateReceived: string;
  type: string;
  documentReadStatus: string;
  isBold: boolean;
  isHighlight: boolean;
}

const labelPrefix = 'my_doc_';

export const DocumentListBlock: React.FC<Props> = ({ id, tenant }) => {
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();
  const [clickedDocument, setClickedDocument] = useState<TableDocument | null>(null);
  const [savedPaginationData, setSavedPaginationData] = useState<PaginationData>();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();
  const documentsCb = useApiCallback(async (api, data: DocumentRequest) => {
    const result = await api.mdp.userDocuments(data);
    setSavedPaginationData(result.data);
    return result;
  });
  const documentsDownloadCb = useApiCallback((api, data: { ids: string[] }) => api.mdp.userDocumentsDownload(data));
  const documentDownloadCb = useApiCallback((api, id: string) => api.mdp.userDocumentDownload(id));
  const documentOpenCb = useApiCallback((api, id: string) => api.mdp.downloadUserDocument(id));
  const documentTypes = useApi(api => api.mdp.userDocumentsTypes());
  const { pageData, selectedRows, updateFilters, additionalFilters, tableProps } = usePaginatedTable<TableDocument>(
    { propertyName: 'dateReceived' },
    {
      dateReceived: (filter: FilterValue) => ({
        receivedDateFrom: formatDate(filter.value[0]),
        receivedDateTo: formatDate(filter.value[1]),
      }),
    },
  );

  useEffect(() => {
    documentsCb.execute({ ...pageData, ...additionalFilters });
  }, [pageData, additionalFilters]);

  useEffect(() => {
    const errors =
      (documentsCb.error as string[] | undefined) ||
      (documentTypes.error as string[] | undefined) ||
      (documentsDownloadCb.error as string[] | undefined) ||
      (documentDownloadCb.error as string[] | undefined);

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [documentsCb.error, documentTypes.error, documentsDownloadCb.error, documentDownloadCb.error]);

  const data = useMemo(() => mapDocuments(documentsCb.result?.data.items || []), [documentsCb.result?.data.items]);

  const filterLabelSuffix = additionalFilters['documentReadStatus']
    ? `_${additionalFilters['documentReadStatus']}`
    : '';

  const columns = useMemo(
    () =>
      [
        {
          Header: labelByKey(`${labelPrefix}document_name`),
          accessor: 'name',
          Filter: (props: FilterProps<{}>) =>
            DefaultColumnFilter({
              ...props,
              filterValue: props.column.filterValue,
              onChange: updateFilters,
              labelPrefix,
            }),
          filter: 'contains',
          minWidth: 250,
          width: 350,
          maxWidth: 500,
        },
        {
          id: 'dateReceived',
          Header: labelByKey(`${labelPrefix}date_received`),
          accessor: (row: TableDocument) => formatDate(row.dateReceived, 'yyyy-MM-dd HH:mm:ss.SSS'),
          Filter: (props: FilterProps<{}>) =>
            DateRangeColumnFilter({
              ...props,
              filterValue: props.column.filterValue ?? [null, null],
              onChange: updateFilters,
              labelPrefix,
            }),
          filter: 'dateBetween',
        },
        {
          Header: labelByKey(`${labelPrefix}type`),
          accessor: 'type',
          Filter: (props: FilterProps<{}>) =>
            SelectColumnFilter({
              ...props,
              filterValue: props.column.filterValue,
              onChange: updateFilters,
              labelPrefix,
              options: documentTypes.result?.data.types || [],
            }),
          filter: 'equals',
        },
        { Header: labelByKey(`${labelPrefix}status`), accessor: 'documentReadStatus', filter: 'equals' },
        { Header: 'id', accessor: 'id' },
      ] as Column<TableDocument>[],
    [documentTypes.result?.data.types],
  );

  return (
    <div data-testid="documents-list" id={id}>
      <PaginatedTable
        columns={columns}
        data={data}
        onRowClick={handleDocumentClick}
        noDataText={labelByKey(`${labelPrefix}no_documents${filterLabelSuffix}`)}
        noDataFoundText={labelByKey(`${labelPrefix}no_documents_found${filterLabelSuffix}`)}
        additionalFilterColumn={'documentReadStatus'}
        additionalFilterValues={[
          { label: 'read', value: 'read' },
          { label: 'unread', value: 'unread' },
        ]}
        filterLabels={[
          { id: 'name', label: labelByKey(`${labelPrefix}search`) },
          { id: 'dateReceived', label: labelByKey(`${labelPrefix}filter`) },
        ]}
        labelPrefix={labelPrefix}
        isLoading={documentsCb.loading}
        paginationData={documentsCb.result?.data ?? savedPaginationData}
        hiddenColumns={['id']}
        mobileFiltersConfig={{ alwaysOnFilters: ['name'], menuFilters: ['dateReceived', 'type'] }}
        downloadHidden={!data?.length}
        downloadLabel={labelByKey('my_doc_download')}
        downloadLoading={documentsDownloadCb.loading}
        downloadDisabled={!selectedRows.length}
        onDownloadClicked={handleDownloadDocuments}
        renderMobileRow={row => {
          const name = row.cells.find(c => c.column.id === 'name')?.value;
          const type = row.cells.find(c => c.column.id === 'type')?.value;
          const dateReceived = row.cells.find(c => c.column.id === 'dateReceived')?.value;

          return (
            <Grid container>
              <Grid item xs={12}>
                <Typography fontWeight="bold" variant="body2">
                  {name}
                </Typography>
              </Grid>
              <Grid item container xs={12} justifyContent="space-between">
                <Grid item>
                  <Typography variant="caption">{type}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="caption">{formatDate(dateReceived, 'MM/dd/yy')}</Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        {...tableProps}
      />
      {clickedDocument && !isMobile && (
        <DocumentViewModal
          open={!!clickedDocument}
          documentId={clickedDocument.id}
          tenant={tenant}
          onClose={handleDocumentClose}
        />
      )}
    </div>
  );

  async function handleDocumentClick(row: Row<TableDocument>) {
    trackButtonClick('view document');
    mixpanelTrackButtonClick({
      Category: 'view document',
    });

    if (isMobile) {
      const documentUrl = await documentOpenCb.execute(row.original.id);
      const url = documentUrl?.url;

      url && openInNewTab(url);
      return;
    }
    setClickedDocument(row.original);
  }

  function handleDocumentClose() {
    if (clickedDocument?.documentReadStatus === 'unread') {
      documentsCb.execute({ ...pageData, ...additionalFilters });
    }

    setClickedDocument(null);
  }

  function handleDownloadDocuments() {
    mixpanelTrackButtonClick({
      Category: 'download document',
    });
    trackButtonClick('download document');
    const ids = selectedRows.map(row => row.original.id);
    if (ids.length === 1) {
      documentDownloadCb.execute(ids[0]);
      return;
    }

    documentsDownloadCb.execute({ ids });
  }
};

function mapDocuments(documents: UserDocument[]): TableDocument[] {
  return documents.map(document => ({
    id: document.id,
    name: document.name,
    dateReceived: new Date(document.dateReceived).toUTCString(),
    type: document.type,
    documentReadStatus: document.isRead ? 'read' : 'unread',
    isBold: !document.isRead,
    isHighlight: document.isRead,
  }));
}
