const express = require('express');
const { createUser,getAllUser, getUserData, updateUser, removeUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registrationValidationRules, updateValidationRules } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', registrationValidationRules , createUser);
router.put('/user', authMiddleware, updateValidationRules, updateUser);
router.get('/users', getAllUser);
router.get('/user', authMiddleware, getUserData);
router.delete('/delete', authMiddleware, removeUser);
router.post('/login', loginUser);



module.exports = router;
