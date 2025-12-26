import { useEffect, useRef, useState } from "react";
// import { all_routes } from "../router/all_routes";
import { Link, useParams } from "react-router-dom";
// import PredefinedDateRanges from "../core/common/datePicker";
// import CommonSelect from "../core/common/commonSelect";
// import {
//   AdmissionNo,
//   allClass,
//   allSection,
//   amount,
//   DueDate,
//   names,
//   rollno,
// } from "../core/common/selectoption/selectoption";
// import type { TableData } from "../core/data/interface";
// import Table from "../core/common/dataTable/index";
import TooltipOption from "../core/common/tooltipOption";
// import { getFeesCollectionDet, Imageurl } from "../service/api";
// import { toast } from "react-toastify";
import dayjs from "dayjs";
// import StudentModals from "../admin/peoples/students/studentModals";

//student fee payment imports
// import { specificStudentData1 } from "../service/api";
import { Skeleton } from "antd";
// import { getFeeDetailsOfSpecStudent } from "../service/studentapi";
import { getAllChildFeeDetails } from "../service/parentDashboardApi";
import CommonSelect from "../core/common/commonSelect";
import { parent_routes } from "../router/parent_routes";

// import FileSaver from "file-saver";
// import {
//   TableCell,
//   Paragraph,
//   TableRow,
//   Document,
//   Packer,
//   Table as DocxTable,
//   TextRun
// } from 'docx'

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

const PFeesPayments = () => {
  // const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // types/StudentFeesRecord.ts

  //   interface FeesCollectionDet {
  //     id: number;
  //     admNo: string;
  //     student_rollnum: string;
  //     collectionDate: string;
  //     status: "0" | "1";
  //     dueDate: string;
  //     totalAmount: string;
  //     class: string;
  //     section: string;
  //     stu_img: string;
  //     stu_id: number;
  //     firstname: string;
  //     lastname: string;
  //   }

  //   const [feesCollection, setFeesCollection] = useState<FeesCollectionDet[]>([{
  //     id: 0,
  //     admNo: "",
  //     student_rollnum: "",
  //     collectionDate: "",
  //     status: "0",
  //     dueDate: "",
  //     totalAmount: "",
  //     class: "",
  //     section: "",
  //     stu_img: "",
  //     stu_id: 0,
  //     firstname: "",
  //     lastname: "",
  //   }]);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [rollnum , setRollnum] = useState<number|null>(null)

  //   const fetchFeesCollectionDet = async () => {
  //     setLoading(true);
  //     try {
  //       const { data } = await getFeesCollectionDet();

  //       if (data.success) {
  //         setFeesCollection(data.feesdata);
  //       }
  //     } catch (error: any) {
  //       console.log(error);
  //       toast.error(error.response?.data?.message || "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchFeesCollectionDet();
  //   }, []);

  //   useEffect(() => {
  //     fetchFeesCollectionDet()
  //   }, []);

  const { rollnum } = useParams<{ rollnum: string }>();

  //   const [student, setStudent] = useState<any>({});
  const [feesInfo, setFeesInfo] = useState<any>([]);
  const [allChildFeeInfo, setAllChildFeeInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;
  const [studentOption, setStudentOptions] = useState<any[]>([]);
  const [filter, setFilter] = useState<{
    studentId: number | null;
    studentName: string | null;
  }>({
    studentId: null,
    studentName: null,
  });

  //   const fetchStudent = async (rollnum: number) => {
  //     try {
  //       const res = await specificStudentData1(rollnum);

  //       if (res?.data?.success) {
  //         setStudent(res.data.student);
  //         return res.data.student;
  //       } else {
  //         console.warn("Failed to fetch student data");
  //         return null;
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching student data:", error);
  //       return null;
  //     }
  //   };

  const fetchFees = async (userId: number) => {
    if (userId) {
      try {
        console.log("object", userId);
        const { data } = await getAllChildFeeDetails(userId);
        // console.log(res.data)
        if (data?.success) {
          console.log("fee data : ", data);
          setAllChildFeeInfo(data.feesdata);
          setStudentOptions(
            data.feesdata.map((item: any) => ({
              value: item?.student_id,
              label: item?.student_name,
            }))
          );
          setFeesInfo(data.feesdata[0]?.feesdata);
        } else {
          console.warn("Failed to fetch leave data");
          setFeesInfo([]);
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setFeesInfo([]);
      }
    }
  };

  const fetchStudentAndFees = async (userId: number) => {
    setLoading(true);
    try {
      //   const studentData = rollnum ? await fetchStudent(Number(rollnum)) : null;
      //    Number(studentData?.rollnum) ??
      if (userId) {
        await fetchFees(userId);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rollnum || userId) {
      console.log("runnign", userId);
      fetchStudentAndFees(userId);
    }
  }, []);

  const handleApplyClick = () => {
    if (filter?.studentId) {
      setFeesInfo(
        allChildFeeInfo.filter(
          (feeInfo: any) => feeInfo?.student_id === filter?.studentId
        )[0]?.feesdata
      );
    }
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  //   const tableData = feesCollection.map((item) => ({
  //     key: item.id,
  //     id: item.id,
  //     admNo: item.admNo,
  //     rollNo: item.student_rollnum,
  //     student: `${item.firstname} ${item.lastname}`,
  //     studentImage: item.stu_img,
  //     class: item.class,
  //     section: item.section,
  //     amount: item.totalAmount,
  //     lastDate: item.dueDate,
  //     status: item.status === "1" ? "Paid" : "Unpaid",
  //   }));

  //   const columns = [
  //     {
  //       title: "Adm No",
  //       dataIndex: "admNo",
  //       render: (text: string) => (
  //         <Link to="#" className="link-primary">
  //           {text}
  //         </Link>
  //       ),
  //       sorter: (a: TableData, b: TableData) => a.admNo.length - b.admNo.length,
  //     },
  //     {
  //       title: "Roll No",
  //       dataIndex: "rollNo",
  //       sorter: (a: TableData, b: TableData) => a.rollNo- b.rollNo,
  //     },
  //     {
  //       title: "Student",
  //       dataIndex: "student",
  //       render: (text: string, record: any) => (
  //         <div className="d-flex align-items-center">
  //           <Link to={`${routes.studentDetail}/${record.rollNo}`} className="avatar avatar-md">
  //             <img
  //               src={`${Imageurl}/${record.studentImage}`}
  //               className="img-fluid rounded-circle"
  //               alt="img"
  //             />
  //           </Link>
  //           <div className="ms-2">
  //             <p className="text-dark mb-0">
  //               <Link to={`${routes.studentDetail}/${record.rollNo}`}>{text}</Link>
  //             </p>
  //             <span className="fs-12">{`${record.class}-${record.section}`}</span>
  //           </div>
  //         </div>
  //       ),
  //       sorter: (a: TableData, b: TableData) =>
  //         a.student.length - b.student.length,
  //     },
  //     {
  //       title: "Class",
  //       dataIndex: "class",
  //       sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
  //     },
  //     {
  //       title: "Section",
  //       dataIndex: "section",
  //       sorter: (a: TableData, b: TableData) =>
  //         a.section.length - b.section.length,
  //     },
  //     {
  //       title: "Amount",
  //       dataIndex: "amount",
  //       sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
  //     },

  //     {
  //       title: "Last Date",
  //       dataIndex: "lastDate",
  //       render:(text:string)=>(
  //         <span >{dayjs(text).format('DD MMM YYYY')}</span>
  //       ),
  //       sorter: (a: TableData, b: TableData) =>
  //         a.lastDate.length - b.lastDate.length,
  //     },

  //     {
  //       title: "Status",
  //       dataIndex: "status",
  //       render: (text: string) => (
  //         <>
  //           {text === "Paid" ? (
  //             <span className="badge badge-soft-success d-inline-flex align-items-center">
  //               <i className="ti ti-circle-filled fs-5 me-1"></i>
  //               {text}
  //             </span>
  //           ) : (
  //             <span className="badge badge-soft-danger d-inline-flex align-items-center">
  //               <i className="ti ti-circle-filled fs-5 me-1"></i>
  //               {text}
  //             </span>
  //           )}
  //         </>
  //       ),
  //       sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
  //     },
  //     {
  //       title: "Action",
  //       dataIndex: "status",
  //       render: (text: string, record: any) => (
  //         <>
  //           {text === "Paid" ? (
  //             <Link to={`${routes.studentFees}/${record.rollNo}`} className="btn btn-light">
  //               View Details
  //             </Link>
  //           ) : (
  //             <button
  //                onClick={()=>setRollnum(record.rollNo)}
  //               className="btn btn-light"
  //               data-bs-toggle="modal"
  //               data-bs-target="#add_fees_collect"
  //             >
  //               Collect Fees
  //             </button>
  //           )}
  //         </>
  //       ),
  //     },
  //   ];
  // ======================
  // Export to Word (.docx)
  // ======================
  // const exportToWord = () => {
  //   const rows = tableData.map(
  //     (item) =>
  //       new TableRow({
  //         children: [
  //           new TableCell({ children: [new Paragraph(item.admNo)] }),
  //           new TableCell({ children: [new Paragraph(item.rollNo)] }),
  //           new TableCell({ children: [new Paragraph(item.student)] }),
  //           new TableCell({ children: [new Paragraph(item.class)] }),
  //           new TableCell({ children: [new Paragraph(item.section)] }),
  //           new TableCell({ children: [new Paragraph(item.amount)] }),
  //           new TableCell({ children: [new Paragraph(item.lastDate)] }),
  //           new TableCell({ children: [new Paragraph(item.status)] }),
  //         ],
  //       })
  //   );

  //   const doc = new Document({
  //     sections: [

  //       {

  //         children: [
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "Fees Collection Report",
  //                 bold: true,
  //                 size: 28,
  //               }),
  //             ],
  //           }),
  //           new DocxTable({
  //             rows: [
  //               new TableRow({
  //                 children: [
  //                   new TableCell({ children: [new Paragraph("Adm No")] }),
  //                   new TableCell({ children: [new Paragraph("Roll No")] }),
  //                   new TableCell({ children: [new Paragraph("Student")] }),
  //                   new TableCell({ children: [new Paragraph("Class")] }),
  //                   new TableCell({ children: [new Paragraph("Section")] }),
  //                   new TableCell({ children: [new Paragraph("Amount")] }),
  //                   new TableCell({ children: [new Paragraph("Last Date")] }),
  //                   new TableCell({ children: [new Paragraph("Status")] }),
  //                 ],
  //               }),
  //               ...rows,
  //             ],
  //           }),
  //         ],
  //       },
  //     ],
  //   });

  //   Packer.toBlob(doc).then((blob: any) => {
  //     FileSaver.saveAs(blob, "FeesCollection.docx");
  //   });
  // };

  // ======================
  // Export to PDF
  // ======================
  // const exportToPDF = () => {
  //   const doc = new jsPDF();

  //   // Title
  //   doc.setFontSize(18);
  //   doc.text("Fees Collection Report", 14, 20);

  //   // Table headers
  //   const headers = [
  //     ["Adm No", "Roll No", "Student", "Class", "Section", "Amount", "Last Date", "Status"]
  //   ];

  //   // Table rows from your data
  //   const rows = tableData.map((item) => [
  //     item.admNo,
  //     item.rollNo,
  //     item.student,
  //     item.class,
  //     item.section,
  //     item.amount,
  //     item.lastDate,
  //     item.status,
  //   ]);

  //   // AutoTable
  //   autoTable(doc, {
  //     head: headers,
  //     body: rows,
  //     startY: 30,
  //     styles: { fontSize: 10 },
  //     headStyles: { fillColor: [22, 160, 133] }, // green header
  //   });

  //   // Save

  //   doc.save("FeesCollection.pdf");
  // };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Payments</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={parent_routes.parentDashboard}>
                      Parent Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Fees Payment
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-body">
              {/* Student List */}
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                //    (<Table dataSource={tableData} columns={columns} Selection={true} />)
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
                        <div
                          className="dropdown-menu drop-width"
                          ref={dropdownMenuRef}
                        >
                          <form>
                            <div className="d-flex align-items-center border-bottom p-3">
                              <h4>Filter</h4>
                            </div>
                            <div className="p-3 border-bottom">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Child Name
                                    </label>
                                    <CommonSelect
                                      className="select"
                                      options={studentOption}
                                      value={filter?.studentId}
                                      onChange={(opt: any) =>
                                        setFilter(() => ({
                                          studentId: opt.value,
                                          studentName: opt.label,
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 d-flex align-items-center justify-content-end">
                              <Link to="#" className="btn btn-light me-3">
                                Reset
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-primary"
                                onClick={handleApplyClick}
                              >
                                Apply
                              </Link>
                            </div>
                          </form>
                        </div>
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
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* {rollnum&&(<StudentModals onAdd={() => { }} rollnum={rollnum} />)}  */}
    </>
  );
};

export default PFeesPayments;
