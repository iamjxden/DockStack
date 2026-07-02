import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/injected/network-hook.js');
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    window.addEventListener('dockstack:network', (event: Event) => {
      const detail = (event as CustomEvent).detail;
      chrome.runtime.sendMessage({ type: 'dockstack:capture', payload: detail });
    });
  },
});
