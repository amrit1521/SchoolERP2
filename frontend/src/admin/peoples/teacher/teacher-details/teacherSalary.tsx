
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import Table from "../../../../core/common/dataTable/index";
import type { TableData } from "../../../../core/data/interface";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import TeacherModal from "../teacherModal";
import { salarydata } from "../../../../core/data/json/salary";
import { useEffect, useState } from "react";
import { sepTeacher } from "../../../../service/api";
import { applySalary } from "../../../../service/salaryPayment";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../../handlePopUpmodal";
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from "antd";

const TeacherSalary = () => {
  const routes = all_routes;
  const data = salarydata;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Salary For",
      dataIndex: "Salary_For",
      sorter: (a: any, b: any) => a.Salary_For.length - b.Salary_For.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.date) - parseFloat(b.date),
    },
    {
      title: "Payment Method",
      dataIndex: "Payment_Method",
      sorter: (a: any, b: any) =>
        a.Payment_Method.length - b.Payment_Method.length,
    },
    {
      title: "Net Salary",
      dataIndex: "Net_Salary",
      sorter: (a: any, b: any) => a.Net_Salary.length - b.Net_Salary.length,
    },
    {
      title: " ",
      dataIndex: "Net_Salary",
      render: () => (
        <>
          <Link to="#" className="btn btn-light add-fee">
            View Payslip
          </Link>
        </>
      ),
    },
  ];

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



  // applay salary
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

  const caancelApply = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    setFormData({ salary_month: "", apply_date: null, notes: "", type: "teacher" });
  }
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
                    <div className="row">
                      <div className="col-md-6 col-xxl-3 d-flex">
                        <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                          <div className="ms-2">
                            <p className="mb-1">Total Net Salary</p>
                            <h5>$5,55,410</h5>
                          </div>
                          <span className="avatar avatar-lg bg-secondary-transparent rounded flex-shrink-0 text-secondary">
                            <i className="ti ti-user-dollar fs-24" />
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 col-xxl-3 d-flex">
                        <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                          <div className="ms-2">
                            <p className="mb-1">Total Gross Salary</p>
                            <h5>$5,58,380</h5>
                          </div>
                          <span className="avatar avatar-lg bg-success-transparent rounded flex-shrink-0 text-success">
                            <i className="ti ti-moneybag fs-24" />
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 col-xxl-3 d-flex">
                        <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                          <div className="ms-2">
                            <p className="mb-1">Total Deduction</p>
                            <h5>$2,500</h5>
                          </div>
                          <span className="avatar avatar-lg bg-warning-transparent rounded flex-shrink-0 text-warning">
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
                          data-bs-target="#apply_salary"
                          data-bs-toggle="modal"
                          className="btn btn-primary d-inline-flex align-items-center mb-3"
                        >
                          <i className="ti ti-calendar-event me-2" />
                          Apply Leave
                        </Link>
                      </div>
                      <div className="card-body p-0 py-3">
                        {/* Payroll List */}
                        <Table
                          dataSource={data}
                          columns={columns}
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
        </div>
      </div>

      {/* apply salary */}
      <div className="modal fade" id="apply_salary" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply Salary</h4>
              <button type="button" onClick={(e) => caancelApply(e)} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                      value={formData.salary_month ? dayjs(formData.salary_month, "MM YYYY") : null}
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
                <button type="button" onClick={(e) => caancelApply(e)} className="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Apply Salary</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* apply salary */}
      {/* /Page Wrapper */}
      {teacher_id && (<TeacherModal onAdd={() => { }} teacherId={teacher_id} />)}
    </>
  );
};

export default TeacherSalary;
