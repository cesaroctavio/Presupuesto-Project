import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/budget_provider.dart';

class DashboardView extends ConsumerWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final txs = ref.watch(transactionsProvider);
    final globalBalance = ref.watch(globalBalanceProvider);

    double totalIncome = 0;
    double savings = 0;
    double bills = 0;
    double tdc = 0;

    for (var tx in txs) {
      switch (tx.type) {
        case 'ingresos': totalIncome += tx.amount; break;
        case 'ahorros': savings += tx.amount; break;
        case 'bills': bills += tx.amount; break;
        case 'tdc': tdc += tx.amount; break;
      }
    }

    final currencyFormatter = NumberFormat.currency(locale: 'es_MX', symbol: '\$');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Resumen Mensual',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          
          _buildSummaryCard('Balance Neto', globalBalance, currencyFormatter, isMain: true),
          const SizedBox(height: 16),
          
          Row(
            children: [
              Expanded(child: _buildSummaryCard('Ingresos Tot.', totalIncome, currencyFormatter)),
              const SizedBox(width: 12),
              Expanded(child: _buildSummaryCard('Gastos Tot.', savings + bills + tdc, currencyFormatter)),
            ],
          ),
          const SizedBox(height: 32),
          
          const Text(
            'Distribución de Ingresos',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          
          _buildProgressRow('Ahorros / Inversión', savings, totalIncome, const Color(0xFF6366f1)),
          _buildProgressRow('Bills (Fijos)', bills, totalIncome, const Color(0xFFef4444)),
          _buildProgressRow('TDC / Subs', tdc, totalIncome, const Color(0xFFf59e0b)),

          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String title, double amount, NumberFormat formatter, {bool isMain = false}) {
    Color valColor = amount >= 0 ? const Color(0xFF10b981) : const Color(0xFFef4444);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0x33ffffff),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x1Affffff)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Color(0xFF9ca3af), fontSize: 14)),
          const SizedBox(height: 8),
          Text(
            formatter.format(amount),
            style: TextStyle(
              color: isMain ? valColor : Colors.white,
              fontSize: isMain ? 32 : 20,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressRow(String title, double amount, double totalIncome, Color color) {
    double percent = totalIncome > 0 ? (amount / totalIncome) : 0.0;
    if (percent > 1.0) percent = 1.0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
              Text('${(percent * 100).toStringAsFixed(1)}%', style: const TextStyle(color: Color(0xFF9ca3af))),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: percent,
              backgroundColor: const Color(0x1Affffff),
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }
}
