import { useEffect, useState } from "react";
import { Imageurl } from "../../../../service/api";

const PdfTemplate1 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const school = {
    name: "Little  Flower  School",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };

  // Combine Semester 1 & 2 data
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
    console.log("flksdjf");
  }, [studentItem]);
  const combinedResults = getSubjectResults(exam);

  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
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
                top: "20px",
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
              <strong>date_of_birth:</strong>{" "}
              {new Date(studentItem.stud_dob)?.toLocaleDateString()}
            </p>
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
const PdfTemplate5 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const school = {
    name: "UDAY NARAYAN SIKSHAN SANSTHAN",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };
  const getSubjectResults = (exams: any[]) => {
    if (!exams || exams.length === 0) {
      return [];
    }

    const semester1 = exams.find((exam) => exam.exam_name === "Semester1");
    const semester2 = exams.find((exam) => exam.exam_name === "Semester2");

    // Check if both semesters exist
    if (!semester1 || !semester2) {
      return []; // Return an empty array if either semester is missing
    }

    const combinedSubjects = semester1.subjects.map((subject1: any) => {
      const correspondingSubject2 = semester2
        ? semester2.subjects.find(
            (subject2: any) => subject1.subject_name === subject2.subject_name
          )
        : null;

      return {
        subject_name: subject1.subject_name,
        max_mark_sem1: subject1.max_mark,
        max_mark_sem2: correspondingSubject2
          ? correspondingSubject2.max_mark
          : 0,
        mark_obtained_sem1: subject1.mark_obtained,
        mark_obtained_sem2: correspondingSubject2
          ? correspondingSubject2.mark_obtained
          : 0,
        grade_sem1: subject1.grade,
        grade_sem2: correspondingSubject2 ? correspondingSubject2.grade : "",
        result_sem1: subject1.result,
        result_sem2: correspondingSubject2 ? correspondingSubject2.result : "",
      };
    });

    return combinedSubjects;
  };

  const combinedResults = getSubjectResults(exam);
  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      {/* School Logo */}
      <img
        src="/assets/img/download-img.png"
        alt="School Logo"
        className="img-fluid"
        style={{
          position: "static",
          display: "flex",
          top: "0px",
          left: "0px",
        }}
      />
      <div
        className="accordion-body position-relative"
        style={{ padding: "20px", backgroundColor: "white" }}
      >
        <div className="container mt-4">
          {/* School Header */}
          <h2 className="text-uppercase text-center fw-bold">
            Uday Narayan Sikshan Sansthan
          </h2>
          {/* School Info Section */}
          <div className="d-flex flex-column justify-content-center mb-4">
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
            <div className="text-center mt-4">
              <h3>Academic Report</h3>
              <p className="mt-2">Academic Session: 2019-2020</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-dark border-2 mt-2" />

        {/* Student Info */}
        <div className="d-flex align-items-center justify-content-between">
          <div style={{ marginBottom: "20px" }}>
            <div>
              <strong className="fw-bold">Student Name:</strong>{" "}
              {studentItem.firstname} {studentItem.lastname}
            </div>
            <div>
              <strong className="fw-bold">Class & Section:</strong>{" "}
              {studentItem.class?.toUpperCase()} -{" "}
              {studentItem.section?.toUpperCase()}
            </div>
            <div>
              <strong className="fw-bold">Roll Number:</strong>{" "}
              {studentItem.rollnum}
            </div>
          </div>
          <div>
            <div>
              <strong className="fw-bold">Father's Name:</strong>{" "}
              {studentItem.fat_name}
            </div>
            <div>
              <strong className="fw-bold">Father's Mobile:</strong>{" "}
              {studentItem.phone_num}
            </div>
          </div>
        </div>

        <hr />

        {/* Table */}
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Subject</th>
                <th colSpan={2} className="text-center">
                  Semester 1
                </th>
                <th colSpan={2} className="text-center border-end">
                  Semester 2
                </th>
                <th>Total Marks</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
              <tr>
                <th></th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {combinedResults.map((subject: any, subIndex: number) => {
                const totalMaxMarks =
                  subject.max_mark_sem1 + subject.max_mark_sem2;
                const totalMarksObtained =
                  subject.mark_obtained_sem1 + subject.mark_obtained_sem2;

                const percentage = (
                  (totalMarksObtained / totalMaxMarks) *
                  100
                ).toFixed(2);
                const status = Number(percentage) >= 33 ? "Pass" : "Fail";
                const finalGrade =
                  subject.grade_sem1 === "A+" || subject.grade_sem2 === "A+"
                    ? "A+"
                    : "B"; // Example grade logic

                return (
                  <tr key={subIndex}>
                    <td>{subject.subject_name}</td>
                    <td>{subject.max_mark_sem1}</td>
                    <td>{subject.mark_obtained_sem1}</td>
                    <td>{subject.max_mark_sem2}</td>
                    <td>{subject.mark_obtained_sem2}</td>
                    <td>
                      {totalMarksObtained} / {totalMaxMarks}
                    </td>
                    <td>{finalGrade}</td>
                    <td className="text-end">
                      <span
                        className={`badge d-inline-flex align-items-center ${
                          status === "Pass"
                            ? "badge-soft-success"
                            : "badge-soft-danger"
                        }`}
                      >
                        <i className="ti ti-circle-filled fs-5 me-1" />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              {(() => {
                const totalMax = combinedResults.reduce(
                  (sum: number, sub: any) =>
                    sum + Number(sub.max_mark_sem1) + Number(sub.max_mark_sem2),
                  0
                );
                const totalObtained = combinedResults.reduce(
                  (sum: number, sub: any) =>
                    sum +
                    Number(sub.mark_obtained_sem1) +
                    Number(sub.mark_obtained_sem2),
                  0
                );
                const percentage = ((totalObtained / totalMax) * 100).toFixed(
                  2
                );
                const status = Number(percentage) > 33 ? "Pass" : "Fail";
                return (
                  <tr className="fw-bold border border-5">
                    <td>Rank: 30</td>
                    <td colSpan={2}>Total Marks: {totalMax}</td>
                    <td>Total Obtained: {totalObtained}</td>
                    <td className="text-end">Percentage: {percentage}%</td>
                    <td
                      className={`${
                        status === "Pass" ? "text-success" : "text-danger"
                      }`}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
        {/* Co-Scholastic */}
        <div className="mt-4">
          <strong>CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)</strong>
          <table className="table table-bordered  mt-2">
            <tbody>
              <tr>
                <td>UNIFORM</td>
                <td>A</td>
              </tr>
              <tr>
                <td>ACTIVITIES</td>
                <td>A</td>
              </tr>
              <tr>
                <td>DIGITAL CLASS</td>
                <td>A</td>
              </tr>
              <tr>
                <td>WRITTEN SKILLS</td>
                <td>B</td>
              </tr>
              <tr>
                <td>SPEAKING SKILLS</td>
                <td>C</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="mt-3 p-3 border rounded"
          style={{ backgroundColor: "#f5f5f5ff" }}
        >
          {/* Signatures */}
          <div className="row text-center mt-4 fw-semibold">
            <div className="col">Sign. of Class Teacher</div>
            <div className="col">Sign. of Principal</div>
            <div className="col">Sign. of Manager</div>
          </div>

          {/* Grading Scale */}
          <div className="mt-5">
            <strong>Grading scale for scholastic areas:</strong>
            <p>Grades are awarded on an 8-point grading scale as follows:</p>
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
    </div>
  );
};

const PdfTemplate2 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.max_mark),
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.mark_obtained),
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = Number(percentage) > 33 ? "Pass" : "Fail";

  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      <div
        className="accordion-body p-4"
        style={{ background: "#f9f9f9", fontFamily: "Arial, sans-serif" }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/img/download-img.png"
            alt="School Logo"
            style={{ height: "80px" }}
          />
          <h2 className="mt-2 mb-0">Whizlancer International School</h2>
          <small className="text-muted">Gorakhpur, Uttar Pradesh</small>
        </div>

        <div className="d-flex justify-content-between bg-white shadow-sm rounded p-3 mb-4">
          <div>
            <p>
              <strong>Name:</strong> {studentItem.firstname}{" "}
              {studentItem.lastname}
            </p>
            <p>
              <strong>Class:</strong> {studentItem.class} -{" "}
              {studentItem.section}
            </p>
            <p>
              <strong>Roll No:</strong> {studentItem.rollnum}
            </p>
          </div>
          <div>
            <p>
              <strong>Father's Name:</strong> {studentItem.fat_name}
            </p>
            <p>
              <strong>Contact:</strong> {studentItem.phone_num}
            </p>
          </div>
        </div>

        <table className="table table-bordered text-center bg-white shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Subject</th>
              <th>Max</th>
              <th>Min</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((subject: any, i: number) => (
              <tr key={i}>
                <td>{subject.subject_name}</td>
                <td>{subject.max_mark}</td>
                <td>{subject.min_mark}</td>
                <td>{subject.mark_obtained}</td>
                <td>{subject.grade}</td>
                <td
                  className={
                    subject.result === "Pass" ? "text-success" : "text-danger"
                  }
                >
                  {subject.result}
                </td>
              </tr>
            ))}
            <tr className="fw-bold table-secondary">
              <td>Rank: 30</td>
              <td colSpan={2}>Total: {totalMax}</td>
              <td>Obtained: {totalObtained}</td>
              <td>Per: {percentage}%</td>
              <td
                className={status === "Pass" ? "text-success" : "text-danger"}
              >
                {status}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="alert alert-warning mt-3">
          <strong>Disclaimer:</strong> Results are provisional and subject to
          change based on further review.
        </div>
      </div>
    </div>
  );
};

const PdfTemplate3 = ({
  studentItem,
  index,
  exam,
}: {
  studentItem: any;
  index: number;
  exam: any;
}) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.max_mark),
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + Number(sub.mark_obtained),
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = Number(percentage) > 33 ? "Pass" : "Fail";

  return (
    <div
      id={`collapse${studentItem.rollnum}-${index}`}
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      <div
        className="accordion-body d-flex"
        style={{ fontFamily: "Segoe UI", background: "#fff" }}
      >
        <div
          style={{
            width: "250px",
            background: "#003366",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px 0 0 10px",
          }}
        >
          <img
            src="/assets/img/download-img.png"
            alt="School Logo"
            style={{ width: "100%" }}
          />
          <h5 className="mt-3">Student Info</h5>
          <hr style={{ borderColor: "#fff" }} />
          <p>
            <strong>Name:</strong>
            <br /> {studentItem.firstname} {studentItem.lastname}
          </p>
          <p>
            <strong>Class:</strong>
            <br /> {studentItem.class} - {studentItem.section}
          </p>
          <p>
            <strong>Roll No:</strong>
            <br /> {studentItem.rollnum}
          </p>
          <p>
            <strong>Father's Name:</strong>
            <br /> {studentItem.fat_name}
          </p>
          <p>
            <strong>Phone:</strong>
            <br /> {studentItem.phone_num}
          </p>
        </div>

        <div className="flex-grow-1 p-4">
          <div className="text-center mb-4">
            <h2>Whizlancer International School</h2>
            <p className="text-muted">Gorakhpur, Uttar Pradesh</p>
          </div>

          <table className="table table-striped table-bordered">
            <thead className="table-dark text-white">
              <tr>
                <th>Subject</th>
                <th>Max</th>
                <th>Min</th>
                <th>Obtained</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {exam.subjects.map((subject: any, i: number) => (
                <tr key={i}>
                  <td>{subject.subject_name}</td>
                  <td>{subject.max_mark}</td>
                  <td>{subject.min_mark}</td>
                  <td>{subject.mark_obtained}</td>
                  <td>{subject.grade}</td>
                  <td
                    className={
                      subject.result === "Pass" ? "text-success" : "text-danger"
                    }
                  >
                    {subject.result}
                  </td>
                </tr>
              ))}
              <tr className="fw-bold bg-light">
                <td>Rank: 30</td>
                <td colSpan={2}>Total: {totalMax}</td>
                <td>Obtained: {totalObtained}</td>
                <td>Per: {percentage}%</td>
                <td
                  className={status === "Pass" ? "text-success" : "text-danger"}
                >
                  {status}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 p-3 border border-warning bg-light rounded">
            <strong>Disclaimer:</strong> The results shown are provisional and
            for informational use only.
          </div>
        </div>
      </div>
    </div>
  );
};

const PdfTemplate4 = ({ studentItem, index, exam }: any) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.max_mark,
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.mark_obtained,
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = +percentage > 33 ? "Pass" : "Fail";

  return (
    <div
      className="accordion-collapse collapse"
      id={`collapse${studentItem.rollnum}-${index}`}
    >
      <div
        style={{
          padding: "50px",
          fontFamily: "'Georgia', serif",
          background: "#fffdf5",
          border: "10px solid #d4af37",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <img
          src="/assets/img/download-img.png"
          alt="Logo"
          style={{ height: "70px", marginBottom: "10px" }}
        />
        <h1 style={{ color: "#2c3e50" }}>
          Certificate of Academic Performance
        </h1>
        <p>This is to certify that</p>
        <h2>
          {studentItem.firstname} {studentItem.lastname}
        </h2>
        <p>
          of class{" "}
          <strong>
            {studentItem.class}-{studentItem.section}
          </strong>
          , Roll No: <strong>{studentItem.rollnum}</strong>
        </p>
        <p>has achieved the following results in the current term:</p>

        <table
          style={{
            width: "80%",
            margin: "20px auto",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0e6d6" }}>
              <th>Subject</th>
              <th>Max</th>
              <th>Min</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((subject: any, i: number) => (
              <tr key={i}>
                <td>{subject.subject_name}</td>
                <td>{subject.max_mark}</td>
                <td>{subject.min_mark}</td>
                <td>{subject.mark_obtained}</td>
                <td>{subject.grade}</td>
                <td>{subject.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Overall Percentage: {percentage}%</h3>
        <h3 style={{ color: status === "Pass" ? "green" : "red" }}>
          Status: {status}
        </h3>

        <p style={{ marginTop: "30px", fontSize: "12px", color: "#666" }}>
          This is a provisional certificate generated for informational
          purposes.
        </p>
      </div>
    </div>
  );
};

// const PdfTemplate5 = ({ studentItem, index, exam }: any) => {
//   const totalMax = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + +sub.max_mark,
//     0
//   );
//   const totalObtained = exam.subjects.reduce(
//     (sum: number, sub: any) => sum + +sub.mark_obtained,
//     0
//   );
//   const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
//   const status = +percentage > 33 ? "Pass" : "Fail";

//   return (
//     <div
//       className="accordion-collapse collapse"
//       id={`collapse${studentItem.rollnum}-${index}`}
//     >
//       <div
//         style={{
//           display: "flex",
//           fontFamily: "Roboto, sans-serif",
//           background: "#f0f0f0",
//           padding: "20px",
//         }}
//       >
//         <div
//           style={{
//             width: "30%",
//             background: "#1e293b",
//             color: "#fff",
//             padding: "20px",
//             borderRadius: "8px",
//             marginRight: "20px",
//           }}
//         >
//           <img
//             src="/assets/img/download-img.png"
//             alt="Logo"
//             style={{ width: "100%", marginBottom: "15px" }}
//           />
//           <h4>
//             {studentItem.firstname} {studentItem.lastname}
//           </h4>
//           <p>
//             <strong>Class:</strong> {studentItem.class}-{studentItem.section}
//           </p>
//           <p>
//             <strong>Roll No:</strong> {studentItem.rollnum}
//           </p>
//           <p>
//             <strong>Father:</strong> {studentItem.fat_name}
//           </p>
//           <p>
//             <strong>Phone:</strong> {studentItem.phone_num}
//           </p>
//         </div>

//         <div
//           style={{
//             width: "70%",
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <h3 className="mb-3">Exam Results</h3>
//           <table className="table table-sm table-striped">
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Max</th>
//                 <th>Min</th>
//                 <th>Obtained</th>
//                 <th>Grade</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {exam.subjects.map((sub: any, i: number) => (
//                 <tr key={i}>
//                   <td>{sub.subject_name}</td>
//                   <td>{sub.max_mark}</td>
//                   <td>{sub.min_mark}</td>
//                   <td>{sub.mark_obtained}</td>
//                   <td>{sub.grade}</td>
//                   <td
//                     className={
//                       sub.result === "Pass" ? "text-success" : "text-danger"
//                     }
//                   >
//                     {sub.result}
//                   </td>
//                 </tr>
//               ))}
//               <tr className="fw-bold">
//                 <td>Rank: 30</td>
//                 <td colSpan={2}>Total: {totalMax}</td>
//                 <td>{totalObtained}</td>
//                 <td>{percentage}%</td>
//                 <td
//                   className={status === "Pass" ? "text-success" : "text-danger"}
//                 >
//                   {status}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

const PdfTemplate6 = ({ studentItem, index, exam }: any) => {
  const totalMax = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.max_mark,
    0
  );
  const totalObtained = exam.subjects.reduce(
    (sum: number, sub: any) => sum + +sub.mark_obtained,
    0
  );
  const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
  const status = +percentage > 33 ? "Pass" : "Fail";

  return (
    <div
      className="accordion-collapse collapse"
      id={`collapse${studentItem.rollnum}-${index}`}
    >
      <div
        style={{
          background: "#f7f9fb",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/img/download-img.png"
            alt="Logo"
            style={{ height: "60px" }}
          />
          <h2>Whizlancer International School</h2>
          <p>
            Academic Timeline for {studentItem.firstname} {studentItem.lastname}
          </p>
        </div>

        <div
          style={{
            borderLeft: "4px solid #007BFF",
            marginLeft: "20px",
            paddingLeft: "20px",
          }}
        >
          {exam.subjects.map((subject: any, i: number) => (
            <div key={i} style={{ marginBottom: "25px", position: "relative" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  borderLeft: `5px solid ${
                    subject.result === "Pass" ? "#28a745" : "#dc3545"
                  }`,
                }}
              >
                <h5>{subject.subject_name}</h5>
                <p>
                  Max: {subject.max_mark} | Min: {subject.min_mark} | Obtained:{" "}
                  {subject.mark_obtained}
                </p>
                <p>
                  Grade: <strong>{subject.grade}</strong> —{" "}
                  <span
                    style={{
                      color: subject.result === "Pass" ? "green" : "red",
                    }}
                  >
                    {subject.result}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <h4>
            Total: {totalObtained}/{totalMax} ({percentage}%)
          </h4>
          <h4 style={{ color: status === "Pass" ? "green" : "red" }}>
            Final Status: {status}
          </h4>
        </div>

        <p
          className="text-muted mt-4"
          style={{ fontSize: "12px", textAlign: "center" }}
        >
          * Timeline is for visual representation. Results are subject to
          review.
        </p>
      </div>
    </div>
  );
};

interface Subject {
  name: string;
  maxMarks: number;
  term1: number;
  term2: number;
}

interface Activity {
  name: string;
  grade: string;
}

const gradingScale = [
  { min: 91, grade: "A+" },
  { min: 81, grade: "A" },
  { min: 71, grade: "B+" },
  { min: 61, grade: "B" },
  { min: 51, grade: "C+" },
  { min: 41, grade: "C" },
  { min: 32, grade: "D" },
  { min: 0, grade: "E" },
];

function getGrade(percentage: number) {
  for (const scale of gradingScale) {
    if (percentage >= scale.min) return scale.grade;
  }
  return "E";
}

const initialSubjects: Subject[] = [
  { name: "HINDI", maxMarks: 60, term1: 0, term2: 0 },
  { name: "ENGLISH", maxMarks: 60, term1: 0, term2: 0 },
  { name: "MATHS", maxMarks: 60, term1: 0, term2: 0 },
  { name: "GK", maxMarks: 60, term1: 0, term2: 0 },
  { name: "ART", maxMarks: 60, term1: 0, term2: 0 },
  { name: "ORAL", maxMarks: 60, term1: 0, term2: 0 },
];

const initialActivities: Activity[] = [
  { name: "Art & Craft", grade: "" },
  { name: "Music", grade: "" },
  { name: "Sports", grade: "" },
  { name: "Dance", grade: "" },
];

const PdfTemplate7 = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // Dummy student & school data (could be props or fetched)
  const school = {
    name: "UDAY NARAYAN SIKSHAN SANSTHAN",
    address: "Kaila, District East Champaran",
    affiliation: "Affiliated to Bihar School Examination Board, Patna",
  };

  const student = {
    name: "VIVEK SINGH",
    fatherName: "RAM BABU SINGH",
    motherName: "BABLI DEVI",
    dob: "01/01/2010",
    admissionNo: "12345",
    class: "5th",
    section: "A",
  };

  // Sum max and obtained marks for terms
  const totalMaxTerm1 = subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
  const totalObtainedTerm1 = subjects.reduce((sum, sub) => sum + sub.term1, 0);
  const totalMaxTerm2 = subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
  const totalObtainedTerm2 = subjects.reduce((sum, sub) => sum + sub.term2, 0);

  const grandTotalMax = totalMaxTerm1 + totalMaxTerm2;
  const grandTotalObtained = totalObtainedTerm1 + totalObtainedTerm2;
  const grandPercentage = grandTotalMax
    ? (grandTotalObtained / grandTotalMax) * 100
    : 0;

  const overallGrade = getGrade(grandPercentage);

  // Handlers
  const handleInputChange = (
    index: number,
    term: "term1" | "term2",
    value: string
  ) => {
    let val = parseInt(value);
    if (isNaN(val)) val = 0;
    if (val > subjects[index].maxMarks) val = subjects[index].maxMarks;
    if (val < 0) val = 0;

    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [term]: val };
    setSubjects(newSubjects);
  };

  const handleActivityGradeChange = (index: number, grade: string) => {
    const newActivities = [...activities];
    newActivities[index].grade = grade.toUpperCase().slice(0, 2); // Limit to 2 chars
    setActivities(newActivities);
  };

  return (
    <div className="container border border-2 border-dark p-4 my-5 bg-white">
      {/* School Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-uppercase">{school.name}</h2>
        <p className="mb-0">{school.address}</p>
        <p className="mb-0 fst-italic">{school.affiliation}</p>
        <hr className="border-dark border-2 mt-2" />
      </div>

      {/* Student Info */}
      <div className="row mb-4">
        <div className="col-md-6">
          <p>
            <strong>Student Name:</strong> {student.name}
          </p>
          <p>
            <strong>Father's Name:</strong> {student.fatherName}
          </p>
          <p>
            <strong>Mother's Name:</strong> {student.motherName}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <strong>Date of Birth:</strong> {student.dob}
          </p>
          <p>
            <strong>Admission No:</strong> {student.admissionNo}
          </p>
          <p>
            <strong>Class & Section:</strong> {student.class} -{" "}
            {student.section}
          </p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th rowSpan={2}>Subject</th>
              <th colSpan={2}>Term 1</th>
              <th colSpan={2}>Term 2</th>
              <th rowSpan={1}>Total Obtained</th>
              <th rowSpan={1}>Total Grade</th>
            </tr>
            <tr>
              <th>Max Marks</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj, idx) => {
              const totalObtained = subj.term1 + subj.term2;
              const totalMax = subj.maxMarks * 2;
              return (
                <tr key={idx}>
                  <td>{subj.name}</td>
                  <td>{subj.maxMarks}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={subj.maxMarks}
                      value={subj.term1}
                      onChange={(e) =>
                        handleInputChange(idx, "term1", e.target.value)
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>{subj.maxMarks}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={subj.maxMarks}
                      value={subj.term2}
                      onChange={(e) =>
                        handleInputChange(idx, "term2", e.target.value)
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    {totalObtained} / {totalMax}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{totalMaxTerm1}</th>
              <th>{totalObtainedTerm1}</th>
              <th>{totalMaxTerm2}</th>
              <th>{totalObtainedTerm2}</th>
              <th>
                {grandTotalObtained} / {grandTotalMax} <br />
                <strong>
                  Overall Percentage: {grandPercentage.toFixed(2)}% <br />
                  Grade: {overallGrade}
                </strong>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Co-Curricular Activities */}
      {/* Co-Scholastic */}
      <div className="mt-4">
        <strong>CO-SCHOLASTIC : (3 POINT GRADING SCALE A, B, C)</strong>
        <table className="table table-bordered text-center mt-2">
          <tbody>
            <tr>
              <td>UNIFORM</td>
              <td>A+</td>
            </tr>
            <tr>
              <td>ACTIVITIES</td>
              <td>A+</td>
            </tr>
            <tr>
              <td>DIGITAL CLASS</td>
              <td>A</td>
            </tr>
            <tr>
              <td>WRITTEN SKILLS</td>
              <td>B</td>
            </tr>
            <tr>
              <td>SPEAKING SKILLS</td>
              <td>C</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="row text-center mt-4 fw-semibold">
        <div className="col">Sign. of Class Teacher</div>
        <div className="col">Sign. of Principal</div>
        <div className="col">Sign. of Manager</div>
      </div>

      {/* Grading Scale */}
      <div className="mt-5">
        <strong>Grading scale for scholastic areas:</strong>
        <p>Grades are awarded on an 8-point grading scale as follows:</p>
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
  );
};

export {
  PdfTemplate1,
  PdfTemplate2,
  PdfTemplate3,
  PdfTemplate4,
  PdfTemplate5,
  PdfTemplate6,
  PdfTemplate7,
};
