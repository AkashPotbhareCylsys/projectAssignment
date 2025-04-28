const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../midilware/verifyToken');
const { validateCreateUser, validateLogin, validateUpdateUser } = require('../Validators/Validators');
const RegistrationController = require('../controllar/ragistrationController');

const router = express.Router();

// sanity-check
router.get('/_ping', (req, res) => res.send('pong'));

// multer config
const DIR = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// your POST
router.post('/registrationtUser', upload.single('image'), validateCreateUser, RegistrationController.CreateUser);

router.post('/userLogin', validateLogin, RegistrationController.userLogin);

router.put('/updateUser', verifyToken, upload.single('image'), validateUpdateUser, RegistrationController.updateUser);

router.delete('/deleteUser', verifyToken, RegistrationController.deleteUser);

module.exports = router;
