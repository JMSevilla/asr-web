import { AxiosResponse } from 'axios';

export const areFilesSame = (file1: File, file2: File) => file1.name === file2.name;

export const formatBytes = (bytes: number, unitIndex: number = 0): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes < 1000 || unitIndex === units.length - 1) {
    const roundedSize = bytes.toFixed(0);
    return `${roundedSize} ${units[unitIndex]}`;
  }
  return formatBytes(bytes / 1000, unitIndex + 1);
};

export const fileNameFromResponse = (response: AxiosResponse) => {
  const contentDisposition = response.headers['content-disposition'];
  if (!contentDisposition) {
    return;
  }

  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
  if (matches && matches[1]) {
    return decodeURIComponent(matches[1].replace(/['"]/g, '').replace("UTF-8''", ''));
  }
};

export const formatTagKey = (tag: string): string => tag.replace(/,/g, '_');

export const splitCombinedTags = (tags: string[]) => {
  return tags.flatMap(tag =>
    tag.includes(',')
      ? tag.split(',').map(t => t.trim())
      : tag
  );
};

/**
 * Reconstructs combined tags from the validTagsList by matching them with the fileTags.
 * If all individual tags in a combined tag (comma-separated) exist in fileTags, the combined tag is retained.
 * 
 * @param {string[]} validTagsList - Array of original tags, which may include combined tags (e.g., "LTAFR,ROLFR").
 * @param {string[]} fileTags - Array of individual tags returned by the API (e.g., ["ROLFR", "LTAFR", "FORM1"]).
 * @returns {string[]} - Filtered array of combined tags that match the tags from fileTags.
 * 
 * @example
 * Input: 
 *   validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"]
 *   fileTags = ["ROLFR", "LTAFR", "FORM1"]
 * Output: 
 *   ["LTAFR,ROLFR", "FORM1"]
 */
export function reconstructCombinedTags(validTagsList: string[], fileTags: string[]): string[] {
  const fileTagsSet = new Set(fileTags.map(tag => tag.toLowerCase()));
  return validTagsList.filter(tagItem => {
    const tagList = tagItem.includes(',')
      ? tagItem.split(',').map(t => t.trim().toLowerCase())
      : [tagItem.toLowerCase()];
    return tagList.every(tag => fileTagsSet.has(tag));
  });
}
