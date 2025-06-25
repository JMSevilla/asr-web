import { AxiosInstance, AxiosResponse } from 'axios';
import qs from 'query-string';
import { contentAccessKeyWithCustomWordingFlags } from '../../business/wording-flags';
import { config } from '../../config';
import { ChatBotOptionResponse } from './types/chatbot';
import { ContentFunds } from './types/funds';
import { CmsGlobals } from './types/globals';
import { MenuItem } from './types/menu';
import { CmsPageResponse, PageFeedWidgets } from './types/page';
import { RetirementOptionSummary, RetirementOptionsList } from './types/retirement';
import { CmsFooter } from './types/tenant';

const cachedUrlRequests: { [key: string]: Promise<AxiosResponse<{ url: string }, any>> | undefined } = {};

export class ContentApi {
  constructor(private readonly axios: AxiosInstance) {}

  public async urlFromKey(key: string): Promise<AxiosResponse<{ url: string }, any>> {
    if (cachedUrlRequests[key]) {
      const result = (await cachedUrlRequests[key]) as AxiosResponse<{ url: string }, any>;
      result.status !== 200 && delete cachedUrlRequests[key];
      return result;
    }

    const fetchUrlPromise = this.axios.get<{ url: string }>(`/content-api/api/v2/content/url?${qs.stringify({ key })}`);
    cachedUrlRequests[key] = fetchUrlPromise;
    return await fetchUrlPromise;
  }

  public async page(slug: string, tenantUrl: string, contentAccessKey?: string) {
    if (slug.includes(config.value.MATOMO_JS_TRACKER_URL) || slug.includes(config.value.MATOMO_PHP_TRACKER_URL)) {
      return { data: null };
    }

    try {
      return await this.axios.get<CmsPageResponse>(
        contentAccessKey
          ? `/content-api/api/v2/content/authorized-page?${qs.stringify({
              pageUrl: slug,
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`
          : `/content-api/api/v2/content/unauthorized-page?${qs.stringify({ pageUrl: slug, tenantUrl })}`,
        { headers: { ENV: config.value.ENVIRONMENT } },
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async globals(tenantUrl: string, contentAccessKey?: string) {
    try {
      return await this.axios.get<CmsGlobals>(
        contentAccessKey
          ? `/content-api/api/v2/content/authorized-globals?${qs.stringify({
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`
          : `/content-api/api/v2/content/unauthorized-globals?${qs.stringify({ tenantUrl })}`,
        { headers: { ENV: config.value.ENVIRONMENT } },
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async footer(tenantUrl: string, contentAccessKey?: string) {
    try {
      return await this.axios.get<CmsFooter>(
        contentAccessKey
          ? `/content-api/api/v2/content/authorized-footer?${qs.stringify({
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`
          : `/content-api/api/v2/content/unauthorized-footer?${qs.stringify({ tenantUrl })}`,
        { headers: { ENV: config.value.ENVIRONMENT } },
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async menu(tenantUrl: string, contentAccessKey?: string) {
    try {
      return await this.axios.get<MenuItem[]>(
        contentAccessKey
          ? `/content-api/api/v2/content/authorized-menu?${qs.stringify({
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`
          : `/content-api/api/v2/content/unauthorized-menu?${qs.stringify({ tenantUrl })}`,
        { headers: { ENV: config.value.ENVIRONMENT } },
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: [] };
      }
      throw err;
    }
  }

  public async retirementOptionList(contentAccessKey?: string, selectedQuoteName?: string) {
    try {
      return contentAccessKey
        ? await this.axios.get<RetirementOptionsList>(
            `/content-api/api/v2/content/authorized-option-list?${qs.stringify({
              selectedQuoteName,
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`,
            { headers: { ENV: config.value.ENVIRONMENT } },
          )
        : { data: null };
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async retirementOptionSummary(key: string, contentAccessKey?: string) {
    try {
      return contentAccessKey
        ? await this.axios.get<RetirementOptionSummary>(
            `/content-api/api/v2/content/authorized-option-summary?${qs.stringify({
              key,
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`,
            { headers: { ENV: config.value.ENVIRONMENT } },
          )
        : { data: null };
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async imageResource(cmsRelativeUrl: string) {
    try {
      return cmsRelativeUrl
        ? await this.axios.get<Blob>(`/content-api/api/v2/content/image-resouce?${qs.stringify({ cmsRelativeUrl })}`, {
            headers: { ENV: config.value.ENVIRONMENT },
            responseType: 'blob',
          })
        : { data: null };
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    }
  }

  public async pageFeedWidgets(tenantUrl: string, pageUrls?: string[]) {
    try {
      return await this.axios.get<PageFeedWidgets>(
        `/content-api/api/v2/content/unauthorized-page-feed-widgets?${qs.stringify({ tenantUrl, pageUrls })}`,
        { headers: { ENV: config.value.ENVIRONMENT } },
      );
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { data: { widgets: [] } };
      }
      throw err;
    }
  }

  public async authorizedQuestionNodes(optionKey?: string, contentAccessKey?: string) {
    try {
      return contentAccessKey
        ? await this.axios.get<ChatBotOptionResponse>(
            `/content-api/api/v2/content/authorized-question-nodes?${qs.stringify({
              optionKey,
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`,
            { headers: { ENV: config.value.ENVIRONMENT } },
          )
        : { data: null };
    } catch (err: any) {
      throw err;
    }
  }

  public async authorizedFunds(contentAccessKey?: string) {
    try {
      return contentAccessKey
        ? await this.axios.get<ContentFunds>(
            `/content-api/api/v2/content/authorized-funds?${qs.stringify({
              contentAccessKey: contentAccessKeyWithCustomWordingFlags(contentAccessKey),
            })}`,
            { headers: { ENV: config.value.ENVIRONMENT } },
          )
        : { data: null };
    } catch (err: any) {
      throw err;
    }
  }
}
