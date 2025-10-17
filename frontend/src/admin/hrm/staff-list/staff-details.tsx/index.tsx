
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import React, { useEffect, useState } from "react";
import { speStaffDetails } from "../../../../service/staff";
import Skeleton from "react-loading-skeleton";
import { Documenturl, Imageurl } from "../../../../service/api";
import dayjs from 'dayjs'

const StaffDetails = () => {
  const routes = all_routes

  const { staffid } = useParams()

  const [staffData, setStaffData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)

  const fetchStaff = async (staffid: number) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await speStaffDetails(staffid)
      // console.log(data)
      if (data.success) {
        setStaffData(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    if (staffid) {
      fetchStaff(Number(staffid))
    }

  }, [staffid])


  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              {/* Page Header */}
              <div className="col-md-12">
                <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                  <div className="my-auto mb-2">
                    <h3 className="page-title mb-1">Staff Details</h3>
                    <nav>
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <Link to={routes.adminDashboard}>Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                          <Link to={routes.staff}>HRM</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Staff Details
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div className="d-flex my-xl-auto right-content align-items-center  flex-wrap">
                    <Link
                      to={`${routes.editStaff}/${staffData.staff_id}`}
                      className="btn btn-primary d-flex align-items-center mb-2"
                    >
                      <i className="ti ti-edit-circle me-2" />
                      Edit Staff
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="col-xxl-3 col-lg-4 theiaStickySidebar">

                {
                  loading ? (<div className="stickybar pb-4">
                    {/* Staff Card */}
                    <div className="card border-white">
                      <div className="card-header">
                        <div className="d-flex align-items-center row-gap-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <Skeleton  width={80} height={80} />
                          </div>
                          <div>
                            <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
                              <Skeleton width={50} />
                            </span>
                            <h5 className="mb-1"><Skeleton width={120} /></h5>
                            <p className="text-primary m-0"><Skeleton width={80} /></p>
                            <p className="p-0"><Skeleton width={140} /></p>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <h5 className="mb-3"><Skeleton width={150} /></h5>
                        <dl className="row mb-0">
                          {Array.from({ length: 7 }).map((_, idx) => (
                            <React.Fragment key={idx}>
                              <dt className="col-6 fw-medium text-dark mb-3"><Skeleton width={100} /></dt>
                              <dd className="col-6 mb-3"><Skeleton width={120} /></dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    </div>

                    {/* Contact Card */}
                    <div className="card border-white mb-0 mt-3">
                      <div className="card-body">
                        <h5 className="mb-3"><Skeleton width={150} /></h5>

                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <Skeleton circle width={40} height={40} />
                          </span>
                          <div>
                            <span className="mb-1 fw-medium text-dark"><Skeleton width={100} /></span>
                            <p><Skeleton width={120} /></p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <Skeleton circle width={40} height={40} />
                          </span>
                          <div>
                            <span className="mb-1 fw-medium text-dark"><Skeleton width={120} /></span>
                            <p><Skeleton width={150} /></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>) : (
                    <div className="stickybar pb-4">
                      <div className="card border-white">
                        <div className="card-header">
                          <div className="d-flex align-items-center  row-gap-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <img
                                src={`${Imageurl}/${staffData.img_src}`}
                                className="img-fluid"
                                alt="img"
                              />
                            </div>
                            <div>
                              <span className={`badge ${staffData.status == 1 ? 'badge-soft-success ' : 'badge-soft-danger'} d-inline-flex align-items-center mb-1`}>
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                {staffData.status == 1 ? 'Active' : 'Inactive'}
                              </span>
                              <h5 className="mb-1">{`${staffData.firstname} ${staffData.lastname}`}</h5>
                              <p className="text-primary m-0">{staffData.staff_id}</p>
                              <p className="p-0">Joined On : {dayjs(staffData.date_of_join).format('DD MMM YYYY')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <h5 className="mb-3">Basic Information</h5>
                          <dl className="row mb-0">
                            <dt className="col-6 fw-medium text-dark mb-3">
                              Staff ID
                            </dt>
                            <dd className="col-6  mb-3">{staffData.staff_id}</dd>
                            <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
                            <dd className="col-6  mb-3">{staffData.gender}</dd>
                            <dt className="col-6 fw-medium text-dark mb-3">
                              Designation
                            </dt>
                            <dd className="col-6  mb-3 text-capitalize">{staffData.designation_name}</dd>
                            <dt className="col-6 fw-medium text-dark mb-3">
                              Department
                            </dt>
                            <dd className="col-6  mb-3 text-capitalize">{staffData.department_name}</dd>
                            <dt className="col-6 fw-medium text-dark mb-3">
                              Date Of Birth
                            </dt>
                            <dd className="col-6  mb-3">{dayjs(staffData.dob).format('DD MMM YYYY')}</dd>
                            <dt className="col-6 fw-medium text-dark mb-3">
                              Blood Group
                            </dt>
                            <dd className="col-6  mb-3">{staffData.blood_gp}</dd>


                            <dt className="col-6 fw-medium text-dark mb-0">
                              Language
                            </dt>
                            <dd className="col-6 text-dark mb-0">
                              {staffData.lan_known ? staffData.lan_known && (
                                <span className="badge badge-light text-dark me-2">
                                  {JSON.parse(staffData.lan_known).join(',')}
                                </span>
                              ) : <div>__</div>}
                            </dd>
                          </dl>
                        </div>
                      </div>


                      <div className="card border-white mb-0">
                        <div className="card-body">
                          <h5 className="mb-3">Primary Contact Info</h5>
                          <div className="d-flex align-items-center mb-3">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-phone" />
                            </span>
                            <div>
                              <span className="mb-1 fw-medium text-dark ">
                                Phone Number
                              </span>
                              <p>{staffData.mobile}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-mail" />
                            </span>
                            <div>
                              <span className="mb-1 fw-medium text-dark ">
                                Email Address
                              </span>
                              <p>{staffData.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)
                }
              </div>
              <div className="col-xxl-9 col-lg-8">
                <div className="row">


                  <div className="col-md-12">
                    <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                      <li>
                        <Link
                          to={`${routes.staffDetails}/${staffData.staff_id}`}
                          className="nav-link active"
                        >
                          <i className="ti ti-info-square-rounded me-2" />
                          Basic Details
                        </Link>
                      </li>
                      <li>
                        <Link to={`${routes.staffPayroll}/${staffData.staff_id}`} className="nav-link">
                          <i className="ti ti-file-dollar me-2" />
                          Payroll
                        </Link>
                      </li>
                      <li>
                        <Link to={`${routes.staffLeave}/${staffData.staff_id}`} className="nav-link">
                          <i className="ti ti-calendar-due me-2" />
                          Leaves
                        </Link>
                      </li>
                      <li>
                        <Link to={`${routes.staffsAttendance}/${staffData.staff_id}`} className="nav-link">
                          <i className="ti ti-calendar-due me-2" />
                          Attendance
                        </Link>
                      </li>
                    </ul>
                  </div>


                </div>
                <div className="row">
                  {/* Address */}
                  <div className="col-xxl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>Address</h5>
                      </div>

                      {
                        loading ? (<div className="card-body">
                          {[1, 2].map((_, index) => (
                            <div className="d-flex align-items-center mb-3" key={index}>
                              {/* Avatar / Icon Placeholder */}
                              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default d-flex align-items-center justify-content-center">
                                <Skeleton circle width={40} height={40} />
                              </span>

                              {/* Text placeholders */}
                              <div style={{ flex: 1 }}>
                                <p className="mb-1 fw-medium text-dark">
                                  <Skeleton width={120} height={14} />
                                </p>
                                <p>
                                  <Skeleton width={200} height={14} />
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>) : (<div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-map-pin-up" />
                            </span>
                            <div>
                              <p className="mb-1 fw-medium text-dark ">
                                Current Address
                              </p>
                              <p>{staffData.address}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                              <i className="ti ti-map-pins" />
                            </span>
                            <div>
                              <p className="mb-1 fw-medium text-dark ">
                                Permanent Address
                              </p>
                              <p>{staffData.perm_address}</p>
                            </div>
                          </div>
                        </div>)
                      }



                    </div>
                  </div>
                  {/* /Address */}
                  {/* Documents */}
                  <div className="col-xxl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>Documents</h5>
                      </div>
                      {
                        loading ? (<div className="card-body">
                          {[1, 2].map((_, index) => (
                            <div
                              key={index}
                              className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2"
                            >
                              {/* Left Section (Icon + File Name) */}
                              <div className="d-flex align-items-center overflow-hidden">
                                {/* File icon skeleton */}
                                <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default d-flex align-items-center justify-content-center">
                                  <Skeleton circle width={40} height={40} />
                                </span>

                                {/* File name skeleton */}
                                <div className="ms-2">
                                  <p className="text-truncate fw-medium text-dark mb-0">
                                    <Skeleton width={120} height={14} />
                                  </p>
                                </div>
                              </div>

                              {/* Download button skeleton */}
                              <Skeleton width={30} height={30} borderRadius={6} />
                            </div>
                          ))}
                        </div>) : (<div className="card-body">
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
                              href={`${Documenturl}/${staffData.resume_src}`}
                              download={staffData.resume_src}
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
                              href={`${Documenturl}/${staffData.letter_src}`}
                              download={staffData.letter_src}
                              target="_blank"
                              className="btn btn-dark btn-icon btn-sm"
                            >
                              <i className="ti ti-download" />
                            </a>
                          </div>
                        </div>)
                      }


                    </div>
                  </div>
                  {/* /Documents */}
                  {/* Bank Details */}
                  <div className="col-xxl-12 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header">
                        <h5>Bank Details</h5>
                      </div>

                      {
                        loading ? (<div className="card-body pb-1">
                          <div className="row">
                            {[...Array(5)].map((_, index) => (
                              <div className="col-md-4" key={index}>
                                <div className="mb-3">
                                  {/* Label Skeleton */}
                                  <p className="mb-1 fw-medium text-dark">
                                    <Skeleton width={120} height={14} />
                                  </p>
                                  {/* Value Skeleton */}
                                  <p>
                                    <Skeleton width={150} height={14} />
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>) : (<div className="card-body pb-1">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="mb-1 fw-medium text-dark ">
                                  Account Name
                                </p>
                                <p>{staffData.account_name}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="mb-1 fw-medium text-dark ">
                                  Account Number
                                </p>
                                <p>{staffData.account_num}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="mb-1 fw-medium text-dark ">
                                  Bank Name
                                </p>
                                <p>{staffData.bank_name}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="mb-1 fw-medium text-dark ">
                                  Branch
                                </p>
                                <p>{staffData.branch_name}</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <p className="mb-1 fw-medium text-dark ">IFSC</p>
                                <p>{staffData.ifsc_code}</p>
                              </div>
                            </div>
                          </div>
                        </div>)
                      }


                    </div>
                  </div>
                  {/* /Bank Details */}
                  {/* Other Info */}
                  <div className="col-xxl-12">
                    <div className="card">
                      <div className="card-header">
                        <h5>Other Info</h5>
                      </div>
                      <div className="card-body">
                        {loading ? <Skeleton width={800}  /> : <p>
                          {staffData.note}
                        </p>}


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
        {/* Login Details */}
        <div className="modal fade" id="login_detail">
          <div className="modal-dialog modal-dialog-centered  modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Login Details</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="student-detail-info">
                  <span className="student-img">
                    <img
                      src={`${Imageurl}/${staffData.img_src}`}
                      alt="img"
                    />
                  </span>

                </div>
                <div className="table-responsive custom-table no-datatable_length">
                  <table className="table datanew">
                    <thead className="thead-light">
                      <tr>
                        <th>User Type</th>
                        <th>User Name</th>
                        <th>Password </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Staff</td>
                        <td>{staffData.firstname} {staffData.lastname}</td>
                        <td>teacher@53</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Login Details */}
      </>
    </div>
  );
};

export default StaffDetails;
