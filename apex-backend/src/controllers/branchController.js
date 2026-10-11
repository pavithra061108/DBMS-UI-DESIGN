const pool = require('../config/db');

// Get all branches from PostgreSQL
exports.getBranches = async (req, res) => {
    try {
        const query = `
            SELECT 
                b.BranchID AS id,
                b.BranchName AS name,
                b.IFSCCode AS code,
                b.Address || ', ' || b.City AS location,
                'Branch Manager' AS manager,
                COUNT(DISTINCT a.CustomerID)::int AS customers,
                COALESCE(SUM(a.Balance), 0)::numeric AS deposits,
                CASE WHEN b.IsActive = false THEN 'Inactive' ELSE 'Active' END AS status
            FROM Branch b
            LEFT JOIN Account a ON b.BranchID = a.BranchID
            GROUP BY b.BranchID, b.BranchName, b.IFSCCode, b.Address, b.City, b.IsActive
            ORDER BY b.BranchID ASC
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching branches:', err);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
};

// Create a new branch
exports.createBranch = async (req, res) => {
    const { name, code, location, city } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO Branch (BranchName, IFSCCode, Address, City, IsActive)
             VALUES ($1, $2, $3, $4, true) RETURNING *`,
            [name, code, location || 'Financial District', city || 'Mumbai']
        );
        res.status(201).json({ message: 'Branch created successfully', branch: result.rows[0] });
    } catch (err) {
        console.error('Error creating branch:', err);
        res.status(500).json({ error: 'Failed to create branch' });
    }
};
