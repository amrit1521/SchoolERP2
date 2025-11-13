import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../core/common/tooltipOption";
// import PredefinedDateRanges from "../core/common/datePicker";
import Table from "../core/common/dataTable/index";

// import type { TableData } from "../core/data/interface";
// import { attendancereportData } from "../../../core/data/json/attendence_report";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";

// import { Spinner } from "../spinner";
// import { Imageurl } from "../service/api";
import { getStudentAttendanceData } from "../service/studentapi";
import { toast } from "react-toastify";
import { Spinner } from "../spinner";

interface AttendanceData {
  id: number;
  attendance: string;
  attendance_date_info: string;
}
const MyAttendance = () => {
  const routes = all_routes;
  // const data = attendancereportData;
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;
  // const renderTitle = (title1: any, title2: any) => {
  //   return (
  //     <>
  //       <div className="text-center">
  //         <span className="day-num d-block">{title1}</span>
  //         <span>{title2}</span>
  //       </div>
  //     </>
  //   );
  // };
  const [attendanceSummary, setAttendanceSummary] = useState<any>({});
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  // const [stuAttendanceData, setStuAttendanceData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData2, setTableData2] = useState<any[]>([]);
  const fetchStudentAttendance = async (userId: number) => {
    try {
      setLoading(true);
      const { data } = await getStudentAttendanceData(userId);
      setAttendanceSummary(data.summary);
      setAttendanceData(data.details);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStudentAttendance(userId);
    }
  }, [userId]);

  function getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function generateAttendanceTable(attendanceData: AttendanceData[]) {
    const monthNames = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    const years = new Set(
      attendanceData?.map((item) =>
        new Date(item.attendance_date_info).getFullYear()
      )
    );

    // Prepare a map for faster lookup
    const attendanceMap: Record<string, string> = {};
    attendanceData?.forEach((item) => {
      const date = new Date(item.attendance_date_info);
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      attendanceMap[`${month}-${day}`] = item.attendance;
    });

    const rows: any[] = [];
    const sampleYear = [...years][0] || new Date().getFullYear();

    for (let m = 0; m < 12; m++) {
      const daysInMonth = getDaysInMonth(sampleYear, m);
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = d.toString().padStart(2, "0");
        let row = rows.find((r) => r.date === dayStr);
        if (!row) {
          row = { key: dayStr, date: dayStr };
          rows.push(row);
        }
        const month = monthNames[m];
        row[month] = attendanceMap[`${month}-${d}`] || "";
      }
    }

    return rows;
  }
  useEffect(() => {
    if (attendanceData) {
      setTableData2(generateAttendanceTable(attendanceData));
    }
  }, [attendanceData]);

  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const columns2 = [
    {
      title: "Date | Month",
      dataIndex: "date",
      sorter: (a: any, b: any) => parseInt(a.date) - parseInt(b.date),
    },
    ...monthNames.map((month) => ({
      title: month.toUpperCase(),
      dataIndex: month,
      render: (text: string) => {
        if (!text) return <span className="attendance-range bg-light"></span>;
        const colorMap: Record<string, string> = {
          Present: "bg-success",
          Holiday: "bg-pending",
          Halfday: "bg-dark",
          Late: "bg-info",
          Absent: "bg-danger",
        };
        return (
          <span
            className={`attendance-range ${colorMap[text] || "bg-secondary"}`}
            title={text}
          ></span>
        );
      },
      sorter: (a: any, b: any) =>
        (a[month] || "").localeCompare(b[month] || ""),
    })),
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">My Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.studentDashboard}>Student Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          <div className="attendance-types page-header justify-content-end">
            <ul className="attendance-type-list">
              <li>
                <span className="attendance-icon bg-success">
                  <i className="ti ti-checks" />
                </span>
                Present
              </li>
              <li>
                <span className="attendance-icon bg-danger">
                  <i className="ti ti-x" />
                </span>
                Absent
              </li>
              <li>
                <span className="attendance-icon bg-pending">
                  <i className="ti ti-clock-x" />
                </span>
                Late
              </li>
              <li>
                <span className="attendance-icon bg-dark">
                  <i className="ti ti-calendar-event" />
                </span>
                Halfday
              </li>
              <li>
                <span className="attendance-icon bg-info">
                  <i className="ti ti-clock-up" />
                </span>
                Holiday
              </li>
            </ul>
          </div>
          {/* Attendance */}
          <div className="tab-pane" id="attendance">
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                <h4 className="mb-3">Attendance</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="d-flex align-items-center flex-wrap me-3">
                    <p className="text-dark mb-3 me-2">
                      Last Updated on : 25 May 2024
                    </p>
                    <Link
                      to="#"
                      className="btn btn-primary btn-icon btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0 mb-3"
                    >
                      <i className="ti ti-refresh-dot" />
                    </Link>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-calendar-due me-2" />
                      Year : 2024 / 2025
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Year : 2024 / 2025
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Year : 2023 / 2024
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Year : 2022 / 2023
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body pb-1">
                <div className="row">
                  {/* Total Present */}
                  <div className="col-md-6 col-xxl-3 d-flex">
                    <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                      <span className="avatar avatar-lg bg-primary-transparent rounded me-2 flex-shrink-0 text-primary">
                        <i className="ti ti-user-check fs-24" />
                      </span>
                      <div className="ms-2">
                        <p className="mb-1">Present</p>
                        <h5>{attendanceSummary?.Present ?? 0}</h5>
                      </div>
                    </div>
                  </div>
                  {/* /Total Present */}
                  {/* Total Absent */}
                  <div className="col-md-6 col-xxl-3 d-flex">
                    <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                      <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                        <i className="ti ti-user-check fs-24" />
                      </span>
                      <div className="ms-2">
                        <p className="mb-1">Absent</p>
                        <h5>{attendanceSummary?.Absent ?? 0}</h5>
                      </div>
                    </div>
                  </div>
                  {/* /Total Absent */}
                  {/* Half Day */}
                  <div className="col-md-6 col-xxl-3 d-flex">
                    <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                      <span className="avatar avatar-lg bg-info-transparent rounded me-2 flex-shrink-0 text-info">
                        <i className="ti ti-user-check fs-24" />
                      </span>
                      <div className="ms-2">
                        <p className="mb-1">Half Day</p>
                        <h5>{attendanceSummary?.Halfday ?? 0}</h5>
                      </div>
                    </div>
                  </div>
                  {/* /Half Day */}
                  {/* Late to School*/}
                  <div className="col-md-6 col-xxl-3 d-flex">
                    <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                      <span className="avatar avatar-lg bg-warning-transparent rounded me-2 flex-shrink-0 text-warning">
                        <i className="ti ti-user-check fs-24" />
                      </span>
                      <div className="ms-2">
                        <p className="mb-1">Late</p>
                        <h5>{attendanceSummary?.Late ?? 0}</h5>
                      </div>
                    </div>
                  </div>
                  {/* /Late to School*/}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                <h4 className="mb-3">Leave &amp; Attendance</h4>
              </div>
              <div className="card-body p-0 py-3">
                <div className="px-3">
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                      <span className="avatar avatar-sm bg-success rounded me-2 flex-shrink-0 ">
                        <i className="ti ti-checks" />
                      </span>
                      <p className="text-dark">Present</p>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                      <span className="avatar avatar-sm bg-danger rounded me-2 flex-shrink-0 ">
                        <i className="ti ti-x" />
                      </span>
                      <p className="text-dark">Absent</p>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                      <span className="avatar avatar-sm bg-info rounded me-2 flex-shrink-0 ">
                        <i className="ti ti-clock-x" />
                      </span>
                      <p className="text-dark">Late</p>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                      <span className="avatar avatar-sm bg-dark rounded me-2 flex-shrink-0 ">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <p className="text-dark">Halfday</p>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                      <span className="avatar avatar-sm bg-pending rounded me-2 flex-shrink-0 ">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <p className="text-dark">Holiday</p>
                    </div>
                  </div>
                </div>
                {/* Attendance List */}
                {loading ? (
                  <Spinner />
                ) : (
                  tableData2.length > 0 && (
                    <Table
                      dataSource={tableData2}
                      columns={columns2}
                      Selection={false}
                    />
                  )
                )}
                {/* /Attendance List */}
              </div>
            </div>
          </div>
          {/* /Attendance */}
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default MyAttendance;
