import { config } from '../config';

export function getHrefLink(link = '') {
  return link.startsWith('mailto:') || link.startsWith('tel:') ? link : '';
}

export function isEpaLink(link: string): boolean {
  return link.includes(config.value.EPA_DOMAIN_NAME);
}
