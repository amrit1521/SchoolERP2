import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
// import { classSyllabus } from "../../../core/data/json/class-syllabus";
import {
  activeList,
  classSection,
  classSylabus,
} from "../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
// import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";
import { Documenturl, getAllSubject } from "../../../service/api";
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import { Spinner } from "../../../spinner";
import { handleModalPopUp } from "../../../handlePopUpmodal";
import { addClassSyllabus, addSubjectInAClass, allClassSyllabus, allRealClasses, deleteClassSyllabus, deleteSubjectFromClassSyllabus, updateSyllabusPdfFile } from "../../../service/classApi";
import MultiSelect from "../../../core/common/multiSelect";
import { TiDelete } from "react-icons/ti";



interface Subject {
  id: number,
  subject_id: number;
  name: string;
}

interface Syllabus {
  class_id: number;
  class_name: string;
  file_src: string;
  subjects: Subject[];
  created_at: string;
}

interface SyllabusForm {
  className: number | null;
  subId: (string | number)[];
  syllabusFile: File | null
}

interface AddSubjectForm {
  classId: number | null;
  subId: (string | number)[];
}
interface Option {
  value: number;
  label: string;
}
interface Subject {
  id: number;
  name: string;
}



const ClassSyllabus = () => {
  const routes = all_routes;
  // const data = classSyllabus;

  const [syllabus, setSyllabus] = useState<Syllabus[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<SyllabusForm>({
    className: null,
    subId: [],
    syllabusFile: null,
  });
  const [errors, setErrors] = useState<any>({});
  const [classOptions, setClassOptions] = useState<Option[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [deleteSubId, setDeleteSubId] = useState<number | null>(null)




  const fetchSyllbus = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {
      const { data } = await allClassSyllabus()
      if (data.success) {
        setSyllabus(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
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
  const fetchClass = async () => {
    try {
      const { data } = await allRealClasses();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {

        setClassOptions(
          data.data.map((e: any) => ({ value: e.id, label: e.class_name }))
        );
      } else {
        setClassOptions([]);
      }

    } catch (error) {
      console.log(error);
      toast.error("Error to fetch classes !");

    }
  };
  const fetchSubjects = () => fetchData(getAllSubject, setSubjects);

  useEffect(() => {
    fetchSyllbus()
    fetchClass()
    fetchSubjects()
  }, [])

  const subjectOptions = useMemo(
    () =>
      subjects.map((s) => ({
        value: s.id,
        label: s.name
      })),

    [subjects]
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, syllabusFile: file }))
    }
    setErrors({ ...errors, syllabusFile: "" });
  }


  const handleAddSubjectMulti = (field: keyof SyllabusForm, value: (string | number)[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: "" });
  };


  const handleSelectChange = (
    field: keyof SyllabusForm,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.className) {
      newErrors.className = "Please select a class.";
    }

    if (!formData.subId || formData.subId.length === 0) {
      newErrors.subId = "Please select at least one subject.";
    }

    if (!formData.syllabusFile) {
      newErrors.syllabusFile = "Please upload a syllabus PDF file.";
    } else if (formData.syllabusFile.type !== "application/pdf") {
      newErrors.syllabusFile = "Only PDF files are allowed.";
    } else if (formData.syllabusFile.size > 4 * 1024 * 1024) {
      newErrors.syllabusFile = "File size should not exceed 4MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({
      className: null,
      subId: [],
      syllabusFile: null,

    });

    setErrors({});

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!formData.syllabusFile) return

    const formDataToSend = new FormData();
    formDataToSend.append("classId", String(formData.className));
    formDataToSend.append("subjectIds", JSON.stringify(formData.subId));
    formDataToSend.append("syllabusFile", formData.syllabusFile);


    // for (const pair of formDataToSend.entries()) {
    //   console.log(pair[0], ":", pair[1]);
    // }

    try {

      const { data } = await addClassSyllabus(formDataToSend)
      if (data.success) {


        toast.success(data.message)
        fetchSyllbus()
        handleModalPopUp('add_syllabus')

      }

      setFormData({
        className: null,
        subId: [],
        syllabusFile: null,

      })


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  // delete-------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(id)
    try {
      const { data } = await deleteClassSyllabus(id)
      if (data.success) {
        toast.success(data.message)

        setDeleteId(null)
        fetchSyllbus()
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


  const handleDeleteSubj = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(id)
    try {

      const { data } = await deleteSubjectFromClassSyllabus(id)
      if (data.success) {
        toast.success(data.message)

        setDeleteId(null)
        fetchSyllbus()
        handleModalPopUp('delete-sub-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDeleteSubj = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteSubId(null)
  }

  // update pdf file
  const [classId, setClassId] = useState<number | null>(null)
  const [updatePdfFile, setUpdatePdfFile] = useState<File | null>(null)

  const handlePdfUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUpdatePdfFile(file)
    }
    setErrors({ ...errors, syllabusFile: "" });
  }

  const handleUpdatePdfFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!updatePdfFile) {
      toast.error("Please upload a syllabus PDF file.");
      return
    } else if (updatePdfFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return
    } else if (updatePdfFile.size > 4 * 1024 * 1024) {
      toast.error("File size should not exceed 4MB.");
      return
    }

    const updatePdfFormData = new FormData()
    updatePdfFormData.append('classId', String(classId))
    updatePdfFormData.append('updatesyllabuspdffile', updatePdfFile)
    try {

      const { data } = await updateSyllabusPdfFile(updatePdfFormData)
      if (data.success) {
        toast.success(data.message)
        fetchSyllbus()
        setClassId(null)
        setUpdatePdfFile(null)
        setErrors({})
      }


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelUpdatePdfFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setClassId(null)
    setUpdatePdfFile(null)
  }

  // add subjects
  const [addSubject, setAddSubject] = useState<AddSubjectForm>({
    classId: null,
    subId: []
  })
  const [loading2, setLoading2] = useState<boolean>(false)
  const handleUpdateSubject = (field: keyof AddSubjectForm, value: (string | number)[]) => {
    setAddSubject((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubjectInAClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!addSubject.subId || addSubject.subId.length === 0) {
      toast.error("Please select at least one subject.");
      return
    }
    setLoading2(true)

    const addSubjectForm = new FormData()
    addSubjectForm.append('classId', String(addSubject.classId))
    addSubjectForm.append('subIds', JSON.stringify(addSubject.subId))
    try {

      const { data } = await addSubjectInAClass(addSubjectForm)
      if (data.success) {
        toast.success(data.message)
        setAddSubject({
          classId: null,
          subId: []
        });
        fetchSyllbus()
        handleModalPopUp('add_subject')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading2(false)
    }
  }

  const cancelAddSubject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setAddSubject({
      classId: null,
      subId: []
    });

    setErrors({});
  }

  // table data
  const tableData = syllabus.map((s: any) => ({
    key: s.class_id,
    class_id: s.class_id,
    file_src: s.file_src,
    className: s.class_name,
    subjects: s.subjects,
    created_at: s.created_at,
  }))

  const columns = [
    {
      title: "Class",
      dataIndex: "className",
      sorter: (a: any, b: any) => a.className.length - b.className.length,
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      render: (subjects: { subject_id: number; name: string; id: number }[]) => (
        <div
          className="d-flex flex-wrap align-items-center"
          style={{ gap: "6px", rowGap: "6px" }}
        >
          {subjects && subjects.length > 0 ? (
            subjects.map((sub) => (
              <div
                key={sub.id}
                className="d-flex align-items-center subject-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#f0f2f5",
                  borderRadius: "14px",
                  padding: "3px 8px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#333",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                {sub.name}
                <TiDelete
                  title="Remove Subject"
                  className="text-danger ms-1 delete-icon"
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    marginLeft: "4px",
                    transition: "0.2s",
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#delete-sub-modal"
                  onClick={() => setDeleteSubId(sub.id)}
                />
              </div>
            ))
          ) : (
            <span className="text-muted fst-italic" style={{ fontSize: "12px" }}>
              No subjects
            </span>
          )}
        </div>
      ),
      sorter: (a: Syllabus, b: Syllabus) => a.subjects.length - b.subjects.length,
    }
    ,

    {
      title: "CreatedDate",
      dataIndex: "created_at",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: Syllabus, b: Syllabus) => a.created_at.length - b.created_at.length,
    },
    {
      title: "Syllabus PDF",
      dataIndex: "file_src",
      render: (text: string) => (
        <span className="fw-semibold">Download<a

          href={`${Documenturl}/${text}`}
          download={text}
          target="_blank"
          className="btn btn-dark btn-icon btn-sm  mx-1"
        >
          <i className="ti ti-download" />
        </a></span>
      ),
      sorter: (a: Syllabus, b: Syllabus) => a.file_src.length - b.file_src.length,
    },
    {
      title: "Action",
      dataIndex: "class_id",
      render: (classId: number) => (
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
                    onClick={() => setAddSubject((prev: any) => ({ ...prev, classId: classId }))}
                    data-bs-toggle="modal"
                    data-bs-target="#add_subject"
                  >
                    <i className="ti ti-plus me-2" />
                    Add Subject
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setClassId(classId)}
                    data-bs-toggle="modal"
                    data-bs-target="#update-pdf"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Update Pdf
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDeleteId(classId)}
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
                    Add Syllabus
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
                  loading ? <div className="text-center text-primary my-5"><Spinner /></div> : (<Table columns={columns} dataSource={tableData} Selection={false} />)
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
        <div className="modal fade" id="add_syllabus">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Class Syllabus</h4>
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
                          className={`select ${errors.className ? "is-invalid" : ""
                            }`}
                          options={classOptions}
                          value={formData.className}
                          onChange={(opt: any) =>
                            handleSelectChange("className", opt?.value || "")
                          }
                        />
                        {errors.className && (
                          <div className="text-danger">{errors.className}</div>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <MultiSelect
                          value={subjectOptions.filter((b: any) =>
                            formData.subId.includes(b.value)
                          )}
                          className={`select ${errors.subId ? "is-invalid" : ""
                            }`}
                          options={subjectOptions}
                          placeholder="Select Subject(s)"
                          onChange={(values) =>
                            handleAddSubjectMulti("subId", values)
                          }
                        />
                        {errors.subId && (
                          <div className="text-danger">{errors.subId}</div>
                        )}
                      </div>

                      {/* Upload File */}
                      <div className="mb-3">
                        <label className="form-label">Upload Syllabus (PDF)</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className={`form-control ${errors.syllabusFile ? "is-invalid" : ""
                            }`}
                          onChange={(e) => handleFileChange(e)}
                        />
                        {errors.syllabusFile && (
                          <div className="text-danger">{errors.syllabusFile}</div>
                        )}
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
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Syllabus */}

        {/* Edit Syllabus */}
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
              <form onSubmit={handleAddSubjectInAClass}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Class */}
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <input type="text" value={classOptions.filter((c: any) => c.value === addSubject.classId)[0]?.label} className="form-control" disabled />

                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <MultiSelect
                          value={subjectOptions.filter((b: any) =>
                            addSubject.subId.includes(b.value)
                          )}
                          className={`select`}
                          options={subjectOptions}
                          placeholder="Select Subject(s)"
                          onChange={(values) =>
                            handleUpdateSubject("subId", values)
                          }
                        />

                      </div>

                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button

                    type="button"
                    onClick={(e) => cancelAddSubject(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading2} className="btn btn-primary">
                    {!loading2 ? "Add Subject" : "Adding..."}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Syllabus	*/}

        {/* Update PDF */}
        <div className="modal fade" id="update-pdf">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update PDF</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleUpdatePdfFile}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Upload File */}
                      <div className="mb-3">
                        <label className="form-label">Upload Syllabus (PDF)</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className={`form-control }`}
                          onChange={(e) => handlePdfUpdate(e)}
                        />

                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={(e) => cancelUpdatePdfFile(e)}
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Pdf
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Update PDF	*/}


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

        {/* Delete subject Modal */}
        <div className="modal fade" id="delete-sub-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete this subject, this cant be undone
                    once you delete.
                  </p>
                  {
                    deleteSubId && (<div className="d-flex justify-content-center">
                      <button
                        onClick={(e) => cancelDeleteSubj(e)}
                        className="btn btn-light me-3"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button onClick={(e) => handleDeleteSubj(deleteSubId, e)} className="btn btn-danger"
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
      </div>
    </div>
  );
};

export default ClassSyllabus;
