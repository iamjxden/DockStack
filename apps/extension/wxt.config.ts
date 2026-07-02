import { defineConfig } from 'wxt';
import react from '@wxt-dev/module-react';

export default defineConfig({
  modules: [react()],
  manifest: {
    name: 'DockStack',
    description: 'DevTools-grade local capture and extraction workspace.',
    version: '0.1.0',
    manifest_version: 3,
    permissions: [
      'storage',
      'tabs',
      'activeTab',
      'scripting',
      'debugger',
      'downloads',
      'nativeMessaging'
    ],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'DockStack',
      default_popup: 'popup.html'
    },
    options_page: 'options.html',
    web_accessible_resources: [
      {
        resources: ['injected/network-hook.js'],
        matches: ['<all_urls>']
      }
    ]
  }
});
