import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction.dart';

const String _storageKey = 'budgetData';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences missing override');
});

class TransactionsNotifier extends Notifier<List<Transaction>> {
  @override
  List<Transaction> build() {
    return _loadTransactions();
  }

  List<Transaction> _loadTransactions() {
    final prefs = ref.read(sharedPreferencesProvider);
    final saved = prefs.getString(_storageKey);
    
    if (saved != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(saved);
        return jsonList.map((j) => Transaction.fromJson(j)).toList();
      } catch (e) {
        // Fallback on error
      }
    }
    
    // Default mock data
    return defaultTransactionsJson
        .map((e) => Transaction.fromJson(e))
        .toList();
  }

  Future<void> _saveTransactions(List<Transaction> txs) async {
    final prefs = ref.read(sharedPreferencesProvider);
    final String encoded = jsonEncode(txs.map((e) => e.toJson()).toList());
    await prefs.setString(_storageKey, encoded);
  }

  void addTransaction(Transaction tx) {
    state = [...state, tx];
    _saveTransactions(state);
  }

  void removeTransaction(int id) {
    state = state.where((t) => t.id != id).toList();
    _saveTransactions(state);
  }
}

final transactionsProvider = NotifierProvider<TransactionsNotifier, List<Transaction>>(() {
  return TransactionsNotifier();
});

// Computed properties (Derived state)

final quincenaFilterProvider = StateProvider<int?>((ref) => 1);

final filteredTransactionsProvider = Provider<List<Transaction>>((ref) {
  final txs = ref.watch(transactionsProvider);
  final q = ref.watch(quincenaFilterProvider);
  if (q == null) return txs; // null means Dashboard (All)
  return txs.where((t) => t.quincena == q).toList();
});

final currentBalanceProvider = Provider<double>((ref) {
  final txs = ref.watch(filteredTransactionsProvider);
  double income = 0;
  double expenses = 0;
  for (final tx in txs) {
    if (tx.type == 'ingresos') {
      income += tx.amount;
    } else {
      expenses += tx.amount;
    }
  }
  return income - expenses;
});

final globalBalanceProvider = Provider<double>((ref) {
  final txs = ref.watch(transactionsProvider);
  double income = 0;
  double expenses = 0;
  for (final tx in txs) {
    if (tx.type == 'ingresos') {
      income += tx.amount;
    } else {
      expenses += tx.amount;
    }
  }
  return income - expenses;
});

// Provides items grouped by category type
final groupedTransactionsProvider = Provider<Map<String, List<Transaction>>>((ref) {
  final txs = ref.watch(filteredTransactionsProvider);
  final map = {
    'ingresos': <Transaction>[],
    'ahorros': <Transaction>[],
    'bills': <Transaction>[],
    'tdc': <Transaction>[],
  };
  
  for (final tx in txs) {
    if (map.containsKey(tx.type)) {
      map[tx.type]!.add(tx);
    }
  }
  return map;
});
