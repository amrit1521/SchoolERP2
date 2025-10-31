import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable";
// import type { TableData } from "../../../core/data/interface";
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
import { Spinner } from "../../../spinner";
import { Imageurl } from "../../../service/api";
import { teacherLeaveReport } from "../../../service/api";

const TeacherLeaveReport = () => {
  const routes = all_routes;
  const [leaveReportData, setLeaveReportData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================================
  // ✅ Fetch Teacher Leave Report
  // ============================================================
  const fetchReportData = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    try {
      const { data } = await teacherLeaveReport();

      if (data.success && data.data.length > 0) {
        const teachers = data.data;

        // 1️⃣ Get all unique leave types dynamically
        const leaveTypes = Object.keys(teachers[0].leaves);

        // 2️⃣ Transform data
        const transformed = teachers.map((t: any) => {
          const row: any = {
            teacherId: t.teacherId,
            teacherName: t.teacherName || "Teacher",
            teacher_img: t.img,
            userId: t.userId,
          };

          leaveTypes.forEach((type) => {
            const leave = t.leaves[type];
            row[`${type}_used`] = leave?.used || 0;
            row[`${type}_available`] = leave?.available || 0;
            row[`${type}_total`] = leave?.total || 0;
          });

          return row;
        });

        // 3️⃣ Dynamic Columns
        const dynamicColumns = [
          {
            title: "",
            children: [
              {
                title: "Teacher ID",
                dataIndex: "teacherId",
                key: "teacherId",
                sorter: (a: any, b: any) => a.teacherId - b.teacherId,
                render: (text: any) => (
                  <Link to="#" className="link-primary">
                    TEA{text}
                  </Link>
                ),
              },
            ],
          },
          {
            title: "",
            children: [
              {
                title: "Teacher Name",
                dataIndex: "teacherName",
                key: "teacherName",
                render: (text: any, record: any) => (
                  <div className="d-flex align-items-center">
                    <Link
                      to={`${routes.teacherLeaves}/${record.teacherId}`}
                      className="avatar avatar-md"
                    >
                      <img
                        src={`${Imageurl}/${record.teacher_img}`}
                        alt="avatar"
                        className="img-fluid rounded-circle"
                      />
                    </Link>
                    <div className="ms-2">
                      <p className="text-dark mb-0">
                        <Link to={`${routes.teacherLeaves}/${record.teacherId}`}>
                          {text}
                        </Link>
                      </p>
                    </div>
                  </div>
                ),
                sorter: (a: any, b: any) =>
                  a.teacherName.localeCompare(b.teacherName),
              },
            ],
          },

          // 4️⃣ Create dynamic columns for each leave type
          ...leaveTypes.map((leaveType) => ({
            title: `${leaveType} (${teachers[0].leaves[leaveType].total})`,
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
                    className={`${
                      Number(text) > 0 ? "text-danger fw-bold" : "text-dark"
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
      } else {
        setLeaveReportData([]);
        setColumns([]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // ============================================================
  // ✅ Render Page
  // ============================================================
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

        {/* Filter Tabs */}
        <div className="filter-wrapper">
          <div className="list-tab">
            <ul>
              <li>
                <Link to={routes.leaveReport}>Student Leave Report</Link>
              </li>
              <li>
                <Link
                  to={routes.teacherLeaveReport}
                  className="active"
                >
                  Teacher Leave Report
                </Link>
              </li>
              <li>
                <Link to={routes.staffLeaveReport}>Staff Leave Report</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Card Table */}
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

          {/* Table */}
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

export default TeacherLeaveReport;
