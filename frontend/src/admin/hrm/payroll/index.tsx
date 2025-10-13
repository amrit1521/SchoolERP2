import { useEffect, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
import type { TableData } from "../../../core/data/interface";
// import { payroll } from "../../../core/data/json/pay-roll";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  month,
  staffName,
  year,
} from "../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { getAllapplySalaryDetail } from "../../../service/salaryPayment";
import { Spinner } from "../../../spinner";

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





const Payroll = () => {
  // const data = payroll;


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
      render: (_: any, record: TableData) =>
        record.status === "1" ? (
          <Link to="#" className="btn btn-light add-fee">
            View Payslip
          </Link>
        ) : (
          <Link to="#" className="btn btn-light add-fee">
            Pay
          </Link>
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
    </div>
  );
};

export default Payroll;
