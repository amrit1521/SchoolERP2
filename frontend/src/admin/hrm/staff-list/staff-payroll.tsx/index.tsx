

import Table from "../../../../core/common/dataTable/index";
// import { staffpayroll } from "../../../../core/data/json/staff-payroll";
import type { TableData } from "../../../../core/data/interface";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import React, { useEffect, useState } from "react";
import { speStaffDetails } from "../../../../service/staff";
import { Imageurl } from "../../../../service/api";
import Skeleton from "react-loading-skeleton";
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from "antd";
import { toast } from "react-toastify";
import { applySalary, salaryDeatilsTeacherStaff, speSalaryDetails } from "../../../../service/salaryPayment";
import { Spinner } from "../../../../spinner";

// satff salary details
export interface PaidSalaryRecord {
  id: number;
  salary_month: string;
  payment_method: string;
  paid_date: string;
  net_salary: number;
}

export interface SpeSalary {
  id: number | null;
  employee_id: number | null;
  name: string;
  salary_month: string;
  status: "0" | "1";
  payment_method: string;
  paid_date: string;
  apply_date: string;
  notes: string;
  net_salary: string;
  status_label: "Generated" | "Paid";
  role_name: string;
}


export interface Total {
  total_gross_salary: string;
  total_net_salary: string;
  total_deductions: string;
  total_earnings: string;
}


const StaffPayRoll = () => {
  const routes = all_routes;
  // const data = staffpayroll;

  const { staffid } = useParams()


  const [staffData, setStaffData] = useState<any>({});
  const [salaryData, setSalaryData] = useState<PaidSalaryRecord[]>([]);
  const [totals, setTotals] = useState<Total>({
    total_gross_salary: "",
    total_net_salary: "",
    total_deductions: "",
    total_earnings: "",
  })
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStaffAndSalary = async (staffid: number) => {
    setLoading(true);

    try {
      // Optional delay if needed
      await new Promise((res) => setTimeout(res, 400));


      const [staffRes, salaryRes] = await Promise.all([
        speStaffDetails(staffid),
        salaryDeatilsTeacherStaff(staffid),
      ]);


      // Update staff data
      if (staffRes.data.success) {
        setStaffData(staffRes.data.data);

      }

      // Update salary data
      if (salaryRes.data.success) {
        setSalaryData(salaryRes.data.data);
        setTotals(salaryRes.data.totals)
      }

    } catch (error) {
      console.error("Error fetching staff or salary:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableData = salaryData.map((item) => (
    {
      id: item.id,
      salaryFor: dayjs(item.salary_month).format('MMM YYYY'),
      date: dayjs(item.paid_date).format('DD MMM YYYY'),
      paymentMethod: item.payment_method,
      netSalary: item.net_salary


    }
  ))
  useEffect(() => {
    if (staffid) {
      fetchStaffAndSalary(Number(staffid));
    }
  }, [staffid]);


  // apply salary 
  interface ApplySalaryForm {
    salary_month: string;
    apply_date: string | null;
    notes: string;
    type: string;
  }

  interface FormErrors {
    salary_month?: string;
    apply_date?: string;
    notes?: string;
  }


  const [formData, setFormData] = useState<ApplySalaryForm>({
    salary_month: "",
    apply_date: null,
    notes: "",
    type: "staff"
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [applyModal  ,setApplyModal] = useState<boolean>(false)


  const disabledPastDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    name: keyof ApplySalaryForm,
    dateString: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: dateString }));
  };

  const handleMonthChange = (name: keyof ApplySalaryForm,
    dateString: string) => {
    setFormData((prev) => ({ ...prev, [name]: dateString }));
  };


  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.salary_month) newErrors.salary_month = "Salary month is required.";
    if (!formData.apply_date) newErrors.apply_date = "Apply date is required.";
    if (formData.notes.length > 200) newErrors.notes = "Notes cannot exceed 200 characters.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {

      const { data } = await applySalary(formData, Number(staffid))
      if (data.success) {
        toast.success(data.message)
        setFormData({ salary_month: "", apply_date: null, notes: "", type: "staff" });
        setApplyModal(false)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }


  };

  const cancelApply = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    setFormData({ salary_month: "", apply_date: null, notes: "", type: "staff" });
    setApplyModal(false)
  }


  // view payslip 
  // pay salary functions
  const [spePayroll, setSpePayroll] = useState<SpeSalary>({
    id: null,
    employee_id: null,
    name: "",
    salary_month: "",
    status: "0",
    payment_method: "",
    paid_date: "",
    apply_date: "",
    notes: "",
    status_label: "Generated",
    role_name: "",
    net_salary: "",
  })
  const [loading2, setLoading2] = useState<boolean>(false)
  const [viewModal , setViewModal] = useState<boolean>(false)

  const payrollDetails = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault()
    setLoading2(true)
    try {

      const { data } = await speSalaryDetails(id)
      if (data.success) {
        setViewModal(true)
        setSpePayroll(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading2(false)
    }
  }


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <>
          <Link to="#" className="link-primary">
            SAL{id}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
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
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
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
      render: (_: any, record: any) => (
        <>
          <button
            onClick={(e) => payrollDetails(e, record.id)}
            type="button"
            className="btn btn-primary d-inline-flex align-items-center "
          >

            View Payslip
          </button>
        </>
      ),
      sorter: false,
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


                  {loading ? (
                    // 🔹 Skeleton Loader
                    <div className="row">
                      {[1, 2, 3, 4].map((i) => (
                        <div className="col-md-6 col-xxl-3 d-flex" key={i}>
                          <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                            <div className="ms-2 w-100">
                              <div
                                className="skeleton-line mb-2"
                                style={{ width: "60%", height: "16px" }}
                              ></div>
                              <div
                                className="skeleton-line"
                                style={{ width: "40%", height: "22px" }}
                              ></div>
                            </div>
                            <div
                              className="skeleton-circle me-2"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // 🔹 Actual Data
                    <div className="row">
                      <div className="col-md-6 col-xxl-3 d-flex">
                        <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill">
                          <div className="ms-2">
                            <p className="mb-1">Total Net Salary</p>
                            <h5>{totals.total_net_salary}</h5>
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
                            <h5>{totals.total_gross_salary}</h5>
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
                            <h5>{totals.total_earnings}</h5>
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
                            <h5>{totals.total_deductions}</h5>
                          </div>
                          <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                            <i className="ti ti-arrow-big-down-lines fs-24" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Payroll</h4>
                      <button
                       type="button"
                       
                       onClick={()=>setApplyModal(true)}
                        className="btn btn-primary d-inline-flex align-items-center mb-3"
                      >
                        <i className="ti ti-calendar-event me-2" />
                        Apply Salary
                      </button>
                    </div>
                    <div className="card-body p-0 py-3">
                      {/* Payroll List */}
                      {
                        loading ? <Spinner /> : (<Table
                          columns={columns}
                          dataSource={tableData}
                          // Selection={true}
                        />)
                      }
                      {/* /Payroll List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}

        {/* apply salary */}
        {
          applyModal&&( <div className="modal fade show d-block" id="apply_salary" >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Apply Salary</h4>
                <button type="button" onClick={(e) => cancelApply(e)} className="btn-close" ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Salary Month</label>
                      <DatePicker
                        picker="month"
                        className="form-control datetimepicker"
                        format="MMM YYYY"
                        placeholder="Select Month"
                        value={formData.salary_month ? dayjs(formData.salary_month, "DD MMM YYYY") : null}
                        onChange={(date) => handleMonthChange("salary_month", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {errors.salary_month && <small className="text-danger">{errors.salary_month}</small>}
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Apply Date</label>
                      <DatePicker
                        disabledDate={disabledPastDate}
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={formData.apply_date ? dayjs(formData.apply_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleDateChange("apply_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {errors.apply_date && (<div className="text-danger" style={{ fontSize: "11px" }}>{errors.apply_date}</div>)}

                    </div>

                    {/* Notes */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Notes</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                      >

                      </textarea>
                      {errors.notes && <small className="text-danger">{errors.notes}</small>}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button"  onClick={(e) => cancelApply(e)} className="btn btn-light me-2">Cancel</button>
                  <button type="submit" className="btn btn-primary">Apply Salary</button>
                </div>
              </form>
            </div>
          </div>
        </div>)
        }
        {/* apply salary */}

        {/* Payslip Modal */}
         {
          viewModal&&(<div className="modal fade show d-block" id="view_payslip">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">

              {/* Header */}
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Payslip</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={()=>setViewModal(false)}
                />
              </div>

              {loading2 ? (
                <Spinner />
              ) : (
                <form>
                  <div className="modal-body pt-2">

                    {/* Employee Info Card */}
                    <div className="p-4 mb-4 rounded-3 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 text-secondary">Employee Information</h6>
                        <span className={`badge ${spePayroll.status === '1' ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                          <i className="ti ti-circle-filled me-2" />
                          {spePayroll.status_label}
                        </span>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Applied By</small>
                          <p className="mb-0 fw-semibold">{spePayroll.name}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">ID</small>
                          <p className="mb-0 fw-semibold">{spePayroll.employee_id}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Role</small>
                          <p className="mb-0 text-capitalize fw-semibold">{spePayroll.role_name}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">For Month</small>
                          <p className="mb-0 fw-semibold">{dayjs(spePayroll.salary_month).format('MMMM')}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Applied On</small>
                          <p className="mb-0 fw-semibold">{dayjs(spePayroll.apply_date).format('DD MMM YYYY')}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Paid On</small>
                          <p className="mb-0 fw-semibold">{dayjs(spePayroll.paid_date).format('DD MMM YYYY')}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Paid Amount</small>
                          <p className="mb-0 fw-semibold">{spePayroll.net_salary}</p>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-muted">Payment Method</small>
                          <p className="mb-0 fw-semibold">{spePayroll.payment_method}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </form>
              )}
            </div>
          </div>
        </div>)
         }
        {/* /Payslip Modal */}


      </>
    </div>
  );
};

export default StaffPayRoll;
