const express = require('express');
const bodyParser = require('body-parser'); // Ensure body-parser is installed and required
const app = express();
const port = 3003; // Ensure this matches your setup

// Mock database of expenses
let expenses = [
    { id: 1, description: 'Lunch', amount: 15.0, userId: 1 },
    { id: 2, description: 'Office supplies', amount: 50.0, userId: 1 },
];

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// GET all expenses for a user
app.get('/api/expenses', (req, res) => {
    // Mock logic to retrieve expenses for a specific user (userId 1 in this case)
    const userExpenses = expenses.filter(expense => expense.userId === 1);
    res.json(userExpenses);
});

// POST a new expense for a user
app.post('/api/expenses', (req, res) => {
    const { description, amount } = req.body;
    const newExpense = {
        id: expenses.length + 1,
        description,
        amount,
        userId: 1, // Hardcoded for simplicity; replace with actual user ID logic
    };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

// PUT update an existing expense by ID
app.put('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;

    const index = expenses.findIndex(expense => expense.id === parseInt(id));
    if (index !== -1) {
        expenses[index] = {...expenses[index], description, amount };
        res.json(expenses[index]);
    } else {
        res.status(404).send('Expense not found');
    }
});

// DELETE an existing expense by ID
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const index = expenses.findIndex(expense => expense.id === parseInt(id));
    if (index !== -1) {
        expenses.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Expense not found');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});