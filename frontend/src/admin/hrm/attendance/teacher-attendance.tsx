/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  teacherId,
  studentclass,
} from "../../../core/common/selectoption/selectoption";
import Table from "../../../core/common/dataTable/index";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import {
  allTeacherForAttendance,
  Imageurl,
  markTeacherAttendance,
} from "../../../service/api";
import { toast } from "react-toastify";

const TeacherAttendance = () => {
  const routes = all_routes;

  interface AttendanceData {
    id: string;
    name: string;
    class: string;
    section: string;
    attendance: string;
    notes: string;
  }

  const [teachers, setTeachers] = useState<any[]>([]);
  const [allTeachersList, setAllTeachersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  // Generate attendance list
  const generateAttendanceData = (teachList: any[]): AttendanceData[] =>
    teachList.map((teacher) => ({
      id: teacher.teacher_id,
      name: `${teacher.firstname} ${teacher.lastname}`,
      class: teacher.class,
      section: teacher.section,
      attendance: "Absent",
      notes: "",
    }));

  // Fetch teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const { data } = await allTeacherForAttendance();
        if (data.success) {
          setTeachers(data.data);
          setAllTeachersList(data.data);
        }
      } catch (error: any) {
        console.log(error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Initialize attendance state
  useEffect(() => {
    setAttendanceData(generateAttendanceData(teachers));
  }, [teachers]);

  // Attendance change
  const handleAttendanceChange = (id: string, value: string) => {
    setAttendanceData((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, attendance: value } : teacher
      )
    );
  };

  // Notes change
  const handleNotesChange = (id: string, value: string) => {
    setAttendanceData((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, notes: value } : teacher
      )
    );
  };

  // Submit attendance
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(attendanceData);
    try {
      const { data } = await markTeacherAttendance(attendanceData);
      if (data.success) {
        setAttendanceData(generateAttendanceData(teachers));
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Error submitting attendance"
      );
    }
  };

  // Table data
  const tabledata = teachers.map((item) => ({
    key: item.teacher_id,
    id: item.teacher_id,
    user_id: item.user_id,
    name: `${item.firstname} ${item.lastname}`,
    img: item.img_src,
    class: item.class,
    section: item.section,
    attendance: "Absent",
    notes: "",
  }));

  // Table columns
  const columns = [
    {
      title: "Teacher ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.id.length - b.id.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
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
      title: "Attendance",
      dataIndex: "attendance",
      render: (_: any, record: any) => {
        const teacher = attendanceData.find((t) => t.id === record.key);
        return (
          <div className="d-flex align-items-center check-radio-group flex-nowrap">
            {["Present", "Late", "Absent", "Holiday", "Halfday"].map(
              (status) => (
                <label className="custom-radio" key={status}>
                  <input
                    type="radio"
                    name={`teacher${record.key}`}
                    checked={teacher?.attendance === status}
                    onChange={() => handleAttendanceChange(record.key, status)}
                  />
                  <span className="checkmark" />
                  {status}
                </label>
              )
            )}
          </div>
        );
      },
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (_: any, record: any) => {
        const teacher = attendanceData.find((t) => t.id === record.key);
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Enter notes"
            value={teacher?.notes || ""}
            onChange={(e) => handleNotesChange(record.key, e.target.value)}
          />
        );
      },
    },
  ];

  // Filter states
  interface FilterData {
    class: string;
    section: string;
  }

  const [filterData, setFilterData] = useState<FilterData>({
    class: "",
    section: "",
  });
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number
  ) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = allTeachersList.filter(
      (t) =>
        (!filterData.class || t.class === filterData.class) &&
        (!filterData.section || t.section === filterData.section)
    );
    setTeachers(filtered);
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: "", section: "" });
    setTeachers(allTeachersList);
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Teacher Attendance</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Report</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Teacher Attendance
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
          </div>
        </div>

        {/* Teacher List */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Teacher Attendance List</h4>
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
                            className="select"
                            options={studentclass}
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
                            options={teacherId}
                            onChange={(option) =>
                              handleFilterSelectChange(
                                "section",
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
              <button
                className="btn btn-success mb-3 ms-2"
                onClick={handleSubmit}
              >
                Submit Attendance
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
              <Table
                dataSource={tabledata}
                columns={columns}
                Selection={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
