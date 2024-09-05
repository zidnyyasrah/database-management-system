const User = require('../models/userModel');
const bcrypt = require('bcrypt');  // Add this to hash passwords
const jwt = require('jsonwebtoken');

// Create a new user
async function createUser(req, res) {
    const { name, email, password, linkImgProfile } = req.body;

    // Manually validate password length
    if (password.length < 7 || password.length > 15) {
        return res.status(400).json({ error: 'Password must be between 7 and 15 characters long' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            linkImgProfile
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            linkImgProfile: newUser.linkImgProfile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// Get all users
async function getAllUser(req, res) {
    const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
    res.json(users);
}

// Get logged-in user data
async function getUserData(req, res) {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        password: '********',  // Masked password
        linkImgProfile: req.user.linkImgProfile
    });
}

// Update logged-in user
async function updateUser(req, res) {
    const { name, email, password, linkImgProfile } = req.body;
    const userId = req.user.id; // Get the user ID from the JWT payload

    try {
        // Fetch the user instance from the database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user information
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // Consider hashing the password before saving
        if (linkImgProfile) user.linkImgProfile = linkImgProfile;

        // Save the changes
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user information' });
    }
}

// user delete
async function removeUser(req, res) {
    const { email } = req.body;

    // Ensure the user is logged in and the email matches the logged-in user's email
    if (req.user.email !== email) {
        return res.status(403).json({ error: 'Unauthorized or email does not match logged-in user.' });
    }

    try {
        // Delete the user
        await User.destroy({ where: { id: req.user.id } });

        res.json({ message: 'User account deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user account.' });
    }
}

// User login
async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        // Send the token and user information as the response
        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                linkImgProfile: user.linkImgProfile,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
}


module.exports = { getAllUser, getUserData, updateUser, removeUser, createUser, loginUser };