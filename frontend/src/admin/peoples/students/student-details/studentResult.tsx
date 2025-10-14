import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Select } from "antd";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

import {
  getAllExamNameForAStud,
  getExamResult,
  specificStudentData1,
} from "../../../../service/api";

import {
  PdfTemplate1,
  PdfTemplate2,
  PdfTemplate3,
  PdfTemplate4,
  PdfTemplate5,
  PdfTemplate6,
  PdfTemplate7,
} from "./pdfTemplate";

import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import StudentModals from "../studentModals";
import { all_routes } from "../../../router/all_routes";

const StudentResult = () => {
  const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();
  const [student, setStudent] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [examOptions, setExamOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalStudentItem, setModalStudentItem] = useState<any>(null);
  const [modalExamKey, setModalExamKey] = useState<string>("");

  // 👇 Define available templates
  const TemplateType = [
    { value: "type1", label: "Template 1" },
    { value: "type2", label: "Template 2" },
    { value: "type3", label: "Template 3" },
  ];

  // 👇 Dynamically render a template
  const renderTemplate = (type: string, props: any) => {
    switch (type) {
      case "type1":
        return <PdfTemplate1 {...props} />;
      case "type2":
        return <PdfTemplate2 {...props} />;
      case "type3":
        return <PdfTemplate3 {...props} />;
      default:
        return null;
    }
  };

  // 👇 Convert an element into a PDF Blob
  const convertToBlob = async (element: HTMLElement): Promise<Blob> => {
    const opt: any = {
      margin: 0,
      filename: "preview.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    const worker = html2pdf().set(opt).from(element).toPdf();
    const pdfObj = await worker.get("pdf");
    return pdfObj.output("blob");
  };

  // 👇 Generate a preview URL and show in iframe
  const showPdfPreview = async (
    elementId: string,
    setPreviewUrl: (url: string) => void
  ) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const blob = await convertToBlob(element);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await specificStudentData1(Number(rollnum));
      setStudent(res.data.student);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (rn: number) => {
    try {
      const { data } = await getExamResult(rn);
      const result = await getAllExamNameForAStud(rn);
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
      if (data.success) setResults(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 👇 Download PDF
  const downloadPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const opt: any = {
      margin: 0.2,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a3", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (rollnum) {
      fetchStudent();
      fetchResult(Number(rollnum));
    }
  }, [rollnum]);

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
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4>Exams & Results</h4>
                  <Select
                    options={examOptions}
                    mode="multiple"
                    placeholder="Choose Exams"
                    value={selectedExams}
                    onChange={(value) => setSelectedExams(value)}
                    style={{ width: 250 }}
                  />
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center">Loading...</div>
                  ) : (
                    results.map((studentItem: any, index: number) => {
                      const examKey = `${studentItem.rollnum}-${index}`;
                      return (
                        <div
                          key={examKey}
                          className="accordion-item mb-3 border rounded p-3 d-flex justify-content-between align-items-center"
                        >
                          <div>
                            {studentItem?.exams?.[0]?.exam_name || "Exam"}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setModalExamKey(examKey);
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

      {/* ✅ Template Preview Modal */}
      {isModalVisible && modalStudentItem && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Choose a Template</h5>
                <button
                  className="btn-close"
                  onClick={() => setIsModalVisible(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  {TemplateType.map((template) => {
                    const previewId = `preview-${modalExamKey}-${template.value}`;
                    const [previewUrl, setPreviewUrl] = useState<string | null>(
                      null
                    );

                    // Generate preview after render
                    useEffect(() => {
                      showPdfPreview(previewId, setPreviewUrl);
                    }, [modalStudentItem]);

                    return (
                      <div className="col-md-6 mb-4" key={template.value}>
                        <div
                          className="border p-3 position-relative"
                          style={{ height: 600 }}
                        >
                          <div id={previewId} style={{ display: "none" }}>
                            {renderTemplate(template.value, {
                              studentItem: modalStudentItem,
                              exam: modalStudentItem.exams,
                            })}
                          </div>

                          {previewUrl ? (
                            <iframe
                              src={previewUrl}
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "1px solid #ddd",
                              }}
                              title={template.label}
                            />
                          ) : (
                            <div className="text-center">
                              Generating preview...
                            </div>
                          )}

                          <button
                            className="btn btn-sm btn-primary position-absolute top-0 end-0 m-2"
                            onClick={() =>
                              downloadPDF(
                                previewId,
                                `${template.label}_${student.rollnum}.pdf`
                              )
                            }
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {student.rollnum && (
        <StudentModals onAdd={() => {}} rollnum={Number(student.rollnum)} />
      )}
    </>
  );
};

export default StudentResult;
