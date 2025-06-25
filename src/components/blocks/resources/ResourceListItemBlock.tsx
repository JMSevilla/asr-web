import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { FileValue } from '../../../api/content/types/common';
import { ResourceItemDisplayType } from '../../../api/content/types/page';
import { externalImageLoader } from '../../../business/images';
import { openInNewTab, openInNewWindow } from '../../../business/navigation';
import { formatResourceExternalLink } from '../../../business/resources';
import { config } from '../../../config';
import { useCachedCmsAsset } from '../../../core/hooks/useCmsAsset';
import { useResolution } from '../../../core/hooks/useResolution';
import { useRouter } from '../../../core/router';
import { FileIcon } from '../../icons';
import { useEmbeddedVideoHeight } from './hooks';

export interface ResourceListItemProps {
  id: string;
  title: string;
  resourceKey?: string;
  isVideoImage?: boolean;
  link?: string;
  image?: FileValue;
  icon?: FileValue;
  document?: FileValue;
  documentType?: 'Factsheet';
  standaloneSize?: ResourceItemDisplayType;
}

export const ResourceListItemBlock: React.FC<ResourceListItemProps> = ({
  id,
  title,
  document,
  link,
  icon,
  isVideoImage,
  resourceKey,
  standaloneSize,
  image,
}) => {
  const { isMobile } = useResolution();
  const router = useRouter();
  const imageSrc = useCachedCmsAsset(image?.url);
  const iconSrc = useCachedCmsAsset(icon?.url);
  const theme = useTheme();
  const [videoRef, videoHeight] = useEmbeddedVideoHeight(standaloneSize === 'Video');

  if (standaloneSize === 'Video' && link) {
    return (
      <Box
        id={resourceKey || id}
        data-testid="resource-video"
        width="100%"
        ref={videoRef}
        bgcolor={theme.palette.common.black}
      >
        <iframe
          width="100%"
          height={videoHeight}
          src={link}
          title={title}
          frameBorder={0}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </Box>
    );
  }

  if (standaloneSize === 'Image' && (imageSrc || isVideoImage)) {
    return (
      <Box
        id={resourceKey || id}
        data-testid="resource-button"
        position="relative"
        sx={{
          cursor: 'pointer',
          transition: 'ease-out .1s all',
          '.resource-image-icon': {
            backgroundColor: theme.palette.appColors.secondary.light,
            transition: 'ease-out .1s all',
          },
          '&:hover': {
            color: theme.palette.appColors.primary,
            '.resource-image-icon': {
              backgroundColor: theme.palette.appColors.primary,
            },
          },
        }}
        onClick={handleClick}
        px={{ xs: 9, md: 6 }}
      >
        {imageSrc ? (
          <Image
            data-testid="resource-image"
            src={imageSrc}
            loader={externalImageLoader}
            width={isMobile ? 270 : 208}
            height={isMobile ? 170 : 130}
            alt={image?.asset?.altText || 'img'}
          />
        ) : (
          <iframe
            data-testid="resource-image"
            width={isMobile ? 270 : 208}
            height={isMobile ? 170 : 130}
            src={link}
            title={title}
            frameBorder={0}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ backgroundColor: theme.palette.common.black }}
          />
        )}
        <Box
          className="resource-image-icon"
          position="absolute"
          top={{ xs: 95, md: 80 }}
          left={{ xs: 0, md: 16 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ xs: 75, md: 50 }}
          width={{ xs: 75, md: 50 }}
          bgcolor={theme.palette.appColors.secondary.light}
        >
          {iconSrc ? (
            <Box
              width={isMobile ? 43 : 18}
              height={isMobile ? 43 : 18}
              sx={{
                mask: `url(${iconSrc}) no-repeat center`,
                maskSize: `${isMobile ? 43 : 18}px ${isMobile ? 43 : 18}px`,
                background: theme.palette.primary.contrastText,
              }}
              aria-label={icon?.asset?.altText}
            />
          ) : (
            <FileIcon
              width={isMobile ? 43 : 18}
              height={isMobile ? 43 : 18}
              color={theme.palette.primary.contrastText}
            />
          )}
        </Box>
        <Typography
          data-testid="resource-title"
          width={isMobile ? 270 : 208}
          variant="body1"
          overflow="hidden"
          textAlign="center"
        >
          {title}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      id={id}
      data-testid="resource-button"
      display="flex"
      gap={4}
      sx={{
        cursor: 'pointer',
        color: theme.palette.appColors.secondary.light,
        transition: 'ease-out .1s all',
        '.resource-icon': {
          backgroundColor: theme.palette.appColors.secondary.light,
          transition: 'ease-out .1s all',
        },
        '&:hover': {
          color: theme.palette.appColors.primary,
          '.resource-icon': {
            backgroundColor: theme.palette.appColors.primary,
          },
        },
      }}
      onClick={handleClick}
    >
      <Box minWidth={24} minHeight={24}>
        {iconSrc ? (
          <Box
            className="resource-icon"
            data-testid="resource-icon"
            width={24}
            height={24}
            sx={{ mask: `url(${iconSrc}) no-repeat center`, maskSize: `24px 24px` }}
            aria-label={icon?.asset?.altText}
          />
        ) : (
          <FileIcon width={24} height={24} color={theme.palette.appColors.secondary.light} />
        )}
      </Box>
      <Typography
        data-testid="resource-title"
        className="resource-label"
        variant="body1"
        overflow="hidden"
        whiteSpace="normal"
        sx={{ textDecoration: 'underline' }}
      >
        {title}
      </Typography>
    </Box>
  );

  function handleClick() {
    if (document?.url) {
      return openInNewWindow(config.value.CMS_URL + document.url);
    }
    if (link) {
      return link.includes('http') ? openInNewTab(formatResourceExternalLink(link)) : router.push(link);
    }
  }
};
