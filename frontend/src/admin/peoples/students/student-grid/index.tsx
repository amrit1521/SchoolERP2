import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../../router/all_routes'
// import ImageWithBasePath from '../../../../core/common/imageWithBasePath'
import { allClass, allSection, gender, names, status } from '../../../../core/common/selectoption/selectoption'
// import StudentModals from '../studentModals'
import CommonSelect from '../../../../core/common/commonSelect'
import TooltipOption from '../../../../core/common/tooltipOption'
import PredefinedDateRanges from '../../../../core/common/datePicker'
import { allStudents, deleteStudent, Imageurl } from '../../../../service/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import StudentModals from '../studentModals'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { handleModalPopUp } from '../../../../handlePopUpmodal'

const StudentGrid = () => {
  const routes = all_routes
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
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
      // console.log(data)
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
    setToken(localStorage.getItem('token'))

    fetchStudent()
  }, [])

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



  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Students Grid
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
          {/* Filter */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Students Grid</h4>
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
                      <Link to={routes.studentGrid} className="btn btn-primary" onClick={handleApplyClick}>
                        Apply
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={routes.studentList}
                  className="btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.studentGrid}
                  className="active btn btn-icon btn-sm primary-hover"
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
                  Sort by A-Z{" "}
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
          {/* /Filter */}
          <div className="row">

            {/* mine grid */}
            {/* Student Grid */}
            {loading ? (
              // Skeleton loader
              <div className="row">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="col-xxl-3 col-xl-4 col-md-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <Skeleton width={80} height={20} />
                        <Skeleton circle width={30} height={30} />
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <Skeleton circle width={50} height={50} />
                          <div className="ms-2">
                            <Skeleton width={100} height={20} />
                            <Skeleton width={80} height={15} />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Skeleton width={60} height={20} />
                          <Skeleton width={60} height={20} />
                          <Skeleton width={80} height={20} />
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between">
                        <Skeleton width={100} height={30} />
                        <Skeleton width={80} height={30} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Students data
              students && students.length > 0 ? (
                <>
                  {students.map((student) => (
                    <div key={student.student_id} className="col-xxl-3 col-xl-4 col-md-6 d-flex">
                      <div className="card flex-fill">
                        <div className="card-header d-flex align-items-center justify-content-between">
                          <Link to={routes.studentDetail} className="link-primary">
                            {student.admissionnum}
                          </Link>
                          <div className="d-flex align-items-center">
                            <span className={`badge ${student.status == 1 ? 'badge-soft-success' : 'badge-soft-danger'}  d-inline-flex align-items-center me-1`}>
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              {student.status == 1 ? 'Active' : 'Inactive'}
                            </span>
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
                                    to={`${routes.studentDetail}/${student.rollnum}`}
                                  >
                                    <i className="ti ti-menu me-2" />
                                    View Student
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item rounded-1"
                                    to={`${routes.editStudent}/${student.rollnum}`}
                                  >
                                    <i className="ti ti-edit-circle me-2" />
                                    Edit
                                  </Link>
                                </li>
                                {/* <li>
                                  <Link
                                    className="dropdown-item rounded-1"
                                    to={routes.studentPromotion}
                                  >
                                    <i className="ti ti-arrow-ramp-right-2 me-2" />
                                    Promote Student
                                  </Link>
                                </li> */}
                                <li>
                                  <button
                                    className="dropdown-item rounded-1"
                                    onClick={() => setDeleteId(student.rollnum)}
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
                        </div>
                        <div className="card-body">
                          <div className="bg-light-300 rounded-2 p-3 mb-3">
                            <div className="d-flex align-items-center">
                              <Link
                                to={`${routes.studentDetail}/${student.rollnum}`}
                                className="avatar avatar-lg flex-shrink-0"
                              >
                                <img
                                  src={`${Imageurl}/${student.stu_img}`}
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="mb-0">
                                  <Link className='text-capitalize' to={`${routes.studentDetail}/${student.rollnum}`}>{`${student.firstname} ${student.lastname}`}</Link>
                                </h6>
                                <p>{`${student.class}, ${student.section}`}</p>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between gx-2">
                            <div>
                              <p className="mb-0">Roll No</p>
                              <p className="text-dark">{student.rollnum}</p>
                            </div>
                            <div>
                              <p className="mb-0">Gender</p>
                              <p className="text-dark">{student.gender}</p>
                            </div>
                            <div>
                              <p className="mb-0">Joined On</p>
                              {student.admissiondate && (<p className="text-dark">{dayjs(student.admissiondate).format('DD MMM YYYY')}</p>)}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
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
                          </div>
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_fees_collect"
                            className="btn btn-light btn-sm fw-semibold"
                          >
                            Add Fees
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div>Students Not Found !</div>
              )
            )}

            {/* /Student Grid */}
            {/* <div className="col-md-12 text-center">
              <Link to="#" className="btn btn-primary">
                <i className="ti ti-loader-3 me-2" />
                Load More
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      
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

  )
}

export default StudentGrid