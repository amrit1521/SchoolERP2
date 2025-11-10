import React, { useEffect, useRef, useState } from "react";
// import { classSubject } from "../../../core/data/json/class-subject";
import Table from "../../../core/common/dataTable/index";
import {
  count,
  language,
  typetheory,
} from "../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import {
  addSubject,
  deleteSubject,
  editSubject,
  getAllRolePermissions,
  getAllSubject,
  speSubject,
} from "../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
// import { all_routes } from "../../../router/all_routes";
import { teacher_routes } from "../../../admin/router/teacher_routes";

const TClassSubject = () => {
  // const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");
  const roleId = token ? JSON.parse(token)?.role : null;
  // const userId = token ? JSON.parse(token)?.id : null;
  const [permission, setPermission] = useState<any>(null);

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

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "Subjects")
          .map((perm: any) => ({
            can_create: perm?.can_create,
            can_delete: perm?.can_delete,
            can_edit: perm?.can_edit,
            can_view: perm?.can_view,
          }));
        setPermission(currentPermission[0]);
      }
    }
  };

  const fetchAllSubject = async () => {
    setloading(true);
    await new Promise((res) => setTimeout(res, 500));
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
    fetchPermission(roleId);
    fetchAllSubject();
  }, []);

  // Table data को transform करना
  const tabledata = allSubject.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    code: item.code,
    type: item.type,
    status: item.status === "1" ? "Active" : "Inactive",
  }));

  // Form Data
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

  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handelSelectChange = (
    name: keyof subjecformdata,
    value: string | number
  ) => {
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  // edit ---------------
  const fetchSubjectById = async (id: number) => {
    try {
      const { data } = await speSubject(id);
      if (data.success) {
        setformdata({
          name: data.data.name,
          code: data.data.code,
          type: data.data.type,
          status: data.data.status,
        });
        setEditId(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await editSubject(fromdata, editId);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("edit_subject");
          setEditId(null);
        }
      } else {
        const { data } = await addSubject(fromdata);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("add_subject");
        }
      }

      setformdata({ name: "", code: "", type: "", status: "" });
      fetchAllSubject();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handeledit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditId(null);
    setformdata({
      name: "",
      code: "",
      type: "",
      status: "",
    });
  };

  // delete subject-----------------------------------------------------------------

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // console.log(id)
    e.preventDefault();
    try {
      const { data } = await deleteSubject(id);
      if (data.success) {
        toast.success(data.message);
        fetchAllSubject();
        handleModalPopUp("delete-modal");
        setDeleteId(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleteId(null);
  };

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
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "id",
      sorter: (a: any, b: any) => a.id - b.id,
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
              {permission?.can_edit ? (
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchSubjectById(text)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_subject"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
              ) : null}
              {permission?.can_delete ? (
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDeleteId(text)}
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ),
    });
  }

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
                    <Link to={teacher_routes.teacherDashboard}>
                      Teacher Dashboard
                    </Link>
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
              {permission?.can_create ? (
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_subject"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Subject
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}

          {/* Subject Table */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Class Subject</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
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
                <Table
                  columns={columns}
                  dataSource={tabledata}
                  Selection={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add Subject Modal */}
      <div className="modal fade" id="add_subject">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Subject</h4>
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
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Subject Modal */}
      <div className="modal fade" id="edit_subject">
        <div className="modal-dialog modal-dialog-centere">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Subject</h4>
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
                <button
                  onClick={(e) => handeledit(e)}
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
                  You want to delete , this can't be undone once you delete.
                </p>
                {deleteId && (
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => cancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => handleDelete(deleteId, e)}
                      className="btn btn-danger"
                    >
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
    </div>
  );
};

export default TClassSubject;
