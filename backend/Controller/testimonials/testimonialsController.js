const { success } = require('zod');
const db = require('../../config/db');

exports.addTestiMonials = async (req, res) => {
    let { userId, content } = req.body;

    // 1. Body validation
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required!"
        });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty!"
        });
    }

    // Normalize
    userId = Number(userId);
    content = content.trim();

    // 2. Advanced content validation
    if (content.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Testimonial must be at least 10 characters!"
        });
    }

    try {
        // 3. Check user exists
        const [userCheck] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [userId]
        );

        if (userCheck.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // 4. Check if user already added testimonial
        const [already] = await db.query(
            `SELECT id FROM testimonials WHERE user_id = ? LIMIT 1`,
            [userId]
        );

        if (already.length > 0) {
            return res.status(403).json({
                success: false,
                message: "You have already added your thought !"
            });
        }

        // 5. Check duplicate content (same content already exists)
        const [duplicate] = await db.query(
            `SELECT id FROM testimonials WHERE content = ?`,
            [content]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This testimonial already exists!"
            });
        }

        // 6. Insert testimonial
        const [result] = await db.query(
            `INSERT INTO testimonials (user_id, content, created_at) VALUES (?, ?, NOW())`,
            [userId, content]
        );

        return res.status(200).json({
            success: true,
            message: "Testimonial added successfully!",
        });


    } catch (error) {
        console.error("Error during adding testimonials:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};


exports.allTestiMonials = async (req, res) => {
    try {
        const sql = `
            SELECT 
                t.id,
                t.content,
                t.created_at,
                r.role_name,
                CONCAT(u.firstname, " ", u.lastname) AS name,

                CASE
                    WHEN r.role_name = "student" THEN s.stu_img
                    WHEN r.role_name = "teacher" THEN tt.img_src
                    WHEN r.role_name = "parent" THEN p.img_src
                    WHEN u.remark = "staff" THEN st.img_src
                    ELSE NULL
                END AS user_img

            FROM testimonials t
            JOIN users u ON u.id = t.user_id
            JOIN roles r ON r.id = u.roll_id
            
            LEFT JOIN students s ON s.stu_id = u.id
            LEFT JOIN teachers tt ON tt.user_id = u.id
            LEFT JOIN staffs st ON st.user_id = u.id
            LEFT JOIN parents_info p ON p.parent_user_id = u.id

            ORDER BY t.created_at DESC
        `;

        const [rows] = await db.query(sql);

        return res.status(200).json({
            message: "All testimonials fetched successfully!",
            success: true,
            data: rows
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error!",
            success: false,
            error: error.message
        });
    }
};
// ================= READ ONE =================
exports.getSingleTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        const [row] = await db.query(`SELECT id ,content FROM testimonials WHERE id=?`, [id]);

        if (row.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found!"
            });
        }

        return res.json({
            success: true,
            data: row[0]
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ================= UPDATE =================
exports.updateTestimonial = async (req, res) => {

    const { id } = req.params
    let { userId, content, role } = req.body;

    if (!id || !userId) {
        return res.status(400).json({
            success: false,
            message: "Testimonial ID and User ID required!"
        });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Content cannot be empty!"
        });
    }

    content = content.trim();

    if (content.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Content must be at least 10 characters!"
        });
    }

    try {
        // Check testimonial exists
        const [testi] = await db.query(
            `SELECT user_id FROM testimonials WHERE id=?`,
            [id]
        );
        const [roleRes] = await db.query('SELECT role_name FROM roles WHERE id=?', [role])

        if (testi.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found!"
            });
        }

        const ownerId = testi[0].user_id;
        const rolename = roleRes[0].role_name

        // Normal user → only update own testimonial
        if (rolename !== "admin" && ownerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You cannot update this testimonial!"
            });
        }

        // Update
        await db.query(
            `UPDATE testimonials SET content=?, updated_at=NOW() WHERE id=?`,
            [content, id]
        );

        return res.json({
            success: true,
            message: "Testimonial updated successfully!"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE =================
exports.deleteTestimonial = async (req, res) => {
    const { id } = req.params;
    const { userId, role } = req.query;


    try {
        const [row] = await db.query(
            `SELECT user_id FROM testimonials WHERE id=?`,
            [id]
        );

        if (row.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found!"
            });
        }

        const [roleRes] = await db.query('SELECT role_name FROM roles WHERE id=?', [role])

        const ownerId = row[0].user_id;
        const rolename = roleRes[0].role_name

        if (rolename !== 'admin' && ownerId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this testimonial!"
            });
        }

        await db.query(`DELETE FROM testimonials WHERE id=?`, [id]);

        return res.json({
            success: true,
            message: "Testimonial deleted successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};


