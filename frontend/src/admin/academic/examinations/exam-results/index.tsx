import React, { useEffect, useMemo, useRef, useState } from "react";
// import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
// import { examresult } from '../../../../core/data/json/exam-result';
// import type { TableData } from '../../../../core/data/interface';
import Table from "../../../../core/common/dataTable/index";
import { Link, useNavigate } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  allClass,
  classSection,
} from "../../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import {
  addExamResult,
  allExamData,
  editMark,
  examNameForOption,
  examSubjectForOption,
  filterStudentsForOption,
  getAllSection,
  getExamResultAllStudents,
  getSpeExamResult,
  Imageurl,
  speMark,
} from "../../../../service/api";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import { Spinner } from "../../../../spinner";
// import ExamMarkUpload from "./EditExamResult";

export interface SubjectResult {
  id: number;
  mark_obtained: number;
  max_mark: number;
  grade_marks?: string | null;
  marks_type?: string | null;
}

export interface StudentResult {
  key: number;
  rollnum: number;
  admissionNo: string;
  studentName: string;
  img: string;
  subjects: Record<string, SubjectResult>;
  examName: string;
  totalMaxMarks: number;
  total: number;
  percent: number;
  grade: string;
  result: "Pass" | "Fail";
}

// add result interface
export interface AddResult {
  roll_num: number | null;
  exam_name_id: number | null;
  subject_id: number | null;
  max_mark: number | null;
  min_mark: number | null;
  mark_obtained: number | null;
  marks_type: string | null | "";
  grade_marks: string | null | "";
}

export interface Section {
  id: string;
  section: string;
}

export interface ExamName {
  id: string;
  examName: string;
}

export interface StudetnOption {
  value: number;
  label: string;
}
const initialFormData: AddResult = {
  roll_num: null,
  exam_name_id: null,
  subject_id: null,
  max_mark: null,
  min_mark: null,
  mark_obtained: null,
  marks_type: null,
  grade_marks: null,
};

// edit mark
export interface EditMark {
  max_mark: number | null;
  mark_obtained: number | null;
  grade_marks?: string | null;
  marks_type?: string | null;
}

const ExamResult = () => {
  const routes = all_routes;
  const [resultData, setResultData] = useState<StudentResult[]>([]);
  const [originalResultData, setOriginalResultData] = useState<StudentResult[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  // const [selectedClass, setSelectedClass] = useState("");
  // const [selectedSection, setSelectedSection] = useState("");
  // const [examOptions, setExamOptions] = useState<
  //   { value: number; label: string }[]
  // >([]);
  const [resultData2, setResultData2] = useState<any[]>([]);
  const [examOptionsMap, setExamOptionsMap] = useState<
    Record<number, { value: number; label: string }[]>
  >({});
  const [selectedExams, setSelectedExams] = useState<
    Record<number, { value: number; label: string }>
  >({});
  const navigate = useNavigate();

  // ...inside ExamResult component...
  const [showExamMarkUpload, setShowExamMarkUpload] = useState(false);
  // const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  useEffect(() => {
    const rows = allClass.map((cls, index) => ({
      key: index,
      class: cls.value,
      section: "",
      examName: "",
    }));
    setResultData2(rows);
  }, []);

  const fetchResult = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    try {
      const { data } = await getExamResultAllStudents();
      console.log(data);
      if (data.success) {
        setResultData(data.data);
        setOriginalResultData(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  const [editMarkData, setEditMarkData] = useState<EditMark>({
    max_mark: null,
    mark_obtained: null,
  });

  const [editId, setEditId] = useState<number | null>(null);

  const fetchMarkForEdit = async (id: number | null) => {
    console.log(id);
    if (!id) {
      toast.error("Id not provided or you want to edit blank mark!");
      return;
    }
    try {
      const { data } = await speMark(id);
      console.log(data);
      if (data.success) {
        setEditMarkData({
          max_mark: data.data.max_mark,
          mark_obtained: data.data.mark_obtained,
          grade_marks: data.data.grade_marks,
          marks_type: data.data.marks_type,
        });
        setEditId(id);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleSelectChangeForEditMark = (
    name: keyof EditMark,
    value: string | number
  ) => {
    setEditMarkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editMarkData.max_mark) {
      if (!editMarkData.mark_obtained) {
        toast.error("Mark is required !");
        return;
      } else if (editMarkData.mark_obtained > editMarkData.max_mark) {
        toast.warning("Obtained mark should not be greater than max mark");
        return;
      }
    }

    try {
      if (editId) {
        const { data } = await editMark(editMarkData, editId);
        if (data.success) {
          toast.success(data.message);
          fetchResult();
          setEditId(null);
          setEditMarkData({
            mark_obtained: null,
            max_mark: null,
          });
          handleModalPopUp("edit_mark");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMarkData({
      max_mark: null,
      mark_obtained: null,
    });
    setEditId(null);
  };

 
  let subjectColumns: any[] = [];
  if (resultData.length > 0) {
    const subjectKeys = new Set<string>();
    resultData.forEach((student) => {
      Object.keys(student.subjects || {}).forEach((subject) => {
        subjectKeys.add(subject);
      });
    });

    subjectColumns = Array.from(subjectKeys).map((subject) => ({
      title: subject,
      dataIndex: ["subjects", subject],
      render: (value: SubjectResult | undefined) => (

        <span className={value && value.mark_obtained < (value.max_mark * 0.33) ? "text-danger" : ""}>
          {value ? value.mark_obtained  : "-"} {/* show dash if no mark */}
          
          <span onClick={() => fetchMarkForEdit(value ? value.id : null)} data-bs-toggle="modal"
            data-bs-target="#edit_mark" style={{ cursor: 'pointer' }}><CiEdit size={15} /></span>

        </span>
      ),
      sorter: (a: StudentResult, b: StudentResult) =>
        (a.subjects[subject]?.mark_obtained || 0) -
        (b.subjects[subject]?.mark_obtained || 0),
    }));
  }

  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (text: any, record: any) => (
        <Link
          to={`${routes.studentDetail}/${record.rollnum}`}
          className="link-primary"
        >
          {text}
        </Link>
      ),
      sorter: (a: StudentResult, b: StudentResult) =>
        a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          
          <Link
            to={`${routes.studentDetail}/${record.rollnum}`}
            className="avatar me-2"
          >
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          </Link>

        
          <div className="flex-grow-1">
            <div>
              <Link
                to={`${routes.studentDetail}/${record.rollnum}`}
                className="text-dark fw-semibold"
                style={{ textDecoration: "none" }}
              >
                {text}
              </Link>
            </div>
            <div className="text-muted fs-12">
              {record.class && record.section
                ? `${record.class}-${record.section}`
                : ""}
              {record.roll ? ` | ${record.roll}` : ""}
            </div>
          </div>
        </div>
      ),
      sorter: (a: StudentResult, b: StudentResult) =>
        a.studentName.length - b.studentName.length,
    },

   

   
    ...subjectColumns,
    {
      title: "Exam Name",
      dataIndex: "examName",
      sorter: (a: StudentResult, b: StudentResult) =>
        a.examName.localeCompare(b.examName),
    },

    // New field: Total Max Marks
    {
      title: "Total",
      dataIndex: "totalMaxMarks",
      sorter: (a: StudentResult, b: StudentResult) =>
        a.totalMaxMarks - b.totalMaxMarks,
      render: (value: number) => <span>{value}</span>,
    },

    {
      title: "Obtained",
      dataIndex: "total",
      sorter: (a: StudentResult, b: StudentResult) => a.total - b.total,
    },
    {
      title: "Percent",
      dataIndex: "percent",
      sorter: (a: StudentResult, b: StudentResult) => a.percent - b.percent,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      sorter: (a: StudentResult, b: StudentResult) =>
        a.grade.length - b.grade.length,
    },
    {
      title: "Result",
      dataIndex: "result",
      render: (text: string) => (
        <span
          className={`badge ${
            text === "Pass" ? "badge-soft-success" : "badge-soft-danger"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: StudentResult, b: StudentResult) =>
        a.result.length - b.result.length,
    },
  ];

  const columns2 = [
    {
      title: "Class",
      dataIndex: "class",
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (_: any, record: any, index: number) => (
        <CommonSelect
          className={`select text-capitalize ${
            errors.section ? "is-invalid" : ""
          }`}
          options={sectionOptions}
          value={record.section ? record.section.value : null}
          onChange={(opt: any) => {
            const newData = [...resultData2];
            newData[index].section = opt.value;
            setResultData2(newData);

            // Fetch exams for this row based on class + section
            fetchExamForOption2(record.class, opt.value, index);
          }}
        />
      ),
    },
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (__: any, _: any, index: number) => {
        const options = examOptionsMap[index] || [];
        const selectedExam = selectedExams[index] || null;

        return (
          <CommonSelect
            options={options}
            value={selectedExam?.value}
            onChange={(opt: any) => {
              const newData = [...resultData2];
              console.log(opt);
              newData[index].examName = opt.label;
              setResultData2(newData);
              return setSelectedExams((prev) => ({
                ...prev,
                [index]: { label: opt.label, value: opt.value },
              }));
            }}
          />
        );
      },
    },
    {
      title: "Add Result",
      render: (_: any, index: number) => (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleAddResult2(index)}
        >
          Update Result
        </button>
      ),
    },
  ];
  const [formData, setformdata] = useState<AddResult>(initialFormData);
  const [errors, setErrors] = useState<any>({});
  const [sections, setSections] = useState<Section[]>([]);

  // for fetching students , examname , subjectname etc
  const [section, setSection] = useState<string>("");
  const [cls, setCls] = useState<string>("");
  const [students, setStudets] = useState<StudetnOption[]>([]);
  const [examOpt, setExamOpt] = useState<{ value: number; label: string }[]>(
    []
  );
  const [subjectData, setSubjectData] = useState<any>([]);
  const [subjectOpt, setSubejctOpt] = useState<
    { value: number; label: string }[]
  >([]);

  const handleAddResult2 = (index: number) => {
    const selectedExam = selectedExams[index];
    const rowData = resultData2[index];
    console.log(
      "Adding result for row:",
      rowData,
      "Selected Exam:",
      selectedExam
    );
    // setShowExamMarkUpload(true);
    navigate("/academic/update-exam-result", {
      state: { name: "John", age: 30 },
    });
  };

  const marksTypeOpt: { value: string; label: string }[] = [
    { value: "marks", label: "Marks" },
    { value: "grade", label: "Grade" },
  ];
  const gradeMarksOpt: { value: string; label: string }[] = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
  ];

  const fetchStudents = async () => {
    try {
      const dataa = {
        class: cls,
        section: section,
      };
      const { data } = await filterStudentsForOption(dataa);

      if (data.success) {
        setStudets(
          data.students.map((s: any) => ({
            value: s.rollnum,
            label: `${s.firstname} ${s.lastname}`,
          }))
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch studnets !");
    }
  };

  const fetchExamForOption2 = async (
    cls: string,
    section: string,
    rowIndex: number
  ) => {
    try {
      const { data } = await examNameForOption({ class: cls, section });
      let options: { value: number; label: string }[] = [];

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        options = data.data.map((e: any) => ({
          value: e.id,
          label: e.examName,
        }));
      } else {
        options = [{ value: 0, label: "No Exam" }];
      }

      setExamOptionsMap((prev) => ({ ...prev, [rowIndex]: options }));
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch examName!");
    }
  };

  const fetchExamForOption = async () => {
    try {
      const dataa = {
        class: cls,
        section: section,
      };
      const { data } = await examNameForOption(dataa);

      if (data.success) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          setExamOpt(
            data.data.map((e: any) => ({ value: e.id, label: e.examName }))
          );
        } else {
          setExamOpt([{ value: 0, label: "No Exam" }]);
        }
      } else {
        setExamOpt([{ value: 0, label: "No Exam" }]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch examName !");
    }
  };

  const fetchSubjectsRelatedToExam = async () => {
    try {
      const dataa = {
        class: cls,
        section: section,
        exam_name_id: formData.exam_name_id,
      };

      const { data } = await examSubjectForOption(dataa);
      if (data.success) {
        setSubjectData(data.data);
        setSubejctOpt(
          data.data.map((s: any) => ({
            value: s.id,
            label: `${s.name}(${s.code})`,
          }))
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (formData.marks_type === "marks") {
      const subject = subjectData.find(
        (s: any) => s.id === formData.subject_id
      );
      if (subject) {
        setformdata((prev) => ({
          ...prev,
          max_mark: Number(subject.maxMarks),
          min_mark: Number(subject.minMarks),
        }));
      }
    }
  }, [formData.marks_type]);
  // section, cls, formData.exam_name_id, formData.subject_id, subjectData
  useEffect(() => {
    if (section && cls) {
      fetchStudents();
      fetchExamForOption();
    }
    if (section && cls && formData.exam_name_id) {
      fetchSubjectsRelatedToExam();
    }
  }, [section, cls, formData.exam_name_id]);

  const fetchData = async <T,>(
    apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    try {
      const { data } = await apiFn();
      if (data.success) setter(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSections = () => fetchData(getAllSection, setSections);

  useEffect(() => {
    fetchSections();
  }, []);

  const sectionOptions = useMemo(
    () =>
      sections.map((s) => ({
        value: s.section,
        label: s.section,
      })),
    [sections]
  );

  const validateForm = () => {
    const newErrors: any = {};

    if (!cls) newErrors.cls = "Class is required";
    if (!section) newErrors.section = "Section is required";
    if (!formData.roll_num) newErrors.roll_num = "Student is required";
    if (!formData.exam_name_id) newErrors.exam_name_id = "Exam is required";
    if (!formData.subject_id) newErrors.subject_id = "Subject is required";
    if (!formData.marks_type) newErrors.marks_type = "Marks Type is required";

    if (
      formData.marks_type === "marks" &&
      (formData.max_mark === null ||
        formData.max_mark < 0 ||
        formData.max_mark === 0)
    ) {
      newErrors.max_mark =
        "Max Marks must  be a required and Should be not Zero";
    }

    if (
      formData.marks_type === "marks" &&
      (formData.min_mark === null ||
        formData.min_mark < 0 ||
        formData.min_mark === 0)
    ) {
      newErrors.min_mark =
        "Min Marks must  be a required and Should be not Zero";
    }

    if (
      formData.marks_type === "marks" &&
      (formData.mark_obtained === null ||
        formData.mark_obtained < 0 ||
        formData.mark_obtained === 0)
    ) {
      newErrors.mark_obtained =
        "Marks Obtained must be a required and Should be not Zero";
    }

    if (
      formData.marks_type === "grade" &&
      (formData.grade_marks === null || formData.grade_marks === "")
    ) {
      newErrors.grade_marks = "Grade Marks cannot be null";
    }

    if (
      formData.marks_type === "marks" &&
      formData.mark_obtained !== null &&
      formData.max_mark !== null &&
      formData.mark_obtained > formData.max_mark
    ) {
      newErrors.mark_obtained = "Marks Obtained cannot exceed Max Marks";
    }
    return newErrors;
  };
  const handleSelectChange = (
    name: keyof AddResult,
    value: string | number
  ) => {
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    console.log(validationErrors);

    if (Object.keys(validationErrors).length !== 0) {
      return;
    }

    try {
      console.log(formData);
      const { data } = await addExamResult(formData);
      if (data.success) {
        // if (true) {
        toast.success(data.message);
        setformdata(initialFormData);
        setCls("");
        setSection("");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setformdata(initialFormData);
    setCls("");
    setSection("");
    setErrors({});
  };

  //  filter students
  const [allExam, setAllExam] = useState<any[]>([]);

  const fetchDataa = async <T,>(
    apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    try {
      const { data } = await apiFn();
      if (data.success) setter(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExams = () => fetchDataa(allExamData, setAllExam);

  useEffect(() => {
    fetchExams();
  }, []);

  const examNameOptions = useMemo(
    () =>
      allExam.map((e) => ({
        value: e.id,
        label: e.examName,
      })),
    [allExam]
  );

  interface FilterData {
    class: string;
    section: string;
    exam_type: number | null;
  }

  const [filterData, setFilterData] = useState<FilterData>({
    class: "",
    section: "",
    exam_type: null,
  });
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number
  ) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(filterData);
    try {
      const { data } = await getSpeExamResult(filterData);
      if (data.success) {
        setResultData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: "", section: "", exam_type: null });
    setResultData(originalResultData);

    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Exam Result</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Exam Result
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_result"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Result
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Exam Results</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                    <PredefinedDateRanges />
                  </div>
                  <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div
                      className="dropdown-menu drop-width"
                      ref={dropdownMenuRef}
                    >
                      <form onSubmit={handleApplyClick}>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-6">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
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
                                className="select"
                                options={classSection}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "section",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Exam Type</label>
                              <CommonSelect
                                className="select"
                                options={examNameOptions}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "exam_type",
                                    option ? option.value : ""
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
                          <button type="submit" className="btn btn-primary">
                            Apply
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 active">
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Guardians List */}
                {loading ? (
                  <Spinner />
                ) : (
                  <Table
                    columns={columns}
                    dataSource={resultData}
                    Selection={true}
                  />
                  
                )}
                <Table
                  columns={columns2}
                  dataSource={resultData2}
                  Selection={true}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Add Home Work */}
        <div className="modal fade" id="add_result">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Result</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="text-danger fw-bold">
                    First choose class & section{" "}
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      {/* Class & Section */}
                      <div className="row mb-3">
                        <div className="col col-6">
                          <label className="form-label">
                            Class <span className="text-danger">*</span>
                          </label>
                          <CommonSelect
                            className={`select ${
                              errors.cls ? "is-invalid" : ""
                            }`}
                            options={allClass}
                            value={cls}
                            onChange={(opt: any) => setCls(opt.value)}
                          />
                          {errors.cls && (
                            <div className="text-danger mt-1">{errors.cls}</div>
                          )}
                        </div>
                        <div className="col col-6">
                          <label className="form-label">
                            Section <span className="text-danger">*</span>
                          </label>
                          <CommonSelect
                            className={`select text-capitalize ${
                              errors.section ? "is-invalid" : ""
                            }`}
                            options={sectionOptions}
                            value={section}
                            onChange={(opt: any) => setSection(opt.value)}
                          />
                          {errors.section && (
                            <div className="text-danger mt-1">
                              {errors.section}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Student */}
                      <div className="mb-3">
                        <label className="form-label">
                          Student <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className={`select ${
                            errors.roll_num ? "is-invalid" : ""
                          }`}
                          options={students}
                          value={formData.roll_num}
                          onChange={(opt: any) =>
                            handleSelectChange("roll_num", opt?.value || null)
                          }
                        />
                        {errors.roll_num && (
                          <div className="text-danger mt-1">
                            {errors.roll_num}
                          </div>
                        )}
                      </div>
                      {/* Exam */}
                      <div className="mb-3">
                        <label className="form-label">
                          Exam <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className={`select ${
                            errors.exam_name_id ? "is-invalid" : ""
                          }`}
                          options={examOpt}
                          value={formData.exam_name_id}
                          onChange={(opt: any) =>
                            handleSelectChange("exam_name_id", opt?.value)
                          }
                        />
                        {errors.exam_name_id && (
                          <div className="text-danger mt-1">
                            {errors.exam_name_id}
                          </div>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <label className="form-label">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className={`select ${
                            errors.subject_id ? "is-invalid" : ""
                          }`}
                          options={subjectOpt}
                          value={formData.subject_id || ""}
                          onChange={(opt: any) =>
                            handleSelectChange("subject_id", opt?.value)
                          }
                        />
                        {errors.subject_id && (
                          <div className="text-danger mt-1">
                            {errors.subject_id}
                          </div>
                        )}
                      </div>
                      {/* Marks Type */}
                      {formData.subject_id ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Marks Type <span className="text-danger">*</span>
                          </label>
                          <CommonSelect
                            className={`select ${
                              errors.marks_type ? "is-invalid" : ""
                            }`}
                            options={marksTypeOpt}
                            value={formData.marks_type || ""}
                            onChange={(opt: any) =>
                              handleSelectChange("marks_type", opt?.value)
                            }
                          />
                          {errors.marks_type && (
                            <div className="text-danger mt-1">
                              {errors.marks_type}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Grade Marks */}
                      {formData.marks_type == "grade" ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Grade Marks<span className="text-danger">*</span>
                          </label>
                          <CommonSelect
                            className={`select ${
                              errors.grade_marks ? "is-invalid" : ""
                            }`}
                            options={gradeMarksOpt}
                            value={formData.grade_marks || ""}
                            onChange={(opt: any) =>
                              handleSelectChange("grade_marks", opt?.value)
                            }
                          />
                          {errors.grade_marks && (
                            <div className="text-danger mt-1">
                              {errors.grade_marks}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      {/* Max Marks */}
                      {formData.marks_type == "marks" ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Max Marks <span className="text-danger">*</span>
                          </label>
                          <input
                            disabled={true}
                            type="number"
                            className={`form-control ${
                              errors.max_mark ? "is-invalid" : ""
                            }`}
                            value={formData.max_mark || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                "max_mark",
                                Number(e.target.value)
                              )
                            }
                          />
                          {errors.max_mark && (
                            <div className="text-danger mt-1">
                              {errors.max_mark}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Min Marks */}
                      {formData.marks_type == "marks" ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Min Marks <span className="text-danger">*</span>
                          </label>
                          <input
                            disabled={true}
                            type="number"
                            className={`form-control ${
                              errors.min_mark ? "is-invalid" : ""
                            }`}
                            value={formData.min_mark || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                "min_mark",
                                Number(e.target.value)
                              )
                            }
                          />
                          {errors.min_mark && (
                            <div className="text-danger mt-1">
                              {errors.min_mark}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Marks Obtained */}
                      {formData.marks_type == "marks" ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Marks Obtained{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.mark_obtained ? "is-invalid" : ""
                            }`}
                            value={formData.mark_obtained || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                "mark_obtained",
                                Number(e.target.value)
                              )
                            }
                          />
                          {errors.mark_obtained && (
                            <div className="text-danger mt-1">
                              {errors.mark_obtained}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal fade" id="edit_mark">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Mark</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {editMarkData.grade_marks !== undefined &&
                      editMarkData.grade_marks !== null &&
                      editMarkData.grade_marks !== "" ? (
                        <div className="mb-3">
                          <label className="form-label">
                            Grade Marks <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            value={editMarkData.grade_marks || ""}
                            onChange={(e) =>
                              setEditMarkData((prev) => ({
                                ...prev,
                                grade_marks: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3">
                            <label className="form-label">
                              Max Marks <span className="text-danger">*</span>
                            </label>
                            <input
                              disabled={true}
                              type="number"
                              className={"form-control"}
                              value={editMarkData.max_mark || ""}
                              onChange={(e) =>
                                handleSelectChangeForEditMark(
                                  "max_mark",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Marks Obtained{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.mark_obtained ? "is-invalid" : ""
                              }`}
                              value={editMarkData.mark_obtained || ""}
                              onChange={(e) =>
                                handleSelectChangeForEditMark(
                                  "mark_obtained",
                                  Number(e.target.value)
                                )
                              }
                            />
                            {errors.mark_obtained && (
                              <div className="text-danger mt-1">
                                {errors.mark_obtained}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Home Work */}
      </>
      {/* // ...in your JSX, just before the closing </div> of your main return: */}
      {showExamMarkUpload && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Result</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExamMarkUpload(false)}
                />
              </div>
              <div className="modal-body">
                {/* <ExamMarkUpload
                  rowIndex={selectedRowIndex}
                  rowData={resultData2[selectedRowIndex]}
                  onClose={() => setShowExamMarkUpload(false)}
                /> */}
              </div>
            </div>
          </div>
          {/* Modal backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowExamMarkUpload(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ExamResult;
