import React, { useEffect, useRef, useState } from "react";
// import { designation } from "../../../core/data/json/designation";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import CommonSelect from "../../../core/common/commonSelect";
import { activeList, holidays } from "../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { toast } from "react-toastify";
import { adddesignation, alldesignation, deletedesignation, editDesignation, spedesignation } from "../../../service/designation";

import { Spinner } from "../../../spinner";



export interface Designation {
  id: number;
  designation: string;
  status: string;
}

export interface DeginationForm {
  designation: string;
  status: string;
}



const Designation = () => {
  const routes = all_routes;



  const [desginationData, setDesignationData] = useState<Designation[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addModal, setAddModal] = useState<boolean>(false)
    const [editModal, setEditModal] = useState<boolean>(false)

  const fetchDesignation = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await alldesignation()
      if (data.success) {
        setDesignationData(data.data)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchDesignation()
  }, [])


  // add designation
  const [formData, setFormData] = useState({
    designation: "",
    status: "1",
  })
  const [editId, setEditId] = useState<number | null>(null)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({ ...prev, [name]: (type === 'checkbox') ? (checked ? "1" : "0") : value }))
  }

  // edit

  const fetchById = async (id: number) => {

    try {
      const { data } = await spedesignation(id)

      if (data.success) {
        setEditModal(true)
        setFormData({
          designation: data.data.designation,
          status: data.data.status
        })
        setEditId(id)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.dta.messsage)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    if (!formData.designation) {
      toast.warning("Designation is required !")
    }
    try {

      const apiCall = editId
        ? () => editDesignation(formData, editId)
        : () => adddesignation(formData)

      const { data } = await apiCall()
      if (data.success) {
        toast.success(data.message)
        fetchDesignation()
     
        setEditId(null)
        setFormData({
          designation: "",
          status: "1"
        })
        setAddModal(false)
        setEditModal(false)

      }


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditId(null)
    setFormData({
      designation: "",
      status: "1"
    })
    setAddModal(false)
    setEditModal(false)
  }

  // delete holiday------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delModal ,setDelModal] = useState<boolean>(false)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {

      const { data } = await deletedesignation(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchDesignation()

        setDelModal(false)

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
    setDelModal(false)
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <>
          <Link to="#" className="link-primary">{id}</Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      render:(text:string)=>(
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.designation.length - b.designation.length,
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
                 
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() =>{ setDeleteId(id)
                    setDelModal(true)
                   }}
                 
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
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Designation</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Designation
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={()=>setAddModal(true)}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Designation
                  </button>
                </div>
              </div>
            </div>
            {/* /Page Header */}

            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Designation</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                    {/* <PredefinedDateRanges /> */}
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
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Holiday Title</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-0">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={holidays}
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
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
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

                {
                  loading ? <Spinner /> : (<Table columns={columns} dataSource={desginationData} Selection={true} />)
                }

              </div>
            </div>

          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Designation */}
         {
          addModal&&(<div className="modal fade show d-block" id="add_designation">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Designation</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                    onClick={(e) => handleCancel(e)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit} >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="switch-sm"
                          checked={formData.status === "1"}
                          onChange={handleChange}
                          name="status"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-light me-2"
                   
                    type="button"
                    onClick={(e) => handleCancel(e)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Designation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
         }
        {/* Add Designation */}
        {/* Edit Designation */}
        {
          editModal&&( <div className="modal fade show d-block" id="edit_designation">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Designation</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  onClick={(e) => handleCancel(e)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit} >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="switch-sm"
                          checked={formData.status === "1"}
                          onChange={handleChange}
                          name="status"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-light me-2"
                  
                    type="button"
                    onClick={(e) => handleCancel(e)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Designation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
        }
        {/* Edit Department */}
        {/* Delete Modal */}
         {
          delModal&&(<div className="modal fade show d-block" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete this item, this can not be undone once
                    you delete.
                  </p>
                  {
                    deleteId && (
                      <div className="d-flex justify-content-center">
                        <button
                          onClick={(e) => cancelDelete(e)}
                          className="btn btn-light me-3"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button className="btn btn-danger" onClick={(e) => handleDelete(deleteId, e)}>
                          Yes, Delete
                        </button>

                      </div>
                    )}
                </div>
              </form>
            </div>
          </div>
        </div>)
         }
        {/* /Delete Modal */}
      </>
    </div>
  );
};

export default Designation;
