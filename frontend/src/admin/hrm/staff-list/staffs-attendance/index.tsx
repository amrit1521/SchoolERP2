
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
// import { staffsAttendance } from "../../../../core/data/json/staffs_attendance";
// import type { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import React, { useEffect, useState } from "react";
import { getStaffAttendance, speStaffDetails } from "../../../../service/staff";
import Skeleton from "react-loading-skeleton";
import { Imageurl } from "../../../../service/api";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { Spinner } from "../../../../spinner";

const StaffsAttendance = () => {
  const routes = all_routes;
  // const data = staffsAttendance;
  const { staffid } = useParams()
  const [staffData, setStaffData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)

  const fetchStaff = async (staffid: number) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await speStaffDetails(staffid)
      // console.log(data)
      if (data.success) {
        setStaffData(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }



  interface AttendanceData {
    id: number;
    attendance: string;
    attendance_date_info: string;
  }

  const [attendanceSummary, setAttendanceSummary] = useState<any>({});
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading2, setLoading2] = useState<boolean>(false);

  // ============================================================
  // ✅ Fetch Staff Attendance
  // ============================================================
  const fetchStaffAttendance = async (staffid: number) => {
    setLoading2(true);
    try {
      const { data } = await getStaffAttendance(staffid);
      setAttendanceSummary(data.summary);
      setAttendanceData(data.details);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading2(false);
    }
  };

  // ============================================================
  // ✅ Utilities
  // ============================================================

  // ✅ Get total days in a month (handles leap years)
  function getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  // ✅ Generate proper table (no invalid Feb 30, etc.)
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

    // Prepare lookup map for attendance data
    const attendanceMap: Record<string, string> = {};
    attendanceData.forEach((item) => {
      const date = new Date(item.attendance_date_info);
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      attendanceMap[`${month}-${day}`] = item.attendance;
    });

    // Get sample year from data or default to current year
    const sampleYear =
      attendanceData.length > 0
        ? new Date(attendanceData[0].attendance_date_info).getFullYear()
        : new Date().getFullYear();

    const rows: any[] = [];

    // ✅ Generate rows dynamically (1–31, only valid days per month)
    for (let d = 1; d <= 31; d++) {
      const dayStr = d.toString().padStart(2, "0");
      let row: any = { key: dayStr, date: dayStr };

      monthNames.forEach((month, mIndex) => {
        const totalDays = getDaysInMonth(sampleYear, mIndex);
        if (d <= totalDays) {
          row[month] = attendanceMap[`${month}-${d}`] || "";
        } else {
          row[month] = ""; // no invalid days like 30 Feb
        }
      });

      rows.push(row);
    }

    return rows;
  }

  // ✅ Generate table data
  const tabledata2 = generateAttendanceTable(attendanceData);

  // ============================================================
  // ✅ Dynamic Columns Generation (Jan–Dec)
  // ============================================================
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
        if (!text)
          return <span className="attendance-range bg-light" title="No data"></span>;

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



  useEffect(() => {
    if (staffid) {
      fetchStaff(Number(staffid))
      fetchStaffAttendance(Number(staffid))
    }

  }, [staffid])

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Staff Details</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to={routes.studentList}>HRM</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Staff Details
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center  flex-wrap">
                  <Link
                    to={`${routes.editStaff}/${staffData.staff_id}`}
                    className="btn btn-primary d-flex align-items-center mb-2"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit Staff
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Staff Information */}
            <div className="col-xxl-3 col-lg-4 theiaStickySidebar">

              {
                loading ? (<div className="stickybar pb-4">
                  {/* Staff Card */}
                  <div className="card border-white">
                    <div className="card-header">
                      <div className="d-flex align-items-center row-gap-3">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                          <Skeleton width={80} height={80} />
                        </div>
                        <div>
                          <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
                            <Skeleton width={50} />
                          </span>
                          <h5 className="mb-1"><Skeleton width={120} /></h5>
                          <p className="text-primary m-0"><Skeleton width={80} /></p>
                          <p className="p-0"><Skeleton width={140} /></p>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="mb-3"><Skeleton width={150} /></h5>
                      <dl className="row mb-0">
                        {Array.from({ length: 7 }).map((_, idx) => (
                          <React.Fragment key={idx}>
                            <dt className="col-6 fw-medium text-dark mb-3"><Skeleton width={100} /></dt>
                            <dd className="col-6 mb-3"><Skeleton width={120} /></dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="card border-white mb-0 mt-3">
                    <div className="card-body">
                      <h5 className="mb-3"><Skeleton width={150} /></h5>

                      <div className="d-flex align-items-center mb-3">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <Skeleton circle width={40} height={40} />
                        </span>
                        <div>
                          <span className="mb-1 fw-medium text-dark"><Skeleton width={100} /></span>
                          <p><Skeleton width={120} /></p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <Skeleton circle width={40} height={40} />
                        </span>
                        <div>
                          <span className="mb-1 fw-medium text-dark"><Skeleton width={120} /></span>
                          <p><Skeleton width={150} /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>) : (
                  <div className="stickybar pb-4">

                    <div className="card border-white">

                      <div className="card-header">


                        <div className="d-flex align-items-center  row-gap-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <img
                              src={`${Imageurl}/${staffData.img_src}`}
                              className="img-fluid"
                              alt="img"
                            />
                          </div>


                          <div>
                            <span className={`badge ${staffData.status == 1 ? 'badge-soft-success ' : 'badge-soft-danger'} d-inline-flex align-items-center mb-1`}>
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              {staffData.status == 1 ? 'Active' : 'Inactive'}
                            </span>
                            <h5 className="mb-1">{`${staffData.firstname} ${staffData.lastname}`}</h5>
                            <p className="text-primary m-0">{staffData.staff_id}</p>
                            <p className="p-0">Joined On : {dayjs(staffData.date_of_join).format('DD MMM YYYY')}</p>
                          </div>


                        </div>


                      </div>

                      <div className="card-body">
                        <h5 className="mb-3">Basic Information</h5>
                        <dl className="row mb-0">
                          <dt className="col-6 fw-medium text-dark mb-3">
                            Staff ID
                          </dt>
                          <dd className="col-6  mb-3">{staffData.staff_id}</dd>
                          <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
                          <dd className="col-6  mb-3">{staffData.gender}</dd>
                          <dt className="col-6 fw-medium text-dark mb-3">
                            Designation
                          </dt>
                          <dd className="col-6  mb-3 text-capitalize">{staffData.designation_name}</dd>
                          <dt className="col-6 fw-medium text-dark mb-3">
                            Department
                          </dt>
                          <dd className="col-6  mb-3 text-capitalize">{staffData.department_name}</dd>
                          <dt className="col-6 fw-medium text-dark mb-3">
                            Date Of Birth
                          </dt>
                          <dd className="col-6  mb-3">{dayjs(staffData.dob).format('DD MMM YYYY')}</dd>
                          <dt className="col-6 fw-medium text-dark mb-3">
                            Blood Group
                          </dt>
                          <dd className="col-6  mb-3">{staffData.blood_gp}</dd>


                          <dt className="col-6 fw-medium text-dark mb-0">
                            Language
                          </dt>
                          <dd className="col-6 text-dark mb-0">
                            {staffData.lan_known ? staffData.lan_known && (
                              <span className="badge badge-light text-dark me-2">
                                {JSON.parse(staffData.lan_known).join(',')}
                              </span>
                            ) : <div>__</div>}
                          </dd>
                        </dl>
                      </div>
                    </div>


                    <div className="card border-white mb-0">
                      <div className="card-body">
                        <h5 className="mb-3">Primary Contact Info</h5>
                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <i className="ti ti-phone" />
                          </span>
                          <div>
                            <span className="mb-1 fw-medium text-dark ">
                              Phone Number
                            </span>
                            <p>{staffData.mobile}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <i className="ti ti-mail" />
                          </span>
                          <div>
                            <span className="mb-1 fw-medium text-dark ">
                              Email Address
                            </span>
                            <p>{staffData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)
              }
            </div>
            {/* /Staff Information */}



            <div className="col-xxl-9 col-lg-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link
                        to={`${routes.staffDetails}/${staffData.staff_id}`}
                        className="nav-link"
                      >
                        <i className="ti ti-info-square-rounded me-2" />
                        Basic Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.staffPayroll}/${staffData.staff_id}`} className="nav-link">
                        <i className="ti ti-file-dollar me-2" />
                        Payroll
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.staffLeave}/${staffData.staff_id}`} className="nav-link">
                        <i className="ti ti-calendar-due me-2" />
                        Leaves
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.staffsAttendance}/${staffData.staff_id}`} className="nav-link active">
                        <i className="ti ti-calendar-due me-2" />
                        Attendance
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  {/* Attendance */}
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
                      <h4 className="mb-3">Attendance</h4>
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
                              <Link to="#" className="dropdown-item rounded-1">
                                This Year
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                This Month
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
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
                              <Link to="#" className="dropdown-item rounded-1">
                                <i className="ti ti-file-type-pdf me-2" />
                                Export as PDF
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
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
                      {
                        loading2 ? (<Spinner />) : (<Table columns={columns2} dataSource={tabledata2} />)
                      }
                      {/* /Attendance List */}
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
  );
};

export default StaffsAttendance;
