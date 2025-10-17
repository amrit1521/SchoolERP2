import { useEffect } from "react";
import { Imageurl } from "../../../../service/api";

export const PdfTemplate2 = ({
  studentItem,
  exam,
}: {
  studentItem: any;
  exam: any;
}) => {
  const school = {
    name: "Little Flower School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };

  const getSubjectResults = (exams: any[]) => {
    if (!exams || exams.length === 0) return [];
    const sem1 = exams.find((e) => e.exam_name === "Semester1");
    const sem2 = exams.find((e) => e.exam_name === "Semester2");
    if (!sem1 || !sem2) return [];

    return sem1.subjects.map((sub1: any) => {
      const sub2 = sem2.subjects.find(
        (s2: any) => sub1.subject_name === s2.subject_name
      );
      return {
        subject_name: sub1.subject_name,
        max_mark_sem1: sub1.max_mark,
        max_mark_sem2: sub2 ? sub2.max_mark : 0,
        mark_obtained_sem1: sub1.mark_obtained,
        mark_obtained_sem2: sub2 ? sub2.mark_obtained : 0,
        grade_sem1: sub1.grade,
        grade_sem2: sub2 ? sub2.grade : "",
        result_sem1: sub1.result,
        result_sem2: sub2 ? sub2.result : "",
      };
    });
  };

  useEffect(() => {}, [studentItem, exam]);

  const combinedResults = getSubjectResults(exam);

  return (
    <div
      id={`pdf-content-${studentItem.rollnum}`}
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "20px 40px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <img
            src="/assets/img/media/lfsLogo.png"
            alt="School Logo"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "8px",
            }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <h2
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0",
              }}
            >
              {school.name}
            </h2>
            <p style={{ margin: "0" }}>{school.address}</p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              {school.affiliation}
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Phone: +91 8808498469 | Email: info@yourschoolname.com
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Visit: www.yourschoolwebsite.com
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src={`${Imageurl}/${studentItem.student_image}`}
              alt="Student"
              style={{
                width: "100px",
                height: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                objectFit: "cover",
              }}
            />
            <div>AdNo: {studentItem.stud_admNo}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <h4
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              margin: "0",
            }}
          >
            ACADEMIC REPORT
          </h4>
          <p style={{ margin: "0" }}>
            Academic Session:{" "}
            {studentItem.stud_academicYear?.split(" ")[1]?.replace("/", "-")}
          </p>
        </div>

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <p>
              <strong>Student Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Admission No:</strong> {studentItem.stud_admNo}
            </p>
            <p>
              <strong>Class & Section:</strong> {studentItem.class} -{" "}
              {studentItem.section?.toUpperCase()}
            </p>
            <p>
              <strong>Roll Number:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div>
            <p>
              <strong>Father's Name:</strong> {studentItem.father_name}
            </p>
            <p>
              <strong>Father's Mobile:</strong> {studentItem.phone_num}
            </p>
            <p>
              <strong>Address:</strong> {studentItem.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(studentItem.date_of_birth).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />

        <div style={{ overflowX: "auto", marginBottom: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th
                  rowSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Subject
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 1
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 2
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Total
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Grade
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Result
                </th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
              </tr>
            </thead>
            <tbody>
              {combinedResults.map((subject: any, idx: number) => {
                const totalMax = subject.max_mark_sem1 + subject.max_mark_sem2;
                const totalObt =
                  subject.mark_obtained_sem1 + subject.mark_obtained_sem2;
                const percentage = ((totalObt / totalMax) * 100).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";
                const finalGrade =
                  subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
                    ? "A+"
                    : "B";
                return (
                  <tr key={idx}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {subject.subject_name}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {totalObt}/{totalMax}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {finalGrade}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PdfTemplate1 = ({
  studentItem,
  exam,
}: {
  studentItem: any;
  exam: any;
}) => {
  const school = {
    name: "Little Flower School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };

  const getSubjectResults = (exams: any[]) => {
    if (!exams || exams.length === 0) return [];
    const sem1 = exams.find((e) => e.exam_name === "Semester1");
    const sem2 = exams.find((e) => e.exam_name === "Semester2");
    if (!sem1 || !sem2) return [];

    return sem1.subjects.map((sub1: any) => {
      const sub2 = sem2.subjects.find(
        (s2: any) => sub1.subject_name === s2.subject_name
      );
      return {
        subject_name: sub1.subject_name,
        max_mark_sem1: sub1.max_mark,
        max_mark_sem2: sub2 ? sub2.max_mark : 0,
        mark_obtained_sem1: sub1.mark_obtained,
        mark_obtained_sem2: sub2 ? sub2.mark_obtained : 0,
        grade_sem1: sub1.grade,
        grade_sem2: sub2 ? sub2.grade : "",
        result_sem1: sub1.result,
        result_sem2: sub2 ? sub2.result : "",
      };
    });
  };

  function calculateOverallGrade(grade1: any, grade2: any) {
    const gradeToValue: any = {
      "A+": 4.3,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      "D-": 0.7,
      F: 0.0,
    };

    function valueToGrade(value: any) {
      if (value >= 4.15) return "A+";
      else if (value >= 3.85) return "A";
      else if (value >= 3.55) return "A-";
      else if (value >= 3.15) return "B+";
      else if (value >= 2.85) return "B";
      else if (value >= 2.55) return "B-";
      else if (value >= 2.15) return "C+";
      else if (value >= 1.85) return "C";
      else if (value >= 1.55) return "C-";
      else if (value >= 1.15) return "D+";
      else if (value >= 0.85) return "D";
      else if (value >= 0.35) return "D-";
      else return "F";
    }

    const g1 = gradeToValue[grade1 ? grade1.toUpperCase() : ""];
    const g2 = gradeToValue[grade2 ? grade2.toUpperCase() : ""];

    if (g1 === undefined && g2 === undefined) {
      return "no grade.";
    } else if (g1 != undefined && g2 === undefined) return valueToGrade(g1);
    else if (g1 === undefined && g2 !== undefined) return valueToGrade(g2);

    const average = (g1 + g2) / 2;
    return valueToGrade(average);
  }

  useEffect(() => {}, [studentItem, exam]);

  const combinedResults = getSubjectResults(exam);

  return (
    <div
      id={`pdf-content-${studentItem.rollnum}`}
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "20px 40px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <img
            src="/assets/img/media/lfsLogo.png"
            alt="School Logo"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "8px",
            }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <h2
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0",
              }}
            >
              {school.name}
            </h2>
            <p style={{ margin: "0" }}>{school.address}</p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              {school.affiliation}
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Phone: +91 8808498469 | Email: info@whizlancer.com
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Visit: www.whizlancer.com
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              style={{
                width: "100px",
                height: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                objectFit: "cover",
                mixBlendMode: "darken",
              }}
              src={`${Imageurl}/${studentItem.student_image}`}
              className="img-fluid "
              alt="Student"
            />

            <div>AdNo: {studentItem.stud_admNo}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <h4
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              margin: "0",
            }}
          >
            ACADEMIC REPORT
          </h4>
          <p style={{ margin: "0" }}>
            Academic Session:{" "}
            {studentItem.academic_year?.split(" ")[1]?.replace("/", "-")}
          </p>
        </div>

        <hr className="border-1 border-dark" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <p>
              <strong>Student Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Admission No:</strong> {studentItem.stud_admNo}
            </p>
            <p>
              <strong>Class & Section:</strong> {studentItem.class} -{" "}
              {studentItem.section?.toUpperCase()}
            </p>
            <p>
              <strong>Roll Number:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div>
            <p>
              <strong>Father's Name:</strong> {studentItem?.father_name}
            </p>
            <p>
              <strong>Father's Mobile:</strong> {studentItem.phone_num}
            </p>
            <p>
              <strong>Address:</strong> {studentItem?.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(studentItem?.date_of_birth).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />

        <div style={{ overflowX: "auto", marginBottom: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th
                  rowSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Subject
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 1
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 2
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Total
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Grade
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Result
                </th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
                <th style={{ border: "1px solid #000", padding: "5px" }}></th>
              </tr>
            </thead>
            <tbody>
              {combinedResults.map((subject: any, idx: number) => {
                const totalMax = subject.max_mark_sem1 + subject.max_mark_sem2;
                const totalObt =
                  subject.mark_obtained_sem1 + subject.mark_obtained_sem2;
                const percentage = ((totalObt / totalMax) * 100).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";
                const finalGrade = calculateOverallGrade(
                  subject.grade_sem1,
                  subject.grade_sem2
                );
                return (
                  <tr key={idx}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {subject.subject_name}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {totalObt}/{totalMax}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {finalGrade}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {status}
                    </td>
                  </tr>
                );
              })}
              {(() => {
                const totalMax = combinedResults.reduce(
                  (sum: number, s: any) =>
                    sum + s.max_mark_sem1 + s.max_mark_sem2,
                  0
                );
                const totalObt = combinedResults.reduce(
                  (sum: number, s: any) =>
                    sum + s.mark_obtained_sem1 + s.mark_obtained_sem2,
                  0
                );
                const percentage = ((totalObt / totalMax) * 100).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";

                return (
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <strong>Rank:</strong> 30
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid #000",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <strong>Total Marks: </strong>
                      {totalMax}
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid #000",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <strong>Total Obtained: </strong>
                      {totalObt}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <strong>Percentage:</strong>
                      {percentage}%
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid #000",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      <span
                        className={`fw-bold ${
                          status === "Pass" ? "text-success" : "text-danger"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)</strong>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "5px",
            }}
          >
            <tbody>
              {[
                ["UNIFORM", "A"],
                ["ACTIVITIES", "A"],
                ["DIGITAL CLASS", "A"],
                ["WRITTEN SKILLS", "B"],
                ["SPEAKING SKILLS", "C"],
              ].map(([label, grade], i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {label}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            <div>Sign. of Class Teacher</div>
            <div>Sign. of Principal</div>
            <div>Sign. of Manager</div>
          </div>

          <strong>Grading Scale for Scholastic Areas:</strong>
          <p style={{ margin: "0" }}>
            Grades are awarded on an 8-point grading scale as follows:
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th>Marks Range (%)</th>
                <td>91–100</td>
                <td>81–90</td>
                <td>71–80</td>
                <td>61–70</td>
                <td>51–60</td>
                <td>41–50</td>
                <td>32–40</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Grade</th>
                <td>A+</td>
                <td>A</td>
                <td>B+</td>
                <td>B</td>
                <td>C+</td>
                <td>C</td>
                <td>D</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const DemoPdfTemplate1 = () => {
  const school = {
    name: "Little Flower School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
  };

  // Dummy student data
  const studentItem = {
    firstname: "Aarav",
    lastname: "Sharma",
    stud_admNo: "LFS2025-017",
    class: "8",
    section: "B",
    rollnum: "17",
    fat_name: "Rajesh Sharma",
    phone_num: "+91 9876543210",
    stud_address: "Gandhi Nagar, Motihari, Bihar",
    stud_dob: "2012-07-15",
    stud_academicYear: "Session 2025/2026",
    student_image: "https://randomuser.me/api/portraits/boys/31.jpg",
  };

  // Dummy exam data
  const exam = [
    {
      exam_name: "Semester1",
      subjects: [
        {
          subject_name: "English",
          max_mark: 100,
          mark_obtained: 88,
          grade: "A+",
          result: "Pass",
        },
        {
          subject_name: "Mathematics",
          max_mark: 100,
          mark_obtained: 92,
          grade: "A+",
          result: "Pass",
        },
        {
          subject_name: "Science",
          max_mark: 100,
          mark_obtained: 81,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "Social Studies",
          max_mark: 100,
          mark_obtained: 76,
          grade: "B+",
          result: "Pass",
        },
        {
          subject_name: "Computer",
          max_mark: 100,
          mark_obtained: 95,
          grade: "A+",
          result: "Pass",
        },
      ],
    },
    {
      exam_name: "Semester2",
      subjects: [
        {
          subject_name: "English",
          max_mark: 100,
          mark_obtained: 84,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "Mathematics",
          max_mark: 100,
          mark_obtained: 90,
          grade: "A+",
          result: "Pass",
        },
        {
          subject_name: "Science",
          max_mark: 100,
          mark_obtained: 86,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "Social Studies",
          max_mark: 100,
          mark_obtained: 79,
          grade: "B+",
          result: "Pass",
        },
        {
          subject_name: "Computer",
          max_mark: 100,
          mark_obtained: 97,
          grade: "A+",
          result: "Pass",
        },
      ],
    },
  ];

  const getSubjectResults = (exams: any[]) => {
    if (!exams || exams.length === 0) return [];
    const sem1 = exams.find((exam) => exam.exam_name === "Semester1");
    const sem2 = exams.find((exam) => exam.exam_name === "Semester2");
    if (!sem1 || !sem2) return [];

    return sem1.subjects.map((sub1: any) => {
      const sub2 = sem2.subjects.find(
        (s2: any) => sub1.subject_name === s2.subject_name
      );
      return {
        subject_name: sub1.subject_name,
        max_mark_sem1: sub1.max_mark,
        max_mark_sem2: sub2 ? sub2.max_mark : 0,
        mark_obtained_sem1: sub1.mark_obtained,
        mark_obtained_sem2: sub2 ? sub2.mark_obtained : 0,
        grade_sem1: sub1.grade,
        grade_sem2: sub2 ? sub2.grade : "",
        result_sem1: sub1.result,
        result_sem2: sub2 ? sub2.result : "",
      };
    });
  };

  useEffect(() => {
    console.log("Preview loaded with dummy data");
  }, []);

  const combinedResults = getSubjectResults(exam);

  return (
    <div
      id={`pdf-content-${studentItem.rollnum}`}
      className="pdf-template-container"
      style={{
        padding: "20px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        width: "fit-content",
      }}
    >
      <div
        className="position-relative d-flex flex-column"
        style={{
          padding: "20px 40px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <img
              src={school.logo}
              alt="School Logo"
              style={{
                width: "50px",
                height: "50px",
                marginRight: "20px",
                borderRadius: "8px",
                position: "relative",
                top: "20px",
              }}
            />
          </div>
          <div>
            <h2 className="fw-bold text-uppercase mb-1 text-primary text-center">
              {school.name}
            </h2>
            <div className="text-center">
              <p className="mb-0">{school.address}</p>
              <p className="mb-0 fst-italic">{school.affiliation}</p>
              <p className="mb-0 fst-italic">
                Phone: +91 8808498469 | Email: info@yourschoolname.com
              </p>
              <p className="mb-0 fst-italic">
                Visit: www.yourschoolwebsite.com
              </p>
            </div>
          </div>

          {/* Student Photo */}
          <div>
            <img
              src={studentItem.student_image}
              alt="Student"
              style={{
                width: "100px",
                height: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                objectFit: "cover",
                position: "relative",
                top: "40px",
              }}
            />
            <span
              style={{
                position: "relative",
                top: "40px",
                display: "block",
                textAlign: "center",
              }}
            >
              AdNo: {studentItem.stud_admNo}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center d-flex justify-content-center flex-column mb-4">
          <h4 className="fw-bold text-decoration-underline">ACADEMIC REPORT</h4>
          <p className="mb-0">
            Academic Session:{" "}
            {studentItem.stud_academicYear?.split(" ")[1].split("/").join("-")}
          </p>
        </div>

        <hr className="border-1 border-dark" />

        {/* STUDENT INFO */}
        <div className="row mb-1">
          <div className="col-md-8">
            <p>
              <strong>Student Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Admission No:</strong> {studentItem.stud_admNo}
            </p>
            <p>
              <strong>Class & Section:</strong> {studentItem.class} -{" "}
              {studentItem.section}
            </p>
            <p>
              <strong>Roll Number:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div className="col-md-4">
            <p>
              <strong>Father's Name:</strong> {studentItem.fat_name}
            </p>
            <p>
              <strong>Father's Mobile:</strong> {studentItem.phone_num}
            </p>
            <p>
              <strong>Address:</strong> {studentItem.stud_address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(studentItem.stud_dob).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />

        {/* MARKS TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th rowSpan={2}>Subject</th>
                <th colSpan={2}>Semester 1</th>
                <th colSpan={2}>Semester 2</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
              <tr>
                <th>Max</th>
                <th>Obt.</th>
                <th>Max</th>
                <th>Obt.</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {combinedResults.map((subject: any, subIndex: number) => {
                const totalMax = subject.max_mark_sem1 + subject.max_mark_sem2;
                const totalObt =
                  subject.mark_obtained_sem1 + subject.mark_obtained_sem2;
                const percentage = ((totalObt / totalMax) * 100).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";
                const finalGrade =
                  subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
                    ? "A+"
                    : "B";
                return (
                  <tr key={subIndex}>
                    <td className="text-start">{subject.subject_name}</td>
                    <td>{subject.max_mark_sem1}</td>
                    <td>{subject.mark_obtained_sem1}</td>
                    <td>{subject.max_mark_sem2}</td>
                    <td>{subject.mark_obtained_sem2}</td>
                    <td>
                      {totalObt}/{totalMax}
                    </td>
                    <td>{finalGrade}</td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          status === "Pass"
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CO-SCHOLASTIC */}
        <div className="mt-4">
          <strong>CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)</strong>
          <table className="table table-bordered mt-2">
            <tbody>
              {[
                ["UNIFORM", "A"],
                ["ACTIVITIES", "A"],
                ["DIGITAL CLASS", "A"],
                ["WRITTEN SKILLS", "B"],
                ["SPEAKING SKILLS", "C"],
              ].map(([label, grade], i) => (
                <tr key={i}>
                  <td>{label}</td>
                  <td className="text-center">{grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SIGNATURES & GRADING SCALE */}
        <div
          className="mt-4 p-3 border rounded"
          style={{ background: "#f9f9f9" }}
        >
          <div className="row text-center fw-semibold mb-4">
            <div className="col">Sign. of Class Teacher</div>
            <div className="col">Sign. of Principal</div>
            <div className="col">Sign. of Manager</div>
          </div>

          <strong>Grading Scale for Scholastic Areas:</strong>
          <p className="mb-1">
            Grades are awarded on an 8-point grading scale as follows:
          </p>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Marks Range (%)</th>
                <td>91–100</td>
                <td>81–90</td>
                <td>71–80</td>
                <td>61–70</td>
                <td>51–60</td>
                <td>41–50</td>
                <td>32–40</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Grade</th>
                <td>A+</td>
                <td>A</td>
                <td>B+</td>
                <td>B</td>
                <td>C+</td>
                <td>C</td>
                <td>D</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const DemoTemplate2 = () => {
  const school = {
    name: "Little Flower School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };

  const studentItem = {
    firstname: "John",
    lastname: "Doe",
    stud_admNo: "LF12345",
    stud_academicYear: "2024 / 2025",
    class: "10",
    section: "A",
    rollnum: "12",
    fat_name: "Michael Doe",
    phone_num: "+91 9876543210",
    stud_address: "123, Main Street, Champaran",
    stud_dob: "2008-04-15",
    student_image: "studentImage.jpg",
  };

  const exam = [
    {
      exam_name: "Semester1",
      subjects: [
        {
          subject_name: "Math",
          max_mark: 100,
          mark_obtained: 85,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "Science",
          max_mark: 100,
          mark_obtained: 90,
          grade: "A+",
          result: "Pass",
        },
        {
          subject_name: "English",
          max_mark: 100,
          mark_obtained: 70,
          grade: "B",
          result: "Pass",
        },
      ],
    },
    {
      exam_name: "Semester2",
      subjects: [
        {
          subject_name: "Math",
          max_mark: 100,
          mark_obtained: 88,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "Science",
          max_mark: 100,
          mark_obtained: 80,
          grade: "A",
          result: "Pass",
        },
        {
          subject_name: "English",
          max_mark: 100,
          mark_obtained: 75,
          grade: "A",
          result: "Pass",
        },
      ],
    },
  ];

  const getSubjectResults = (exams: any[]) => {
    if (!exams || exams.length === 0) return [];
    const sem1 = exams.find((e) => e.exam_name === "Semester1");
    const sem2 = exams.find((e) => e.exam_name === "Semester2");
    if (!sem1 || !sem2) return [];

    return sem1.subjects.map((sub1: any) => {
      const sub2 = sem2.subjects.find(
        (s2: any) => sub1.subject_name === s2.subject_name
      );
      return {
        subject_name: sub1.subject_name,
        max_mark_sem1: sub1.max_mark,
        max_mark_sem2: sub2 ? sub2.max_mark : 0,
        mark_obtained_sem1: sub1.mark_obtained,
        mark_obtained_sem2: sub2 ? sub2.mark_obtained : 0,
        grade_sem1: sub1.grade,
        grade_sem2: sub2 ? sub2.grade : "",
        result_sem1: sub1.result,
        result_sem2: sub2 ? sub2.result : "",
      };
    });
  };

  useEffect(() => {}, [studentItem, exam]);

  const combinedResults = getSubjectResults(exam);

  return (
    <div
      id={`pdf-content-${studentItem.rollnum}`}
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        width: "40vw",
      }}
    >
      <div
        style={{
          padding: "20px 40px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "fit-content",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            width: "100%",
          }}
        >
          <img
            src="/assets/img/media/lfsLogo.png"
            alt="School Logo"
            style={{ width: "100px", height: "100px", borderRadius: "8px" }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <h2
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0",
              }}
            >
              {school.name}
            </h2>
            <p style={{ margin: "0" }}>{school.address}</p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              {school.affiliation}
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Phone: +91 8808498469 | Email: info@yourschoolname.com
            </p>
            <p style={{ margin: "0", fontStyle: "italic" }}>
              Visit: www.yourschoolwebsite.com
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src={`/assets/img/media/${studentItem.student_image}`}
              alt="Student"
              style={{
                width: "100px",
                height: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                objectFit: "cover",
              }}
            />
            <div>AdNo: {studentItem.stud_admNo}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <h4
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              margin: "0",
            }}
          >
            ACADEMIC REPORT
          </h4>
          <p style={{ margin: "0" }}>
            Academic Session: {studentItem.stud_academicYear?.replace("/", "-")}
          </p>
        </div>

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <p>
              <strong>Student Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Admission No:</strong> {studentItem.stud_admNo}
            </p>
            <p>
              <strong>Class & Section:</strong> {studentItem.class} -{" "}
              {studentItem.section}
            </p>
            <p>
              <strong>Roll Number:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div>
            <p>
              <strong>Father's Name:</strong> {studentItem.fat_name}
            </p>
            <p>
              <strong>Father's Mobile:</strong> {studentItem.phone_num}
            </p>
            <p>
              <strong>Address:</strong> {studentItem.stud_address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(studentItem.stud_dob).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />

        <div style={{ overflowX: "auto", marginBottom: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th
                  rowSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Subject
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 1
                </th>
                <th
                  colSpan={2}
                  style={{ border: "1px solid #000", padding: "5px" }}
                >
                  Semester 2
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Total
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Grade
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Result
                </th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Max
                </th>
                <th style={{ border: "1px solid #000", padding: "5px" }}>
                  Obt.
                </th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {combinedResults.map((subject: any, idx: number) => {
                const totalMax = subject.max_mark_sem1 + subject.max_mark_sem2;
                const totalObt =
                  subject.mark_obtained_sem1 + subject.mark_obtained_sem2;
                const percentage = ((totalObt / totalMax) * 100).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";
                const finalGrade =
                  subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
                    ? "A+"
                    : "B";

                return (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.subject_name}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem1}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.max_mark_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {subject.mark_obtained_sem2}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {totalObt}/{totalMax}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {finalGrade}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "5px" }}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
