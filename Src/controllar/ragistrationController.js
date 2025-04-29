// const UserModel = require('../model/ragistration.mode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../model/ragistrationModel');


const RegistrationController = {
    CreateUser: async (req, res) => {
        try {
            const { email, password, first_name, last_name, dob, mobile_number, contry_code, address, city, state, country, zip_code, created_by } = req.body;
            const image = req.file ? req.file.filename : null;


            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await UserModel.CreateUser(email, hashedPassword, first_name, last_name, dob, mobile_number, contry_code, address, city, state, country, zip_code, created_by, image);
            return res.status(200).json({
                success: true,
                message: result.action
            });

        } catch (error) {
            console.error('Error in insertOrUpdateAssetComplaint:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null
            });
        }
    },

    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const url = `${process.env.API_URL}/Src/uploads/`


            // Validate email and password here if needed
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required',
                });
            }

            const result = await UserModel.userLogin(email);
                console.log(result[0].TUP_USER_ID, "Full DB Response");
            // Ensure we got valid user data
            if (!result || !result[0].TUP_USER_ID) {
                return res.status(404).json({
                    success: false,
                    message: 'Email Not found.'
                });
            }
            const userdata = result[0];
            console.log(userdata, "Full DB ResponseHashesadeeswefffff");

            console.log("Stored Hash:", result[0].TUP_PASSWORD_HASH);
            console.log("Entered Pasword:", password);
           
            const imagepath = result[0].TUP_PROFILE_PICTURE ? url + result[0].TUP_PROFILE_PICTURE : null;
            console.log(imagepath, "imagepath");
            
            bcrypt.compare(password, result[0].TUP_PASSWORD_HASH, (err, result) => {

                if (err) {

                    console.error("Bcrypt Error:", err);

                    return res.status(500).json({
                        success: false,
                        error: true,
                        message: 'Error validating credentials.'
                    });

                }

                if (!result) {

                    console.log('Password does not match');

                    return res.status(401).json({
                        success: false,
                        error: true,
                        message: 'Invalid password'

                    });

                }

                const token = jwt.sign({ userId: result.user_id }, process.env.ACCESS_TOKEN_SECRET, {

                    expiresIn: '1h',

                });

                res.status(200).json({
                    success: true,
                    error: false,
                    message: 'User login successfully',
                    auth_token: token,
                    image: imagepath,
                    data: userdata
                });

            });

        } catch (error) {
            console.error('Error in userLogin controller:', error.message);

            const status = error.message.includes('not found') ? 404 : 500;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const {
                userId,
                email,
                password,
                first_name,
                last_name,
                dob,
                mobile_number,
                contry_code,
                address,
                city,
                state,
                country,
                zip_code,
                updated_by
            } = req.body;
            const image = req.file?.filename || null;

        
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

          
            const result = await UserModel.updateUser(
                userId,
                email,
                passwordHash,
                first_name,
                last_name,
                dob,
                mobile_number,
                contry_code,
                image,       
                address,
                city,
                state,
                country,
                zip_code,
                updated_by  
            );
            return res.json({
                success: true,
                message: result.action
            });
        } catch (err) {
            console.error('Error in updateUser controller:', err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Internal server error'
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { userId } = req.body;
            const result = await UserModel.deleteUser(userId);
            return res.json({
                success: true,
                message: result.action
            });
        } catch (err) {
            console.error('Error in deleteUser controller:', err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Internal server error'
            });
        }
    }


};

module.exports = RegistrationController;