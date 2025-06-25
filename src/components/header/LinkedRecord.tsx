import { Typography } from '@mui/material';
import { ContentButtonBlock } from '..';
import { MenuItem } from '../../api/content/types/menu';
import { Membership } from '../../api/mdp/types';
import { formatDate } from '../../business/dates';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';

interface Props {
  accountItem?: MenuItem;
  membership: Membership;
}

/**
 * @deprecated This component is not implemented and will be removed as part of ticket MAB-11732
 */
export const LinkedRecord: React.FC<Props> = ({ accountItem, membership }) => {
  const { labelByKey, preloadedLabelByKey } = useGlobalsContext();

  return (
    <>
      <Typography data-testid="linked_record" variant="body2" color="black">
        <span className="visually-hidden">{labelByKey('viewing_record')}</span>
        {`${membership.schemeName} (${preloadedLabelByKey(`member_status:${membership.status}`)}, ${preloadedLabelByKey(
          'linked_record_joined',
        )} ${formatDate(membership.dateJoinedScheme!)})`}
      </Typography>
      <ContentButtonBlock
        type="Link"
        linkFontSize="body2.fontSize"
        link={accountItem?.elements.link.value}
        dialogElement={accountItem?.elements.openDialog}
        text={accountItem?.elements.name.value}
      />
    </>
  );
};
