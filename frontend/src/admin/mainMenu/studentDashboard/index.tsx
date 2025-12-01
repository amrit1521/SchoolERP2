import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CircleProgress from "./circleProgress";
import ReactApexChart from "react-apexcharts";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {
  examNameForOption,
  getAllNotice,
  getAllTodosForDashboard,
  getExamResult,
  getLeaveData,
  getSpecStudentAttendance,
  getSpecUpcommingEvents,
  getStuByToken,
  getStudentClassTeachersList,
  getStudentFeeReminder,
  getStudentHomework,
  Imageurl,
} from "../../../service/api";
import { toast } from "react-toastify";
import CommonSelect from "../../../core/common/commonSelect";
import { student_routes } from "../../router/student_routes";
import { getAllSubjectForStudent } from "../../../service/studentapi";
import { format, isToday, isYesterday } from "date-fns";

interface AllSubject {
  id: number;
  name: string;
  code: string;
  type: string;
  status: string;
}

const StudentDasboard = () => {
  const routes = all_routes;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${month}-${day}-${year}`;
  const defaultValue = dayjs(formattedDate);
  const [date, setDate] = useState<Nullable<Date>>(null);

  const [attendanceChart, setAttendanceChart] = useState<any>({
    chart: {
      height: 255,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },

    series: [],
    labels: ["Present", "Late", "Half Day", "Absent"],
    colors: ["#1ABE17", "#1170E4", "#E9EDF4", "#E82646"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
    },
  });
  const [performanceChart, setPerformanceChart] = useState<any>({
    chart: {
      type: "area",
      height: 355,
    },
    series: [
      {
        name: "Exam Percentage",
        data: [],
      },
      // {
      //   name: "Avg. Attendance",
      //   data: [85, 78, 75, 78, 85],
      // },
    ],
    xaxis: {
      categories: [],
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
        // Attendance: <span style="color: #00BFFF;">${series[1][dataPointIndex]}%</span>
        return `<div class="apexcharts-tooltip">${w.globals.labels[dataPointIndex]}<br>Exam Score: <span style="color: #1E90FF;">${series[0][dataPointIndex]}%</span><br></div>`;
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      yaxis: {
        axisTicks: {
          show: true,
          borderType: "solid",
          color: "#78909C",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
    },
    markers: {
      size: 5,
      colors: ["#1E90FF", "#00BFFF"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    colors: ["#3D5EE1", "#6FCCD8"], // Color for the lines
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
  });
  const [examResultChart, SetExamResultChart] = useState<any>({
    chart: {
      type: "bar",
      height: 310,
    },
    series: [
      {
        name: "Marks",
        data: [],
      },
    ],
    xaxis: {
      categories: [],
    },
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: "50%",
        colors: {
          backgroundBarColors: ["#E9EDF4", "#fff"],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 5,
        },
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#3D5EE1", "#3D5EE1", "#E9EDF4", "#E9EDF4", "#E9EDF4"], // Set specific colors for each bar
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "%";
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "14px",
        colors: ["#304758"],
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },

    legend: {
      show: false,
    },
  });
  function SampleNextArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-next class-slides"
        style={{ ...style, display: "flex", top: "-60px", right: "0" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-right" style={{ fontSize: "12px" }}></i>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-prev class-slides"
        style={{ ...style, display: "flex", top: "-60px", right: "30px" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-left" style={{ fontSize: "12px" }}></i>
      </div>
    );
  }
  const profile = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin: 24,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
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
  const [upCommingEvents, setUcommingEvents] = useState<any[]>([]);
  const [student, setStudent] = useState<any>({});
  const [studentAttendance, setStudentAttendance] = useState<any>();
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [allNotice, setAllNotice] = useState([]);
  const [studentHomeWork, setStudentHomeWork] = useState<any[]>([]);
  const [examOptions, setExamOptions] = useState<any[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<any>(null);
  const [examResult, setExamResult] = useState<any>(null);
  const [filteredExamResult, setFilteredExamResult] = useState<any>(null);
  const [feeReminder, setFeeReminder] = useState<any[]>([]);
  const [studentClassTeachers, setStudentClassTeachers] = useState<any[]>([]);
  const [allSubject, setAllSubject] = useState<AllSubject[]>([]);
  const [todos, setTodos] = useState<any[]>([])
  const fetchStudentAttendance = async (rollNo: number) => {
    try {
      const { data } = await getSpecStudentAttendance(rollNo);
      if (data.success) {
        setStudentAttendance(data.data[0]);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (studentAttendance) {
      setAttendanceChart((prevChart: any) => ({
        ...prevChart,
        series: [
          studentAttendance?.p || 0,
          studentAttendance?.l || 0,
          studentAttendance?.h || 0,
          studentAttendance?.a || 0,
        ],
      }));
    }
  }, [studentAttendance]);

  const fetchStudent = async (userId: number) => {
    try {
      const { data } = await getStuByToken(userId);
      if (data.success) {
        setStudent(data.student);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUpCommingEvents = async (roleId: number) => {
    try {
      const { data } = await getSpecUpcommingEvents(roleId);
      if (data.success) {
        setUcommingEvents(data?.result);
      }
    } catch (error) {
      console.log(error);
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
        setStudentHomeWork([]);
      }
    } catch (error) {
      console.error("Error fetching homework data:", error);
    }
  };
  const fetchExamResult = async (rollNum: number) => {
    if (!rollNum) return;

    try {
      const { data } = await getExamResult(rollNum);

      if (data?.success) {
        const studentData = data.data[0];
        const performanceResult = studentData?.exams.map((exam: any) => {
          return {
            exam_name: exam?.exam_name,
            percentage:
              (exam.subjects.reduce(
                (prev: number, sub: any) => prev + sub.mark_obtained,
                0
              ) /
                exam.subjects.reduce(
                  (prev: number, sub: any) => prev + sub.max_mark,
                  0
                )) *
              100,
          };
        });
        setPerformanceChart((prevChart: any) => ({
          ...prevChart,
          series: [
            {
              name: "Exam Percentage",
              data: [...performanceResult.map((item: any) => item.percentage)],
            },
          ],
          xaxis: {
            categories:
              performanceResult?.map((item: any) => item.exam_name) || [],
          },
        }));

        setExamResult(studentData);
        const selectedLabel =
          selectedExamType?.label ||
          (examOptions.length ? examOptions[0]?.label : null);

        const result = studentData?.exams?.filter(
          (exam: any) => exam?.exam_name === selectedLabel
        )[0];
        SetExamResultChart((prevChart: any) => ({
          ...prevChart,
          series: [
            {
              name: "Marks",
              data:
                result?.subjects?.map((sub: any) =>
                  sub?.max_mark
                    ? Math.round((sub.mark_obtained / sub.max_mark) * 100)
                    : 0
                ) || [],
            },
          ],
          xaxis: {
            categories:
              result?.subjects?.map((sub: any) => sub.subject_name) || [],
          },
        }));
        setFilteredExamResult(result || []);
      } else {
        console.warn("Failed to fetch exam result data");
        setExamResult([]);
        setFilteredExamResult([]);
      }
    } catch (error) {
      console.error("Error fetching exam result data:", error);
      setExamResult([]);
      setFilteredExamResult([]);
    }
  };

  const fetchExamOptions = async (cls: number, section: number) => {
    try {
      const { data } = await examNameForOption({ class: cls, section });
      if (data.success && Array.isArray(data.data)) {
        setExamOptions(
          data.data.map((e: any) => ({ value: e.id, label: e.examName }))
        );
      } else {
        setExamOptions([]);
        console.log("exam option not found");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
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

  const fetchStudentClassTeacherList = async (
    classId: number,
    sectionId: number
  ) => {
    try {
      const { data } = await getStudentClassTeachersList(classId, sectionId);
      if (data?.success) {
        setStudentClassTeachers(data.data);
      } else {
        console.warn("Failed to fetch class teacher data");
        setStudentClassTeachers([]);
      }
    } catch (error) {
      console.error("Error fetching class teacher data:", error);
    }
  };

  const fetchAllSubject = async (userId: any) => {
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await getAllSubjectForStudent(userId);
      if (data.success) {
        setAllSubject(
          data.data.map((sub: any) => ({
            code: sub.code,
            name: sub.name,
          }))
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchTodos = async () => {
    try {

      const { data } = await getAllTodosForDashboard()
      if (data.success) {
        setTodos(data.data)
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (examOptions) {
      fetchExamResult(student?.rollnum);
    }
  }, [examOptions]);

  useEffect(() => {
    if (selectedExamType) {
      const selectedLabel =
        selectedExamType?.label ||
        (examOptions.length ? examOptions[0]?.label : null);
      const result = examResult?.exams?.filter(
        (exam: any) => exam?.exam_name === selectedLabel
      )[0];
      setFilteredExamResult(result || []);
      SetExamResultChart((prevChart: any) => ({
        ...prevChart,
        series: [
          {
            name: "Marks",
            data:
              result?.subjects?.map((sub: any) =>
                sub?.max_mark
                  ? Math.round((sub.mark_obtained / sub.max_mark) * 100)
                  : 0
              ) || [],
          },
        ],
        xaxis: {
          categories:
            result?.subjects?.map((sub: any) => sub.subject_name) || [],
        },
      }));
    }
  }, [selectedExamType]);

  useEffect(() => {
    if (student) {
      (async () => {
        await fetchStudentAttendance(student?.rollnum);
        await fetchLeave(student?.rollnum);
        await fetchHomeWork(student?.class_id, student?.section_id);
        await fetchExamOptions(student?.class_id, student?.section_id);
        await fetchFeeReminder(student?.rollnum);
        await fetchStudentClassTeacherList(
          student?.class_id,
          student?.section_id
        );
      })();
      if (student?.user_id) {
        fetchAllSubject(student?.user_id);
      }
    }
  }, [student]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsetoken = JSON.parse(token);
      fetchStudent(parsetoken.id);
      fetchUpCommingEvents(parsetoken?.role);
    }
    fetchNotice();
    fetchTodos()
  }, []);

  const formatTime = (dateString: any) => {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(date.getTime() + istOffset);

    if (isToday(istTime)) return format(istTime, "hh:mm a");
    if (isYesterday(istTime)) return `Yesterday, ${format(istTime, "hh:mm a")}`;
    return format(istTime, "dd MMM, hh:mm a");
  };

  type StatusType = "Pending" | "Onhold" | "InProgress" | "Done";

  const statusColors: Record<StatusType, string> = {
    Pending: "badge-soft-warning",
    Onhold: "badge-soft-secondary",
    InProgress: "badge-soft-info",
    Done: "badge-soft-success",
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-xxl-8 d-flex">
              <div className="row flex-fill">
                {/* Profile */}
                <div className="col-xl-6 d-flex">
                  <div className="flex-fill">
                    <div className="card bg-dark position-relative">
                      <div className="card-body">
                        <div className="d-flex align-items-center row-gap-3 mb-3">
                          <div className="avatar avatar-xxl rounded flex-shrink-0 me-3">
                            <img
                              src={`${Imageurl}/${student.stu_img}`}
                              alt="Img"
                            />
                          </div>
                          <div className="d-block">
                            <span className="badge bg-transparent-primary text-primary mb-1">
                              {student.admissionnum}
                            </span>
                            <h3 className="text-truncate text-white mb-1">
                              {student.firstname} {student.lastname}
                            </h3>
                            <div className="d-flex align-items-center flex-wrap row-gap-2 text-gray-2">
                              <span className="border-end me-2 pe-2">
                                Class : {student.class}, {student.section}
                              </span>
                              <span>Roll No : {student.rollnum}</span>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between profile-footer flex-wrap row-gap-3 pt-4">
                          <div className="d-flex align-items-center">
                            <h6 className="text-white">1st Quarterly</h6>
                            <span className="badge bg-success d-inline-flex align-items-center ms-2">
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              Pass
                            </span>
                          </div>
                          <Link
                            to={`${routes.editStudent}/${student.rollnum}`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
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
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h4 className="card-title">Today’s Class</h4>
                        <div className="d-inline-flex align-items-center class-datepick">
                          <span className="icon">
                            <i className="ti ti-chevron-left me-2" />
                          </span>
                          {/* <input
                        type="text"
                        className="form-control datetimepicker border-0"
                        placeholder="16 May 2024"
                      /> */}
                          <DatePicker
                            className="form-control datetimepicker border-0"
                            format={{
                              format: "DD-MM-YYYY",
                              type: "mask",
                            }}
                            defaultValue={defaultValue}
                            placeholder="16 May 2024"
                          />
                          <span className="icon">
                            <i className="ti ti-chevron-right" />
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="card mb-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                            <div className="d-flex align-items-center flex-wrap mb-2">
                              <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                                <ImageWithBasePath
                                  src="assets/img/parents/parent-07.jpg"
                                  alt="Profile"
                                />
                              </span>
                              <div>
                                <h6 className="mb-1 text-decoration-line-through">
                                  English
                                </h6>
                                <span>
                                  <i className="ti ti-clock me-2" />
                                  09:00 - 09:45 AM
                                </span>
                              </div>
                            </div>
                            <span className="badge badge-soft-success shadow-none mb-2">
                              <i className="ti ti-circle-filled fs-8 me-1" />
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className="card mb-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                            <div className="d-flex align-items-center flex-wrap mb-2">
                              <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                                <ImageWithBasePath
                                  src="assets/img/parents/parent-02.jpg"
                                  alt="Profile"
                                />
                              </span>
                              <div>
                                <h6 className="mb-1 text-decoration-line-through">
                                  Chemistry
                                </h6>
                                <span>
                                  <i className="ti ti-clock me-2" />
                                  10:45 - 11:30 AM
                                </span>
                              </div>
                            </div>
                            <span className="badge badge-soft-success shadow-none mb-2">
                              <i className="ti ti-circle-filled fs-8 me-1" />
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className="card mb-0">
                          <div className="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
                            <div className="d-flex align-items-center flex-wrap mb-2">
                              <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-17.jpg"
                                  alt="Profile"
                                />
                              </span>
                              <div>
                                <h6 className="mb-1">Physics</h6>
                                <span>
                                  <i className="ti ti-clock me-2" />
                                  11:30 - 12:15 AM
                                </span>
                              </div>
                            </div>
                            <span className="badge badge-soft-warning shadow-none mb-2">
                              <i className="ti ti-circle-filled fs-8 me-1" />
                              Inprogress
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Profile */}
                {/* Attendance */}
                <div className="col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title">Attendance</h4>
                      {/* <div className="card-dropdown">
                        <Link
                          to="#"
                          className="dropdown-toggle p-2"
                          data-bs-toggle="dropdown"
                        >
                          <span>
                            <i className="ti ti-calendar-due" />
                          </span>
                          This Week
                        </Link>
                        <div className="dropdown-menu  dropdown-menu-end">
                          <ul>
                            <li>
                              <Link to="#">This Week</Link>
                            </li>
                            <li>
                              <Link to="#">Last Week</Link>
                            </li>
                            <li>
                              <Link to="#">Last Month</Link>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                    </div>
                    <div className="card-body">
                      <div className="attendance-chart">
                        <p className="mb-3">
                          <i className="ti ti-calendar-heart text-primary me-2" />
                          No of total working days{" "}
                          <span className="fw-medium text-dark">
                            {" "}
                            {studentAttendance?.totalWorkingDays}
                          </span>
                        </p>
                        <div className="border rounded p-3">
                          <div className="row">
                            <div className="col text-center border-end">
                              <p className="mb-1">Present</p>
                              <h5>{studentAttendance?.p}</h5>
                            </div>
                            <div className="col text-center border-end">
                              <p className="mb-1">Absent</p>
                              <h5>{studentAttendance?.a}</h5>
                            </div>
                            <div className="col text-center">
                              <p className="mb-1">Halfday</p>
                              <h5>{studentAttendance?.h}</h5>
                            </div>
                            <div className="col text-center">
                              <p className="mb-1">Late</p>
                              <h5>{studentAttendance?.l}</h5>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div id="attendance_chart" />
                          <ReactApexChart
                            id="attendance_chart"
                            options={attendanceChart}
                            series={attendanceChart.series}
                            type="donut"
                            height={255}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Attendance */}
                {/* Fees */}
                <div className="col-xl-12 d-flex">
                  <div className="row flex-fill">
                    <div className="col-sm-6 col-xl-3 d-flex">
                      <Link
                        to={`${student_routes.feePayments}`}
                        className="card border-0 border-bottom border-primary border-2 flex-fill animate-card"
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded bg-primary me-2">
                              <i className="ti ti-report-money fs-16" />
                            </span>
                            <h6>Pay Fees</h6>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-sm-6 col-xl-3 d-flex">
                      <Link
                        to={`${student_routes.examResult}`}
                        className="card border-0 border-bottom border-success flex-fill animate-card"
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded bg-success me-2">
                              <i className="ti ti-hexagonal-prism-plus fs-16" />
                            </span>
                            <h6>Exam Result</h6>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-sm-6 col-xl-3 d-flex">
                      <Link
                        to={`${student_routes.studentTimeTable}`}
                        className="card border-0 border-bottom border-warning flex-fill animate-card"
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded bg-warning me-2">
                              <i className="ti ti-calendar fs-16" />
                            </span>
                            <h6>Time Table</h6>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-sm-6 col-xl-3 d-flex">
                      <Link
                        to={`${student_routes.attendance}`}
                        className="card border-0 border-bottom border-dark border-2 flex-fill animate-card"
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <span className="avatar avatar-md rounded bg-dark me-2">
                              <i className="ti ti-calendar-share fs-16" />
                            </span>
                            <h6>Attendance</h6>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* /Fees */}
              </div>
            </div>
            {/* Schedules */}
            <div className="col-xxl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Schedules</h4>
                  <Link
                    to={routes.feesAssign}
                    className="link-primary fw-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body pb-0">
                  <Calendar
                    className="datepickers mb-2 custom-cal-react"
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    inline
                  />
                  <h5 className="mb-3">Upcoming Events</h5>
                  <div
                    className="p-3 pb-0 mb-3 border rounded event-scroll"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {upCommingEvents
                      ? upCommingEvents.map((event: any, index: number) => {
                        return (
                          <div
                            className="p-3 pb-0 mb-3 border rounded"
                            key={index}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="mb-3">{event?.title}</h5>
                              <span className="badge badge-soft-danger d-inline-flex align-items-center mb-3">
                                <i className="ti ti-clock me-1" />
                                {event?.days}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="mb-3">
                                <h6 className="mb-1">
                                  {event?.event_category}
                                </h6>
                                <p>
                                  <i className="ti ti-clock me-1" />
                                  {event?.event_time
                                    ?.split("|")
                                    .map((t: any) => {
                                      const [h, m] = t.split(":").map(Number);
                                      return `${(h % 12 || 12)
                                        .toString()
                                        .padStart(2, "0")}:${m
                                          .toString()
                                          .padStart(2, "0")}${h >= 12 ? "PM" : "AM"
                                        }`;
                                    })
                                    .join(" - ")}
                                </p>
                              </div>
                              <div className="mb-3 text-end">
                                <p className="mb-1">
                                  <i className="ti ti-calendar-bolt me-1" />
                                  {new Date(
                                    event?.event_date?.split("|")[0]
                                  ).toDateString()}{" "}
                                </p>
                                {/* <p className="text-primary">Room No : 15</p> */}
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : ""}
                  </div>
                  {/* <div className="p-3 pb-0 mb-3 border rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-3">2nd Quarterly</h5>
                      <span className="badge badge-soft-danger d-inline-flex align-items-center mb-3">
                        <i className="ti ti-clock me-1" />
                        20 Days More
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="mb-3">
                        <h6 className="mb-1">Physics</h6>
                        <p>
                          <i className="ti ti-clock me-1" />
                          01:30 - 02:15 PM
                        </p>
                      </div>
                      <div className="mb-3 text-end">
                        <p className="mb-1">
                          <i className="ti ti-calendar-bolt me-1" />
                          07 May 2024
                        </p>
                        <p className="text-primary">Room No : 15</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            {/* /Schedules */}
          </div>
          <div className="row">
            {/* Performance */}
            <div className="col-xxl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Performance</h4>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-calendar me-2" />
                      2024 - 2025
                    </Link>
                    <ul className="dropdown-menu mt-2 p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          2024 - 2025
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          2023 - 2024
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          2022 - 2023
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div id="performance_chart" />
                  <ReactApexChart
                    id="performance_chart"
                    options={performanceChart}
                    series={performanceChart.series}
                    type="area"
                    height={355}
                  />
                </div>
              </div>
            </div>
            {/* /Performance */}
            {/* Home Works */}
            <div className="col-xxl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-titile">Home Works</h4>
                  <div className="dropdown">
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
                  </div>
                </div>
                <div className="card-body py-1">
                  <ul className="list-group list-group-flush">
                    {studentHomeWork
                      ? studentHomeWork.map((homework: any, index: number) => {
                        return (
                          <li
                            className="list-group-item py-3 px-0 pb-0"
                            key={index}
                          >
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                              <div className="d-flex align-items-center overflow-hidden mb-3">
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
                                    {homework?.subject}
                                  </p>
                                  <h6 className="text-truncate mb-1">
                                    <Link to={routes.classHomeWork}>
                                      {homework?.description}
                                    </Link>
                                  </h6>
                                  <div className="d-flex align-items-center flex-wrap">
                                    <div className="d-flex align-items-center border-end me-1 pe-1">
                                      <Link
                                        to={routes.teacherDetails}
                                        className="avatar avatar-xs flex-shrink-0 me-2"
                                      >
                                        <img
                                          src={`${Imageurl}/${homework?.img_src}`}
                                          className="rounded-circle"
                                          alt="teacher"
                                        />
                                      </Link>
                                      <p className="text-dark">
                                        {homework?.firstname}
                                        {homework?.lastname}
                                      </p>
                                    </div>
                                    <p>
                                      Due by :{" "}
                                      {dayjs(homework?.submissionDate).format(
                                        "D MMM YYYY"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <CircleProgress value={80} />
                            </div>
                          </li>
                        );
                      })
                      : ""}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Home Works */}
          </div>
          <div className="row">
            {/* Class Faculties */}
            <div className="col-xl-12">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Class Faculties</h4>
                  <div className="owl-nav slide-nav text-end nav-control" />
                </div>
                <div className="card-body">
                  <Slider {...profile} className="teachers-profile-slider">
                    <div className="card bg-light-100 mb-0">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to={routes.teacherDetails}
                            className="avatar avatar-lg rounded me-2"
                          >
                            <img
                              src="assets/img/teachers/teacher-01.jpg"
                              alt="Teacher"
                            />
                          </Link>

                          <div className="overflow-hidden">
                            <h6 className="mb-1 text-truncate">
                              <Link to={routes.teacherDetails}>
                                Rohit Singh
                              </Link>
                            </h6>
                            <p>Maths</p>
                          </div>
                        </div>

                        <div className="row gx-2">
                          <div className="col-6">
                            <button className="btn btn-outline-light bg-white w-100 fw-semibold fs-12">
                              <i className="ti ti-mail me-2" />
                              Email
                            </button>
                          </div>
                          <div className="col-6">
                            <button className="btn btn-outline-light bg-white w-100 fw-semibold fs-12">
                              <i className="ti ti-message-chatbot me-2" />
                              Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {studentClassTeachers?.map((clsTeacher: any, i: number) => (
                      <div className="card bg-light-100 mb-0" key={i}>
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <Link
                              to={routes.teacherDetails}
                              className="avatar avatar-lg rounded me-2"
                            >
                              <img
                                src={`${Imageurl}/${clsTeacher?.img_src}`}
                                alt="Teacher"
                              />
                            </Link>

                            <div className="overflow-hidden">
                              <h6 className="mb-1 text-truncate">
                                <Link to={routes.teacherDetails}>
                                  {clsTeacher?.firstname} {clsTeacher?.lastname}
                                </Link>
                              </h6>
                              <p>{clsTeacher?.subject}</p>
                            </div>
                          </div>

                          <div className="row gx-2">
                            <div className="col-6">
                              <button className="btn btn-outline-light bg-white w-100 fw-semibold fs-12">
                                <i className="ti ti-mail me-2" />
                                Email
                              </button>
                            </div>
                            <div className="col-6">
                              <button className="btn btn-outline-light bg-white w-100 fw-semibold fs-12">
                                <i className="ti ti-message-chatbot me-2" />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
            {/* /Class Faculties */}
          </div>
          <div className="row">
            {/* Leave Status */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Leave Status</h4>
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
                <div
                  className="card-body"
                  style={{ maxHeight: "450px", overflowY: "auto" }}
                >
                  {leaveData
                    ? leaveData?.map((leave: any, index: number) => {
                      return (
                        <div
                          className="bg-light-300 d-sm-flex align-items-center justify-content-between p-3 mb-3"
                          key={index}
                        >
                          <div className="d-flex align-items-center mb-2 mb-sm-0">
                            <div className="avatar avatar-lg bg-danger-transparent flex-shrink-0 me-2">
                              <i className="ti ti-medical-cross" />
                            </div>
                            <div>
                              <h6 className="mb-1">{leave?.leave_type}</h6>
                              <p>
                                Date :{" "}
                                {dayjs(leave?.applied_on).format(
                                  "D MMM YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                          {leave?.status ? (
                            <span className="badge bg-skyblue d-inline-flex align-items-center">
                              <i className="ti ti-circle-filled fs-5 me-1" />{" "}
                              Approved
                            </span>
                          ) : (
                            <span className="badge bg-danger d-inline-flex align-items-center">
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              Declined
                            </span>
                          )}
                        </div>
                      );
                    })
                    : []}
                </div>
              </div>
            </div>
            {/* /Leave Status */}
            {/* Exam Result */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Exam Result</h4>
                  <div className="dropdown">
                    <CommonSelect
                      className="select Exam"
                      options={examOptions}
                      value={selectedExamType?.value}
                      defaultValue={examOptions ? examOptions[0]?.value : null}
                      onChange={(opt: any) => setSelectedExamType(opt)}
                    />
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center flex-wrap">
                    {filteredExamResult
                      ? filteredExamResult?.subjects?.map(
                        (sub: any, i: number) => {
                          return (
                            <span
                              className="badge badge-soft-primary badge-md me-1 mb-3"
                              key={i}
                            >
                              {sub?.subject_name} : {sub?.mark_obtained}{" "}
                            </span>
                          );
                        }
                      )
                      : ""}
                  </div>
                  <ReactApexChart
                    id="exam-result-chart"
                    options={examResultChart}
                    series={examResultChart.series}
                    type="bar"
                    height={310}
                  />
                </div>
              </div>
            </div>
            {/* /Exam Result */}
            {/* Fees Reminder */}
            <div className="col-xxl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-titile">Fees Reminder</h4>
                  <Link
                    to={student_routes.feeReminder}
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
                    ? feeReminder.map((reminder: any, index: number) => {
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
                                {reminder?.fee_type}
                              </h6>
                              <p>{reminder?.AmountPay}</p>
                            </div>
                          </div>
                          <div className="text-end">
                            <h6 className="mb-1">Last Date</h6>
                            <p>
                              {dayjs(reminder?.collectionDate).format(
                                "D MMM YYYY"
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </div>
              </div>
            </div>
            {/* Fees Reminder */}
          </div>
          <div className="row">
            {/* Notice Board */}
            <div className="col-xxl-4 col-xl-6 d-flex">
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
                      ? allNotice.map((notice: any, i: number) => {
                        return (
                          <div
                            className="d-sm-flex align-items-center justify-content-between mb-4"
                            key={i}
                          >
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
                  </div>
                </div>
              </div>
            </div>
            {/* /Notice Board */}
            {/* Syllabus */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header  d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Syllabus</h4>
                </div>
                <div className="card-body">
                  <div
                    className="alert alert-success d-flex align-items-center mb-24"
                    role="alert"
                  >
                    <i className="ti ti-info-square-rounded me-2 fs-14" />
                    <div className="fs-14">
                      These Result are obtained from the syllabus completion on
                      the respective Class
                    </div>
                  </div>
                  <ul className="list-group">
                    {allSubject
                      ? allSubject.map((sub: any, index: number) => (
                        <li className="list-group-item" key={index}>
                          <div className="row align-items-center">
                            <div className="col-sm-4">
                              <p className="text-dark">
                                {sub.name}({sub.code})
                              </p>
                            </div>
                            <div className="col-sm-8">
                              <div className="progress progress-xs flex-grow-1">
                                <div
                                  className="progress-bar bg-primary rounded"
                                  role="progressbar"
                                  style={{ width: `${20 * (index + 1)}%` }}
                                  aria-valuenow={30}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                      : null}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Syllabus */}
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
                    {
                      todos && todos.length > 0 ? (todos.map((t) => (
                        <li className="list-group-item py-3 px-0 pt-0">
                          <div className="d-sm-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center overflow-hidden me-2 ">
                              {/* <div className="form-check form-check-md me-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked
                                  />
                                </div> */}
                              <div className="overflow-hidden">
                                <h6 className="mb-1 text-truncate">
                                  {t.title}
                                </h6>
                                {
                                  t.is_important === 1 && (<span>
                                    <i className="fas fa-star text-warning" />
                                  </span>)
                                }



                                <p>{formatTime(t.created_at)}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-1">
                              <div className={`badge ${t.assignee === 'all_teachers' ? "badge-soft-warning" : "badge-soft-danger"}`}>
                                {t.assignee === 'all_teachers' ? 'Teachers' : 'Staffs'}
                              </div>
                              <div
                                className={`badge ${statusColors[t.status as keyof typeof statusColors]} mt-2 mt-sm-0`}
                              >
                                {t.status}
                              </div>

                            </div>

                          </div>
                        </li>))) : (<>No todos</>)
                    }
                  </ul>
                </div>
              </div>
            </div>
            {/* /Todo */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default StudentDasboard;
