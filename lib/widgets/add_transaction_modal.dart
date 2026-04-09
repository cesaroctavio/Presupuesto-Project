import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/transaction.dart';
import '../providers/budget_provider.dart';

class AddTransactionModal extends ConsumerStatefulWidget {
  const AddTransactionModal({super.key});

  @override
  ConsumerState<AddTransactionModal> createState() => _AddTransactionModalState();
}

class _AddTransactionModalState extends ConsumerState<AddTransactionModal> {
  final _formKey = GlobalKey<FormState>();
  
  String _type = 'ingresos';
  int _quincena = 1;
  String _concept = '';
  double _amount = 0.0;

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      
      final newTx = Transaction(
        id: DateTime.now().millisecondsSinceEpoch,
        type: _type,
        concept: _concept,
        amount: _amount,
        quincena: _quincena,
      );

      ref.read(transactionsProvider.notifier).addTransaction(newTx);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Determine default quincena from the dashboard/tab state
    final currentQ = ref.read(quincenaFilterProvider) ?? 1;
    
    return Container(
      padding: EdgeInsets.only(
        top: 24, left: 24, right: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: Color(0xFF1f2937), // Dark modal background
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Nuevo Registro',
              style: TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            // Tipo Selector
            DropdownButtonFormField<String>(
              value: _type,
              dropdownColor: const Color(0xFF374151),
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Categoría'),
              items: const [
                DropdownMenuItem(value: 'ingresos', child: Text('Ingresos')),
                DropdownMenuItem(value: 'ahorros', child: Text('Ahorros')),
                DropdownMenuItem(value: 'bills', child: Text('Bills (Fijos)')),
                DropdownMenuItem(value: 'tdc', child: Text('TDC / Suscripciones')),
              ],
              onChanged: (val) => setState(() => _type = val!),
            ),
            const SizedBox(height: 16),
            
            // Quincena Selector
            DropdownButtonFormField<int>(
              value: currentQ, // default to current tab
              dropdownColor: const Color(0xFF374151),
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Quincena'),
              items: const [
                DropdownMenuItem(value: 1, child: Text('Quincena 1')),
                DropdownMenuItem(value: 2, child: Text('Quincena 2')),
              ],
              onChanged: (val) => setState(() => _quincena = val!),
            ),
            const SizedBox(height: 16),

            // Concepto
            TextFormField(
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Descripción o concepto'),
              validator: (val) => (val == null || val.trim().isEmpty) ? 'Requerido' : null,
              onSaved: (val) => _concept = val!.trim(),
            ),
            const SizedBox(height: 16),

            // Monto
            TextFormField(
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Monto (\$)', prefixIcon: Icons.attach_money),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Requerido';
                if (double.tryParse(val) == null) return 'Monto inválido';
                if (double.parse(val) <= 0) return 'Mayor a cero';
                return null;
              },
              onSaved: (val) => _amount = double.parse(val!),
            ),
            const SizedBox(height: 24),
            
            // Botones
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('Cancelar', style: TextStyle(color: Colors.grey)),
                  ),
                ),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8b5cf6), // Primary purple
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Agregar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, {IconData? prefixIcon}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.grey),
      filled: true,
      fillColor: const Color(0x33ffffff),
      prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: Colors.grey) : null,
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.transparent),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF8b5cf6)),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.redAccent),
      ),
    );
  }
}
