// src/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new Customer
exports.registerCustomer = async (req, res) => {
    const { name, email, phone, password, address, city, dob } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await pool.query('SELECT * FROM "User" WHERE Email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // 2. Hash the password securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Start a PostgreSQL transaction
        await pool.query('BEGIN');

        // 4. Insert into the main "User" table
        const userResult = await pool.query(
            `INSERT INTO "User" (Name, Email, Phone, Password, Role) 
             VALUES ($1, $2, $3, $4, 'Customer') RETURNING UserID`,
            [name, email, phone, hashedPassword]
        );
        
        const newUserId = userResult.rows[0].userid;

        // 5. Insert into the specialized "Customer" table
        await pool.query(
            `INSERT INTO Customer (UserID, Address, City, DateOfBirth) 
             VALUES ($1, $2, $3, $4)`,
            [newUserId, address, city, dob]
        );

        // 6. Commit transaction if everything succeeded
        await pool.query('COMMIT');

        res.status(201).json({ 
            message: 'Customer registered successfully!', 
            userId: newUserId 
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password, requiredRole } = req.body;

    try {
        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM "User" WHERE Email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // 2. Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 3. Enforce strict role separation between Customer and Admin
        if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
            const roleName = user.role.toLowerCase() === 'admin' ? 'Bank Administrator' : 'Customer';
            const portalName = requiredRole.toLowerCase() === 'admin' ? 'Bank Admin Portal' : 'Customer Portal';
            return res.status(403).json({
                error: `Access Denied: This account is registered as a ${roleName}. You cannot log in through the ${portalName}.`
            });
        }

        // 4. Generate a JSON Web Token (JWT)
        const token = jwt.sign(
            { userId: user.userid, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.userid,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};