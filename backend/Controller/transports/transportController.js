import db from "../../config/db.js";

export const addRotutes = async (req, res) => {
  const { keyId, routeName, status, addedOn } = req.body;
  try {
    const sql =
      "INSERT INTO transport_routes (keyId, routeName, status, addedOn) VALUES (?, ?, ?, ?)";
    const [rows] = await db.query(sql, [keyId, routeName, status, addedOn]);
    console.log("result: ", rows);
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
    const sql =
      "Select tr.id,tr.keyId,tr.routeName,tr.status,tr.addedOn from transport_routes tr";
    const [rows] = await db.query(sql);
    console.log("result: ", rows);
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
      "Select tr.id,tr.keyId,tr.routeName,tr.status,tr.addedOn from transport_routes tr where id=?";
    const [rows] = await db.query(sql, [id]);
    console.log("result: ", rows);
    if (rows) {
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
    const sql =
      "UPDATE transport_routes SET routeName=?,status=? where id=?";

    const [rows] = await db.query(sql,[routeName,status,id]);
    console.log("result: ", rows);
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
