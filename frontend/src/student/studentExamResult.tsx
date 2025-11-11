import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Select } from "antd";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { all_routes } from "../router/all_routes";
import { specificStudentData1 } from "../service/api";
// import { PdfTemplate1, PdfTemplate2, PdfTemplate3 } from "./pdfTemplate";
import PdfTemplate1, {
  PdfTemplate2,
  PdfTemplate3,
} from "../admin/peoples/students/student-details/pdfTemplate";
import TooltipOption from "../core/common/tooltipOption";
import {
  getExamNameForStudent,
  getExamResultForStudent,
  getSpecStudentProfileDetails,
} from "../service/studentapi";

async function waitForImagesToLoad(el: HTMLElement, timeoutMs = 5000) {
  const imgs = Array.from(el.querySelectorAll("img"));
  if (!imgs.length) return;
  await Promise.race([
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((res) => {
            if (img.complete) {
              return res();
            }
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          })
      )
    ),
    new Promise<void>((res) => setTimeout(res, timeoutMs)),
  ]);
}

// Create individual template preview components to avoid ref conflicts
const Template1Preview = ({
  studentItem,
  studentRollnum,
  label,
}: {
  studentItem: any;
  studentRollnum?: string | number;
  label: string;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePreview = async () => {
    if (!contentRef.current) return;

    setGenerating(true);
    try {
      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const previewImage = canvas.toDataURL("image/png");
      setPreviewUrl(previewImage);

      document.body.removeChild(clone);
    } catch (err) {
      console.error("Error generating preview:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) {
      toast.error("Download failed: template not ready");
      return;
    }

    try {
      setGenerating(true);

      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      await waitForImagesToLoad(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 320;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(clone);

      pdf.save(`Result_${studentRollnum}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (studentItem) {
      generatePreview();
    }
  }, [studentItem]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "250mm",
          minHeight: "320mm",
          background: "white",
          boxSizing: "border-box",
        }}
      >
        <PdfTemplate1 studentItem={studentItem} exam={studentItem?.exams} />
      </div>

      <div
        style={{
          height: 450,
          width: "100%",
          border: "1px solid #ddd",
          overflow: "hidden",
          background: "white",
          borderRadius: "8px",
        }}
      >
        {generating && !previewUrl ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="spinner-border spinner-border-sm me-2" />
            Generating preview...
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="text-muted">No preview available</div>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownload}
          disabled={generating || !previewUrl}
          style={{ minWidth: "120px" }}
        >
          {generating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Generating...
            </>
          ) : (
            `Download`
          )}
        </button>
      </div>
    </div>
  );
};

const Template2Preview = ({
  studentItem,
  studentRollnum,
  label,
}: {
  studentItem: any;
  studentRollnum?: string | number;
  label: string;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePreview = async () => {
    if (!contentRef.current) return;

    setGenerating(true);
    try {
      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 1,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const previewImage = canvas.toDataURL("image/png");
      setPreviewUrl(previewImage);

      document.body.removeChild(clone);
    } catch (err) {
      console.error("Error generating preview:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) {
      toast.error("Download failed: template not ready");
      return;
    }

    try {
      setGenerating(true);

      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      await waitForImagesToLoad(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(clone);

      pdf.save(`${label}_${studentRollnum}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (studentItem) {
      generatePreview();
    }
  }, [studentItem]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "210mm",
          minHeight: "300mm",
          background: "white",
          boxSizing: "border-box",
        }}
      >
        <PdfTemplate2 studentItem={studentItem} exam={studentItem?.exams} />
      </div>

      <div
        style={{
          height: 450,
          width: "100%",
          border: "1px solid #ddd",
          overflow: "hidden",
          background: "white",
          borderRadius: "8px",
        }}
      >
        {generating && !previewUrl ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="spinner-border spinner-border-sm me-2" />
            Generating preview...
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="text-muted">No preview available</div>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-success btn-sm"
          onClick={handleDownload}
          disabled={generating || !previewUrl}
          style={{ minWidth: "120px" }}
        >
          {generating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Generating...
            </>
          ) : (
            `Download`
          )}
        </button>
      </div>
    </div>
  );
};

const Template3Preview = ({
  studentItem,
  studentRollnum,
  label,
}: {
  studentItem: any;
  studentRollnum?: string | number;
  label: string;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePreview = async () => {
    if (!contentRef.current) return;

    setGenerating(true);
    try {
      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 1,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const previewImage = canvas.toDataURL("image/png");
      setPreviewUrl(previewImage);

      document.body.removeChild(clone);
    } catch (err) {
      console.error("Error generating preview:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) {
      toast.error("Download failed: template not ready");
      return;
    }

    try {
      setGenerating(true);

      const clone = contentRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.zIndex = "9999";
      document.body.appendChild(clone);

      await waitForImagesToLoad(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 300;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(clone);

      pdf.save(`${label}_${studentRollnum}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (studentItem) {
      generatePreview();
    }
  }, [studentItem]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "210mm",
          minHeight: "300mm",
          background: "white",
          boxSizing: "border-box",
        }}
      >
        <PdfTemplate3 studentItem={studentItem} exam={studentItem?.exams} />
      </div>

      <div
        style={{
          height: 450,
          width: "100%",
          border: "1px solid #ddd",
          overflow: "hidden",
          background: "white",
          borderRadius: "8px",
        }}
      >
        {generating && !previewUrl ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="spinner-border spinner-border-sm me-2" />
            Generating preview...
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div className="text-muted">No preview available</div>
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-info btn-sm"
          onClick={handleDownload}
          disabled={generating || !previewUrl}
          style={{ minWidth: "120px" }}
        >
          {generating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Generating...
            </>
          ) : (
            `Download`
          )}
        </button>
      </div>
    </div>
  );
};

const StudentExamResult: React.FC = () => {
  const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;
  const [student, setStudent] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  //   const [token, setToken] = useState<string | null>(null);
  const [examOptions, setExamOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStudentItem, setModalStudentItem] = useState<any>(null);

  // Template configurations
  const templateConfigs = [
    {
      id: 1,
      label: "t-1",
      component: Template1Preview,
      badge: "primary",
    },
    {
      id: 2,
      label: "t-2",
      component: Template2Preview,
      badge: "success",
    },
    {
      id: 3,
      label: "t-3",
      component: Template3Preview,
      badge: "info",
    },
  ];

  const fetchStudent = async (userId: number) => {
    setLoading(true);
    try {
      const res = await getSpecStudentProfileDetails(userId);
      setStudent(res.data.student);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (userId: number) => {
    if (!userId) return;
    try {
      const { data } = await getExamResultForStudent(userId);
      const result = await getExamNameForStudent(userId);
      if (result.data.success && Array.isArray(result.data.data)) {
        setExamOptions(
          result.data.data.map((e: any) => ({
            value: e.exam_name_id,
            label: e.examName,
          }))
        );
      } else {
        setExamOptions([]);
        toast.warning("No exams found.");
      }
      if (data && data.success) {
        setResults(data.data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      toast.error("Failed to fetch exam results");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStudent(userId);
      fetchResult(userId);
    }
  }, [userId]);

  const filteredResults =
    selectedExams.length > 0
      ? results.filter((result) =>
          selectedExams.includes(String(result.exam_name_id))
        )
      : results;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Results</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.studentDashboard}>Student Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Results
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-12 col-xl-12">
              <div className="row">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Exams & Results</h4>
                    <Select
                      options={examOptions}
                      mode="multiple"
                      className="Select"
                      placeholder="Choose Exams"
                      value={selectedExams}
                      onChange={(value) => setSelectedExams(value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center">Loading...</div>
                    ) : filteredResults.length === 0 ? (
                      <div className="text-center text-muted">
                        {selectedExams.length > 0
                          ? "No results found for selected exams"
                          : "No exam results available"}
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
                              <strong>{"Download Exam Result"}</strong>
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

      {/* {student.rollnum && (
        <StudentModals onAdd={() => {}} rollnum={Number(student.rollnum)} />
      )} */}

      {isModalVisible && modalStudentItem && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose a Result Template</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalVisible(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  {templateConfigs.map((template) => (
                    <div className="col-lg-6 col-xl-4 mb-4" key={template.id}>
                      <div
                        className="border p-3 h-100 d-flex flex-column"
                        style={{
                          borderRadius: "12px",
                          background: "#f8f9fa",
                          minHeight: "550px",
                        }}
                      >
                        <template.component
                          studentItem={modalStudentItem}
                          studentRollnum={student.rollnum}
                          label={template.label}
                        />
                        <div className="mt-2 text-center"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentExamResult;
