import { success } from "zod";
import db from "../../config/db.js";

export const sendNoticeMail = (recipent:number[]) =>{
  const sql = `SELECT email from users where roll_id in(3,4,5)`;
}


// Notice api module:
export const addNotice = async (req, res) => {
  const { title, message, attachement, messageTo, docsId } = req.body;

  try {
    if (!messageTo || !Array.isArray(messageTo) || messageTo.length === 0) {
      return res.status(400).json({
        message: "messageTo must be a non-empty array",
        success: false,
      });
    }

    const insertSql = `
      INSERT INTO notifications (title, message, attachment, roll_id, type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const insertPromises = messageTo.map((id) =>
      db.execute(insertSql, [title, message, attachement, id, "notice"])
    );

    const results = await Promise.all(insertPromises);

    if (docsId) {
      const updateSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateSql, [docsId]);
    }

    return res.status(201).json({
      message: "Notice(s) created successfully.",
      success: true,
      result: results.map(([rows]) => rows),
    });
  } catch (error) {
    console.error("Error adding notice:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllNotice = async (req, res) => {
  try {
    const sql = `
      SELECT 
        JSON_ARRAYAGG(n.id) AS id,
        n.title,
        n.message,
        n.attachment,
        n.created_at,
        JSON_ARRAYAGG(n.roll_id) AS role_id
      FROM notifications n
      WHERE n.type = 'notice'
      GROUP BY n.title, n.message, n.attachment, n.created_at
      ORDER BY n.created_at DESC
    `;

    const [rows] = await db.execute(sql);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No notices found",
        success: false,
        result: [],
      });
    }

    return res.status(200).json({
      message: "Notices fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateNotice = async (req, res) => {
  const { title, message, attachement, messageTo, docsId, noticeId } = req.body;
  try {
    if (!noticeId) {
      return res.status(400).json({
        message: "Notice ID is required",
        success: false,
      });
    }
    console.log('noticeId: ',noticeId,typeof noticeId);
    if (!messageTo || !Array.isArray(messageTo) || messageTo.length === 0) {
      return res.status(400).json({
        message: "messageTo must be a non-empty array",
        success: false,
      });
    }

    const updateSql = `
      UPDATE notifications
      SET title = ?, message = ?, attachment = ?
      WHERE id = ? AND roll_id = ?
    `;

    const updatePromises = messageTo.map((roleId,index) =>
      db.execute(updateSql, [title, message, attachement,JSON.parse(noticeId)[index], roleId])
    );

    const results = await Promise.all(updatePromises);

    if (docsId) {
      const updateFileSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateFileSql, [docsId]);
    }

    return res.status(200).json({
      message: "Notice(s) updated successfully.",
      success: true,
      result: results.map(([rows]) => rows),
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};


export const deleteNotice = async (req,res) => {
  try {
    const ids = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided", success: false });
    }
    const sql =  `DELETE from notifications where id=?`;
    const result = await db.execute(`SELECT attachment from notifications where id=?`,[ids[0]]);
    const deleteRequest = ids.map((id) => db.execute(sql,[id]));
    const [rows] = await Promise.all(deleteRequest);
    console.log('rows: ',rows);
    if (!rows) {
      return res.status(200).json({
        message: "No notices found",
        success: false,
        result: [],
      });
    }
    await db.execute(`DELETE from files where filename=?`,[result[0][0].attachment]);
    return res.status(200).json({
      message: "Notices deleted successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error deleting notices:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


//Events Api Module:

export const createEvent = async (req, res) => {
  const {
    title,
    message,
    attachement,
    category,
    dateRange,
    timeRange,
    roles,
    docsId,
  } = req.body;

  try {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        message: "roles must be a non-empty array",
        success: false,
      });
    }
    console.log('data: ',docsId, typeof docsId);
    const insertSql = `
      INSERT INTO notifications (title, message, attachment, roll_id, type, event_category, event_date, event_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertPromises = roles.map((id) =>
      db.execute(insertSql, [
        title,
        message,
        attachement || null,
        id,
        "event",
        category || null,
        dateRange || null,
        timeRange || null,
      ])
    );

    const results = await Promise.all(insertPromises);

    if (docsId) {
      const updateSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateSql, [docsId]);
    }

    return res.status(201).json({
      message: "Event(s) created successfully.",
      success: true,
      result: results.map(([rows]) => rows),
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


export const updateEvent = async (req, res) => {
  const {
    title,
    message,
    attachement,
    category,
    dateRange,
    timeRange,
    roles,
    docsId,
    eventId
  } = req.body;

  try {
    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required",
        success: false,
      });
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        message: "roles must be a non-empty array",
        success: false,
      });
    }

    const updateSql = `
      UPDATE notifications
      SET title = ?, message = ?, attachment = ?, event_category = ?, event_date = ?, event_time = ?
      WHERE id = ? AND roll_id = ?
    `;

    const updatePromises = roles.map((roleId, index) =>
      db.execute(updateSql, [
        title,
        message,
        attachement,
        category || null,
        dateRange || null,
        timeRange || null,
        JSON.parse(eventId)[index],
        roleId,
      ])
    );

    const results = await Promise.all(updatePromises);

    if (docsId) {
      const updateFileSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateFileSql, [docsId]);
    }

    return res.status(200).json({
      message: "Event(s) updated successfully.",
      success: true,
      result: results.map(([rows]) => rows),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No IDs provided", success: false });
    }

    const selectSql = `SELECT attachment FROM notifications WHERE id = ?`;
    const deleteSql = `DELETE FROM notifications WHERE id = ?`;

    const [attachmentResult] = await db.execute(selectSql, [ids[0]]);
    const deleteRequests = ids.map((id) => db.execute(deleteSql, [id]));
    const [rows] = await Promise.all(deleteRequests);

    if (!rows) {
      return res.status(200).json({
        message: "No events found",
        success: false,
        result: [],
      });
    }

    if (attachmentResult && attachmentResult.length > 0) {
      await db.execute(`DELETE FROM files WHERE filename = ?`, [
        attachmentResult[0].attachment,
      ]);
    }

    return res.status(200).json({
      message: "Event(s) deleted successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error deleting events:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const sql = `
      SELECT 
        JSON_ARRAYAGG(n.id) AS id,
        n.title,
        n.message,
        n.attachment,
        n.event_category,
        n.event_date,
        n.event_time,
        n.created_at,
        JSON_ARRAYAGG(n.roll_id) AS role_id
      FROM notifications n
      WHERE n.type = 'event'
      GROUP BY 
        n.title, 
        n.message, 
        n.attachment, 
        n.event_category, 
        n.event_date, 
        n.event_time 
      ORDER BY n.created_at DESC
    `;

    const [rows] = await db.execute(sql);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No events found",
        success: false,
        result: [],
      });
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
