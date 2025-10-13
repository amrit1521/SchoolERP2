import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import { useEffect, useState } from "react";
import {
  getAllExamNameForAStud,
  getExamResult,
  specificStudentData1,
} from "../../../../service/api";
import html2pdf from "html2pdf.js";
import {
  PdfTemplate1,
  PdfTemplate2,
  PdfTemplate3,
  PdfTemplate4,
  PdfTemplate5,
  PdfTemplate6,
  PdfTemplate7,
} from "./pdfTemplate";
import { Select } from "antd";
import { toast } from "react-toastify";
const StudentResult = () => {
  const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();

  const [student, setStudent] = useState<any>({});
  const [results, setResults] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<{
    [key: string]: string;
  }>({});
  const [examOptions, setExamOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const TemplateType = [
    { value: "type1", label: "Template Type 1" },
    { value: "type2", label: "Template Type 2" },
    { value: "type3", label: "Template Type 3" },
    { value: "type4", label: "Template Type 4" },
    { value: "type5", label: "Template Type 5" },
    { value: "type6", label: "Template Type 6" },
    { value: "type7", label: "Template Type 7" },
  ];

  const renderTemplate = (type: string, props: any) => {
    switch (type) {
      case "type1":
        return <PdfTemplate1 {...props} />;
      case "type2":
        return <PdfTemplate2 {...props} />;
      case "type3":
        return <PdfTemplate3 {...props} />;
      case "type4":
        return <PdfTemplate4 {...props} />;
      case "type5":
        return <PdfTemplate5 {...props} />;
      case "type6":
        return <PdfTemplate6 {...props} />;
      case "type7":
        return <PdfTemplate7 />;
      default:
        return <PdfTemplate1 {...props} />;
    }
  };

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
    if (!rollnum) return;
    try {
      const { data } = await getExamResult(rollnum);
      const result = await getAllExamNameForAStud(rollnum);
      if (result.data.success && Array.isArray(result.data.data)) {
        setExamOptions(
          result.data.data.map((e: any) => ({
            value: e.exam_name_id,
            label: e.examName,
          }))
        );
      } else {
        setExamOptions([]);
        toast.warning("No exams found for this class & section.");
      }
      if (data.success) {
        console.log(data.data);
        setResults(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (rollnum) {
      fetchStudent();
      fetchResult(Number(rollnum));
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

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Collapse back if was collapsed
        if (wasCollapsed) {
          element.classList.remove("show");
        }
      });
  };

  const getCombinedResults = (exams: any[]) => {
    const semester1 = exams.find((exam) => exam.exam_name === "Semester1");
    const semester2 = exams.find((exam) => exam.exam_name === "Semester2");
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
    console.log("combined: ", combinedSubjects);

    return combinedSubjects;
  };
  // console.log(results[0].exams)

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {token && (
              <StudentBreadcrumb token={token} rollnum={Number(rollnum)} />
            )}
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
                      <Link
                        to={`${routes.studentDetail}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-school me-2" />
                        Student Details
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${routes.studentTimeTable}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-table-options me-2" />
                        Time Table
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${routes.studentLeaves}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${routes.studentFees}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${routes.studentResult}/${rollnum}`}
                        className="nav-link active"
                      >
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${routes.studentLibrary}/${rollnum}`}
                        className="nav-link"
                      >
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
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="accordions-items-seperate"
                          id="accordionExample"
                        >
                          <div className="me-3 d-flex gap-2">
                            <Select
                              options={examOptions}
                              mode="multiple"
                              className="Select"
                              placeholder="Choose Exams"
                              value={selectedExams}
                              onChange={(value) => setSelectedExams(value)}
                              style={{
                                width: "25%",
                                height: "40px",
                              }}
                            />
                            <Link
                              to="#"
                              className="btn btn-light me-2 mb-2"
                              data-bs-toggle="modal"
                              data-bs-target="#Pdf_template"
                            >
                              <i className="ti ti-lock me-2" />
                              Choose Template
                            </Link>
                          </div>
                          {results && results.length > 0 ? (
                            results.map((studentItem: any) => {
                              const combinedResults = studentItem.exams
                                ? getCombinedResults(studentItem.exams)
                                : [];
                              console.log(
                                "combined Result: ",
                                combinedResults,
                                studentItem
                              );
                              {
                                renderTemplate("PdfTemplate1", {
                                  exam: combinedResults,
                                });
                              }
                              return studentItem.exams.map(
                                (exam: any, index: number) => {
                                  const examKey = `${studentItem.rollnum}-${index}`;
                                  const selectedType =
                                    selectedTemplates[examKey] || "type1";

                                  // Combine Semester 1 and Semester 2 results for this student
                                  // const combinedResults = exam.exams
                                  //   ? getCombinedResults(exam.exams)
                                  //   : [];
                                  return (
                                    <div
                                      className="accordion-item"
                                      key={examKey}
                                    >
                                      <h2 className="accordion-header d-flex align-items-center justify-content-between">
                                        <button
                                          className="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target={`#collapse${examKey}`}
                                          aria-expanded="false"
                                          aria-controls={`collapse${examKey}`}
                                        >
                                          <span className="avatar avatar-sm bg-success me-2">
                                            <i className="ti ti-checks" />
                                          </span>
                                          {exam.exam_name}
                                        </button>

                                        <div className="me-3">
                                          {/* <Select
                                            options={TemplateType}
                                            className="Select"
                                            placeholder="choose Template"
                                            value={selectedType}
                                            onChange={(value) =>
                                              setSelectedTemplates((prev) => ({
                                                ...prev,
                                                [examKey]: value,
                                              }))
                                            }
                                          /> */}
                                        </div>
                                        {/* <button
                                        className="btn btn-success btn-sm ms-2"
                                        onClick={() =>
                                          downloadPDF(`collapse${examKey}`)
                                        }
                                      >
                                        Download PDF
                                      </button> */}
                                      </h2>
                                      {renderTemplate(selectedType, {
                                        studentItem,
                                        index,
                                        exam: studentItem.exams,
                                      })}
                                    </div>
                                  );
                                }
                              );
                            })
                          ) : (
                            <div className="my-5 text-center fw-semibold">
                              Exam Not Scheduled..
                            </div>
                          )}
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
      {student.rollnum && (
        <StudentModals onAdd={() => {}} rollnum={Number(student.rollnum)} />
      )}
    </>
  );
};

export default StudentResult;
