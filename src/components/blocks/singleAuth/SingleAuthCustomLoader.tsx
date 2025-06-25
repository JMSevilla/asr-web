import { findValueByKey } from '../../../business/find-in-array';
import { parseCmsParams } from '../../../cms/parse-cms';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { DialogBox } from '../../DialogBox';
import { ComponentLoader } from '../../loaders';
import { findBlockByKey } from '../sso/utils';

/**
 * @description
 * Displays a custom dialog box loader for the single auth holding page, rendered as a child of ThemeProvider to ensure consistent styling.
 */
export const SingleAuthCustomLoader: React.FC = () => {
  const contentData = useContentDataContext();

  const contents = contentData.page?.content.values || [];
  const registerHoldingBLock = findBlockByKey(contents, 'register_holding_form');
  const signInHoldingBlock = findBlockByKey(contents, 'sign_in_holding_form');
  const { isSingleAuth, loading } = useAuthContext();
  const holdingBlock = registerHoldingBLock || signInHoldingBlock;

  const getPageParams = (block: any) => {
    const parameters = parseCmsParams(block.elements.parameters!.values);
    return {
      dialog_title: findValueByKey('dialog_title', parameters) || '',
    };
  };

  if (!isSingleAuth || !loading || !holdingBlock) {
    return null;
  }

  const params = getPageParams(holdingBlock);

  if (!params.dialog_title) {
    return null;
  }

  return (
    <DialogBox open={true} handleClose={() => {}} loading={true} header={params.dialog_title} hideCloseButton={true}>
      <ComponentLoader disableMarginBottom />
    </DialogBox>
  );
};
