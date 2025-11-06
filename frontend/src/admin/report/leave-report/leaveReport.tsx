import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import type { TableData } from "../../../core/data/interface";
import {
  classes,
  sections,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import PredefinedDateRanges from "../../../core/common/datePicker";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { studentLeaveReport } from "../../../service/reports";
import { Spinner } from "../../../spinner";
import { Imageurl } from "../../../service/api";

const LeaveReport = () => {
  const routes = all_routes;
  const [leaveReportData, setLeaveReportData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReportData = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    try {
      const { data } = await studentLeaveReport();

      if (data.success && data.data.length > 0) {
        const students = data.data;
        const leaveTypes = Object.keys(students[0].leaves);
        const transformed = students.map((student: any) => {
          const row: any = {
            admissionNo: student.admissionNo,
            rollNo: student.rollNo,
            studentName: student.studentName,
            stu_img: student.stu_img,
            stu_id: student.stu_id,
          };

          leaveTypes.forEach((leaveType) => {
            const leave = student.leaves[leaveType];
            row[`${leaveType}_used`] = leave.used;
            row[`${leaveType}_available`] = leave.available;
            row[`${leaveType}_total`] = leave.total;
          });

          return row;
        });


        const dynamicColumns = [
          {
            title: "",
            children: [
              {
                title: "Admission No",
                dataIndex: "admissionNo",
                key: "admissionNo",
                sorter: (a: TableData, b: TableData) =>
                  a.admissionNo.localeCompare(b.admissionNo),
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
                    <Link
                      to={`${routes.studentLeaves}/${record.rollNo}`}
                      className="avatar avatar-md"
                    >
                      <img
                        src={`${Imageurl}/${record.stu_img}`}
                        alt="avatar"
                        className="img-fluid rounded-circle"
                      />
                    </Link>
                    <div className="ms-2">
                      <p className="text-dark mb-0">
                        <Link to={`${routes.studentLeaves}/${record.rollNo}`}>
                          {text}
                        </Link>
                      </p>
                      <span className="fs-12">Roll No : {record.rollNo}</span>
                    </div>
                  </div>
                ),
                sorter: (a: TableData, b: TableData) =>
                  a.studentName.localeCompare(b.studentName),
              },
            ],
          },

          ...leaveTypes.map((leaveType) => ({
            title: `${leaveType} (${students[0].leaves[leaveType].total})`,
            children: [
              {
                title: "Used",
                dataIndex: `${leaveType}_used`,
                key: `${leaveType}_used`,
                sorter: (a: any, b: any) =>
                  Number(a[`${leaveType}_used`]) -
                  Number(b[`${leaveType}_used`]),
                render: (text: any) => (
                  <span
                    className={`${Number(text) > 0 ? "text-danger fw-bold" : "text-dark"
                      }`}
                  >
                    {text}
                  </span>
                ),
              },
              {
                title: "Available",
                dataIndex: `${leaveType}_available`,
                key: `${leaveType}_available`,
                sorter: (a: any, b: any) =>
                  Number(a[`${leaveType}_available`]) -
                  Number(b[`${leaveType}_available`]),
              },
            ],
          })),
        ];

        setLeaveReportData(transformed);
        setColumns(dynamicColumns);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
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
        <div className="filter-wrapper">
          {/* List Tab */}
          <div className="list-tab">
            <ul>
              <li>
                <Link to={routes.leaveReport} className="active">
                  Student Leave Report
                </Link>
              </li>

              <li>
                <Link to={routes.teacherLeaveReport} >Teacher Leave Report</Link>
              </li>
              <li>
                <Link to={routes.staffLeaveReport}>
                  Staff Leave Report
                </Link>
              </li>
            </ul>
          </div>
          {/* /List Tab */}
        </div>
        {/* Card */}
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
            </div>
          </div>

          {/* Table Section */}
          <div className="card-body p-0 py-3">
            {loading ? (
              <Spinner />
            ) : (
              <Table dataSource={leaveReportData} columns={columns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReport;
