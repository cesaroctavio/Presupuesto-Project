class Transaction {
  final int id;
  final String type; // 'ingresos', 'ahorros', 'bills', 'tdc'
  final String concept;
  final double amount;
  final int quincena; // 1 or 2

  const Transaction({
    required this.id,
    required this.type,
    required this.concept,
    required this.amount,
    required this.quincena,
  });

  Transaction copyWith({
    int? id,
    String? type,
    String? concept,
    double? amount,
    int? quincena,
  }) {
    return Transaction(
      id: id ?? this.id,
      type: type ?? this.type,
      concept: concept ?? this.concept,
      amount: amount ?? this.amount,
      quincena: quincena ?? this.quincena,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'concept': concept,
      'amount': amount,
      'quincena': quincena,
    };
  }

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as int,
      type: json['type'] as String,
      concept: json['concept'] as String,
      amount: (json['amount'] as num).toDouble(),
      quincena: json['quincena'] as int,
    );
  }
}

// Model for Default Data to pre-populate DB if empty
const List<Map<String, dynamic>> defaultTransactionsJson = [
  {'id': 1, 'type': 'ingresos', 'concept': 'Quincena', 'amount': 23000.0, 'quincena': 1},
  {'id': 2, 'type': 'ingresos', 'concept': 'Quincena', 'amount': 23000.0, 'quincena': 2},
  {'id': 3, 'type': 'ahorros', 'concept': 'Inversión Fija', 'amount': 3000.0, 'quincena': 1},
  {'id': 4, 'type': 'ahorros', 'concept': 'Fondo Emergencia', 'amount': 2000.0, 'quincena': 2},
  {'id': 5, 'type': 'bills', 'concept': 'Renta', 'amount': 8000.0, 'quincena': 1},
  {'id': 6, 'type': 'bills', 'concept': 'Luz', 'amount': 500.0, 'quincena': 1},
  {'id': 7, 'type': 'bills', 'concept': 'Mandado', 'amount': 2000.0, 'quincena': 1},
  {'id': 8, 'type': 'bills', 'concept': 'Mandado', 'amount': 2000.0, 'quincena': 2},
  {'id': 9, 'type': 'tdc', 'concept': 'NU 15 c/mes', 'amount': 2300.0, 'quincena': 1},
  {'id': 10, 'type': 'tdc', 'concept': 'Hey Banco', 'amount': 8700.0, 'quincena': 2},
  {'id': 11, 'type': 'tdc', 'concept': 'Netflix', 'amount': 318.0, 'quincena': 1},
  {'id': 12, 'type': 'tdc', 'concept': 'Spotify', 'amount': 199.0, 'quincena': 1},
  {'id': 13, 'type': 'tdc', 'concept': 'MSI Xbox Jaimin', 'amount': 932.0, 'quincena': 2},
];
