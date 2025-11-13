
const db = require('../../config/db');


exports.getSpecTeacherAttendance = async (req, res) => {
    const {id} = req.params;
  try {
    const sql = `
      SELECT  
        t.teacher_id, 
        t.img_src,
        u.firstname,
        u.lastname,
        SUM(CASE WHEN ta.attendance = 'Present' THEN 1 ELSE 0 END) AS Present,
        SUM(CASE WHEN ta.attendance = 'Late' THEN 1 ELSE 0 END) AS Late,
        SUM(CASE WHEN ta.attendance = 'Absent' THEN 1 ELSE 0 END) AS Absent,
        SUM(CASE WHEN ta.attendance = 'Halfday' THEN 1 ELSE 0 END) AS Halfday,
        SUM(CASE WHEN ta.attendance = 'Holiday' THEN 1 ELSE 0 END) AS Holiday,
        COUNT(ta.id) AS TotalDays
      FROM teacher_attendance_info ta
      JOIN teachers t ON ta.teacher_id = t.teacher_id
      JOIN users u ON u.id = t.user_id
      Where ta.teacher_id = ?
      `;

    const [rows] = await db.query(sql,[id]);

    const report = rows.map((r) => {
      const Present = Number(r.Present) || 0;
      const Late = Number(r.Late) || 0;
      const Absent = Number(r.Absent) || 0;
      const Halfday = Number(r.Halfday) || 0;
      const Holiday = Number(r.Holiday) || 0;
      const TotalDays = Number(r.TotalDays) || 0; 
      const totalWorkingDays = TotalDays - Holiday;
      const totalPresentDays = Present + Late  + (Halfday * 0.5);
      const percentage =
        totalWorkingDays > 0
          ? ((totalPresentDays / totalWorkingDays) * 100).toFixed(1)
          : "0.0";
      return {
        rollNo: r.roll_no,
        name: `${r.firstname} ${r.lastname} `,
        img:r.img_src,
        p:Present,
        l:Late,
        a:Absent,
        h:Halfday,
        f:Holiday,
        TotalDays,
        totalWorkingDays,
        totalPresentDays: totalPresentDays.toFixed(1),
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.getSpeTeacherDetails = async (req, res) => {

  const { userId } = req.params;

  try {
    const sql = `
      SELECT  
        t.id,
        t.user_id,
        t.teacher_id,
        t.subject,
        t.gender,
        t.blood_gp,
        t.date_of_join,
        t.fat_name,
        t.mot_name,
        t.dob,
        t.mari_status,
        t.lan_known,
        t.qualification,
        t.work_exp,
        t.prev_school,
        t.prev_school_addr,
        t.prev_school_num,
        t.address,
        t.perm_address,
        t.pan_or_id,
        t.other_info,
        t.facebook_link,
        t.instagram_link,
        t.linked_link,
        t.twitter_link,
        t.img_src,
        t.resume_src,
        t.letter_src,
        u.firstname,
        u.lastname,
        u.status,
        u.mobile,
        u.email,
        b.account_name,
        b.account_num,
        b.bank_name,
        b.ifsc_code,
        b.branch_name,
        h.hostel,
        h.room_num,
        hs.name as hostel_name,
        hsr.room_num as hostel_room_number,
        tp.route,
        tp.vehicle_num,
        tp.pickup_point,
        tr.routeName as route_name,
        tpp.pickPointName as pickup_pointName,
        vi.vehicle_no as vehical_number,
        pi.epf_no,
        pi.basic_salary,
        pi.contract_type,
        pi.work_sift,
        pi.work_location,
        pi.date_of_leave,
        cf.class_name AS fromclass,
        ct.class_name AS toclass,
        cc.class_name AS class,
        s.section_name AS section
      FROM teachers t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN bank_info b ON t.user_id =b.user_id
      LEFT JOIN hostel_info h ON t.user_id = h.user_id
      LEFT JOIN hostel hs ON hs.id = h.hostel
      LEFT JOIN hostel_room hsr ON hsr.id = h.room_num
      LEFT JOIN transport_info tp ON t.user_id =tp.user_id
      LEFT JOIN transport_routes tr ON tr.id = tp.route
      LEFT JOIN transport_pickupPoints tpp ON tpp.id = tp.pickup_point
      LEFT JOIN  vehicle_info vi ON vi.id = tp.vehicle_num  
      LEFT JOIN payroll_info pi ON t.user_id = pi.user_id
       LEFT JOIN classes cf ON t.fromclass = cf.id
      LEFT JOIN classes ct ON t.toclass = ct.id
      LEFT JOIN classes cc ON t.class = cc.id
      LEFT JOIN sections s ON t.section = s.id
      WHERE t.user_id=?
    `;

    const [rows] = await db.query(sql, [userId]);
    return res.status(200).json({
      success: true,
      message: "Teacher fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};