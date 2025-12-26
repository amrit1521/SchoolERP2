import React, { useEffect, useRef, useState } from "react";
// import { classRoom } from "../../../core/data/json/class-room";
import Table from "../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../core/common/datePicker";
import {
  capacitycount,
  count,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import { addClassRoom, allClassRoom, deleteClassRoom, editClassRoom, speClassRoom } from "../../../service/classApi";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";




const ClassRoom = () => {

  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  // fetchallclassroom-------------------------------------------------

  const [allroom, setAllroom] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)


  const fetchAllClassRoom = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
   
    try {
      const { data } = await allClassRoom()
      if (data.success) {
        setAllroom(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllClassRoom()
  }, [])




  // addclassroom------------------------------------------------------
  interface ClassRoom {
    room_no: string;
    capacity: string;
    status: string;
  }
  const [formData, setFormData] = useState<ClassRoom>({
    room_no: "",
    capacity: "",
    status: "1",
  });
  const [errors, setErrors] = useState<{ room_no?: string; capacity?: string }>(
    {}
  );
  const [editId, setEditId] = useState<number | null>(null)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const validate = () => {
    let tempErrors: { room_no?: string; capacity?: string } = {};
    let isValid = true;

    // Room No validation
    if (!formData.room_no) {
      tempErrors.room_no = "Room No is required.";
      isValid = false;
    } else if (Number(formData.room_no) <= 0) {
      tempErrors.room_no = "Room No must be a positive number.";
      isValid = false;
    }

    // Capacity validation
    if (!formData.capacity) {
      tempErrors.capacity = "Capacity is required.";
      isValid = false;
    } else if (Number(formData.capacity) <= 0) {
      tempErrors.capacity = "Capacity must be greater than 0.";
      isValid = false;
    } else if (Number(formData.capacity) > 40) {
      tempErrors.capacity = "Maximum capacity allowed is 40 students.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // fetch class room for edit by id
  const fetchClassRoomByid = async (id: number) => {
    try {
      const { data } = await speClassRoom(id)
      if (data.success) {
        setEditId(id)
        setFormData({
          room_no: data.data.room_no,
          capacity: data.data.capacity,
          status: data.data.status,
        });

      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({
      room_no: "",
      capacity: "",
      status: "1",
    });
    setErrors({});
    setEditId(null)
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {

      if (editId) {
        const { data } = await editClassRoom(formData, editId)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('edit_class_room')
          setEditId(null)
        }
      } else {
        const { data } = await addClassRoom(formData)

        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('add_class_room')

        }
      }

      fetchAllClassRoom()
      setFormData({
        room_no: "",
        capacity: "",
        status: "1",
      });
      setErrors({});
    } catch (error:any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };



  // delete class room-----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteClassRoom(id)
      if (data.success) {
        toast.success(data.message)
        fetchAllClassRoom()
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
        <>
          <div className="link-primary">
            RM{text}
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },

    {
      title: "Room No",
      dataIndex: "room_no",
      sorter: (a: ClassRoom, b: ClassRoom) => a.room_no.length - b.room_no.length,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      sorter: (a: TableData, b: TableData) =>
        a.capacity.length - b.capacity.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "1" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            Active
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            Inactive
          </span>
        ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
        <>
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
                  onClick={(() => fetchClassRoomByid(id))}
                  data-bs-toggle="modal"
                  data-bs-target="#edit_class_room"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={(() => setDeleteId(id))}
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Class Room</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Class Room
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
                    data-bs-target="#add_class_room"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Class Room
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Room</h4>
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
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Room No</label>
                                <CommonSelect
                                  className="select"
                                  options={count}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Capacity</label>
                                <CommonSelect
                                  className="select"
                                  options={capacitycount}
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
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 active">
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
                {/* Guardians List */}
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (<Table columns={columns} dataSource={allroom} Selection={true} />)
                }

                {/* /Guardians List */}
              </div>
            </div>
            {/* /Guardians List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <div>


        {/* Add Class Room */}

        
        <div className="modal fade" id="add_class_room">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Class Room</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* Controlled Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Room No */}
                      <div className="mb-3">
                        <label className="form-label">Room No</label>
                        <input
                          type="number"
                          className={`form-control ${errors.room_no ? "is-invalid" : ""
                            }`}
                          name="room_no"
                          value={formData.room_no}
                          onChange={handleChange}
                          placeholder="Enter Room No"
                        />
                        {errors.room_no && (
                          <div className="text-danger">{errors.room_no}</div>
                        )}
                      </div>

                      {/* Capacity */}
                      <div className="mb-3">
                        <label className="form-label">Capacity</label>
                        <input
                          type="number"
                          className={`form-control ${errors.capacity ? "is-invalid" : ""
                            }`}
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="Enter Capacity"
                        />
                        {errors.capacity && (
                          <div className="text-danger">{errors.capacity}</div>
                        )}
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
                            role="switch"
                            id="switch-sm"
                            name="status"
                            checked={formData.status === "1"}
                            onChange={handleChange}
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
                    Add Class Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* /Add Class Room */}
        {/* Edit Class Room */}
        <div className="modal fade" id="edit_class_room">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Class Room</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>


              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Room No */}
                      <div className="mb-3">
                        <label className="form-label">Room No</label>
                        <input
                          type="number"
                          className={`form-control ${errors.room_no ? "is-invalid" : ""
                            }`}
                          name="room_no"
                          value={formData.room_no}
                          onChange={handleChange}
                          placeholder="Enter Room No"
                        />
                        {errors.room_no && (
                          <div className="text-danger">{errors.room_no}</div>
                        )}
                      </div>

                      {/* Capacity */}
                      <div className="mb-3">
                        <label className="form-label">Capacity</label>
                        <input
                          type="number"
                          className={`form-control ${errors.capacity ? "is-invalid" : ""
                            }`}
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="Enter Capacity"
                        />
                        {errors.capacity && (
                          <div className="text-danger">{errors.capacity}</div>
                        )}
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
                            role="switch"
                            id="switch-sm"
                            name="status"
                            checked={formData.status === "1"}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>
        {/* /Edit Class Room */}


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
      </div>
    </div>
  );
};

export default ClassRoom;
