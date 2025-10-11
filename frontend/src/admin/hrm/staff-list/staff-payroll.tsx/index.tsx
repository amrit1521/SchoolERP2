

import Table from "../../../../core/common/dataTable/index";
import { staffpayroll } from "../../../../core/data/json/staff-payroll";
import type { TableData } from "../../../../core/data/interface";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import React, { useEffect, useState } from "react";
import { speStaffDetails } from "../../../../service/staff";
import { Imageurl } from "../../../../service/api";
import Skeleton from "react-loading-skeleton";
import dayjs from 'dayjs'

const StaffPayRoll = () => {
  const routes = all_routes;
  const data = staffpayroll;

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
 

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (record: any) => (
        <>
          <Link to="#" className="link-primary">
            {record.id}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },

    {
      title: "Salary For",
      dataIndex: "salaryFor",
      sorter: (a: TableData, b: TableData) =>
        a.salaryFor.length - b.salaryFor.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) => a.date.length - b.date.length,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      sorter: (a: TableData, b: TableData) =>
        a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: "Net Salary",
      dataIndex: "netSalary",
      sorter: (a: TableData, b: TableData) =>
        a.netSalary.length - b.netSalary.length,
    },
    {
      title: "",
      dataIndex: "view",
      render: (text: string) => (
        <>
          <Link to="#" className="btn btn-light add-fee">
            {text}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.view.length - b.view.length,
    },
  ];
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
                          <Link to={routes.studentList}>HRM</Link>
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
                          className="nav-link"
                        >
                          <i className="ti ti-info-square-rounded me-2" />
                          Basic Details
                        </Link>
                      </li>
                      <li>
                        <Link to={`${routes.staffPayroll}/${staffData.staff_id}`} className="nav-link active">
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
                <div className="students-leaves-tab">
                  <div className="row">
                    <div className="col-md-6 col-xxl-3 d-flex">
                      <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                        <div className="ms-2">
                          <p className="mb-1">Total Net Salary</p>
                          <h5>5,55,410</h5>
                        </div>
                        <span className="avatar avatar-lg bg-secondary-transparent rounded me-2 flex-shrink-0 text-secondary">
                          <i className="ti ti-user-dollar fs-24" />
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-xxl-3 d-flex">
                      <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                        <div className="ms-2">
                          <p className="mb-1">Total Gross Salary</p>
                          <h5>5,58,380</h5>
                        </div>
                        <span className="avatar avatar-lg bg-warning-transparent rounded me-2 flex-shrink-0 text-warning">
                          <i className="ti ti-map-dollar fs-24" />
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-xxl-3 d-flex">
                      <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                        <div className="ms-2">
                          <p className="mb-1">Total Earning</p>
                          <h5>2,500</h5>
                        </div>
                        <span className="avatar avatar-lg bg-success-transparent rounded me-2 flex-shrink-0 text-success">
                          <i className="ti ti-arrow-big-up-lines fs-24" />
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-xxl-3 d-flex">
                      <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                        <div className="ms-2">
                          <p className="mb-1">Total Deduction</p>
                          <h5>2,500</h5>
                        </div>
                        <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                          <i className="ti ti-arrow-big-down-lines fs-24" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Payroll</h4>
                      <Link
                        to="#"
                        className="btn btn-primary d-inline-flex align-items-center mb-3"
                      >
                        <i className="ti ti-calendar-event me-2" />
                        Apply Payroll
                      </Link>
                    </div>
                    <div className="card-body p-0 py-3">
                      {/* Payroll List */}
                      <Table
                        columns={columns}
                        dataSource={data}
                        Selection={true}
                      />
                      {/* /Payroll List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default StaffPayRoll;
