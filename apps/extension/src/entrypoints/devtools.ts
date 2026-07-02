if (chrome.devtools?.network) {
  chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content) => {
      chrome.runtime.sendMessage({
        type: 'dockstack:capture',
        payload: {
          kind: 'devtools',
          method: request.request.method,
          url: request.request.url,
          status: request.response.status,
          requestHeaders: Object.fromEntries((request.request.headers || []).map((h) => [h.name, h.value ?? ''])),
          responseHeaders: Object.fromEntries((request.response.headers || []).map((h) => [h.name, h.value ?? ''])),
          responseBody: content,
          contentType: request.response.content.mimeType,
          pageUrl: chrome.devtools.inspectedWindow.tabId?.toString() ?? null,
        },
      });
    });
  });
}
