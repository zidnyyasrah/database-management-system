const User = require('../models/userModel');
const bcrypt = require('bcrypt');  // Add this to hash passwords
const jwt = require('jsonwebtoken');

// Create user
async function createUser(req, res) {
    const { name, email, password, linkImgProfile } = req.body;

    try {
        // Cek apakah email user sudah ada
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'tidak dapat menambahkan user dengan email yang sama' });
        }

        // Buat instance user baru
        user = new User({
            name,
            email,
            password,
            linkImgProfile,
        });

        // Save user ke database
        await user.save();

        // JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ message:'Berhasil membuat user baru, berikut token anda:',token });
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat user' });
    }
}


// Get all users
async function getAllUser(req, res) {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data user' });
    }
}

// Get current logged-in user
async function getUserData(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data user' });
    }
}

// Update logged-in user
async function updateUser(req, res) {
    const { name, email, password, linkImgProfile } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // This will trigger password hashing in the model
        if (linkImgProfile) user.linkImgProfile = linkImgProfile;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Gagal meng-update informasi user' });
    }
}

// Delete logged-in user
async function removeUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus user' });
    }
}


// User login
async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Cek email user 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email yang anda masukkan salah!' });
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Password yang anda masukkan salah!' });
        }

        // JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Gagal log in' });
    }
}

module.exports = { getAllUser, getUserData, updateUser, removeUser, createUser, loginUser };