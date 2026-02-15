import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import investmentRoutes from './routes/investments';
import goalRoutes from './routes/goals';
import taxRoutes from './routes/tax';
import insightsRoutes from './routes/insights';
import connectDB from './config/database';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/insights', insightsRoutes);

app.get('/', (req, res) => {
    res.send('FinVault API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
