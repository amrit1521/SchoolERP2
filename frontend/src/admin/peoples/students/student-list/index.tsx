import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
// import { Studentlist } from "../../../../core/data/json/studentList";
import type { TableData } from "../../../../core/data/interface";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import StudentModals from "../studentModals";
import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import {
  // AdmissionNo,
  allClass,
  allSection,
  gender,
  names,
  status,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import TooltipOption from "../../../../core/common/tooltipOption";
import { allStudents, deleteStudent, disableStudent, enableStudent, Imageurl } from "../../../../service/api";
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import { handleModalPopUp } from "../../../../handlePopUpmodal";
// import { findNonSerializableValue } from "@reduxjs/toolkit";

const StudentList = () => {
  const routes = all_routes;
  // const data = Studentlist;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const fetchStudent = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await allStudents();

      if (data.success) {
        setStudents(data.students)
      }


    } catch (error: any) {
      console.log(error.response)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"))
    fetchStudent()
  }, [])

  // console.log(students)

  const tableData = students.map((item) => ({
    key: item.student_id,
    AdmissionNo: item.admissionnum,
    RollNo: item.rollnum,
    name: `${item.firstname} ${item.lastname}`,
    imgSrc: item.stu_img,
    class: item.class,
    section: item.section,
    gender: item.gender,
    status: item.status === "1" ? "Active" : "Inactive",
    DateofJoin: item.admissiondate,
    DOB: item.dob,
    action: item.stu_id
  }));

  const disableStu = async (id: number) => {

    try {
      const data = await disableStudent(id)
      if (data.data.success) {
        toast.success(data.data.message)
        fetchStudent()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const enableStu = async (id: number) => {

    try {
      const data = await enableStudent(id)
      if (data.data.success) {
        toast.success(data.data.message)
        fetchStudent()
      }
    } catch (error) {
      console.log(error)
    }
  }


  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)


  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(id)
    try {

      const { data } = await deleteStudent(id)
      if (data.success) {
        toast.success(data.message)
        fetchStudent();
        setDeleteId(null)
        handleModalPopUp('delete_modal')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }


  const columns = [
    {
      title: "Admission No",
      dataIndex: "AdmissionNo",
      render: (text: string, record: any) => (
        <Link to={`${routes.studentDetail}/${record.action}`} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.AdmissionNo.length - b.AdmissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "RollNo",
      sorter: (a: TableData, b: TableData) => a.RollNo.length - b.RollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.studentDetail}/${record.action}`} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.imgSrc}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.studentDetail}/${record.action}`} className='text-capitalize'>{text}</Link>
            </p>
          </div>
        </div>
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
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Active" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
    {
      title: "Date of Join",
      dataIndex: "DateofJoin",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.DateofJoin.length - b.DateofJoin.length,
    },
    {
      title: "DOB",
      dataIndex: "DOB",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.DOB.length - b.DOB.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: number, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
            >
              <i className="ti ti-brand-hipchat" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
            >
              <i className="ti ti-phone" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
            >
              <i className="ti ti-mail" />
            </Link>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_fees_collect"
              className="btn btn-light fs-12 fw-semibold me-3"
            >
              Collect Fees
            </Link>
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={`${routes.studentDetail}/${text}`}
                  >
                    <i className="ti ti-menu me-2" />
                    View Student
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to={`${routes.editStudent}/${text}`}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login_detail"
                  >
                    <i className="ti ti-lock me-2" />
                    Login Details
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item rounded-1"
                    onClick={() => { `${record.status}` === 'Active' ? disableStu(text) : enableStu(text) }}
                  >
                    <i className="ti ti-toggle-right me-2" />
                    {`${record.status}` === 'Active' ? "Disable" : "Enable"}
                  </button>
                </li>
                {/* <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="student-promotion"
                  >
                    <i className="ti ti-arrow-ramp-right-2 me-2" />
                    Promote Student
                  </Link>
                </li> */}
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDeleteId(text)}
                    data-bs-toggle="modal"
                    data-bs-target="#delete_modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];




  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Students
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              {
                token && (JSON.parse(token).role === 1 || JSON.parse(token).role === 2) ? (
                  <div className="mb-2">
                    <Link
                      to={routes.addStudent}
                      className="btn btn-primary d-flex align-items-center"
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Student
                    </Link>
                  </div>
                ) : null
              }
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Students List</h4>
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
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                              // defaultValue={allClass[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={allSection}
                              // defaultValue={allSection[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={names}
                              // defaultValue={names[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Gender</label>
                              <CommonSelect
                                className="select"
                                options={gender}
                              // defaultValue={gender[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                              // defaultValue={status[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link
                          to={routes.studentGrid}
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                  <Link
                    to={routes.studentList}
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.studentGrid}
                    className="btn btn-icon btn-sm bg-light primary-hover"
                  >
                    <i className="ti ti-grid-dots" />
                  </Link>
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
                loading ?
                  (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )
                  :
                  (<><Table dataSource={tableData} columns={columns} Selection={true} /></>)
              }
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Delete Modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form >
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this item, this cann't be undone
                  once you delete.
                </p>
                {
                  deleteId && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => cancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e) => handleDelete(deleteId, e)} className="btn btn-danger"
                    >
                      Yes, Delete
                    </button>
                  </div>)
                }
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
      <StudentModals onAdd={() => { }} rollnum={0} />
    </>
  );
};

export default StudentList;
