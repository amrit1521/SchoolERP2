import { useEffect, useRef, useState } from "react";
// import { all_routes } from "../../../router/all_routes";
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
import {
  getAllRolePermissions,
  getAllStuIssueBook,
  Imageurl,
} from "../../../service/api";
import dayjs from "dayjs";
import { teacher_routes } from "../../../admin/router/teacher_routes";

const TIssueBook = () => {
  // const routes = all_routes;
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
  const [studentsIssueData, setStudentsIssueData] = useState<
    StudentIssueBook[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  type Permission = {
    can_create?: boolean;
    can_delete?: boolean;
    can_edit?: boolean;
    can_view?: boolean;
  } | null;
  const [permission, setPermission] = useState<Permission>(null);

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "Library")
          .map((perm: any) => ({
            can_create: perm?.can_create,
            can_delete: perm?.can_delete,
            can_edit: perm?.can_edit,
            can_view: perm?.can_view,
          }));
        setPermission(currentPermission[0]);
      }
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await getAllStuIssueBook();
      if (data.success) {
        setStudentsIssueData(data.data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchAllData();
  }, []);

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
    rollnum: item.rollnum,
  }));

  const onAdd = () => {
    fetchAllData();
  };

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
      render: (text: any) => <span>{dayjs(text).format("DD MMM YYYY")}</span>,
      sorter: (a: TableData, b: TableData) =>
        a.dateofIssue.length - b.dateofIssue.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text: any) => <span>{dayjs(text).format("DD MMM YYYY")}</span>,
      sorter: (a: TableData, b: TableData) =>
        a.dueDate.length - b.dueDate.length,
    },
    {
      title: "Issue To",
      dataIndex: "issueTo",

      render: (text: string, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to={`${teacher_routes.studentDetail}/${record.rollnum}`}
              className="avatar avatar-md"
            >
              <img
                src={`${Imageurl}/${record.stu_img}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to={`${teacher_routes.studentDetail}/${record.rollnum}`}>
                  {text}
                </Link>
              </p>
              <span className="fs-12 text-capitalize">
                {record.class}-{record.section}
              </span>
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
      dataIndex: "rollnum",
      render: (id: number) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${teacher_routes.studentLibrary}/${id}`}
            className="btn btn-light add-fee"
            // data-bs-toggle="modal"
            // data-bs-target="#book_details"
          >
            View Details
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Issue Books</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={teacher_routes.teacherDashboard}>
                      Teacher Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Issue Books
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              {permission?.can_create ? (
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#issue_book"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Issue Book
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Issue Books</h4>
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
                              <label className="form-label">Issue Book</label>
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
                <Table
                  dataSource={tableData}
                  columns={columns}
                  Selection={true}
                />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>

      {/* /Page Wrapper */}
      <LibraryModal onAdd={onAdd} deleteMemberId={null} />
    </>
  );
};

export default TIssueBook;
