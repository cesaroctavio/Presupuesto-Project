import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:intl/intl.dart';
import '../models/transaction.dart';
import '../providers/budget_provider.dart';

class TransactionItem extends ConsumerWidget {
  final Transaction transaction;

  const TransactionItem({super.key, required this.transaction});

  IconData _getIcon() {
    switch (transaction.type) {
      case 'ingresos':
        return FontAwesomeIcons.arrowDown;
      case 'ahorros':
        return FontAwesomeIcons.piggyBank;
      case 'bills':
        return FontAwesomeIcons.fileInvoiceDollar;
      case 'tdc':
        return FontAwesomeIcons.creditCard;
      default:
        return FontAwesomeIcons.circle;
    }
  }

  Color _getIconColor() {
    if (transaction.type == 'ingresos') {
      return const Color(0xFF10b981); // Emerald green for income
    }
    return const Color(0xFFef4444); // Red for expenses
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1f2937),
        title: const Text('Eliminar', style: TextStyle(color: Colors.white)),
        content: const Text(
          '¿Estás seguro de eliminar este registro?',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
             onPressed: () => Navigator.of(ctx).pop(),
             child: const Text('Cancelar', style: TextStyle(color: Colors.grey)),
          ),
          TextButton(
             onPressed: () {
               ref.read(transactionsProvider.notifier).removeTransaction(transaction.id);
               Navigator.of(ctx).pop();
             },
             child: const Text('Eliminar', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      )
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'es_MX',
      symbol: '\$',
      decimalDigits: 2,
    );

    return Dismissible(
      key: Key(transaction.id.toString()),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20.0),
        decoration: BoxDecoration(
          color: Colors.redAccent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(FontAwesomeIcons.trash, color: Colors.white),
      ),
      confirmDismiss: (direction) async {
        _confirmDelete(context, ref);
        return false; // we handle the removal ourselves
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6.0),
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: const Color(0x33ffffff), // Glass panel transparent white
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0x1Affffff)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _getIconColor().withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(_getIcon(), color: _getIconColor(), size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                transaction.concept,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text(
              currencyFormatter.format(transaction.amount),
              style: TextStyle(
                color: _getIconColor(),
                fontWeight: FontWeight.w700,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
