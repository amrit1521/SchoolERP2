import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { all_routes } from "../../../router/all_routes";
import type { TableData } from "../../../core/data/interface";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import TooltipOption from "../../../core/common/tooltipOption";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { allRealClasses } from "../../../service/classApi";
import {
  examNameForOption,
  getAllSectionForAClass,
  getStudentExamResultEditList,
  Imageurl,
} from "../../../service/api";
import { Spinner } from "../../../spinner";

interface FilterData {
  class: number | null;
  section: number | null;
  exam_type: number | null;
}

interface StudentExamResult {
  admissionNo: string;
  studentName: string;
  total: number;
  rollNo: number;
  subjects: any[];
  img: string;
  percent: number;
  grade: string;
}

const GradeReport = () => {
  const routes = all_routes;
  const [allClass, setAllClass] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [examOptions, setExamOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [allSections, setAllSections] = useState<any[]>([]);
  const [studentExamDetails, setStudentExamDetails] = useState<
    StudentExamResult[]
  >([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await allRealClasses();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAllClass(
          data.data.map((e: any) => ({ value: e.id, label: e.class_name }))
        );
      } else {
        setAllClass([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch classes !");
    }
  };
  const fetchInitialResultData = async () => {
    try {
      setLoading(true);
      const { data: classData } = await allRealClasses();
      if (!classData.success || !Array.isArray(classData.data)) return;

      for (const cls of classData.data) {
        const { data: sectionData } = await getAllSectionForAClass(cls.id);
        if (!sectionData.success || !Array.isArray(sectionData.data)) continue;

        for (const sec of sectionData.data) {
          const { data: examData } = await examNameForOption({
            class: cls.id,
            section: sec.id,
          });
          if (!examData.success || !Array.isArray(examData.data)) continue;

          // Try each exam
          for (const exam of examData.data) {
            const filtred = {
              className: cls.id,
              section: sec.id,
              examName: exam.id,
            };
            const { data: resultData } = await getStudentExamResultEditList(
              filtred
            );

            if (
              resultData.success &&
              Array.isArray(resultData.data) &&
              resultData.data.length > 0
            ) {
              setFilterData({
                class: cls.id,
                section: sec.id,
                exam_type: exam.id,
              });

              setStudentExamDetails(
                resultData.data.map((item: any) => ({
                  admissionNo: item.admissionNum,
                  studentName: item.name,
                  total: item.totalObtained,
                  rollNo: item.rollNum,
                  subjects: item.subject,
                  img: item.img,
                  percent: item.percentage,
                  grade: item.grade,
                }))
              );
              setSubjects(resultData.data[0]?.subject || []);
              setLoading(false);
              return; // stop here once you find one valid dataset
            }
          }
        }
      }

      toast.info("No exam results found yet!");
      setLoading(false);
    } catch (error) {
      console.error("Error auto-fetching result data:", error);
      toast.error("Error loading initial data!");
      setLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchClasses();
      await fetchInitialResultData();
    })();
  }, []);

  // handle Filter:
  const [filterData, setFilterData] = useState<FilterData>({
    class: null,
    section: null,
    exam_type: null,
  });
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const fetchExamOptions = async (cls: number, section: number) => {
    try {
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
    }
  };
  const fetchSections = async (id: number) => {
    try {
      if (id) {
        const { data } = await getAllSectionForAClass(id);
        const options: any[] = [];
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          options.push(
            ...data.data.map((e: any) => ({
              value: e.id,
              label: e.section_name,
            }))
          );
          setAllSections(options);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch sections !");
    }
  };

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number | null
  ) => {
    setFilterData((prev) => {
      const updated = { ...prev, [name]: value } as FilterData;
      if (name === "section") {
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

  useEffect(() => {
    if (filterData.class) {
      fetchSections(filterData.class);
    }
  }, [filterData.class]);

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterData.class || !filterData.section || !filterData.exam_type) {
      toast.warning("Please select class, section, and exam type first!");
      return;
    }

    try {
      const filtred: any = {
        className: filterData?.class,
        section: filterData?.section,
        examName: filterData?.exam_type,
      };
      console.log("filtred: ", filtred);
      const { data } = await getStudentExamResultEditList(filtred);
      if (data.success) {
        console.log("result data: ", data);
        setStudentExamDetails(
          data.data.map((item: any) => ({
            admissionNo: item.admissionNum,
            studentName: item.name,
            total: item.totalObtained,
            rollNo: item.rollNum,
            subjects: item.subject,
            img: item.img,
            percent: item.percentage,
            grade: item.grade,
          }))
        );
        const subjList = data.data[0]?.subject || [];
        setSubjects(subjList);
      }
    } catch (error) {
      console.error("Filter apply error:", error);
      toast.error("Failed to apply filter!");
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: null, section: null, exam_type: null });
    setExamOptions([]);
    console.log(filterData);
    setIsApplyDisabled(true);
    dropdownMenuRef.current?.classList.remove("show");
  };

  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      key: "admissionNo",
      sorter: (a: TableData, b: TableData) =>
        a.admissionNo.length - b.admissionNo.length,
      render: (text: any) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
      sorter: (a: TableData, b: TableData) =>
        a.studentName.length - b.studentName.length,
      render: (text: any, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={routes.studentDetail} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              alt="avatar"
              className="img-fluid rounded-circle"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={routes.studentDetail}>{text}</Link>
            </p>
            <span className="fs-12">Roll No : {record.rollNo}</span>
          </div>
        </div>
      ),
    },
    ...subjects.map((sub: any) => ({
      title: sub?.subject_name,
      dataIndex: sub?.subject_name?.toLowerCase(),
      key: sub?.subject_name?.toLowerCase(),
      render: (_: any, record: any) => {
        const subjectMarks = record.subjects.find(
          (subject: any) => subject.subject_id === sub.subject_id
        );
        return <span>{subjectMarks ? subjectMarks.mark_obtained : 0}</span>;
      },
    })),
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a: TableData, b: TableData) => a.total.length - b.total.length,
    },
    {
      title: "Percent(%)",
      dataIndex: "percent",
      key: "percent",
      sorter: (a: TableData, b: TableData) =>
        a.percent.length - b.percent.length,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a: TableData, b: TableData) => a.grade.length - b.grade.length,
      render: (text: any, record: any) => (
        <span className={record.textColor ? `text-${record.textColor}` : ""}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div>
      {" "}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Grade Report</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Grade Report
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Student List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Grade Report List</h4>
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
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                value={filterData.class}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "class",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={allSections}
                                value={filterData.section}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "section",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Exam Type</label>
                              <CommonSelect
                                className="select"
                                options={examOptions}
                                value={filterData.exam_type}
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
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link
                          to="#"
                          className="btn btn-light me-3"
                          onClick={handleResetFilter}
                        >
                          Reset
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                          disabled={isApplyDisabled}
                        >
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
              {/* Student List */}
              {loading ? (
                <Spinner />
              ) : (
                <Table
                  dataSource={studentExamDetails}
                  columns={columns}
                  Selection={true}
                />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Student List */}
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  );
};

export default GradeReport;
