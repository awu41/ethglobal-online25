# Cookie-Based Authentication

## Overview
This application uses cookie-based authentication to persist wallet connections across browser sessions. The cookie expires after 24 hours for security.

## Features

### Automatic Wallet Restoration
- When you visit the app, your previously connected wallet is automatically restored from the cookie
- No need to reconnect every time you visit the site
- The wallet address is remembered for 24 hours

### Cookie Management
- **Set Cookie**: When you connect your MetaMask wallet, the address is saved to a cookie
- **Get Cookie**: On page load, the wallet address is restored from the cookie
- **Remove Cookie**: When you explicitly disconnect, the cookie is removed

### Security
- Cookie expires after 1 day for security
- Uses `secure` flag in production for HTTPS-only cookies
- Uses `sameSite: 'lax'` for CSRF protection

## Cookie Configuration

The cookie is configured with:
```typescript
{
  expires: 1, // 1 day
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' // CSRF protection
}
```

## User Flows

### Connect Wallet
1. User clicks "Connect Wallet"
2. MetaMask popup appears
3. User approves connection
4. Wallet address is saved to cookie with 24-hour expiry

### Disconnect
1. User clicks "Disconnect" button
2. Wallet is disconnected
3. Cookie is removed
4. User must reconnect on next visit

### Account Switch
1. User switches accounts in MetaMask
2. New account is detected
3. Cookie is updated with new address

### Auto-Restore
1. User visits site with valid cookie (< 24 hours old)
2. Wallet address is restored from cookie
3. User is automatically connected (no MetaMask popup)

## Implementation Files

- `src/lib/cookies.ts` - Cookie utility functions
- `src/contexts/YellowContext.tsx` - Integration of cookie management with wallet connection
