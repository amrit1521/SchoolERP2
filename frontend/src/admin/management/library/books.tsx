import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  allSubject,
  cardNo,
  moreFilterBook,

} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import { bookList } from "../../../core/data/json/bookList";
import { adddBookInLibrary, deleteBook, deleteBookImg, editBook, getallbook, Imageurl, speBook, uploadBookImg } from "../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import dayjs from 'dayjs'
import { DatePicker } from "antd";



export interface Book {
  id: number;
  bookName: string;
  bookNo: string;
  author: string;
  publisher: string;
  subject: string;
  price: string;
  qty: string;
  rackNo: string;
  postDate: string;
  available: string;
  bookImg: string;
}

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

}
interface ValidationErrors {
  bookName?: string;
  bookNo?: string;
  rackNo?: string;
  publisher?: string;
  author?: string;
  subject?: string;
  qty?: string;
  available?: string;
  price?: string;
  postDate?: string;

}


const Books = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = bookList;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(false)
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
  });
  const [bookImg, setBookImg] = useState<File | null>(null)
  const [bookImgPath, setBookImgPath] = useState<string>("")
  const [bookImgId, setBookImgId] = useState<number | null>(null)
  const [editBookImgPath, setEditBookImgPath] = useState<string>("")
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchBooks = async () => {
    setLoading(true)

    try {
      await new Promise((res) => setTimeout(res, 400))
      const { data } = await getallbook()
      if (data.success) {
        setAllBooks(data.data)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()

  }, [])

  const tableData = allBooks.map((item) => ({
    key: item.id,
    id: item.id,
    bookName: item.bookName,
    bookNo: item.bookNo,
    publisher: item.publisher,
    author: item.author,
    subject: item.subject,
    rackNo: item.rackNo,
    qty: item.qty,
    available: item.available,
    price: item.price,
    postDate: item.postDate,
    bookImg: item.bookImg
  }))




  // --------------------------add book -----------------
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,

  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Allow only image or PDF
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        toast.error("Only JPG, PNG, or PDF files are allowed.");
        return;
      }

      const maxSizeInBytes = 4 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("File size should not exceed 4MB.");
        return;
      }


      setFile(file);

      const formData = new FormData();
      formData.append("bookImg", file);

      try {

        const res = await uploadBookImg(formData)
        const uploadedPath = res.data.file;
        const id = res.data.insertId;


        setBookImgPath(uploadedPath);
        setBookImgId(id)



      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const deleteImage = async (id: number) => {
    if (!id) return;

    try {
      const deletefile = await deleteBookImg(id)

      if (deletefile.data.success) {


        setBookImgId(null);
        setBookImg(null);
        setBookImgPath("");



      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };


  const handleBookInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookDateChange = (name: keyof AddBook, value: string) => {
    setAddBook((prev) => ({ ...prev, [name]: value }));
  };

  const validateBookForm = (values: AddBook): boolean => {
    const newErrors: ValidationErrors = {};

    if (!values.bookName.trim()) {
      newErrors.bookName = "Book name is required.";
    } else if (values.bookName.length < 3) {
      newErrors.bookName = "Book name must be at least 3 characters long.";
    }

    if (!values.bookNo) {
      newErrors.bookNo = "Book number is required.";
    }

    if (!values.rackNo) {
      newErrors.rackNo = "Rack number is required.";
    }

    if (!values.publisher.trim()) {
      newErrors.publisher = "Publisher name is required.";
    }

    if (!values.author.trim()) {
      newErrors.author = "Author name is required.";
    }

    if (!values.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!values.qty) {
      newErrors.qty = "Quantity is required.";
    } else if (Number(values.qty) <= 0) {
      newErrors.qty = "Quantity must be greater than 0.";
    }

    if (!values.available) {
      newErrors.available = "Available books are required.";
    } else if (Number(values.available) < 0) {
      newErrors.available = "Available books cannot be negative.";
    } else if (Number(values.available) > Number(values.qty)) {
      newErrors.available = "Avilable books cannot be greater than Books Quantity."
    }

    if (!values.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(values.price))) {
      newErrors.price = "Price must be a valid number.";
    } else if (Number(values.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!values.postDate) {
      newErrors.postDate = "Admission date is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBookById = async (id: number) => {
    if (!id) return
    try {

      const { data } = await speBook(id)
      if (data.success) {
        const res = data.data
        setAddBook({
          bookName: res.bookName,
          bookNo: res.bookNo,
          rackNo: res.rackNo,
          publisher: res.publisher,
          author: res.author,
          subject: res.subject,
          qty: res.qty,
          available: res.available,
          price: res.price,
          postDate: dayjs(res.postDate).format('DD MMM YYYY'),
        })

        setBookImgPath(res.bookImg)
        setEditBookImgPath(res.bookImg)
        setEditId(id)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleBookFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!bookImgPath && !editBookImgPath) {
        toast.error("Book image is required!");
        return;
      }
      if (!validateBookForm(addBook)) {
        toast.error("Please fix validation errors before submitting!");
        return;
      }
      const formData = new FormData();
      Object.entries(addBook).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });
      formData.append("bookImg", bookImgPath || editBookImgPath);
      const apiCall = editId
        ? editBook(formData, editId)
        : adddBookInLibrary(formData);
      const { data } = await apiCall;
      if (data.success) {
        toast.success(data.message || "Book saved successfully!");
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
        });
        setBookImg(null);
        setBookImgId(null);
        setBookImgPath("");
        setEditBookImgPath("");
        fetchBooks()
        handleModalPopUp(editId ? "edit_library_book" : "add_library_book");
      } else {
        toast.error(data.message || "Something went wrong while saving the book!");
      }
    } catch (error: any) {
      console.error("handleBookFormSubmit Error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred!");
      } else if (error.request) {
        toast.error("Network error! Please check your connection.");
      } else {
        toast.error("Unexpected error occurred!");
      }
    }
  };


  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
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

    });
    setBookImg(null)
    setBookImgPath('')
    setBookImgId(null)
    setEditBookImgPath('')

  }



  // delete class room-----------------------------------------------------
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteBook(id)
      if (data.success) {
        toast.success(data.message)
        fetchBooks()
        handleModalPopUp('delete-modal')
      }


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }
  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <Link to="#" className="link-primary">
          LB{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Book Name",
      dataIndex: "bookName",
      render: (text: string, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <div className="avatar avatar-md">
              <img
                src={`${Imageurl}/${record.bookImg}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </div>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <div>{text}</div>
              </p>

            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.bookName.length - b.bookName.length,
    },
    {
      title: "Book No",
      dataIndex: "bookNo",
      sorter: (a: TableData, b: TableData) =>
        a.bookNo.length - b.bookNo.length,
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      sorter: (a: TableData, b: TableData) =>
        a.publisher.length - b.publisher.length,
    },
    {
      title: "Author",
      dataIndex: "author",

      sorter: (a: TableData, b: TableData) => a.author.length - b.author.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",

      sorter: (a: TableData, b: TableData) => a.subject.length - b.subject.length,
    },
    {
      title: "Rack No",
      dataIndex: "rackNo",

      sorter: (a: TableData, b: TableData) => a.rackNo.length - b.rackNo.length,
    },
    {
      title: "Qty",
      dataIndex: "qty",

      sorter: (a: TableData, b: TableData) => a.qty.length - b.qty.length,
    },
    {
      title: "Available",
      dataIndex: "available",

      sorter: (a: TableData, b: TableData) => a.available.length - b.available.length,
    },
    {
      title: "Price",
      dataIndex: "price",

      sorter: (a: TableData, b: TableData) => a.price.length - b.price.length,
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      render: (text: string) => dayjs(text).format("DD MMM YYYY"),
      sorter: (a: TableData, b: TableData) =>
        dayjs(a.postDate).unix() - dayjs(b.postDate).unix(),
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={(() => fetchBookById(record.id))}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_library_book"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDeleteId(record.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
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
              <h3 className="page-title mb-1">Books</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Books
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
                  data-bs-target="#add_library_book"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Book
                </Link>
              </div>

            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Books</h4>
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
                              <label className="form-label">Book No</label>
                              <CommonSelect
                                className="select"
                                options={cardNo}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Subject</label>
                              <CommonSelect
                                className="select"
                                options={allSubject}
                              // defaultValue={allSubject[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterBook}
                              // defaultValue={moreFilterBook[0]}
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

                    <div className="card-body pb-1">
                      <div className="profile-wrap mb-3 d-flex align-items-center">
                        <div className="bg-white me-3">
                          {
                            !bookImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(bookImg)} alt="" /></p>
                          }

                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn mb-3">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, setBookImg)}
                                className="form-control image-sign"
                              />
                            </div><span className="text-danger"> *</span>
                            {bookImgId && (<div onClick={() => deleteImage(bookImgId)} className="btn btn-outline-danger mb-3 ">
                              Remove
                            </div>)}
                          </div>
                          <p className="fs-12">
                            Upload image size 4MB, Format JPG, PNG,
                          </p>
                        </div>
                      </div>
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Book Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.bookName ? "is-invalid" : ""}`}
                        name="bookName"
                        value={addBook.bookName}
                        onChange={handleBookInputChange}
                      />
                      {errors.bookName && <div className="invalid-feedback">{errors.bookName}</div>}
                    </div>

                    {/* Book No + Rack No */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Book No<span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className={`form-control ${errors.bookNo ? "is-invalid" : ""}`}
                            name="bookNo"
                            value={addBook.bookNo}
                            onChange={handleBookInputChange}
                          />
                          {errors.bookNo && <div className="invalid-feedback">{errors.bookNo}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Rack No<span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className={`form-control ${errors.rackNo ? "is-invalid" : ""}`}
                            name="rackNo"
                            value={addBook.rackNo}
                            onChange={handleBookInputChange}
                          />
                          {errors.rackNo && <div className="invalid-feedback">{errors.rackNo}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Publisher */}
                    <div className="mb-3">
                      <label className="form-label">Publisher <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.publisher ? "is-invalid" : ""}`}
                        name="publisher"
                        value={addBook.publisher}
                        onChange={handleBookInputChange}
                      />
                      {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                    </div>

                    {/* Author */}
                    <div className="mb-3">
                      <label className="form-label">Author<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.author ? "is-invalid" : ""}`}
                        name="author"
                        value={addBook.author}
                        onChange={handleBookInputChange}
                      />
                      {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                    </div>

                    {/* Subject */}
                    <div className="mb-3">
                      <label className="form-label">Subject<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                        name="subject"
                        value={addBook.subject}
                        onChange={handleBookInputChange}
                      /> {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>

                    {/* Qty + Available */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Qty<span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className={`form-control ${errors.qty ? "is-invalid" : ""}`}
                            name="qty"
                            value={addBook.qty}
                            onChange={handleBookInputChange}
                          /> {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Available<span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className={`form-control ${errors.available ? "is-invalid" : ""}`}
                            name="available"
                            value={addBook.available}
                            onChange={handleBookInputChange}
                          />
                          {errors.available && <div className="invalid-feedback">{errors.available}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <label className="form-label">Price<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                        name="price"
                        value={addBook.price}
                        onChange={handleBookInputChange}
                      /> {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    {/* Admission Date */}
                    <div className="mb-0">
                      <label className="form-label">Admission Date<span className="text-danger">*</span></label>
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
                        {errors.postDate && <div style={{ fontSize: '11px' }} className="text-danger">{errors.postDate}</div>}
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
                <button
                  type="button"
                  onClick={(e) => handleCancel(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
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
            <form onSubmit={handleBookFormSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Book Name */}

                    <div className="card-body pb-1">
                      <div className="profile-wrap mb-3 d-flex align-items-center">
                        <div className="bg-white me-3">
                          {
                            !bookImgId ? (<p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={`${Imageurl}/${editBookImgPath}`} alt="" /></p>) :
                              !bookImg ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(bookImg)} alt="" /></p>
                          }
                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center">
                            <div className="drag-upload-btn mb-3">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, setBookImg)}
                                className="form-control image-sign"
                              />
                            </div><span className="text-danger"> *</span>
                            {bookImgId && (<div onClick={() => deleteImage(bookImgId)} className="btn btn-outline-danger mb-3 ">
                              Remove
                            </div>)}
                          </div>
                          <p className="fs-12">
                            Upload image size 4MB, Format JPG, PNG,
                          </p>
                        </div>
                      </div>
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Book Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.bookName ? "is-invalid" : ""}`}
                        name="bookName"
                        value={addBook.bookName}
                        onChange={handleBookInputChange}
                      />
                      {errors.bookName && <div className="invalid-feedback">{errors.bookName}</div>}
                    </div>

                    {/* Book No + Rack No */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Book No<span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className={`form-control ${errors.bookNo ? "is-invalid" : ""}`}
                            name="bookNo"
                            value={addBook.bookNo}
                            onChange={handleBookInputChange}
                          />
                          {errors.bookNo && <div className="invalid-feedback">{errors.bookNo}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Rack No<span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className={`form-control ${errors.rackNo ? "is-invalid" : ""}`}
                            name="rackNo"
                            value={addBook.rackNo}
                            onChange={handleBookInputChange}
                          />
                          {errors.rackNo && <div className="invalid-feedback">{errors.rackNo}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Publisher */}
                    <div className="mb-3">
                      <label className="form-label">Publisher <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.publisher ? "is-invalid" : ""}`}
                        name="publisher"
                        value={addBook.publisher}
                        onChange={handleBookInputChange}
                      />
                      {errors.publisher && <div className="invalid-feedback">{errors.publisher}</div>}
                    </div>

                    {/* Author */}
                    <div className="mb-3">
                      <label className="form-label">Author<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.author ? "is-invalid" : ""}`}
                        name="author"
                        value={addBook.author}
                        onChange={handleBookInputChange}
                      />
                      {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                    </div>

                    {/* Subject */}
                    <div className="mb-3">
                      <label className="form-label">Subject<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                        name="subject"
                        value={addBook.subject}
                        onChange={handleBookInputChange}
                      /> {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>

                    {/* Qty + Available */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Qty<span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className={`form-control ${errors.qty ? "is-invalid" : ""}`}
                            name="qty"
                            value={addBook.qty}
                            onChange={handleBookInputChange}
                          /> {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Available<span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className={`form-control ${errors.available ? "is-invalid" : ""}`}
                            name="available"
                            value={addBook.available}
                            onChange={handleBookInputChange}
                          />
                          {errors.available && <div className="invalid-feedback">{errors.available}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <label className="form-label">Price<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                        name="price"
                        value={addBook.price}
                        onChange={handleBookInputChange}
                      /> {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    {/* Admission Date */}
                    <div className="mb-0">
                      <label className="form-label">Admission Date<span className="text-danger">*</span></label>
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
                        {errors.postDate && <div style={{ fontSize: '11px' }} className="text-danger">{errors.postDate}</div>}
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
                <button
                  type="button"
                  onClick={(e) => handleCancel(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
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
      {/* Edit Book */}

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form >
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete  marked item, this cant be undone
                  once you delete.
                </p>
                {
                  deleteId && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => cancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e) => handleDelete(deleteId, e)} className="btn btn-danger"
                    >
                      Yes, Delete
                    </button>
                  </div>)
                }
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}

    </>

  );
};

export default Books;
