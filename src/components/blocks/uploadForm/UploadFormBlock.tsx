import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { isTrue } from '../../../business/boolean';
import { arraysAreEqual, findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useBeforeUnload } from '../../../core/hooks/useBeforeUnload';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useModal } from '../../../core/hooks/useModal';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { FileWithTags } from '../../form';
import { TagsForm } from './form/TagsForm';
import { UploadForm } from './form/UploadForm';
import { UploadFormType } from './form/validation';
import { useLoadedFiles } from './hooks/useLoadedFiles';

interface Props {
  id: string;
  pageKey: string;
  isStandAlone?: boolean;
  panelList?: PanelListItem[];
  journeyType?: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const UploadFormBlock: React.FC<Props> = ({ id, pageKey, isStandAlone, panelList, parameters, journeyType }) => {
  const [submitting, setSubmitting] = useState(false);
  const [fileEdited, setFileEdited] = useState(false);
  const [fileDeleted, setFileDeleted] = useState(false);
  const { panelByKey } = usePanelBlock(panelList);
  const { dialogByKey } = useGlobalsContext();
  const dialog = useDialogContext();
  const router = useRouter();
  const key = findValueByKey('key', parameters) ?? '';
  const formJourneyType = findValueByKey('journey_type', parameters) as JourneyTypeSelection;
  const maxFilesCount = findValueByKey('max_files', parameters);
  const maxFileSize = findValueByKey('max_file_size', parameters);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const fileType = findValueByKey('file_type', parameters)?.split(';').filter(Boolean);
  const mandatoryTags = findValueByKey('mandatory_forms', parameters)?.split(';').filter(Boolean) ?? [];
  const optionalTags = findValueByKey('optional_forms', parameters)?.split(';').filter(Boolean) ?? [];
  const allTags = [...mandatoryTags, ...optionalTags];
  const shouldDeleteAndSaveDocuments = isTrue(findValueByKey('delete_all_files', parameters));
  const shouldHideTagsColumn = isTrue(findValueByKey('hide_forms_column', parameters));
  const documentType = findValueByKey('document_type', parameters) ?? undefined;
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const submitTransferDocuments = useApiCallback(api => api.mdp.submitTransferJourneyDocuments());
  const submitRetirementDocuments = useApiCallback(api => api.mdp.retirementJourneyPostDocumentsSubmission());
  const tagsModal = useModal();
  const files = useLoadedFiles(formJourneyType, allTags, documentType);
  const prefix = [id, key].join('_');
  const panel1 = panelByKey(`${prefix}_panel_1`),
    panel2 = panelByKey(`${prefix}_panel_2`);
  const beforeCloseModal = dialogByKey(`${prefix}_before_close_modal`);
  const { continueRoute } = useBeforeUnload(
    !submitting && !journeyType && !!files.list.length && !!beforeCloseModal,
    openUnsavedFilesWarningDialog,
  );

  const onlySingleTagRequested = allTags.length === 1;
  const isAddtlDocUpload = findValueByKey('addl_doc_upload', parameters);

  useEffect(() => {
    if (shouldDeleteAndSaveDocuments) {
      files.removeAll();
    }
  }, [shouldDeleteAndSaveDocuments]);

  return (
    <Grid container spacing={12} id={id} data-testid="upload-form-block">
      {!onlySingleTagRequested && (
        <Grid item xs={12}>
          <TagsForm
            prefix={prefix}
            initialTags={files.fileToTag?.tags}
            mandatoryTags={mandatoryTags}
            optionalTags={optionalTags}
            modalProps={tagsModal.props}
            isTagUploaded={files.isTagUploaded}
            onSave={handleModalSave}
            onClose={handleModalClose}
          />
        </Grid>
      )}
      {panel1 && (
        <Grid item xs={12} data-testid="upload-form-block-panel-1">
          {panel1}
        </Grid>
      )}
      {!files.loadingUploadedFiles && (
        <Grid item xs={12} lg={isStandAlone ? 6 : 12}>
          <UploadForm
            prefix={prefix}
            defaultValues={{ files: files.list.map(item => item.content) }}
            maxFilesCount={parseParamNumber(maxFilesCount)}
            maxFileSize={parseParamNumber(maxFileSize)}
            fileType={fileType}
            onSubmit={handleSubmit}
            loading={router.loading || router.parsing || submitStepCb.loading}
            uploading={files.uploading}
            removing={files.removing}
            uploadErrors={files.uploadErrors.map(swapGenericErrorCodesToCustom(prefix))}
            onFileAdded={handleFileAdd}
            onFileEdit={handleFileEdit()}
            onFileRemove={handleFileRemove}
            uploadedFiles={files.list.filter(({ uuid }) => !!uuid)}
            tagsColumnHidden={shouldHideTagsColumn}
            panelElement={panel2}
            submitEnabled={isAddtlDocUpload ? !!files.list?.length : mandatoryTags.every(files.isTagUploaded)}
            fileUploaded={files.fileUploaded}
            clearInfoMessages={clearInfoMessages}
            fileEdited={fileEdited}
            fileDeleted={fileDeleted}
          />
        </Grid>
      )}
    </Grid>
  );

  async function handleModalSave(tags: string[]) {
    if (!files.fileToTag) {
      return;
    }
    if (files.fileToTag.uuid) {
      if (!fileEdited && !arraysAreEqual(tags, files.fileToTag.tags)) {
        setFileEdited(true);
      }
      await files.updateTags(tags);
      tagsModal.close();
      return;
    }
    await files.startUpload(files.fileToTag.content, tags);
    tagsModal.close();
  }

  function clearInfoMessages() {
    if (fileEdited) {
      setFileEdited(false);
    }
    if (fileDeleted) {
      setFileDeleted(false);
    }
    if (files.fileUploaded) {
      files.resetFileUploadState();
    }
  }

  function handleModalClose() {
    tagsModal.close();
    clearInfoMessages();
    files.resetUploadErrors();
  }

  function handleFileEdit() {
    if (onlySingleTagRequested) {
      return undefined;
    }

    return (taggedFile: FileWithTags) => {
      clearInfoMessages();
      files.editTags(taggedFile);
      tagsModal.open();
    };
  }

  function handleFileRemove(file: File) {
    clearInfoMessages();
    setFileDeleted(true);
    files.remove(file);
  }

  async function handleFileAdd(file: File) {
    if (onlySingleTagRequested) {
      await files.startUpload(file, allTags);
      return;
    }
    clearInfoMessages();
    files.prepareUpload(file);
    tagsModal.open();
  }

  async function handleSubmit(_values: UploadFormType) {
    setSubmitting(true);
    clearInfoMessages();

    if (shouldDeleteAndSaveDocuments) {
      await (journeyType === 'retirement' ? submitRetirementDocuments : submitTransferDocuments).execute();
    }

    if (journeyType) {
      await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    }

    await journeyNavigation?.goNext();
    setSubmitting(false);
  }

  function openUnsavedFilesWarningDialog() {
    if (beforeCloseModal) {
      dialog.openDialog({ ...beforeCloseModal, customOnClick: continueRoute });
    }
  }
};

const parseParamNumber = (param?: string) => (param ? +param : undefined);
const swapGenericErrorCodesToCustom = (prefix: string) => (code: string) =>
  code === 'something_went_wrong' ? `${prefix}_undefined_error` : code;
