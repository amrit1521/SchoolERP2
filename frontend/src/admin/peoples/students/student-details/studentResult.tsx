import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import { useEffect, useState } from "react";
import { getExamResult, specificStudentData1 } from "../../../../service/api";
import html2pdf from "html2pdf.js";

const StudentResult = () => {
  const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();

  const [student, setStudent] = useState<any>({});
  const [results, setResults] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Ref for selected exam
  // const [activeRef, setActiveRef] = useState<HTMLDivElement | HTMLElement | null>(null);

  const fetchStudent = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const res = await specificStudentData1(Number(rollnum));
      setStudent(res.data.student);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (rollnum: number) => {
    if (!rollnum) return
    try {

      const { data } = await getExamResult(rollnum)
      if (data.success) {
        setResults(data.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    if (rollnum) {
      fetchStudent();
      fetchResult(Number(rollnum))
    }

  }, [rollnum]);



  const downloadPDF = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily expand if collapsed
    const wasCollapsed = element.classList.contains("collapse");
    if (wasCollapsed) {
      element.classList.add("show");
    }

    // Wait a tick for rendering
    await new Promise((res) => setTimeout(res, 300));

    const opt = {
      margin: 0.2,
      filename: `ReportCard_${student.rollnum || "unknown"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Collapse back if was collapsed
      if (wasCollapsed) {
        element.classList.remove("show");
      }
    });
  };


  // console.log(results[0].exams)


  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {token && <StudentBreadcrumb token={token} rollnum={Number(rollnum)} />}
          </div>
          <div className="row">
            {/* Student Information */}
            <StudentSidebar student={student} loading={loading} />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link to={`${routes.studentDetail}/${rollnum}`} className="nav-link">
                        <i className="ti ti-school me-2" />
                        Student Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentTimeTable}/${rollnum}`} className="nav-link">
                        <i className="ti ti-table-options me-2" />
                        Time Table
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentLeaves}/${rollnum}`} className="nav-link">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentFees}/${rollnum}`} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentResult}/${rollnum}`} className="nav-link active">
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentLibrary}/${rollnum}`} className="nav-link">
                        <i className="ti ti-books me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Exams &amp; Results</h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
                          <Link
                            to="#"
                            className="btn btn-outline-light bg-white dropdown-toggle"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="ti ti-calendar-due me-2" />
                            Year : 2024 / 2025
                          </Link>
                          <ul className="dropdown-menu p-3">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2024 / 2025
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2023 / 2024
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2022 / 2023
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "200px" }}
                        >
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="accordions-items-seperate" id="accordionExample">
                          {results && results.length > 0 ? results.map((studentItem: any) =>

                            studentItem.exams.map((exam: any, index: number) =>
                            (
                              <div className="accordion-item" key={`${studentItem.rollnum}-${index}`}>
                                <h2 className="accordion-header d-flex align-items-center justify-content-between">
                                  <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${studentItem.rollnum}-${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${studentItem.rollnum}-${index}`}
                                  >
                                    <span className="avatar avatar-sm bg-success me-2">
                                      <i className="ti ti-checks" />
                                    </span>
                                    {exam.exam_name}
                                  </button>
                                  <button
                                    className="btn btn-success btn-sm ms-2"
                                    onClick={() =>
                                      downloadPDF(`collapse${studentItem.rollnum}-${index}`)
                                    }
                                  >
                                    Download PDF
                                  </button>

                                </h2>
                                <div
                                  id={`collapse${studentItem.rollnum}-${index}`}
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body" style={{ padding: "20px", backgroundColor: "white" }}>
                                    {/* PDF Header */}
                                    <div className="d-flex align-items-center justify-content-center mb-4">
                                      <img
                                        src="/assets/img/download-img.png"
                                        alt="School Logo"
                                        style={{ height: "80px", marginRight: "20px" }}
                                      />
                                      <div>
                                        <h2>Whizlancer International School</h2>
                                        <p className="text-center">Gorakhpur Uttar Pradesh</p>
                                      </div>
                                    </div>

                                    {/* Student Info */}
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div style={{ marginBottom: "20px" }}>
                                        <div>
                                          <strong className="fw-bold">Student Name:</strong> {studentItem.firstname} {studentItem.lastname}
                                        </div>
                                        <div>
                                          <strong className="fw-bold">Class & Section:</strong> {studentItem.class} - {studentItem.section}
                                        </div>
                                        <div>
                                          <strong className="fw-bold">Roll Number:</strong> {studentItem.rollnum}
                                        </div>
                                      </div>
                                      <div>
                                        <div>
                                          <strong className="fw-bold">Father's Name:</strong> {studentItem.fat_name}
                                        </div>
                                        <div>
                                          <strong className="fw-bold">Father's Mobile:</strong> {studentItem.phone_num}
                                        </div>
                                        <div>

                                        </div>
                                      </div>
                                    </div>

                                    <hr />
                                    {/* Table */}
                                    {/* Table */}
                                    <div className="table-responsive">
                                      <table className="table">
                                        <thead className="thead-light">
                                          <tr>
                                            <th>Subject</th>
                                            <th>Max Marks</th>
                                            <th>Min Marks</th>
                                            <th>Marks Obtained</th>
                                            <th>Grade</th>
                                            <th className="text-end">Result</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {exam.subjects.map((subject: any, subIndex: number) => (
                                            <tr key={subIndex}>
                                              <td>{subject.subject_name}</td>
                                              <td>{subject.max_mark}</td>
                                              <td>{subject.min_mark}</td>
                                              <td>{subject.mark_obtained}</td>
                                              <td className="fw-semibold">{subject.grade}</td>
                                              <td className="text-end">
                                                <span
                                                  className={`badge d-inline-flex align-items-center ${subject.result === "Pass" ? "badge-soft-success" : "badge-soft-danger"}`}
                                                >
                                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                                  {subject.result}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}

                                          {/* Totals Row */}
                                          {(() => {
                                            const totalMax = exam.subjects.reduce((sum: number, sub: any) => sum + Number(sub.max_mark), 0);
                                            const totalObtained = exam.subjects.reduce((sum: number, sub: any) => sum + Number(sub.mark_obtained), 0);
                                            const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
                                            const status = Number(percentage) > 33 ? "Pass" : "Fail"
                                            return (
                                              <tr className="fw-bold border border-5 ">
                                                <td>Rank:30</td>
                                                <td colSpan={2}>Total:{totalMax}</td>

                                                <td>Toatal Obtained:{totalObtained}</td>
                                                <td className="text-end">Per: {percentage}%</td>
                                                <td className={`${status == "Pass" ? "text-success" : "text-danger"}`}>{status}</td>
                                              </tr>
                                            );
                                          })()}
                                        </tbody>
                                      </table>
                                    </div>


                                    <div
                                      className="mt-3 p-3 border border-warning rounded"
                                      style={{ backgroundColor: "#fff8e1" }}
                                    >
                                      <strong>Disclaimer:</strong> The results displayed above are **provisional** and generated
                                      based on the available data. The school reserves the right to make corrections or
                                      adjustments if discrepancies are found. This report is for **informational purposes
                                      only** and should not be considered as the final official document.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : <div className="my-5 text-center fw-semibold">Exam Not Schedule..</div>}
                        </div>

                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {student.rollnum && <StudentModals onAdd={() => { }} rollnum={Number(student.rollnum)} />}
    </>
  );
};

export default StudentResult;
