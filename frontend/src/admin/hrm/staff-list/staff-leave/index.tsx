
import Table from "../../../../core/common/dataTable/index";
// import { staffleave } from "../../../../core/data/json/staff-leave";
import type { TableData } from "../../../../core/data/interface";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import CommonSelect from "../../../../core/common/commonSelect";

import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { getStaffLeaveData, speStaffDetails } from "../../../../service/staff";
import { addLeave, getAllLeaveTypeData, Imageurl } from "../../../../service/api";
import Skeleton from "react-loading-skeleton";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { Spinner } from "../../../../spinner";
export interface LeaveInform {
  id: number;
  name: string;
  total_allowed: number;
  used: number;
  avilable: number;
}

const StaffLeave = () => {
  // const data = staffleave;
  const routes = all_routes;

  const { staffid } = useParams();

  const [staffData, setStaffData] = useState<any>({});
  const [leaveInform, setLeaveInform] = useState<LeaveInform[]>([]);
  const [leaveDataa, setLeaveDataa] = useState<any[]>([]);

  // ✅ Separate loading states
  const [loading1, setLoading1] = useState<boolean>(false); // for staff
  const [loading2, setLoading2] = useState<boolean>(false); // for leave
  const [applyModal ,setApplyModal] = useState<boolean>(false)

  // ✅ Fetch Staff Details
  const fetchStaff = async (staffid: number) => {
    setLoading1(true);
    await new Promise((res) => setTimeout(res, 300)); // slight delay for smooth skeleton
    try {
      const res = await speStaffDetails(staffid);

      if (res?.data?.success) {
        setStaffData(res.data.data);
      } else {
        console.warn("⚠️ Failed to fetch staff details");
        setStaffData({});
      }
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
      setStaffData({});
    } finally {
      setLoading1(false);
    }
  };

  // ✅ Fetch Leave Data
  const fetchLeave = async (staffid: number) => {
    setLoading2(true);
    await new Promise((res) => setTimeout(res, 300)); // optional for skeleton smoothness
    try {
      const res = await getStaffLeaveData(staffid);

      if (res?.data?.success) {
        setLeaveInform(res.data.leave_inform || []);
        setLeaveDataa(res.data.staffAllLeave || []);
      } else {
        console.warn("⚠️ Failed to fetch leave data");
        setLeaveInform([]);
        setLeaveDataa([]);
      }
    } catch (error) {
      console.error("❌ Error fetching leave data:", error);
      setLeaveInform([]);
      setLeaveDataa([]);
    } finally {
      setLoading2(false);
    }
  };

  // ✅ Fetch both when staffid changes
  useEffect(() => {
    if (staffid) {
      fetchStaff(Number(staffid));
      fetchLeave(Number(staffid));
    }
  }, [staffid]);

  const tableData = leaveDataa.map((item: any) => ({
    key: item.id,
    leaveType: item.leave_type,
    leaveDate: `${dayjs(item.from_date).format("DD MMM YYYY")} to  ${dayjs(
      item.to_date
    ).format("DD MMM YYYY")}`,
    noOfDays: String(item.no_of_days),
    appliedOn: dayjs(item.applied_on).format("DD MMM YYYY"),
    status: item.status == "1" ? "Approved" : "Pending",
  }));


  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: TableData, b: TableData) =>
        a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: TableData, b: TableData) =>
        a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noOfDays",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.noOfDays) - parseFloat(b.noOfDays),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: TableData, b: TableData) =>
        a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Approved" ? (
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
  ];


  // applay leave ====================================================================================
  interface ApplyLeave {
    idOrRollNum: number | string | null;
    leave_type_id: number | null;
    from_date: string;
    to_date: string;
    leave_day_type: string;
    no_of_days: number | null;
    reason: string;
    leave_date: string;
  }

  const [applayLeaveForm, setApplayLeaveForm] = useState<ApplyLeave>({
    idOrRollNum: null,
    leave_type_id: null,
    from_date: "",
    to_date: "",
    leave_day_type: "",
    no_of_days: null,
    reason: "",
    leave_date: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // fetch leave type options

  const [leaveOptions, setLeaveOptions] = useState<{ value: number; label: string }[]>([]);

  const fetchLeaveTypes = async () => {

    try {
      const { data } = await getAllLeaveTypeData();
      if (data.success) {
        const options = data.data.map((item: any) => ({ value: item.id, label: item.name }));
        setLeaveOptions(options);
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  };


  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof ApplyLeave, value: string | number) => {
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: keyof ApplyLeave, value: string) => {
    setApplayLeaveForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateLeaveForm = (form: ApplyLeave) => {
    const errors: Record<string, string> = {};

    if (!form.leave_date) {
      errors.leave_date = "Leave date is required";
    }

    if (!form.leave_type_id) {
      errors.leave_type_id = "Leave type is required";
    }

    if (!form.from_date) {
      errors.from_date = "From date is required";
    }

    if (!form.to_date) {
      errors.to_date = "To date is required";
    }


    if (form.from_date && form.to_date) {
      const from = dayjs(form.from_date, "DD MMM YYYY");
      const to = dayjs(form.to_date, "DD MMM YYYY");
      if (from.isAfter(to)) {
        errors.to_date = "To date must be after From date";
      }
    }

    if (!form.leave_day_type) {
      errors.leave_day_type = "Leave day type is required";
    }

    if (!form.no_of_days || form.no_of_days <= 0) {
      errors.no_of_days = "Number of days must be greater than 0";
    }

    if (!form.reason) {
      errors.reason = "Reason is required";
    }
    setFormErrors(errors)
    return errors;
  };


  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedForm = {
      ...applayLeaveForm,
      idOrRollNum: Number(staffid)
    }
    const errors = validateLeaveForm(updatedForm);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    try {
      const { data } = await addLeave(updatedForm)
      if (data.success) {

        toast.success(data.message)
        fetchLeave(Number(staffid))
        setApplayLeaveForm({
          idOrRollNum: null,
          leave_type_id: null,
          from_date: "",
          to_date: "",
          leave_day_type: "",
          no_of_days: null,
          reason: "",
          leave_date: "",

        })
       setApplyModal(false)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleCancelLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setApplayLeaveForm({
      idOrRollNum: null,
      leave_type_id: null,
      from_date: "",
      to_date: "",
      leave_day_type: "",
      no_of_days: null,
      reason: "",
      leave_date: "",

    })
    setApplyModal(false)
  }




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
                  loading1 ? (<div className="stickybar pb-4">
                    {/* Staff Card */}
                    <div className="card border-white">
                      <div className="card-header">
                        <div className="d-flex align-items-center row-gap-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <Skeleton width={80} height={80} />
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
                        <Link to={`${routes.staffPayroll}/${staffData.staff_id}`} className="nav-link">
                          <i className="ti ti-file-dollar me-2" />
                          Payroll
                        </Link>
                      </li>
                      <li>
                        <Link to={`${routes.staffLeave}/${staffData.staff_id}`} className="nav-link active">
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
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="pills-leave"
                    role="tabpanel"
                    aria-labelledby="pills-leave"
                  >
                    <div className="row gx-3">

                      {
                        loading2 ? (
                          Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="col-lg-6 col-xxl-3 d-flex">
                              <div className="card flex-fill">
                                <div className="card-body">
                                  <h5 className="mb-2">
                                    <Skeleton height={18} width={150} />
                                  </h5>
                                  <div className="d-flex align-items-center flex-wrap">
                                    <span className="pe-2 me-2 mb-0 d-inline-block">
                                      <Skeleton height={16} width={80} />
                                    </span>
                                    <span className="mb-0 d-inline-block">
                                      <Skeleton height={16} width={100} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          leaveInform &&
                          leaveInform.map((item) => (
                            <div key={item.id} className="col-lg-6 col-xxl-3 d-flex">
                              <div className="card flex-fill">
                                <div className="card-body">
                                  <h5 className="mb-2 text-capitalize">
                                    {`${item.name} (${item.total_allowed})`}
                                  </h5>
                                  <div className="d-flex align-items-center flex-wrap">
                                    <p className="border-end pe-2 me-2 mb-0">
                                      Used : {item.used}
                                    </p>
                                    <p className="mb-0">Available : {item.avilable}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}


                    </div>

                    <div className="card">
                      {/* Leaves List */}
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 className="mb-3">Leaves</h4>
                        <button
                         onClick={()=>setApplyModal(true)}
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center mb-3"
                        >
                          <i className="ti ti-calendar-event me-2" />
                          Apply Leave
                        </button>
                      </div>
                      <div className="card-body p-0 py-3">
                        {
                          loading2 ? (<Spinner />) : (<Table
                            columns={columns}
                            dataSource={tableData}
                          // Selection={true}
                          />)
                        }
                      </div>
                      {/* /Leaves List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Apply Leave */}
        {
          applyModal&&( <div className="modal fade show d-block" id="apply_leave">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Apply Leave</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  onClick={handleCancelLeave}
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleLeaveSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {/* Leave Date */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Apply Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={applayLeaveForm.leave_date ? dayjs(applayLeaveForm.leave_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleDateChange("leave_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {formErrors.leave_date && <small className="text-danger">{formErrors.leave_date}</small>}
                    </div>

                    {/* Leave Type */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Leave Type</label>
                      <CommonSelect
                        className="select"
                        options={leaveOptions}
                        value={applayLeaveForm.leave_type_id}
                        onChange={(opt) => handleSelectChange("leave_type_id", opt ? opt.value : "")}
                      />
                      {formErrors.leave_type_id && <small className="text-danger">{formErrors.leave_type_id}</small>}
                    </div>

                    {/* From Date */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Leave From Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={applayLeaveForm.from_date ? dayjs(applayLeaveForm.from_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleDateChange("from_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {formErrors.from_date && <small className="text-danger">{formErrors.from_date}</small>}
                    </div>

                    {/* To Date */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Leave To Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={applayLeaveForm.to_date ? dayjs(applayLeaveForm.to_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleDateChange("to_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {formErrors.to_date && <small className="text-danger">{formErrors.to_date}</small>}
                    </div>

                    {/* Leave Days */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Leave Days</label>
                      <div className="d-flex align-items-center check-radio-group">
                        <label htmlFor="fullday" className="custom-radio me-3">
                          <input
                            id="fullday"
                            type="radio"
                            name="leave_day_type"
                            value="full"
                            checked={applayLeaveForm.leave_day_type === "full"}
                            onChange={handleChange}
                          />
                          <span className="checkmark" />
                          Full Day
                        </label>
                        <label htmlFor="firsthalf" className="custom-radio me-3">
                          <input
                            id="firsthalf"
                            type="radio"
                            name="leave_day_type"
                            value="first_half"
                            checked={applayLeaveForm.leave_day_type === "first_half"}
                            onChange={handleChange}
                          />
                          <span className="checkmark" />
                          First Half
                        </label>
                        <label htmlFor="secondhalf" className="custom-radio">
                          <input
                            id="secondhalf"
                            type="radio"
                            name="leave_day_type"
                            value="second_half"
                            checked={applayLeaveForm.leave_day_type === "second_half"}
                            onChange={handleChange}
                          />
                          <span className="checkmark" />
                          Second Half
                        </label>
                      </div>
                      {formErrors.leave_day_type && <small className="text-danger">{formErrors.leave_day_type}</small>}
                    </div>

                    {/* No of Days */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">No of Days</label>
                      <input
                        type="number"
                        className="form-control"
                        name="no_of_days"
                        value={applayLeaveForm.no_of_days || ""}
                        onChange={handleChange}
                      />
                      {formErrors.no_of_days && <small className="text-danger">{formErrors.no_of_days}</small>}
                    </div>

                    {/* Reason */}
                    <div className="col-md-12 mb-0">
                      <label className="form-label">Reason</label>
                      <input
                        type="text"
                        className="form-control"
                        name="reason"
                        value={applayLeaveForm.reason}
                        onChange={handleChange}
                      />
                      {formErrors.reason && <small className="text-danger">{formErrors.reason}</small>}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={handleCancelLeave}
                    type="button"
                    className="btn btn-light me-2"
                 
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Apply Leave
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>)
        }
        {/* /Apply Leave */}
        
      </>
    </div>
  );

};

export default StaffLeave;
