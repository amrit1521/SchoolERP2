import React, { useEffect, useMemo, useRef, useState } from "react";
// import { classRoutine } from "../../../core/data/json/class-routine";
import Table from "../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  classSection,
  count,
  routinename,
  // teacher,
  weak,
} from "../../../core/common/selectoption/selectoption";
import { TimePicker } from "antd";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import {
  addClassRoutine,
  allClassRoom,
  allClassRoutine,
  allRealClasses,
  deleteRoutine,
  editClassRoutine,
  speClassRoutine,
} from "../../../service/classApi";
import {
  allTeacherForOption,
  getAllRolePermissions,
  getAllSectionForAClass,
} from "../../../service/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
// import { all_routes } from "../../../router/all_routes";
import { teacher_routes } from "../../../router/teacher_routes";

interface ClassRoutine {
  id: number;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  room_no: number;
  subject: string;
  firstname: string;
  lastname: string;
}

// add
interface RoutineFormData {
  teacher: number | null;
  className: number | null;
  section: number | null;
  day: string;
  startTime: string;
  endTime: string;
  classRoom: string;
  status: "1" | "0";
}

interface RoutineError {
  teacher: string;
  className: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  classRoom: string;
}

// Interfaces for other entities
interface Teacher {
  teacher_id: number;
  firstname: string;
  lastname: string;
}

interface Room {
  id: number;
  room_no: number;
}

interface ClassName {
  id: number;
  class_name: string;
}

const initailFormData: RoutineFormData = {
  teacher: null,
  className: null,
  section: null,
  day: "",
  startTime: "",
  endTime: "",
  classRoom: "",
  status: "1",
};

const initialErrorData = {
  teacher: "",
  className: "",
  section: "",
  day: "",
  startTime: "",
  endTime: "",
  classRoom: "",
};

const TClassRoutine = () => {
  // const routes = all_routes;

  // const data = classRoutine;
  // const getModalContainer = () => {
  //   const modalElement = document.getElementById("modal-datepicker");
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };
  // const getModalContainer2 = () => {
  //   const modalElement = document.getElementById("modal_datepicker");
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };
  // const getModalContainer3 = () => {
  //   const modalElement = document.getElementById("modal_datepicker");
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };
  // const getModalContainer4 = () => {
  //   const modalElement = document.getElementById("modal_datepicker");
  //   return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  // };
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const token = localStorage.getItem("token");
  const roleId = token ? JSON.parse(token)?.role : null;
  // const userId = token ? JSON.parse(token)?.id : null;
  const [permission, setPermission] = useState<any>(null);
  const [allRoutine, setAllRoutine] = useState<ClassRoutine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sectionOptions, setSectionOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allclass, setallclass] = useState<ClassName[]>([]);
  const [routineForm, setRoutineForm] =
    useState<RoutineFormData>(initailFormData);
  const [editId, setEditId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<RoutineError>>(initialErrorData);

  const fetchData = async <T,>(
    apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    try {
      const { data } = await apiFn();
      if (data.success) setter(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPermission = async (roleId: number) => {
    if (roleId) {
      const { data } = await getAllRolePermissions(roleId);
      if (data.success) {
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "ClassRoutine")
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

  const fetchRoutines = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    await fetchData(allClassRoutine, setAllRoutine);
    setLoading(false);
  };

  const fetchSection = async () => {
    try {
      if (routineForm.className) {
        const { data } = await getAllSectionForAClass(
          Number(routineForm.className)
        );
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSectionOptions(
            data.data.map((e: any) => ({ value: e.id, label: e.section_name }))
          );
        } else {
          setSectionOptions([]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch section !");
    }
  };

  useEffect(() => {
    fetchPermission(roleId);
    fetchRoutines();
    fetchData(allClassRoom, setRooms);
    fetchData(allTeacherForOption, setTeachers);
    fetchData(allRealClasses, setallclass);
  }, []);

  useEffect(() => {
    if (routineForm.className) {
      fetchSection();
    }
  }, [routineForm.className]);

  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: t.teacher_id,
        label: `${t.firstname} ${t.lastname}`,
      })),
    [teachers]
  );
  const roomOptions = useMemo(
    () => rooms.map((r) => ({ value: String(r.id), label: String(r.room_no) })),
    [rooms]
  );

  const classOptions = useMemo(
    () => allclass.map((c) => ({ value: c.id, label: c.class_name })),
    [allclass]
  );

  // add class routine ------------------------------------------------------------------------------

  const handleRoutineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setRoutineForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSelectChange = (
    name: keyof RoutineFormData,
    value: string | number
  ) => {
    setRoutineForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (
    name: "startTime" | "endTime",
    _time: any,
    timeString: string
  ) => {
    setRoutineForm((prev) => ({ ...prev, [name]: timeString }));
  };

  const validateRoutine = () => {
    let newErrors: Partial<RoutineError> = {};
    if (!routineForm.teacher) newErrors.teacher = "Teacher is required";
    if (!routineForm.className) newErrors.className = "Class is required";
    if (!routineForm.section) newErrors.section = "Section is required";
    if (!routineForm.day) newErrors.day = "Day is required";
    if (!routineForm.startTime) newErrors.startTime = "Start time is required";
    if (!routineForm.endTime) newErrors.endTime = "End time is required";
    if (!routineForm.classRoom) newErrors.classRoom = "Class room is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchroutinebyid = async (id: number) => {
    // console.log(id)
    try {
      const { data } = await speClassRoutine(id);
      if (data.success) {
        setRoutineForm({
          teacher: data.data.teacher,
          className: data.data.className,
          section: data.data.section,
          day: data.data.day,
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          classRoom: data.data.classRoom,
          status: data.data.status,
        });
      }
      setEditId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoutineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRoutine()) return;
    try {
      if (editId) {
        const { data } = await editClassRoutine(routineForm, editId);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("edit_class_routine");
          setEditId(null);
        }
      } else {
        const { data } = await addClassRoutine(routineForm);
        if (data.success) {
          toast.success(data.message);
          fetchRoutines();
          handleModalPopUp("add_class_routine");
        }
      }
      fetchRoutines();
      setRoutineForm(initailFormData);
      setErrors(initialErrorData);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handlecancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRoutineForm(initailFormData);
    setErrors(initialErrorData);
    setEditId(null);
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
      const { data } = await deleteRoutine(id);
      if (data.success) {
        toast.success(data.message);
        fetchRoutines();
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
        <>
          <Link to="#" className="link-primary">
            CR{text}
          </Link>
        </>
      ),
      sorter: (a: any, b: any) => a.id - b.id,
    },

    {
      title: "Class",
      dataIndex: "className",
      sorter: (a: any, b: any) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: any, b: any) => a.section.length - b.section.length,
    },
    {
      title: "Teacher",
      dataIndex: "firstname",
      render: (text: string, record: any) => (
        <span>{`${text} ${record.lastname}`}</span>
      ),
      sorter: (a: any, b: any) => a.teacher.length - b.teacher.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: (a: any, b: any) => a.subject.length - b.subject.length,
    },
    {
      title: "Day",
      dataIndex: "day",
      sorter: (a: any, b: any) => a.day.length - b.day.length,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      sorter: (a: any, b: any) => a.startTime.length - b.startTime.length,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      sorter: (a: any, b: any) => a.endTime.length - b.endTime.length,
    },
    {
      title: "Class Room",
      dataIndex: "room_no",
      sorter: (a: any, b: any) => a.classRoom.length - b.classRoom.length,
    },
  ];

  if (permission?.can_edit || permission?.can_delete) {
    columns.push({
      title: "Action",
      dataIndex: "id",
      sorter: (a: any, b: any) => a.id - b.id,
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
              {permission?.can_edit ? (
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchroutinebyid(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_class_routine"
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
                    onClick={() => setDeleteId(id)}
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
        </>
      ),
    });
  }

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Class Routine</h3>
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
                      Class Routine
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
                      data-bs-target="#add_class_routine"
                    >
                      <i className="ti ti-square-rounded-plus-filled me-2" />
                      Add Class Routine
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Routine</h4>
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
                                <label className="form-label">Class</label>

                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                  // defaultValue={allClass[0]}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>

                                <CommonSelect
                                  className="select"
                                  options={sectionOptions}
                                  defaultValue={classSection[0]}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Teacher</label>
                                <CommonSelect
                                  className="select"
                                  options={routinename}
                                  defaultValue={routinename[0]}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Room No</label>
                                <CommonSelect
                                  className="select"
                                  options={count}
                                  defaultValue={count[0]}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Day</label>
                                <CommonSelect
                                  className="select"
                                  options={weak}
                                  defaultValue={weak[0]}
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
                    dataSource={allRoutine}
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
      </>
      <>
        {/* Add Class Routine */}
        <div className="modal fade" id="add_class_routine">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Class Routine</h4>
                <button
                  type="button"
                  onClick={(e) => handlecancel(e)}
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              {/* ---------------- FORM ---------------- */}
              <form onSubmit={handleRoutineSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Teacher */}
                      <div className="mb-3">
                        <label className="form-label">Teacher</label>
                        <CommonSelect
                          className={`select ${
                            errors.teacher ? "is-invalid" : ""
                          }`}
                          options={teacherOptions}
                          value={routineForm.teacher}
                          onChange={(opt) =>
                            handleSelectChange("teacher", opt ? opt.value : "")
                          }
                        />
                        {errors.teacher && (
                          <div className="invalid-feedback">
                            {errors.teacher}
                          </div>
                        )}
                      </div>

                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${
                            errors.className ? "is-invalid" : ""
                          }`}
                          options={classOptions}
                          value={routineForm.className}
                          onChange={(opt) =>
                            handleSelectChange(
                              "className",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.className && (
                          <div className="invalid-feedback">
                            {errors.className}
                          </div>
                        )}
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className={`select text-capitalize ${
                            errors.section ? "is-invalid" : ""
                          }`}
                          options={sectionOptions}
                          value={routineForm.section}
                          onChange={(opt) =>
                            handleSelectChange("section", opt ? opt.value : "")
                          }
                        />
                        {errors.section && (
                          <div className="invalid-feedback">
                            {errors.section}
                          </div>
                        )}
                      </div>

                      {/* Day */}
                      <div className="mb-3">
                        <label className="form-label">Day</label>
                        <CommonSelect
                          className={`select ${errors.day ? "is-invalid" : ""}`}
                          options={weak}
                          value={routineForm.day}
                          onChange={(opt) =>
                            handleSelectChange("day", opt ? opt.value : "")
                          }
                        />
                        {errors.day && (
                          <div className="invalid-feedback">{errors.day}</div>
                        )}
                      </div>

                      {/* Start & End Time */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <TimePicker
                              use12Hours
                              placeholder="Choose"
                              format="h:mm A"
                              className={`form-control timepicker ${
                                errors.startTime ? "is-invalid" : ""
                              }`}
                              value={
                                routineForm.startTime
                                  ? dayjs(routineForm.startTime, "h:mm A")
                                  : null
                              }
                              onChange={(time, timeString) =>
                                handleTimeChange(
                                  "startTime",
                                  time,
                                  Array.isArray(timeString)
                                    ? timeString[0]
                                    : timeString
                                )
                              }
                            />
                            {errors.startTime && (
                              <div className="invalid-feedback">
                                {errors.startTime}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <TimePicker
                              use12Hours
                              placeholder="Choose"
                              format="h:mm A"
                              className={`form-control timepicker ${
                                errors.endTime ? "is-invalid" : ""
                              }`}
                              value={
                                routineForm.endTime
                                  ? dayjs(routineForm.endTime, "h:mm A")
                                  : null
                              }
                              onChange={(time, timeString) =>
                                handleTimeChange(
                                  "endTime",
                                  time,
                                  Array.isArray(timeString)
                                    ? timeString[0]
                                    : timeString
                                )
                              }
                            />
                            {errors.endTime && (
                              <div className="invalid-feedback">
                                {errors.endTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Class Room */}
                      <div className="mb-3">
                        <label className="form-label">Class Room</label>
                        <CommonSelect
                          className={`select ${
                            errors.classRoom ? "is-invalid" : ""
                          }`}
                          options={roomOptions}
                          value={routineForm.classRoom}
                          onChange={(opt) =>
                            handleSelectChange(
                              "classRoom",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.classRoom && (
                          <div className="invalid-feedback">
                            {errors.classRoom}
                          </div>
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
                            type="checkbox"
                            className="form-check-input"
                            name="status"
                            checked={routineForm.status === "1"}
                            onChange={handleRoutineChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handlecancel(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Class Routine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* /Add Class Routine */}
        {/* Edit Class Routine */}
        <div className="modal fade" id="edit_class_routine">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Class Routine</h4>
                <button
                  type="button"
                  onClick={(e) => handlecancel(e)}
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              {/* ---------------- FORM ---------------- */}
              <form onSubmit={handleRoutineSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Teacher */}
                      <div className="mb-3">
                        <label className="form-label">Teacher</label>
                        <CommonSelect
                          className={`select ${
                            errors.teacher ? "is-invalid" : ""
                          }`}
                          options={teacherOptions}
                          value={routineForm.teacher}
                          onChange={(opt) =>
                            handleSelectChange("teacher", opt ? opt.value : "")
                          }
                        />
                        {errors.teacher && (
                          <div className="invalid-feedback">
                            {errors.teacher}
                          </div>
                        )}
                      </div>

                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${
                            errors.className ? "is-invalid" : ""
                          }`}
                          options={classOptions}
                          value={routineForm.className}
                          onChange={(opt) =>
                            handleSelectChange(
                              "className",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.className && (
                          <div className="invalid-feedback">
                            {errors.className}
                          </div>
                        )}
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className={`select text-capitalize ${
                            errors.section ? "is-invalid" : ""
                          }`}
                          options={sectionOptions}
                          value={routineForm.section}
                          onChange={(opt) =>
                            handleSelectChange("section", opt ? opt.value : "")
                          }
                        />
                        {errors.section && (
                          <div className="invalid-feedback">
                            {errors.section}
                          </div>
                        )}
                      </div>

                      {/* Day */}
                      <div className="mb-3">
                        <label className="form-label">Day</label>
                        <CommonSelect
                          className={`select ${errors.day ? "is-invalid" : ""}`}
                          options={weak}
                          value={routineForm.day}
                          onChange={(opt) =>
                            handleSelectChange("day", opt ? opt.value : "")
                          }
                        />
                        {errors.day && (
                          <div className="invalid-feedback">{errors.day}</div>
                        )}
                      </div>

                      {/* Start & End Time */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Time</label>
                            <TimePicker
                              use12Hours
                              placeholder="Choose"
                              format="h:mm A"
                              className={`form-control timepicker ${
                                errors.startTime ? "is-invalid" : ""
                              }`}
                              value={
                                routineForm.startTime
                                  ? dayjs(routineForm.startTime, "h:mm A")
                                  : null
                              }
                              onChange={(time, timeString) =>
                                handleTimeChange(
                                  "startTime",
                                  time,
                                  Array.isArray(timeString)
                                    ? timeString[0]
                                    : timeString
                                )
                              }
                            />
                            {errors.startTime && (
                              <div className="invalid-feedback">
                                {errors.startTime}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Time</label>
                            <TimePicker
                              use12Hours
                              placeholder="Choose"
                              format="h:mm A"
                              className={`form-control timepicker ${
                                errors.endTime ? "is-invalid" : ""
                              }`}
                              value={
                                routineForm.endTime
                                  ? dayjs(routineForm.endTime, "h:mm A")
                                  : null
                              }
                              onChange={(time, timeString) =>
                                handleTimeChange(
                                  "endTime",
                                  time,
                                  Array.isArray(timeString)
                                    ? timeString[0]
                                    : timeString
                                )
                              }
                            />
                            {errors.endTime && (
                              <div className="invalid-feedback">
                                {errors.endTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Class Room */}
                      <div className="mb-3">
                        <label className="form-label">Class Room</label>
                        <CommonSelect
                          className={`select ${
                            errors.classRoom ? "is-invalid" : ""
                          }`}
                          options={roomOptions}
                          value={routineForm.classRoom}
                          onChange={(opt) =>
                            handleSelectChange(
                              "classRoom",
                              opt ? opt.value : ""
                            )
                          }
                        />
                        {errors.classRoom && (
                          <div className="invalid-feedback">
                            {errors.classRoom}
                          </div>
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
                            type="checkbox"
                            className="form-check-input"
                            name="status"
                            checked={routineForm.status === "1"}
                            onChange={handleRoutineChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => handlecancel(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Class Routine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Class Routine */}

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
    </div>
  );
};

export default TClassRoutine;
