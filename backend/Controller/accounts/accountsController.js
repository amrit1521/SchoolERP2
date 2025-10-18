const db = require('../../config/db');


// Expense Category Controller
exports.addExpenseCategory = async (req, res) => {
    try {
        let { category, description } = req.body;

        if (!category) {
            return res.status(400).json({ message: "Category name is required!", success: false });
        }

        category = category.trim();


        const [existing] = await db.query(
            "SELECT id FROM expense_category WHERE LOWER(category) = ?",
            [category.toLowerCase()]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Category already exists!",
                success: false,
            });
        }


        const [result] = await db.query(
            "INSERT INTO expense_category (category, description) VALUES (?, ?)",
            [category, description || null]
        );

        return res.status(201).json({
            message: "Expense Category added successfully",
            success: true,
            id: result.insertId,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to add Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.getExpenseCategories = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, category, description, created_at, updated_at FROM expense_category ORDER BY id ASC"
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch Expense Categories!",
            success: false,
            error: error.message,
        });
    }
};


exports.getExpenseCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT id, category, description, created_at, updated_at FROM expense_category WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Expense Category not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.updateExpenseCategory = async (req, res) => {
    const { id } = req.params;
    let { category, description } = req.body;

    if (!category) {
        return res.status(400).json({ message: "Category name is required!", success: false });
    }

    try {
        category = category.trim();


        const [duplicate] = await db.query(
            "SELECT id FROM expense_category WHERE LOWER(category) = ? AND id != ?",
            [category.toLowerCase(), id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({
                message: "Another category with the same name already exists!",
                success: false,
            });
        }

        const [result] = await db.query(
            "UPDATE expense_category SET category = ?, description = ? WHERE id = ?",
            [category, description || null, id]
        );

        return res.status(200).json({ message: "Expense Category updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update Expense Category!",
            success: false,
            error: error.message,
        });
    }
};


exports.deleteExpenseCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            "DELETE FROM expense_category WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense Category not found", success: false });
        }

        return res.status(200).json({ message: "Expense Category deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to delete Expense Category!",
            success: false,
            error: error.message,
        });
    }
};
