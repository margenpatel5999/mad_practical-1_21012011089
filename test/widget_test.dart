import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:upi_payment_app/main.dart';

void main() {
  testWidgets('UPI Payment App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(MyApp());

    // Verify that the payment buttons are present
    expect(find.text('Google Pay'), findsOneWidget);
    expect(find.text('Paytm'), findsOneWidget);
    expect(find.text('PhonePe'), findsOneWidget);

    // Verify the amount display
    expect(find.text('Pay ₹1'), findsOneWidget);
    
    // Verify initial status message
    expect(find.text('Select a payment method'), findsOneWidget);
  });
}