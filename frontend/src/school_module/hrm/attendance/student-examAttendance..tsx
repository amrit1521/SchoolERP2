import React, { useEffect, useRef, useState } from "react";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  // AdmissionNumber,
  classSection,
  // RollNumber,
  studentclass,
  // studentName,
} from "../../../core/common/selectoption/selectoption";
import Table from "../../../core/common/dataTable/index";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { allStudents, Imageurl, markAttendance } from "../../../service/api";
import { toast } from "react-toastify";

const ExamAttendance = () => {
  const routes = all_routes;

  interface AttendanceData {
    id: number;
    rollNo: string;
    name: string;
    class: string;
    section: string;
    attendance: string;
    notes: string;
  }

  const [students, setStudents] = useState<any[]>([]);
  const [allStudentsList, setAllStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch students
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const { data } = await allStudents();
        if (data.success) {
          setStudents(data.students);
          setAllStudentsList(data.students);
        }
      } catch (error: any) {
        console.log(error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  const tabledata = students.map((item) => ({
    key: item.student_id,
    id: item.student_id,
    user_id: item.stu_id,
    admissionNo: item.admissionnum,
    rollNo: item.rollnum,
    name: `${item.firstname} ${item.lastname}`,
    img: item.stu_img,
    class: item.class,
    section: item.section,
    attendance: "Absent", // default
    notes: "",
  }));

  // Manage attendance state
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    if (students.length > 0) {
      setAttendanceData(
        students.map((student) => ({
          id: student.student_id,
          rollNo: student.rollnum,
          name: `${student.firstname} ${student.lastname}`,
          class: student.class,
          section: student.section,
          attendance: "Absent",
          notes: "",
        }))
      );
    }
  }, [students]);

  // Update attendance
  const handleAttendanceChange = (id: number, value: string) => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, attendance: value } : student
      )
    );
  };

  // Update notes
  const handleNotesChange = (id: number, value: string) => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, notes: value } : student
      )
    );
  };

  // Submit attendance
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await markAttendance(attendanceData);
      if (data.success) {
        setAttendanceData((prev) =>
          prev.map((student) => ({ ...student, attendance: "Absent", notes: "" }))
        );
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error submitting exam attendance");
    }
  };

  // Columns
  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (text: string) => <Link to="#" className="link-primary">{text}</Link>,
      sorter: (a: any, b: any) => a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: any, b: any) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.studentLeaves}/${record.user_id}`} className="avatar avatar-md">
            <img src={`${Imageurl}/${record.img}`} className="img-fluid rounded-circle" alt="img" />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">{text}</p>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: any, b: any) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: any, b: any) => a.section.length - b.section.length,
    },
    {
      title: "Exam Attendance",
      dataIndex: "attendance",
      render: (_: any, record: any) => {
        const student = attendanceData.find((s) => s.id === record.key);
        return (
          <div className="d-flex align-items-center check-radio-group flex-nowrap">
            {["Present", "Late", "Absent"].map((status) => (
              <label className="custom-radio" key={status}>
                <input
                  type="radio"
                  name={`student${record.key}`}
                  checked={student?.attendance === status}
                  onChange={() => handleAttendanceChange(record.key, status)}
                />
                <span className="checkmark" />
                {status}
              </label>
            ))}
          </div>
        );
      },
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (_: any, record: any) => {
        const student = attendanceData.find((s) => s.id === record.key);
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Enter notes"
            value={student?.notes || ""}
            onChange={(e) => handleNotesChange(record.key, e.target.value)}
          />
        );
      },
    },
  ];

  // Filter
  interface FilterData {
    class: string;
    section: string;
  }

  const [filterData, setFilterData] = useState<FilterData>({
    class: "",
    section: "",
  });

  const handleFilterSelectChange = (name: keyof FilterData, value: string | number) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    setStudents(
      allStudentsList.filter(
        (student) =>
          student.class === filterData.class &&
          student.section === filterData.section
      )
    );
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Attendance
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
              <h4 className="mb-3">Exam Attendance List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
                {/* Filters */}
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
                  <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                    <form onSubmit={handleApplyClick}>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={studentclass}
                                onChange={(option) =>
                                  handleFilterSelectChange("class", option ? option.value : "")
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={classSection}
                                onChange={(option) =>
                                  handleFilterSelectChange("section", option ? option.value : "")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="btn btn-success mb-3 ms-2"
                  onClick={handleSubmit}
                >
                  Submit Exam Attendance
                </button>
              </div>
            </div>

            <div className="card-body p-0 py-3">
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
                <Table dataSource={tabledata} columns={columns} Selection={true} />
              )}
            </div>
          </div>
          {/* /Student List */}
        </div>
      </div>
    </div>
  );
};

export default ExamAttendance;
