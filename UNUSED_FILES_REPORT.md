# Unused Files and Code Report

This document lists files and code that are not currently being used in the AILifeOS project.

## 1. Unused UI Components

The following UI components exist in `client/src/components/ui/` but are **never imported or used** anywhere in the codebase:

- `accordion.tsx` - Accordion component
- `alert.tsx` - Alert component (Note: `alert-dialog.tsx` is used internally by other components)
- `aspect-ratio.tsx` - Aspect ratio component
- `breadcrumb.tsx` - Breadcrumb navigation component
- `chart.tsx` - Chart component
- `collapsible.tsx` - Collapsible component
- `context-menu.tsx` - Context menu component
- `drawer.tsx` - Drawer component
- `hover-card.tsx` - Hover card component
- `input-otp.tsx` - OTP input component
- `menubar.tsx` - Menubar component
- `navigation-menu.tsx` - Navigation menu component
- `popover.tsx` - Popover component
- `radio-group.tsx` - Radio group component
- `resizable.tsx` - Resizable panels component
- `scroll-area.tsx` - Scroll area component
- `slider.tsx` - Slider component
- `switch.tsx` - Switch component
- `table.tsx` - Table component
- `sidebar.tsx` - Sidebar component (not imported in any pages/components)

**Total: 20 unused UI component files**

## 2. Unused Dependencies in Build Script

The following dependencies are listed in `script/build.ts` allowlist but are **NOT in package.json** (meaning they're not installed):

- `@google/generative-ai` - Google Generative AI SDK
- `axios` - HTTP client
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting middleware
- `jsonwebtoken` - JWT token handling
- `multer` - File upload middleware
- `nodemailer` - Email sending
- `stripe` - Stripe payment processing
- `uuid` - UUID generation (Note: `nanoid` is used instead)
- `xlsx` - Excel file processing

**Total: 10 unused dependencies in build configuration**

## 3. Unused Vite Configuration

- `@assets` alias in `vite.config.ts` (line 26) - Points to `attached_assets` directory but is never imported or used anywhere in the codebase

## 4. Files That Are Used

- `client/public/favicon.png` - Favicon file (referenced in `client/index.html` line 12) - **KEEP THIS FILE**

## Summary

- **20 unused UI component files** that can be safely removed
- **10 unused dependencies** listed in build script that should be removed from allowlist
- **1 unused Vite alias** that can be removed
- **Potential cleanup**: ~31 items total

## Recommendations

1. **Remove unused UI components** if you're not planning to use them in the future
2. **Clean up build.ts** by removing dependencies that aren't in package.json
3. **Remove unused Vite alias** to keep configuration clean
4. **Consider keeping components** if you plan to use them soon, otherwise they add unnecessary bundle size

## Note

Some components like `alert-dialog`, `calendar`, `carousel`, `command`, `form`, `pagination` are used internally by other components, so they should NOT be removed even if not directly imported in pages.

