import { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
// import { classSyllabus } from "../../../core/data/json/class-syllabus";
import {
  activeList,
  allClass,
  classSection,
  classSylabus,
} from "../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { getAllSection } from "../../../service/api";
import { addSubjectGroup, allSubjectGroup, deleteGroup, editGroup, speGroup } from "../../../service/subjectApi";
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import { Spinner } from "../../../spinner";
import { handleModalPopUp } from "../../../handlePopUpmodal";



export interface SubjectGroup {
  id?: number;
  className: string;
  section: string;
  subjectGroup: string;
  status: "0" | "1";
  created_at?: string;
}


const ClassSyllabus = () => {
  const routes = all_routes;
  // const data = classSyllabus;



  const [sections, setSections] = useState<Section[]>([]);
  const [subGroups, setSubGroups] = useState<SubjectGroup[]>([])
  const [loading, setLoading] = useState<boolean>(false)


  // ✅ Generic fetch wrapper to reduce repetition
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


  const fetchGroups = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await allSubjectGroup()
      if (data.success) {
        setSubGroups(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchGroups()
    fetchData(getAllSection, setSections);

  }, [])


  const sectionOptions = useMemo(
    () => sections.map((s) => ({ value: s.section, label: s.section })),
    [sections]
  );

  // add syllabus ------------------------------------------------------------------------
  interface Section {
    section: string;
  }

  interface SyllabusForm {
    className: string;
    section: string;
    subjectGroup: string;
    status: string;
  }

  interface FormErrors {
    className?: string;
    section?: string;
    subjectGroup?: string;
  }


  // ---------------------- Add Syllabus Form ----------------------
  const [formData, setFormData] = useState<SyllabusForm>({
    className: "",
    section: "",
    subjectGroup: "",
    status: "1",
  });
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  // ✅ Handle Input/Select Changes
  const handleSelectChange = (
    field: keyof SyllabusForm,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Validation Function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.className) newErrors.className = "Class is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.subjectGroup.trim()) {
      newErrors.subjectGroup = "Subject Group is required";
    } else if (formData.subjectGroup.length < 5) {
      newErrors.subjectGroup = "Invalid Subject Group"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // edit--------------------------------------------------
  const fetchaGroupById = async (id: number) => {

    // console.log(id)
    try {
      const { data } = await speGroup(id)
      if (data.success) {
        setFormData({
          className: data.data.className,
          section: data.data.section,
          subjectGroup: data.data.subjectGroup,
          status: data.data.status,
        })
        setEditId(id)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({
      className: "",
      section: "",
      subjectGroup: "",
      status: "1"
    });
    setEditId(null)
    setErrors({});
    (null)
  }

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {

      if (editId) {

        const { data } = await editGroup(formData, editId)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('edit_syllabus')
          setEditId(null)
        }

      } else {
        const { data } = await addSubjectGroup(formData)
        if (data.success) {

          handleModalPopUp('add_syllabus')
          toast.success(data.message)

        }
      }
      setFormData({
        className: "",
        section: "",
        subjectGroup: "",
        status: "1"
      })
      fetchGroups()

    } catch (error) {
      console.log(error)
    }
  };

  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(id)
    try {

      const { data } = await deleteGroup(id)
      if (data.success) {
        toast.success(data.message)
        fetchGroups();
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




  const columns = [
    // {
    //  title:'Title',
    //  dataindex:'id',
    //  sorter:(a:any , b:any)=>a.id-b.id,
    // },
    {
      title: "Class",
      dataIndex: "className",
      sorter: (a: SubjectGroup, b: SubjectGroup) => a.className.length - b.className.length,
    },

    {
      title: "Section",
      dataIndex: "section",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.section.length - b.section.length,
    },
    {
      title: "Subject Group",
      dataIndex: "subjectGroup",
      sorter: (a: TableData, b: TableData) => a.subjectGroup.length - b.subjectGroup.length,
    },
    {
      title: "CreatedDate",
      dataIndex: "created_at",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.created_at.length - b.created_at.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Active
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              Inactive
            </span>
          )}
        </>
      ),
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
                    onClick={() => fetchaGroupById(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_syllabus"
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
                <h3 className="page-title mb-1">Books</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Syllabus </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Subject Group
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_syllabus"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Subject Group
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Syllabus</h4>
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
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classSylabus}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={classSection}
                                  defaultValue={classSylabus[0]}

                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
                                  defaultValue={activeList[0]}

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
                {/* Guardians List */}
                {
                  loading ? <div className="text-center text-primary my-5"><Spinner /></div> : (<Table columns={columns} dataSource={subGroups} Selection={true} />)
                }

                {/* /Guardians List */}
              </div>
            </div>
            {/* /Guardians List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <div>
        {/* Add Syllabus */}
        {/* Add Syllabus */}
        <div className="modal fade" id="add_syllabus">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subject Group</h4>
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
                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${errors.className ? "is-invalid" : ""
                            }`}
                          options={allClass}
                          value={formData.className}
                          onChange={(opt: any) =>
                            handleSelectChange("className", opt?.value || "")
                          }
                        />
                        {errors.className && (
                          <div className="text-danger">{errors.className}</div>
                        )}
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className={`select text-capitalize ${errors.section ? "is-invalid" : ""
                            }`}
                          options={sectionOptions}
                          value={formData.section}
                          onChange={(opt: any) =>
                            handleSelectChange("section", opt?.value || "")
                          }
                        />
                        {errors.section && (
                          <div className="text-danger">{errors.section}</div>
                        )}
                      </div>

                      {/* Subject Group */}
                      <div className="mb-3">
                        <label className="form-label">Subject Group</label>
                        <input
                          name="subjectGroup"
                          type="text"
                          className={`form-control  ${errors.subjectGroup ? "is-invalid" : ""
                            }`}
                          value={formData.subjectGroup}
                          onChange={handleChange}
                        />
                        {errors.subjectGroup && (
                          <div className="text-danger">{errors.subjectGroup}</div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          name="status"
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.status === "1"}
                          onChange={handleChange}
                        />
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

                  >
                    Add Subject Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Syllabus */}

        {/* /Add Syllabus */}
        {/* Edit Syllabus */}
        <div className="modal fade" id="edit_syllabus">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Subject Group</h4>
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
                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                          className={`select ${errors.className ? "is-invalid" : ""
                            }`}
                          options={allClass}
                          value={formData.className}
                          onChange={(opt: any) =>
                            handleSelectChange("className", opt?.value || "")
                          }
                        />
                        {errors.className && (
                          <div className="text-danger">{errors.className}</div>
                        )}
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className={`select text-capitalize ${errors.section ? "is-invalid" : ""
                            }`}
                          options={sectionOptions}
                          value={formData.section}
                          onChange={(opt: any) =>
                            handleSelectChange("section", opt?.value || "")
                          }
                        />
                        {errors.section && (
                          <div className="text-danger">{errors.section}</div>
                        )}
                      </div>

                      {/* Subject Group */}
                      <div className="mb-3">
                        <label className="form-label">Subject Group</label>
                        <input
                          name="subjectGroup"
                          type="text"
                          className={`form-control  ${errors.subjectGroup ? "is-invalid" : ""
                            }`}
                          value={formData.subjectGroup}
                          onChange={handleChange}
                        />
                        {errors.subjectGroup && (
                          <div className="text-danger">{errors.subjectGroup}</div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="status-title">
                        <h5>Status</h5>
                        <p>Change the Status by toggle</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          name="status"
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.status === "1"}
                          onChange={handleChange}
                        />
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Syllabus	*/}
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
      </div>
    </div>
  );
};

export default ClassSyllabus;
