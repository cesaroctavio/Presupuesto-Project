import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/budget_provider.dart';
import '../widgets/add_transaction_modal.dart';
import 'dashboard_view.dart';
import 'quincena_view.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  void _showAddModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddTransactionModal(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentQ = ref.watch(quincenaFilterProvider);
    final isDashboard = currentQ == null;
    
    // Header balance logic matching React app
    final balance = isDashboard ? 0.0 : ref.watch(currentBalanceProvider);
    final formatter = NumberFormat.currency(locale: 'es_MX', symbol: '\$');

    return Scaffold(
      backgroundColor: const Color(0xFF0f172a), // app-container background
      body: SafeArea(
        child: Column(
          children: [
            // Header Area (glass-panel)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: Color(0x33ffffff))),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Mi Presupuesto',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0x1Affffff),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0x33ffffff)),
                        ),
                        child: Text(
                          isDashboard ? 'RESUMEN' : formatter.format(balance),
                          style: TextStyle(
                            color: isDashboard ? const Color(0xFF8b5cf6) : (balance >= 0 ? const Color(0xFF10b981) : const Color(0xFFef4444)),
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Tab Bar
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1f2937),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0x1Affffff)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        _buildTab(context, ref, 'Q1', 1, currentQ == 1),
                        _buildTab(context, ref, 'Q2', 2, currentQ == 2),
                        _buildTab(context, ref, 'Mes', null, currentQ == null),
                      ],
                    ),
                  )
                ],
              ),
            ),

            // Content Area
            Expanded(
              child: isDashboard ? const DashboardView() : const QuincenaView(),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddModal(context),
        backgroundColor: const Color(0xFF8b5cf6), // Purple
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 8,
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _buildTab(BuildContext context, WidgetRef ref, String title, int? qValue, bool isActive) {
    return Expanded(
      child: GestureDetector(
        onTap: () => ref.read(quincenaFilterProvider.notifier).state = qValue,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isActive ? const Color(0x33ffffff) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isActive
                ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))]
                : [],
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isActive ? Colors.white : const Color(0xFF9ca3af),
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
              fontSize: 15,
            ),
          ),
        ),
      ),
    );
  }
}
