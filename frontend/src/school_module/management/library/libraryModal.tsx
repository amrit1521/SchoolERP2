
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import React, { useEffect, useState } from "react";
import { adddBookInLibrary, addLibrarymember, bookDataForIssueBook, issuBookToStu, stuDataForIssueBook } from "../../../service/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import CommonSelect from "../../../core/common/commonSelect";
import MultiSelect from "../../../core/common/multiSelect";


type Props = {
  onAdd: Function;
  deleteMemberId: number | null;
}

const LibraryModal: React.FC<Props> = ({ onAdd, deleteMemberId }) => {

  interface LibraryMember {
    name: string;
    cardno: string;
    email: string;
    date_of_join: string;
    phone_no: string;
    image?: File | null;   // ✅ add image field
  }
  const [addLibraryMember, setAddLibraryMember] = useState<LibraryMember>({
    name: "",
    cardno: "",
    email: "",
    date_of_join: "",
    phone_no: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddLibraryMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddLibraryMember((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDateChange = (name: keyof LibraryMember, value: string) => {
    setAddLibraryMember((prev) => ({ ...prev, [name]: value}))

  }
  // Validation function
  const validateLibraryMember = (member: LibraryMember) => {
    const errors: Partial<Record<keyof LibraryMember, string>> = {};

    if (!member.name.trim()) {
      errors.name = "Name is required";
    }

    if (!member.cardno.trim()) {
      errors.cardno = "Card number is required";
    }

    if (!member.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      errors.email = "Invalid email format";
    }

    if (!member.date_of_join) {
      errors.date_of_join = "Date of join is required";
    }

    if (!member.phone_no.trim()) {
      errors.phone_no = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(member.phone_no)) {
      errors.phone_no = "Mobile number must be 10 digits";
    }

    if (!member.image) {
      errors.image = "Image is required";
    }

    return errors;
  };
  const [errors, setErrors] = useState<Partial<Record<keyof LibraryMember, string>>>({});
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLibraryMember(addLibraryMember);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", addLibraryMember.name);
      formData.append("cardno", addLibraryMember.cardno);
      formData.append("email", addLibraryMember.email);
      formData.append("date_of_join", addLibraryMember.date_of_join);
      formData.append("phone_no", addLibraryMember.phone_no);
      if (addLibraryMember.image) {
        formData.append("limember", addLibraryMember.image);
      }

      const { data } = await addLibrarymember(formData);
      if (data.success) {
        onAdd()
        toast.success(data.message)
        setAddLibraryMember({
          name: "",
          cardno: "",
          email: "",
          date_of_join: "",
          phone_no: "",
          image: null,
        })
        setPreview('')
        setErrors({})
        handleModalPopUp(`add_library_members`)
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  };

  const handelDeleteMember = () => {
    console.log(deleteMemberId)
  }




  // --------------------------add book -----------------
  interface AddBook {
    bookName: string;
    bookNo: string;
    rackNo: string;
    publisher: string;
    author: string;
    subject: string;
    qty: string;
    available: string;
    price: string;
    postDate: string;
    bookimg: File | null;   // file type
  }

  const [addBook, setAddBook] = useState<AddBook>({
    bookName: "",
    bookNo: "",
    rackNo: "",
    publisher: "",
    author: "",
    subject: "",
    qty: "",
    available: "",
    price: "",
    postDate: "",
    bookimg: null,
  });
  const [previewBookImg, setPreviewBookImg] = useState<string | null>(null);
  // Text Inputs
  const handleBookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddBook((prev) => ({ ...prev, [name]: value }));
  };

  // Date Input
  const handleBookDateChange = (name: keyof AddBook, value: string) => {
    setAddBook((prev) => ({ ...prev, [name]: value }));
  };
  // Image Input
  const handleBookImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddBook((prev) => ({ ...prev, bookimg: file }));
      setPreviewBookImg(URL.createObjectURL(file));
    }
  };
  const handleBookFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(addBook)

    try {
      const formData = new FormData();

      // append all fields
      Object.entries(addBook).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value as string | Blob); // File or string
        }
      });

      const { data } = await adddBookInLibrary(formData); // API call
      if (data.success) {

        toast.success(data.message);
        onAdd()

        // Reset form
        setAddBook({
          bookName: "",
          bookNo: "",
          rackNo: "",
          publisher: "",
          author: "",
          subject: "",
          qty: "",
          available: "",
          price: "",
          postDate: "",
          bookimg: null,
        });
        setPreviewBookImg(null);
        handleModalPopUp(`add_library_book`)
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error adding book");
    }
  };


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

  // -------------------- State --------------------
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

  // -------------------- Options --------------------
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

  // Date fields
  const handleIssueBookDateChange = (field: keyof IssueBookForm, value: string) => {
    setIssueBookForm((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle status
  const handleIssueBookStatusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueBookForm((prev) => ({
      ...prev,
      status: e.target.checked ? "Taken" : "Returned",
    }));
  };

  // Submit
  const handleIssueBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(issueBookForm)
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

      {/* Add Member */}
      <div className="modal fade" id="add_library_members">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Member</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">


                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={addLibraryMember.name}
                        onChange={handleChange}
                      />
                      {errors.name && <small className="text-danger">{errors.name}</small>}
                    </div>

                    {/* Card No */}
                    <div className="mb-3">
                      <label className="form-label">Card No</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardno"
                        value={addLibraryMember.cardno}
                        onChange={handleChange}
                      />
                      {errors.cardno && <small className="text-danger">{errors.cardno}</small>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={addLibraryMember.email}
                        onChange={handleChange}
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>

                    {/* Date of Join */}

                    <div className="mb-3">
                      <label className="form-label">Admission Date</label>
                      <div className="input-icon position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format="DD MMM YYYY"
                          value={
                            addLibraryMember.date_of_join
                              ? dayjs(addLibraryMember.date_of_join, 'DD MMM YYYY')
                              : null
                          }
                          placeholder="Select Date"

                          onChange={(dateString) =>
                            handleDateChange("date_of_join", Array.isArray(dateString) ? dateString[0] : dateString)
                          }

                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                      {errors.date_of_join && <small className="text-danger">{errors.date_of_join}</small>}
                    </div>


                    {/* Phone Number */}
                    <div className="mb-0">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone_no"
                        value={addLibraryMember.phone_no}
                        onChange={handleChange}
                      />
                      {errors.phone_no && <small className="text-danger">{errors.phone_no}</small>}
                    </div>

                    {/* Image Upload */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="mt-3 border rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
                        style={{ height: "80px", width: "80px", cursor: "pointer" }}
                      >

                        <label
                          htmlFor="memimg"
                          className="w-100 h-100 d-flex align-items-center justify-content-center m-0"
                        >
                          {preview ? (
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <span className="small text-muted">Upload</span>
                          )}
                        </label>
                        <input
                          type="file"
                          id="memimg"
                          accept="image/*"
                          className="d-none"
                          onChange={handleFileChange}
                        />


                      </div>

                    </div>
                    <div className="text-center "> {errors.image && <small className="text-danger">{errors.image}</small>}</div>

                  </div>
                </div>
              </div>



              {/* Footer */}
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  type="submit"
                  // data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Add Member
                </button>
              </div>
            </form>


          </div>
        </div>
      </div>
      {/* Add Member */}



      {/* Edit Member */}
      <div className="modal fade" id="edit_library_members">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Member</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        defaultValue="James"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Card No</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Card No"
                        defaultValue={501}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Email"
                        defaultValue="james@example.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Join</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Date of Join"
                        defaultValue="22 Apr 2024"
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Phone Number"
                        defaultValue="+1 78429 82414"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Save Changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Member */}

      <>
        {/* Add Book */}
        <div className="modal fade" id="add_library_book">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Book</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleBookFormSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Book Name */}
                      <div className="mb-2">
                        <div className="d-flex align-items-center justify-content-center">
                          <label
                            className="rounded-circle border border-2  d-flex align-items-center justify-content-center overflow-hidden"
                            style={{ height: "80px", width: "80px", cursor: "pointer" }}
                            htmlFor="bookimg"
                          >
                            {!previewBookImg ? (
                              <p className="text-center">Upload Image</p>
                            ) : (
                              <img
                                src={previewBookImg}
                                alt="Book Preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </label>

                          <input
                            className="d-none"
                            id="bookimg"
                            type="file"
                            accept="image/*"
                            onChange={handleBookImg}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Book Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="bookName"
                          value={addBook.bookName}
                          onChange={handleBookInputChange}
                        />
                      </div>

                      {/* Book No + Rack No */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Book No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="bookNo"
                              value={addBook.bookNo}
                              onChange={handleBookInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Rack No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="rackNo"
                              value={addBook.rackNo}
                              onChange={handleBookInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Publisher */}
                      <div className="mb-3">
                        <label className="form-label">Publisher</label>
                        <input
                          type="text"
                          className="form-control"
                          name="publisher"
                          value={addBook.publisher}
                          onChange={handleBookInputChange}
                        />
                      </div>

                      {/* Author */}
                      <div className="mb-3">
                        <label className="form-label">Author</label>
                        <input
                          type="text"
                          className="form-control"
                          name="author"
                          value={addBook.author}
                          onChange={handleBookInputChange}
                        />
                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          value={addBook.subject}
                          onChange={handleBookInputChange}
                        />
                      </div>

                      {/* Qty + Available */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Qty</label>
                            <input
                              type="number"
                              className="form-control"
                              name="qty"
                              value={addBook.qty}
                              onChange={handleBookInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Available</label>
                            <input
                              type="number"
                              className="form-control"
                              name="available"
                              value={addBook.available}
                              onChange={handleBookInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="text"
                          className="form-control"
                          name="price"
                          value={addBook.price}
                          onChange={handleBookInputChange}
                        />
                      </div>

                      {/* Admission Date */}
                      <div className="mb-0">
                        <label className="form-label">Admission Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              addBook.postDate
                                ? dayjs(addBook.postDate, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleBookDateChange(
                                "postDate",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>

                      {/* book img */}

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
                  <button
                    type="submit"
                    // data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Add Book */}


        {/* Edit Book */}
        <div className="modal fade" id="edit_library_book">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Book</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Book Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Book Name"
                          defaultValue="Echoes of Eternity"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Book No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Book No"
                              defaultValue={501}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Rack No</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Rack Name"
                              defaultValue={6550}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Publisher</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Publisher"
                          defaultValue="Aurora Press"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Author</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Author"
                          defaultValue=" Isabella Rivers"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Subject"
                          defaultValue="History"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Qty</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Qty"
                              defaultValue={150}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Available</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Available"
                              defaultValue={120}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Price"
                          defaultValue="$300"
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Post Date</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Post Date"
                          defaultValue="25 Apr 2024"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Book */}
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
                    onClick={handelDeleteMember}
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
