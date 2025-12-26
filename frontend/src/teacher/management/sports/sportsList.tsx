import React, { useEffect, useRef, useState } from "react";
// import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  coachName,
  moreFilterSport,
  // sports,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import { sportListData } from "../../../core/data/json/sportsList";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  addSport,
  allSport,
  deleteSport,
  editSport,
  speSport,
} from "../../../service/sport";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { Spinner } from "../../../spinner";
import { getAllRolePermissions } from "../../../service/api";
import { teacher_routes } from "../../../router/teacher_routes";

interface SportData {
  id: number;
  sports: string;
  coachName: string;
  year: string;
}

interface SportFormData {
  name: string;
  coach: string;
  year: string;
}

const initailData = { name: "", coach: "", year: "" };

const TSportsList = () => {
  // const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = sportListData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  type Permission = {
    can_create?: boolean;
    can_delete?: boolean;
    can_edit?: boolean;
    can_view?: boolean;
  } | null;
  const [permission, setPermission] = useState<Permission>(null);
  const [sports, setSports] = useState<SportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SportFormData>(initailData);
  const [errors, setErrors] = useState(initailData);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "Players")
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

  const fetchSports = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    try {
      const { data } = await allSport();
      if (data.success) {
        setSports(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchSports();
  }, []);

  // add sport

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateSportForm = (formData: SportFormData) => {
    const newErrors = { name: "", coach: "", year: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Sport name is required";
      isValid = false;
    }

    if (!formData.coach.trim()) {
      newErrors.coach = "Coach name is required";
      isValid = false;
    }

    if (!formData.year.trim()) {
      newErrors.year = "Started year is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = "Please enter a valid year (e.g. 2024)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const fetchById = async (id: number) => {
    console.log(id);
    if (!id) return;

    try {
      const { data } = await speSport(id);
      console.log(data.data);
      if (data.success) {
        setFormData({
          name: data.data.name,
          coach: data.data.coach,
          year: data.data.year,
        });
        setEditId(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSportForm(formData)) return;

    try {
      if (editId) {
        const { data } = await editSport(formData, editId);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("edit_sports");
        }
      } else {
        const { data } = await addSport(formData);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("add_sports");
        }
      }
      setFormData(initailData);
      setEditId(null);
      fetchSports();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData(initailData);
    setEditId(null);
  };

  // delete----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const { data } = await deleteSport(id);
      if (data.success) {
        toast.success(data.message);
        fetchSports();
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

  const columns: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <Link to="#" className="link-primary">
          SP{id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "sports",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: TableData, b: TableData) => a.sports.length - b.sports.length,
    },
    {
      title: "Coach",
      dataIndex: "coachName",

      render: (text: string) => (
        <>
          <div className="d-flex align-items-center text-capitalize">
            {/* <Link to="#" className="avatar avatar-md">
              <ImageWithBasePath
                src={record.img2}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link> */}
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to="#">{text}</Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.coachName.length - b.coachName.length,
    },
    {
      title: "Started Year",
      dataIndex: "year",
      sorter: (a: TableData, b: TableData) => a.year.length - b.year.length,
    },
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14"></i>
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              {permission?.can_edit ? (
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchById(record.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_sports"
                  >
                    <i className="ti ti-edit-circle me-2"></i>Edit
                  </button>
                </li>
              ) : null}
              {permission?.can_delete ? (
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
              ) : null}
            </ul>
          </div>
        </div>
      ),
    });
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Sports</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={teacher_routes.teacherDashboard}>
                      Teacher Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Sports
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
                    data-bs-target="#add_sports"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Sport
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Sports</h4>
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
                              <label className="form-label">Name</label>
                              {/* <CommonSelect
                                className="select"
                                options={sports}
                                defaultValue={undefined}
                              /> */}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Coach</label>
                              <CommonSelect
                                className="select"
                                options={coachName}
                                // defaultValue={coachName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterSport}
                                // defaultValue={moreFilterSport[0]}
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
              {loading ? (
                <Spinner />
              ) : (
                <Table dataSource={sports} columns={columns} Selection={true} />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Sports */}
      <div className="modal fade" id="add_sports">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Sport</h4>
              <button
                type="button"
                onClick={(e) => handleCancel(e)}
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Sport Name"
                  />
                  {errors.name && (
                    <div className="text-danger mt-1">{errors.name}</div>
                  )}
                </div>

                {/* Coach Field */}
                <div className="mb-3">
                  <label className="form-label">Coach</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.coach ? "is-invalid" : ""
                    }`}
                    name="coach"
                    value={formData.coach}
                    onChange={handleInputChange}
                    placeholder="Enter Coach Name"
                  />
                  {errors.coach && (
                    <div className="text-danger mt-1">{errors.coach}</div>
                  )}
                </div>

                {/* Year Field */}
                <div className="mb-0">
                  <label className="form-label">Started Year</label>
                  <DatePicker
                    className={`form-control datetimepicker ${
                      errors.year ? "is-invalid" : ""
                    }`}
                    format="YYYY"
                    picker="year"
                    value={formData.year ? dayjs(formData.year, "YYYY") : null}
                    onChange={(date) =>
                      handleDateChange(
                        "year",
                        date ? dayjs(date).format("YYYY") : ""
                      )
                    }
                    placeholder="Select Year"
                  />
                  {errors.year && (
                    <div className="text-danger mt-1">{errors.year}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancel(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Sport
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add Sports */}
      {/* Edit Sports */}
      <div className="modal fade" id="edit_sports">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Sport</h4>
              <button
                type="button"
                onClick={(e) => handleCancel(e)}
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Sport Name"
                  />
                  {errors.name && (
                    <div className="text-danger mt-1">{errors.name}</div>
                  )}
                </div>

                {/* Coach Field */}
                <div className="mb-3">
                  <label className="form-label">Coach</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.coach ? "is-invalid" : ""
                    }`}
                    name="coach"
                    value={formData.coach}
                    onChange={handleInputChange}
                    placeholder="Enter Coach Name"
                  />
                  {errors.coach && (
                    <div className="text-danger mt-1">{errors.coach}</div>
                  )}
                </div>

                {/* Year Field */}
                <div className="mb-0">
                  <label className="form-label">Started Year</label>
                  <DatePicker
                    className={`form-control datetimepicker ${
                      errors.year ? "is-invalid" : ""
                    }`}
                    format="YYYY"
                    picker="year"
                    value={formData.year ? dayjs(formData.year, "YYYY") : null}
                    onChange={(date) =>
                      handleDateChange(
                        "year",
                        date ? dayjs(date).format("YYYY") : ""
                      )
                    }
                    placeholder="Select Year"
                  />
                  {errors.year && (
                    <div className="text-danger mt-1">{errors.year}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancel(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Edit Sport
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Sports */}
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
    </>
  );
};

export default TSportsList;
