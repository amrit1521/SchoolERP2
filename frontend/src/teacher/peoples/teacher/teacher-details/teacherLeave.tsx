
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import Table from "../../../../core/common/dataTable/index";
import type { TableData } from "../../../../core/data/interface";
// import { leaveData } from "../../../../core/data/json/leaveData";
// import { Attendance } from "../../../../core/data/json/attendance";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import TeacherModal from "../teacherModal";
import { useEffect, useState } from "react";
import { getTeacherAttendance, getTeacherLeaveData, sepTeacher } from "../../../../service/api";
import dayjs from 'dayjs'
import { Spinner } from "../../../../spinner";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";


export interface LeaveInform {
  id: number;
  name: string;
  total_allowed: number;
  used: number;
  avilable: number;
}

const TeacherLeave = () => {
  const routes = all_routes;
  // const data = leaveData;
  // const data2 = Attendance;
  const { teacher_id } = useParams()
  // console.log(typeof userId)

  const [teacher, setTeacher] = useState<any>({})
  const [leaveInform, setLeaveInform] = useState<LeaveInform[]>([])
  const [leaveDataa, setLeaveDataa] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)


  const fetchTeacher = async (teacher_id: string) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {
      const { data } = await sepTeacher(teacher_id)
      if (data.success) {
        setTeacher(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  const handleAdd = () => {
    fetchLeave(teacher_id)
  }



  // ✅ Leave API function
  const fetchLeave = async (teacherId: any) => {
    setLoading2(true)
    await new Promise((res) => setTimeout(res, 400))
    try {
      const res = await getTeacherLeaveData(teacherId);

      if (res?.data?.success) {
        setLeaveInform(res.data.leave_inform);
        setLeaveDataa(res.data.teacherAllLeave);
      } else {
        console.warn("Failed to fetch leave data");
        setLeaveDataa([]);
      }
    } catch (error) {
      console.error("❌ Error fetching leave data:", error);
      setLeaveDataa([]);
    } finally {
      setLoading2(false)
    }
  };


  useEffect(() => {
    if (teacher_id) {
      fetchTeacher(teacher_id)
      fetchLeave(teacher_id)
    }
  }, [teacher_id])


  const tableData = leaveDataa.map((item: any) => ({
    key: item.id,
    leaveType: item.leave_type,
    leaveDate: `${dayjs(item.from_date).format("DD MMM YYYY")} to  ${dayjs(
      item.to_date
    ).format("DD MMM YYYY")}`,
    noOfDays: String(item.no_of_days),
    appliedOn: dayjs(item.applied_on).format("DD MMM YYYY"),
    status: item.status == "1" ? "Approved" : "Pending",
  }));


  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: TableData, b: TableData) =>
        a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: TableData, b: TableData) =>
        a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noOfDays",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.noOfDays) - parseFloat(b.noOfDays),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: TableData, b: TableData) =>
        a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Approved" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
  ];






interface AttendanceData {
  id: number;
  attendance: string;
  attendance_date_info: string;
}

const [attendanceSummary, setAttendanceSummary] = useState<any>({});
const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

const fetchTeacherAttendance = async (teacher_id: string) => {
  try {
    const { data } = await getTeacherAttendance(teacher_id);
    setAttendanceSummary(data.summary);
    setAttendanceData(data.details);
  } catch (error: any) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to fetch attendance");
  }
};


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


  const attendanceMap: Record<string, string> = {};
  attendanceData.forEach((item) => {
    const date = new Date(item.attendance_date_info);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    attendanceMap[`${month}-${day}`] = item.attendance;
  });


  const sampleYear =
    attendanceData.length > 0
      ? new Date(attendanceData[0].attendance_date_info).getFullYear()
      : new Date().getFullYear();

  const rows: any[] = [];

  for (let d = 1; d <= 31; d++) {
    const dayStr = d.toString().padStart(2, "0");
    let row: any = { key: dayStr, date: dayStr };

    monthNames.forEach((month, mIndex) => {
      const totalDays = getDaysInMonth(sampleYear, mIndex);
      if (d <= totalDays) {
        row[month] = attendanceMap[`${month}-${d}`] || "";
      } else {
        row[month] = ""; 
      }
    });

    rows.push(row);
  }

  return rows;
}

const tabledata2 = generateAttendanceTable(attendanceData);
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
    sorter: (a: any, b: any) => (a[month] || "").localeCompare(b[month] || ""),
  })),
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
                      <Link to={`${routes.teacherLeaves}/${teacher.teacher_id}`} className="nav-link active">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.teacherSalary}/${teacher.teacher_id}`} className="nav-link">
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
                  {/* Leave Nav*/}
                  <div className="card">
                    <div className="card-body pb-1">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                        <li className="me-3 mb-3">
                          <Link
                            to="#"
                            className="nav-link active rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#leave"
                          >
                            Leaves
                          </Link>
                        </li>
                        <li className="mb-3">
                          <button
                            onClick={() => fetchTeacherAttendance(teacher.teacher_id)}
                            className="nav-link rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#attendance"
                          >
                            Attendance
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Leave Nav*/}
                  <div className="tab-content">
                    {/* Leave */}
                    <div className="tab-pane fade show active" id="leave">
                      <div className="row gx-3">


                        {
                          loading2 ? (
                            Array.from({ length: 4 }).map((_, index) => (
                              <div key={index} className="col-lg-6 col-xxl-3 d-flex">
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2">
                                      <Skeleton height={18} width={150} />
                                    </h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <span className="pe-2 me-2 mb-0 d-inline-block">
                                        <Skeleton height={16} width={80} />
                                      </span>
                                      <span className="mb-0 d-inline-block">
                                        <Skeleton height={16} width={100} />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            leaveInform &&
                            leaveInform.map((item) => (
                              <div key={item.id} className="col-lg-6 col-xxl-3 d-flex">
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2 text-capitalize">
                                      {`${item.name} (${item.total_allowed})`}
                                    </h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <p className="border-end pe-2 me-2 mb-0">
                                        Used : {item.used}
                                      </p>
                                      <p className="mb-0">Available : {item.avilable}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}


                      </div>
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                          <h4 className="mb-3">Leaves</h4>
                          <Link
                            to="#"
                            data-bs-target="#apply_leave"
                            data-bs-toggle="modal"
                            className="btn btn-primary d-inline-flex align-items-center mb-3"
                          >
                            <i className="ti ti-calendar-event me-2" />
                            Apply Leave
                          </Link>
                        </div>
                        {/* Leaves List */}
                        <div className="card-body p-0 py-3">
                          {
                            loading2 ? (<Spinner />) : (<Table
                              dataSource={tableData}
                              columns={columns}
                              Selection={false}
                            />)
                          }
                        </div>
                        {/* /Leaves List */}
                      </div>
                    </div>
                    {/* /Leave */}
                    {/* Attendance */}
                    <div className="tab-pane fade" id="attendance">
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
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    Year : 2024 / 2025
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    Year : 2023 / 2024
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
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
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="dropdown mb-3 me-3">
                              <Link
                                to="#"
                                className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-calendar-due me-2" />
                                This Year
                              </Link>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Year
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Month
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Week
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="dropdown mb-3">
                              <Link
                                to="#"
                                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-file-export me-2" />
                                Export
                              </Link>
                              <ul className="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    <i className="ti ti-file-type-pdf me-2" />
                                    Export as PDF
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    <i className="ti ti-file-type-xls me-2" />
                                    Export as Excel{" "}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
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

                          <Table
                            dataSource={tabledata2}
                            columns={columns2}
                            Selection={false}
                          />
                          {/* /Attendance List */}
                        </div>
                      </div>
                    </div>
                    {/* /Attendance */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {teacher_id && (<TeacherModal onAdd={handleAdd} teacherId={teacher_id} />)}
    </>
  );
};

export default TeacherLeave;
