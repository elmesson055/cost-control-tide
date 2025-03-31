
// Utility to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format date to PT-BR format
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR');
};

// Format date and time to PT-BR format
export const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
};

// Generate random amount between min and max
const randomAmount = (min: number, max: number) => {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
};

// Sample transaction categories
const incomeCategories = ['Vendas', 'Serviços', 'Investimentos', 'Outros'];
const expenseCategories = ['Fornecedores', 'Salários', 'Aluguel', 'Energia', 'Água', 'Internet', 'Manutenção', 'Marketing', 'Impostos', 'Outros'];

// Generate cash flow data for chart
export const generateCashFlowData = (days = 30) => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    let income = randomAmount(500, 2000);
    // Weekend boost
    if (currentDate.getDay() === 5 || currentDate.getDay() === 6) {
      income *= 1.5;
    }
    
    const expense = randomAmount(400, income * 0.9); // Expenses typically less than income
    
    data.push({
      date: formatDate(currentDate),
      income: income,
      expense: expense,
    });
  }

  return data;
};

// Generate expense breakdown data
export const generateExpenseBreakdownData = () => {
  return [
    { name: 'Fornecedores', value: randomAmount(3000, 5000), color: '#EF4444' },
    { name: 'Salários', value: randomAmount(5000, 10000), color: '#F59E0B' },
    { name: 'Aluguel', value: randomAmount(2000, 3000), color: '#10B981' },
    { name: 'Utilidades', value: randomAmount(1000, 2000), color: '#3B82F6' },
    { name: 'Marketing', value: randomAmount(500, 1500), color: '#8B5CF6' },
    { name: 'Impostos', value: randomAmount(2000, 4000), color: '#EC4899' },
    { name: 'Outros', value: randomAmount(500, 1500), color: '#6B7280' },
  ];
};

// Generate recent transactions
export const generateTransactions = (count = 10) => {
  const transactions = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  for (let i = 0; i < count; i++) {
    const date = randomDate(startDate, today);
    const type = Math.random() > 0.4 ? 'income' : 'expense';
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let description = '';
    if (type === 'income') {
      description = category === 'Vendas' ? 'Venda #' + Math.floor(Math.random() * 1000) : 
                   category === 'Serviços' ? 'Serviço #' + Math.floor(Math.random() * 1000) :
                   'Recebimento';
    } else {
      description = category === 'Fornecedores' ? 'Pagamento Fornecedor #' + Math.floor(Math.random() * 100) : 
                   category === 'Salários' ? 'Pagamento de Salário' :
                   'Pagamento ' + category;
    }
    
    transactions.push({
      id: String(i + 1),
      date: formatDate(date),
      description,
      amount: randomAmount(type === 'income' ? 100 : 50, type === 'income' ? 1000 : 800),
      type,
      category,
    });
  }

  // Sort by date (most recent first)
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });
};

// Generate cash operation history
export const generateCashHistory = (days = 5) => {
  const history = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Opening
    const openingTime = new Date(date);
    openingTime.setHours(8, Math.floor(Math.random() * 30), 0);
    
    // Closing
    const closingTime = new Date(date);
    closingTime.setHours(18, 30 + Math.floor(Math.random() * 30), 0);
    
    const initialBalance = randomAmount(500, 1000);
    const finalBalance = randomAmount(initialBalance, initialBalance * 2);
    
    // Generate 2-5 operations per day
    const operations = [];
    const numOperations = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < numOperations; j++) {
      const opTime = new Date(date);
      opTime.setHours(
        8 + Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 60),
        0
      );
      
      const type = Math.random() > 0.3 ? 'entrada' : 'sangria';
      
      operations.push({
        id: `${i}-${j}`,
        type,
        amount: randomAmount(type === 'entrada' ? 100 : 50, type === 'entrada' ? 300 : 200),
        time: formatDateTime(opTime),
        notes: type === 'entrada' ? 'Suprimento de caixa' : 'Sangria para depósito bancário'
      });
    }
    
    operations.sort((a, b) => {
      const timeA = new Date(a.time.split(' ')[0].split('/').reverse().join('-') + 'T' + a.time.split(' ')[1]);
      const timeB = new Date(b.time.split(' ')[0].split('/').reverse().join('-') + 'T' + b.time.split(' ')[1]);
      return timeA.getTime() - timeB.getTime();
    });
    
    history.push({
      date: formatDate(date),
      openingTime: formatDateTime(openingTime),
      closingTime: i === 0 ? null : formatDateTime(closingTime), // Today might not be closed yet
      initialBalance,
      finalBalance: i === 0 ? null : finalBalance, // Today's final balance not defined yet
      operations: operations,
      isClosed: i !== 0 // Only today is open
    });
  }
  
  return history;
};
