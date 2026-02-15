# FinVault - AI-Powered Financial Dashboard

FinVault is a modern, full-stack financial management platform designed to simplify personal finance tracking. It combines expense monitoring, investment analysis, and tax planning into a single, intuitive interface powered by AI insights.

## Overview

Managing finances across multiple accounts, investments, and tax obligations can be overwhelming. FinVault solves this fragmentation by providing a centralized dashboard for all your financial data.

-   **Target Audience**: Individuals, investors, and freelancers who want complete control over their financial health.
-   **Unique Value**: Specifically tailored for the Indian market with tax regime comparisons (Old vs. New) and AI-driven spending insights.

## Features

-   **Secure Authentication**: robust user registration and login system using JWT and bcrypt.
-   **Smart Dashboard**: Real-time overview of net worth, expenses, and investment performance with interactive charts.
-   **Transaction Management**: Add, edit, and categorize income and expenses effortlessly.
-   **Investment Tracker**: Monitor stocks, mutual funds, and crypto with automatic ROI calculations.
-   **Tax Planner**: specialized tool for Indian taxpayers to calculate liability and compare tax regimes.
-   **Goal Setting**: Define financial goals (e.g., buying a house) and track progress with monthly contribution suggestions.
-   **AI Insights**: Get intelligent analysis on spending habits and budget optimization tips.
-   **Responsive Design**: A sleek, mobile-friendly interface built with Shadcn UI and Tailwind CSS.

## Tech Stack

**Frontend:**
-   [React](https://react.dev/) (v18) with TypeScript
-   [Vite](https://vitejs.dev/) - Blazing fast build tool
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
-   [Shadcn UI](https://ui.shadcn.com/) - Reusable accessible components
-   [Recharts](https://recharts.org/) - Composable charting library
-   [React Query](https://tanstack.com/query/latest) - Server state management

**Backend:**
-   [Node.js](https://nodejs.org/) - JavaScript runtime
-   [Express.js](https://expressjs.com/) - Web framework
-   [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
-   [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - Password hashing
-   [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken) - Authentication

**Database:**
-   [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data storage

## Folder Structure

```
clarity-finances-96-main/
├── server/                 # Backend Node.js/Express application
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Request handlers for routes
│   │   ├── middleware/     # Auth and error handling middleware
│   │   ├── models/         # Mongoose schema definitions
│   │   ├── routes/         # API route definitions
│   │   └── index.ts        # Server entry point
│   └── ...
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components (forms, charts, layout)
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Main application pages (Dashboard, Auth, etc.)
│   ├── App.tsx             # Root component and routing
│   └── ...
└── ...
```

## Installation Steps

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/shreyabarla/Tech-Coders.git
cd clarity-finances-96-main
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Create .env File
Create a `.env` file in the `server` directory and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### 4. Run the Application

**Start Backend Server:**
Open a terminal in the `server` directory:
```bash
npm run dev
```

**Start Frontend Client:**
Open a new terminal in the root directory:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to view the application.

## Usage

1.  **Register/Login**: Create a new account or log in with existing credentials to access your secure dashboard.
2.  **Dashboard**: View your total balance, recent activity, and quick stats upon logging in.
3.  **Add Transactions**: Navigate to the "Transactions" page to log income or expenses.
4.  **Track Investments**: Use the "Investments" section to add your portfolio holdings and watch their growth.
5.  **Plan Taxes**: Enter your income details in "Tax Planner" to see estimated tax liability under old and new regimes.
6.  **Set Goals**: Create savings goals and let the app calculate how much you need to save monthly.

## API Endpoints

The backend exposes several RESTful endpoints. Here are a few key ones:

**Authentication**
-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Authenticate user and get token

**Transactions**
-   `GET /api/transactions` - Get all transactions for the logged-in user
-   `POST /api/transactions` - Add a new transaction
-   `DELETE /api/transactions/:id` - Delete a transaction

**Investments**
-   `GET /api/investments` - Get user's investment portfolio
-   `POST /api/investments` - Add a new investment

**Insights**
-   `GET /api/insights` - Get AI-generated financial insights

## Screenshots Section

*(Add screenshots of your application here)*

| Dashboard | Transactions |
| :---: | :---: |
| ![Dashboard Screenshot](https://via.placeholder.com/600x400?text=Dashboard+View) | ![Transactions Screenshot](https://via.placeholder.com/600x400?text=Transactions+View) |

| Tax Planner | Goal Setting |
| :---: | :---: |
| ![Tax Planner Screenshot](https://via.placeholder.com/600x400?text=Tax+Planner) | ![Goal Setting Screenshot](https://via.placeholder.com/600x400?text=Goal+Setting) |

## Future Improvements

-   **Mobile App**: Native mobile application using React Native.
-   **Bank Integration**: Automatic transaction syncing via Plaid or Account Aggregator framework.
-   **Export Data**: functionality to export financial reports to PDF and Excel.
-   **Social Features**: Share financial goals (anonymously) with friends or community.
-   **Dark Mode**: Enhanced dark mode customization.

---

Built  by [Shreya Barla and Team]