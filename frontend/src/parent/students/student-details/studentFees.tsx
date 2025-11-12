import { Link, useParams } from "react-router-dom";
// import { all_routes } from "../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import { useEffect, useState } from "react";
import {
  getFeesDetailsSpecStudent,
  specificStudentData1,
} from "../../../service/api";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import { parent_routes } from "../../../admin/router/parent_routes";

const PStudentFees = () => {
  // const routes = all_routes;
  const { rollnum } = useParams<{ rollnum: string }>();

  const [student, setStudent] = useState<any>({});
  const [feesInfo, setFeesInfo] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const fetchStudent = async (rollnum: number) => {
    try {
      const res = await specificStudentData1(rollnum);

      if (res?.data?.success) {
        setStudent(res.data.student);
        return res.data.student;
      } else {
        console.warn("Failed to fetch student data");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching student data:", error);
      return null;
    }
  };

  const fetchFees = async (rollnum: number) => {
    try {
      const res = await getFeesDetailsSpecStudent(rollnum);
      // console.log(res.data)
      if (res?.data?.success) {
        setFeesInfo(res.data.feesdata);
      } else {
        console.warn("Failed to fetch leave data");
        setFeesInfo([]);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setFeesInfo([]);
    }
  };

  const fetchStudentAndFees = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const studentData = await fetchStudent(Number(rollnum));

      if (studentData?.rollnum) {
        await fetchFees(Number(studentData.rollnum));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (rollnum) {
      fetchStudentAndFees();
    }
  }, [rollnum]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {token && (
              <StudentBreadcrumb token={token} rollnum={Number(rollnum)} />
            )}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            <StudentSidebar student={student} loading={loading} />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link
                        to={`${parent_routes.childDetails}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-school me-2" />
                        Child Details
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${parent_routes.childTimeTable}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-table-options me-2" />
                        Time Table
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${parent_routes.childLeaves}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${parent_routes.childFees}/${rollnum}`}
                        className="nav-link active"
                      >
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${parent_routes.childResult}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${parent_routes.childLibrary}/${rollnum}`}
                        className="nav-link"
                      >
                        <i className="ti ti-books me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Fees</h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
                          <Link
                            to=""
                            className="btn btn-outline-light bg-white dropdown-toggle"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="ti ti-calendar-due me-2" />
                            Year : 2024 / 2025
                          </Link>
                          <ul className="dropdown-menu p-3">
                            <li>
                              <Link to="" className="dropdown-item rounded-1">
                                Year : 2024 / 2025
                              </Link>
                            </li>
                            <li>
                              <Link to="" className="dropdown-item rounded-1">
                                Year : 2023 / 2024
                              </Link>
                            </li>
                            <li>
                              <Link to="" className="dropdown-item rounded-1">
                                Year : 2022 / 2023
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-0 py-3">
                      {/* Fees List */}
                      <div className="custom-datatable-filter table-responsive">
                        <table className="table datatable">
                          <thead className="thead-light">
                            <tr>
                              <th>Fees Group</th>
                              <th>Fees Code</th>
                              <th>Due Date</th>
                              <th>Total Amount</th>
                              <th>Paid Amount</th>
                              <th>Status</th>
                              <th>Ref ID</th>
                              <th>Mode</th>
                              <th>Date Paid</th>
                              <th>Discount</th>
                              <th>Fine</th>
                            </tr>
                          </thead>

                          <tbody>
                            {loading ? (
                              // 🔹 Show 5 skeleton rows
                              [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 80 }}
                                    />
                                    <div>
                                      <Skeleton.Input
                                        active
                                        size="small"
                                        style={{ width: 60, marginTop: 5 }}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 100 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 120 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 70 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Button
                                      active
                                      size="small"
                                      style={{ width: 80 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 100 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 80 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 120 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 60 }}
                                    />
                                  </td>
                                  <td>
                                    <Skeleton.Input
                                      active
                                      size="small"
                                      style={{ width: 60 }}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : feesInfo.length > 0 ? (
                              // 🔹 Actual rows
                              feesInfo.map((fee: any) => (
                                <tr key={fee.id}>
                                  <td>
                                    <p className="text-primary">
                                      {fee.class}-{fee.section}
                                      <span className="d-block">
                                        ({fee.feesGroup})
                                      </span>
                                    </p>
                                  </td>
                                  <td>{fee.feesType}</td>
                                  {/* <td>{new Date(fee.assigned_date).toLocaleDateString()}</td> */}
                                  <td>
                                    {dayjs(fee.dueDate).format("DD MMM YYYY")}
                                  </td>
                                  <td>{fee.totalAmount || "-"}</td>
                                  <td>{fee.AmountPay || "-"}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        fee.status === "1"
                                          ? "badge-soft-success"
                                          : "badge-soft-danger"
                                      } d-inline-flex align-items-center`}
                                    >
                                      <i className="ti ti-circle-filled fs-5 me-1" />
                                      {fee.status === "1" ? "Paid" : "Unpaid"}
                                    </span>
                                  </td>
                                  <td>{fee.paymentRefno || "-"}</td>
                                  <td>{fee.mode || "-"}</td>
                                  <td>
                                    {fee.collectionDate
                                      ? dayjs(fee.collectionDate).format(
                                          "DD MMM YYYY"
                                        )
                                      : "-"}
                                  </td>
                                  <td>{fee.discount || "0"}%</td>
                                  <td>{fee.fine || "0"}</td>
                                </tr>
                              ))
                            ) : (
                              // 🔹 Empty state
                              <tr>
                                <td colSpan={10} className="text-center">
                                  Not found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* /Fees List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {student.rollnum && (
        <StudentModals
          onAdd={fetchStudentAndFees}
          rollnum={Number(student.rollnum)}
        />
      )}
    </>
  );
};

export default PStudentFees;
