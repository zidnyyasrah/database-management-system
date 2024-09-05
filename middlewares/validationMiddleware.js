const { body, validationResult } = require('express-validator');

const registrationValidationRules = [
    body('name').isLength({ min: 3, max: 15 }),
    body('email').isEmail(),
    body('password').isLength({ min: 7, max: 15 }),
];

const updateValidationRules = [
    body('name').optional().isLength({ min: 3, max: 15 }),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 7, max: 15 }),
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { registrationValidationRules, updateValidationRules, validate };
