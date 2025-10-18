const db = require("../../config/db");
const dayjs = require('dayjs')

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

// players 
exports.addPlayer = async (req, res) => {
    try {
        let { playerId, sportId, dateOfJoin } = req.body;


        if (!playerId) return res.status(400).json({ message: "Player is required!", success: false });
        if (!sportId) return res.status(400).json({ message: "Sport is required!", success: false });
        if (!dateOfJoin) return res.status(400).json({ message: "Date of Join is required!", success: false });


        const [existing] = await db.query(
            "SELECT id FROM players WHERE player_id = ? AND sport_id = ?",
            [playerId, sportId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "This player is already assigned to this sport!", success: false });
        }

        const joinDate = dayjs(dateOfJoin).format('YYYY-MM-DD')

        const [result] = await db.query(
            "INSERT INTO players (player_id, sport_id, date_of_join) VALUES (?, ?, ?)",
            [playerId, sportId, joinDate]
        );

        return res.status(201).json({ message: "Player added successfully", success: true, id: result.insertId });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get all players
exports.getPlayers = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
             p.id,
             s.sports_name AS sports,
             p.date_of_join AS dateOfJoin,
             st.rollnum,
             st.stu_img,
             CONCAT( u.firstname , ' ' ,  u.lastname) AS name
            FROM players p 
            JOIN sports s ON p.sport_id = s.id 
            JOIN students st ON p.player_id = st.stu_id
            JOIN users u ON p.player_id = u.id
            ORDER BY p.id ASC`
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT id, player_id, sport_id, date_of_join 
       FROM players WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Player not found", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Update player
exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    let { playerId, sportId, dateOfJoin } = req.body;

    if (!playerId) return res.status(400).json({ message: "Player is required!", success: false });
    if (!sportId) return res.status(400).json({ message: "Sport is required!", success: false });
    if (!dateOfJoin) return res.status(400).json({ message: "Date of Join is required!", success: false });

    try {
        const [duplicate] = await db.query(
            "SELECT id FROM players WHERE player_id = ? AND sport_id = ? AND id != ?",
            [playerId, sportId, id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({ message: "This player is already assigned to this sport!", success: false });
        }

        const joinDate = dayjs(dateOfJoin).format('YYYY-MM-DD')

        const [result] = await db.query(
            "UPDATE players SET player_id = ?, sport_id = ?, date_of_join = ? WHERE id = ?",
            [playerId, sportId, joinDate, id]
        );

        return res.status(200).json({ message: "Player updated successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Delete player
exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM players WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Player not found", success: false });
        }

        return res.status(200).json({ message: "Player deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Players for select options
exports.playersForOption = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT p.player_id AS value, CONCAT(u.firstname, ' ', u.lastname) AS label 
       FROM players p
       JOIN users u ON p.player_id = u.id
       ORDER BY label ASC`
        );

        return res.status(200).json({ message: "Players fetched successfully!", success: true, data: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

