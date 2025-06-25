import { logger } from '../core/datadog-logs';

export type ContentAccessKey = Partial<{
  currentAge: string;
  dbCalculationStatus: string;
  dcLifeStage: string;
  hasAdditionalContributions: boolean;
  hasProtectedQuote: boolean;
  isCalculationSuccessful: boolean;
  isWebChatEnabled: boolean;
  lifeStage: string;
  memberStatus: string;
  numberOfProtectedQuotes: number;
  retirementApplicationStatus: string;
  schemeType: string;
  tenantUrl: string;
  transferApplicationStatus: string;
  wordingFlags: string[];
}>;

export function parseContentAccessKey(raw: string | undefined): ContentAccessKey | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as ContentAccessKey;
  } catch (error) {
    logger.error('Error parsing content access key:', error as any);
    return undefined;
  }
}

export const doesAccessKeyHaveWordingFlag = (raw: string | undefined, flag: string): boolean => {
  const accessKey = parseContentAccessKey(raw);
  return !!accessKey?.wordingFlags?.includes(flag);
};
