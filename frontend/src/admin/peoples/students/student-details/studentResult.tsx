import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import { useEffect, useState } from "react";
import { specificStudentData1 } from "../../../../service/api";
import html2pdf from "html2pdf.js";

const StudentResult = () => {
  const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();

  const [student, setStudent] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Ref for selected exam
  const [activeRef, setActiveRef] = useState<HTMLDivElement | HTMLElement | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
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
    fetchStudent();
  }, [rollnum]);

  const downloadPDF = () => {
    console.log("heelo", activeRef)
    if (!activeRef) return;

    const opt = {
      margin: 0.2,
      filename: `ReportCard_${student.rollnum || "unknown"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(activeRef).save();
  };


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
                          {/* Each Exam Item */}
                          {["May", "Apr", "Mar"].map((month, index) => (
                            <div className="accordion-item" key={index}>
                              <h2 className="accordion-header d-flex align-items-center justify-content-between">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse${month}`}
                                  aria-expanded="false"
                                  aria-controls={`collapse${month}`}
                                >
                                  <span className="avatar avatar-sm bg-success me-2">
                                    <i className="ti ti-checks" />
                                  </span>
                                  Monthly Test ({month})
                                </button>
                                {/* Download Button */}
                                <button
                                  className="btn btn-success btn-sm ms-2"
                                  onClick={() => {
                                    const element = document.getElementById(`collapse${month}`);
                                    if (element) setActiveRef(element);
                                    setTimeout(() => downloadPDF(), 1000);
                                  }}
                                >
                                  Download PDF
                                </button>
                              </h2>
                              <div
                                id={`collapse${month}`}
                                className="accordion-collapse collapse"
                                data-bs-parent="#accordionExample"
                              >
                                <div
                                  className="accordion-body"
                                  style={{ padding: "20px", backgroundColor: "white" }}
                                >
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
                                        <strong className="fw-bold">Student Name:</strong> {student.firstname} {student.lastname}
                                      </div>
                                      <div>
                                        <strong className="fw-bold">Class & Section:</strong> {student.class} - {student.section}
                                      </div>
                                      <div>
                                        <strong className="fw-bold">Roll Number:</strong> {student.rollnum}
                                      </div>
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                      <div>
                                        <strong>Father's Name:</strong> {student.name}
                                      </div>
                                      <div>
                                        <strong>Father's Mobile:</strong> {student.phone_num}
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
                                          <th>Max Marks</th>
                                          <th>Min Marks</th>
                                          <th>Marks Obtained</th>
                                          <th className="text-end">Result</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {/* Example Subjects */}
                                        <tr>
                                          <td>English (150)</td>
                                          <td>100</td>
                                          <td>35</td>
                                          <td>59</td>
                                          <td className="text-end">
                                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              Pass
                                            </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Mathematics (214)</td>
                                          <td>100</td>
                                          <td>35</td>
                                          <td>69</td>
                                          <td className="text-end">
                                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              Pass
                                            </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Physics (120)</td>
                                          <td>100</td>
                                          <td>35</td>
                                          <td>79</td>
                                          <td className="text-end">
                                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              Pass
                                            </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Chemistry (110)</td>
                                          <td>100</td>
                                          <td>35</td>
                                          <td>89</td>
                                          <td className="text-end">
                                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              Pass
                                            </span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Spanish (140)</td>
                                          <td>100</td>
                                          <td>35</td>
                                          <td>99</td>
                                          <td className="text-end">
                                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              Pass
                                            </span>
                                          </td>
                                        </tr>
                                        {/* Add more subjects dynamically as needed */}
                                        <tr>
                                          <td className="bg-dark text-white">Rank : 30</td>
                                          <td className="bg-dark text-white">Total : 500</td>
                                          <td className="bg-dark text-white" colSpan={2}>
                                            Marks Obtained : 395
                                          </td>
                                          <td className="bg-dark text-white text-end">
                                            <div className="d-flex align-items-center justify-content-end">
                                              {/* <span className="me-2">Percentage : 79.50</span> */}
                                              <h6 className="fw-normal text-white">
                                                Result : <span className="text-success">Pass</span>
                                              </h6>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="mt-3 p-3 border border-warning rounded" style={{ backgroundColor: "#fff8e1" }}>
                                    <strong>Disclaimer:</strong> The results displayed above are **provisional** and generated based on the available data. The school reserves the right to make corrections or adjustments if discrepancies are found. This report is for **informational purposes only** and should not be considered as the final official document.
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
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
