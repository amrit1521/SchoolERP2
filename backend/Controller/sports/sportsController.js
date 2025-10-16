const db = require("../../config/db");

// ================== Add Sport ==================
exports.addSport = async (req, res) => {
    try {
        let { name, coach, year } = req.body;

        
        if (!name || !coach || !year) {
            return res.status(400).json({
                message: "All fields (name, coach, year) are required!",
                success: false,
            });
        }

        name = name.trim();

       
        const [existing] = await db.query(
            "SELECT id FROM sports WHERE LOWER(sports_name) = ?",
            [name.toLowerCase()]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Sport with this name already exists!",
                success: false,
            });
        }

        
        const [result] = await db.query(
            "INSERT INTO sports (sports_name, coach, year) VALUES (?, ?, ?)",
            [name, coach, year]
        );

        return res.status(201).json({
            message: "Sport added successfully",
            success: true,
            id: result.insertId,
        });
    } catch (error) {
        console.error("Error adding sport:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


exports.getSports = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, sports_name AS sports, coach AS coachName, year FROM sports ORDER BY id DESC"
        );

        return res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching sports:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


exports.getSportById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            "SELECT id, sports_name AS name, coach, year FROM sports WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res
                .status(404)
                .json({ message: "Sport not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Error fetching sport by id:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


exports.updateSport = async (req, res) => {
    const { id } = req.params;
    let { name, coach, year } = req.body;

    if (!name || !coach || !year) {
        return res.status(400).json({
            message: "All fields (name, coach, year) are required!",
            success: false,
        });
    }

    try {
        name = name.trim();

     
        const [duplicate] = await db.query(
            "SELECT id FROM sports WHERE LOWER(sports_name) = ? AND id != ?",
            [name.toLowerCase(), id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({
                message: "Another sport with the same name already exists!",
                success: false,
            });
        }

      
        const [result] = await db.query(
            "UPDATE sports SET sports_name = ?, coach = ?, year = ? WHERE id = ?",
            [name, coach, year, id]
        );

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Sport not found", success: false });
        }

        return res
            .status(200)
            .json({ message: "Sport updated successfully", success: true });
    } catch (error) {
        console.error("Error updating sport:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


exports.deleteSport = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM sports WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Sport not found", success: false });
        }

        return res
            .status(200)
            .json({ message: "Sport deleted successfully", success: true });
    } catch (error) {
        console.error("Error deleting sport:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};


exports.sportsForOption = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, sports_name AS name FROM sports ORDER BY name ASC"
        );

        return res.status(200).json({
            message: "Sports fetched successfully",
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching sports options:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
