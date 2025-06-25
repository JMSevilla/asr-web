export {};

typeof window !== 'undefined' &&
  window.addEventListener('beforeunload', () => {
    window.tabId && window.sessionStorage.setItem('tabId', window.tabId);
    return null;
  });

typeof window !== 'undefined' &&
  window.addEventListener('load', () => {
    const cachedTabId = window.sessionStorage.getItem('tabId');
    if (cachedTabId && cachedTabId !== 'undefined') {
      window.tabId = cachedTabId;
      window.sessionStorage.removeItem('tabId');
      return null;
    }

    window.tabId = Math.floor(Math.random() * 1000000).toString();
    return null;
  });
