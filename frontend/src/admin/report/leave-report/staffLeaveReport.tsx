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
import { staffLeaveReport } from "../../../service/staff";

const StaffLeaveReport = () => {
  const routes = all_routes;
  const [leaveReportData, setLeaveReportData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================================
  // ✅ Fetch Staff Leave Report
  // ============================================================
  const fetchReportData = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    try {
      const { data } = await staffLeaveReport();

      if (data.success && data.data.length > 0) {
        const staffs = data.data;     
        const leaveTypes = Object.keys(staffs[0].leaves);
        const transformed = staffs.map((staff: any) => {
          const row: any = {
            staffId: staff.staffId,
            staffName: staff.staffName,
            staff_img: staff.img,
            userId: staff.userId,
          };

          leaveTypes.forEach((leaveType) => {
            const leave = staff.leaves[leaveType];
            row[`${leaveType}_used`] = leave?.used || 0;
            row[`${leaveType}_available`] = leave?.available || 0;
            row[`${leaveType}_total`] = leave?.total || 0;
          });

          return row;
        });

       
        const dynamicColumns = [
          {
            title: "",
            children: [
              {
                title: "Staff ID",
                dataIndex: "staffId",
                key: "staffId",
                sorter: (a: any, b: any) => a.staffId - b.staffId,
                render: (text: any) => (
                  <Link to="#" className="link-primary">
                    STF{text}
                  </Link>
                ),
              },
            ],
          },
          {
            title: "",
            children: [
              {
                title: "Staff Name",
                dataIndex: "staffName",
                key: "staffName",
                render: (text: any, record: any) => (
                  <div className="d-flex align-items-center">
                    <Link
                      to={`${routes.staffLeave}/${record.staffId}`}
                      className="avatar avatar-md"
                    >
                      <img
                        src={`${Imageurl}/${record.staff_img}`}
                        alt="avatar"
                        className="img-fluid rounded-circle"
                      />
                    </Link>
                    <div className="ms-2">
                      <p className="text-dark mb-0">
                        <Link to={`${routes.staffLeave}/${record.staffId}`}>
                          {text}
                        </Link>
                      </p>
                    </div>
                  </div>
                ),
                sorter: (a: any, b: any) =>
                  a.staffName.localeCompare(b.staffName),
              },
            ],
          },

          // 4️⃣ Create dynamic columns for each leave type
          ...leaveTypes.map((leaveType) => ({
            title: `${leaveType} (${staffs[0].leaves[leaveType].total})`,
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
          <div className="list-tab">
            <ul>
              <li>
                <Link to={routes.leaveReport}>Student Leave Report</Link>
              </li>
              <li>
                <Link to={routes.teacherLeaveReport}>Teacher Leave Report</Link>
              </li>
              <li>
                <Link to={routes.staffLeaveReport} className="active">
                  Staff Leave Report
                </Link>
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

export default StaffLeaveReport;
