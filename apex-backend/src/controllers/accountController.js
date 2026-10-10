const pool = require('../config/db');

// Create a new Bank Account
exports.createAccount = async (req, res) => {
    const { accountType, initialBalance } = req.body;
    const userId = req.user.userId; 

    try {
        // 1. Ensure at least one Branch exists in the database
        const branchCheck = await pool.query('SELECT BranchID FROM Branch LIMIT 1');
        let targetBranchId;
        
        if (branchCheck.rows.length === 0) {
            const newBranch = await pool.query(
                `INSERT INTO Branch (BranchName, Address, City, IFSCCode) 
                 VALUES ('Apex Main Branch', 'Main Financial Hub', 'Mumbai', 'APEX0000001') RETURNING BranchID`
            );
            targetBranchId = newBranch.rows[0].branchid;
        } else {
            targetBranchId = branchCheck.rows[0].branchid;
        }

        // 2. Generate Account Number and Insert Account with 0 (or requested balance)
        const accNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();

        const result = await pool.query(
            `INSERT INTO Account (AccountNumber, CustomerID, BranchID, AccountType, Balance) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [accNumber, userId, targetBranchId, accountType || 'Savings', initialBalance !== undefined ? initialBalance : 0]
        );
        
        res.status(201).json({ message: 'Account created successfully', account: result.rows[0] });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
};

// Get Accounts (Formatted for React with INR currency)
exports.getAccounts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        let query = `
            SELECT 
                a.AccountID AS id,
                a.AccountNumber AS "accountNumber",
                'IN89APEX' || a.AccountNumber AS iban,
                u.Name AS "customerName",
                a.AccountType AS type,
                a.Balance AS balance,
                'INR' AS currency,
                CASE WHEN a.AccountType = 'Savings' THEN 4.25 ELSE 1.10 END AS "interestRate",
                a.Status AS status,
                b.BranchName AS branch,
                TO_CHAR(a.OpenedDate, 'YYYY-MM-DD') AS "openedDate"
            FROM Account a
            JOIN Customer c ON a.CustomerID = c.UserID
            JOIN "User" u ON c.UserID = u.UserID
            JOIN Branch b ON a.BranchID = b.BranchID
        `;

        let values = [];
        
        if (role === 'Customer') {
            query += ` WHERE a.CustomerID = $1`;
            values.push(userId);
        }

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
};