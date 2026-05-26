// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    name: 'polyglots-2.0',
    slug: 'polyglots-2.0',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
        image: './src/assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.anonymous.polyglots2.x0',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './src/assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        package: 'com.anonymous.polyglots2.x0',
    },
    web: {
        favicon: './src/assets/favicon.png',
        bundler: 'metro',
    },
    extra: {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51Rj2ssQBfizA0EoyaPmEikewvzV1n1JtfYNJYUUyQARiwXe5doEc0VWK5FO9igXCHcsGizylug1yisl2eKhvRMBq00VT5ogQ99',
        API_URL: process.env.API_URL || 'http://localhost:8000/api',
        API_BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJWRkUwY0tsVmpubGwxZXVOVXJZeFpDN1NqazBkR2xvUyIsImFsZ29yaXRobSI6IkhTMjU2IiwiZXhwaXJlc0luIjoiMWgiLCJpYXQiOjE3NDkwOTM2MTB9.bSOS8-FTv2P3xjEZ5dswVisy3ZJN6Dgc_lWatplhsZU',
    },
});
