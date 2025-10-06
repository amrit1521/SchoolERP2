
import TeacherModal from "../teacherModal";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import { useEffect, useState } from "react";
import { sepTeacher } from "../../../../service/api";

const TeachersRoutine = () => {
  const routes = all_routes;

  const { teacher_id } = useParams()
  // console.log(typeof userId)

  const [teacher, setTeacher] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTeacher = async (id: string) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await sepTeacher(id)
      if (data.success) {
        setTeacher(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (teacher_id) {
      fetchTeacher(teacher_id)
    }
  }, [teacher_id])
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {teacher_id && (<TeacherBreadcrumb teacher_id={teacher_id} />)}
            {/* /Page Header */}
            {/* Student Information */}
            <TeacherSidebar teacher={teacher} loading={loading} />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link to={`${routes.teacherDetails}/${teacher.teacher_id}`} className="nav-link ">
                        <i className="ti ti-school me-2" />
                        Teacher Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teachersRoutine}/${teacher.teacher_id}`} className="nav-link active">
                        <i className="ti ti-table-options me-2" />
                        Routine
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLeaves}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherSalary}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Salary
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherLibrary}/${teacher.teacher_id}`} className="nav-link">
                        <i className="ti ti-bookmark-edit me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Time Table</h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3">
                          <Link
                            to="#"
                            className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-calendar-due me-2" />
                            This Year
                          </Link>
                          <ul className="dropdown-menu p-3">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                This Year
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                This Month
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                This Week
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-nowrap overflow-auto">
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Monday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <span className="text-dark d-block py-2">
                              Class : III, A
                            </span>
                            <span className="text-dark d-block pb-2">
                              Subject : Spanish
                            </span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : I, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:107
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : V, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Tuesday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:107
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : V, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : I, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Wednesday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Computer
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:00 - 09:45 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : II, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Science
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 - 10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Maths
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Chemistry
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Physics
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              01:30 - 02:15 PM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:101
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Englishh
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Thursday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:00 - 09:45 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Physics
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 - 10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : II, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Science
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : I, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              01:30 - 02:15 PM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:101
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Chemistry
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Maths
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Friday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:107
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : V, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : I, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column me-4 flex-fill">
                          <div className="mb-3">
                            <h6>Saturday</h6>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:106
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              10:45 - 11:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:107
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : V, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : English
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              11:30 - 12:15 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : IV, B
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              02:15 - 03:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:108
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : I, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              03:15 - 04:00 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                          <div className="rounded p-3 mb-4 border">
                            <div className="pb-3 border-bottom">
                              <span className="text-danger badge bg-transparent-danger text-nowrap ">
                                Room No:104
                              </span>
                            </div>
                            <p className="text-dark d-block py-2 m-0">
                              Class : III, A
                            </p>
                            <p className="text-dark d-block pb-2 m-0">
                              Subject : Spanish
                            </p>
                            <p className="text-dark text-nowrap m-0">
                              <i className="ti ti-clock me-1" />
                              09:45 -10:30 AM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer border-0 pb-0">
                      <div className="row">
                        <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body bg-transparent-primary">
                              <span className="bg-primary badge badge-sm mb-2">
                                Morning Break
                              </span>
                              <p className="text-dark">
                                <i className="ti ti-clock me-1" />
                                10:30 to 10 :45 AM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-xxl-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body bg-transparent-warning">
                              <span className="bg-warning badge badge-sm mb-2">
                                Lunch
                              </span>
                              <p className="text-dark">
                                <i className="ti ti-clock me-1" />
                                10:30 to 10 :45 AM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-xxl-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body bg-transparent-info">
                              <span className="bg-info badge badge-sm mb-2">
                                Evening Break
                              </span>
                              <p className="text-dark">
                                <i className="ti ti-clock me-1" />
                                03:30 PM to 03:45 PM
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <TeacherModal />
    </>
  );
};

export default TeachersRoutine;
