import { isTrue } from '../business/boolean';
import { SingleAuthData } from '../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { getItem } from '../core/session-storage';
import { getUserBrowser, getUserPlatform } from './system';

export const sanitizeWordingFlag = (flag: string) => {
  return flag.replace(/[^a-zA-Z0-9 _:]/g, '');
};

export const contentAccessKeyWithCustomWordingFlags = (contentAccessKey: string) => {
  if (typeof window === 'undefined') {
    return contentAccessKey;
  }

  const metadataFlags = metadataWordingFlags();
  const saData = getItem<SingleAuthData>('singleAuthData');
  const hasMultipleRecords = isTrue(saData?.hasMultipleRecords) && !contentAccessKey.includes('HASLINKEDMEMBER');
  return objectWithAppendedWordingFlags(
    contentAccessKey,
    hasMultipleRecords ? [...metadataFlags, 'HASLINKEDMEMBER'] : metadataFlags,
  );
};

export const objectWithAppendedWordingFlags = (object: string, flags: string[]) => {
  const sanitizedFlags = flags.map(sanitizeWordingFlag).filter(Boolean);
  const accessKeyObject = JSON.parse(object);

  if (accessKeyObject.wordingFlags?.length) {
    return JSON.stringify({
      ...accessKeyObject,
      wordingFlags: [...accessKeyObject.wordingFlags, ...sanitizedFlags],
    });
  }
  return JSON.stringify({ ...accessKeyObject, wordingFlags: [...sanitizedFlags] });
};

const metadataWordingFlags = (): string[] => {
  const browser = getUserBrowser();
  const platform = getUserPlatform();

  return [`browser:${browser}`, `platform:${platform}`];
};
