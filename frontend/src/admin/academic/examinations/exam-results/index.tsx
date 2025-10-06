import React, { useRef, useState } from 'react'
import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { examresult } from '../../../../core/data/json/exam-result';
import type { TableData } from '../../../../core/data/interface';
import Table from "../../../../core/common/dataTable/index";
import { Link } from 'react-router-dom';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import CommonSelect from '../../../../core/common/commonSelect';
import { allClass, allSubject, classSection, weeklytest } from '../../../../core/common/selectoption/selectoption';
import { all_routes } from '../../../router/all_routes';
import TooltipOption from '../../../../core/common/tooltipOption';

export interface AddResult {
  roll_num: number | null;
  exam_name_id: number | null;
  subject_id: number | null;
  max_mark: number | null;
  min_mark: number | null;
  mark_obtained: number | null;
}


const ExamResult = () => {
  const routes = all_routes;
  const data = examresult;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [formData, setformdata] = useState<AddResult>({
    roll_num: null,
    exam_name_id: null,
    subject_id: null,
    max_mark: null,
    min_mark: null,
    mark_obtained: null,
  })
  const [errors, setErrors] = useState<any>({})

  const handleSelectChange= (name:keyof AddResult , value:string|number)=>{
     setformdata((prev)=>({...prev , [name]:value}))
  }

  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (record: any) => (
        <>
          <Link to="#" className="link-primary">
            {record.admissionNo}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.admissionNo.length - b.admissionNo.length,
    },

    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={routes.studentDetail} className="avatar avatar-md">
            <ImageWithBasePath
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">

              <Link to={routes.studentDetail}>{text}</Link>
            </p>
            <span className="fs-12">{record.roll}</span>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.studentName.length - b.studentName.length,
    },
    {
      title: "English",
      dataIndex: "english",
      render: (text: string) => (
        <>
          {text === "30" ? (
            <span className="text-danger">{text}</span>
          ) : (
            <span className="attendance-range">{text}</span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.english.length - b.english.length,
    },
    {
      title: "Spanish",
      dataIndex: "spanish",
      render: (text: string) => (
        <>
          {text === "30" ? (
            <span className="text-danger">{text}</span>
          ) : (
            <span className="attendance-range">{text}</span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.spanish.length - b.spanish.length,
    },
    {
      title: "Physics",
      dataIndex: "physics",
      sorter: (a: TableData, b: TableData) => a.physics.length - b.physics.length,
    },
    {
      title: "Chemistry",
      dataIndex: "chemistry",
      render: (text: string) => (
        <>
          {text === "28" ? (
            <span className="text-danger">{text}</span>
          ) : (
            <span className="attendance-range">{text}</span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.chemistry.length - b.chemistry.length,
    },
    {
      title: "Maths",
      dataIndex: "maths",
      render: (text: string) => (
        <>
          {text === "32" ? (
            <span className="text-danger">{text}</span>
          ) : (
            <span className="attendance-range">{text}</span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.maths.length - b.maths.length,
    },
    {
      title: "Computer",
      dataIndex: "computer",
      sorter: (a: TableData, b: TableData) => a.computer.length - b.computer.length,
    },
    {
      title: "Env Science",
      dataIndex: "envScience",
      sorter: (a: TableData, b: TableData) => a.envScience.length - b.envScience.length,
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a: TableData, b: TableData) => a.total.length - b.total.length,
    },
    {
      title: "Percent",
      dataIndex: "percent",
      sorter: (a: TableData, b: TableData) => a.percent.length - b.percent.length,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      sorter: (a: TableData, b: TableData) => a.grade.length - b.grade.length,
    },
    {
      title: "Result",
      dataIndex: "result",
      render: (text: string) => (
        <>
          {text === "Pass" ? (
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
      sorter: (a: TableData, b: TableData) => a.result.length - b.result.length,
    }

  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    console.log("hello" , formData)
  }

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
                    <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={allClass}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
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
                                <label className="form-label">Exam Type</label>
                                <CommonSelect
                                  className="select"
                                  options={weeklytest}
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
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 active"
                        >
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Added
                        </Link>
                      </li>

                    </ul>

                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Guardians List */}
                <Table columns={columns} dataSource={data} Selection={true} />

                {/* /Guardians List */}
              </div>
            </div>
            {/* /Guardians List */}
          </div>
        </div>
        {/* /Page Wrapper */}

        {/* Add Home Work */}
        <div className="modal fade" id="add_result">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Home Work</h4>
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
                  <div className="row">
                    <div className="col-md-12">
                      {/* Student */}
                      <div className="mb-3">
                        <label className="form-label">Student</label>
                        <CommonSelect
                          className={`select ${errors.roll_num ? "is-invalid" : ""}`}
                          options={allClass} 
                          value={formData.roll_num || ""}
                          onChange={(opt:any) =>
                            handleSelectChange("roll_num", opt?.value || null)
                          }
                        />
                        {errors.roll_num && (
                          <div className="invalid-feedback">{errors.roll_num}</div>
                        )}
                      </div>

                      {/* Exam */}
                      <div className="mb-3">
                        <label className="form-label">Exam</label>
                        <CommonSelect
                          className={`select ${errors.exam_name_id ? "is-invalid" : ""}`}
                          options={weeklytest} 
                          value={formData.exam_name_id || ""}
                          onChange={(opt:any) =>
                            handleSelectChange("exam_name_id", opt?.value )
                          }
                        />
                        {errors.exam_name_id && (
                          <div className="invalid-feedback">{errors.exam_name_id}</div>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <CommonSelect
                          className={`select ${errors.subject_id ? "is-invalid" : ""}`}
                          options={allSubject} 
                          value={formData.subject_id || ""}
                          onChange={(opt:any) =>
                            handleSelectChange("subject_id", opt?.value)
                          }
                        />
                        {errors.subject_id && (
                          <div className="invalid-feedback">{errors.subject_id}</div>
                        )}
                      </div>

                      {/* Max Marks */}
                      <div className="mb-3">
                        <label className="form-label">Max Marks</label>
                        <input
                          type="number"
                          className={`form-control ${errors.max_mark ? "is-invalid" : ""}`}
                          value={formData.max_mark || ""}
                          onChange={(e) =>
                            handleSelectChange("max_mark", Number(e.target.value))
                          }
                        />
                        {errors.max_mark && (
                          <div className="invalid-feedback">{errors.max_mark}</div>
                        )}
                      </div>

                      {/* Min Marks */}
                      <div className="mb-3">
                        <label className="form-label">Min Marks</label>
                        <input
                          type="number"
                          className={`form-control ${errors.min_mark ? "is-invalid" : ""}`}
                          value={formData.min_mark || ""}
                          onChange={(e) =>
                            handleSelectChange("min_mark", Number(e.target.value))
                          }
                        />
                        {errors.min_mark && (
                          <div className="invalid-feedback">{errors.min_mark}</div>
                        )}
                      </div>

                      {/* Marks Obtained */}
                      <div className="mb-3">
                        <label className="form-label">Marks Obtained</label>
                        <input
                          type="number"
                          className={`form-control ${errors.mark_obtained ? "is-invalid" : ""}`}
                          value={formData.mark_obtained || ""}
                          onChange={(e) =>
                            handleSelectChange("mark_obtained", Number(e.target.value))
                          }
                        />
                        {errors.mark_obtained && (
                          <div className="invalid-feedback">{errors.mark_obtained}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Add Result
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
        {/* /Add Home Work */}
      </>



    </div>
  )
}

export default ExamResult