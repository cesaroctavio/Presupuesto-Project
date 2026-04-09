import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/budget_provider.dart';
import '../models/transaction.dart';
import '../widgets/transaction_item.dart';

class QuincenaView extends ConsumerWidget {
  const QuincenaView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final grouped = ref.watch(groupedTransactionsProvider);
    
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildCategorySection('Ingresos', grouped['ingresos'] ?? []),
        _buildCategorySection('Ahorros / Inversiones', grouped['ahorros'] ?? []),
        _buildCategorySection('Gastos Fijos (Bills)', grouped['bills'] ?? []),
        _buildCategorySection('TDC y Suscripciones', grouped['tdc'] ?? []),
        const SizedBox(height: 80), // spacer for FAB
      ],
    );
  }

  Widget _buildCategorySection(String title, List<Transaction> items) {
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
            child: Text(
              title,
              style: const TextStyle(
                color: Color(0xFF9ca3af),
                fontSize: 14,
                letterSpacing: 1.2,
                fontWeight: FontWeight.w600,
                shadows: [
                  Shadow(color: Colors.black26, offset: Offset(0, 1), blurRadius: 2),
                ],
              ),
            ),
          ),
          ...items.map((t) => TransactionItem(transaction: t)),
        ],
      ),
    );
  }
}
