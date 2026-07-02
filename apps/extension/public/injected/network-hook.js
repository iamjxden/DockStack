(() => {
  const emit = (payload) => {
    window.dispatchEvent(new CustomEvent('dockstack:network', { detail: payload }));
  };

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const [input, init] = args;
    const method = init?.method || 'GET';
    const url = typeof input === 'string' ? input : input?.url;
    const requestHeaders = {};
    if (init?.headers && typeof init.headers.forEach === 'function') {
      init.headers.forEach((v, k) => (requestHeaders[k] = v));
    }
    const response = await originalFetch.apply(this, args);
    const clone = response.clone();
    let body = null;
    try { body = await clone.text(); } catch {}
    const responseHeaders = {};
    try { clone.headers.forEach((v, k) => (responseHeaders[k] = v)); } catch {}
    emit({
      kind: 'fetch',
      method,
      url,
      status: response.status,
      requestHeaders,
      responseHeaders,
      requestBody: typeof init?.body === 'string' ? init.body : null,
      responseBody: body,
      contentType: response.headers.get('content-type'),
      pageUrl: location.href,
    });
    return response;
  };

  const OriginalXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OriginalXHR();
    let method = 'GET';
    let url = '';
    let requestBody = null;
    const requestHeaders = {};
    const open = xhr.open;
    xhr.open = function (m, u, ...rest) {
      method = m;
      url = u;
      return open.call(this, m, u, ...rest);
    };
    const setRequestHeader = xhr.setRequestHeader;
    xhr.setRequestHeader = function (k, v) {
      requestHeaders[k] = v;
      return setRequestHeader.call(this, k, v);
    };
    const send = xhr.send;
    xhr.send = function (body) {
      requestBody = typeof body === 'string' ? body : null;
      this.addEventListener('loadend', () => {
        const headersRaw = xhr.getAllResponseHeaders().trim().split(/\r?\n/).filter(Boolean);
        const responseHeaders = Object.fromEntries(headersRaw.map((line) => {
          const index = line.indexOf(':');
          return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
        }));
        emit({
          kind: 'xhr',
          method,
          url,
          status: xhr.status,
          requestHeaders,
          responseHeaders,
          requestBody,
          responseBody: xhr.responseType === '' || xhr.responseType === 'text' ? xhr.responseText : null,
          contentType: xhr.getResponseHeader('content-type'),
          pageUrl: location.href,
        });
      });
      return send.call(this, body);
    };
    return xhr;
  }
  window.XMLHttpRequest = PatchedXHR;
})();
