import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'DockStack',
    description: 'DevTools-grade local capture and extraction workspace.',
    version: '0.1.0',
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
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      128: 'icon-128.png'
    },
    action: {
      default_title: 'DockStack',
      default_popup: 'popup.html',
      default_icon: {
        16: 'icon-16.png',
        32: 'icon-32.png'
      }
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
