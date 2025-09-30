import { useEffect, useRef, useState } from "react";
// import { classes } from "../../../core/data/json/classes";
import Table from "../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../core/common/datePicker";
import {
  // activeList,
  allClass,
  // classSection,
  classSylabus,
} from "../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../router/all_routes";
import { addClass, allClasses, deleteClass, editClass, speClass } from "../../../service/classApi";
// allClasses
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { getAllSection } from "../../../service/api";

const Classes = () => {


  // const data = classes;

  const route = all_routes

  const [classList, setClassList] = useState<any>([])
  const [origialClassList  ,setOriginalClassList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sections, setSections] = useState<any>([])

  const fetchClasses = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await allClasses()
      // console.log(data)
      if (data.success) {
        setClassList(data.data)
        setOriginalClassList(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSection = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await getAllSection();
      // console.log(data)

      if (data.success) {
        setSections(data.data);
        
      }
      await fetchClasses()
    } catch (error: any) {
      console.error(error);
      toast.warning(error.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSection()
  }, [])

  const sectionOption = sections.map((section: any) => ({
    value: section.section,
    label: section.section,
  }))




  interface ClassFormData {
    className: string;
    section: string | number;
    noOfStudents: string;
    noOfSubjects: string;
    status: string;
  }

  const [formData, setFormData] = useState<ClassFormData>({
    className: "",
    section: "",
    noOfStudents: "",
    noOfSubjects: "",
    status: "1",
  });
  const [editId, setEditId] = useState<number | null>(null)


  // ✅ Generic handleChange for inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  // ✅ Handle select change
  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const fetchSpecificClass = async (id: number) => {
    console.log(id)
    try {
      const { data } = await speClass(id)
      setFormData({
        className: data.data.className,
        section: data.data.section,
        noOfStudents: data.data.noOfStudents,
        noOfSubjects: data.data.noOfSubjects,
        status: data.data.status,
      }
      )
      setEditId(id)
    } catch (error) {
      console.log(error)
    }

  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({
      className: "",
      section: "",
      noOfStudents: "",
      noOfSubjects: "",
      status: "1",
    });
    // setErrors({});
    setEditId(null)
  }




  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await editClass(formData, editId)

        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('edit_class')
          setEditId(null)
        }

      } else {

        const { data } = await addClass(formData)
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('add_class')

        }
      }
      fetchClasses()
      setFormData({
        className: "",
        section: "",
        noOfStudents: "",
        noOfSubjects: "",
        status: "1",
      })

    } catch (error) {
      console.log(error)

    }

  };

  // delete class--------------------------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)


  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(id)
    e.preventDefault()
    try {

      const { data } = await deleteClass(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchClasses()
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
      render: (text: any) => (
        <>
          <Link to="#" className="link-primary">
            {text}
          </Link>
        </>
      ),
    },

    {
      title: "Class",
      dataIndex: "className",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "No of Student",
      dataIndex: "noOfStudents",
      sorter: (a: TableData, b: TableData) =>
        a.noOfStudents.length - b.noOfStudents.length,
    },
    {
      title: "No of Subjects",
      dataIndex: "noOfSubjects",
      sorter: (a: TableData, b: TableData) =>
        a.noOfSubjects.length - b.noOfSubjects.length,
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
      render: (text: number) => (
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
                    onClick={() => fetchSpecificClass(text)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_class"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
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
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];


  interface FilterData {
    class: string;
    section: string;
  }

  const [filterData, setFilterData] = useState<FilterData>({ class: "", section: "" });

  const handleFilterSelectChange = (name: keyof FilterData, value: string | number) => {
    setFilterData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    // filter from original copy
    const filtered =origialClassList.filter((row:any) => {
      const matchClass = filterData.class ? row.className === filterData.class : true;
      const matchSection = filterData.section ? row.section === filterData.section : true;
      return matchClass && matchSection;
    });
    setClassList(filtered);
    console.log(classList)
    // close dropdown if needed
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleResetFilter = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFilterData({ class: "", section: "" });
    setClassList(origialClassList);
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Classes List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={route.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Classes </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Classes
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
                  data-bs-target="#add_class"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Class
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Guardians List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Classes List</h4>
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
                             
                                 onChange={(option) => handleFilterSelectChange("class", option ? option.value : "")}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select text-capitalize"
                                options={sectionOption}
                                
                                  onChange={(option) => handleFilterSelectChange("section", option ? option.value : "")}
                              />
                            </div>
                          </div>
                        
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button onClick={handleResetFilter} className="btn btn-light me-3">
                          Reset
                        </button>
                        <button
                          // to="#"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </button>
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
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (<Table columns={columns} dataSource={classList} Selection={true} />)
              }
              {/* /Guardians List */}
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <>
        {/* Add Classes */}
        <div className="modal fade" id="add_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Class</h4>
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
                      {/* Class Name */}
                      <div className="mb-3">
                        <label className="form-label">Class Name</label>
                        <CommonSelect
                          className="select"
                          options={allClass}
                          value={formData.className}
                          onChange={(opt) => handleSelectChange("className", opt ? opt.value : "")}
                        />
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className="select text-capitalize"
                          options={sectionOption}
                          value={formData.section}
                          onChange={(opt) => handleSelectChange("section", opt ? opt.value : "")}
                        />
                      </div>

                      {/* No of Students */}
                      <div className="mb-3">
                        <label className="form-label">No of Students</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter no of Students"
                          name="noOfStudents"
                          value={formData.noOfStudents}
                          onChange={handleChange}
                        />
                      </div>

                      {/* No of Subjects */}
                      <div className="mb-3">
                        <label className="form-label">No of Subjects</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter no of Subjects"
                          name="noOfSubjects"
                          value={formData.noOfSubjects}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Status Switch */}
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
                            checked={formData.status === "1"}
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
                  <button
                    type="submit"
                    className="btn btn-primary"

                  >
                    Add Class
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>
        {/* /Add Classes */}


        {/* Edit Classes */}
        <div className="modal fade" id="edit_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Class</h4>
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
                      {/* Class Name */}
                      <div className="mb-3">
                        <label className="form-label">Class Name</label>
                        <CommonSelect
                          className="select"
                          options={allClass}
                          value={formData.className}
                          onChange={(opt) => handleSelectChange("className", opt ? opt.value : "")}
                        />
                      </div>

                      {/* Section */}
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                          className="select text-capitalize"
                          options={sectionOption}
                          value={formData.section}
                          onChange={(opt) => handleSelectChange("section", opt ? opt.value : "")}
                        />
                      </div>

                      {/* No of Students */}
                      <div className="mb-3">
                        <label className="form-label">No of Students</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter no of Students"
                          name="noOfStudents"
                          value={formData.noOfStudents}
                          onChange={handleChange}
                        />
                      </div>

                      {/* No of Subjects */}
                      <div className="mb-3">
                        <label className="form-label">No of Subjects</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter no of Subjects"
                          name="noOfSubjects"
                          value={formData.noOfSubjects}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Status Switch */}
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
                            checked={formData.status === "1"}
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
        {/* /Edit Classes */}
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
        {/* View Classes */}
        <div className="modal fade" id="view_class">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <h4 className="modal-title">Class Details</h4>
                  <span className="badge badge-soft-success ms-2">
                    <i className="ti ti-circle-filled me-1 fs-5" />
                    Active
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>Class Name</p>
                        <span>III</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>Section</p>
                        <span>A</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>No of Subjects</p>
                        <span>05</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="class-detail-info">
                        <p>No of Students</p>
                        <span>25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /View Classes */}
      </>
    </div>
  );
};

export default Classes;
