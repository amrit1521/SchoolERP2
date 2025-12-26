import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { activeList, departmentSelect } from '../../../core/common/selectoption/selectoption';
import type { TableData } from '../../../core/data/interface';
// import { departments } from '../../../core/data/json/departments';
import PredefinedDateRanges from '../../../core/common/datePicker';
import CommonSelect from '../../../core/common/commonSelect';
import { all_routes } from '../../../router/all_routes';
import TooltipOption from '../../../core/common/tooltipOption';
import { toast } from 'react-toastify';
import { addDepartment, allDepartment, deleteDepartment, editDeprtment, speDepartment } from '../../../service/department';
import { handleModalPopUp } from '../../../handlePopUpmodal';
import { Spinner } from '../../../spinner';

export interface Department {
  id: number;
  name: string;
  status: string;
}

export interface DepartmentFormData {
  name: string;
  status: string;
}



const Departments = () => {
  const routes = all_routes;
  // const data = departments;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [departmentData, setDepartmentData] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDepartment = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await allDepartment()
      if (data.success) {
        setDepartmentData(data.data)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartment()
  }, [])

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    status: "1",
  });
  const [editId, setEditId] = useState<number | null>(null)


  // handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };


  // edit
  const fetchById = async (id: number) => {

    try {

      const { data } = await speDepartment(id)
      if (data.success) {
        setFormData({
          name: data.data.name,
          status: data.data.status
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

    setFormData({
      name: "",
      status: "1"
    })
    setEditId(null)

  }

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.warning("Department name is required!");
    }

    try {
      const apiCall = editId
        ? () => editDeprtment(formData, editId)
        : () => addDepartment(formData);

      const { data } = await apiCall();

      if (data.success) {
        toast.success(data.message);
        handleModalPopUp(editId ? "edit_department" : "add_department");
        setEditId(null);
        setFormData({ name: "", status: "1" });
        fetchDepartment();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };


  // delete holiday------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)


  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {

      const { data } = await deleteDepartment(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchDepartment()

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
      render: (id: number) => (
        <>
          <Link to="#" className="link-primary">{id}</Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Department",
      dataIndex: "name",
      render: (text: string) => (
        <span className='text-capitalize'>{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.department.length - b.department.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text == "1" ? (
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
      sorter: (a: TableData, b: TableData) =>
        a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
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
                    onClick={() => fetchById(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_department"
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
          </div>


        </>
      ),

    },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Department</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Department
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
                  data-bs-target="#add_department"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Department
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Department List</h4>
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
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Department</label>
                              <CommonSelect
                                className="select"
                                options={departmentSelect}

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
                    Sort by A-Z{" "}
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
              {/* Student List */}
              {
                loading ? <Spinner /> : (<Table columns={columns} dataSource={departmentData} Selection={true} />)
              }
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      <>
        {/* Add Department */}
        <div className="modal fade" id="add_department">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h4 className="modal-title">Add Department</h4>
                <button
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
                    {/* Department Name */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Department Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter department name"

                        />
                      </div>
                    </div>

                    {/* Status Toggle */}
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
                          onChange={handleInputChange}
                          name="status"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={(e) => cancelEdit(e)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Department */}
        {/* Edit Department */}
        <div className="modal fade" id="edit_department">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Department</h4>
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
                    {/* Department Name */}
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Department Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter department name"

                        />
                      </div>
                    </div>

                    {/* Status Toggle */}
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
                          onChange={handleInputChange}
                          name="status"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={(e) => cancelEdit(e)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Department */}
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
                    You want to delete all the marked items, this cant be undone once
                    you delete.
                  </p>
                  {
                    deleteId && (
                      <div className="d-flex justify-content-center">
                        <button
                          onClick={(e) => cancelDelete(e)}
                          className="btn btn-light me-3"
                          data-bs-dismiss="modal"
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
        </div>
        {/* /Delete Modal */}
      </>

    </div>
  )
}

export default Departments
