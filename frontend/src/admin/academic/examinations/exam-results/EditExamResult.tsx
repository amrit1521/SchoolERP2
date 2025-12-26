import React, { useEffect, useRef, useState } from "react";
import CommonSelect from "../../../../core/common/commonSelect";
import { all_routes } from "../../../../router/all_routes";
import { toast } from "react-toastify";
import { Card, Input, Space, message } from "antd";
import Table from "../../../../core/common/dataTable/index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../../../spinner";
import {
  SaveOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  WhatsAppOutlined,
  MessageOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import TooltipOption from "../../../../core/common/tooltipOption";
import {
  addExamResult2,
  examNameForOption,
  getAllSectionForAClass,
  getStudentExamResultEditList,
} from "../../../../service/api";
import { allRealClasses } from "../../../../service/classApi";

// ---------- Types ----------
interface Subject {
  subject_id: number;
  subject_name: string;
  code: number;
  mark_obtained: number;
  minMarks: number;
  maxMarks: number;
}

interface Student {
  name: string;
  class: string;
  section: string;
  admissionNum: string;
  rollNum: number;
  subject: Subject[];
}

interface MarksEntry {
  mark: number;
  checked: boolean;
}

interface FilterData {
  class: number | null;
  section: number | null;
  exam_type: number | null;
}

type MarksData = Record<string, Record<string, MarksEntry>>;

export default function ExamMarkUpload() {
  const routes = all_routes;
  const location = useLocation();
  const navigate = useNavigate();
  const {
    exam_name_id: examId,
    class: class_Name,
    section: sections,
  } = location.state || {};
  const [className, setClassName] = useState<number>(class_Name);
  const [section, setSection] = useState<number>(sections);
  const [exam_name_id, setExamNameId] = useState<number>(examId);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marksData, setMarksData] = useState<MarksData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [allClass, setAllClass] = useState<any[]>([]);
  // Fetch Data from API
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true);
        const { data } = await getStudentExamResultEditList({
          examName: exam_name_id,
          className,
          section,
        });
        console.log("data: ", data);
        if (data.success == false) {
          setStudents([]);
          setSubjects([]);
          toast.error(data.message);
          navigate("/academic/exam-result");
        }
        setStudents(data.data);

        const subjList = data.data[0]?.subject || [];
        setSubjects(subjList);

        const initialData: MarksData = {};
        data.data.forEach((stu: Student) => {
          initialData[stu.admissionNum] = {};
          stu.subject.forEach((sub) => {
            console.log(sub);
            initialData[stu.admissionNum][sub.subject_id] = {
              mark: sub.mark_obtained,
              checked: false,
            };
          });
        });
        setMarksData(initialData);
        setLoading(false);
        message.success("Exam result list loaded!");
      } catch (error) {
        console.error("Failed to fetch exam result list:", error);
        message.error("Failed to fetch exam result list");
      }
    };

    if (exam_name_id && className && section) {
      getList();
    }
  }, [exam_name_id, className, section]);

  // const handleCheck = (admNo: string, subId: number) => {
  //   setMarksData((prev) => ({
  //     ...prev,
  //     [admNo]: {
  //       ...prev[admNo],
  //       [subId]: {
  //         ...prev[admNo][subId],
  //         checked: !prev[admNo][subId].checked,
  //       },
  //     },
  //   }));
  // };

  const handleMarkChange = (admNo: string, subId: number, value: string) => {
    setMarksData((prev) => ({
      ...prev,
      [admNo]: {
        ...prev[admNo],
        [subId]: {
          ...prev[admNo][subId],
          mark: value,
        },
      },
    }));
  };
  //handling filter
  const [filterData, setFilterData] = useState<FilterData>({
    class: null,
    section: null,
    exam_type: null,
  });
  const [examOptions, setExamOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [sectionOptions, setSectionOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const fetchClass = async () => {
    try {
      const { data } = await allRealClasses();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAllClass(
          data.data.map((e: any) => ({ value: e.id, label: e.class_name }))
        );
      } else {
        setAllClass([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch classes !");
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);

  const fetchSections = async (id: number) => {
    try {
      if (id) {
        const { data } = await getAllSectionForAClass(id);
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSectionOptions(
            data.data.map((e: any) => ({
              value: e.id,
              label: e.section_name,
            }))
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch sections !");
    }
  };
  useEffect(() => {
    if (filterData.class) {
      fetchSections(filterData.class);
    }
  }, [filterData.class]);

  const fetchExamOptions = async (cls: number, section: number) => {
    try {
      setLoading(true);
      const { data } = await examNameForOption({ class: cls, section });
      if (data.success && Array.isArray(data.data)) {
        setExamOptions(
          data.data.map((e: any) => ({ value: e.id, label: e.examName }))
        );
      } else {
        setExamOptions([]);
        toast.warning("No exams found for this class & section.");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Error fetching exam names!");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number | null
  ) => {
    setFilterData((prev) => {
      const updated = { ...prev, [name]: value } as FilterData;
      if (name === "class" || name === "section") {
        updated.exam_type = null;
        if (updated.class && updated.section) {
          fetchExamOptions(updated.class, updated.section);
        } else setExamOptions([]);
      }
      return updated;
    });
  };

  useEffect(() => {
    setIsApplyDisabled(!filterData.exam_type);
  }, [filterData.exam_type]);

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterData.class || !filterData.section || !filterData.exam_type) {
      toast.warning("Please select class, section, and exam type first!");
      return;
    }

    try {
      setClassName(filterData.class);
      setSection(filterData.section);
      setExamNameId(filterData.exam_type);
    } catch (error) {
      console.error("Filter apply error:", error);
      toast.error("Failed to apply filter!");
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: null, section: null, exam_type: null });
    setExamOptions([]);
    setIsApplyDisabled(true);
    dropdownMenuRef.current?.classList.remove("show");
  };

  const handleSave = async () => {
    
    const dataList = students.map((stu) => ({
      rollNum: stu.rollNum,
      admissionNum: stu.admissionNum,
      marks: subjects.map((sub) => ({
        subject_id: sub.subject_id,
        mark: parseInt(
          marksData[stu.admissionNum]?.[sub.subject_id]?.mark?.toString() ?? "0"
        ),
        minMarks: sub.minMarks,
        maxMarks: sub.maxMarks,
        // checked:
        //   marksData[stu.admissionNum]?.[sub.subject_id]?.checked || false,
      })),
    }));
    const finalPayload = {
      marksDataList: dataList,
      exam_name_id: exam_name_id,
    };
    try {
      const { data } = await addExamResult2(finalPayload);
     
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
   
  };

  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNum",
      key: "admissionNum",
      width: 150,
    },
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      fixed: "left" as const,
      width: 200,
    },
    {
      title: "Roll Number",
      dataIndex: "rollNum",
      key: "rollNum",
      width: 120,
    },
    ...subjects.map((sub) => ({
      title: (
        <div>
          <div>
            {sub.subject_name}-({sub.code})
          </div>
          <div style={{ fontSize: 11, color: "#888" }}>
            Max: {sub.maxMarks}, Min: {sub.minMarks}
          </div>
        </div>
      ),
      key: sub.subject_id,
      width: 150,
      render: (_: any, record: Student) => {
        const current = marksData[record.admissionNum]?.[sub.subject_id] || {
          mark: "",
          checked: false,
        };

        const markValue = current.mark;

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          handleMarkChange(record.admissionNum, sub.subject_id, e.target.value);
        };

        const handleInputBlur = () => {
          const numericValue = Number(markValue);

          if (markValue === null) return;

          if (isNaN(numericValue)) return;

          if (numericValue > sub.maxMarks) {
            toast.error(`Marks cannot be greater than ${sub.maxMarks}`);
            handleMarkChange(
              record.admissionNum,
              sub.subject_id,
              sub.maxMarks.toString()
            );
          } else if (numericValue < 0) {
            toast.error(`Marks cannot be less than 0`);
            handleMarkChange(record.admissionNum, sub.subject_id, "0");
          }
        };

        return (
          <Space>
            <Input
              type="number"
              style={{ width: 70 }}
              value={markValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Space>
        );
      },
    })),
  ];

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Edit Exam Result</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Exam Result
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    onClick={handleSave}
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    <SaveOutlined className="me-2" />
                    Save
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-warning"
                    onClick={() => console.log("handleImport")}
                    data-bs-toggle="modal"
                  >
                    <UploadOutlined className="me-2" />
                    Import Excel File
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    onClick={() => console.log("handlePublish")}
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    <CheckCircleOutlined className="me-2" />
                    Publish Result
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    <WhatsAppOutlined className="me-2" />
                    WhatsApp
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                  >
                    <MessageOutlined className="me-2" />
                    SMS
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */} {/* Guardians List */}
            <div className="dropdown mb-3 me-2 d-flex justify-content-between mt-3">
              <div className="text-center pt-2">
                Class:{" "}
                {students
                  ? `${
                      students[0]?.class
                    }-(${students[0]?.section.toUpperCase()})`
                  : "no class"}
              </div>
              <Link
                to="#"
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
              >
                <FilterOutlined className="me-2" />
                Filter
              </Link>

              <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                <form onSubmit={handleApplyClick}>
                  <div className="d-flex align-items-center border-bottom p-3">
                    <h4>Filter</h4>
                  </div>
                  <div className="p-3 border-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          options={allClass}
                          value={filterData.class || null}
                          onChange={(option) =>
                            handleFilterSelectChange(
                              "class",
                              option ? option.value : ""
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          options={
                            sectionOptions
                              ? sectionOptions.map((e: any) => ({
                                  value: e.value,
                                  label: e.label.toUpperCase(),
                                }))
                              : []
                          }
                          value={filterData.section || null}
                          onChange={(option) =>
                            handleFilterSelectChange(
                              "section",
                              option ? option.value : ""
                            )
                          }
                        />
                      </div>

                      <div className="col-md-6 mt-3">
                        <label className="form-label">Exam Type</label>
                        <CommonSelect
                          options={examOptions}
                          value={filterData.exam_type || null}
                          onChange={(option) =>
                            handleFilterSelectChange(
                              "exam_type",
                              option ? option.value : null
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 d-flex align-items-center justify-content-end">
                    <button
                      className="btn btn-light me-3"
                      onClick={handleResetFilter}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isApplyDisabled}
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Table */}
            <Card title="Exam Results">
              {loading ? (
                <Spinner />
              ) : (
                <Table
                  columns={columns}
                  dataSource={students}
                  Selection={false}
                />
              )}
            </Card>
          </div>
        </div>
      </>
    </div>
  );
}
