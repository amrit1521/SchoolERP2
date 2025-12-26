import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  AdmissionNo,
  allClass,
  allSection,
  amount,
  DueDate,
  names,
  rollno,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import StudentModals from "../../peoples/students/studentModals";
import TooltipOption from "../../../core/common/tooltipOption";
import { getFeesCollectionDet, Imageurl } from "../../../service/api";
import { toast } from "react-toastify";
import dayjs from 'dayjs'

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










const CollectFees = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  // types/StudentFeesRecord.ts

  interface FeesCollectionDet {
    id: number;
    admNo: string;
    student_rollnum: string;
    collectionDate: string;
    status: "0" | "1";
    dueDate: string;
    totalAmount: string;
    class: string;
    section: string;
    stu_img: string;
    stu_id: number;
    firstname: string;
    lastname: string;
  }



  const [feesCollection, setFeesCollection] = useState<FeesCollectionDet[]>([{
    id: 0,
    admNo: "",
    student_rollnum: "",
    collectionDate: "",
    status: "0",
    dueDate: "",
    totalAmount: "",
    class: "",
    section: "",
    stu_img: "",
    stu_id: 0,
    firstname: "",
    lastname: "",
  }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rollnum , setRollnum] = useState<number|null>(null)



  const fetchFeesCollectionDet = async () => {
    setLoading(true);
    try {
      const { data } = await getFeesCollectionDet();
      
      if (data.success) {
        setFeesCollection(data.feesdata);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesCollectionDet();
  }, []);


  useEffect(() => {
    fetchFeesCollectionDet()
  }, [])


  const tableData = feesCollection.map((item) => ({
    key: item.id,
    id: item.id,
    admNo: item.admNo,
    rollNo: item.student_rollnum,
    student: `${item.firstname} ${item.lastname}`,
    studentImage: item.stu_img,
    class: item.class,
    section: item.section,
    amount: item.totalAmount,
    lastDate: item.dueDate,
    status: item.status === "1" ? "Paid" : "Unpaid",
  }));



  const columns = [
    {
      title: "Adm No",
      dataIndex: "admNo",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.admNo.length - b.admNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: TableData, b: TableData) => a.rollNo- b.rollNo,
    },
    {
      title: "Student",
      dataIndex: "student",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={`${routes.studentDetail}/${record.rollNo}`} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.studentImage}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.studentDetail}/${record.rollNo}`}>{text}</Link>
            </p>
            <span className="fs-12">{`${record.class}-${record.section}`}</span>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.student.length - b.student.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },

    {
      title: "Last Date",
      dataIndex: "lastDate",
      render:(text:string)=>(
        <span >{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.lastDate.length - b.lastDate.length,
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Paid" ? (
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
    {
      title: "Action",
      dataIndex: "status",
      render: (text: string, record: any) => (
        <>
          {text === "Paid" ? (
            <Link to={`${routes.studentFees}/${record.rollNo}`} className="btn btn-light">
              View Details
            </Link>
          ) : (
            <button
               onClick={()=>setRollnum(record.rollNo)}
              className="btn btn-light"
              data-bs-toggle="modal"
              data-bs-target="#add_fees_collect"
            >
              Collect Fees
            </button>
          )}
        </>
      ),
    },
  ];
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
              <h3 className="page-title mb-1">Fees Collection</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Fees Collection</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Collect Fees
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
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees List</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Admisson No</label>
                              <CommonSelect
                                className="select"
                                options={AdmissionNo}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Roll No</label>
                              <CommonSelect
                                className="select"
                                options={rollno}

                              />
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Student</label>
                              <CommonSelect
                                className="select"
                                options={names}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={allSection}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Amount</label>
                              <CommonSelect
                                className="select"
                                options={amount}
                              // defaultValue={amount[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Last Date</label>
                              <CommonSelect
                                className="select"
                                options={DueDate}
                              // defaultValue={DueDate[0]}
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
                <div className="dropdown mb-3">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
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
              ) : (<Table dataSource={tableData} columns={columns} Selection={true} />)}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
     {rollnum&&(<StudentModals onAdd={() => { }} rollnum={rollnum} />)} 
    </>
  );
};

export default CollectFees;
