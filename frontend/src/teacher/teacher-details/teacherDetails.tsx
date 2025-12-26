import TeacherModal from "../teacherModal";
import { Link, useParams } from "react-router-dom";
// import { all_routes } from "../../router/all_routes";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import { useEffect, useState } from "react";
import { Documenturl } from "../../service/api";
import { getSpecTeacherProfileDetails } from "../../service/teacherDashboardApi";
import { teacher_routes } from "../../router/teacher_routes";

const TTeacherDetails = () => {
  // const routes = all_routes;

  const { teacher_id } = useParams();
  const [teacher, setTeacher] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token).id : null;
  const fetchTeacher = async (userId: number) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await getSpecTeacherProfileDetails(userId);
      if (data.success) {
        setTeacher(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTeacher(userId);
    }
  }, [userId]);
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {teacher_id && <TeacherBreadcrumb teacher_id={teacher_id} />}
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
                      <Link
                        to={`${teacher_routes.teacherDetails}`}
                        className="nav-link active"
                      >
                        <i className="ti ti-school me-2" />
                        Teacher Details
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${teacher_routes.teachersRoutine}`}
                        className="nav-link"
                      >
                        <i className="ti ti-table-options me-2" />
                        Routine
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${teacher_routes.teacherLeaves}`}
                        className="nav-link"
                      >
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${teacher_routes.teacherSalary}`}
                        className="nav-link"
                      >
                        <i className="ti ti-report-money me-2" />
                        Salary
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${teacher_routes.teacherLibrary}`}
                        className="nav-link"
                      >
                        <i className="ti ti-bookmark-edit me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  {/* Parents Information */}
                  <div className="card">
                    <div className="card-header">
                      <h5>Profile Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="border rounded p-3 pb-0">
                        <div className="row">
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">
                                Father’s Name
                              </p>
                              <p>{teacher.fat_name}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">
                                Mother Name
                              </p>
                              <p>{teacher.mot_name}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">DOB</p>
                              <p>{teacher.dob}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">
                                Martial Status
                              </p>
                              <p>{teacher.mari_status}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">
                                Qualification
                              </p>
                              <p>{teacher.qualification}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">
                                Experience
                              </p>
                              <p>{teacher.work_exp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Parents Information */}
                </div>
                {/* Documents */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Documents</h5>
                    </div>
                    <div className="card-body">
                      <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                        <div className="d-flex align-items-center overflow-hidden">
                          <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                            <i className="ti ti-pdf fs-15" />
                          </span>
                          <div className="ms-2">
                            <p className="text-truncate fw-medium text-dark">
                              Resume.pdf
                            </p>
                          </div>
                        </div>
                        <a
                          href={`${Documenturl}/${teacher.resume_src}`}
                          download={teacher.resume_src}
                          target="_blank"
                          className="btn btn-dark btn-icon btn-sm"
                        >
                          <i className="ti ti-download" />
                        </a>
                      </div>
                      <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
                        <div className="d-flex align-items-center overflow-hidden">
                          <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                            <i className="ti ti-pdf fs-15" />
                          </span>
                          <div className="ms-2">
                            <p className="text-truncate fw-medium text-dark">
                              Joining Letter.pdf
                            </p>
                          </div>
                        </div>
                        <a
                          href={`${Documenturl}/${teacher.letter_src}`}
                          download={teacher.letter_src}
                          target="_blank"
                          className="btn btn-dark btn-icon btn-sm"
                        >
                          <i className="ti ti-download" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Documents */}
                {/* Address */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Address</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <i className="ti ti-map-pin-up" />
                        </span>
                        <div>
                          <p className="text-dark fw-medium mb-1">
                            Current Address
                          </p>
                          <p>{teacher.address}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <i className="ti ti-map-pins" />
                        </span>
                        <div>
                          <p className="text-dark fw-medium mb-1">
                            Permanent Address
                          </p>
                          <p>{teacher.perm_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Address */}
                {/* Previous School Details */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Previous School Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Previous School Name
                            </p>
                            <p>{teacher.prev_school}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              School Address
                            </p>
                            <p>{teacher.prev_school_addr}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Phone Number
                            </p>
                            <p>{teacher.prev_school_num}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Previous School Details */}
                {/* Bank Details */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Bank Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Bank Name
                            </p>
                            <p>{teacher.account_name}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Branch</p>
                            <p>{teacher.branch_name}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">IFSC</p>
                            <p>{teacher.ifsc_code}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Bank Details */}
                {/* Medical History */}
                <div className="col-xxl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Work Details</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Contract Type
                            </p>
                            <p>{teacher.contract_type}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Shift</p>
                            <p>{teacher.work_sift}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Work Location
                            </p>
                            <p>{teacher.work_location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Medical History */}
                {/* Medical History */}
                <div className="col-xxl-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h5>Social Media</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row row-cols-xxl-5 row-cols-xl-3">
                        <div className="col">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Facebook</p>
                            <p>{teacher.facebook_link}</p>
                          </div>
                        </div>
                        <div className="col">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Twitter</p>
                            <p>{teacher.twitter_link}</p>
                          </div>
                        </div>
                        <div className="col">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">Linkedin</p>
                            <p>{teacher.linked_link}</p>
                          </div>
                        </div>

                        <div className="col">
                          <div className="mb-3">
                            <p className="mb-1 text-dark fw-medium">
                              Instagram
                            </p>
                            <p>{teacher.instagram_link}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Medical History */}
                {/* Other Info */}
                <div className="col-xxl-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Other Info</h5>
                    </div>
                    <div className="card-body">
                      <p>{teacher.other_info}</p>
                    </div>
                  </div>
                </div>
                {/* /Other Info */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {teacher_id && <TeacherModal onAdd={() => {}} teacherId={teacher_id} />}
    </>
  );
};

export default TTeacherDetails;
