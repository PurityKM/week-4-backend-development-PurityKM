const express = require('express');
const bodyParser = require('body-parser');
const { users, generateToken, authenticateToken } = require('./users'); // Import authentication logic
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Mock database of expenses
let expenses = [
    { id: 1, description: 'Food', amount: 1500.0, userId: 1 },
    { id: 2, description: 'Rent', amount: 15000.0, userId: 1 },
    { id: 3, description: 'Clothes', amount: 30000.0, userId: 1 },
];

// GET all expenses for a user
app.get('/api/expenses', authenticateToken, (req, res) => {
    const userExpenses = expenses.filter(expense => expense.userId === req.user.id);
    res.json(userExpenses);
});

// POST a new expense for a user
app.post('/api/expenses', authenticateToken, (req, res) => {
    const { description, amount } = req.body;
    const newExpense = {
        id: expenses.length + 1,
        description,
        amount,
        userId: req.user.id
    };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

// PUT update an existing expense by ID
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
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
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = expenses.findIndex(expense => expense.id === parseInt(id));
    if (index !== -1) {
        expenses.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Expense not found');
    }
});

// Total expenses endpoint
app.get('/api/expense', authenticateToken, (req, res) => {
    const userExpenses = expenses.filter(expense => expense.userId === req.user.id);
    const totalExpense = userExpenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
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

module.exports = { users, generateToken, authenticateToken };