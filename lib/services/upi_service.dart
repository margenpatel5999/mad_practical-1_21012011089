import 'package:upi_india/upi_india.dart';

class UpiService {
  final UpiIndia _upiIndia = UpiIndia();

  Future<List<UpiApp>> getAvailableUpiApps() async {
    try {
      return await _upiIndia.getAllUpiApps(mandatoryTransactionId: false);
    } catch (e) {
      print('Error getting UPI apps: $e');
      return [];
    }
  }

  Future<UpiResponse> initiateTransaction({
    required String app,
    required String receiverUpiId,
    required String receiverName,
    required String transactionRefId,
    required double amount,
    String? transactionNote,
  }) async {
    try {
      final UpiApp? upiApp = await _getUpiApp(app);
      if (upiApp == null) {
        return UpiResponse(
          status: UpiPaymentStatus.FAILURE,
          error: 'UPI app not found',
        );
      }

      return await _upiIndia.startTransaction(
        app: upiApp,
        receiverUpiId: receiverUpiId,
        receiverName: receiverName,
        transactionRefId: transactionRefId,
        transactionNote: transactionNote ?? 'Payment',
        amount: amount,
      );
    } catch (e) {
      print('Error initiating transaction: $e');
      return UpiResponse(
        status: UpiPaymentStatus.FAILURE,
        error: e.toString(),
      );
    }
  }

  Future<UpiApp?> _getUpiApp(String appName) async {
    final apps = await getAvailableUpiApps();
    try {
      return apps.firstWhere(
        (app) => app.name.toLowerCase().contains(appName.toLowerCase()),
      );
    } catch (e) {
      return null;
    }
  }
}