import { useState } from 'react';
import { useApi } from './useApi';
import { useSessionStorage } from './useSessionStorage';

export const useCmsAsset = (url: string = '') => {
  const [src, setSrc] = useState<string>();

  useApi(
    async api => {
      if (!url) return;
      const result = await api.content.imageResource(url);
      if (!result?.data) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string), { once: true });
      const mime = url.slice(url.lastIndexOf('.') + 1);
      reader.readAsDataURL(new Blob([result.data], { type: types[mime] }));
    },
    [url],
  );

  return src;
};

export const useCachedCmsAsset = (url: string = '') => {
  const [cachedAsset, setCachedAsset] = useSessionStorage<{ url: string; src: string } | undefined>(url, undefined);
  const [src, setSrc] = useState(cachedAsset?.src);

  useApi(async api => {
    if (!url || cachedAsset?.url === url) {
      return;
    }
    const result = await api.content.imageResource(url);
    if (!result?.data) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => saveAsset(reader.result as string), { once: true });
    const mime = url.slice(url.lastIndexOf('.') + 1);
    reader.readAsDataURL(new Blob([result.data], { type: types[mime] }));
  });

  return src;

  function saveAsset(state: string) {
    setCachedAsset({ url, src: state });
    setSrc(state);
  }
};

interface MediaType {
  readonly [index: string]: string;
}

const types: MediaType = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
};
