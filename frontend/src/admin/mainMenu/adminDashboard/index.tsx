import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import "bootstrap-daterangepicker/daterangepicker.css";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import Slider from "react-slick";
import dayjs, { Dayjs } from "dayjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AdminDashboardModal from "./adminDashboardModal";
import {
  ActionOnLeaveRequest,
  getAllLeaveRequest,
  getAllNotice,
  getAllUserCountForRole,
  getPerforamanceCountPerClass,
  getTodayStaffAttendanceCounts,
  getTodayStudentAttendanceCounts,
  getTodayTeacherAttendanceCounts,
  getTopperResult,
  getTotalSubjectCounts,
  getUpcommingEvents,
  getUsersById,
  Imageurl,
} from "../../../service/api";
import { toast } from "react-toastify";
import { allPlayer } from "../../../service/sport";
import { allExpense, allIncome } from "../../../service/accounts";
import { allClassRoutine } from "../../../service/classApi";
import Table from "../../../core/common/dataTable/index";
import { DatePicker } from "antd";

interface UserRoleCount {
  imagePath: string;
  role: string;
  active: number | null;
  inactive: number | null;
  totalCount: number | null;
}

interface ClassRoutine {
  section: string;
  day: string;
  className: string;
  subject: string;
  firstname: string;
  lastname: string;
}

const AdminDashboard = () => {
  const routes = all_routes;
  const [date, setDate] = useState<Nullable<Date>>(null);
  function SampleNextArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-next"
        style={{ ...style, display: "flex", top: "30%", right: "30%" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-right" style={{ color: "#677788" }}></i>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-prev"
        style={{ ...style, display: "flex", top: "30%", left: "30%" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-left" style={{ color: "#677788" }}></i>
      </div>
    );
  }
  const settings = {
    dots: false,
    autoplay: false,
    arrows: false,
    slidesToShow: 2,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const student = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const teacher = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const [studentDonutChart, setStudentDonutChart] = useState<any>({
    series: [0, 0],
    options: {
      chart: {
        height: 218,
        width: 218,
        type: "donut",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      colors: ["#3D5EE1", "#6FCCD8"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 180,
            },
          },
        },
      ],
      labels: ["Present", "Absent"],
      tooltip: {
        y: {
          formatter: (value: number) => {
            return ` ${value} students`;
          },
        },
        marker: {
          show: true,
        },
        theme: "dark",
      },
    },
  });
  const [teacherDonutChart, SetTeacherDonutChart] = useState<any>({
    series: [0, 0],
    options: {
      chart: {
        height: 218,
        width: 218,
        type: "donut",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      colors: ["#3D5EE1", "#6FCCD8"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 180,
            },
          },
        },
      ],
      labels: ["Present", "Absent"],
      tooltip: {
        y: {
          formatter: (value: number) => {
            return ` ${value} teachers`;
          },
        },
        marker: {
          show: true,
        },
        theme: "dark",
      },
    },
  });
  const [staffDonutChart, SetStaffDonutChart] = useState<any>({
    series: [0, 0],
    options: {
      chart: {
        height: 218,
        width: 218,
        type: "donut",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      colors: ["#3D5EE1", "#6FCCD8"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 180,
            },
          },
        },
      ],
      labels: ["Present", "Absent"],
      tooltip: {
        y: {
          formatter: (value: number) => {
            return ` ${value} staff`;
          },
        },
        marker: {
          show: true,
        },
        theme: "dark",
      },
    },
  });
  const [classDonutChart, setClassDonutChart] = useState<any>({
    chart: {
      height: 218,
      width: 218,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    labels: ["Top", "Average", "Below Average"],
    legend: { show: false },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        offsetX: -15,
      },
    },
    grid: {
      padding: {
        left: -8,
      },
    },
    colors: ["#3D5EE1", "#EAB300", "#E82646"],
    series: [45, 11, 2],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 180,
          },
        },
      },
    ],
  });
  const [feesBar] = useState<any>({
    chart: {
      height: 275,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "left",
      position: "top",
      fontSize: "14px",
      labels: {
        colors: "#5D6369",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    colors: ["#3D5EE1", "#E9EDF4"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      padding: {
        left: -8,
      },
    },
    series: [
      {
        name: "Collected Fee",
        data: [30, 40, 38, 40, 38, 30, 35, 38, 40],
      },
      {
        name: "Total Fee",
        data: [45, 50, 48, 50, 48, 40, 40, 50, 55],
      },
    ],
    xaxis: {
      categories: [
        "Q1: 2023",
        "Q1: 2023",
        "Q1: 2023",
        "Q1: 2023",
        "Q1: 2023",
        "uQ1: 2023l",
        "Q1: 2023",
        "Q1: 2023",
        "Q1: 2023",
      ],
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        offsetX: -15,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return "$ " + val + " thousands";
        },
      },
    },
  });
  const [totalEarningArea, setTotalEarningArea] = useState<any>({
    chart: {
      height: 90,
      type: "area",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#3D5EE1"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "Earnings",
        data: [50, 55, 40, 50, 45, 55, 50],
      },
    ],
  });
  const [totalExpenseArea, setTotalExpenseArea] = useState<any>({
    chart: {
      height: 90,
      type: "area",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#E82646"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "Expense",
        data: [40, 30, 60, 55, 50, 55, 40],
      },
    ],
  });

  const [admin, setAdmin] = useState<any>({});
  const [countUsers, setCountUsers] = useState<UserRoleCount[]>([
    {
      imagePath: "assets/img/icons/student.svg",
      role: "student",
      active: null,
      inactive: null,
      totalCount: null,
    },
    {
      imagePath: "assets/img/icons/teacher.svg",
      role: "teacher",
      active: null,
      inactive: null,
      totalCount: null,
    },
    {
      imagePath: "assets/img/icons/staff.svg",
      role: "staff",
      active: null,
      inactive: null,
      totalCount: null,
    },
  ]);
  const [subjectCounts, setSubjectCounts] = useState<any>();
  const [upCommingEvents, setUcommingEvents] = useState<any[]>([]);
  const [studentAttendanceCount, setSudentAttendanceCount] =
    useState<any>(null);
  const [teacherAttendanceCount, setTeacherAttendanceCount] =
    useState<any>(null);
  const [staffAttendanceCount, setStaffAttendanceCount] = useState<any>(null);
  const [allNotice, setAllNotice] = useState([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [allexpdata, setAllexpdata] = useState<any>(null);
  const [allEarningData, setAllEarningData] = useState<any>(null);
  const [topperStudentList, setTopperStudentList] = useState<any[]>([]);
  const [performanceCategoryCount, setPerformanceCategoryCount] = useState<
    any[]
  >([]);
  const [selectedClass, setSelectedClass] = useState("I");
  const currentStats = performanceCategoryCount.find(
    (c) => c.class_name === selectedClass
  ) || {
    top: 0,
    average: 0,
    below_avg: 0,
  };
  const [allRoutine, setAllRoutine] = useState<ClassRoutine[]>([]);
  const [allLeaveRequest, setLeaveRequest] = useState<any[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ date: string | null }>({ date: null });
  const [filterType, setFilterType] = useState("today");

  const fetchStudent = async (id: number) => {
    try {
      const { data } = await getUsersById(id);
      if (data.success) {
        setAdmin(data?.result[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUpCommingEvents = async () => {
    try {
      const { data } = await getUpcommingEvents();
      if (data.success) {
        setUcommingEvents(data?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudentAttendanceCount = async () => {
    try {
      const { data } = await getTodayStudentAttendanceCounts(
        filter.date ? filter?.date : new Date()
      );
      if (data.success) {
        console.log("today attendance: ", data.result);
        setSudentAttendanceCount(data?.result);
        setStudentDonutChart((prevChart: any) => ({
          ...prevChart,
          series: [data.result?.present_count, data.result?.absent_count],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTeacherAttendanceCount = async () => {
    try {
      const { data } = await getTodayTeacherAttendanceCounts(
        filter.date ? filter?.date : new Date()
      );
      if (data.success) {
        console.log("teacher attendance: ", data.result);
        setTeacherAttendanceCount(data?.result);
        SetTeacherDonutChart((prevChart: any) => ({
          ...prevChart,
          series: [data.result?.present_count, data.result?.absent_count],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStaffAttendanceCount = async () => {
    try {
      const { data } = await getTodayStaffAttendanceCounts(
        filter.date ? filter?.date : new Date()
      );
      if (data.success) {
        console.log("staff attendance: ", data.result);
        setStaffAttendanceCount(data?.result);
        SetStaffDonutChart((prevChart: any) => ({
          ...prevChart,
          series: [data.result?.present_count, data.result?.absent_count],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCountUserForRole = async () => {
    try {
      const { data } = await getAllUserCountForRole();
      const subjects = await getTotalSubjectCounts();
      if (data?.success && Array.isArray(data?.result)) {
        setCountUsers((prev) => {
          const updatedCounts = prev.map((user) => {
            const current = data?.result.find(
              (item: any) => item.role === user.role
            );

            return {
              ...user,
              active: current?.active_count ?? null,
              inactive: current?.inactive_count ?? null,
              totalCount: current?.user_count ?? null,
            };
          });

          return updatedCounts;
        });
        setSubjectCounts(subjects.data.result);
      }
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }
  };

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

  const fetchPlayers = async () => {
    try {
      const { data } = await allPlayer();

      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllExpData = async () => {
    try {
      const { data } = await allExpense();
      if (data.success) {
        const expense = {
          total_expense: data.data.reduce(
            (prev: number, item: any) => item.amount + prev,
            0
          ),
          label: data.data.map((item: any) => item?.category),
          expenses: data?.data.map((item: any) => item.amount),
        };
        setAllexpdata(expense);
        setTotalExpenseArea((prev: any) => ({
          ...prev,
          series: [
            {
              ...prev.series[0],
              data: expense.expenses.length ? expense.expenses : [0],
            },
          ],
          xaxis: {
            categories: expense.label.length ? expense.label : [],
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "10px",
                colors: "#6B7280",
              },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          tooltip: {
            y: {
              formatter: (val: number) => {
                return `₹${val}`;
              },
            },
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEarningData = async () => {
    try {
      const { data } = await allIncome();
      if (data.success) {
        const earnings = {
          total_earnings: data.data.reduce(
            (prev: number, item: any) => item.amount + prev,
            0
          ),
          label: data.data.map((item: any) => item?.incomeName),
          all_earnings: data?.data.map((item: any) => item.amount),
        };
        setAllEarningData(earnings);
        setTotalEarningArea((prev: any) => ({
          ...prev,
          series: [
            {
              ...prev.series[0],
              data: earnings.all_earnings.length ? earnings.all_earnings : [0],
            },
          ],
          xaxis: {
            categories: earnings.label.length ? earnings.label : [],
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "10px",
                colors: "#6B7280",
              },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          tooltip: {
            y: {
              formatter: (val: number) => {
                return `₹${val}`;
              },
            },
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClassTopperStudent = async () => {
    try {
      const { data } = await getTopperResult();
      if (data.success) {
        setTopperStudentList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPerformanceCountPerClass = async () => {
    try {
      const { data } = await getPerforamanceCountPerClass();
      if (data.success) {
        console.log("performance Category Count: ", data.data);
        setPerformanceCategoryCount(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoutines = async () => {
    try {
      const { data } = await allClassRoutine();
      if (data.success) setAllRoutine(data.data);
    } catch (error) {
      console.error("Error fetching class routines:", error);
    }
  };

  const fetchAllLeaveRequest = async () => {
    try {
      const { data } = await getAllLeaveRequest();
      if (data.success) {
        console.log("leave Request: ", data.result);
        setLeaveRequest(data.result);
      }
    } catch (error) {
      console.error("Error fetching leave request:", error);
    }
  };

  useEffect(() => {
    const cls = performanceCategoryCount.find(
      (c) => c.class_name === selectedClass
    );
    console.log("cls : ", cls);
    if (cls) {
      setClassDonutChart((prev: any) => ({
        ...prev,
        series: [cls.top, cls.average, cls.below_avg],
      }));
    } else {
      setClassDonutChart((prev: any) => ({
        ...prev,
        series: [0, 0, 0],
      }));
    }
  }, [selectedClass, performanceCategoryCount]);

  const handleClassSelect = (className: any) => {
    setSelectedClass(className);
  };

  useEffect(() => {
    if (filter?.date) {
      fetchStudentAttendanceCount();
      fetchTeacherAttendanceCount();
      fetchStaffAttendanceCount();
    }
  }, [filter]);

  useEffect(() => {
    if (!allLeaveRequest || allLeaveRequest.length === 0) return;
    const today = dayjs().startOf("day");
    const startOfThisWeek = dayjs().startOf("week");
    const endOfThisWeek = dayjs().endOf("week");

    const startOfLastWeek = dayjs().subtract(1, "week").startOf("week");
    const endOfLastWeek = dayjs().subtract(1, "week").endOf("week");

    const filtered = allLeaveRequest.filter((leave) => {
      const appliedDate = dayjs(leave.applied_on);

      if (filterType === "today") {
        return appliedDate.isSame(today, "day");
      }

      if (filterType === "thisWeek") {
        return (
          appliedDate.isSameOrAfter(startOfThisWeek, "day") &&
          appliedDate.isSameOrBefore(endOfThisWeek, "day")
        );
      }

      if (filterType === "lastWeek") {
        return (
          appliedDate.isSameOrAfter(startOfLastWeek, "day") &&
          appliedDate.isSameOrBefore(endOfLastWeek, "day")
        );
      }

      return true;
    });

    setFilteredLeaves(filtered);
  }, [filterType, allLeaveRequest]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsetoken = JSON.parse(token);
      fetchStudent(parsetoken.id);
    }
    fetchCountUserForRole();
    fetchUpCommingEvents();
    fetchStudentAttendanceCount();
    fetchTeacherAttendanceCount();
    fetchStaffAttendanceCount();
    fetchNotice();
    fetchPlayers();
    fetchAllExpData();
    fetchEarningData();
    fetchClassTopperStudent();
    fetchPerformanceCountPerClass();
    fetchRoutines();
    fetchAllLeaveRequest();
  }, []);

  const handleApplyApproveRequest = async (id: number) => {
    try {
      const { data } = await ActionOnLeaveRequest({ status: true }, id);
      if (data.success) {
        console.log("leave Request approved: ", data);
        fetchAllLeaveRequest();
        toast.success("leave Request Approved Successfully.");
      }
    } catch (error) {
      console.error("Error in approving leave request:", error);
    }
  };
  const handleApplyRejectRequest = async (id: number) => {
    try {
      const { data } = await ActionOnLeaveRequest({ status: false }, id);
      if (data.success) {
        console.log("leave Request rejected: ", data);
        toast.success("leave Request rejected.");
        fetchAllLeaveRequest();
      }
    } catch (error) {
      console.error("Error in rejecting leave request:", error);
    }
  };

  const columns = [
    {
      title: "Class",
      dataIndex: "className",
    },
    {
      title: "Section",
      dataIndex: "section",
    },
    {
      title: "Teacher",
      dataIndex: "firstname",
      render: (text: string, record: any) => `${text} ${record.lastname}`,
    },
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Day",
      dataIndex: "day",
    },
    // {
    //   title: "Start Time",
    //   dataIndex: "startTime",
    // },
    // {
    //   title: "End Time",
    //   dataIndex: "endTime",
    // },
    // {
    //   title: "Class Room",
    //   dataIndex: "room_no",
    // },
  ];
  console.log("filtered Leaves : ", filteredLeaves);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <>
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Admin Dashboard</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Admin Dashboard
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link
                    to={routes.addStudent}
                    className="btn btn-primary d-flex align-items-center me-3"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add New Student
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to={routes.collectFees}
                    className="btn btn-light d-flex align-items-center"
                  >
                    Fees Details
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="alert-message">
                  <div
                    className="alert alert-success rounded-pill d-flex align-items-center justify-content-between border-success mb-4"
                    role="alert"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-1 avatar avatar-sm flex-shrink-0">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-27.jpg"
                          alt="Img"
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      <p>
                        Fahed III,C has paid Fees for the{" "}
                        <strong className="mx-1">“Term1”</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close p-0"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    >
                      <span>
                        <i className="ti ti-x" />
                      </span>
                    </button>
                  </div>
                </div>
                {/* Dashboard Content */}
                <div className="card bg-dark">
                  <div className="overlay-img">
                    <ImageWithBasePath
                      src="assets/img/bg/shape-04.png"
                      alt="img"
                      className="img-fluid shape-01"
                    />
                    <ImageWithBasePath
                      src="assets/img/bg/shape-01.png"
                      alt="img"
                      className="img-fluid shape-02"
                    />
                    <ImageWithBasePath
                      src="assets/img/bg/shape-02.png"
                      alt="img"
                      className="img-fluid shape-03"
                    />
                    <ImageWithBasePath
                      src="assets/img/bg/shape-03.png"
                      alt="img"
                      className="img-fluid shape-04"
                    />
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
                      <div className="mb-3 mb-xl-0">
                        <div className="d-flex align-items-center flex-wrap mb-2">
                          <h1 className="text-white me-2">
                            Welcome Back, Mr.{" "}
                            {admin
                              ? admin?.firstname + " " + admin?.lastname
                              : ""}
                          </h1>
                          <Link
                            to="profile"
                            className="avatar avatar-sm img-rounded bg-gray-800 dark-hover"
                          >
                            <i className="ti ti-edit text-white" />
                          </Link>
                        </div>
                        <p className="text-white">Have a Good day at work</p>
                      </div>
                      <p className="text-white custom-text-white">
                        <i className="ti ti-refresh me-1" />
                        Updated Recently on 15 Jun 2024
                      </p>
                    </div>
                  </div>
                </div>
                {/* /Dashboard Content */}
              </div>
            </div>
            <div className="row">
              {/* Total Students */}

              {countUsers.map((item: any, index: number) => {
                return (
                  <div className="col-xxl-3 col-sm-6 d-flex" key={index}>
                    <div className="card flex-fill animate-card border-0">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-xl bg-danger-transparent me-2 p-1">
                            <ImageWithBasePath src={item.imagePath} alt="img" />
                          </div>
                          <div className="overflow-hidden flex-fill">
                            <div className="d-flex align-items-center justify-content-between">
                              <h2 className="counter">
                                <CountUp end={item.totalCount} />
                              </h2>
                              <span className="badge bg-danger">1.2%</span>
                            </div>
                            <p className="text-capitalize">
                              Total {item.role}s
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                          <p className="mb-0">
                            Active :{" "}
                            <span className="text-dark fw-semibold">
                              {item.active}
                            </span>
                          </p>
                          <span className="text-light">|</span>
                          <p>
                            Inactive :{" "}
                            <span className="text-dark fw-semibold">
                              {item.inactive}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* /Total Students */}
              {/* Total Teachers */}
              {/* <div className="col-xxl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl me-2 bg-secondary-transparent p-1">
                        <ImageWithBasePath
                          src="assets/img/icons/teacher.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 className="counter">
                            <CountUp end={284} />
                          </h2>
                          <span className="badge bg-pending">1.2%</span>
                        </div>
                        <p>Total Teachers</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">254</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">30</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* /Total Teachers */}
              {/* Total Staff */}
              {/* <div className="col-xxl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl me-2 bg-warning-transparent p-1">
                        <ImageWithBasePath
                          src="assets/img/icons/staff.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 className="counter">
                            <CountUp end={162} />
                          </h2>
                          <span className="badge bg-warning">1.2%</span>
                        </div>
                        <p>Total Staff</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">161</span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">02</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* /Total Staff */}
              {/* Total Subjects */}
              <div className="col-xxl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xl me-2 bg-success-transparent p-1">
                        <ImageWithBasePath
                          src="assets/img/icons/subject.svg"
                          alt="img"
                        />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 className="counter">
                            <CountUp
                              end={
                                subjectCounts ? subjectCounts?.total_count : ""
                              }
                            />
                          </h2>
                          <span className="badge bg-success">1.2%</span>
                        </div>
                        <p>Total Subjects</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
                      <p className="mb-0">
                        Active :{" "}
                        <span className="text-dark fw-semibold">
                          {subjectCounts ? subjectCounts?.active_count : ""}
                        </span>
                      </p>
                      <span className="text-light">|</span>
                      <p>
                        Inactive :{" "}
                        <span className="text-dark fw-semibold">
                          {subjectCounts ? subjectCounts?.inactive_count : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Total Subjects */}
            </div>
            <div className="row">
              {/* Schedules */}
              <div className="col-xxl-4 col-xl-6 col-md-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="card-title">Schedules</h4>
                    </div>
                    <Link
                      to={routes.events}
                      className="link-primary fw-medium me-2"
                      // data-bs-toggle="modal"
                      // data-bs-target="#add_event"
                    >
                      <i className="ti ti-square-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="card-body ">
                    {/* <div className="datepic mb-4" /> */}
                    <Calendar
                      className="datepickers mb-4"
                      value={date}
                      onChange={(e) => setDate(e.value)}
                      inline
                    />
                    <h5 className="mb-3">Upcoming Events</h5>
                    <div className="event-wrapper event-scroll">
                      {/* Event Item */}
                      {upCommingEvents
                        ? upCommingEvents.map((event: any, index: number) => {
                            return (
                              <div
                                className="border-start border-skyblue border-3 shadow-sm p-3 mb-3"
                                key={index}
                              >
                                <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                  <span className="avatar p-1 me-2 bg-teal-transparent flex-shrink-0">
                                    <i className="ti ti-user-edit text-info fs-20" />
                                  </span>
                                  <div className="flex-fill">
                                    <h6 className="mb-1">{event?.title}</h6>
                                    <p className="d-flex align-items-center">
                                      <i className="ti ti-calendar me-1" />
                                      {new Date(
                                        event?.event_date?.split("|")[0]
                                      ).toDateString()}{" "}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="mb-0">
                                    <i className="ti ti-clock me-1" />

                                    {event?.event_time
                                      ?.split("|")
                                      .map((t: any) => {
                                        const [h, m] = t.split(":").map(Number);
                                        return `${(h % 12 || 12)
                                          .toString()
                                          .padStart(2, "0")}:${m
                                          .toString()
                                          .padStart(2, "0")}${
                                          h >= 12 ? "PM" : "AM"
                                        }`;
                                      })
                                      .join(" - ")}
                                  </p>
                                  <div className="avatar-list-stacked avatar-group-sm">
                                    <span className="avatar border-0">
                                      <ImageWithBasePath
                                        src="assets/img/parents/parent-01.jpg"
                                        className="rounded-circle"
                                        alt="img"
                                      />
                                    </span>
                                    <span className="avatar border-0">
                                      <ImageWithBasePath
                                        src="assets/img/parents/parent-07.jpg"
                                        className="rounded-circle"
                                        alt="img"
                                      />
                                    </span>
                                    <span className="avatar border-0">
                                      <ImageWithBasePath
                                        src="assets/img/parents/parent-02.jpg"
                                        className="rounded-circle"
                                        alt="img"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : ""}
                      {/* /Event Item */}
                      {/* Event Item */}
                      {/* <div className="border-start border-info border-3 shadow-sm p-3 mb-3">
                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                          <span className="avatar p-1 me-2 bg-info-transparent flex-shrink-0">
                            <i className="ti ti-user-edit fs-20" />
                          </span>
                          <div className="flex-fill">
                            <h6 className="mb-1">Parents, Teacher Meet</h6>
                            <p className="d-flex align-items-center">
                              <i className="ti ti-calendar me-1" />
                              15 July 2024
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">
                            <i className="ti ti-clock me-1" />
                            09:10AM - 10:50PM
                          </p>
                          <div className="avatar-list-stacked avatar-group-sm">
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-05.jpg"
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-06.jpg"
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-07.jpg"
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                          </div>
                        </div>
                      </div> */}
                      {/* /Event Item */}
                      {/* Event Item */}
                      {/* <div className="border-start border-danger border-3 shadow-sm p-3 mb-3">
                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                          <span className="avatar p-1 me-2 bg-danger-transparent flex-shrink-0">
                            <i className="ti ti-vacuum-cleaner fs-24" />
                          </span>
                          <div className="flex-fill">
                            <h6 className="mb-1">Vacation Meeting</h6>
                            <p className="d-flex align-items-center">
                              <i className="ti ti-calendar me-1" />
                              07 July 2024 - 07 July 2024
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">
                            <i className="ti ti-clock me-1" />
                            09:10 AM - 10:50 PM
                          </p>
                          <div className="avatar-list-stacked avatar-group-sm">
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-11.jpg"
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-13.jpg"
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                          </div>
                        </div>
                      </div> */}
                      {/* /Event Item */}
                    </div>
                  </div>
                </div>
              </div>
              {/* /Schedules */}
              {/* Attendance */}
              <div className="col-xxl-4 col-xl-6 col-md-12 d-flex flex-column">
                <div className="card">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Attendance</h4>
                    <div className="dropdown d-flex align-items-center">
                      <i className="ti ti-calendar-due me-1" />
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        placeholder="Select Date"
                        onChange={(date: Dayjs | null) => {
                          setFilter({
                            date: date ? date.format("YYYY-MM-DD") : null,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="list-tab mb-4">
                      <ul className="nav">
                        <li>
                          <Link
                            to="#"
                            className="active"
                            data-bs-toggle="tab"
                            data-bs-target="#students"
                          >
                            Students
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#teachers"
                          >
                            Teachers
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#staff"
                          >
                            Staff
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content">
                      <div className="tab-pane fade active show" id="students">
                        <div className="row gx-3">
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {studentAttendanceCount
                                    ? studentAttendanceCount?.present_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Present</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {studentAttendanceCount
                                    ? studentAttendanceCount?.absent_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Absent</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {studentAttendanceCount
                                    ? studentAttendanceCount?.late_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Late</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <ReactApexChart
                            id="student-chart"
                            className="mb-4"
                            options={studentDonutChart.options}
                            series={studentDonutChart.series}
                            type="donut"
                            height={210}
                          />
                          <Link
                            to={routes.studentAttendance}
                            className="btn btn-light"
                          >
                            <i className="ti ti-calendar-share me-1" />
                            View All
                          </Link>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="teachers">
                        <div className="row gx-3">
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {teacherAttendanceCount
                                    ? teacherAttendanceCount?.present_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Present</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {teacherAttendanceCount
                                    ? teacherAttendanceCount?.absent_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Absent</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {teacherAttendanceCount
                                    ? teacherAttendanceCount?.late_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Late</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <ReactApexChart
                            id="teacher-chart"
                            className="mb-4"
                            options={teacherDonutChart.options}
                            series={teacherDonutChart.series}
                            type="donut"
                            height={210}
                          />
                          <Link
                            to="teacher-attendance"
                            className="btn btn-light"
                          >
                            <i className="ti ti-calendar-share me-1" />
                            View All
                          </Link>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="staff">
                        <div className="row gx-3">
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {staffAttendanceCount
                                    ? staffAttendanceCount?.present_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Present</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {staffAttendanceCount
                                    ? staffAttendanceCount?.absent_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Absent</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card bg-light-300 shadow-none border-0">
                              <div className="card-body p-3 text-center">
                                <h5>
                                  {staffAttendanceCount
                                    ? staffAttendanceCount?.late_count
                                    : 0}
                                </h5>
                                <p className="fs-12">Late</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div id="staff-chart" className="mb-4" />
                          <ReactApexChart
                            id="staff-chart"
                            className="mb-4"
                            options={staffDonutChart.options}
                            series={staffDonutChart.series}
                            type="donut"
                            height={210}
                          />
                          <Link
                            to={routes.studentAttendance}
                            className="btn btn-light"
                          >
                            <i className="ti ti-calendar-share me-1" />
                            View All
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row flex-fill">
                  {/* Best Performer */}
                  <div className="col-sm-6 d-flex flex-column">
                    <div className="bg-success-800 p-3 br-5 text-center flex-fill mb-4 pb-0  owl-height bg-01">
                      <Slider
                        {...teacher}
                        className="owl-carousel student-slider h-100"
                      >
                        <div className="item h-100">
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">
                                Best Performer
                              </h5>
                              <h4 className="mb-1 text-white">Rubell</h4>
                              <p className="text-light">Physics Teacher</p>
                            </div>
                            <ImageWithBasePath
                              src="assets/img/performer/performer-01.png"
                              alt="img"
                            />
                          </div>
                        </div>
                        <div className="item h-100">
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">
                                Best Performer
                              </h5>
                              <h4 className="mb-1 text-white">George Odell</h4>
                              <p className="text-light">English Teacher</p>
                            </div>
                            <ImageWithBasePath
                              src="assets/img/performer/performer-02.png"
                              alt="img"
                            />
                          </div>
                        </div>
                      </Slider>
                    </div>
                  </div>
                  {/* /Best Performer */}
                  {/* Star Students */}
                  <div className="col-sm-6 d-flex flex-column">
                    <div className="bg-info p-3 br-5 text-center flex-fill mb-4 pb-0  owl-height bg-02">
                      <Slider
                        {...student}
                        className="owl-carousel teacher-slider h-100"
                      >
                        {/* <div className="item h-100">
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">Star Students</h5>
                              <h4 className="mb-1 text-white">Michael </h4>
                              <p>XII, B</p>
                            </div>
                            <ImageWithBasePath
                              src="assets/img/performer/student-performer-02.png"
                              alt="img"
                            />
                          </div>
                        </div> */}
                        {topperStudentList
                          ? topperStudentList.map(
                              (topper: any, index: number) => {
                                return (
                                  <div className="item h-100" key={index}>
                                    <div className="d-flex justify-content-between flex-column h-100">
                                      <div>
                                        <h5 className="mb-3 text-white">
                                          Topper Students
                                        </h5>
                                        <h4 className="mb-1 text-white">
                                          {topper?.studentName}
                                        </h4>
                                        <p className="text-light">
                                          {topper?.class_name}
                                          {", "}
                                          {topper?.section_name?.toUpperCase()}
                                        </p>
                                      </div>
                                      <img
                                        src={`${Imageurl}/${topper?.image}`}
                                        alt="img"
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )
                          : ""}
                        <div className="item h-100">
                          <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                              <h5 className="mb-3 text-white">Star Students</h5>
                              <h4 className="mb-1 text-white">Tenesa</h4>
                              <p className="text-light">XII, A</p>
                            </div>
                            <ImageWithBasePath
                              src="assets/img/performer/student-performer-01.png"
                              alt="img"
                            />
                          </div>
                        </div>
                      </Slider>
                    </div>
                  </div>
                  {/* /Star Students */}
                </div>
              </div>
              {/* /Attendance */}
              <div className="col-xxl-4 col-md-12 d-flex flex-column">
                {/* Quick Links */}
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Quick Links</h4>
                  </div>
                  <div className="card-body pb-1">
                    <Slider {...settings} className="owl-carousel link-slider">
                      <div className="item">
                        <Link
                          to={routes.classTimetable}
                          className="d-block bg-success-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-success rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-success rounded-circle">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                          <p className="text-dark">Calendar</p>
                        </Link>
                        <Link
                          to={routes.feesGroup}
                          className="d-block bg-secondary-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-secondary rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-secondary rounded-circle">
                              <i className="ti ti-license" />
                            </span>
                          </div>
                          <p className="text-dark">Fees</p>
                        </Link>
                      </div>
                      <div className="item">
                        <Link
                          to={routes.examResult}
                          className="d-block bg-primary-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-primary rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-primary rounded-circle">
                              <i className="ti ti-hexagonal-prism" />
                            </span>
                          </div>
                          <p className="text-dark">Exam Result</p>
                        </Link>
                        <Link
                          to={routes.classHomeWork}
                          className="d-block bg-danger-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-danger rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-danger rounded-circle">
                              <i className="ti ti-report-money" />
                            </span>
                          </div>
                          <p className="text-dark">Home Works</p>
                        </Link>
                      </div>
                      <div className="item">
                        <Link
                          to={routes.studentAttendance}
                          className="d-block bg-warning-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-warning rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-warning rounded-circle">
                              <i className="ti ti-calendar-share" />
                            </span>
                          </div>
                          <p className="text-dark">Attendance</p>
                        </Link>
                        <Link
                          to={routes.attendanceReport}
                          className="d-block bg-skyblue-transparent ronded p-2 text-center mb-3 class-hover"
                        >
                          <div className="avatar avatar-lg border p-1 border-skyblue rounded-circle mb-2">
                            <span className="d-inline-flex align-items-center justify-content-center w-100 h-100 bg-pending rounded-circle">
                              <i className="ti ti-file-pencil" />
                            </span>
                          </div>
                          <p className="text-dark">Reports</p>
                        </Link>
                      </div>
                    </Slider>
                  </div>
                </div>
                {/* /Quick Links */}
                {/* Class Routine */}
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Class Routine</h4>
                    <Link
                      to={routes?.classRoutine}
                      className="link-primary fw-medium"
                      // data-bs-toggle="modal"
                      // data-bs-target="#add_class_routine"
                    >
                      <i className="ti ti-square-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="card-body">
                    {/* <div className="d-flex align-items-center rounded border p-3 mb-3">
                      <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/teachers/teacher-01.jpg"
                          className="rounded"
                          alt="Profile"
                        />
                      </span>
                      <div className="w-100">
                        <p className="mb-1">Oct 2024</p>
                        <div className="progress progress-xs  flex-grow-1 mb-1">
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary rounded"
                            role="progressbar"
                            style={{ width: "50%" }}
                            aria-valuenow={50}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center rounded border p-3 mb-3">
                      <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/teachers/teacher-02.jpg"
                          className="rounded"
                          alt="Profile"
                        />
                      </span>
                      <div className="w-100">
                        <p className="mb-1">Nov 2024</p>
                        <div className="progress progress-xs  flex-grow-1 mb-1">
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-warning rounded"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center rounded border p-3 mb-0">
                      <span className="avatar avatar-md flex-shrink-0 border rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/teachers/teacher-03.jpg"
                          className="rounded"
                          alt="Profile"
                        />
                      </span>
                      <div className="w-100">
                        <p className="mb-1">Oct 2024</p>
                        <div className="progress progress-xs  flex-grow-1 mb-1">
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-success rounded"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow={80}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div> */}
                    <Table columns={columns} dataSource={allRoutine} />
                  </div>
                </div>
                {/* /Class Routine */}
                {/* Class Wise Performance */}
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Performance</h4>
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="bg-white dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-school-bell me-2" />
                        Class {selectedClass}
                      </Link>
                      <ul className="dropdown-menu mt-2 p-3">
                        {performanceCategoryCount.map((cls) => (
                          <li key={cls.class_id}>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                              onClick={() => handleClassSelect(cls.class_name)}
                            >
                              Class {cls.class_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="d-md-flex align-items-center justify-content-between">
                      <div className="me-md-3 mb-3 mb-md-0 w-100">
                        <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-1">
                          <p className="mb-0 me-2">
                            <i className="ti ti-arrow-badge-down-filled me-2 text-primary" />
                            Top
                          </p>
                          <h5>{currentStats.top}</h5>
                        </div>
                        <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-1">
                          <p className="mb-0 me-2">
                            <i className="ti ti-arrow-badge-down-filled me-2 text-warning" />
                            Average
                          </p>
                          <h5>{currentStats.average}</h5>
                        </div>
                        <div className="border border-dashed p-3 rounded d-flex align-items-center justify-content-between mb-0">
                          <p className="mb-0 me-2">
                            <i className="ti ti-arrow-badge-down-filled me-2 text-danger" />
                            Below Avg
                          </p>
                          <h5>{currentStats.below_avg}</h5>
                        </div>
                      </div>

                      <ReactApexChart
                        id="class-chart"
                        className="text-center text-md-left"
                        options={classDonutChart}
                        series={classDonutChart.series}
                        type="donut"
                        height={218}
                        width={218}
                      />
                    </div>
                  </div>
                </div>
                {/* /Class Wise Performance */}
              </div>
            </div>
            <div className="row">
              {/* Fees Collection */}
              <div className="col-xxl-8 col-xl-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-header  d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Fees Collection</h4>
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="bg-white dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-calendar  me-2" />
                        Last 8 Quater
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
                            Last 12 Quater
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Last 16 Quater
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body pb-0">
                    <ReactApexChart
                      id="fees-chart"
                      options={feesBar}
                      series={feesBar.series}
                      type="bar"
                      height={270}
                    />
                  </div>
                </div>
              </div>
              {/* /Fees Collection */}
              {/* Leave Requests */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Leave Requests</h4>
                    <div className="dropdown">
                      <button
                        className="btn btn-white dropdown-toggle d-flex align-items-center"
                        type="button"
                        id="leaveFilterDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-calendar-due me-1" />
                        {filterType === "today"
                          ? "Today"
                          : filterType === "thisWeek"
                          ? "This Week"
                          : "Last Week"}
                      </button>
                      <ul
                        className="dropdown-menu mt-2 p-2"
                        aria-labelledby="leaveFilterDropdown"
                      >
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={() => setFilterType("today")}
                          >
                            Today
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={() => setFilterType("thisWeek")}
                          >
                            This Week
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item rounded-1"
                            onClick={() => setFilterType("lastWeek")}
                          >
                            Last Week
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <div className="card mb-2">
                      {filteredLeaves
                        ? filteredLeaves
                            .filter((item) => item.role_id != 0)
                            .map((leave: any) => {
                              return (
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center overflow-hidden me-2">
                                      <Link
                                        to="#"
                                        className="avatar avatar-lg flex-shrink-0 me-2"
                                      >
                                        <img
                                          src={`${Imageurl}/${leave?.img}`}
                                          alt="student"
                                        />
                                      </Link>
                                      <div className="overflow-hidden">
                                        <h6 className="mb-1 text-truncate">
                                          <Link to="#">{leave?.user_name}</Link>
                                          <span className="badge badge-soft-danger ms-1">
                                            {leave?.leave_type}
                                          </span>
                                        </h6>
                                        <p className="text-truncate">
                                          {leave?.role_name}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Link
                                        to="#"
                                        className="avatar avatar-xs p-0 btn btn-success me-1"
                                        onClick={() =>
                                          handleApplyApproveRequest(leave?.id)
                                        }
                                      >
                                        <i className="ti ti-checks" />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="avatar avatar-xs p-0 btn btn-danger"
                                        onClick={() =>
                                          handleApplyRejectRequest(leave?.id)
                                        }
                                      >
                                        <i className="ti ti-x" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-between border-top pt-3">
                                    <p className="mb-0">
                                      Leave :{" "}
                                      <span className="fw-semibold">
                                        {[
                                          dayjs(leave?.from_date),
                                          dayjs(leave?.to_date),
                                        ]
                                          .sort((a: any, b: any) => a - b)
                                          .map((d) => d.format("D MMM"))
                                          .join("–")}
                                      </span>
                                    </p>
                                    <p>
                                      Apply on :{" "}
                                      <span className="fw-semibold">
                                        {" "}
                                        {dayjs(leave?.applied_on).format(
                                          "D MMM"
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                        : ""}
                    </div>
                    {/* <div className="card mb-0">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <Link
                              to="#"
                              className="avatar avatar-lg flex-shrink-0 me-2"
                            >
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-19.jpg"
                                alt="student"
                              />
                            </Link>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate ">
                                <Link to="#">Ramien</Link>
                                <span className="badge badge-soft-warning ms-1">
                                  Casual
                                </span>
                              </h6>
                              <p className="text-truncate">Accountant</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Link
                              to="#"
                              className="avatar avatar-xs p-0 btn btn-success me-1"
                            >
                              <i className="ti ti-checks" />
                            </Link>
                            <Link
                              to="#"
                              className="avatar avatar-xs p-0 btn btn-danger"
                            >
                              <i className="ti ti-x" />
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-top pt-3">
                          <p className="mb-0">
                            Leave :{" "}
                            <span className="fw-semibold">12 -13 May</span>
                          </p>
                          <p>
                            Apply on :{" "}
                            <span className="fw-semibold">11 May</span>
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* /Leave Requests */}
            </div>
            <div className="row">
              {/* Links */}
              <div className="col-xl-3 col-md-6 d-flex">
                <Link
                  to={routes.studentAttendance}
                  className="card bg-warning-transparent border border-5 border-white animate-card flex-fill"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-lg bg-warning rounded flex-shrink-0 me-2">
                          <i className="ti ti-calendar-share fs-24" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="fw-semibold text-default">
                            View Attendance
                          </h6>
                        </div>
                      </div>
                      <span className="btn btn-white warning-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                        <i className="ti ti-chevron-right fs-14" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* /Links */}
              {/* Links */}
              <div className="col-xl-3 col-md-6 d-flex">
                <Link
                  to={routes.events}
                  className="card bg-success-transparent border border-5 border-white animate-card flex-fill "
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-lg bg-success rounded flex-shrink-0 me-2">
                          <i className="ti ti-speakerphone fs-24" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="fw-semibold text-default">
                            New Events
                          </h6>
                        </div>
                      </div>
                      <span className="btn btn-white success-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                        <i className="ti ti-chevron-right fs-14" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* /Links */}
              {/* Links */}
              <div className="col-xl-3 col-md-6 d-flex">
                <Link
                  to={routes.membershipplan}
                  className="card bg-danger-transparent border border-5 border-white animate-card flex-fill"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-lg bg-danger rounded flex-shrink-0 me-2">
                          <i className="ti ti-sphere fs-24" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="fw-semibold text-default">
                            Membership Plans
                          </h6>
                        </div>
                      </div>
                      <span className="btn btn-white avatar avatar-sm p-0 flex-shrink-0 rounded-circle danger-btn-hover">
                        <i className="ti ti-chevron-right fs-14" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* /Links */}
              {/* Links */}
              <div className="col-xl-3 col-md-6 d-flex">
                <Link
                  to={routes.studentAttendance}
                  className="card bg-secondary-transparent border border-5 border-white animate-card flex-fill"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-lg bg-secondary rounded flex-shrink-0 me-2">
                          <i className="ti ti-moneybag fs-24" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="fw-semibold text-default">
                            Finance &amp; Accounts
                          </h6>
                        </div>
                      </div>
                      <span className="btn btn-white secondary-btn-hover avatar avatar-sm p-0 flex-shrink-0 rounded-circle">
                        <i className="ti ti-chevron-right fs-14" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* /Links */}
            </div>
            <div className="row">
              {/* Total Earnings */}
              <div className="col-xxl-4 col-xl-6 d-flex flex-column">
                <div className="card flex-fill">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="mb-1">Total Earnings</h6>
                        <h2>
                          ₹{allEarningData ? allEarningData?.total_earnings : 0}
                        </h2>
                      </div>
                      <span className="avatar avatar-lg bg-primary">
                        <i className="ti ti-user-dollar" />
                      </span>
                    </div>
                  </div>
                  {/* <div id="total-earning" /> */}
                  <ReactApexChart
                    id="total-earning"
                    options={totalEarningArea}
                    series={totalEarningArea.series}
                    type="area"
                    height={90}
                  />
                </div>
                <div className="card flex-fill">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="mb-1">Total Expenses</h6>
                        <h2>₹{allexpdata ? allexpdata?.total_expense : 0}</h2>
                      </div>
                      <span className="avatar avatar-lg bg-danger">
                        <i className="ti ti-user-dollar" />
                      </span>
                    </div>
                  </div>
                  <div id="total-expenses" />
                  <ReactApexChart
                    id="total-expenses"
                    options={totalExpenseArea}
                    series={totalExpenseArea.series}
                    type="area"
                    height={90}
                  />
                </div>
              </div>
              {/* /Total Earnings */}
              {/* Notice Board */}
              <div className="col-xxl-5 col-xl-12 order-3 order-xxl-2 d-flex">
                <div className="card flex-fill">
                  <div className="card-header  d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Notice Board</h4>
                    <Link to={routes.noticeBoard} className="fw-medium">
                      View All
                    </Link>
                  </div>
                  <div className="card-body">
                    <div className="notice-widget">
                      {allNotice
                        ? allNotice.map((notice: any) => {
                            return (
                              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
                                  {/* <span className="bg-primary-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                                    <i className="ti ti-books fs-16" />
                                  </span> */}
                                  <span className="bg-danger-transparent avatar avatar-md me-2 rounded-circle flex-shrink-0">
                                    <i className="ti ti-bell-check fs-16" />
                                  </span>
                                  <div className="overflow-hidden">
                                    <h6 className="text-truncate mb-1">
                                      {notice.title}
                                    </h6>
                                    <p>
                                      <i className="ti ti-calendar me-2" />
                                      Added on:{" "}
                                      {new Date(
                                        notice.addedOn
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <span className="badge bg-light text-dark">
                                  <i className="ti ti-clck me-1" />
                                  {notice?.days}
                                </span>
                              </div>
                            );
                          })
                        : ""}
                      {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
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
                        <span className="badge bg-light text-dark">
                          <i className="ti ti-clck me-1" />
                          15 Days
                        </span>
                      </div>
                      <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
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
                        <span className="badge bg-light text-dark">
                          <i className="ti ti-clck me-1" />
                          12 Days
                        </span>
                      </div>
                      <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
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
                        <span className="badge bg-light text-dark">
                          <i className="ti ti-clck me-1" />
                          02 Days
                        </span>
                      </div>
                      <div className="d-sm-flex align-items-center justify-content-between mb-0">
                        <div className="d-flex align-items-center overflow-hidden me-2 mb-2 mb-sm-0">
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
                        <span className="badge bg-light text-dark">
                          <i className="ti ti-clck me-1" />
                          06 Days
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* /Notice Board */}
              {/* Fees Collection */}
              <div className="col-xxl-3 col-xl-6 order-2 order-xxl-3 d-flex flex-column">
                <div className="card flex-fill mb-2">
                  <div className="card-body">
                    <p className="mb-2">Total Fees Collected</p>
                    <div className="d-flex align-items-end justify-content-between">
                      <h4>$25,000,02</h4>
                      <span className="badge badge-soft-success">
                        <i className="ti ti-chart-line me-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card flex-fill mb-2">
                  <div className="card-body">
                    <p className="mb-2">Fine Collected till date</p>
                    <div className="d-flex align-items-end justify-content-between">
                      <h4>$4,56,64</h4>
                      <span className="badge badge-soft-danger">
                        <i className="ti ti-chart-line me-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card flex-fill mb-2">
                  <div className="card-body">
                    <p className="mb-2">Student Not Paid</p>
                    <div className="d-flex align-items-end justify-content-between">
                      <h4>$545</h4>
                      <span className="badge badge-soft-info">
                        <i className="ti ti-chart-line me-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card flex-fill mb-4">
                  <div className="card-body">
                    <p className="mb-2">Total Outstanding</p>
                    <div className="d-flex align-items-end justify-content-between">
                      <h4>$4,56,64</h4>
                      <span className="badge badge-soft-danger">
                        <i className="ti ti-chart-line me-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Fees Collection */}
            </div>
            <div className="row">
              {/* Top Subjects */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-header  d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Top Subjects</h4>
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="bg-white dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-school-bell  me-2" />
                        Class II
                      </Link>
                      <ul className="dropdown-menu mt-2 p-3">
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Class I
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Class II
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Class III
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Class IV
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body">
                    <div
                      className="alert alert-success d-flex align-items-center mb-24"
                      role="alert"
                    >
                      <i className="ti ti-info-square-rounded me-2 fs-14" />
                      <div className="fs-14">
                        These Result are obtained from the syllabus completion
                        on the respective Class
                      </div>
                    </div>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Maths</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-primary rounded"
                                role="progressbar"
                                style={{ width: "20%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Physics</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-secondary rounded"
                                role="progressbar"
                                style={{ width: "30%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Chemistry</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-info rounded"
                                role="progressbar"
                                style={{ width: "40%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Botany</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-success rounded"
                                role="progressbar"
                                style={{ width: "50%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">English</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-warning rounded"
                                role="progressbar"
                                style={{ width: "70%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Spanish</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-danger rounded"
                                role="progressbar"
                                style={{ width: "80%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-sm-4">
                            <p className="text-dark">Japanese</p>
                          </div>
                          <div className="col-sm-8">
                            <div className="progress progress-xs flex-grow-1">
                              <div
                                className="progress-bar bg-primary rounded"
                                role="progressbar"
                                style={{ width: "85%" }}
                                aria-valuenow={30}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Top Subjects */}
              {/* Student Activity */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-header  d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Student Activity</h4>
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
                  <div className="card-body">
                    {players
                      ? players?.map((player: any) => {
                          return (
                            <div className="d-flex align-items-center overflow-hidden p-3 mb-3 border rounded">
                              <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                                <img
                                  src={`${Imageurl}/${player?.stu_img}`}
                                  alt="student"
                                />
                              </span>
                              <div className="overflow-hidden">
                                <h6 className="mb-1 text-truncate">
                                  {player?.name} Participated in{" "}
                                  {player?.sports}
                                </h6>
                                <p>This event took place in Our School</p>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                    {/* <div className="d-flex align-items-center overflow-hidden p-3 mb-3 border rounded">
                      <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/students/student-12.jpg"
                          alt="student"
                        />
                      </span>
                      <div className="overflow-hidden">
                        <h6 className="mb-1 text-truncate">
                          Participated in "Carrom"
                        </h6>
                        <p>Justin Lee participated in "Carrom"</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center overflow-hidden p-3 mb-3 border rounded">
                      <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/students/student-11.jpg"
                          alt="student"
                        />
                      </span>
                      <div className="overflow-hidden">
                        <h6 className="mb-1 text-truncate">
                          1st place in "100M”
                        </h6>
                        <p>This event took place in Our School</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center overflow-hidden p-3 mb-0 border rounded">
                      <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                        <ImageWithBasePath
                          src="assets/img/students/student-10.jpg"
                          alt="student"
                        />
                      </span>
                      <div className="overflow-hidden">
                        <h6 className="mb-1 text-truncate">
                          International conference
                        </h6>
                        <p className="text-truncate">
                          We attended international conference
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* /Student Activity */}
              {/* Todo */}
              <div className="col-xxl-4 col-xl-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header  d-flex align-items-center justify-content-between">
                    <h4 className="card-title">Todo</h4>
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="bg-white dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-calendar me-2" />
                        Today
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
                  <div className="card-body">
                    <ul className="list-group list-group-flush todo-list">
                      <li className="list-group-item py-3 px-0 pt-0">
                        <div className="d-sm-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center overflow-hidden me-2 todo-strike-content">
                            <div className="form-check form-check-md me-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultChecked
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                Send Reminder to Students
                              </h6>
                              <p>01:00 PM</p>
                            </div>
                          </div>
                          <span className="badge badge-soft-success mt-2 mt-sm-0">
                            Compeleted
                          </span>
                        </div>
                      </li>
                      <li className="list-group-item py-3 px-0">
                        <div className="d-sm-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <div className="form-check form-check-md me-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                Create Routine to new staff
                              </h6>
                              <p>04:50 PM</p>
                            </div>
                          </div>
                          <span className="badge badge-soft-skyblue mt-2 mt-sm-0">
                            Inprogress
                          </span>
                        </div>
                      </li>
                      <li className="list-group-item py-3 px-0">
                        <div className="d-sm-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <div className="form-check form-check-md me-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                Extra Class Info to Students
                              </h6>
                              <p>04:55 PM</p>
                            </div>
                          </div>
                          <span className="badge badge-soft-warning mt-2 mt-sm-0">
                            Yet to Start
                          </span>
                        </div>
                      </li>
                      <li className="list-group-item py-3 px-0">
                        <div className="d-sm-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <div className="form-check form-check-md me-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                Fees for Upcoming Academics
                              </h6>
                              <p>04:55 PM</p>
                            </div>
                          </div>
                          <span className="badge badge-soft-warning mt-2 mt-sm-0">
                            Yet to Start
                          </span>
                        </div>
                      </li>
                      <li className="list-group-item py-3 px-0 pb-0">
                        <div className="d-sm-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <div className="form-check form-check-md me-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                English - Essay on Visit
                              </h6>
                              <p>05:55 PM</p>
                            </div>
                          </div>
                          <span className="badge badge-soft-warning mt-2 mt-sm-0">
                            Yet to Start
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Todo */}
            </div>
          </>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AdminDashboardModal />
    </>
  );
};

export default AdminDashboard;
