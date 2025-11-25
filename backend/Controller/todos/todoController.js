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
    try {
        const { id } = req.params;

        let {
            title,
            assignee,
            tag,
            priority,
            due_date,
            status,
            description
        } = req.body;

        // Validation
        if (!title || !assignee || !tag || !priority || !due_date || !status || !description) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false,
            });
        }

        // Check if todo exists
        const [exist] = await db.query("SELECT id FROM todos WHERE id = ?", [id]);
        if (exist.length === 0) {
            return res.status(404).json({
                message: "Todo not found",
                success: false,
            });
        }

        // Duplicate title check (excluding current ID)
        const [titleCheck] = await db.query(
            "SELECT id FROM todos WHERE LOWER(title) = LOWER(?) AND id != ?",
            [title, id]
        );

        if (titleCheck.length > 0) {
            return res.status(409).json({
                message: "A todo with this title already exists!",
                success: false,
            });
        }

        // Convert date
        due_date = dayjs(due_date, "DD MMM YYYY").format("YYYY-MM-DD");

        // Update query
        await db.query(
            `UPDATE todos SET 
                title = ?, assignee = ?, tag = ?, priority = ?, 
                due_date = ?, status = ?, description = ?
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
            message: "Todo updated successfully",
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

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT id FROM todos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found",
                success: false,
            });
        }

        await db.query("DELETE FROM todos WHERE id = ?", [id]);

        return res.status(200).json({
            message: "Todo deleted successfully",
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
