import { Imageurl } from "../../../service/api";

// Common school data
const schoolData = {
  name: "Little Flower School",
  address: "Kaila, District East Champaran",
  affiliation: "Affiliated to Bihar School Examination Board, Patna",
};

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

// Template 1 - Modern Design
export const PdfTemplate1 = ({
  studentItem,
  exam,
}: {
  studentItem: any;
  exam: any;
}) => {
  const combinedResults = getSubjectResults(exam);
  const school = {
    name: "Little  Flower  School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };
  // useEffect(() => {
  //   console.log("Template 1 loaded with:", studentItem);
  // }, [studentItem]);

  // Calculate totals
  // const totalMax = combinedResults.reduce(
  //   (sum: number, s: any) => sum + s.max_mark_sem1 + s.max_mark_sem2,
  //   0
  // );
  // const totalObt = combinedResults.reduce(
  //   (sum: number, s: any) => sum + s.mark_obtained_sem1 + s.mark_obtained_sem2,
  //   0
  // );
  // const percentage =
  //   totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) : "0.00";

  return (
    <div
      id={`pdf-content-${studentItem.rollnum}`}
      className="pdf-template-container"
      style={{ background: "#fff", padding: "20px" }}
    >
      <div
        className="position-relative d-flex flex-column"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {/* ====== HEADER SECTION ====== */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <img
              src="/assets/img/media/lfsLogo.png"
              alt="School Logo"
              style={{
                width: "100px",
                height: "100px",
                marginRight: "20px",
                borderRadius: "8px",
                position: "relative",
                top: "40px",
                left: "20px",
              }}
            />
          </div>
          <div>
            <h2 className="fw-bold text-uppercase mb-1 text-primary">
              &nbsp; &nbsp; {school.name}
            </h2>
            <div className="text-center">
              <p className="mb-0">Dharoli, Chawli</p>
              <p className="mb-0 fst-italic">
                Affiliated to CBSE Board / Affiliation No: 2512A4S200
              </p>
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
              style={{
                mixBlendMode: "darken",
                width: "100px",
                height: "120px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundSize: "cover",
                position: "relative",
                top: "40px",
                right: "20px",
              }}
              src={`${Imageurl}/${studentItem.student_image}`}
              className="img-fluid "
              alt="img"
            />
            <span
              style={{
                position: "relative",
                top: "40px",
                display: "block",
                right: "20px",
              }}
            >
              AdNo: {studentItem.stud_admNo}
            </span>
          </div>
        </div>

        <div className="text-center d-flex justify-content-center flex-column mb-4">
          <h4 className="fw-bold text-decoration-underline">ACADEMIC REPORT</h4>
          <p className="mb-0">
            Academic Session:{" "}
            {studentItem.stud_academicYear?.split(" ")[1].split("/").join("-")}
          </p>
        </div>

        <hr className="border-1 border-dark" />

        {/* ====== STUDENT INFO ====== */}
        <div className="row mb-1">
          {/* <div className="col-md-1"></div> */}
          <div className="col-md-8">
            <div>
              <strong className="px-2">Student Name:</strong>{" "}
              {studentItem.firstname} {studentItem.lastname}
            </div>
            <div>
              <strong className="px-2">Admission No:</strong>{" "}
              {studentItem.stud_admNo}
            </div>
            <div>
              <strong className="px-2">Class & Section:</strong>{" "}
              {studentItem.class} - {studentItem.section.toUpperCase()}
            </div>
            <div>
              <strong className="px-2">Roll Number:</strong>{" "}
              {studentItem.rollnum}
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>Father's Name:</strong> {studentItem.fat_name}
            </div>
            <div>
              <strong>Father's Mobile:</strong> {studentItem.phone_num}
            </div>
            <div>
              <strong>Address:</strong> {studentItem.stud_address}
            </div>
            <div>
              <strong>date_of_birth:</strong>{" "}
              {new Date(studentItem.stud_dob)?.toLocaleDateString()}
            </div>
          </div>
        </div>

        <hr />

        {/* ====== MARKS TABLE ====== */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th rowSpan={2} className="border-none">
                  Subject
                </th>
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

              {/* ====== TOTALS ROW ====== */}
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
                  <tr className="fw-bold table-secondary border-top border-1">
                    <td>Rank: 30</td>
                    <td colSpan={2} className="border-top ">
                      Total Marks: {totalMax}
                    </td>
                    <td colSpan={2}>Total Obtained: {totalObt}</td>
                    <td>{percentage}%</td>
                    <td colSpan={2}>
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

        {/* ====== CO-SCHOLASTIC SECTION ====== */}
        <div className="mt-4">
          <strong className="px-1">
            CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)
          </strong>
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

        {/* ====== SIGNATURE & GRADING SCALE ====== */}
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

// Template 2 - Classic Design
export const PdfTemplate2 = ({
  studentItem,
  exam,
}: {
  studentItem: any;
  exam: any;
}) => {
  const combinedResults = getSubjectResults(exam);

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        fontSize: "12px",
        fontFamily: "Times New Roman, serif",
        width: "210mm",
        minHeight: "300mm",
        boxSizing: "border-box",
        border: "2px solid #8B4513",
      }}
    >
      {/* Classic Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          borderBottom: "3px double #8B4513",
        }}
      >
        <h2 style={{ fontSize: "20px", margin: "5px 0", color: "#8B4513" }}>
          {schoolData.name.toUpperCase()}
        </h2>
        <p style={{ fontSize: "11px", margin: "2px 0" }}>
          {schoolData.address}
        </p>
        <p style={{ fontSize: "10px", margin: 0, fontStyle: "italic" }}>
          {schoolData.affiliation}
        </p>
      </div>

      {/* Student Info */}
      <div style={{ marginBottom: "15px", fontSize: "11px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>
              <strong>Student Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Class & Section:</strong> {studentItem.class} -{" "}
              {studentItem.section}
            </p>
          </div>
          <div>
            <p>
              <strong>Roll Number:</strong> {studentItem.rollnum}
            </p>
            <p>
              <strong>Admission No:</strong> {studentItem.stud_admNo || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h3
          style={{
            fontSize: "18px",
            margin: "10px 0",
            textDecoration: "underline",
          }}
        >
          STATEMENT OF MARKS
        </h3>
        <p style={{ fontSize: "11px", margin: 0 }}>
          Academic Session: {studentItem.stud_academicYear || "N/A"}
        </p>
      </div>

      {/* Classic Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "10px",
          border: "2px solid #8B4513",
        }}
      >
        <thead>
          <tr style={{ background: "#DEB887" }}>
            <th
              style={{
                border: "1px solid #8B4513",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Subject
            </th>
            <th
              style={{
                border: "1px solid #8B4513",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Semester 1
            </th>
            <th
              style={{
                border: "1px solid #8B4513",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Semester 2
            </th>
            <th
              style={{
                border: "1px solid #8B4513",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Grade
            </th>
          </tr>
        </thead>
        <tbody>
          {combinedResults.map((subject: any, index: number) => (
            <tr
              key={index}
              style={{ background: index % 2 === 0 ? "#FAF0E6" : "#FFF8DC" }}
            >
              <td style={{ border: "1px solid #8B4513", padding: "6px" }}>
                {subject.subject_name}
              </td>
              <td
                style={{
                  border: "1px solid #8B4513",
                  padding: "6px",
                  textAlign: "center",
                }}
              >
                {subject.mark_obtained_sem1}/{subject.max_mark_sem1}
              </td>
              <td
                style={{
                  border: "1px solid #8B4513",
                  padding: "6px",
                  textAlign: "center",
                }}
              >
                {subject.mark_obtained_sem2}/{subject.max_mark_sem2}
              </td>
              <td
                style={{
                  border: "1px solid #8B4513",
                  padding: "6px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {subject.grade_sem1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Template 3 - Minimal Design
export const PdfTemplate3 = ({
  studentItem,
  exam,
}: {
  studentItem: any;
  exam: any;
}) => {
  const combinedResults = getSubjectResults(exam);

  return (
    <div
      style={{
        padding: "15px",
        background: "#fff",
        fontSize: "11px",
        fontFamily: "Arial, sans-serif",
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
      }}
    >
      {/* Minimal Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "15px",
          paddingBottom: "10px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h2 style={{ fontSize: "16px", margin: "5px 0", fontWeight: "300" }}>
          {schoolData.name}
        </h2>
        <p style={{ fontSize: "9px", margin: "2px 0", color: "#666" }}>
          {schoolData.address}
        </p>
      </div>

      {/* Minimal Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          fontSize: "10px",
        }}
      >
        <div>
          <p>
            <strong>Name:</strong> {studentItem.firstname}{" "}
            {studentItem.lastname}
          </p>
          <p>
            <strong>Class:</strong> {studentItem.class}-{studentItem.section}
          </p>
        </div>
        <div>
          <p>
            <strong>Roll No:</strong> {studentItem.rollnum}
          </p>
          <p>
            <strong>Session:</strong> {studentItem.stud_academicYear || "N/A"}
          </p>
        </div>
      </div>

      {/* Minimal Title */}
      <div style={{ textAlign: "center", margin: "15px 0" }}>
        <h3 style={{ fontSize: "14px", margin: "5px 0", fontWeight: "400" }}>
          Report Card
        </h3>
      </div>

      {/* Minimal Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "9px",
          marginBottom: "15px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            <th style={{ padding: "6px", textAlign: "left" }}>Subject</th>
            <th style={{ padding: "6px", textAlign: "center" }}>S1</th>
            <th style={{ padding: "6px", textAlign: "center" }}>S2</th>
            <th style={{ padding: "6px", textAlign: "center" }}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {combinedResults.map((subject: any, index: number) => (
            <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "5px" }}>{subject.subject_name}</td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                {subject.mark_obtained_sem1}
              </td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                {subject.mark_obtained_sem2}
              </td>
              <td
                style={{
                  padding: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {subject.grade_sem1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PdfTemplate1;

// const PdfTemplate1 = ({
//   studentItem,
//   exam,
// }: {
//   studentItem: any;
//   exam: any;
// }) => {
//   const school = {
//     name: "Little Flower School",
//     address: "Kaila, District East Champaran",
//     affiliation: "Affiliated to Bihar School Examination Board, Patna",
//   };

//   // Combine Semester 1 & 2 data
//   const getSubjectResults = (exams: any[]) => {
//     if (!exams || exams.length === 0) return [];
//     const sem1 = exams.find((exam) => exam.exam_name === "Semester1");
//     const sem2 = exams.find((exam) => exam.exam_name === "Semester2");
//     if (!sem1 || !sem2) return [];

//     return sem1.subjects.map((sub1: any) => {
//       const sub2 = sem2.subjects.find(
//         (s2: any) => sub1.subject_name === s2.subject_name
//       );
//       return {
//         subject_name: sub1.subject_name,
//         max_mark_sem1: sub1.max_mark,
//         max_mark_sem2: sub2 ? sub2.max_mark : 0,
//         mark_obtained_sem1: sub1.mark_obtained,
//         mark_obtained_sem2: sub2 ? sub2.mark_obtained : 0,
//         grade_sem1: sub1.grade,
//         grade_sem2: sub2 ? sub2.grade : "",
//         result_sem1: sub1.result,
//         result_sem2: sub2 ? sub2.result : "",
//       };
//     });
//   };

//   useEffect(() => {
//     console.log("Preview loaded with:", studentItem, exam);
//   }, [studentItem, exam]);

//   const combinedResults = getSubjectResults(exam);

//   return (
//     <div
//       className="pdf-template-container"
//       style={{
//         padding: "20px",
//         background: "#fff",
//         fontSize: "12px",
//         fontFamily: "Arial, sans-serif",
//         width: "210mm",
//         minHeight: "297mm",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* Header Section */}
//       <div
//         className="d-flex align-items-center justify-content-between mb-3"
//         style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}
//       >
//         <div className="d-flex align-items-center">
//           <img
//             src="/assets/img/media/lfsLogo.png"
//             alt="School Logo"
//             style={{
//               width: "100px",
//               height: "100px",
//               marginRight: "20px",
//               borderRadius: "8px",
//             }}
//             onError={(e) => {
//               // Fallback if image fails to load
//               (e.target as HTMLImageElement).style.display = "none";
//             }}
//           />
//         </div>
//         <div>
//           <h2
//             className="fw-bold text-uppercase mb-1 text-primary"
//             style={{ fontSize: "18px", margin: 0 }}
//           >
//             {school.name}
//           </h2>
//           <div className="text-center">
//             <p className="mb-0" style={{ fontSize: "11px" }}>
//               {school.address}
//             </p>
//             <p className="mb-0 fst-italic" style={{ fontSize: "10px" }}>
//               {school.affiliation}
//             </p>
//           </div>
//           {/* Academic Report Title */}
//           <div className="text-center mt-2">
//             <h4
//               className="fw-bold text-decoration-underline"
//               style={{ fontSize: "16px" }}
//             >
//               ACADEMIC REPORT
//             </h4>
//             <p className="mb-0" style={{ fontSize: "11px" }}>
//               Academic Session:{" "}
//               {studentItem.stud_academicYear
//                 ?.split(" ")[1]
//                 ?.split("/")
//                 .join("-") || "N/A"}
//             </p>
//           </div>
//         </div>
//         <div>
//           <img
//             style={{
//               mixBlendMode: "darken",
//               width: "100px",
//               height: "120px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//             src={`${Imageurl}/${studentItem.student_image}`}
//             className="img-fluid"
//             alt="Student"
//             onError={(e) => {
//               // Fallback if student image fails to load
//               (e.target as HTMLImageElement).src =
//                 "/assets/img/placeholder-student.png";
//             }}
//           />
//           <span
//             style={{
//               display: "block",
//               fontSize: "11px",
//               textAlign: "center",
//               marginTop: "5px",
//             }}
//           >
//             AdNo: {studentItem.stud_admNo}
//           </span>
//         </div>
//       </div>

//       <hr style={{ margin: "10px 0" }} />

//       {/* Student Information */}
//       <div className="row mb-1">
//         <div className="col-md-8">
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Student Name:</strong> {studentItem.firstname}{" "}
//             {studentItem.lastname}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Admission No:</strong> {studentItem.stud_admNo}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Class & Section:</strong> {studentItem.class} -{" "}
//             {studentItem.section}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Roll Number:</strong> {studentItem.rollnum}
//           </p>
//         </div>
//         <div className="col-md-4">
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Father's Name:</strong> {studentItem.fat_name || "N/A"}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Father's Mobile:</strong> {studentItem.phone_num || "N/A"}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Address:</strong> {studentItem.stud_address || "N/A"}
//           </p>
//           <p style={{ margin: "5px 0", fontSize: "11px" }}>
//             <strong>Date of Birth:</strong>{" "}
//             {studentItem.stud_dob
//               ? new Date(studentItem.stud_dob).toLocaleDateString()
//               : "N/A"}
//           </p>
//         </div>
//       </div>

//       <hr style={{ margin: "10px 0" }} />

//       {/* Marks Table */}
//       <div className="table-responsive">
//         <table
//           className="table table-bordered align-middle text-center"
//           style={{ fontSize: "10px" }}
//         >
//           <thead className="table-light">
//             <tr>
//               <th rowSpan={2} style={{ width: "20%" }}>
//                 Subject
//               </th>
//               <th colSpan={2}>Semester 1</th>
//               <th colSpan={2}>Semester 2</th>
//               <th>Total</th>
//               <th>Grade</th>
//               <th>Result</th>
//             </tr>
//             <tr>
//               <th>Max</th>
//               <th>Obt.</th>
//               <th>Max</th>
//               <th>Obt.</th>
//               <th></th>
//               <th></th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {combinedResults.map((subject: any, subIndex: number) => {
//               const totalMax = subject.max_mark_sem1 + subject.max_mark_sem2;
//               const totalObt =
//                 subject.mark_obtained_sem1 + subject.mark_obtained_sem2;
//               const percentage =
//                 totalMax > 0
//                   ? ((totalObt / totalMax) * 100).toFixed(2)
//                   : "0.00";
//               const status = Number(percentage) >= 33 ? "Pass" : "Fail";
//               const finalGrade =
//                 subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
//                   ? "A+"
//                   : "B";

//               return (
//                 <tr key={subIndex}>
//                   <td className="text-start">{subject.subject_name}</td>
//                   <td>{subject.max_mark_sem1}</td>
//                   <td>{subject.mark_obtained_sem1}</td>
//                   <td>{subject.max_mark_sem2}</td>
//                   <td>{subject.mark_obtained_sem2}</td>
//                   <td>
//                     {totalObt}/{totalMax}
//                   </td>
//                   <td>{finalGrade}</td>
//                   <td>
//                     <span
//                       style={{
//                         padding: "2px 8px",
//                         borderRadius: "4px",
//                         fontWeight: "bold",
//                         backgroundColor:
//                           status === "Pass" ? "#d1e7dd" : "#f8d7da",
//                         color: status === "Pass" ? "#0f5132" : "#842029",
//                         display: "inline-block",
//                       }}
//                     >
//                       {status}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}

//             {/* Totals Row */}
//             {(() => {
//               const totalMax = combinedResults.reduce(
//                 (sum: number, s: any) =>
//                   sum + s.max_mark_sem1 + s.max_mark_sem2,
//                 0
//               );
//               const totalObt = combinedResults.reduce(
//                 (sum: number, s: any) =>
//                   sum + s.mark_obtained_sem1 + s.mark_obtained_sem2,
//                 0
//               );
//               const percentage =
//                 totalMax > 0
//                   ? ((totalObt / totalMax) * 100).toFixed(2)
//                   : "0.00";
//               const status = Number(percentage) >= 33 ? "Pass" : "Fail";

//               return (
//                 <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
//                   <td>Rank: 30</td>
//                   <td colSpan={2}>Total Marks: {totalMax}</td>
//                   <td colSpan={2}>Total Obtained: {totalObt}</td>
//                   <td>{percentage}%</td>
//                   <td colSpan={2}>
//                     <span
//                       style={{
//                         color: status === "Pass" ? "#198754" : "#dc3545",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {status}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })()}
//           </tbody>
//         </table>
//       </div>

//       {/* Co-Scholastic Section */}
//       <div className="mt-4">
//         <strong style={{ fontSize: "11px" }}>
//           CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)
//         </strong>
//         <table
//           className="table table-bordered mt-2"
//           style={{ fontSize: "10px" }}
//         >
//           <tbody>
//             {[
//               ["UNIFORM", "A"],
//               ["ACTIVITIES", "A"],
//               ["DIGITAL CLASS", "A"],
//               ["WRITTEN SKILLS", "B"],
//               ["SPEAKING SKILLS", "C"],
//             ].map(([label, grade], i) => (
//               <tr key={i}>
//                 <td style={{ width: "70%" }}>{label}</td>
//                 <td className="text-center">{grade}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Signature & Grading Scale */}
//       <div
//         className="mt-4 p-3 border rounded"
//         style={{ background: "#f9f9f9", fontSize: "10px" }}
//       >
//         <div className="row text-center fw-semibold mb-4">
//           <div className="col">Sign. of Class Teacher</div>
//           <div className="col">Sign. of Principal</div>
//           <div className="col">Sign. of Manager</div>
//         </div>

//         <strong>Grading Scale for Scholastic Areas:</strong>
//         <p className="mb-1">
//           Grades are awarded on an 8-point grading scale as follows:
//         </p>
//         <table
//           className="table table-bordered text-center"
//           style={{ fontSize: "9px" }}
//         >
//           <thead className="table-light">
//             <tr>
//               <th>Marks Range (%)</th>
//               <td>91–100</td>
//               <td>81–90</td>
//               <td>71–80</td>
//               <td>61–70</td>
//               <td>51–60</td>
//               <td>41–50</td>
//               <td>32–40</td>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <th>Grade</th>
//               <td>A+</td>
//               <td>A</td>
//               <td>B+</td>
//               <td>B</td>
//               <td>C+</td>
//               <td>C</td>
//               <td>D</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const PdfTemplate5 = ({
//   studentItem,
//   index,
//   exam,
// }: {
//   studentItem: any;
//   index: number;
//   exam: any;
// }) => {
//   const school = {
//     name: "UDAY NARAYAN SIKSHAN SANSTHAN",
//     address: "Kaila, District East Champaran",
//     affiliation: "Affiliated to Bihar School Examination Board, Patna",
//   };
//   const getSubjectResults = (exams: any[]) => {
//     if (!exams || exams.length === 0) {
//       return [];
//     }

//     const semester1 = exams.find((exam) => exam.exam_name === "Semester1");
//     const semester2 = exams.find((exam) => exam.exam_name === "Semester2");

//     // Check if both semesters exist
//     if (!semester1 || !semester2) {
//       return []; // Return an empty array if either semester is missing
//     }

//     const combinedSubjects = semester1.subjects.map((subject1: any) => {
//       const correspondingSubject2 = semester2
//         ? semester2.subjects.find(
//             (subject2: any) => subject1.subject_name === subject2.subject_name
//           )
//         : null;

//       return {
//         subject_name: subject1.subject_name,
//         max_mark_sem1: subject1.max_mark,
//         max_mark_sem2: correspondingSubject2
//           ? correspondingSubject2.max_mark
//           : 0,
//         mark_obtained_sem1: subject1.mark_obtained,
//         mark_obtained_sem2: correspondingSubject2
//           ? correspondingSubject2.mark_obtained
//           : 0,
//         grade_sem1: subject1.grade,
//         grade_sem2: correspondingSubject2 ? correspondingSubject2.grade : "",
//         result_sem1: subject1.result,
//         result_sem2: correspondingSubject2 ? correspondingSubject2.result : "",
//       };
//     });

//     return combinedSubjects;
//   };

//   const combinedResults = getSubjectResults(exam);
//   return (
//     <div
//       id={`collapse${studentItem.rollnum}-${index}`}
//       className="accordion-collapse collapse"
//       data-bs-parent="#accordionExample"
//     >
//       {/* School Logo */}
//       <img
//         src="/assets/img/download-img.png"
//         alt="School Logo"
//         className="img-fluid"
//         style={{
//           position: "static",
//           display: "flex",
//           top: "0px",
//           left: "0px",
//         }}
//       />
//       <div
//         className="accordion-body position-relative"
//         style={{ padding: "20px", backgroundColor: "white" }}
//       >
//         <div className="container mt-4">
//           {/* School Header */}
//           <h2 className="text-uppercase text-center fw-bold">
//             Uday Narayan Sikshan Sansthan
//           </h2>
//           {/* School Info Section */}
//           <div className="d-flex flex-column justify-content-center mb-4">
//             <div className="text-center">
//               <p className="mb-0">Dharoli, Chawli</p>
//               <p className="mb-0 fst-italic">
//                 Affiliated to CBSE Board / Affiliation No: 2512A4S200
//               </p>
//               <p className="mb-0 fst-italic">
//                 Phone: +91 8808498469 | Email: info@yourschoolname.com
//               </p>
//               <p className="mb-0 fst-italic">
//                 Visit: www.yourschoolwebsite.com
//               </p>
//             </div>
//             <div className="text-center mt-4">
//               <h3>Academic Report</h3>
//               <p className="mt-2">Academic Session: 2019-2020</p>
//             </div>
//           </div>
//         </div>

//         {/* Divider Line */}
//         <hr className="border-dark border-2 mt-2" />

//         {/* Student Info */}
//         <div className="d-flex align-items-center justify-content-between">
//           <div style={{ marginBottom: "20px" }}>
//             <div>
//               <strong className="fw-bold">Student Name:</strong>{" "}
//               {studentItem.firstname} {studentItem.lastname}
//             </div>
//             <div>
//               <strong className="fw-bold">Class & Section:</strong>{" "}
//               {studentItem.class?.toUpperCase()} -{" "}
//               {studentItem.section?.toUpperCase()}
//             </div>
//             <div>
//               <strong className="fw-bold">Roll Number:</strong>{" "}
//               {studentItem.rollnum}
//             </div>
//           </div>
//           <div>
//             <div>
//               <strong className="fw-bold">Father's Name:</strong>{" "}
//               {studentItem.fat_name}
//             </div>
//             <div>
//               <strong className="fw-bold">Father's Mobile:</strong>{" "}
//               {studentItem.phone_num}
//             </div>
//           </div>
//         </div>

//         <hr />

//         {/* Table */}
//         <div className="table-responsive">
//           <table className="table">
//             <thead className="thead-light">
//               <tr>
//                 <th>Subject</th>
//                 <th colSpan={2} className="text-center">
//                   Semester 1
//                 </th>
//                 <th colSpan={2} className="text-center border-end">
//                   Semester 2
//                 </th>
//                 <th>Total Marks</th>
//                 <th>Grade</th>
//                 <th>Result</th>
//               </tr>
//               <tr>
//                 <th></th>
//                 <th>Max Marks</th>
//                 <th>Marks Obtained</th>
//                 <th>Max Marks</th>
//                 <th>Marks Obtained</th>
//                 <th></th>
//                 <th></th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {combinedResults.map((subject: any, subIndex: number) => {
//                 const totalMaxMarks =
//                   subject.max_mark_sem1 + subject.max_mark_sem2;
//                 const totalMarksObtained =
//                   subject.mark_obtained_sem1 + subject.mark_obtained_sem2;

//                 const percentage = (
//                   (totalMarksObtained / totalMaxMarks) *
//                   100
//                 ).toFixed(2);
//                 const status = Number(percentage) >= 33 ? "Pass" : "Fail";
//                 const finalGrade =
//                   subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
//                     ? "A+"
//                     : "B"; // Example grade logic

//                 return (
//                   <tr key={subIndex}>
//                     <td>{subject.subject_name}</td>
//                     <td>{subject.max_mark_sem1}</td>
//                     <td>{subject.mark_obtained_sem1}</td>
//                     <td>{subject.max_mark_sem2}</td>
//                     <td>{subject.mark_obtained_sem2}</td>
//                     <td>
//                       {totalMarksObtained} / {totalMaxMarks}
//                     </td>
//                     <td>{finalGrade}</td>
//                     <td className="text-end">
//                       <span
//                         className={`badge d-inline-flex align-items-center ${
//                           status === "Pass"
//                             ? "badge-soft-success"
//                             : "badge-soft-danger"
//                         }`}
//                       >
//                         <i className="ti ti-circle-filled fs-5 me-1" />
//                         {status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//               {/* Totals Row */}
//               {(() => {
//                 const totalMax = combinedResults.reduce(
//                   (sum: number, sub: any) =>
//                     sum + Number(sub.max_mark_sem1) + Number(sub.max_mark_sem2),
//                   0
//                 );
//                 const totalObtained = combinedResults.reduce(
//                   (sum: number, sub: any) =>
//                     sum +
//                     Number(sub.mark_obtained_sem1) +
//                     Number(sub.mark_obtained_sem2),
//                   0
//                 );
//                 const percentage = ((totalObtained / totalMax) * 100).toFixed(
//                   2
//                 );
//                 const status = Number(percentage) > 33 ? "Pass" : "Fail";
//                 return (
//                   <tr className="fw-bold border border-5">
//                     <td>Rank: 30</td>
//                     <td colSpan={2}>Total Marks: {totalMax}</td>
//                     <td>Total Obtained: {totalObtained}</td>
//                     <td className="text-end">Percentage: {percentage}%</td>
//                     <td
//                       className={`${
//                         status === "Pass" ? "text-success" : "text-danger"
//                       }`}
//                     >
//                       {status}
//                     </td>
//                   </tr>
//                 );
//               })()}
//             </tbody>
//           </table>
//         </div>
//         {/* Co-Scholastic */}
//         <div className="mt-4">
//           <strong>CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)</strong>
//           <table className="table table-bordered  mt-2">
//             <tbody>
//               <tr>
//                 <td>UNIFORM</td>
//                 <td>A</td>
//               </tr>
//               <tr>
//                 <td>ACTIVITIES</td>
//                 <td>A</td>
//               </tr>
//               <tr>
//                 <td>DIGITAL CLASS</td>
//                 <td>A</td>
//               </tr>
//               <tr>
//                 <td>WRITTEN SKILLS</td>
//                 <td>B</td>
//               </tr>
//               <tr>
//                 <td>SPEAKING SKILLS</td>
//                 <td>C</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div
//           className="mt-3 p-3 border rounded"
//           style={{ backgroundColor: "#f5f5f5ff" }}
//         >
//           {/* Signatures */}
//           <div className="row text-center mt-4 fw-semibold">
//             <div className="col">Sign. of Class Teacher</div>
//             <div className="col">Sign. of Principal</div>
//             <div className="col">Sign. of Manager</div>
//           </div>

//           {/* Grading Scale */}
//           <div className="mt-5">
//             <strong>Grading scale for scholastic areas:</strong>
//             <p>Grades are awarded on an 8-point grading scale as follows:</p>
//             <table className="table table-bordered text-center">
//               <thead className="table-light">
//                 <tr>
//                   <th>Marks Range (%)</th>
//                   <td>91–100</td>
//                   <td>81–90</td>
//                   <td>71–80</td>
//                   <td>61–70</td>
//                   <td>51–60</td>
//                   <td>41–50</td>
//                   <td>32–40</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th>Grade</th>
//                   <td>A+</td>
//                   <td>A</td>
//                   <td>B+</td>
//                   <td>B</td>
//                   <td>C+</td>
//                   <td>C</td>
//                   <td>D</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PdfTemplate2 = ({
//   studentItem,
//   index,
//   exam,
// }: {
//   studentItem: any;
//   index: number;
//   exam: any;
// }) => {
//   const totalMax = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + Number(sub.max_mark),
//     0
//   );
//   const totalObtained = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + Number(sub.mark_obtained),
//     0
//   );
//   const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
//   const status = Number(percentage) > 33 ? "Pass" : "Fail";

//   return (
//     <div
//       id={`collapse${studentItem.rollnum}-${index}`}
//       className="accordion-collapse collapse"
//       data-bs-parent="#accordionExample"
//     >
//       <div
//         className="accordion-body p-4"
//         style={{ background: "#f9f9f9", fontFamily: "Arial, sans-serif" }}
//       >
//         <div className="text-center mb-4">
//           <img
//             src="/assets/img/download-img.png"
//             alt="School Logo"
//             style={{ height: "80px" }}
//           />
//           <h2 className="mt-2 mb-0">Whizlancer International School</h2>
//           <small className="text-muted">Gorakhpur, Uttar Pradesh</small>
//         </div>

//         <div className="d-flex justify-content-between bg-white shadow-sm rounded p-3 mb-4">
//           <div>
//             <p>
//               <strong>Name:</strong> {studentItem.firstname}{" "}
//               {studentItem.lastname}
//             </p>
//             <p>
//               <strong>Class:</strong> {studentItem.class} -{" "}
//               {studentItem.section}
//             </p>
//             <p>
//               <strong>Roll No:</strong> {studentItem.rollnum}
//             </p>
//           </div>
//           <div>
//             <p>
//               <strong>Father's Name:</strong> {studentItem.fat_name}
//             </p>
//             <p>
//               <strong>Contact:</strong> {studentItem.phone_num}
//             </p>
//           </div>
//         </div>

//         <table className="table table-bordered text-center bg-white shadow-sm">
//           <thead className="table-primary">
//             <tr>
//               <th>Subject</th>
//               <th>Max</th>
//               <th>Min</th>
//               <th>Obtained</th>
//               <th>Grade</th>
//               <th>Result</th>
//             </tr>
//           </thead>
//           <tbody>
//             {exam.subjects.map((subject: any, i: number) => (
//               <tr key={i}>
//                 <td>{subject.subject_name}</td>
//                 <td>{subject.max_mark}</td>
//                 <td>{subject.min_mark}</td>
//                 <td>{subject.mark_obtained}</td>
//                 <td>{subject.grade}</td>
//                 <td
//                   className={
//                     subject.result === "Pass" ? "text-success" : "text-danger"
//                   }
//                 >
//                   {subject.result}
//                 </td>
//               </tr>
//             ))}
//             <tr className="fw-bold table-secondary">
//               <td>Rank: 30</td>
//               <td colSpan={2}>Total: {totalMax}</td>
//               <td>Obtained: {totalObtained}</td>
//               <td>Per: {percentage}%</td>
//               <td
//                 className={status === "Pass" ? "text-success" : "text-danger"}
//               >
//                 {status}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="alert alert-warning mt-3">
//           <strong>Disclaimer:</strong> Results are provisional and subject to
//           change based on further review.
//         </div>
//       </div>
//     </div>
//   );
// };

// const PdfTemplate3 = ({
//   studentItem,
//   index,
//   exam,
// }: {
//   studentItem: any;
//   index: number;
//   exam: any;
// }) => {
//   const totalMax = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + Number(sub.max_mark),
//     0
//   );
//   const totalObtained = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + Number(sub.mark_obtained),
//     0
//   );
//   const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
//   const status = Number(percentage) > 33 ? "Pass" : "Fail";

//   return (
//     <div
//       id={`collapse${studentItem.rollnum}-${index}`}
//       className="accordion-collapse collapse"
//       data-bs-parent="#accordionExample"
//     >
//       <div
//         className="accordion-body d-flex"
//         style={{ fontFamily: "Segoe UI", background: "#fff" }}
//       >
//         <div
//           style={{
//             width: "250px",
//             background: "#003366",
//             color: "#fff",
//             padding: "20px",
//             borderRadius: "10px 0 0 10px",
//           }}
//         >
//           <img
//             src="/assets/img/download-img.png"
//             alt="School Logo"
//             style={{ width: "100%" }}
//           />
//           <h5 className="mt-3">Student Info</h5>
//           <hr style={{ borderColor: "#fff" }} />
//           <p>
//             <strong>Name:</strong>
//             <br /> {studentItem.firstname} {studentItem.lastname}
//           </p>
//           <p>
//             <strong>Class:</strong>
//             <br /> {studentItem.class} - {studentItem.section}
//           </p>
//           <p>
//             <strong>Roll No:</strong>
//             <br /> {studentItem.rollnum}
//           </p>
//           <p>
//             <strong>Father's Name:</strong>
//             <br /> {studentItem.fat_name}
//           </p>
//           <p>
//             <strong>Phone:</strong>
//             <br /> {studentItem.phone_num}
//           </p>
//         </div>

//         <div className="flex-grow-1 p-4">
//           <div className="text-center mb-4">
//             <h2>Whizlancer International School</h2>
//             <p className="text-muted">Gorakhpur, Uttar Pradesh</p>
//           </div>

//           <table className="table table-striped table-bordered">
//             <thead className="table-dark text-white">
//               <tr>
//                 <th>Subject</th>
//                 <th>Max</th>
//                 <th>Min</th>
//                 <th>Obtained</th>
//                 <th>Grade</th>
//                 <th>Result</th>
//               </tr>
//             </thead>
//             <tbody>
//               {exam.subjects.map((subject: any, i: number) => (
//                 <tr key={i}>
//                   <td>{subject.subject_name}</td>
//                   <td>{subject.max_mark}</td>
//                   <td>{subject.min_mark}</td>
//                   <td>{subject.mark_obtained}</td>
//                   <td>{subject.grade}</td>
//                   <td
//                     className={
//                       subject.result === "Pass" ? "text-success" : "text-danger"
//                     }
//                   >
//                     {subject.result}
//                   </td>
//                 </tr>
//               ))}
//               <tr className="fw-bold bg-light">
//                 <td>Rank: 30</td>
//                 <td colSpan={2}>Total: {totalMax}</td>
//                 <td>Obtained: {totalObtained}</td>
//                 <td>Per: {percentage}%</td>
//                 <td
//                   className={status === "Pass" ? "text-success" : "text-danger"}
//                 >
//                   {status}
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           <div className="mt-3 p-3 border border-warning bg-light rounded">
//             <strong>Disclaimer:</strong> The results shown are provisional and
//             for informational use only.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
