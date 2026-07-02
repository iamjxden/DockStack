# Permissions Explanation

This document explains why DockStack requests the browser permissions defined in the extension manifest.

## `storage`

Used for:
- local extension settings
- current session state
- recent capture cache
- consent flags
- UI preferences

## `tabs`

Used for:
- reading active tab context
- associating captures with the currently active browsing context
- supporting tab-aware controls

## `activeTab`

Used for:
- interacting with the current tab once the user opens or activates the extension
- limiting certain operations to the active browsing context

## `scripting`

Used for:
- injecting capture helpers into pages
- running extension-owned scripts that support runtime capture logic

## `debugger`

Requested for future advanced DevTools-grade capture and inspection workflows.

In the current repository, DockStack already has network capture logic and is being positioned for deeper debugging and traffic inspection features. This permission is sensitive and should be clearly explained in any public listing.

## `downloads`

Used for:
- user-triggered export workflows
- download of generated JSON and CSV artifacts

## `nativeMessaging`

Used for:
- connecting the browser extension to the local Rust native core
- moving heavier storage and processing work out of the browser runtime

## `host_permissions: <all_urls>`

DockStack captures application traffic and page behavior across sites selected by the user. This broad host permission is needed because the product is designed as a general-purpose local capture and extraction workspace rather than a single-site utility.

For a public release, this permission should be paired with:
- explicit documentation
- clear onboarding text
- strong consent language for sensitive capture mode
- a privacy policy describing local-first behavior

## Product expectation

DockStack is not a decorative extension. Its permissions reflect a tool intended for advanced developer, analyst, and data-inspection workflows. Because of that, transparency in the store listing is essential.
