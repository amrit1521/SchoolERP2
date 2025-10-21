import db from "../../config/db.js";

export const addRotutes = async (req, res) => {
  const { keyId, routeName, status, addedOn } = req.body;
  try {
    const sql =
      "INSERT INTO transport_routes (routeName, status, addedOn) VALUES (?, ?, ?)";
    const [rows] = await db.query(sql, [routeName, status, addedOn]);
    return res.status(201).json({
      message: "Routes added successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllTransportRoutes = async (req, res) => {
  try {
    const sql = "Select id, routeName,status, addedOn from transport_routes";
    const [rows] = await db.query(sql);
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No Routes found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "Routes fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getTransportRoutesById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(200).json({
      message: "Route Id not passed.",
      success: false,
    });
  }
  try {
    const sql =
      "Select id,routeName,status,addedOn from transport_routes where id=?";
    const [rows] = await db.query(sql, [id]);
    console.log("result: ", rows);
    if (!rows) {
      return res.status(200).json({
        message: "No Routes found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "Routes fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateTransportRoutes = async (req, res) => {
  const { routeName, status } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(200).json({
      message: "Route Id not passed.",
      success: false,
    });
  }
  if (!routeName) {
    return res.status(200).json({
      message: "Not valid Data.",
      success: false,
    });
  }
  try {
    const sql = "UPDATE transport_routes SET routeName=?,status=? where id=?";

    const [rows] = await db.query(sql, [routeName, status, id]);
    console.log("updated: ", rows);
    if (!rows) {
      return res.status(200).json({
        message: "No Routes Updated.",
        success: false,
        result: rows,
      });
    }
    return res.status(201).json({
      message: "Routes updated successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteTransportRoutesById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(200).json({
      message: "Route Id not passed.",
      success: false,
    });
  }
  try {
    const sql = "Delete from transport_routes where id=?";
    const [rows] = await db.query(sql, [id]);
    if (!rows) {
      return res.status(200).json({
        message: "No Routes found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "Routes deleted successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// pickup points modules api:

export const addPickupPoints = async (req, res) => {
  const { route_id, status, addedOn, pickPointName } = req.body;

  if (!route_id || !pickPointName) {
    return res.status(400).json({
      message: "route_id and pickPointName are required fields.",
      success: false,
    });
  }

  try {
    const sql = `
      INSERT INTO transport_pickupPoints 
        (route_id, pickPointName, status, addedOn) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      route_id,
      pickPointName,
      status,
      addedOn,
    ]);

    return res.status(201).json({
      message: "Pickup point added successfully",
      success: true,
      result: {
        insertId: result.insertId,
        route_id,
        pickPointName,
        status,
        addedOn,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllPickupPoints = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM transport_pickupPoints ORDER BY id DESC"
    );
    return res.status(200).json({
      message: "Pickup points fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getPickupPointById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM transport_pickupPoints WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Pickup point not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Pickup point fetched successfully",
      success: true,
      result: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updatePickupPoint = async (req, res) => {
  const { id } = req.params;
  const { pickPointName, status, addedOn } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE transport_pickupPoints 
      SET pickPointName = ?, status = ?, addedOn = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
      `,
      [pickPointName, status, addedOn, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Pickup point not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Pickup point updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deletePickupPoint = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM transport_pickupPoints WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Pickup point not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Pickup point deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
