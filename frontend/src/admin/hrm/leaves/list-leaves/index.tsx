import React, { useEffect, useRef, useState } from "react";
import type { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { activeList, leaveType } from "../../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { addLeaveType, deleteLeaveType, editLeaveType, getAllLeaveTypeData, speLeaveType } from "../../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../../handlePopUpmodal";

const ListLeaves = () => {
  const routes = all_routes;

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };



  interface LeaveTypeData {
    id: number;
    name: string;
    total_allowed: number;
    status: string;
  }

  const [leaveData, setLeaveData] = useState<LeaveTypeData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchLeaveData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await getAllLeaveTypeData()
      if (data.success) {
        setLeaveData(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [])



  // add leave ===========================================
  interface LeaveFormData {
    name: string;
    total_allowed: string;
    status: string;
  }

  const [formData, setFormData] = useState<LeaveFormData>({
    name: "",
    total_allowed: "",
    status: "1",
  });

  
  const [editId, setEditId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  // for edit
  const fetchById = async (id: number) => {
    try {
      const { data } = await speLeaveType(id)
      if (data.success) {
        setFormData({
          name: data.data.name,
          total_allowed: data.data.total_allowed,
          status: data.data.status,
        })
        setEditId(id)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditId(null)
    setFormData({
      name: "",
      total_allowed: "",
      status: "1",
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await editLeaveType(formData, editId)
        if (data.success) {
          toast.success(data.message)
          setEditId(null)
          handleModalPopUp('edit_leaves')
        }

      } else {

        const { data } = await addLeaveType(formData)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('add_leaves')
        }
      }

      setFormData({
        name: "",
        total_allowed: "",
        status: "1",
      })
      fetchLeaveData()

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)

    }
  };



  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(id)
    try {

      const { data } = await deleteLeaveType(id)
      if (data.success) {
        toast.success(data.message)
        fetchLeaveData();
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



  const tableData = leaveData.map((leave) => ({
    key: leave.id,
    id: leave.id,
    leaveType: leave.name,
    status: leave.status
  }))

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <>
          <Link to="#" className="link-primary">{text}</Link>
        </>
      ),
      sorter: (a: any, b: any) => a.id - b.id,
    },

    {
      title: "Leave Type",
      dataIndex: "leaveType",
      render: (text: string) => (
        <>
          <div className="text-capitalize">{text}</div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span
              className="badge badge-soft-success d-inline-flex align-items-center"
            >
              <i className='ti ti-circle-filled fs-5 me-1'></i>Active
            </span>
          ) :
            (
              <span
                className="badge badge-soft-danger d-inline-flex align-items-center"
              >
                <i className='ti ti-circle-filled fs-5 me-1'></i>Inactive
              </span>
            )}
        </>
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
                  onClick={() => fetchById(id)}
                  data-bs-toggle="modal"
                  data-bs-target="#edit_leaves"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => setDeleteId(id)}
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
                <h3 className="page-title mb-1">Leave</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Leave Type
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_leaves"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Leave Type
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Leave List</h4>
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
                    <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                      <form >
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Leave Type</label>

                                <CommonSelect
                                  className="select"
                                  options={leaveType}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
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
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 active"
                        >
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* List Leaves List */}
                {
                  loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (<Table columns={columns} dataSource={tableData} Selection={true} />)}
                {/* / List Leaves List */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Leaves */}
        <div className="modal fade" id="add_leaves">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Leave Type</h4>
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
                      <div className="mb-3">
                        <label className="form-label">Leave Type</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No Of Days</label>
                        <input
                          type="number"
                          name="total_allowed"
                          value={formData.total_allowed}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
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
                            checked={formData.status === "1"}
                            onChange={handleChange}
                            role="switch"
                            id="switch-sm"
                          />
                        </div>
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Leave Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Leaves */}
        {/* Edit Leaves */}
        <div className="modal fade" id="edit_leaves">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Leave Type</h4>
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
                      <div className="mb-3">
                        <label className="form-label">Leave Type</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">No Of Days</label>
                        <input
                          type="number"
                          name="total_allowed"
                          value={formData.total_allowed}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
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
                            checked={formData.status === "1"}
                            onChange={handleChange}
                            role="switch"
                            id="switch-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"

                  >
                    Edit Leave Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Leaves */}
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
    </div>
  );
};

export default ListLeaves;
