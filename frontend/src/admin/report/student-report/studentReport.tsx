/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
// import { studentreport } from "../../../core/data/json/student_report";
import Table from "../../../core/common/dataTable/index";
import { Link } from "react-router-dom";
import type { TableData } from "../../../core/data/interface";
import TooltipOption from "../../../core/common/tooltipOption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  classSection,
  classSylabus,
  gender,
  status,
  studentName,
} from "../../../core/common/selectoption/selectoption";

import { studentReport } from "../../../service/reports";
import dayjs from 'dayjs'
import { Spinner } from "../../../spinner";
import { Imageurl } from "../../../service/api";

export interface StudentData {
  student_id: number;
  stu_id: number;
  dateOfJoin: string;
  admissiondate: string;
  admissionnum: string;
  rollnum: number;
  class: string;
  section: string;
  gender: string;
  dob: string;
  stu_img: string;
  firstname: string;
  lastname: string;
  status: "0" | "1";
  father_name: string;
  father_img: string;
}


const StudentReport = () => {
  // const data = studentreport;
  const routes = all_routes;


  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchStudents = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await studentReport()
      if (data.success) {
        setStudents(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])


  const tableData = students.map((student) => ({
    key: student.student_id, 
    stu_id:student.stu_id,
    admissionNo: student.admissionnum, 
    rollNo: String(student.rollnum), 
    name: `${student.firstname} ${student.lastname}`, 
    stuImg: student.stu_img, 
    class: student.class,
    section: student.section, 
    gender: student.gender, 
    parent: student.father_name, 
    parentImg: student.father_img, 
    dateOfJoin: dayjs(student.admissiondate).format("DD MMM YYYY"),
    dob: dayjs(student.dob).format("DD MMM YYYY"), 
    status: student.status, 
  }));




  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (text: string) => (
        <>
          <Link to="#" className="link-primary">
            {text}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.admissionNo.length - b.admissionNo.length,
    },

    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: TableData, b: TableData) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link to={`${routes.studentDetail}/${record.stu_id}`} className="avatar avatar-md">
              <img
                src={`${Imageurl}/${record.stuImg}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to={`${routes.studentDetail}/${record.stu_id}`}>{text}</Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a: TableData, b: TableData) => a.gender.length - b.gender.length,
    },
    {
      title: "Parent",
      dataIndex: "parent",
      render: (text: string, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link to="#" className="avatar avatar-md">
              <img
                src={`${Imageurl}/${record.parentImg}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to="#">{text}</Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.parent.length - b.parent.length,
    },
    {
      title: "Date Of Join",
      dataIndex: "dateOfJoin",
      sorter: (a: TableData, b: TableData) =>
        a.dateOfJoin.length - b.dateOfJoin.length,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      sorter: (a: TableData, b: TableData) => a.dob.length - b.dob.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Inactive
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
  ];

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
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
                <h3 className="page-title mb-1">Student Report</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Report</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Student Report
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
                <h4 className="mb-3">Student Report List</h4>
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
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classSylabus}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={classSection}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Name</label>
                                <CommonSelect
                                  className="select"
                                  options={studentName}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Gender</label>
                                <CommonSelect
                                  className="select"
                                  options={gender}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={status}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="form-label">
                                  Date of Join
                                </label>
                                <input type="date" className="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3">
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
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
                {
                  loading ? <Spinner /> : (<Table columns={columns} dataSource={tableData} Selection={true} />)
                }
                {/* /Student List */}
              </div>
            </div>
            {/* /Student List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default StudentReport;
