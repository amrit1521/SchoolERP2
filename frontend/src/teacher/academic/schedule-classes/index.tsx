import React, { useEffect, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
// import { scheduleClass } from "../../../core/data/json/schedule_class";
import PredefinedDateRanges from "../../../core/common/datePicker";
import {
  activeList,
  classselect,
  startTime,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import {
  addClassSchedule,
  allClassSchedule,
  deleteClassSchedule,
  editClassSchedule,
  speClassSchedule,
} from "../../../service/classApi";
import { toast } from "react-toastify";
import { Spinner } from "../../../spinner";
import { handleModalPopUp } from "../../../handlePopUpmodal";
// import { all_routes } from "../../../router/all_routes";
import { getAllRolePermissions } from "../../../service/api";
import { teacher_routes } from "../../../admin/router/teacher_routes";

const TScheduleClasses = () => {
  // const data = scheduleClass;
  // const route = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  interface Schedule {
    id: number;
    className: string;
    startTime: string;
    endTime: string;
    status: string;
  }
  const token = localStorage.getItem("token");
  const roleId = token ? JSON.parse(token)?.role : null;
  // const userId = token ? JSON.parse(token)?.id : null;
  const [permission, setPermission] = useState<any>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "ScheduleClasses")
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

  const fetchSchedule = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await allClassSchedule();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchSchedule();
  }, []);

  // addschedule------------------------------------------
  interface ScheduleForm {
    className: string;
    startTime: string;
    endTime: string;
    status: string;
  }

  interface ScheduleErrors {
    className?: string;
    startTime?: string;
    endTime?: string;
  }

  const [formData, setFormData] = useState<ScheduleForm>({
    className: "",
    startTime: "",
    endTime: "",
    status: "1",
  });

  const [errors, setErrors] = useState<ScheduleErrors>({});
  const [editId, setEditId] = useState<number | null>(null);

  const validate = (): boolean => {
    const newErrors: ScheduleErrors = {};

    if (!formData.className) newErrors.className = "className is required";
    if (!formData.startTime) newErrors.startTime = "Start Time is required";
    if (!formData.endTime) newErrors.endTime = "End Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectChange = (
    field: keyof ScheduleForm,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  // edit
  const fetchScheduleById = async (id: number) => {
    try {
      const { data } = await speClassSchedule(id);
      // console.log(data)
      if (data.success) {
        setFormData({
          className: data.data.className,
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          status: data.data.status,
        });
        setEditId(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditId(null);
    setFormData({
      className: "",
      startTime: "",
      endTime: "",
      status: "1",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editId) {
        const { data } = await editClassSchedule(formData, editId);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("edit_Schedule");
          setEditId(null);
        }
      } else {
        const { data } = await addClassSchedule(formData);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("add_Schedule");
        }
      }
      fetchSchedule();
      setFormData({
        className: "",
        startTime: "",
        endTime: "",
        status: "1",
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    // console.log(id)
    try {
      const { data } = await deleteClassSchedule(id);
      if (data.success) {
        toast.success(data.message);
        fetchSchedule();
        setDeleteId(null);
        handleModalPopUp("delete-modal");
      }
    } catch (error) {
      console.log(error);
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
          SC{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Class",
      dataIndex: "className",
      sorter: (a: Schedule, b: Schedule) =>
        a.className.length - b.className.length,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      sorter: (a: TableData, b: TableData) =>
        a.startTime.length - b.startTime.length,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      sorter: (a: TableData, b: TableData) =>
        a.endTime.length - b.endTime.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "1" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Active
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            Inactive
          </span>
        ),
    },
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id - b.id,
      render: (id: number) => (
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
              {permission?.can_edit && (
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchScheduleById(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_Schedule"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
              )}
              {permission?.can_delete && (
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
              )}
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
              <h3 className="page-title mb-1">Schedule</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={teacher_routes.teacherDashboard}>
                      Teacher Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Classes </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Schedule
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
                    data-bs-target="#add_Schedule"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Schedule
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}
          {/* Guardians List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Schedule Classes</h4>
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
                              <label className="form-label">Type</label>
                              <CommonSelect
                                className="select"
                                options={classselect}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
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
                <Spinner />
              ) : (
                <Table
                  columns={columns}
                  dataSource={schedules}
                  Selection={true}
                />
              )}
              {/* /Guardians List */}
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <div>
        {/* Add Schedule */}
        <div className="modal fade" id="add_Schedule">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Schedule</h4>
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
                      {/* Type */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className="select"
                          options={classselect}
                          value={formData.className}
                          onChange={(opt) =>
                            handleSelectChange(
                              "className",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.className && (
                          <small className="text-danger">
                            {errors.className}
                          </small>
                        )}
                      </div>

                      {/* Start Time */}
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={formData.startTime}
                          onChange={(opt) =>
                            handleSelectChange(
                              "startTime",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.startTime && (
                          <small className="text-danger">
                            {errors.startTime}
                          </small>
                        )}
                      </div>

                      {/* End Time */}
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={formData.endTime}
                          onChange={(opt) =>
                            handleSelectChange("endTime", opt ? opt.value : "")
                          }
                        />
                        {errors.endTime && (
                          <small className="text-danger">
                            {errors.endTime}
                          </small>
                        )}
                      </div>

                      {/* Status Toggle */}
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

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Schedule */}
        {/* Edit Schedule */}
        <div className="modal fade" id="edit_Schedule">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Schedule</h4>
                <button
                  type="button"
                  onClick={(e) => cancelEdit(e)}
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
                      {/* Type */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className="select"
                          options={classselect}
                          value={formData.className}
                          onChange={(opt) =>
                            handleSelectChange(
                              "className",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.className && (
                          <small className="text-danger">
                            {errors.className}
                          </small>
                        )}
                      </div>

                      {/* Start Time */}
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={formData.startTime}
                          onChange={(opt) =>
                            handleSelectChange(
                              "startTime",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.startTime && (
                          <small className="text-danger">
                            {errors.startTime}
                          </small>
                        )}
                      </div>

                      {/* End Time */}
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <CommonSelect
                          className="select"
                          options={startTime}
                          value={formData.endTime}
                          onChange={(opt) =>
                            handleSelectChange("endTime", opt ? opt.value : "")
                          }
                        />
                        {errors.endTime && (
                          <small className="text-danger">
                            {errors.endTime}
                          </small>
                        )}
                      </div>

                      {/* Status Toggle */}
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

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => cancelEdit(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Schedule */}

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
    </div>
  );
};

export default TScheduleClasses;
