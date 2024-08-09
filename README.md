# Flora mobile app (BLE Integration)

This project is made with React Native and Expo.

### Tech Stack

```
Frontend: Expo, React Native, Typescript
Backend: NodeJS, Typescript
Cloud: AWS S3, EC2, Lambda, GCP App Engine
```

### Installation

```
Download nodejs runtime (https://nodejs.org/en)

```

## Install dependencies

```
yarn
```

## Configuration

The following configuration needs to be configured before running the app

1. Update src/config.js

```
const Config = {
// Woo Blh Admin key
WOO_REST_API_KEY:

// Website Base URL
API_V1_URL:
// Serverless URL
LAMBDA_UPLOAD_IMAGE_URL:

LAMBDA_GET_IMAGE_URL:

LAMBDA_PRIVATE_KEY: 123456,

// Stripe Test keys
STRIPE_TEST_PUBLISHABLE_KEY:

// Backend Endpoint
NODE_API_URL:

// Bluetooth
// Bluetooth UART Service
BLE_SERVICE_UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
BLE_CHARACTERISTIC_TX_UUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
BLE_CHARACTERISTIC_RX_UUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
};

export const firebaseConfig = {
apiKey: '',
authDomain: '',
projectId: '',
storageBucket
messagingSenderId
appId
measurementId
};
```

## Run

Running it on development

```
yarn start
```

## Deploy

see Expo eas build (https://docs.expo.dev/build/introduction/)

options to build

```
"android": "expo run:android",
"build": "expo prebuild",
"build:preview": "eas build --profile preview",
"build:development": "eas build --profile development",
```

Running it on emulator/simulator (some features were not available such as: camera, bluetooth)
