const db = require('../Config/dbConfig')

const UserModel = {

    CreateUser: async (
        email, passwordHash, first_name, last_name,
        dob, mobile_number, contry_code, address,
        city, state, country, zip_code, created_by, image) => {
        try {
            const [rows] = await db.execute('CALL sp_insert_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )',
                [
                    email,
                    passwordHash,
                    first_name,
                    last_name,
                    dob,
                    mobile_number,
                    contry_code,
                    image || null,
                    address,
                    city,
                    state,
                    country,
                    zip_code,
                    created_by,

                ])

            return rows[0][0]

        } catch (error) {
            console.error('Error in CreateOrUpdateUser:', error.message)
            throw error
        }
    },

    userLogin: async (email, password) => {
        try {
            const [resultSets] = await db.execute('CALL sp_userlogin(?)', [email])


            const rows = resultSets[0] || [];
            if (rows.length === 0 || rows[0].error_message) {
                throw new Error(rows[0]?.error_message || 'User not found for the specified email.');
            }
            console.log(rows, "Full DB ResponseModelllllllllllllll");
            return rows; // { TUP_USER_ID, TUP_EMAIL, TUP_PASSWORD_HASH, … }
        } catch (err) {
            console.error('Error in userLogin model:', err.message);
            throw err;
        }
    },

    updateUser: async (
        userId, email, passwordHash, first_name, last_name,
        dob, mobile_number, contry_code, image,
        address, city, state, country, zip_code, updated_by
    ) => {
        try {
            const [resultSets] = await db.execute(
                'CALL sp_update_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
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
                ]
            );
            return resultSets[0][0];
        } catch (err) {
            console.error('Error in updateUser model:', err);
            throw err;
        }
    },

    deleteUser: async (userId) => {
        try {
            const [result] = await db.execute('CALL sp_delete_user_profile(?)', [userId]);
            return result[0][0];
        } catch (err) {
            console.error('Error in deleteUser model:', err);
            throw err;
        }
    },
}
module.exports = UserModel