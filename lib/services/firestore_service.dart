import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:upi_payment_app/models/transaction.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String _collectionName = 'transactions';

  Future<void> saveTransaction(Transaction transaction) async {
    try {
      await _firestore.collection(_collectionName).add(transaction.toMap());
    } catch (e) {
      print('Error saving transaction: $e');
      throw Exception('Failed to save transaction');
    }
  }

  Stream<List<Transaction>> getTransactions() {
    return _firestore
        .collection(_collectionName)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        return Transaction.fromMap(doc.id, doc.data());
      }).toList();
    });
  }
}