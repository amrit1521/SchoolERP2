import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getExamResult, specificStudentData1 } from "../../../service/api";
import { PdfTemplate1, PdfTemplate2, PdfTemplate3 } from "./pdfTemplate";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import { parent_routes } from "../../../admin/router/parent_routes";

async function waitForImagesToLoad(el: HTMLElement, timeoutMs = 5000) {
  const imgs = Array.from(el.querySelectorAll("img"));
  if (!imgs.length) return;
  await Promise.race([
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((res) => {
            if (img.complete) return res();
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          })
      )
    ),
    new Promise<void>((res) => setTimeout(res, timeoutMs)),
  ]);
}

const PStudentResult: React.FC = () => {
  const { rollnum } = useParams<{ rollnum: string }>();
  const [student, setStudent] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStudentItem, setModalStudentItem] = useState<any>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [downloading, setDownloading] = useState(false);

  const templateConfigs = [
    { id: 1, label: "t-1", component: PdfTemplate1, badge: "primary" },
    { id: 2, label: "t-2", component: PdfTemplate2, badge: "success" },
    { id: 3, label: "t-3", component: PdfTemplate3, badge: "info" },
  ];

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await specificStudentData1(Number(rollnum));
      setStudent(res.data.student);
    } catch {
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (rn: number) => {
    if (!rn) return;
    try {
      const { data } = await getExamResult(rn);
      if (data && data.success) setResults(data.data || []);
      else setResults([]);
    } catch {
      setResults([]);
      toast.error("Failed to fetch exam results");
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (rollnum) {
      fetchStudent();
      fetchResult(Number(rollnum));
    }
  }, [rollnum]);

  const handleDownloadTemplate = async () => {
    if (!modalStudentItem || !selectedTemplateId) {
      toast.error("Please select a template first!");
      return;
    }

    setDownloading(true);

    try {
      const templates: any = {
        1: PdfTemplate1,
        2: PdfTemplate2,
        3: PdfTemplate3,
      };

      const SelectedTemplate = templates[selectedTemplateId];
      if (!SelectedTemplate) {
        toast.error("Invalid template selected!");
        return;
      }

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "210mm";
      container.style.minHeight = "297mm";
      container.style.background = "white";
      document.body.appendChild(container);

      const tempDiv = document.createElement("div");
      container.appendChild(tempDiv);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempDiv);
      root.render(
        <SelectedTemplate
          studentItem={modalStudentItem}
          exam={modalStudentItem?.exams}
        />
      );

      await new Promise((r) => setTimeout(r, 300));
      await waitForImagesToLoad(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      root.unmount();
      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = ((canvas.height - 70) * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Result_${modalStudentItem.rollnum}_T${selectedTemplateId}.pdf`);
      toast.success("PDF downloaded successfully!");
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const filteredResults = results;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {token && (
              <StudentBreadcrumb token={token} rollnum={Number(rollnum)} />
            )}
          </div>
          <div className="row">
            <StudentSidebar student={student} loading={loading} />
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                  <li>
                    <Link
                      to={`${parent_routes.childDetails}/${rollnum}`}
                      className="nav-link"
                    >
                      <i className="ti ti-school me-2" />
                      Student Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${parent_routes.childTimeTable}/${rollnum}`}
                      className="nav-link"
                    >
                      <i className="ti ti-table-options me-2" />
                      Time Table
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${parent_routes.childLeaves}/${rollnum}`}
                      className="nav-link"
                    >
                      <i className="ti ti-calendar-due me-2" />
                      Leave & Attendance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${parent_routes.childFees}/${rollnum}`}
                      className="nav-link"
                    >
                      <i className="ti ti-report-money me-2" />
                      Fees
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${parent_routes.childResult}/${rollnum}`}
                      className="nav-link active"
                    >
                      <i className="ti ti-bookmark-edit me-2" />
                      Exam & Results
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${parent_routes.childLibrary}/${rollnum}`}
                      className="nav-link"
                    >
                      <i className="ti ti-books me-2" />
                      Library
                    </Link>
                  </li>
                </ul>
                <div className="card">
                  <div className="card-header">
                    <h4>Exams & Results</h4>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : filteredResults.length === 0 ? (
                      <div className="text-center text-muted">
                        No exam results available
                      </div>
                    ) : (
                      filteredResults.map((studentItem: any, index: number) => {
                        const examKey = `${studentItem.rollnum}-${
                          studentItem.exam_name_id || index
                        }`;
                        return (
                          <div
                            key={examKey}
                            className="accordion-item mb-3 border rounded p-3 d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>Download Exam Result</strong>
                              <div className="text-muted small">
                                Roll Number: {studentItem.rollnum}
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setModalStudentItem(studentItem);
                                setIsModalVisible(true);
                              }}
                            >
                              Choose Template
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && modalStudentItem && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  Choose a Result Template
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsModalVisible(false);
                    setSelectedTemplateId(null);
                  }}
                />
              </div>

              <div
                className="modal-body"
                style={{
                  paddingTop: "10px",
                  paddingBottom: "0px",
                }}
              >
                <div
                  className="d-flex flex-wrap justify-content-center gap-4"
                  style={{
                    maxHeight: "80vh",
                    overflowY: "auto",
                    padding: "10px",
                    paddingBottom: "30px",
                  }}
                >
                  {templateConfigs.map((template) => {
                    const TemplateComponent = template.component;
                    const isSelected = selectedTemplateId === template.id;

                    return (
                      <div
                        key={template.id}
                        className={`p-3 rounded-3 shadow-sm d-flex flex-column align-items-center transition-all`}
                        style={{
                          width: "320px",
                          background: isSelected ? "#e8f0fe" : "#f9f9f9",
                          border: isSelected
                            ? "2px solid #0d6efd"
                            : "1px solid #dee2e6",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div
                          className="bg-white w-100 overflow-auto border rounded-2"
                          style={{
                            height: "420px",
                            borderColor: isSelected ? "#0d6efd" : "#dee2e6",
                            boxShadow: isSelected
                              ? "0 0 10px rgba(13,110,253,0.2)"
                              : "0 0 6px rgba(0,0,0,0.05)",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              transform: "scale(0.95)",
                              transformOrigin: "top center",
                              width: "190%",
                            }}
                          >
                            <TemplateComponent
                              studentItem={modalStudentItem}
                              exam={modalStudentItem?.exams}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={`btn mt-3 fw-semibold ${
                            isSelected ? "btn-primary" : "btn-outline-primary"
                          }`}
                          style={{
                            width: "140px",
                            borderRadius: "30px",
                          }}
                        >
                          {isSelected ? "Selected" : "Select This"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer border-0 pt-0 d-flex justify-content-end gap-2">
                <button
                  className="btn btn-light border"
                  onClick={() => {
                    setIsModalVisible(false);
                    setSelectedTemplateId(null);
                  }}
                  style={{
                    borderRadius: "30px",
                    minWidth: "110px",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadTemplate}
                  disabled={!selectedTemplateId || downloading}
                  style={{
                    borderRadius: "30px",
                    minWidth: "170px",
                  }}
                >
                  {downloading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Downloading...
                    </>
                  ) : (
                    "Download Selected"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PStudentResult;
