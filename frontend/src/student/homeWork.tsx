import { useEffect, useMemo, useRef, useState } from "react";
// import { classhomework } from "../../../core/data/json/class_home_work";
import Table from "../core/common/dataTable/index";
import { language, weak } from "../core/common/selectoption/selectoption";
import type { HomeworkFormData, TableData } from "../core/data/interface";
import CommonSelect from "../core/common/commonSelect";
import PredefinedDateRanges from "../core/common/datePicker";
import { Link } from "react-router-dom";

import { all_routes } from "../router/all_routes";
import TooltipOption from "../core/common/tooltipOption";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  addHomeWork,
  allHomeWork,
  allTeacherForOption,
  deleteHomework,
  editHomework,
  getAllRolePermissions,
  getAllSection,
  getAllSectionForAClass,
  getAllSubject,
  Imageurl,
  speHomework,
} from "../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../handlePopUpmodal";
import { allRealClasses } from "../service/classApi";
import { getAllStudentHomeWork } from "../service/studentapi";

export interface Homework {
  id: number;
  className: string;
  section: string;
  subject: string;
  homeworkDate: string;
  submissionDate: string;
  description: string;
  status: "0" | "1";
  firstname: string;
  lastname: string;
  img_src?: string;
}

export interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Section {
  id: number;
  section_name: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface classes {
  id: number;
  class_name: string;
}

const HomeWork = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  // State
  const [formData, setFormData] = useState<HomeworkFormData>({
    className: null,
    section: null,
    subject: null,
    homeworkDate: "",
    submissionDate: "",
    teacherId: "",
    status: "1",
    attachments: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof HomeworkFormData, string>>
  >({});
  const [permission, setPermission] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allClass, setAllClass] = useState<classes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(token)?.id : null;
  const roleId = token ? JSON.parse(token)?.role : null;
  const fetchData = async <T,>(
    apiFn: () => Promise<{ data: { success: boolean; data: T } }>,
    setter: React.Dispatch<React.SetStateAction<T>>,
    setLoadingState: boolean = true
  ) => {
    try {
      if (setLoadingState) setLoading(true);
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
        console.log("all permission", data?.result);
        console.log(
          "specific permission: ",
          data.result.filter((perm: any) => perm?.module_name === "HomeWork")
        );
        const currentPermission = data.result
          .filter((perm: any) => perm?.module_name === "HomeWork")
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

  const fetchHomeWorks = async () => {
    setLoading(true);
    if (userId) {
      try {
        const { data } = await getAllStudentHomeWork(userId);

        if (data.success) {
          setHomeworks(data.data);
        }
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSection = async () => {
    try {
      if (formData.className) {
        const { data } = await getAllSectionForAClass(
          Number(formData.className)
        );
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSections(data.data);
        } else {
          setSections([]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error to fetch section !");
    }
  };

  const fetchTeachers = () => fetchData(allTeacherForOption, setTeachers);
  const fetchSections = () => fetchData(getAllSection, setSections);
  const fetchSubjects = () => fetchData(getAllSubject, setSubjects);
  const fetchClasses = () => fetchData(allRealClasses, setAllClass);

  useEffect(() => {
    fetchPermission(roleId);
  }, []);

  useEffect(() => {
    if (permission) {
      fetchTeachers();
      fetchSections();
      fetchSubjects();
      fetchHomeWorks();
      fetchClasses();
    }
  }, [permission]);

  console.log("permission : ", permission);
  useEffect(() => {
    if (formData.className) {
      fetchSection();
    }
  }, [formData.className]);

  // Options (for selects)

  const sectionOptions = useMemo(
    () =>
      sections.map((s) => ({
        value: s.id,
        label: s.section_name,
      })),
    [sections]
  );

  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: Number(t.id),
        label: `${t.firstname} ${t.lastname}`,
      })),
    [teachers]
  );

  const subjectOptions = useMemo(
    () =>
      subjects.map((s) => ({
        value: s.id,
        label: s.name,
      })),

    [subjects]
  );

  const classOptions = useMemo(
    () => allClass.map((c) => ({ value: c.id, label: String(c.class_name) })),
    [allClass]
  );

  const tableData = homeworks.map((hw) => ({
    key: hw.id,
    id: hw.id,
    section: hw.section,
    class: hw.className,
    subject: hw.subject,
    homeworkDate: dayjs(hw.homeworkDate).format("DD MMM YYYY"),
    submissionDate: dayjs(hw.submissionDate).format("DD MMM YYYY"),
    createdBy: `${hw.firstname} ${hw.lastname}`,
    img: hw.img_src,
    action: hw.id,
  }));

  // add homework

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSelectChange = (
    name: keyof HomeworkFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: keyof HomeworkFormData, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HomeworkFormData, string>> = {};

    if (!formData.className) newErrors.className = "Class is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (!formData.homeworkDate)
      newErrors.homeworkDate = "Homework date is required";
    if (!formData.submissionDate)
      newErrors.submissionDate = "Submission date is required";
    if (!formData.attachments)
      newErrors.attachments = "Attachment is required !";
    else if (formData.attachments.length < 6)
      newErrors.attachments = "Attachment must be at least 6 chracters !";
    if (!formData.description)
      newErrors.description = "Description is required";
    else if (formData.description.length < 6)
      newErrors.description = "Description must be at least 10 chracters !";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // edit---------------------------
  const fetchHwById = async (id: number) => {
    try {
      const { data } = await speHomework(id);
      if (data.success) {
        setFormData({
          className: data.data.className,
          section: Number(data.data.section),
          subject: Number(data.data.subject),
          homeworkDate: dayjs(data.data.homeWorkDate).format("DD MMM YYYY"),
          submissionDate: dayjs(data.data.submissionDate).format("DD MMM YYYY"),
          teacherId: data.data.teacherId,
          status: data.data.status,
          attachments: data.data.attachements,
          description: data.data.description,
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
      className: null,
      section: null,
      subject: null,
      homeworkDate: "",
      submissionDate: "",
      teacherId: "",
      status: "1",
      attachments: "",
      description: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return; // stop if validation fails

    try {
      if (editId) {
        const { data } = await editHomework(formData, editId);
        if (data.success) {
          toast.success(data.message);
          setEditId(null);
          handleModalPopUp("edit_home_work");
        }
      } else {
        const { data } = await addHomeWork(formData);
        if (data.success) {
          toast.success(data.message);
          handleModalPopUp("add_home_work");
        }
      }
      fetchHomeWorks();
      setFormData({
        className: null,
        section: null,
        subject: null,
        homeworkDate: "",
        submissionDate: "",
        teacherId: "",
        status: "1",
        attachments: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.log(error);
    }
  };

  // delete class room-----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = async (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // console.log(id)
    e.preventDefault();
    try {
      const { data } = await deleteHomework(id);
      if (data.success) {
        toast.success(data.message);
        fetchHomeWorks();
        handleModalPopUp("delete-modal");
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
        <>
          <Link to="#" className="link-primary">
            HW{text}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },

    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: any, b: any) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (text: string) => <span className="text-capitalize">{text}</span>,
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: (a: TableData, b: TableData) =>
        a.subject.length - b.subject.length,
    },
    {
      title: "Homework Date",
      dataIndex: "homeworkDate",
      sorter: (a: TableData, b: TableData) =>
        a.homeworkDate.length - b.homeworkDate.length,
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      sorter: (a: TableData, b: TableData) =>
        a.submissionDate.length - b.submissionDate.length,
    },
    {
      title: "CreatedBy",
      dataIndex: "createdBy",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="rounded-circle object-fit-cover"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.createdBy.length - b.createdBy.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text: any) => (
        <>
          {permission && (
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
                      onClick={() => fetchHwById(text)}
                      data-bs-toggle="modal"
                      data-bs-target="#edit_home_work"
                    >
                      <i className="ti ti-edit-circle me-2" />
                      Edit
                    </button>
                  </li>
                ) : (
                  ""
                )}
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
                ) : (
                  ""
                )}
              </ul>
            </div>
          )}
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
                <h3 className="page-title mb-1">Class Work</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.studentDashboard}>
                        Student Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Home Work
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
                      data-bs-target="#add_home_work"
                    >
                      <i className="ti ti-square-rounded-plus-filled me-2" />
                      Add Home Work
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Home Work</h4>
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
                                <label className="form-label">Subject</label>
                                <CommonSelect
                                  className="select"
                                  options={language}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>

                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>

                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Date</label>
                                <CommonSelect
                                  className="select"
                                  options={weak}
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
                    dataSource={tableData}
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
        {/* Add Home Work */}
        <div className="modal fade" id="add_home_work">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {permission?.can_create ? (
                <div className="modal-header">
                  <h4 className="modal-title">Add Home Work</h4>
                  <button
                    type="button"
                    className="btn-close custom-btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="ti ti-x" />
                  </button>
                </div>
              ) : (
                ""
              )}

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${
                            errors.className ? "is-invalid" : ""
                          }`}
                          options={classOptions}
                          value={formData.className}
                          onChange={(opt) =>
                            handleSelectChange("className", opt?.value || "")
                          }
                        />
                        {errors.className && (
                          <div className="invalid-feedback">
                            {errors.className}
                          </div>
                        )}
                      </div>

                      {/* Section + Subject */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className={`select text-capitalize ${
                                errors.section ? "is-invalid" : ""
                              }`}
                              options={sectionOptions}
                              value={formData.section}
                              onChange={(opt) =>
                                handleSelectChange("section", opt?.value || "")
                              }
                            />
                            {errors.section && (
                              <div className="invalid-feedback">
                                {errors.section}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <CommonSelect
                              className={`select ${
                                errors.subject ? "is-invalid" : ""
                              }`}
                              options={subjectOptions}
                              value={formData.subject}
                              onChange={(opt) =>
                                handleSelectChange("subject", opt?.value || "")
                              }
                            />
                            {errors.subject && (
                              <div className="invalid-feedback">
                                {errors.subject}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Teacher */}
                      <div className="mb-3">
                        <label className="form-label">Teacher</label>
                        <CommonSelect
                          className={`select ${
                            errors.teacherId ? "is-invalid" : ""
                          }`}
                          options={teacherOptions}
                          value={formData.teacherId}
                          onChange={(opt) =>
                            handleSelectChange("teacherId", opt?.value || "")
                          }
                        />
                        {errors.teacherId && (
                          <div className="invalid-feedback">
                            {errors.teacherId}
                          </div>
                        )}
                      </div>

                      {/* Homework Date + Submission Date */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Home Work Date</label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className={`form-control datetimepicker`}
                                format="DD MMM YYYY"
                                value={
                                  formData.homeworkDate
                                    ? dayjs(
                                        formData.homeworkDate,
                                        "DD MMM YYYY"
                                      )
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleDateChange(
                                    "homeworkDate",
                                    Array.isArray(dateString)
                                      ? dateString[0]
                                      : dateString
                                  )
                                }
                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                              {errors.homeworkDate && (
                                <div className="invalid-feedback d-block">
                                  {errors.homeworkDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Submission Date
                            </label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className={`form-control datetimepicker`}
                                format="DD MMM YYYY"
                                value={
                                  formData.submissionDate
                                    ? dayjs(
                                        formData.submissionDate,
                                        "DD MMM YYYY"
                                      )
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleDateChange(
                                    "submissionDate",
                                    Array.isArray(dateString)
                                      ? dateString[0]
                                      : dateString
                                  )
                                }
                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                              {errors.submissionDate && (
                                <div className="invalid-feedback d-block">
                                  {errors.submissionDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attachments */}
                      <div className="mb-3">
                        <label className="form-label">Attachments</label>
                        <input
                          type="text"
                          name="attachments"
                          value={formData.attachments}
                          onChange={handleChange}
                          className={`form-control ${
                            errors.attachments ? "is-invalid" : ""
                          }`}
                        />
                        {errors.attachments && (
                          <div className="invalid-feedback">
                            {errors.attachments}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
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
                    Add Homework
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Home Work */}
        {/* Edit Home Work */}
        <div className="modal fade" id="edit_home_work">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Home Work</h4>
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
                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${
                            errors.className ? "is-invalid" : ""
                          }`}
                          options={classOptions}
                          value={formData.className}
                          onChange={(opt) =>
                            handleSelectChange("className", opt?.value || "")
                          }
                        />
                        {errors.className && (
                          <div className="invalid-feedback">
                            {errors.className}
                          </div>
                        )}
                      </div>

                      {/* Section + Subject */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect
                              className={`select text-capitalize ${
                                errors.section ? "is-invalid" : ""
                              }`}
                              options={sectionOptions}
                              value={formData.section}
                              onChange={(opt) =>
                                handleSelectChange("section", opt?.value || "")
                              }
                            />
                            {errors.section && (
                              <div className="invalid-feedback">
                                {errors.section}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <CommonSelect
                              className={`select ${
                                errors.subject ? "is-invalid" : ""
                              }`}
                              options={subjectOptions}
                              value={formData.subject}
                              onChange={(opt) =>
                                handleSelectChange("subject", opt?.value || "")
                              }
                            />
                            {errors.subject && (
                              <div className="invalid-feedback">
                                {errors.subject}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Teacher */}
                      <div className="mb-3">
                        <label className="form-label">Teacher</label>
                        <CommonSelect
                          className={`select ${
                            errors.teacherId ? "is-invalid" : ""
                          }`}
                          options={teacherOptions}
                          value={formData.teacherId}
                          onChange={(opt) =>
                            handleSelectChange("teacherId", opt?.value || "")
                          }
                        />
                        {errors.teacherId && (
                          <div className="invalid-feedback">
                            {errors.teacherId}
                          </div>
                        )}
                      </div>

                      {/* Homework Date + Submission Date */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Home Work Date</label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className={`form-control datetimepicker`}
                                format="DD MMM YYYY"
                                value={
                                  formData.homeworkDate
                                    ? dayjs(
                                        formData.homeworkDate,
                                        "DD MMM YYYY"
                                      )
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleDateChange(
                                    "homeworkDate",
                                    Array.isArray(dateString)
                                      ? dateString[0]
                                      : dateString
                                  )
                                }
                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                              {errors.homeworkDate && (
                                <div className="invalid-feedback d-block">
                                  {errors.homeworkDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Submission Date
                            </label>
                            <div className="input-icon position-relative">
                              <DatePicker
                                className={`form-control datetimepicker`}
                                format="DD MMM YYYY"
                                value={
                                  formData.submissionDate
                                    ? dayjs(
                                        formData.submissionDate,
                                        "DD MMM YYYY"
                                      )
                                    : null
                                }
                                placeholder="Select Date"
                                onChange={(dateString) =>
                                  handleDateChange(
                                    "submissionDate",
                                    Array.isArray(dateString)
                                      ? dateString[0]
                                      : dateString
                                  )
                                }
                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                              {errors.submissionDate && (
                                <div className="invalid-feedback d-block">
                                  {errors.submissionDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attachments */}
                      <div className="mb-3">
                        <label className="form-label">Attachments</label>
                        <input
                          type="text"
                          name="attachments"
                          value={formData.attachments}
                          onChange={handleChange}
                          className={`form-control ${
                            errors.attachments ? "is-invalid" : ""
                          }`}
                        />
                        {errors.attachments && (
                          <div className="invalid-feedback">
                            {errors.attachments}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
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
                    Edit Homework
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Home Work */}

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

export default HomeWork;
