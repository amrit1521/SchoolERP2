
import db from "../../config/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.id as user_id, u.firstname,
             u.lastname,UPPER(c.class_name) as class,
             UPPER( se.section_name) as section,
             u.email, u.roll_id, r.role_name, u.status, u.remark, s.id AS student_id, s.stu_id, u.created_at as dateOfJoined
            FROM users u
            LEFT JOIN roles r ON u.roll_id = r.id
            LEFT JOIN students s ON u.id = s.stu_id
            LEFT JOIN classes  c ON c.id =  s.class_id
            LEFT JOIN sections se ON se.id = s.section_id
            `
    );
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No Users found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      result: rows.filter((rows) => rows.user_id !== 1),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSpecUsersById = async (req, res) => {
  const {id} = req.params;
  try {
    const sql = `SELECT u.id as user_id, u.firstname,
             u.lastname,UPPER(c.class_name) as class,
             UPPER( se.section_name) as section,
             u.email, u.roll_id, r.role_name, u.status, u.remark, s.id AS student_id, s.stu_id, u.created_at as dateOfJoined
            FROM users u
            LEFT JOIN roles r ON u.roll_id = r.id
            LEFT JOIN students s ON u.id = s.stu_id
            LEFT JOIN classes  c ON c.id =  s.class_id
            LEFT JOIN sections se ON se.id = s.section_id
            where u.id = ?
            `;
    const [rows] = await db.execute(
      sql,[id]
    );
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No Users found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "Delete from users where id=?";
    const [rows] = await db.execute(sql, [id]);
    if (!rows) {
      return res.status(200).json({
        message: "No users found.",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "user deleted successfully",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const sql = "Select * from roles";
    const [rows] = await db.execute(sql);
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No roles found",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "roles fetched successfully.",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoles = async (req, res) => {
  const { role_name, description } = req.body;
  if (!role_name) {
    return res.status(200).json({
      message: "No data found",
      success: false,
    });
  }
  try {
    const sql = "INSERT INTO roles (role_name,description) VALUES (?,?)";
    const [rows] = await db.execute(sql, [role_name, description]);

    if (!rows) {
      return res.status(200).json({
        message: "No roles found",
        success: false,
        result: rows,
      });
    }
    return res.status(201).json({
      message: "roles created successfully.",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error creating roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRoles = async (req, res) => {
  const { id } = req.params;
  const { role_name, description } = req.body;
  if (!role_name) {
    return res.status(200).json({
      message: "No data found",
      success: false,
    });
  }
  try {
    const sql = "UPDATE roles SET role_name=?,description=? where id=?";
    const [rows] = await db.execute(sql, [role_name, description, id]);

    if (!rows) {
      return res.status(200).json({
        message: "No roles found",
        success: false,
        result: rows,
      });
    }
    return res.status(200).json({
      message: "roles updated successfully.",
      success: true,
      result: rows,
    });
  } catch (error) {
    console.error("Error udpating roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Role ID is required.",
      success: false,
    });
  }

  try {
    const sql = "DELETE FROM roles WHERE id = ?";
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No role found with the given ID.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Role deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

//save permission:
export const savePermissions = async (req, res) => {
  const { role_id, permissions } = req.body;

  if ((!role_id && !Array.isArray(permissions)) || permissions.length === 0) {
    return res.status(400).json({
      message: "Invalid or missing data",
      success: false,
    });
  }
  console.log("permssion: ", permissions, role_id);
  try {
    for (const perm of permissions) {
      const {
        id: module_id,
        created,
        view,
        edit,
        delete: del,
        allowAll,
      } = perm;

      const [existing] = await db.execute(
        "SELECT id FROM role_module_permissions WHERE role_id = ? AND module_id = ?",
        [role_id, module_id]
      );

      if (existing.length > 0) {
        const sqlUpdate = `
          UPDATE role_module_permissions 
          SET can_create = ?, can_view = ?, can_edit = ?, can_delete = ?, can_allow_all = ?
          WHERE role_id = ? AND module_id = ?
        `;
        await db.execute(sqlUpdate, [
          created ? 1 : 0,
          view ? 1 : 0,
          edit ? 1 : 0,
          del ? 1 : 0,
          allowAll ? 1 : 0,
          role_id,
          module_id,
        ]);
      } else {
        const sqlInsert = `
          INSERT INTO role_module_permissions 
          (role_id, module_id, can_create, can_view, can_edit, can_delete, can_allow_all)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await db.execute(sqlInsert, [
          role_id,
          module_id,
          created ? 1 : 0,
          view ? 1 : 0,
          edit ? 1 : 0,
          del ? 1 : 0,
          allowAll ? 1 : 0,
        ]);
      }
    }

    return res.status(200).json({
      message: "Permissions saved successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error saving permissions:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllPermissionByRoleId = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `Select 
                  rmp.id,
                  rmp.role_id,
                  rmp.module_id,
                  rmp.can_create,
                  rmp.can_view,
                  rmp.can_edit,
                  rmp.can_edit,
                  rmp.can_delete,
                  rmp.can_allow_all,
                  m.name as module_name
                  from role_module_permissions rmp
                  LEFT JOIN modules m ON m.id = rmp.module_id
                  where role_id=?
              `;
    const [rows] = await db.execute(sql, [id]);
    if (rows.length < 0) {
      return res.status(200).json({
        message: "No permission found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "permission fetched successfully.",
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

//addModule:
export const addModule = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({
      message: "Invalid or missing data",
      success: false,
    });
  }
  try {
    const sql = "INSERT INTO modules (name, slug) VALUES (?, ?)";
    const [result] = await db.execute(sql, [name, slug]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Failed to create module",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Module created successfully.",
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllModule = async (req, res) => {
  try {
    const sql = "SELECT id,name from modules";
    const [rows] = await db.execute(sql);

    if (rows.length <= 0) {
      return res.status(400).json({
        message: "No module found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Module fetched successfully.",
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
