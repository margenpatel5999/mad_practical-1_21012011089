import 'package:flutter/material.dart';
import 'package:upi_india/upi_india.dart';
import 'package:upi_payment_app/models/transaction.dart';
import 'package:upi_payment_app/services/firestore_service.dart';
import 'package:upi_payment_app/services/upi_service.dart';

class PaymentScreen extends StatefulWidget {
  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final UpiService _upiService = UpiService();
  final FirestoreService _firestoreService = FirestoreService();
  
  String _statusMessage = '';
  bool _isLoading = false;

  final String _receiverUpiId = 'chavdavirpal37@okaxis';
  final String _receiverName = 'Virpal Chavda';
  final double _amount = 1.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'UPI Payment App',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Pay ₹${_amount.toInt()}',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            SizedBox(height: 10),
            Text(
              'to $_receiverUpiId',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 50),
            
            // Google Pay Button
            _buildPaymentButton(
              'Google Pay',
              Colors.blue,
              Icons.account_balance_wallet,
              () => _initiatePayment('googlepay'),
            ),
            SizedBox(height: 20),
            
            // Paytm Button
            _buildPaymentButton(
              'Paytm',
              Colors.indigo,
              Icons.payment,
              () => _initiatePayment('paytm'),
            ),
            SizedBox(height: 20),
            
            // PhonePe Button
            _buildPaymentButton(
              'PhonePe',
              Colors.purple,
              Icons.phone_android,
              () => _initiatePayment('phonepe'),
            ),
            
            SizedBox(height: 50),
            
            // Status Message
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: _isLoading
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        SizedBox(width: 12),
                        Text(
                          'Processing payment...',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black87,
                          ),
                        ),
                      ],
                    )
                  : Text(
                      _statusMessage.isEmpty ? 'Select a payment method' : _statusMessage,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.black87,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentButton(
    String title,
    Color color,
    IconData icon,
    VoidCallback onPressed,
  ) {
    return ElevatedButton(
      onPressed: _isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 2,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 24),
          SizedBox(width: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _initiatePayment(String appName) async {
    setState(() {
      _isLoading = true;
      _statusMessage = '';
    });

    try {
      final String transactionRefId = 'TXN${DateTime.now().millisecondsSinceEpoch}';
      
      final UpiResponse response = await _upiService.initiateTransaction(
        app: appName,
        receiverUpiId: _receiverUpiId,
        receiverName: _receiverName,
        transactionRefId: transactionRefId,
        amount: _amount,
        transactionNote: 'Test Payment',
      );

      String status;
      String message;
      
      switch (response.status) {
        case UpiPaymentStatus.SUCCESS:
          status = 'Success';
          message = '✅ Done (Payment Successful)';
          break;
        case UpiPaymentStatus.FAILURE:
          status = 'Failed';
          message = '❌ Rejected (Payment Failed)';
          break;
        case UpiPaymentStatus.SUBMITTED:
          status = 'Success';
          message = '✅ Done (Payment Successful)';
          break;
        default:
          status = 'Cancelled';
          message = '⚠️ Cancelled';
      }

      // Save transaction to Firestore
      final transaction = Transaction(
        id: transactionRefId,
        upiApp: _getAppDisplayName(appName),
        amount: _amount,
        status: status,
        timestamp: DateTime.now(),
      );

      await _firestoreService.saveTransaction(transaction);

      setState(() {
        _statusMessage = message;
        _isLoading = false;
      });

    } catch (e) {
      print('Payment error: $e');
      
      // Save failed transaction to Firestore
      final transaction = Transaction(
        id: 'TXN${DateTime.now().millisecondsSinceEpoch}',
        upiApp: _getAppDisplayName(appName),
        amount: _amount,
        status: 'Failed',
        timestamp: DateTime.now(),
      );

      try {
        await _firestoreService.saveTransaction(transaction);
      } catch (firestoreError) {
        print('Firestore error: $firestoreError');
      }

      setState(() {
        _statusMessage = '❌ Rejected (Payment Failed)';
        _isLoading = false;
      });
    }
  }

  String _getAppDisplayName(String appName) {
    switch (appName.toLowerCase()) {
      case 'googlepay':
        return 'Google Pay';
      case 'paytm':
        return 'Paytm';
      case 'phonepe':
        return 'PhonePe';
      default:
        return appName;
    }
  }
}