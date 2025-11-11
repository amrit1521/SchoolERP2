const { success } = require("zod");
const db = require("../../config/db");
const transporter = require("../../utils/sendEmail.js");
const cron = require("node-cron");
const moment = require("moment");
const path = require("path");

const sendNoticeMail = async (
  recipientRoles,
  title,
  message,
  attachments = []
) => {
  try {
    if (!Array.isArray(recipientRoles) || recipientRoles.length === 0) {
      console.warn("No recipient roles provided. Skipping email send.");
      return;
    }

    const placeholders = recipientRoles.map(() => "?").join(",");
    const sql = `SELECT email FROM users WHERE roll_id IN (${placeholders}) AND email IS NOT NULL`;
    const [rows] = await db.query(sql, recipientRoles);

    const emails = Array.isArray(rows) ? rows.map((r) => r.email).filter(Boolean) : [];
    if (emails.length === 0) {
      console.log("No valid recipient emails found.");
      return;
    }

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; 
                    overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <div style="background-color: #0d6efd; color: #ffffff; padding: 16px 24px;">
            <h2 style="margin: 0; font-size: 22px;">${title}</h2>
          </div>

          <div style="padding: 24px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.6;">
              Dear User,
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              ${message}
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              If you have any questions or need assistance, please contact us at 
              <a href="mailto:support@example.com" style="color: #0d6efd;">support@example.com</a>.
            </p>
            <p style="margin-top: 30px; font-size: 16px;">
              Best regards,<br/>
              <strong>The Admin Team</strong><br/>
              <span style="font-size: 14px; color: #6c757d;">whizlancer Organization</span>
            </p>
          </div>

          <div style="background-color: #f1f3f5; padding: 12px 24px; text-align: center; 
                      font-size: 13px; color: #6c757d;">
            &copy; ${new Date().getFullYear()} whizlancer Organization. All rights reserved.
          </div>
        </div>
      </div>
    `;

    const buildAttachments = (att) => {
      if (!att) return undefined;
      if (Array.isArray(att) && att.length > 0) {
        return att.map((file) => ({
          filename: path.basename(file),
          path: path.resolve(process.cwd(), file),
        }));
      }
      if (typeof att === "string" && att.trim()) {
        return [
          {
            filename: path.basename(att),
            path: path.resolve(process.cwd(), att),
          },
        ];
      }
      return undefined;
    };

    const mailAttachments = buildAttachments(attachments);

    console.log(`Sending notice mail to ${emails.length} recipients...`);
    const batchSize = 50;
    const delay = 1500;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (email) => {
          try {
            await transporter.sendMail({
              from: `"Admin Team" <${process.env.SMTP_USER}>`,
              to: email,
              subject: title,
              html: htmlTemplate,
              ...(mailAttachments ? { attachments: mailAttachments } : {}),
            });
            console.log(`Notice sent to ${email}`);
          } catch (err) {
            console.error(`Failed to send to ${email}:`, err.message || err);
          }
        })
      );

      if (i + batchSize < emails.length) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    console.log("All notice emails have been sent successfully!");
    return true;
  } catch (error) {
    console.error("Error in sendNoticeMail:", error);
    return false;
  }
};

const sendEventMail = async (
  recipientRoles,
  title,
  message,
  category,
  dateRange,
  timeRange,
  attachments = []
) => {
  try {
    if (!Array.isArray(recipientRoles) || recipientRoles.length === 0) {
      console.warn("No recipient roles provided. Skipping email send.");
      return;
    }

    const placeholders = recipientRoles.map(() => "?").join(",");
    const sql = `SELECT email FROM users WHERE roll_id IN (${placeholders}) AND email IS NOT NULL`;
    const [rows] = await db.query(sql, recipientRoles);

    if (!Array.isArray(rows)) {
      console.error("Database query did not return an array. Got:", rows);
      return;
    }

    const emails = rows.map((r) => r.email).filter(Boolean);
    if (emails.length === 0) {
      console.log("No valid recipient emails found.");
      return;
    }

    console.log(
      `🚀 Preparing to send event mail to ${emails.length} recipients...`
    );

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px;
                    overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <div style="background-color: #198754; color: #ffffff; padding: 16px 24px;">
            <h2 style="margin: 0; font-size: 22px;">${title}</h2>
            <p style="margin: 4px 0 0; font-size: 14px;">Category: ${category}</p>
            <p style="margin: 2px 0 0; font-size: 14px;">Date: ${dateRange}</p>
            <p style="margin: 2px 0 0; font-size: 14px;">Time: ${timeRange}</p>
          </div>

          <div style="padding: 24px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">${message}</p>
            <p style="font-size: 16px; line-height: 1.6;">
              For questions or support, contact
              <a href="mailto:support@example.com" style="color: #198754;">support@example.com</a>.
            </p>
            <p style="margin-top: 30px; font-size: 16px;">
              Best regards,<br/>
              <strong>The Admin Team</strong><br/>
              <span style="font-size: 14px; color: #6c757d;">whizlancer Organization</span>
            </p>
          </div>

          <div style="background-color: #f1f3f5; padding: 12px 24px; text-align: center;
                      font-size: 13px; color: #6c757d;">
            &copy; ${new Date().getFullYear()} whizlancer Organization. All rights reserved.
          </div>
        </div>
      </div>
    `;

    const batchSize = 50;
    const delay = 1500;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (email) => {
          try {
            await transporter.sendMail({
              from: `"Admin Team" <${process.env.SMTP_USER}>`,
              to: email,
              subject: title,
              html: htmlTemplate,
              ...(attachments?.length > 0 && {
                attachments: attachments?.map((file) => ({
                  filename: file,
                  path: `./${file}`,
                })),
              }),
            });
            console.log(`Event notice sent to ${email}`);
          } catch (err) {
            console.error(`Failed to send to ${email}:`, err.message);
          }
        })
      );

      if (i + batchSize < emails.length) {
        console.log(`Waiting ${delay / 1000}s before next batch...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    console.log("All event emails sent successfully!");
  } catch (error) {
    console.error("Error in sendEventMail:", error);
  }
};

cron.schedule("* * * * *", async () => {
  try {
    const [events] = await db.query(`
      SELECT *, 
      SUBSTRING_INDEX(event_date, '|', 1) AS start_date,
      SUBSTRING_INDEX(event_time, '|', 1) AS start_time
      FROM notifications
      WHERE type='event' 
        AND (mail_10min_sent = false OR mail_5hr_sent = false)
    `);

    const now = new Date();
    for (const event of events) {
      if (!event.mail_10min_sent) {
        const createdAt = new Date(event.created_at);
        const diffMs = now - createdAt;
        const diffMinutes = diffMs / 1000 / 60;
        console.log('10 min mail: ',diffMinutes);
        if (diffMinutes >= 10 && !event.mail_10min_sent) {
          const roles = [event.roll_id];
          await sendEventMail(
            roles,
            `[NEW EVENT] ${event.title}`,
            event.message,
            event.event_category,
            event.start_date,
            event.start_time,
            event.attachment
          );
          await db.execute(
            "UPDATE notifications SET mail_10min_sent = true WHERE id = ?",
            [event.id]
          );
          console.log("10-min mail sent to:", roles);
        }
      }

      if (!event.mail_5hr_sent) {
        const eventDateTimeStr = `${event.start_date} ${event.start_time}`;
        const eventDateTime = new Date(eventDateTimeStr);
        const diffMs = eventDateTime - now;
        const diffHours = diffMs / 1000 / 60 / 60;

        if (diffHours <= 5 && diffHours > 4.9) {
          const roles = [event.roll_id];
          await sendEventMail(
            roles,
            `[REMINDER] ${event.title}`,
            event.message,
            event.event_category,
            event.start_date,
            event.start_time,
            event.attachment
          );
          await db.execute(
            "UPDATE notifications SET mail_5hr_sent = true WHERE id = ?",
            [event.id]
          );
          console.log("5-hr mail sent to:", roles);
        }
      }
    }
  } catch (err) {
    console.error("Error in event scheduler:", err);
  }
});

cron.schedule("* * * * *", async () => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM notifications
      WHERE type = 'notice'
        AND mail_10min_sent = false
        AND created_at <= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    `);

    if (!rows || rows.length === 0) return;

    for (const notice of rows) {
      try {
        const roles = [notice.roll_id];
        await sendNoticeMail(roles, notice.title, notice.message, notice.attachment);

        await db.execute("UPDATE notifications SET mail_10min_sent = true WHERE id = ?", [
          notice.id,
        ]);

        console.log("10-min notice mail sent for notification id:", notice.id);
      } catch (err) {
        console.error("Failed to send 10-min notice mail for id:", notice.id, err);
      }
    }
  } catch (err) {
    console.error("Error in notice scheduler:", err);
  }
});

exports.addNotice = async (req, res) => {
  const { title, message, attachement, messageTo, docsId } = req.body;

  try {
    if (!messageTo || !Array.isArray(messageTo) || messageTo.length === 0) {
      return res.status(400).json({
        message: "messageTo must be a non-empty array",
        success: false,
      });
    }

    const insertSql = `
      INSERT INTO notifications (title, message, attachment, roll_id, type,mail_10min_sent, mail_5hr_sent)
      VALUES (?, ?, ?, ?, ?,false,false)
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

exports.getAllNotice = async (req, res) => {
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

    const now = moment();
    const mapped = rows.map((r) => {
      const created = moment(r.created_at);
      const days = now.diff(created, "days");
      return {
        ...r,
        days: `${Math.abs(days)} Days${days < 0 ? " (in future)" : ""}`,
      };
    });

    return res.status(200).json({
      message: "Notices fetched successfully",
      success: true,
      result: mapped,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateNotice = async (req, res) => {
  const { title, message, attachement, messageTo, docsId, noticeId } = req.body;
  try {
    if (!noticeId) {
      return res.status(400).json({
        message: "Notice ID is required",
        success: false,
      });
    }
    console.log("noticeId: ", noticeId, typeof noticeId);
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

    const updatePromises = messageTo.map((roleId, index) =>
      db.execute(updateSql, [
        title,
        message,
        attachement,
        JSON.parse(noticeId)[index],
        roleId,
      ])
    );

    const results = await Promise.all(updatePromises);

    if (docsId) {
      const updateFileSql = "UPDATE files SET status = 1 WHERE id = ?";
      await db.execute(updateFileSql, [docsId]);
    }
    await sendNoticeMail(messageTo, title, message, attachement);
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

exports.deleteNotice = async (req, res) => {
  try {
    const ids = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No IDs provided", success: false });
    }
    const sql = `DELETE from notifications where id=?`;
    const result = await db.execute(
      `SELECT attachment from notifications where id=?`,
      [ids[0]]
    );
    const deleteRequest = ids.map((id) => db.execute(sql, [id]));
    const [rows] = await Promise.all(deleteRequest);
    console.log("rows: ", rows);
    if (!rows) {
      return res.status(200).json({
        message: "No notices found",
        success: false,
        result: [],
      });
    }
    await db.execute(`DELETE from files where filename=?`, [
      result[0][0].attachment,
    ]);
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

exports.createEvent = async (req, res) => {
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
    const insertSql = `
      INSERT INTO notifications (title, message, attachment, roll_id, type, event_category, event_date, event_time,mail_10min_sent, mail_5hr_sent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,false,false)
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

exports.updateEvent = async (req, res) => {
  const {
    title,
    message,
    attachement,
    category,
    dateRange,
    timeRange,
    roles,
    docsId,
    eventId,
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
    await sendEventMail(
      roles,
      title,
      message,
      category,
      dateRange,
      timeRange,
      attachement
    );
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

exports.deleteEvent = async (req, res) => {
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

exports.getAllEvents = async (req, res) => {
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
      MAX(n.created_at) AS created_at,
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
    ORDER BY created_at DESC;
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

exports.getUpcomingEvents = async (req, res) => {
  try {
    const sql = `
      SELECT 
        JSON_ARRAYAGG(n.id) AS ids,
        n.title,
        n.message,
        n.attachment,
        n.event_category,
        n.event_date,
        n.event_time,
        MAX(n.created_at) AS created_at,
        JSON_ARRAYAGG(n.roll_id) AS role_ids
      FROM notifications n
      WHERE n.type = 'event'
        AND STR_TO_DATE(CONCAT(SUBSTRING_INDEX(n.event_date, '|', 1), ' ', SUBSTRING_INDEX(n.event_time, '|', 1)), '%Y-%m-%d %H:%i:%s') >= NOW()
      GROUP BY 
        n.title, 
        n.message, 
        n.attachment, 
        n.event_category, 
        n.event_date, 
        n.event_time
      ORDER BY created_at DESC;
    `;

    const [rows] = await db.execute(sql);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No upcoming events found",
        success: false,
        result: [],
      });
    }

    return res.status(200).json({
      message: "Upcoming events fetched successfully",
      success: true,
      result: rows,
    });

  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUpcomingEventsForSpecRole = async (req, res) => {
  const {rollId} = req.params;
  try {
    const sql = `
        SELECT 
          JSON_ARRAYAGG(n.id) AS ids,
          n.title,
          n.message,
          n.attachment,
          n.event_category,
          n.event_date,
          n.event_time,
          MAX(n.created_at) AS created_at,
          JSON_ARRAYAGG(n.roll_id) AS role_ids
        FROM notifications n
        WHERE n.type = 'event'
          AND n.roll_id = ?
        GROUP BY 
          n.title, 
          n.message, 
          n.attachment, 
          n.event_category, 
          n.event_date, 
          n.event_time
        ORDER BY created_at DESC;
    `;

    const [rows] = await db.execute(sql,[rollId]);
    const now = moment();
    const mapped = rows.map((r) => {
      const eventDateStr = r.event_date.split('|')[0];
      const eventTimeStr = r.event_time ? r.event_time.split('|')[0] : "00:00:00";

      const eventMoment = moment(`${eventDateStr} ${eventTimeStr}`, "YYYY-MM-DD HH:mm:ss");

      const daysLeft = eventMoment.diff(now, "days");
      return {
        ...r,
        days: `${Math.abs(daysLeft)} days ${daysLeft >= 0 ? "remaining" : "ago"}`,
      };
    });


    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No upcoming events found",
        success: false,
        result: [],
      });
    }

    return res.status(200).json({
      message: "Upcoming events fetched successfully",
      success: true,
      result: mapped,
    });

  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
