# UPI Payment App with Firebase Integration

A Flutter application that enables UPI payments through Google Pay, Paytm, and PhonePe with Firebase Firestore integration for transaction storage.

## Features

- **Three Payment Options**: Google Pay, Paytm, and PhonePe
- **UPI Integration**: Seamless UPI payment processing
- **Firebase Firestore**: Transaction data storage
- **Real-time Status**: Payment success, failure, and cancellation handling
- **Clean UI**: Simple white background with intuitive button design

## Requirements

- Flutter SDK (>=3.10.0)
- Android SDK
- Firebase Project
- UPI-enabled payment apps installed on the device

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add an Android app to your Firebase project
3. Use package name: `com.example.upi_payment_app`
4. Download the `google-services.json` file
5. Replace the existing `android/app/google-services.json` with your downloaded file
6. Enable Firestore Database in your Firebase project

### 2. Update Firebase Options

Update the `lib/firebase_options.dart` file with your actual Firebase project credentials:

```dart
static const FirebaseOptions android = FirebaseOptions(
  apiKey: 'your-api-key',
  appId: 'your-app-id',
  messagingSenderId: 'your-sender-id',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
);
```

### 3. Install Dependencies

```bash
flutter pub get
```

### 4. Run the App

```bash
flutter run
```

## App Structure

```
lib/
├── main.dart                 # App entry point
├── firebase_options.dart     # Firebase configuration
├── models/
│   └── transaction.dart      # Transaction data model
├── services/
│   ├── firestore_service.dart # Firestore operations
│   └── upi_service.dart      # UPI payment handling
└── screens/
    └── payment_screen.dart   # Main payment interface
```

## Payment Flow

1. User selects a payment method (Google Pay, Paytm, or PhonePe)
2. App initiates UPI payment of ₹1 to `chavdavirpal37@okaxis`
3. User completes/cancels payment in the selected UPI app
4. App receives payment status and displays appropriate message:
   - ✅ Done (Payment Successful)
   - ❌ Rejected (Payment Failed)
   - ⚠️ Cancelled
5. Transaction details are stored in Firebase Firestore

## Transaction Data Structure

Each transaction stored in Firestore contains:
- `upiApp`: Payment app used (Google Pay/Paytm/PhonePe)
- `amount`: Payment amount (₹1)
- `status`: Success/Failed/Cancelled
- `timestamp`: Transaction date and time

## Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document} {
      allow read, write: if true;
    }
  }
}
```

## Important Notes

- Ensure UPI payment apps are installed on the test device
- The app requires internet connectivity for Firebase operations
- Test payments with small amounts (₹1 as configured)
- The demo Firebase configuration should be replaced with your actual project credentials

## Troubleshooting

1. **UPI App Not Found**: Ensure the target UPI app is installed on the device
2. **Firebase Connection Issues**: Verify `google-services.json` and Firebase configuration
3. **Payment Failures**: Check if the UPI ID is valid and active
4. **Build Issues**: Run `flutter clean` and `flutter pub get`

## Dependencies

- `firebase_core`: Firebase SDK core functionality
- `cloud_firestore`: Firestore database integration
- `upi_india`: UPI payment processing
- `flutter`: Flutter framework

## License

This project is for demonstration purposes. Ensure compliance with payment processing regulations in your region.