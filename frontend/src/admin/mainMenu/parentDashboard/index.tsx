import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import ReactApexChart from "react-apexcharts";
import {
  getAllChildExamResult,
  getParentDataByParentId,
  getParentUpcommingEvents,
  getTotalAvailableLeaves,
} from "../../../service/parentDashboardApi";
import { Spinner } from "../../../spinner";
import dayjs from "dayjs";
import {
  getAllNotice,
  getLeaveData,
  getStudentFeeReminder,
  getStudentHomework,
  Imageurl,
} from "../../../service/api";
import { toast } from "react-toastify";
import { parent_routes } from "../../../router/parent_routes";

interface ParentInfo {
  parentId: string;
  parentName: string;
  parentImg: string;
  parentAddedOn: string;
  child: any[];
}

const PParentDashboard = () => {
  const routes = all_routes;
  const [activeStudent, setActiveStudent] = useState<any>(null);
  const [statistic_chart] = useState<any>({
    chart: {
      type: "line",
      height: 345,
    },
    series: [
      {
        name: "Avg. Exam Score",
        data: [0, 32, 40, 50, 60, 52, 50, 44, 40, 60, 75, 70], // Sample data
      },
      {
        name: "Avg. Attendance",
        data: [0, 35, 43, 34, 30, 28, 25, 50, 60, 75, 77, 80], // Sample data
      },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "%";
        },
      },
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex, w }: any) {
        return `<div class="apexcharts-tooltip">${w.globals.labels[dataPointIndex]}<br>Exam Score: <span style="color: #1E90FF;">${series[0][dataPointIndex]}%</span><br>Attendance: <span style="color: #00BFFF;">${series[1][dataPointIndex]}%</span></div>`;
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        left: -8,
      },
    },
    yaxis: {
      labels: {
        offsetX: -15,
      },
    },
    markers: {
      size: 0,
      colors: ["#1E90FF", "#00BFFF"],
      strokeColors: "#fff",
      strokeWidth: 1,
      hover: {
        size: 7,
      },
    },
    colors: ["#3D5EE1", "#6FCCD8"], // Color for the lines
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  });
  const token = localStorage.getItem("token");
  const roleId = token ? JSON.parse(token)?.role : null;
  const userId = token ? JSON.parse(token)?.id : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [allNotice, setAllNotice] = useState([]);
  const [parentDetails, setParentDetails] = useState<ParentInfo>();
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [studentHomeWork, setStudentHomeWork] = useState<any[]>([]);
  const [feeReminder, setFeeReminder] = useState<any[]>([]);
  const [examResult, setExamResult] = useState<any[]>([]);
  const [availableLeaves, setAvailableLeaves] = useState<any[]>([]);

  const fetchParentDetails = async (userId: number) => {
    setLoading(true);
    try {
      const { data } = await getParentDataByParentId(userId);
      if (data.success) {
        setParentDetails({
          parentId: data.data?.parent_id,
          parentName: data.data?.name,
          parentImg: data.data?.img_src,
          parentAddedOn: data.data?.Parent_Add,
          child: data.data?.child.map((item: any) => ({
            admissionnum: item?.admissionnum,
            student_gender: item?.gender,
            student_class: item?.class,
            student_rollnum: item?.rollnum,
            student_section: item?.section,
            studentId: item?.stu_id,
            student_image: item?.stu_img,
            student_name: item?.name,
            class_id: item?.class_id,
            section_id: item?.section_id,
          })),
        });
        setActiveStudent({
          admissionnum: data.data?.child[0]?.admissionnum,
          student_gender: data.data?.child[0]?.gender,
          student_class: data.data?.child[0]?.class,
          class_id: data.data?.child[0].class_id,
          section_id: data.data?.child[0].section_id,
          student_rollnum: data.data?.child[0]?.rollnum,
          student_section: data.data?.child[0]?.section,
          studentId: data.data?.child[0]?.stu_id,
          student_image: data.data?.child[0]?.stu_img,
          student_name: data.data?.child[0]?.name,
        });
      }
    } catch (error) {
      console.error("Error fetching parent details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentEvents = async (roleId: number) => {
    try {
      const { data } = await getParentUpcommingEvents(roleId);
      if (data.success) {
        setEventsData(
          data.result.map((event: any) => ({
            title: event?.title,
            eventStartOn: event?.event_date,
            days: event?.days,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching parent details:", error);
    }
  };

  const fetchLeave = async (rollNo: any) => {
    try {
      const { data } = await getLeaveData(rollNo);
      if (data?.success) {
        setLeaveData(data.stuAllLeave);
      } else {
        console.warn("Failed to fetch leave data");
        setLeaveData([]);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };
  console.log(availableLeaves.length == 0 && "");
  const fetchNotice = async () => {
    try {
      const { data } = await getAllNotice();
      if (data.success) {
        setAllNotice(
          data.result.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            attachment: item.attachment,
            role_id: item.role_id,
            days: item.days,
            addedOn: item.created_at,
          }))
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load notice data"
      );
    }
  };

  const fetchHomeWork = async (classId: number, sectionId: number) => {
    try {
      const { data } = await getStudentHomework(classId, sectionId);
      if (data?.success) {
        setStudentHomeWork(data.data);
      } else {
        console.warn("Failed to fetch homework data");
        setLeaveData([]);
      }
    } catch (error) {
      console.error("Error fetching homework data:", error);
    }
  };

  const fetchFeeReminder = async (rollNum: number) => {
    try {
      const { data } = await getStudentFeeReminder(rollNum);
      if (data?.success) {
        setFeeReminder(data.data);
      } else {
        console.warn("Failed to fetch fee reminder data");
        setFeeReminder([]);
      }
    } catch (error) {
      console.error("Error fetching fee reminder data:", error);
    }
  };

  const fetchExamResult = async (userId: number) => {
    try {
      const { data } = await getAllChildExamResult(userId);
      if (data?.success) {
        setExamResult(data.data);
      } else {
        console.warn("Failed to fetch exam result data");
        setExamResult([]);
      }
    } catch (error) {
      console.error("Error fetching exam result data:", error);
    }
  };

  const fetchAvailableLeaves = async (userId: number) => {
    try {
      const { data } = await getTotalAvailableLeaves(userId);
      if (data?.success) {
        setAvailableLeaves(data.data);
      } else {
        console.warn("Failed to fetch leaves data");
        setAvailableLeaves([]);
      }
    } catch (error) {
      console.error("Error fetching leaves data:", error);
    }
  };

  useMemo(() => {
    if (activeStudent) {
      fetchLeave(activeStudent?.student_rollnum);
      fetchFeeReminder(activeStudent?.student_rollnum);
      fetchHomeWork(activeStudent?.class_id, activeStudent?.section_id);
      fetchAvailableLeaves(activeStudent?.studentId);
      fetchExamResult(Number(parentDetails?.parentId));
    }
  }, [activeStudent]);

  useEffect(() => {
    fetchNotice();
    fetchParentEvents(roleId);
    fetchParentDetails(userId);
  }, []);
  // console.log(parentDetails);
  // console.log("active student : ", activeStudent);
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Parent Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Parent Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="dash-select-student d-flex align-items-center mb-2">
              <h6 className="mb-0">Select Student</h6>
              <div className="student-active d-flex align-items-center ms-2">
                {parentDetails
                  ? parentDetails?.child?.map((item: any, index: number) => {
                      return (
                        <Link
                          to="#"
                          onClick={() => setActiveStudent(item)}
                          className={`avatar avatar-lg p-1 me-2 ${
                            activeStudent === "student-1" && "active"
                          }`}
                          key={index}
                        >
                          <img
                            src={`${Imageurl}/${item?.student_image}`}
                            alt="Profile"
                          />
                        </Link>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Profile */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="col-xxl-5 col-xl-12 d-flex">
                <div className="card bg-dark position-relative flex-fill">
                  <div className="card-body">
                    <div className="d-flex align-items-center row-gap-3">
                      <div className="avatar avatar-xxl rounded flex-shrink-0 me-3">
                        <img
                          src={`${Imageurl}/${parentDetails?.parentImg}`}
                          alt="Img"
                        />
                      </div>
                      <div className="d-block">
                        <span className="badge bg-transparent-primary text-primary mb-1">
                          P{parentDetails?.parentId}
                        </span>
                        <h4 className="text-truncate text-white mb-1">
                          {parentDetails?.parentName}
                        </h4>
                        <div className="d-flex align-items-center flex-wrap row-gap-2 class-info">
                          <span>
                            Added On :{" "}
                            {dayjs(parentDetails?.parentAddedOn).format(
                              "D MMM YYYY"
                            )}{" "}
                          </span>
                          <span>Child : {activeStudent?.student_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="student-card-bg">
                      <ImageWithBasePath
                        src="assets/img/bg/circle-shape.png"
                        alt="Bg"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/shape-02.png"
                        alt="Bg"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/shape-04.png"
                        alt="Bg"
                      />
                      <ImageWithBasePath
                        src="assets/img/bg/blue-polygon.png"
                        alt="Bg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* /Profile */}
            {/* Leave */}
            <div className="col-xxl-7 d-flex">
              <div className="row flex-fill">
                <div className="col-xl-4 d-flex flex-column">
                  <div className="d-flex bg-white border rounded flex-wrap justify-content-between align-items-center p-3 row-gap-2 mb-2 animate-card">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm bg-light-500 me-2 rounded">
                        <i className="ti ti-calendar-event text-dark fs-16" />
                      </span>
                      <h6>Apply Leave</h6>
                    </div>
                    <Link
                      to={routes.studentLeaves}
                      className="badge rounded-circle arrow d-flex align-items-center justify-content-center"
                    >
                      <i className="ti ti-chevron-right fs-14" />
                    </Link>
                  </div>
                  <div className="d-flex bg-white border rounded flex-wrap justify-content-between align-items-center p-3 row-gap-2 mb-4 animate-card">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm bg-light-500 me-2 rounded">
                        <i className="ti ti-message-up text-dark fs-16" />
                      </span>
                      <h6>Raise a Request</h6>
                    </div>
                    <Link
                      to={routes.approveRequest}
                      className="badge rounded-circle arrow d-flex align-items-center justify-content-center"
                    >
                      <i className="ti ti-chevron-right fs-14" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-success-transparent border-3 border-white text-center p-3">
                    <span className="avatar avatar-sm rounded bg-success mx-auto mb-3">
                      <i className="ti ti-calendar-share fs-15" />
                    </span>
                    <h6 className="mb-2">Medical Leaves (10)</h6>
                    <div className="d-flex align-items-center justify-content-between text-default">
                      <p className="border-end mb-0">Used : 05</p>
                      <p>Available : 10</p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="card bg-primary-transparent border-3 border-white text-center p-3">
                    <span className="avatar avatar-sm rounded bg-primary mx-auto mb-3">
                      <i className="ti ti-hexagonal-prism-plus fs-15" />
                    </span>
                    <h6 className="mb-2">Casual Leaves (12)</h6>
                    <div className="d-flex align-items-center justify-content-between text-default">
                      <p className="border-end mb-0">Used : 05</p>
                      <p>Available : 10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Leave */}
          </div>
          <div className="row">
            {/* Events List */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header  d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Events List</h4>
                  {/* <Link to={routes.events} className="fw-medium">
                    View All
                  </Link> */}
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {eventsData
                      ? eventsData?.map((event: any, index: number) => {
                          return (
                            <li className="list-group-item p-3" key={index}>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <Link
                                    to="#"
                                    className="avatar avatar-lg flex-shrink-0 me-2"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/events/event-01.jpg"
                                      className="img-fluid"
                                      alt="img"
                                    />
                                  </Link>
                                  <div className="overflow-hidden">
                                    <h6 className="mb-1">
                                      <Link to={routes.events}>
                                        {event?.title}
                                      </Link>
                                    </h6>
                                    <p>
                                      <i className="ti ti-calendar me-1" />
                                      {dayjs(event?.eventStartOn).format(
                                        "D MMM YYYY"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <span className="badge badge-soft-danger d-inline-flex align-items-center">
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  {event?.days}
                                </span>
                              </div>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Events List */}
            {/* Statistics */}
            <div className="col-xxl-8 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Statistics</h4>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-calendar me-2" />
                      This Month
                    </Link>
                    <ul className="dropdown-menu mt-2 p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          This Month
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          This Year
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div id="statistic_chart" />
                  <ReactApexChart
                    id="statistic_chart"
                    options={statistic_chart}
                    series={statistic_chart.series}
                    type="line"
                    height={345}
                  />
                </div>
              </div>
            </div>
            {/* /Statistics */}
          </div>
          <div className="row">
            {/* Leave Status */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Leave Status</h4>
                  {/* <div className="dropdown">
                    <Link
                      to="#"
                      className="bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-calendar me-2" />
                      This Month
                    </Link>
                    <ul className="dropdown-menu mt-2 p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          This Month
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          This Year
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  <Link
                    to={parent_routes.childleaves}
                    className="link-primary fw-medium"
                  >
                    View All
                  </Link>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "450px", overflowY: "auto" }}
                >
                  {leaveData
                    ? leaveData?.map((leave: any, index: number) => (
                        <div
                          className="bg-light-300 d-sm-flex align-items-center justify-content-between p-3 mb-3"
                          key={index}
                        >
                          <div className="d-flex align-items-center mb-2 mb-sm-0">
                            <div className="avatar avatar-lg bg-danger-transparent flex-shrink-0 me-2">
                              <i className="ti ti-brand-socket-io" />
                            </div>
                            <div>
                              <h6 className="mb-1">{leave?.leave_type}</h6>
                              <p>
                                Date :{" "}
                                {dayjs(leave?.applied_on).format("D MMM YYYY")}
                              </p>
                            </div>
                          </div>
                          <span className="badge bg-skyblue d-inline-flex align-items-center">
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {leave?.status ? "Approved" : "pending"}
                          </span>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
            {/* /Leave Status */}
            {/* Home Works */}
            <div className="col-xxl-4  col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-titile">Home Works</h4>
                  {/* <div className="dropdown">
                    <Link
                      to="#"
                      className="bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-book-2 me-2" />
                      All Subject
                    </Link>
                    <ul className="dropdown-menu mt-2 p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Physics
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Chemistry
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Maths
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                </div>
                <div
                  className="card-body py-1"
                  style={{ maxHeight: "450px", overflowY: "auto" }}
                >
                  <ul className="list-group list-group-flush">
                    {studentHomeWork
                      ? studentHomeWork?.map((hw: any) => {
                          return (
                            <li className="list-group-item py-3 px-0">
                              <div className="d-flex align-items-center">
                                <Link
                                  to="#"
                                  className="avatar avatar-xl flex-shrink-0 me-2"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/home-work/home-work-01.jpg"
                                    alt="img"
                                  />
                                </Link>
                                <div className="overflow-hidden">
                                  <p className="d-flex align-items-center text-info mb-1">
                                    <i className="ti ti-tag me-2" />
                                    {hw?.subject}
                                  </p>
                                  <h6 className="text-truncate mb-1">
                                    <Link to={routes.classHomeWork}>
                                      {hw?.description}
                                    </Link>
                                  </h6>
                                  <div className="d-flex align-items-center flex-wrap">
                                    <div className="d-flex align-items-center border-end me-1 pe-1">
                                      <Link
                                        to={routes.teacherDetails}
                                        className="avatar avatar-xs flex-shrink-0 me-2"
                                      >
                                        <img
                                          src={`${Imageurl}/${hw?.img_src}`}
                                          className="rounded-circle"
                                          alt="teacher"
                                        />
                                      </Link>
                                      <p className="text-dark">
                                        {hw?.firstname + " " + hw?.lastname}
                                      </p>
                                    </div>
                                    <p>
                                      Due by :{" "}
                                      {dayjs(hw?.submissionDate).format(
                                        "D MMM YYYY"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Home Works */}
            {/* Fees Reminder */}
            <div className="col-xxl-4 col-xl-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-titile">Fees Reminder</h4>
                  <Link
                    to={parent_routes.childFeeReminder}
                    className="link-primary fw-medium"
                  >
                    View All
                  </Link>
                </div>
                <div
                  className="card-body py-1"
                  style={{ maxHeight: "450px", overflowY: "auto" }}
                >
                  {feeReminder
                    ? feeReminder?.map((fee: any, index: number) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-between py-3"
                            key={index}
                          >
                            <div className="d-flex align-items-center overflow-hidden me-2">
                              <span className="bg-info-transparent avatar avatar-lg me-2 rounded-circle flex-shrink-0">
                                <i className="ti ti-bus-stop fs-16" />
                              </span>
                              <div className="overflow-hidden">
                                <h6 className="text-truncate mb-1">
                                  {fee?.fee_type}
                                </h6>
                                <p>{fee?.AmountPay}</p>
                              </div>
                            </div>
                            <div className="text-end">
                              <h6 className="mb-1">Last Date</h6>
                              <p>
                                {dayjs(fee?.collectionDate).format(
                                  "D MMM YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
            {/* Fees Reminder */}
          </div>
          <div className="row">
            {/* Exam Result */}
            <div className="col-xxl-8 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                  <h4 className="card-title mb-3">Exam Result</h4>
                  <div className="d-flex align-items-center"></div>
                </div>
                <div className="card-body px-0">
                  <div className="custom-datatable-filter table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Class </th>
                          <th>Section</th>
                          <th>Marks %</th>
                          <th>Exams</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examResult
                          ? examResult.map((exam: any, index: number) => (
                              <tr key={index}>
                                <td>{exam?.rollNum}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Link
                                      to={parent_routes.childDetails}
                                      className="avatar avatar-md"
                                    >
                                      <img
                                        src={`${Imageurl}/${exam?.img}`}
                                        className="img-fluid rounded-circle"
                                        alt="img"
                                      />
                                    </Link>
                                    <div className="ms-2">
                                      <p className="text-dark mb-0">
                                        <Link to={parent_routes.childDetails}>
                                          {exam?.student_name}
                                        </Link>
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>{exam?.class}</td>
                                <td className="text-capitalize">
                                  {exam?.section}
                                </td>
                                <td>{exam?.marks}%</td>
                                <td>{exam?.exam_name}</td>
                                <td>
                                  <span className="badge bg-success">
                                    {exam?.result_status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* /Exam Result */}
            {/* Notice Board */}
            <div className="col-xxl-4 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header  d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Notice Board</h4>
                  {/* <Link to={routes.noticeBoard} className="fw-medium">
                    View All
                  </Link> */}
                </div>
                <div className="card-body">
                  <div className="notice-widget">
                    {allNotice
                      ? allNotice?.map((notice: any, index: number) => (
                          <div
                            className="d-flex align-items-center justify-content-between mb-4"
                            key={index}
                          >
                            <div className="d-flex align-items-center overflow-hidden me-2">
                              <span className="bg-primary-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                                <i className="ti ti-books fs-16" />
                              </span>
                              <div className="overflow-hidden">
                                <h6 className="text-truncate mb-1">
                                  {notice?.title}
                                </h6>
                                <p>
                                  <i className="ti ti-calendar me-2" />
                                  Added on :{" "}
                                  {dayjs(notice?.created_at).format(
                                    "D MMM YYYY"
                                  )}
                                </p>
                              </div>
                            </div>
                            {/* <Link to={routes.noticeBoard}>
                              <i className="ti ti-chevron-right fs-16" />
                            </Link> */}
                          </div>
                        ))
                      : null}
                    {/* <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center overflow-hidden me-2">
                        <span className="bg-success-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                          <i className="ti ti-note fs-16" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="text-truncate mb-1">
                            World Environment Day Program.....!!!
                          </h6>
                          <p>
                            <i className="ti ti-calendar me-2" />
                            Added on : 21 Apr 2024
                          </p>
                        </div>
                      </div>
                      <Link to={routes.noticeBoard}>
                        <i className="ti ti-chevron-right fs-16" />
                      </Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center overflow-hidden me-2">
                        <span className="bg-danger-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                          <i className="ti ti-bell-check fs-16" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="text-truncate mb-1">
                            Exam Preparation Notification!
                          </h6>
                          <p>
                            <i className="ti ti-calendar me-2" />
                            Added on : 13 Mar 2024
                          </p>
                        </div>
                      </div>
                      <Link to={routes.noticeBoard}>
                        <i className="ti ti-chevron-right fs-16" />
                      </Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center overflow-hidden me-2">
                        <span className="bg-skyblue-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                          <i className="ti ti-notes fs-16" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="text-truncate mb-1">
                            Online Classes Preparation
                          </h6>
                          <p>
                            <i className="ti ti-calendar me-2" />
                            Added on : 24 May 2024
                          </p>
                        </div>
                      </div>
                      <Link to={routes.noticeBoard}>
                        <i className="ti ti-chevron-right fs-16" />
                      </Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center overflow-hidden me-2">
                        <span className="bg-warning-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                          <i className="ti ti-package fs-16" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="text-truncate mb-1">
                            Exam Time Table Release
                          </h6>
                          <p>
                            <i className="ti ti-calendar me-2" />
                            Added on : 24 May 2024
                          </p>
                        </div>
                      </div>
                      <Link to={routes.noticeBoard}>
                        <i className="ti ti-chevron-right fs-16" />
                      </Link>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-0">
                      <div className="d-flex align-items-center overflow-hidden me-2">
                        <span className="bg-danger-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                          <i className="ti ti-bell-check fs-16" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="text-truncate mb-1">
                            English Exam Preparation
                          </h6>
                          <p>
                            <i className="ti ti-calendar me-2" />
                            Added on : 23 Mar 2024
                          </p>
                        </div>
                      </div>
                      <Link to={routes.noticeBoard}>
                        <i className="ti ti-chevron-right fs-16" />
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* /Notice Board */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default PParentDashboard;
