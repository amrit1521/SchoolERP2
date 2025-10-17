
import { Link } from "react-router-dom";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Table from "../../../core/common/dataTable/index";
// import { leave_report_data } from "../../../core/data/json/leave_report_data";
import type { TableData } from "../../../core/data/interface";
import {
  classes,
  sections,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import PredefinedDateRanges from "../../../core/common/datePicker";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../router/all_routes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentLeaveReport } from "../../../service/reports";
import { Spinner } from "../../../spinner";
import { Imageurl } from "../../../service/api";


const LeaveReport = () => {
  // const data = leave_report_data;
  const routes = all_routes;

  const [leaveReportData, setLeaveReportData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchReportData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {
      const { data } = await studentLeaveReport();
      console.log(data)
      if (data.success) {
        const transformed = data.data.map((student: any) => ({
          admissionNo: student.admissionNo,
          rollNo: student.rollNo,
          studentName: student.studentName || "king",
          stu_img: student.stu_img,
          stu_id:student.stu_id,
          medicalUsed: student.leaves["medical leave"]?.used || "0",
          medicalAvailable: student.leaves["medical leave"]?.available || "0",
          casualUsed: student.leaves["Casual Leave"]?.used || "0",
          casualAvailable: student.leaves["Casual Leave"]?.available || "0",
         
        }));
        setLeaveReportData(transformed)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchReportData()
  }, [])


  const columns = [
    {
      title: "",
      children: [
        {
          title: "Admission No",
          dataIndex: "admissionNo",
          key: "admissionNo",
          sorter: (a: TableData, b: TableData) =>
            a.admissionNo.length - b.admissionNo.length,
          render: (text: any) => (
            <Link to="#" className="link-primary">
              {text}
            </Link>
          ),
        },
      ],
    },
    {
      title: "",
      children: [
        {
          title: "Student Name",
          dataIndex: "studentName",
          key: "studentName",
          render: (text: any, record: any) => (
            <div className="d-flex align-items-center">
              <Link to={`${routes.studentDetail}/${record.rollNo}`} className="avatar avatar-md">
                <img src={`${Imageurl}/${record.stu_img}`} alt="avatar" className="img-fluid rounded-circle" />
              </Link>
              <div className="ms-2">
                <p className="text-dark mb-0">
                  <Link to={`${routes.studentDetail}/${record.rollNo}`}>{text}</Link>
                </p>
                <span className="fs-12">Roll No : {record.rollNo}</span>
              </div>
            </div>
          ),
          sorter: (a: TableData, b: TableData) =>
            a.studentName.length - b.studentName.length,
        },
      ],
    },
    {
      title: "Medical Leave",
      children: [
        {
          title: "Used",
          dataIndex: "medicalUsed",
          key: "medicalUsed",
          sorter: (a: TableData, b: TableData) =>
            a.medicalUsed.length - b.medicalUsed.length,
        },
        {
          title: "Available",
          dataIndex: "medicalAvailable",
          key: "medicalAvailable",
          sorter: (a: TableData, b: TableData) =>
            a.medicalAvailable.length - b.medicalAvailable.length,
        },
      ],
    },
    {
      title: "Casual Leave",
      children: [
        {
          title: "Used",
          dataIndex: "casualUsed",
          key: "casualUsed",
          sorter: (a: TableData, b: TableData) =>
            a.casualUsed.length - b.casualUsed.length,
        },
        {
          title: "Available",
          dataIndex: "casualAvailable",
          key: "casualAvailable",
          sorter: (a: TableData, b: TableData) =>
            a.casualAvailable.length - b.casualAvailable.length,
        },
      ],
    },

    // {
    //   title: "Maternity Leave(10)",
    //   children: [
    //     {
    //       title: "Used",
    //       dataIndex: "maternityUsed",
    //       key: "maternityUsed",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.maternityUsed.length - b.maternityUsed.length,
    //     },
    //     {
    //       title: "Available",
    //       dataIndex: "maternityAvailable",
    //       key: "maternityAvailable",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.maternityAvailable.length - b.maternityAvailable.length,
    //     },
    //   ],
    // },
    // {
    //   title: "Paternity Leave(10)",
    //   children: [
    //     {
    //       title: "Used",
    //       dataIndex: "paternityUsed",
    //       key: "paternityUsed",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.paternityUsed.length - b.paternityUsed.length,
    //     },
    //     {
    //       title: "Available",
    //       dataIndex: "paternityAvailable",
    //       key: "paternityAvailable",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.paternityAvailable.length - b.paternityAvailable.length,
    //     },
    //   ],
    // },
    // {
    //   title: "Special Leave(10)",
    //   children: [
    //     {
    //       title: "Used",
    //       dataIndex: "specialUsed",
    //       key: "specialUsed",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.specialUsed.length - b.specialUsed.length,
    //     },
    //     {
    //       title: "Available",
    //       dataIndex: "specialAvailable",
    //       key: "specialAvailable",
    //       sorter: (a: TableData, b: TableData) =>
    //         a.specialAvailable.length - b.specialAvailable.length,
    //     },
    //   ],
    // },

  ];

  return (
    <div>
      {" "}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Leave Report</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leave Report
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Student List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Leave Report List</h4>
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
                  <div className="dropdown-menu drop-width">
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={classes}
                                defaultValue={classes[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={sections}
                                defaultValue={sections[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
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
                      <Link to="#" className="dropdown-item rounded-1 active">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              {
                loading ? <Spinner /> : (<Table dataSource={leaveReportData} columns={columns} />)
              }
              {/* /Student List */}
            </div>
          </div>
          {/* /Student List */}
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  );
};

export default LeaveReport;
