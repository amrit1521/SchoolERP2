
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import React, { useEffect, useState } from "react";
import { bookDataForIssueBook, issuBookToStu, stuDataForIssueBook } from "../../../service/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import CommonSelect from "../../../core/common/commonSelect";
import MultiSelect from "../../../core/common/multiSelect";


type Props = {
  onAdd?: Function;
  deleteMemberId?: number | null;
}

const LibraryModal: React.FC<Props> = ({ onAdd}) => {

  // issue book ---------------------------------------------------------
  interface Student {
    rollnum: string;
    firstname: string;
    lastname: string;
  }

  interface Book {
    id: number;
    bookName: string;
  }

  interface IssueBookForm {
    studentRollNo: string;
    bookId: (string | number)[]; // ✅ Array of selected book IDs
    issueDate: string | null;
    lastDate: string | null;
    status: string;
    issuRemark: string;
  }
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [issueBookForm, setIssueBookForm] = useState<IssueBookForm>({
    studentRollNo: "",
    bookId: [],
    issueDate: null,
    lastDate: null,
    status: "Taken",
    issuRemark: "Book Issued",
  });

  // -------------------- Fetch Data --------------------
  const fetchSelectOptionDataBookAndStu = async () => {
    try {
      const [stuRes, bookRes] = await Promise.all([
        stuDataForIssueBook(),
        bookDataForIssueBook(),
      ]);

      if (stuRes.data.success) setStudents(stuRes.data.data);
      if (bookRes.data.success) setBooks(bookRes.data.data);
    } catch (error) {
      console.error("Error fetching students and books", error);
    }
  };

  useEffect(() => {
    fetchSelectOptionDataBookAndStu();
  }, []);

  const stuOption = students.map((s) => ({
    value: s.rollnum,
    label: `${s.firstname} ${s.lastname}`,
  }));

  const bookOption = books.map((b) => ({
    value: b.id,
    label: b.bookName,
  }));

  // -------------------- Handlers --------------------
  // Single select
  const handleIssueBookSelect = (field: keyof IssueBookForm, value: string | number) => {
    setIssueBookForm((prev) => ({ ...prev, [field]: value }));
  };

  // Multi select
  const handleIssueBookMulti = (field: keyof IssueBookForm, value: (string | number)[]) => {
    setIssueBookForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIssueBookDateChange = (field: keyof IssueBookForm, value: string) => {
    setIssueBookForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIssueBookStatusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueBookForm((prev) => ({
      ...prev,
      status: e.target.checked ? "Taken" : "Returned",
    }));
  };


  const handleIssueBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdd) return
    try {
      const { data } = await issuBookToStu(issueBookForm);
      if (data.success) {
        toast.success(data.message);
        onAdd();
        handleModalPopUp("issue_book");
        setIssueBookForm({
          studentRollNo: "",
          bookId: [],
          issueDate: null,
          lastDate: null,
          status: "Taken",
          issuRemark: "Book Issued",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  return (
    <>
      <>
        {/* Book Details */}
        <div className="modal fade" id="book_details">
          <div className="modal-dialog modal-dialog-centered  modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">View Details</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="view-book">
                  <div className="view-book-title">
                    <h5>Issue Book Details</h5>
                  </div>
                  <div className="book-issue-details">
                    <div className="book-details-head">
                      <span className="text-primary">IB853629</span>
                      <h6>
                        <span>Issue Date :</span> 19 May 2024
                      </h6>
                    </div>
                    <ul className="book-taker-info">
                      <li>
                        <div className="d-flex align-items-center">
                          <span className="student-img">
                            <ImageWithBasePath
                              src="assets/img/students/student-01.jpg"
                              className="img-fluid rounded-circle"
                              alt="Img"
                            />
                          </span>
                          <h6>
                            Janet <br /> III, A
                          </h6>
                        </div>
                      </li>
                      <li>
                        <span>Roll No</span>
                        <h6>35010</h6>
                      </li>
                      <li>
                        <span>Book Name</span>
                        <h6>Echoes of Eternity</h6>
                      </li>
                      <li>
                        <span>Book No</span>
                        <h6>501</h6>
                      </li>
                      <li>
                        <span>Due Date</span>
                        <h6>19 May 2024</h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Book Details */}
      </>
      {/* issue book */}
      <div className="modal fade" id="issue_book">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Issue Book</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleIssueBookSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    {/* Student Roll No */}
                    <div className="mb-3">
                      <label className="form-label">Student Roll No</label>
                      <CommonSelect
                        className="select"
                        options={stuOption}
                        onChange={(option) =>
                          handleIssueBookSelect("studentRollNo", option ? option.value : "")
                        }
                      />
                    </div>

                    {/* Book Name (MultiSelect) */}
                    <div className="mb-3">
                      <label className="form-label">Book Name</label>
                      <MultiSelect
                        value={bookOption.filter(b => issueBookForm.bookId.includes(b.value))}
                        className="select"
                        options={bookOption}
                        placeholder="Select Books"
                        onChange={(values) =>
                          handleIssueBookMulti("bookId", values)
                        }
                      />
                    </div>

                    {/* Issue Date + Last Date */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Issue Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={issueBookForm.issueDate ? dayjs(issueBookForm.issueDate, "DD MMM YYYY") : null}
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleIssueBookDateChange(
                                "issueDate",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
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
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={issueBookForm.lastDate ? dayjs(issueBookForm.lastDate, "DD MMM YYYY") : null}
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleIssueBookDateChange(
                                "lastDate",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
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
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="status"
                          checked={issueBookForm.status === "Taken"}
                          onChange={handleIssueBookStatusToggle}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* issue book */}

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete all the marked items, this cant be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    // onClick={handelDeleteMember}
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default LibraryModal;
