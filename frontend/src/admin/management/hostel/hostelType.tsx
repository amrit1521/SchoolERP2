import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  roomtype,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";

import { toast } from "react-toastify";
import { addHostelRoomType, allHostelRoomType, deleteRoomType, edithostelRoomType, speHostelRoomType } from "../../../service/hostel";
import { Spinner } from "../../../spinner";
import { handleModalPopUp } from "../../../handlePopUpmodal";

interface HostelRoomType {
  id: number;
  roomType: string;
  description: string;
}


// add 
interface RoomTypeFormData {
  roomType: string;
  description: string;
}

interface RoomTypeErrors {
  roomType?: string;
  description?: string;
}
const HostelType = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = hostelroomType;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };


  const [roomTypes, setRoomTypes] = useState<HostelRoomType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchHostelRoomTypes = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await allHostelRoomType()
      if (data.success) {
        setRoomTypes(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchHostelRoomTypes()
  }, [])


  // add hostel room type
  const [formData, setFormData] = useState<RoomTypeFormData>({
    roomType: "",
    description: "",
  });
  const [errors, setErrors] = useState<RoomTypeErrors>({});
  const [editId, setEditId] = useState<number | null>(null)


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateForm = (): boolean => {
    const newErrors: RoomTypeErrors = {};

    if (!formData.roomType.trim()) {
      newErrors.roomType = "Room type is required!";
    } else if (formData.roomType.length < 10) {
      newErrors.roomType = "Room type must be at least 10 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required !.";
    } else if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchById = async (id: number) => {
    if (!id) return
    try {

      const { data } = await speHostelRoomType(id)
      if (data.success) {
        setFormData({
          roomType: data.data.roomType,
          description: data.data.description
        })
        setEditId(id)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const apiCall = editId
        ? edithostelRoomType(formData, editId)
        : addHostelRoomType(formData);

      const { data } = await apiCall;

      if (data.success) {
        toast.success(data.message);
        handleModalPopUp(editId ? "edit_hostel_room_type" : "add_hostel_room_type");
        fetchHostelRoomTypes();
        setFormData({
          roomType: "",
          description: ""
        })
        setEditId(null)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error(error);
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    setFormData({
      roomType: "",
      description: "",
    });
    setErrors({})
  }

  // delete----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const { data } = await deleteRoomType(id)
      if (data.success) {
        toast.success(data.message)
        fetchHostelRoomTypes();
        setDeleteId(null)
        handleModalPopUp('delete-modal')
      }

    } catch (error) {
      console.log(error)
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
      render: (id: number) => (
        <Link to="#" className="link-primary">
          HRT{id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.roomType.length - b.roomType.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.description.length - b.description.length,
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
                    onClick={() => fetchById(record.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_hostel_room_type"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setDeleteId(record.id)}
                    className="dropdown-item rounded-1"
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
              <h3 className="page-title mb-1">Room Type</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Room Type
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
                  data-bs-target="#add_hostel_room_type"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Room Type
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Room Type</h4>
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Type</label>
                              <CommonSelect
                                className="select"
                                options={roomtype}
                                defaultValue={undefined}
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
                loading ? <Spinner /> : (<Table dataSource={roomTypes} columns={columns} Selection={true} />)
              }
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Add Room Type*/}
        <div className="modal fade" id="add_hostel_room_type">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h4 className="modal-title">Add Room Type</h4>
                <button
                  onClick={(e) => handleCancel(e)}
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Room Type Field */}
                      <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <input
                          type="text"
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className={`form-control ${errors.roomType ? "is-invalid" : ""}`}
                          placeholder="Enter room type"
                        />
                        {errors.roomType && (
                          <div className="invalid-feedback">{errors.roomType}</div>
                        )}
                      </div>

                      {/* Description Field */}
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          rows={4}
                          placeholder="Add description..."
                        />
                        {errors.description && (
                          <div className="invalid-feedback">{errors.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    onClick={(e) => handleCancel(e)}
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Room Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Room Type */}
        {/* Edit Room Type */}
        <div className="modal fade" id="edit_hostel_room_type">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h4 className="modal-title">Edit Room Type</h4>
                <button
                  onClick={(e) => handleCancel(e)}
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Room Type Field */}
                      <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <input
                          type="text"
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className={`form-control ${errors.roomType ? "is-invalid" : ""}`}
                          placeholder="Enter room type"
                        />
                        {errors.roomType && (
                          <div className="invalid-feedback">{errors.roomType}</div>
                        )}
                      </div>

                      {/* Description Field */}
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          rows={4}
                          placeholder="Add description..."
                        />
                        {errors.description && (
                          <div className="invalid-feedback">{errors.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    onClick={(e) => handleCancel(e)}
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Room Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Room Type */}
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
                    You want to delete all the marked items, this cant be undone
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
    </>
  );
};

export default HostelType;
