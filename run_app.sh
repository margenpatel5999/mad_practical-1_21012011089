#!/bin/bash

echo "🚀 Starting UPI Payment App Setup..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    echo "Visit: https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo "✅ Flutter found"

# Get dependencies
echo "📦 Getting dependencies..."
flutter pub get

# Check for connected devices
echo "📱 Checking for connected devices..."
flutter devices

echo ""
echo "🔥 Setup complete! To run the app:"
echo "1. Connect an Android device or start an emulator"
echo "2. Run: flutter run"
echo ""
echo "📋 Remember to:"
echo "- Replace google-services.json with your Firebase project file"
echo "- Update firebase_options.dart with your project credentials"
echo "- Install UPI apps (Google Pay, Paytm, PhonePe) on your test device"
echo ""
echo "💳 The app will initiate ₹1 payments to: chavdavirpal37@okaxis"