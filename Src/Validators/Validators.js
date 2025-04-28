const { body, param, validationResult } = require('express-validator');



const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            data: null,
            errors: errors.array().map(e => ({ field: e.param, msg: e.msg }))
        });
    }
    next();
};


// validator for registration (CreateUser)
const validateCreateUser = [
    body('email')
        .exists().withMessage('email is required')
        .isEmail().withMessage('must be a valid email'),
    body('password')
        .exists().withMessage('password is required')
        .isLength({ min: 6 }).withMessage('must be at least 6 characters'),
    body('first_name').exists().withMessage('first_name is required'),
    body('last_name').exists().withMessage('last_name is required'),
    body('dob')
        .exists().withMessage('dob is required')
        .isISO8601().withMessage('must be a valid date (YYYY-MM-DD)'),
    body('mobile_number')
        .exists().withMessage('mobile_number is required')
        .isMobilePhone().withMessage('must be a valid mobile number'),
    body('contry_code')
        .exists().withMessage('contry_code is required')
        .isLength({ min: 1 }).withMessage('contry_code cannot be empty'),
    body('address').exists().withMessage('address is required'),
    body('city').exists().withMessage('city is required'),
    body('state').exists().withMessage('state is required'),
    body('country').exists().withMessage('country is required'),
    body('zip_code')
        .exists().withMessage('zip_code is required')
        .isPostalCode('any').withMessage('must be a valid postal code'),


    runValidation
];

const validateLogin = [
    body('email')
        .exists().withMessage('email is required')
        .isEmail().withMessage('must be a valid email'),
    body('password')
        .exists().withMessage('password is required')
        .isLength({ min: 6 }).withMessage('must be at least 6 characters'),
    runValidation
];

const validateUpdateUser = [
    body('userId')
        .exists().withMessage('userId is required')
        .isInt({ gt: 0 }).withMessage('userId must be a positive integer'),
    // reuse many of the same checks from create:
    body('email').optional().isEmail().withMessage('must be a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('must be at least 6 characters'),
    body('first_name').optional(),
    body('last_name').optional(),
    body('dob').optional().isISO8601().withMessage('must be a valid date'),
    body('mobile_number').optional().isMobilePhone().withMessage('must be valid'),
    body('contry_code').optional(),
    body('address').optional(),
    body('city').optional(),
    body('state').optional(),
    body('country').optional(),
    body('zip_code').optional().isPostalCode('any').withMessage('must be valid postal code'),
    body('updated_by')
        .exists().withMessage('updated_by is required')
        .isInt({ gt: 0 }).withMessage('updated_by must be a positive integer'),
    runValidation
];

module.exports = { validateCreateUser, validateLogin, validateUpdateUser };