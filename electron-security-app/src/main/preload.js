const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID
  }
});
