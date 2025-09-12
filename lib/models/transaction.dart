import 'package:cloud_firestore/cloud_firestore.dart';

class Transaction {
  final String id;
  final String upiApp;
  final double amount;
  final String status;
  final DateTime timestamp;

  Transaction({
    required this.id,
    required this.upiApp,
    required this.amount,
    required this.status,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() {
    return {
      'upiApp': upiApp,
      'amount': amount,
      'status': status,
      'timestamp': Timestamp.fromDate(timestamp),
    };
  }

  factory Transaction.fromMap(String id, Map<String, dynamic> map) {
    return Transaction(
      id: id,
      upiApp: map['upiApp'] ?? '',
      amount: (map['amount'] ?? 0.0).toDouble(),
      status: map['status'] ?? '',
      timestamp: (map['timestamp'] as Timestamp).toDate(),
    );
  }
}