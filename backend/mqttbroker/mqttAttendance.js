const mqtt = require('mqtt');
const db = require('../config/db');

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connected to MQTT Broker");
    client.subscribe("school/attendance"); 
});

client.on('message', async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const today = new Date().toISOString().split('T')[0];
        const rollNo = data.rollNo; 

      
        const studentCheckSql = `SELECT id FROM students WHERE rollnum=?`;
        const [studentRes] = await db.query(studentCheckSql, [rollNo]);

        if (studentRes.length === 0) {
            console.log(`❌ Invalid student: ${rollNo}`);
            return;
        }

        const checkSql = `
            SELECT id FROM attendance_info2
            WHERE student_rollnum=? AND attendance_date=?
        `;
        const [existing] = await db.query(checkSql, [rollNo, today]);

        if (existing.length > 0) {
            console.log(`⚠ Attendance already marked for ${rollNo}`);
            return;
        }

        const feeSql = `
            SELECT id FROM fees_assign
            WHERE student_rollnum=? AND status='0'
            LIMIT 1
        `;
        const [feeResult] = await db.query(feeSql, [rollNo]);

        let attendanceStatus = "Absent";
        if (feeResult.length === 0) {
            attendanceStatus = "Present"; 
        }

        
        const insertSql = `
            INSERT INTO attendance_info2
            (student_rollnum, attendance, attendance_date)
            VALUES (?, ?, ?)
        `;
        await db.query(insertSql, [rollNo, attendanceStatus, today]);
        console.log(`Attendance marked for ${rollNo}: ${attendanceStatus}`);

        
        const token = "STATIC-TOKEN-123";
        const deviceTopic = `school/attendance/token`;
        client.publish(deviceTopic, JSON.stringify({ token }), { qos: 1 }, (err) => {
            if (err) console.error("Error publishing token:", err);
            else console.log(`Token sent to device on topic: ${deviceTopic}`);
        });

    } catch (error) {
        console.error("❌ MQTT Attendance Error:", error);
    }
});

module.exports = client;