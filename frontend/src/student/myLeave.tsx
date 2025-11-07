import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
// import StudentModals from "../admin/peoples/students/studentModals";
import Table from "../core/common/dataTable/index";
import type { TableData } from "../core/data/interface";
// import { leaveData } from "../../../../core/data/json/leaveData";
// import { Attendance } from "../../../../core/data/json/attendance";
import { useEffect, useState } from "react";
import { getLeaveData } from "../service/api";
import dayjs from "dayjs";
import { Skeleton } from "antd";
import TooltipOption from "../core/common/tooltipOption";
import { getStudentLeaveData } from "../service/studentapi";

const MyLeaves = () => {
  const routes = all_routes;
  // const data = leaveData;
  // const data2 = Attendance;

  interface LeaveInform {
    id: number;
    name: string;
    total_allowed: number;
    used: number;
    avilable: number;
  }

  // const { rollnum } = useParams<{ rollnum: string }>();
  // const [student, setStudent] = useState<any>({});
  const [leaveInform, setLeaveInform] = useState<LeaveInform[]>([]);
  const [leaveDataa, setLeaveDataa] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;

  // const fetchStudent = async (rollnum: number) => {
  //   try {
  //     const res = await specificStudentData1(rollnum);

  //     if (res?.data?.success) {
  //       setStudent(res.data.student);
  //       return res.data.student;
  //     } else {
  //       console.warn("Failed to fetch student data");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     return null;
  //   }
  // };

  const fetchLeave = async (userId: number) => {
    try {
      const res = await getStudentLeaveData(userId);

      if (res?.data?.success) {
        setLeaveInform(res.data.leave_inform);
        setLeaveDataa(res.data.stuAllLeave);
      } else {
        console.warn("Failed to fetch leave data");
        setLeaveDataa([]);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLeaveDataa([]);
    }
  };

  const fetchStudentAndLeave = async (userId: number) => {
    setLoading(true);
    try {
      // await new Promise((res) => setTimeout(res, 200));
      // const studentData = await fetchStudent(Number(rollnum));

      // if (studentData?.rollnum) {
      //   await fetchLeave(Number(studentData.rollnum));
      // } Number(studentData.rollnum)
      await fetchLeave(userId);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStudentAndLeave(userId);
    }
  }, [userId]);

  // const handleAdd = () => {
  //   fetchStudentAndLeave(userId);
  // };

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

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Leaves</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.studentDashboard}>Student Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leaves
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#apply_leave"
                >
                  <i className="ti ti-calendar-event me-2" />
                  Apply Leave
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {/* /Student Information */}
            <div className="col-xxl-12 col-xl-12">
              <div className="row">
                <div className="col-md-12">
                  {/* Leave Nav*/}
                  {/* /Leave Nav*/}
                  <div className="tab-content">
                    {/* Leave */}
                    <div className="tab-pane fade show active" id="leave">
                      <div className="row gx-3">
                        {loading
                          ? Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className="col-lg-6 col-xxl-3 d-flex"
                              >
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2">
                                      <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: 150 }}
                                      />
                                    </h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <span className="pe-2 me-2 mb-0 d-inline-block">
                                        <Skeleton.Input
                                          active
                                          size="small"
                                          style={{ width: 80 }}
                                        />
                                      </span>
                                      <span className="mb-0 d-inline-block">
                                        <Skeleton.Input
                                          active
                                          size="small"
                                          style={{ width: 100 }}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : leaveInform &&
                            leaveInform.map((item) => (
                              <div
                                key={item.id}
                                className="col-lg-6 col-xxl-3 d-flex"
                              >
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2 text-capitalize">{`${item.name} (${item.total_allowed})`}</h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <p className="border-end pe-2 me-2 mb-0">
                                        Used : {item.used}
                                      </p>
                                      <p className="mb-0">
                                        Available : {item.avilable}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                      <div className="card">
                        {/* Leaves List */}
                        <div className="card-body p-0 py-3">
                          {loading ? (
                            <div
                              className="d-flex justify-content-center align-items-center"
                              style={{ height: "200px" }}
                            >
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <Table
                              dataSource={tableData}
                              columns={columns}
                              Selection={false}
                            />
                          )}
                        </div>
                        {/* /Leaves List */}
                      </div>
                    </div>
                    {/* /Leave */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* {student.rollnum && (
        <StudentModals onAdd={handleAdd} rollnum={Number(student.rollnum)} />
      )} */}
    </>
  );
};

export default MyLeaves;
