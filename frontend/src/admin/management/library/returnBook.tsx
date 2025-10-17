import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  moreFilterBookIssue,
  names,
  transactionDate,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
import LibraryModal from "./libraryModal";
import { toast } from "react-toastify";
import { getAllStuIssueBook, Imageurl, returnBook, speStuNotReturnBookData } from "../../../service/api";
import { DatePicker } from "antd";
import MultiSelect from "../../../core/common/multiSelect";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import dayjs from 'dayjs'

const ReturnBook = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };


  interface StudentIssueBook {
    admissionnum: string;
    stu_id: number;
    firstname: string;
    lastname: string;
    stu_img: string;
    class: string;
    section: string;
    issuedBook: number;
    BookReturned: string;
    lastIssuedDate: string;
    lastReturnDate: string;
    remarks: string;
    rollnum: string;
  }

  // ✅ useState with array of students
  const [studentsIssueData, setStudentsIssueData] = useState<StudentIssueBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAllData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await getAllStuIssueBook()
      if (data.success) {
        setStudentsIssueData(data.data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])


  const tableData = studentsIssueData.map((item) => ({
    key: item.admissionnum,
    id: item.admissionnum,
    dateofIssue: item.lastIssuedDate,
    dueDate: item.lastReturnDate,
    stu_id: item.stu_id,
    stu_img: item.stu_img,
    class: item.class,
    section: item.section,
    issueTo: `${item.firstname} ${item.lastname}`,
    booksIssued: item.issuedBook,
    bookReturned: item.BookReturned,
    issueRemarks: item.remarks,
    rollnum: item.rollnum
  }))


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Date of Issue",
      dataIndex: "dateofIssue",
      render: (text: any) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.dateofIssue.length - b.dateofIssue.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text: any) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.dueDate.length - b.dueDate.length,
    },
    {
      title: "Issue To",
      dataIndex: "issueTo",
      render: (text: string, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link to={`${routes.studentDetail}/${record.rollnum}`} className="avatar avatar-md">
              <img
                src={`${Imageurl}/${record.stu_img}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to={`${routes.studentDetail}/${record.rollnum}`}>{text}</Link>
              </p>
              <span className="fs-12 text-capitalize">{record.class}-{record.section}</span>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.issueTo.length - b.issueTo.length,
    },
    {
      title: "Books Issued",
      dataIndex: "booksIssued",

      sorter: (a: TableData, b: TableData) =>
        a.booksIssued.length - b.booksIssued.length,
    },
    {
      title: "Book Returned",
      dataIndex: "bookReturned",

      sorter: (a: TableData, b: TableData) =>
        a.bookReturned.length - b.bookReturned.length,
    },
    {
      title: "Issue Remarks",
      dataIndex: "issueRemarks",

      sorter: (a: TableData, b: TableData) =>
        a.issueRemarks.length - b.issueRemarks.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${routes.studentLibrary}/${record.rollnum}`}
            className="btn btn-light add-fee"
          // data-bs-toggle="modal"
          // data-bs-target="#book_details"
          >
            View Details
          </Link>
          <button data-bs-toggle="modal"
            data-bs-target="#return_book"
            onClick={() => studentsBook(record.rollnum)}
            className="btn  btn-outline-danger">
            Return
          </button>
        </div>
      ),
    },
  ];

  // -------------------- return book data --------------------

  interface Book {
    bookId: number;
    bookName: string;
  }

  interface ReturnBookForm {
    studentRollNo: string;
    bookId: (string | number)[];
    status: string;
  }


  const [books, setBooks] = useState<Book[]>([]);
  const [summary, setSummary] = useState<any>({});

  const [returnBookForm, setReturnBookForm] = useState<ReturnBookForm>({
    studentRollNo: "",
    bookId: [],
    status: "Returned",
  });


  const studentsBook = async (rollnum: any) => {
    try {
      const { data } = await speStuNotReturnBookData(rollnum);
      if (data.success) {
        setBooks(data.data);
        setSummary(data.summary);


        setReturnBookForm((prev) => ({
          ...prev,
          studentRollNo: rollnum,
        }));
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };


  const bookOption = books.map((b) => ({
    value: b.bookId,
    label: b.bookName,
  }));


  const handleReturnBookMulti = (
    field: keyof ReturnBookForm,
    value: (string | number)[]
  ) => {
    setReturnBookForm((prev) => ({ ...prev, [field]: value }));
  };


  const handleReturnBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   try {
      const { data } = await returnBook(returnBookForm); 
      if (data.success) {
        toast.success(data.message);
        fetchAllData();
        handleModalPopUp("return_book");

        // reset
        setReturnBookForm({
          studentRollNo: "",
          bookId: [],
          status: "Returned",
        });
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = () => {
    setReturnBookForm({
      studentRollNo: "",
      bookId: [],
      status: "Returned",
    })
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Return Books</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Return Books
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
              <h4 className="mb-3">Return Books</h4>
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
                              <label className="form-label">Date of Issue</label>
                              <CommonSelect
                                className="select"
                                options={transactionDate}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={names}
                              // defaultValue={names[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterBookIssue}
                              // defaultValue={moreFilterBookIssue[0]}
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
              {
                loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (<Table dataSource={tableData} columns={columns} Selection={true} />)
              }

              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* modal resturn */}

      <div className="modal fade" id="return_book">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Return Book</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleReturnBookSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    {/* Student Roll No */}
                    <div className="mb-3">
                      <label className="form-label">Student Name</label>
                      <input type="text" className="form-control" disabled value={`${summary.firstname} ${summary.lastname}`} />
                    </div>

                    {/* Book Name (MultiSelect) */}
                    <div className="mb-3">
                      <label className="form-label">Book Name</label>
                      <MultiSelect
                        value={bookOption.filter(b => returnBookForm.bookId.includes(b.value))}
                        className="select"
                        options={bookOption}
                        placeholder="Select Books"
                        onChange={(values) =>
                          handleReturnBookMulti("bookId", values)
                        }
                      />
                    </div>

                    {/* Issue Date + Last Date */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Issue Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            disabled
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={dayjs(summary.lastIssuedDate, "DD MMM YYYY")}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Last Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            disabled
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={dayjs(summary.lastReturnDate, "DD MMM YYYY")}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="status"
                          checked={returnBookForm.status === "Retur"}

                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  onClick={handleCancel}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Return Book
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <LibraryModal onAdd={() => { }} deleteMemberId={null} />
    </>
  );
};

export default ReturnBook;
