import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:upi_payment_app/screens/payment_screen.dart';
import 'package:upi_payment_app/firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UPI Payment App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: PaymentScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}