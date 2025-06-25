import { Grid, Typography } from '@mui/material';
import { ResourceItemDisplayType } from '../../../api/content/types/page';
import { config } from '../../../config';
import { ResourceListItemBlock, ResourceListItemProps } from './ResourceListItemBlock';

interface Props {
  id: string;
  header?: string;
  resourceListKey?: string;
  displayType?: ResourceItemDisplayType;
  resources?: ResourceListItemProps[];
}

export const ResourceListBlock: React.FC<Props> = ({ id, resourceListKey, header, resources, displayType }) => (
  <Grid container spacing={6} id={resourceListKey || id}>
    {header && (
      <Grid item xs={12}>
        <Typography component="h2" variant="h2">
          {header}
        </Typography>
      </Grid>
    )}
    <Grid item xs={12} container rowSpacing={isIcon(displayType) ? 4 : 6} columnSpacing={isIcon(displayType) ? 8 : 18}>
      {resources?.map((resource, idx) => (
        <Grid
          item
          xs={12}
          md={isIcon(displayType, resource) ? 6 : isVideo(displayType, resource) ? 12 : 'auto'}
          key={idx}
        >
          <ResourceListItemBlock
            {...resource}
            standaloneSize={displayType || resource.standaloneSize}
            isVideoImage={isVideoUrlValid(resource)}
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

const isIcon = (displayType?: ResourceItemDisplayType, resource?: ResourceListItemProps) =>
  (displayType === 'Icon' || resource?.standaloneSize === 'Icon') && !isImage(displayType, resource);

const isImage = (displayType?: ResourceItemDisplayType, resource?: ResourceListItemProps) =>
  (displayType === 'Image' || resource?.standaloneSize === 'Image') &&
  (resource?.image?.url || isVideoUrlValid(resource));

const isVideo = (displayType?: ResourceItemDisplayType, resource?: ResourceListItemProps) =>
  displayType === 'Video' && isVideoUrlValid(resource);

const isVideoUrlValid = (resource?: ResourceListItemProps) =>
  !!resource?.link && ((config.value.VIDEO_RESOURCES as string) || '').includes(new URL(resource.link).hostname);
