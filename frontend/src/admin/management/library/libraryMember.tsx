import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  cardNo,
  members,
  moreFilter,

} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import { librarymemberList } from "../../../core/data/json/libraryMemberList";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { addLibrarymember, deleteLibraryMember, getAllLibraryMember } from "../../../service/api";
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import { DatePicker } from "antd";
import { handleModalPopUp } from "../../../handlePopUpmodal";
interface LibraryMember {
  id: number;
  name: string;
  cardno: string;
  email: string;
  date_of_join: string;
  phone_no: string;
  image_url: string;
  folder?: string;
  img_src?: string;

}

interface LibraryMemberForm {
  name: string;
  cardno: string;
  email: string;
  date_of_join: string;
  phone_no: string;
  image?: File | null;
}
const LibraryMember = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = librarymemberList;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };




  const [libraryMembers, setLibraryMembers] = useState<LibraryMember[]>([])
  const [loading, setloading] = useState<boolean>(false)

  const [addLibraryMember, setAddLibraryMember] = useState<LibraryMemberForm>({
    name: "",
    cardno: "",
    email: "",
    date_of_join: "",
    phone_no: "",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof LibraryMemberForm, string>>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchLibraryMember = async () => {
    try {
      setloading(true)
      const { data } = await getAllLibraryMember()

      if (data.success) {
        setLibraryMembers(data.data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchLibraryMember()

  }, [])

  const tabledata = libraryMembers.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    cardNo: item.cardno,
    email: item.email,
    dateOfJoin: dayjs(item.date_of_join).format('DD MMM YYYY'),
    mobile: item.phone_no,
    img: item.image_url,
  }));


  // add memeber
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
    setAddLibraryMember((prev) => ({ ...prev, [name]: value }))

  }

  const validateLibraryMember = (member: LibraryMemberForm) => {
    const errors: Partial<Record<keyof LibraryMemberForm, string>> = {};

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


  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLibraryMember(addLibraryMember);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // if (!onAdd) return

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
        // onAdd()
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

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setAddLibraryMember({
      name: "",
      cardno: "",
      email: "",
      date_of_join: "",
      phone_no: "",
      image: null,
    })
  }


  // delete member
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteLibraryMember(id)
      if (data.success) {
        toast.success(data.message)
        fetchLibraryMember()
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
        <Link to="#" className="link-primary">{text}</Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Member",
      dataIndex: "name",
      render: (text: string, record: any) => (

        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">

            <img
              src={record.img}  //maine image ko direct full url bna diya h backend me hi
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Card No",
      dataIndex: "cardNo",
      sorter: (a: TableData, b: TableData) =>
        a.cardNo.localeCompare(b.cardNo),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: TableData, b: TableData) =>
        a.email.localeCompare(b.email),
    },
    {
      title: "Date Of Join",
      dataIndex: "dateOfJoin",
      sorter: (a: TableData, b: TableData) =>
        a.dateOfJoin.localeCompare(b.dateOfJoin),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      sorter: (a: TableData, b: TableData) =>
        a.mobile.localeCompare(b.mobile),
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (key: number) => (
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
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_library_members"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => setDeleteId(key)}
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
              <h3 className="page-title mb-1">Library Members</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Library Members
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
                  data-bs-target="#add_library_members"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Member
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Library Members List</h4>
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
                              <label className="form-label">Member</label>
                              <CommonSelect
                                className="select"
                                options={members}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Card No</label>
                              <CommonSelect
                                className="select"
                                options={cardNo}
                              // defaultValue={cardNo[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilter}
                              // defaultValue={moreFilter[0]}
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
              {/* <p>hey this is saurabh</p> */}
              {
                loading ?
                  <><div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-dark" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div></>
                  :
                  <Table dataSource={tabledata} columns={columns} Selection={true} />

              }

              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Member */}
      <div className="modal fade" id="add_library_members">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Member</h4>
              <button
                type="button"
                onClick={(e) => handleCancel(e)}
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
                    <div className="my-3 text-center">
                      <label className="form-label d-block fw-semibold">Profile Photo</label>

                      <div className="position-relative mx-auto" style={{ width: 120, height: 120 }}>
                        <label
                          htmlFor="memimg"
                          className="d-flex align-items-center justify-content-center border rounded-circle shadow-sm bg-light position-relative overflow-hidden"
                          style={{
                            width: "120px",
                            height: "120px",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)")}
                        >
                          {preview ? (
                            <>
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-100 h-100 rounded-circle"
                                style={{ objectFit: "cover" }}
                              />
                              {/* Overlay for change button */}
                              <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white opacity-0 hover-overlay"
                                style={{
                                  transition: "opacity 0.3s ease-in-out",
                                  borderRadius: "50%",
                                }}
                              >
                                <i className="ti ti-camera fs-3"></i>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-muted">
                              <i className="ti ti-upload fs-1 d-block mb-1"></i>
                              <small>Upload</small>
                            </div>
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

                      {/* Error message */}
                      {errors.image && (
                        <small className="text-danger d-block mt-2">{errors.image}</small>
                      )}
                    </div>

                    <div className="text-center "> {errors.image && <small className="text-danger">{errors.image}</small>}</div>

                  </div>
                </div>
              </div>



              {/* Footer */}
              <div className="modal-footer">
                <button type="button"
                  onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
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
                onClick={(e) => handleCancel(e)}
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
                    <div className="my-3 text-center">
                      <label className="form-label d-block fw-semibold">Profile Photo</label>

                      <div className="position-relative mx-auto" style={{ width: 120, height: 120 }}>
                        <label
                          htmlFor="memimg"
                          className="d-flex align-items-center justify-content-center border rounded-circle shadow-sm bg-light position-relative overflow-hidden"
                          style={{
                            width: "120px",
                            height: "120px",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)")}
                        >
                          {preview ? (
                            <>
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-100 h-100 rounded-circle"
                                style={{ objectFit: "cover" }}
                              />
                              {/* Overlay for change button */}
                              <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white opacity-0 hover-overlay"
                                style={{
                                  transition: "opacity 0.3s ease-in-out",
                                  borderRadius: "50%",
                                }}
                              >
                                <i className="ti ti-camera fs-3"></i>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-muted">
                              <i className="ti ti-upload fs-1 d-block mb-1"></i>
                              <small>Upload</small>
                            </div>
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

                      {/* Error message */}
                      {errors.image && (
                        <small className="text-danger d-block mt-2">{errors.image}</small>
                      )}
                    </div>

                    <div className="text-center "> {errors.image && <small className="text-danger">{errors.image}</small>}</div>

                  </div>
                </div>
              </div>



              {/* Footer */}
              <div className="modal-footer">
                <button type="button"
                  onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="submit"
                  // data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Edit Member
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Member */}

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

export default LibraryMember;
