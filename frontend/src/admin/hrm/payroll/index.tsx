import React, { useEffect, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
import type { TableData } from "../../../core/data/interface";
// import { payroll } from "../../../core/data/json/pay-roll";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  month,
  paymentType,
  staffName,
  year,
} from "../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { getAllapplySalaryDetail, paySalary, speSalaryDetails } from "../../../service/salaryPayment";
import { Spinner } from "../../../spinner";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";

export interface SalaryApplication {
  id: number;
  employee_id: number;
  name: string;
  department: string;
  designation: string;
  phone: number;
  status: "0" | "1";
  salary_month: string;
  amount: string;
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

const Payroll = () => {

  const [payrollData, setPayRollData] = useState<SalaryApplication[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchPayRoll = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {
      const { data } = await getAllapplySalaryDetail()
      if (data.success) {
        setPayRollData(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayRoll();
  }, [])

  const tableData = payrollData.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    department: item.department,
    designation: item.designation,
    phone: item.phone,
    amount: item.amount,
    status: item.status
  }))

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


  // pay salary

  const [paymentMethod, setPaymentMethod] = useState<string>("")

  const handleSubmitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!paymentMethod.trim()) {
      toast.error('First select payment method !')
      return;
    }

    try {
      if (!spePayroll.id) return
      const { data } = await paySalary({payment_method:paymentMethod}, spePayroll.id)
      if (data.success) {
        toast.success(data.message)
        setPaymentMethod("")
        setSpePayroll({
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
        fetchPayRoll()
        handleModalPopUp('pay_salary')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <Link to="#" className="link-primary">
          {id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: TableData, b: TableData) => a.department.length - b.department.length,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: TableData, b: TableData) => a.designation.length - b.designation.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: TableData, b: TableData) => a.phone.length - b.phone.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => Number(a.amount) - Number(b.amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "1" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Paid
          </span>
        ) : (
          <span className="badge badge-soft-warning d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Generated
          </span>
        ),
      sorter: (a: TableData, b: TableData) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "details",
      render: (_: any, record: any) =>
        record.status === "1" ? (
          <button
            onClick={(e) => payrollDetails(e, record.id)}
            data-bs-target="#view_payslip"
            data-bs-toggle="modal"
            className="btn btn-primary d-inline-flex align-items-center "
          >

            View Payslip
          </button>
        ) : (
          <button
            onClick={(e) => payrollDetails(e, record.id)}
            data-bs-target="#pay_salary"
            data-bs-toggle="modal"
            className="btn btn-primary d-inline-flex align-items-center "
          >

            Pay Now
          </button>
        ),
      sorter: false, // Cannot sort on action buttons
    },
  ];

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const routes = all_routes;


  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Payroll</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Payroll
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
              </div>
            </div>
            {/* Page Header*/}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Payroll List</h4>
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
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">All Staffs</label>
                                <CommonSelect
                                  className="select"
                                  options={staffName}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Month</label>
                                <CommonSelect
                                  className="select"
                                  options={month}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="form-label">Year</label>
                                <CommonSelect
                                  className="select"
                                  options={year}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3">
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
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
              <div className="card-body p-0 py-3">
                {/* Payroll List */}
                {loading ? (<Spinner />) : (<Table columns={columns} dataSource={tableData} Selection={true} />)}
                {/* /Payroll List */}
              </div>
            </div>
            {/* /Filter Section */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      {/* Pay Salary Modal */}
      <div className="modal fade" id="pay_salary">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0 rounded-4">

            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Pay Salary</h5>
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
              <form onSubmit={handleSubmitPayment}>
                <div className="modal-body pt-2">

                  {/* Employee Info Card */}
                  <div className="p-4 mb-4 rounded-3 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 text-secondary">Employee Information</h6>
                      <span
                        className={`badge badge-soft-warning`}
                      >
                        <i className="ti ti-circle-filled me-1" />
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
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Payment Method</label>
                      <CommonSelect
                        className="select"
                        options={paymentType}
                        value={paymentMethod}
                        onChange={(option) =>
                          setPaymentMethod(option ? String(option.value) : "")
                        }

                      />
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="modal-footer border-0 pt-0">
                  <button type="button" onClick={() => setPaymentMethod("")} className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* /Pay Salary Modal */}



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

    </div>
  );
};

export default Payroll;
