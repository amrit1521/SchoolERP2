const db = require("../../config/db");
const dayjs = require("dayjs");

// CREATE TODO  (Add Todo)
exports.addTodo = async (req, res) => {
    try {
        let {
            title,
            assignee,
            tag,
            priority,
            due_date,
            status,
            description,
            created_by
        } = req.body;

        // Validation
        if (!title || !assignee || !tag || !priority || !due_date || !status || !description || !created_by) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false,
            });
        }

        // 🔍 Duplicate title check (case insensitive)
        const [exist] = await db.query(
            "SELECT id FROM todos WHERE LOWER(title) = LOWER(?)",
            [title]
        );

        if (exist.length > 0) {
            return res.status(409).json({
                message: "A todo with same title already exists!",
                success: false,
            });
        }

        // Convert date to MySQL format
        due_date = dayjs(due_date, "DD MMM YYYY").format("YYYY-MM-DD");

        // Insert Query
        await db.query(
            `INSERT INTO todos 
            (title, assignee, tag, priority, due_date, status, description, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                assignee,
                tag,
                priority,
                due_date,
                status,
                description,
                created_by
            ]
        );

        return res.status(201).json({
            message: "Todo added successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.getTodos = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM todos ORDER BY id DESC");

        return res.status(200).json({
            success: true,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.getTodoById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;

    let {
        title,
        assignee,
        tag,
        priority,
        due_date,
        status,
        description,
        created_by
    } = req.body;

    try {
     
        if (!title || !assignee || !tag || !priority || !due_date || !status || !description || !created_by) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }
        const [todoResult] = await db.query(`SELECT created_by FROM todos WHERE id = ?`, [id]);
        if (todoResult.length === 0) {
            return res.status(404).json({
                message: "Todo not found!",
                success: false
            });
        }
        const todo = todoResult[0];
        const roleSql = `
            SELECT LOWER(r.role_name) AS role
            FROM users u
            LEFT JOIN roles r ON r.id = u.roll_id
            WHERE u.id = ?
        `;

        const [roleRows] = await db.query(roleSql, [created_by]);
        const userRole = roleRows.length > 0 ? roleRows[0].role : null;
        if (todo.created_by !== created_by && userRole !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to update this todo!",
                success: false
            });
        }
        const [titleCheck] = await db.query(
            "SELECT id FROM todos WHERE LOWER(title) = LOWER(?) AND id != ?",
            [title, id]
        );

        if (titleCheck.length > 0) {
            return res.status(409).json({
                message: "A todo with this title already exists!",
                success: false
            });
        }
        due_date = dayjs(due_date).format("YYYY-MM-DD");
        await db.query(
            `UPDATE todos SET 
                title = ?, 
                assignee = ?, 
                tag = ?, 
                priority = ?, 
                due_date = ?, 
                status = ?, 
                description = ?
            WHERE id = ?`,
            [
                title,
                assignee,
                tag,
                priority,
                due_date,
                status,
                description,
                id
            ]
        );

        return res.status(200).json({
            message: "Todo updated successfully!",
            success: true
        });

    } catch (error) {
        console.error("Update Todo Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



exports.toggleImportantTodo = async (req, res) => {

    const { id } = req.params
    const { isImportant } = req.body
    try {
        const [todo] = await db.query(`SELECT id FROM todos WHERE id = ?`, [id]);
        if (todo.length === 0) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        await db.query(
            "UPDATE todos SET is_important = ? WHERE id = ?",
            [isImportant, id]
        );
        return res.json({
            success: true,
            message: isImportant ? "Todo Important" : "Todo Not Important"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

exports.softDeleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "UPDATE todos SET is_trashed = 1 WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Todo not found", success: false });
        }

        return res.status(200).json({ message: "Moved to Trash", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.restoreTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "UPDATE todos SET is_trashed = 0 WHERE id = ?",
            [id]
        );

        return res.status(200).json({ message: "Todo restored successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.permanentDeleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            "DELETE FROM todos WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            message: "Todo deleted permanently",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};