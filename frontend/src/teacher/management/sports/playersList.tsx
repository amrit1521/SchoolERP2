import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  playersName,
  sports,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import { sportListData } from "../../../core/data/json/sportsList";
// import SportsModal from "./sportsModal";
import {
  getAllRolePermissions,
  Imageurl,
  stuForOption,
} from "../../../service/api";
import {
  addPlayer,
  allPlayer,
  deletePlayer,
  editPlayer,
  spePlayer,
  sportForOption,
} from "../../../service/sport";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Spinner } from "../../../spinner";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { teacher_routes } from "../../../admin/router/teacher_routes";

interface StudentSport {
  id: number;
  sports: string;
  dateOfJoin: string;
  rollNum: number;
  stu_img: string;
  name: string;
}

interface PlayerForm {
  playerId: number | null;
  sportId: number | null;
  dateOfJoin: string;
}

interface PlayerFormErrors {
  playerId?: string;
  sportId?: string;
  dateOfJoin?: string;
}

const initailData = {
  playerId: null,
  sportId: null,
  dateOfJoin: "",
};

const TPlayersList = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = sportListData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const [players, setPlayers] = useState<StudentSport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stuOptions, setStuOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [sportOptions, setSportOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const tokens = localStorage.getItem("token");
  const roleId = tokens ? JSON.parse(tokens)?.role : null;
  type Permission = {
    can_create?: boolean;
    can_delete?: boolean;
    can_edit?: boolean;
    can_view?: boolean;
  } | null;
  const [permission, setPermission] = useState<Permission>(null);
  const [form, setForm] = useState<PlayerForm>(initailData);
  const [errors, setErrors] = useState<PlayerFormErrors>({});
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

  const fetchOptions = async () => {
    try {
      const [stuRes, sportRes] = await Promise.all([
        stuForOption(),
        sportForOption(),
      ]);

      if (stuRes.data.success) {
        setStuOptions(
          stuRes.data.data.map((s: any) => ({
            value: s.userId,
            label: `${s.firstname} ${s.lastname} (${s.class}-${s.section})`,
          }))
        );
      }
      if (sportRes.data.success) {
        setSportOptions(
          sportRes.data.data.map((sp: any) => ({
            value: sp.id,
            label: sp.name,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlayers = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    try {
      const { data } = await allPlayer();

      if (data.success) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchPlayers();
    fetchOptions();
  }, []);

  // add player
  const handleSelectChange = (
    field: keyof PlayerForm,
    value: String | Number
  ) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleDateChange = (name: keyof PlayerForm, date: string) => {
    setForm({ ...form, [name]: date });
    setErrors({ ...errors, dateOfJoin: undefined });
  };

  const fetchById = async (id: number) => {
    if (!id) return;

    try {
      const response = await spePlayer(id);
      const { data } = response;

      if (data?.success && data?.data) {
        const playerData = data.data;

        setForm({
          playerId: playerData.player_id ?? "",
          sportId: playerData.sport_id ?? "",
          dateOfJoin: playerData.date_of_join
            ? dayjs(playerData.date_of_join).format("DD MMM YYYY")
            : "",
        });

        setEditId(id);
      } else {
        console.warn("No valid data returned from API");
      }
    } catch (error) {
      console.error("Error fetching player:", error);
    }
  };

  const validate = (): boolean => {
    const newErrors: PlayerFormErrors = {};
    if (!form.playerId) newErrors.playerId = "Player is required";
    if (!form.sportId) newErrors.sportId = "Sport is required";
    if (!form.dateOfJoin) newErrors.dateOfJoin = "Date of join is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const apiCall = editId ? editPlayer(form, editId) : addPlayer(form);
      const { data } = await apiCall;

      if (data.success) {
        toast.success(data.message);
        handleModalPopUp(editId ? "edit_player" : "add_player");
        fetchPlayers();
        setForm(initailData);
        setEditId(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancelSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm(initailData);
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
      const { data } = await deletePlayer(id);
      if (data.success) {
        toast.success(data.message);
        fetchPlayers();
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
      render: (id: number) => (
        <Link to="#" className="link-primary">
          STP{id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Player Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to={`${routes.studentDetail}/${record.rollnum}`}
              className="avatar avatar-md"
            >
              <img
                src={`${Imageurl}/${record.stu_img}`}
                className="img-fluid rounded-circle"
                alt="img"
              />
            </Link>
            <div className="ms-2">
              <p className="text-dark mb-0">
                <Link to={`${routes.studentDetail}/${record.rollnum}`}>
                  {text}
                </Link>
              </p>
            </div>
          </div>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Sports",
      dataIndex: "sports",
      render: (text: string) => <span>{text}</span>,
      sorter: (a: TableData, b: TableData) => a.sports.length - b.sports.length,
    },
    {
      title: "Date Of Join",
      dataIndex: "dateOfJoin",
      render: (text: string) => (
        <span>{dayjs(text).format("DD MMM YYYY")}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.dateOfJoin.length - b.dateOfJoin.length,
    },
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      sorter: (a: any, b: any) => a.action - b.action,
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
                <i className="ti ti-dots-vertical fs-14"></i>
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                {permission?.can_edit ? (
                  <li>
                    <button
                      className="dropdown-item rounded-1"
                      onClick={() => fetchById(record.id)}
                      data-bs-toggle="modal"
                      data-bs-target="#edit_player"
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
        </>
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
              <h3 className="page-title mb-1">Players</h3>
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
                    Players
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
                    data-bs-target="#add_player"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Players
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Players List</h4>
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
                              <label className="form-label">Player</label>
                              <CommonSelect
                                className="select"
                                options={playersName}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Sport</label>
                              <CommonSelect
                                className="select"
                                options={sports}
                                defaultValue={sports[0].value}
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
                <Table
                  dataSource={players}
                  columns={columns}
                  Selection={true}
                />
              )}
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Player */}
      <div className="modal fade" id="add_player">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Player</h4>
              <button
                type="button"
                onClick={(e) => handleCancelSubmit(e)}
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Player Name */}
                    <div className="mb-3">
                      <label className="form-label">Player Name</label>
                      <CommonSelect
                        className="select text-capitalize"
                        options={stuOptions}
                        value={form.playerId}
                        onChange={(val: any) =>
                          handleSelectChange("playerId", val?.value || null)
                        }
                      />
                      {errors.playerId && (
                        <small className="text-danger">{errors.playerId}</small>
                      )}
                    </div>

                    {/* Sports */}
                    <div className="mb-3">
                      <label className="form-label">Sports</label>
                      <CommonSelect
                        className="text-capitalize select"
                        options={sportOptions}
                        value={form.sportId}
                        onChange={(val: any) =>
                          handleSelectChange("sportId", val?.value || null)
                        }
                      />
                      {errors.sportId && (
                        <small className="text-danger">{errors.sportId}</small>
                      )}
                    </div>

                    {/* Date of Join */}
                    <div className="mb-0">
                      <label className="form-label">Date of Join</label>
                      <DatePicker
                        className="datepicker form-control"
                        placeholder="Select Date"
                        format={"DD MMM YYYY"}
                        value={
                          form.dateOfJoin
                            ? dayjs(form.dateOfJoin, "DD MMM YYYY")
                            : null
                        }
                        onChange={(date) =>
                          handleDateChange(
                            "dateOfJoin",
                            date ? dayjs(date).format("DD MMM YYYY") : ""
                          )
                        }
                      />
                      {errors.dateOfJoin && (
                        <small className="text-danger">
                          {errors.dateOfJoin}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancelSubmit(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Add Player */}
      {/* Edit Player */}
      <div className="modal fade" id="edit_player">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Player</h4>
              <button
                type="button"
                onClick={(e) => handleCancelSubmit(e)}
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Player Name */}
                    <div className="mb-3">
                      <label className="form-label">Player Name</label>
                      <CommonSelect
                        className="select text-capitalize"
                        options={stuOptions}
                        value={form.playerId}
                        onChange={(val: any) =>
                          handleSelectChange("playerId", val?.value || null)
                        }
                      />
                      {errors.playerId && (
                        <small className="text-danger">{errors.playerId}</small>
                      )}
                    </div>

                    {/* Sports */}
                    <div className="mb-3">
                      <label className="form-label">Sports</label>
                      <CommonSelect
                        className="text-capitalize select"
                        options={sportOptions}
                        value={form.sportId}
                        onChange={(val: any) =>
                          handleSelectChange("sportId", val?.value || null)
                        }
                      />
                      {errors.sportId && (
                        <small className="text-danger">{errors.sportId}</small>
                      )}
                    </div>

                    {/* Date of Join */}
                    <div className="mb-0">
                      <label className="form-label">Date of Join</label>
                      <DatePicker
                        className="datepicker form-control"
                        placeholder="Select Date"
                        format={"DD MMM YYYY"}
                        value={
                          form.dateOfJoin
                            ? dayjs(form.dateOfJoin, "DD MMM YYYY")
                            : null
                        }
                        onChange={(date) =>
                          handleDateChange(
                            "dateOfJoin",
                            date ? dayjs(date).format("DD MMM YYYY") : ""
                          )
                        }
                      />
                      {errors.dateOfJoin && (
                        <small className="text-danger">
                          {errors.dateOfJoin}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancelSubmit(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
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
                  You want to delete this items, this cant be undone once you
                  delete.
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
      {/* Edit Player */}
    </>
  );
};

export default TPlayersList;
