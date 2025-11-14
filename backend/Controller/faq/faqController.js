const db = require("../../config/db");

// ---------------- Add FAQ ----------------
exports.addFAQ = async (req, res) => {
    try {
        let { question, category } = req.body;

        // ✅ Validation
        if (!category || !question) {
            return res
                .status(400)
                .json({ message: "All fields are required!", success: false });
        }

        category = category.trim();
        question = question.trim();



        const [existing] = await db.query(
            "SELECT id FROM faq WHERE LOWER(question) = ?",
            [question.toLowerCase()]
        );

        if (existing.length > 0) {
            return res
                .status(400)
                .json({ message: "FAQ with this question already exists!", success: false });
        }


        const [result] = await db.query(
            "INSERT INTO faq (question, category) VALUES (?, ?)",
            [question, category]
        );

        return res.status(201).json({
            message: "FAQ added successfully",
            success: true,
            id: result.insertId,
        });
    } catch (error) {
        console.error("Error adding FAQ:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};

// ---------------- Get All FAQs ----------------
exports.getAllFAQs = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, question, answer, category FROM faq ORDER BY id DESC"
        );

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};

// ---------------- Get FAQ by ID ----------------
exports.getFAQById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            "SELECT id, question,category FROM faq WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "FAQ not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Error fetching FAQ by ID:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};

// ---------------- Update FAQ ----------------
exports.updateFAQ = async (req, res) => {
    const { id } = req.params;
    let { question, category } = req.body;

    if (!category || !question) {
        return res
            .status(400)
            .json({ message: "All fields are required!", success: false });
    }

    try {
        category = category.trim();
        question = question.trim();



        const [duplicate] = await db.query(
            "SELECT id FROM faq WHERE LOWER(question) = ? AND id != ?",
            [question.toLowerCase(), id]
        );

        if (duplicate.length > 0) {
            return res
                .status(400)
                .json({ message: "Another FAQ with the same question already exists!", success: false });
        }

        const [result] = await db.query(
            "UPDATE faq SET question = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [question, category, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "FAQ not found", success: false });
        }

        return res.status(200).json({
            message: "FAQ updated successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};

// ---------------- Delete FAQ ----------------
exports.deleteFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM faq WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "FAQ not found", success: false });
        }

        return res.status(200).json({
            message: "FAQ deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


// ---------------- Reply to FAQ ----------------
exports.replyFAQ = async (req, res) => {
    const { id } = req.params;
    let { answer } = req.body;
    if (!id || !answer || answer.trim() === "") {
        return res.status(400).json({
            message: "Both FAQ ID and Answer are required!",
            success: false,
        });
    }
    try {
        answer = answer.trim();
        const [result] = await db.query(
            "UPDATE faq SET answer = ? WHERE id = ?",
            [answer, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "FAQ not found!",
                success: false,
            });
        }
        return res.status(200).json({
            message: "FAQ answered successfully!",
            success: true,
        });
    } catch (error) {
        console.error("❌ Error replying FAQ:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

