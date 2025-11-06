
const db = require('../../config/db')

exports.allUsers = async (req, res) => {

    try {

        const [rows] = await db.execute(
            `SELECT u.id as user_id, CONCAT(u.firstname," " ,u.lastname) AS name,
            
             u.email, u.roll_id, r.role_name, u.created_at as dateOfJoined
            FROM users u
            LEFT JOIN roles r ON u.roll_id = r.id
            WHERE u.status = '1'
            ORDER BY u.roll_id ASC , u.firstname ASC
            `
        );
        if (rows.length < 0) {
            return res.status(200).json({
                message: "No Users found.",
                success: false,
                data: rows,
            });
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: rows.filter((rows) => rows.role_name.toLowerCase() !=='admin'),
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error !", success: false, error: error.message })
    }
}