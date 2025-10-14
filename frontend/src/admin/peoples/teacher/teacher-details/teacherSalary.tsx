
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import Table from "../../../../core/common/dataTable/index";
import type { TableData } from "../../../../core/data/interface";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import TeacherModal from "../teacherModal";
// import { salarydata } from "../../../../core/data/json/salary";
import { useEffect, useState } from "react";
import { sepTeacher } from "../../../../service/api";
import { applySalary, salaryDeatilsTeacherStaff, speSalaryDetails } from "../../../../service/salaryPayment";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from "antd";
import { Spinner } from "../../../../spinner";


export interface ApplySalaryForm {
  salary_month: string;
  apply_date: string | null;
  notes: string;
  type: string;
}

export interface FormErrors {
  salary_month?: string;
  apply_date?: string;
  notes?: string;
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
const TeacherSalary = () => {
  const routes = all_routes;
  // const data = salarydata;

  const { teacher_id } = useParams()
  // console.log(typeof userId)
  const [teacher, setTeacher] = useState<any>({});
  const [salaryRecord, setSalaryRecord] = useState<any[]>([]);
  const [totals, setTotals] = useState<Total>({
    total_gross_salary: "",
    total_net_salary: "",
    total_deductions: "",
    total_earnings: "",
  })
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTeacherAndSalary = async (id: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400))
    try {
      await new Promise((res) => setTimeout(res, 500));
      const [teacherRes, salaryRes] = await Promise.all([
        sepTeacher(id),
        salaryDeatilsTeacherStaff(Number(id)),
      ]);

      if (teacherRes.data.success) {
        setTeacher(teacherRes.data.data);
      }

      if (salaryRes.data.success) {
        setSalaryRecord(salaryRes.data.data);
        setTotals(salaryRes.data.totals)
      }

    } catch (error) {
      console.error("Error fetching teacher or salary:", error);
    } finally {
      setLoading(false);
    }
  };
  const tableData = salaryRecord.map((item) => (
    {
      id: item.id,
      salaryFor: dayjs(item.salary_month).format('MMM YYYY'),
      date: dayjs(item.paid_date).format('DD MMM YYYY'),
      paymentMethod: item.payment_method,
      netSalary: item.net_salary


    }
  ))


  useEffect(() => {
    if (teacher_id) {
      fetchTeacherAndSalary(teacher_id);
    }
  }, [teacher_id]);




  // applay salary

  const [formData, setFormData] = useState<ApplySalaryForm>({
    salary_month: "",
    apply_date: null,
    notes: "",
    type: "teacher"
  });

  const [errors, setErrors] = useState<FormErrors>({});


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

      const { data } = await applySalary(formData, Number(teacher_id))
      if (data.success) {
        toast.success(data.message)
        setFormData({ salary_month: "", apply_date: null, notes: "", type: "teacher" });
        handleModalPopUp('apply_salary')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }


  };

  const cancelApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({ salary_month: "", apply_date: null, notes: "", type: "teacher" });
  }


  // view payslip


  // view payslip 
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

  const payrollDetails = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault()
    setLoading2(true)
    try {

      const { data } = await speSalaryDetails(id)
      if (data.success) {
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
            {id}
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
            data-bs-target="#view_payslip"
            data-bs-toggle="modal"
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
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {teacher_id && (<TeacherBreadcrumb teacher_id={teacher_id} />)}
            {/* /Page Header */}
          </div>
          <div className="row">
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
                      <Link to={`${routes.teachersRoutine}/${teacher.teacher_id}`} className="nav-link">
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
                      <Link to={`${routes.teacherSalary}/${teacher.teacher_id}`} className="nav-link active">
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
                        <Link
                          to="#"
                          data-bs-target="#apply_salary"
                          data-bs-toggle="modal"
                          className="btn btn-primary d-inline-flex align-items-center mb-3"
                        >
                          <i className="ti ti-calendar-event me-2" />
                          Apply Salary
                        </Link>
                      </div>
                      <div className="card-body p-0 py-3">
                        {/* Payroll List */}
                        {
                          loading ? <Spinner /> : (<Table
                            dataSource={tableData}
                            columns={columns}
                            Selection={true}
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
        </div>
      </div>

      {/* apply salary */}
      <div className="modal fade" id="apply_salary" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply Salary</h4>
              <button type="button" onClick={(e) => cancelApply(e)} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                <button type="button" onClick={(e) => cancelApply(e)} className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Apply Salary</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* apply salary */}

      {/* Payslip Modal */}
      <div className="modal fade" id="view_payslip">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0 rounded-4">

            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Payslip</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
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
      </div>
      {/* /Payslip Modal */}




      {/* /Page Wrapper */}
      {teacher_id && (<TeacherModal onAdd={() => { }} teacherId={teacher_id} />)}
    </>
  );
};

export default TeacherSalary;
