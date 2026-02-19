import React, { useEffect, useRef, useState } from "react";
// import { classSubject } from "../../../core/data/json/class-subject";
import Table from "../../../core/common/dataTable/index";
import {
  count,
  language,
  typetheory,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import { addSubject, deleteSubject, editSubject, getAllSubject, speSubject } from "../../../service/api";
import { toast } from "react-toastify";


const ClassSubject = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  interface AllSubject {
    id: number;
    name: string;
    code: string;
    type: string;
    status: string;
  }

  const [allSubject, setSAllSubject] = useState<AllSubject[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)

  const fetchAllSubject = async () => {
    setloading(true);
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await getAllSubject();
      if (data.success) {
        setSAllSubject(data.data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAllSubject();
  }, []);



  const tabledata = allSubject.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    code: item.code,
    type: item.type,
    status: item.status === "1" ? "Active" : "Inactive",
  }));



  interface subjecformdata {
    name: string;
    code: string;
    type: string;
    status: string;
  }

  const [fromdata, setformdata] = useState<subjecformdata>({
    name: "",
    code: "",
    type: "",
    status: "",
  });

  const [editId, setEditId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handelSelectChange = (name: keyof subjecformdata, value: string | number) => {
    setformdata((prev) => ({ ...prev, [name]: value }));
  };



  // edit ---------------
  const fetchSubjectById = async (id: number) => {
    try {
      const { data } = await speSubject(id)
      if (data.success) {
        setEditModal(true)
        setformdata({
          name: data.data.name,
          code: data.data.code,
          type: data.data.type,
          status: data.data.status,

        })
        setEditId(id)

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message)

    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (editId) {
        const { data } = await editSubject(fromdata, editId)
        if (data.success) {
          toast.success(data.message)
          setEditModal(false)
          setEditId(null)
        }
      } else {
        const { data } = await addSubject(fromdata);
        if (data.success) {
          toast.success(data.message);
          setAddModal(false)

        }
      }

      setformdata({ name: "", code: "", type: "", status: "" });
      fetchAllSubject();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handeledit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditId(null)
    setformdata({
      name: "", code: "", type: "", status: ""
    })
    setEditModal(false)
    setAddModal(false)
  }


  // delete subject-----------------------------------------------------------------

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delModal, setDelModal] = useState<boolean>(false)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteSubject(id)
      if (data.success) {
        toast.success(data.message)
        fetchAllSubject()

        setDeleteId(null)
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
      render: (text: number) => (
        <Link to="#" className="link-primary">
          SUB{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a: TableData, b: TableData) => a.code.localeCompare(b.code),
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a: TableData, b: TableData) => a.type.localeCompare(b.type),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Active" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (text: number) => (
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
                  onClick={() => fetchSubjectById(text)}

                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => {
                    setDeleteId(text)
                    setDelModal(true)
                  }}

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
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Subjects</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Subjects
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setAddModal(true)}

                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Subject
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Subject Table */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Class Subject</h4>
              <div className="d-flex align-items-center flex-wrap">

                {/* Filter Dropdown */}
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
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={language}
                                defaultValue={language[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Code</label>
                              <CommonSelect
                                className="select"
                                options={count}
                                defaultValue={count[0]}
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
                {/* Sort Dropdown */}
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
                <Table columns={columns} dataSource={tabledata} Selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add Subject Modal */}
      {
        addModal && (<div className="modal fade show d-block" id="add_subject">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subject</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  onClick={(e) => handeledit(e)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Name */}
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          name="name"
                          value={fromdata.name}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Code */}
                      <div className="mb-3">
                        <label className="form-label">Code</label>
                        <CommonSelect
                          className="select"
                          options={count}
                          value={fromdata.code}
                          onChange={(option) =>
                            handelSelectChange("code", option ? option.value : "")
                          }
                        />
                      </div>
                      {/* Type */}
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <CommonSelect
                          className="select"
                          options={typetheory}
                          defaultValue={typetheory[0]}
                          value={fromdata.type}
                          onChange={(option) =>
                            handelSelectChange("type", option ? option.value : "")
                          }
                        />
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
                            id="switch-sm2"
                            name="status"
                            checked={fromdata.status === "1"}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="modal-footer">
                  <button type="button" className="btn btn-light me-2" onClick={(e) => handeledit(e)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
      }

      {/* Edit Subject Modal */}
      {
        editModal && (<div className="modal fade show d-block" id="edit_subject">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Subject</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  onClick={(e) => handeledit(e)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Name */}
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                          name="name"
                          value={fromdata.name}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Code */}
                      <div className="mb-3">
                        <label className="form-label">Code</label>
                        <CommonSelect
                          className="select"
                          options={count}
                          value={fromdata.code}
                          onChange={(option) =>
                            handelSelectChange("code", option ? option.value : "")
                          }
                        />
                      </div>
                      {/* Type */}
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <CommonSelect
                          className="select"
                          options={typetheory}
                          value={fromdata.type}
                          onChange={(option) =>
                            handelSelectChange("type", option ? option.value : "")
                          }
                        />
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
                            id="switch-sm2"
                            name="status"
                            checked={fromdata.status === "1"}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="modal-footer">

                  <button type="button" onClick={(e) => handeledit(e)} className="btn btn-light me-2">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
      }

      {/* Delete Modal */}
      {
        delModal && (<div className="modal fade show d-block" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete , this can't be undone
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
        </div>)
      }
      {/* /Delete Modal */}
    </div>
  );
};

export default ClassSubject;
