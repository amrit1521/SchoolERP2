const dayjs = require("dayjs");
const db = require("../../config/db");


// ADD NOTE
exports.addNote = async (req, res) => {
    try {
        let { title, assignee_group, tag, priority, due_date, status, description, created_by } = req.body;

        // Validation
        if (!title || !assignee_group || !tag || !priority || !due_date || !status || !description || !created_by) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false,
            });
        }

        due_date = dayjs(due_date).format('YYYY-MM-DD')

        const [result] = await db.query(
            `INSERT INTO notes 
      (title, assignee_group, tag, priority, due_date, status, description ,created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
            [title, assignee_group, tag, priority, due_date, status, description, created_by]
        );

        return res.status(201).json({
            message: "Note added successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
// GET ALL NOTES (not deleted)
exports.getNotes = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM notes ORDER BY id DESC"
        );

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
// GET SINGLE NOTE BY ID
exports.getNoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT id,title,assignee_group ,tag,priority,status,description,due_date FROM notes WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
// UPDATE NOTE
exports.updateNote = async (req, res) => {
    const { id } = req.params;
    let {
        title,
        assignee_group,
        tag,
        priority,
        due_date,
        status,
        description,
        created_by
    } = req.body;

    try {
        if (!title || !assignee_group || !tag || !priority || !due_date || !status || !description || !created_by) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        const [noteResult] = await db.query(`SELECT * FROM notes WHERE id = ?`, [id]);
        if (noteResult.length === 0) {
            return res.status(404).json({
                message: "Note not found!",
                success: false
            });
        }
        const note = noteResult[0];
        const roleSql = `
            SELECT LOWER(r.role_name) AS role
            FROM users u
            LEFT JOIN roles r ON r.id = u.roll_id
            WHERE u.id = ?
        `;

        const [roleRows] = await db.query(roleSql, [created_by]);

        const userRole = roleRows.length > 0 ? roleRows[0].role : null;
        if (note.created_by !== created_by && userRole !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to update this note!",
                success: false
            });
        }

        due_date = dayjs(due_date).format('YYYY-MM-DD')
        await db.query(
            `UPDATE notes SET 
                title=?, 
                assignee_group=?, 
                tag=?, 
                priority=?, 
                due_date=?, 
                status=?, 
                description=?
             WHERE id=?`,
            [title, assignee_group, tag, priority, due_date, status, description, id]
        );

        return res.status(200).json({
            message: "Note updated successfully!",
            success: true
        });

    } catch (error) {
        console.error("Update Note Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

exports.toggleImportantNote = async (req, res) => {

    const { id } = req.params
    const { isImportant } = req.body
    try {
        const [note] = await db.query(`SELECT id FROM notes WHERE id = ?`, [id]);
        if (note.length === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        await db.query(
            "UPDATE notes SET is_important = ? WHERE id = ?",
            [isImportant, id]
        );
        return res.json({
            success: true,
            message: isImportant ? "Note Important" : "Note Not Important"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

exports.softDeleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "UPDATE notes SET is_trashed = 1 WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Note not found", success: false });
        }

        return res.status(200).json({ message: "Moved to Trash", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.restoreNote = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "UPDATE notes SET is_trashed = 0 WHERE id = ?",
            [id]
        );

        return res.status(200).json({ message: "Note restored successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.permanentDeleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM notes WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            message: "Note deleted permanently",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
