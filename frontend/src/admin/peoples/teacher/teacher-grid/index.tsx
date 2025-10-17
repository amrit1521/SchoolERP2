import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes'
import PredefinedDateRanges from '../../../../core/common/datePicker'
import { allClass, names } from '../../../../core/common/selectoption/selectoption'
import TeacherModal from '../teacherModal'
import CommonSelect from '../../../../core/common/commonSelect'
import TooltipOption from '../../../../core/common/tooltipOption'
import { allTeachers, deleteTeacher, Imageurl } from '../../../../service/api'
import { Skeleton } from 'antd'
import { toast } from 'react-toastify'
import { handleModalPopUp } from '../../../../handlePopUpmodal'

const TeacherGrid = () => {
  const routes = all_routes
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove('show');
    }
  };

  const [teachers, setTeachers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)

  const fetchTeachers = async () => {
    setToken(localStorage.getItem('token'))
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await allTeachers()
      // console.log(data)
      if (data.success) {
        setTeachers(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<string | null>(null)


  const handleDelete = async (teacher_id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(id)
    try {

      const { data } = await deleteTeacher(teacher_id)
      if (data.success) {
        toast.success(data.message)
        fetchTeachers();
        setDeleteId(null)
        handleModalPopUp('delete-modal')
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
              <h3 className="page-title mb-1">Teachers </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teachers{" "}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              {
                token && JSON.parse(token).role === 1 ? (
                  <div className="mb-2">
                    <Link
                      to={routes.addTeacher}
                      className="btn btn-primary d-flex align-items-center"
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Teacher
                    </Link>
                  </div>
                ) : null
              }
            </div>
          </div>
          {/* /Page Header */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Teachers Grid</h4>
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
                  <form >
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <CommonSelect
                              className="select"
                              options={names}
                              defaultValue={names[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <CommonSelect
                              className="select"
                              options={allClass}
                              defaultValue={allClass[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link to="#" className="btn btn-light me-3">
                        Reset
                      </Link>
                      <Link to={routes.teacherGrid} onClick={handleApplyClick} className="btn btn-primary">
                        Apply
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={routes.teacherList}
                  className=" btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.teacherGrid}
                  className=" active btn btn-icon btn-sm  primary-hover"
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
          <div className="row">


            {/* Teacher Grid */}
            {loading ? (
              // ✅ Skeletons jab loading true h
              [...Array(4)].map((_, i) => (
                <div className="col-xxl-3 col-xl-4 col-md-6 d-flex" key={i}>
                  <div className="card flex-fill">
                    {/* Header */}
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Skeleton.Input style={{ width: 80, height: 20 }} active size="small" />
                      <div className="d-flex align-items-center">
                        <Skeleton.Button style={{ width: 70, height: 20, marginRight: 8 }} active size="small" />
                        <Skeleton.Button style={{ width: 24, height: 24 }} active size="small" shape="circle" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <Skeleton.Avatar active size={64} shape="circle" />
                          <div className="ms-2 d-flex flex-column">
                            <Skeleton.Input style={{ width: "60%", marginBottom: 8 }} active size="small" />
                            <Skeleton.Input style={{ width: "10%" }} active size="small" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 d-flex flex-column">
                          <Skeleton.Input style={{ width: "30%", marginBottom: 6 }} active size="small" />
                          <Skeleton.Input style={{ width: "40%" }} active size="small" />
                        </div>
                        <div className='d-flex flex-column'>
                          <Skeleton.Input style={{ width: "30%", marginBottom: 6 }} active size="small" />
                          <Skeleton.Input style={{ width: "40%" }} active size="small" />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <Skeleton.Button style={{ width: 80, height: 24 }} active size="small" />
                      <Skeleton.Button style={{ width: 100, height: 28 }} active size="small" />
                    </div>
                  </div>
                </div>
              ))
            ) : teachers.length > 0 ? (
              // ✅ Teachers list jab data aa jaye
              teachers.map((teacher: any, i: number) => (
                <div className="col-xxl-3 col-xl-4 col-md-6 d-flex" key={i}>
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} className="link-primary">
                        {teacher.teacher_id}
                      </Link>
                      <div className="d-flex align-items-center">
                        <span className="badge badge-soft-success d-inline-flex align-items-center me-1">
                          <i className="ti ti-circle-filled fs-5 me-1" /> Active
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
                              <Link className="dropdown-item rounded-1" to={`${routes.editTeacher}/${teacher.teacher_id}`} >
                                <i className="ti ti-edit-circle me-2" /> Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item rounded-1"
                                onClick={() => { setDeleteId(teacher.teacher_id)}}
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                              >
                                <i className="ti ti-trash-x me-2" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} className="avatar avatar-lg flex-shrink-0">
                            <img
                              src={`${Imageurl}/${teacher.img_src}`}
                              className="img-fluid rounded-circle"
                              alt="img"
                            />
                          </Link>
                          <div className="ms-2">
                            <h6 className="text-dark text-truncate mb-0">
                              <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} >
                                {teacher.firstname} {teacher.lastname}
                              </Link>
                            </h6>
                            <p className='text-uppercase'>{teacher.class}-{teacher.section}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <p className="mb-0">Email</p>
                          <p className="text-dark">{teacher.email}</p>
                        </div>
                        <div>
                          <p className="mb-0">Phone</p>
                          <p className="text-dark">{teacher.mobile}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <span className="badge badge-soft-danger">{teacher.subject}</span>
                      <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} className="btn btn-light btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Not found</p>
            )}
            {/* Teacher Grid */}

            <div className="text-center">
              <Link
                to="#"
                className="btn btn-primary d-inline-flex align-items-center"
              >
                <i className="ti ti-loader-3 me-2" />
                Load More
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
      <div className="modal fade" id="delete-modal">
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
      {/* /Page Wrapper */}
      <TeacherModal />
    </>

  )
}

export default TeacherGrid