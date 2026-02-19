
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Core imports
import Table from "../../../core/common/dataTable";
import CommonSelect from "../../../core/common/commonSelect";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../../router/all_routes";
import { activeList } from "../../../core/common/selectoption/selectoption";
import { getAllSection, addClassSection, deleteSection, speSection, editSection } from "../../../service/api";
import { allClassRoom, allRealClasses } from "../../../service/classApi";
import { Spinner } from "../../../spinner";


interface AllSection {
  id: number;
  class_name: string;
  room_no: number;
  section: string;
  noOfStudents: number;
  noOfSubjects: number;
  status: string;
}



interface SectionData {
  class_id: number | null,
  room_no: number | null,
  section: string;
  noOfStudents: string;
  noOfSubjects: string;
  status: string;
}

// OPTIONS
export interface Room {
  id: number;
  room_no: number;
}

export interface classes {
  id: number,
  class_name: string;
}





const Classes: React.FC = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // 🔹 State
  const [allSections, setAllSections] = useState<AllSection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionData, setSectionData] = useState<SectionData>({
    class_id: null,
    room_no: null,
    section: "",
    noOfStudents: "",
    noOfSubjects: "",
    status: "0",
  });
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState({
    class_id: "",
    room_no: "",
    section: "",
    noOfStudents: "",
    noOfSubjects: ""
  });
  const [addModal ,setAddModal] = useState<boolean>(false)
  const [editModal ,setEditModal] = useState<boolean>(false)

  // 🔹 Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSectionData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSelectChange = (name: keyof SectionData, value: number | string) => {
    setSectionData((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const fetchSectionbyId = async (id: number) => {

    try {
      const { data } = await speSection(id)

      if (data.success) {
        setEditId(id)
        setSectionData({
          class_id: data.data.class_id,
          room_no: data.data.room_no,
          section: data.data.section,
          status: data.data.status,
          noOfStudents: data.data.noOfStudents,
          noOfSubjects: data.data.noOfSubjects,
        })
        setEditModal(true)
      }

    } catch (error) {
      console.log(error)
    }

  }

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { class_id: "", room_no: "", section: "", noOfStudents: "", noOfSubjects: "" };


    if (!sectionData.class_id) {
      newErrors.class_id = "Please select a class.";
      isValid = false;
    }


    if (!sectionData.room_no) {
      newErrors.room_no = "Please select a room number.";
      isValid = false;
    }

    if (!sectionData.noOfStudents) {
      newErrors.noOfStudents = "NO of students are required !",
        isValid = false
    } else if (Number(sectionData.noOfStudents )<= 0) {
      newErrors.noOfStudents = "NO of students should be greater than 0 !",
        isValid = false
    }

    if (!sectionData.noOfSubjects) {
      newErrors.noOfSubjects = "NO of subjects are required !",
        isValid = false
    } else if (Number(sectionData.noOfSubjects) <= 0) {
      newErrors.noOfSubjects = "NO of subjects should be greater than 0 !",
        isValid = false
    }


    if (!sectionData.section.trim()) {
      newErrors.section = "Section name is required.";
      isValid = false;
    } else if (sectionData.section.length > 1) {
      newErrors.section = "Section name should only contain 1 character (like A, B, C).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
  

    try {
      if (editId) {
        const { data } = await editSection(sectionData, editId);
        if (data.success) {
          toast.success(data.message);
          setEditModal(false)
          setEditId(null);
        }
      } else {
        const { data } = await addClassSection(sectionData);
        if (data.success) {
          toast.success(data.message);
          setAddModal(false)
        }
      }


      setSectionData({ class_id: null, room_no: null, section: "", status: "0", noOfStudents: "", noOfSubjects: "" });
      setErrors({ class_id: "", room_no: "", section: "", noOfStudents: "", noOfSubjects: "" });
      fetchSection();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditId(null)
    setSectionData({ class_id: null, room_no: null, section: "", status: "0", noOfStudents: "", noOfSubjects: "" });
    setErrors({ class_id: "", room_no: "", section: "", noOfStudents: "", noOfSubjects: "" });
    setAddModal(false)
    setEditModal(false)
  }

  // 🔹 Fetch Sections
  const fetchSection = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500))
    try {

      const { data } = await getAllSection();
    

      if (data.success) {
        setAllSections(data.data);
      }
    } catch (error: any) {
      console.error(error);
      toast.warning(error.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const tableData = allSections.map((item) => ({
    key: item.id,
    id: item.id,
    sectionName: item.section,
    class_name: item.class_name,
    noOfSubjects: item.noOfSubjects,
    noOfStudents: item.noOfStudents,
    room_no: item.room_no,
    status: item.status === "1" ? "Active" : "Inactive",
  }));


  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delModal , setDelModal] =useState<boolean>(false)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    try {

      const { data } = await deleteSection(id)
      if (data.success) {
        toast.success(data.message)
        fetchSection();
        setDeleteId(null)
        setDelModal(false)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
    setDelModal(false)
  }

  // 🔹 Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a: AllSection, b: AllSection) => a.id - b.id,
      render: (id: number) => <Link to="#" className="link-primary">SEC{id}</Link>,
    },
    {
      title: "Class",
      dataIndex: "class_name",
      render: (text: string) => (
        <span className="text-uppercase">{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.class_name.localeCompare(b.class_name),
    },
    {
      title: "Section Name",
      dataIndex: "sectionName",
      render: (text: string) => (
        <span className="text-uppercase">{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.sectionName.localeCompare(b.sectionName),
    },
    {
      title: "Room No",
      dataIndex: "room_no",
      render: (roomno: number) => (
        <span>{roomno}</span>
      ),
      sorter: (a: any, b: any) =>
        a.room_no - b.room_no,
    },
    {
      title: "NoOfStudents",
      dataIndex: "noOfStudents",
      render: (text: any) => (
        <span>{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.noOfStudents - b.noOfStudents,
    },
    {
      title: "NoOfSubjects",
      dataIndex: "noOfSubjects",
      render: (text: any) => (
        <span>{text}</span>
      ),
      sorter: (a: any, b: any) =>
        a.noOfSubjects - b.noOfSubjects,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <span
          className={`badge d-inline-flex align-items-center ${status === "Active"
            ? "badge-soft-success"
            : "badge-soft-danger"
            }`}
        >
          <i className="ti ti-circle-filled fs-5 me-1" />
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
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
                onClick={() => fetchSectionbyId(id)}
               
              >
                <i className="ti ti-edit-circle me-2" /> Edit
              </button>
            </li>
            <li>
              <button
                className="dropdown-item rounded-1"
                onClick={() =>{ 
                  setDeleteId(id) 
                  setDelModal(true)
                }}
                
              >
                <i className="ti ti-trash-x me-2" /> Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];


  // OPTIONS 
  const [rooms, setRooms] = useState<Room[]>([])
  const [allClass, setAllClass] = useState<classes[]>([])

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


  const fetchRooms = () => fetchData(allClassRoom, setRooms)
  const fetchClasses = () => fetchData(allRealClasses, setAllClass)

  useEffect(() => {
    fetchClasses()
    fetchRooms()

  }, []);


  const roomOptions = useMemo(
    () => rooms.map((r) => ({ value: r.id, label: String(r.room_no) })),
    [rooms]
  );

  const classOptions = useMemo(
    () => allClass.map((c) => ({ value: c.id, label: String(c.class_name) })),
    [allClass]
  );

  const handleApplyClick = () => {
    dropdownMenuRef.current?.classList.remove("show");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* 🔹 Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Sections</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Academic</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Sections
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
                onClick={()=>setAddModal(true)}
                 
              >
                <i className="ti ti-square-rounded-plus-filled me-2" />
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Table Card */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Class Section</h4>
            <div className="d-flex align-items-center flex-wrap">
             
              {/* Filter */}
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" /> Filter
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
                            <label className="form-label">Section</label>
                            <CommonSelect className="select" options={activeList} />
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

              {/* Sort */}
              <div className="dropdown mb-3">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" /> Sort by A-Z
                </Link>
                <ul className="dropdown-menu p-3">
                  <li><Link to="#" className="dropdown-item rounded-1 active">Ascending</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Descending</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Recently Viewed</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Recently Added</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="card-body p-0 py-3">
            {loading ? (
              <Spinner/>
            ) : (
              <Table columns={columns} dataSource={tableData} Selection />
            )}
          </div>
        </div>
      </div>


      {/* 🔹 Add Section Modal */}
    {
      addModal&&(
          <div className="modal fade show d-block" id="add_class_section">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title">Add Section</h4>
                <button type="button" onClick={(e) => handleCancel(e)} className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>

              <div className="modal-body">
                {/* 🔸 Class */}
                <div className="mb-3">
                  <label className="form-label">Class</label>
                  <CommonSelect
                    className={`select ${errors.class_id ? "is-invalid" : ""}`}
                    options={classOptions}
                    value={sectionData.class_id}
                    onChange={(opt) => handleSelectChange("class_id", opt ? opt.value : "")}
                  />
                  {errors.class_id && <small className="text-danger">{errors.class_id}</small>}
                </div>


                <div className="mb-3">
                  <label className="form-label">Room No</label>
                  <CommonSelect
                    className={`select ${errors.room_no ? "is-invalid" : ""}`}
                    options={roomOptions}
                    value={sectionData.room_no}
                    onChange={(opt) => handleSelectChange("room_no", opt ? opt.value : "")}
                  />
                  {errors.room_no && <small className="text-danger">{errors.room_no}</small>}
                </div>


                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className={`form-control text-uppercase ${errors.section ? "is-invalid" : ""}`}
                    name="section"
                    value={sectionData.section}
                    onChange={handleChange}
                    maxLength={1}
                  />
                  {errors.section && <small className="text-danger">{errors.section}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label">No of Students</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter no of Students"
                    name="noOfStudents"
                    value={sectionData.noOfStudents}
                    onChange={handleChange}
                  />
                  {errors.noOfStudents && <small className="text-danger">{errors.noOfStudents}</small>}
                </div>

                {/* No of Subjects */}
                <div className="mb-3">
                  <label className="form-label">No of Subjects</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter no of Subjects"
                    name="noOfSubjects"
                    value={sectionData.noOfSubjects}
                    onChange={handleChange}
                  />
                  {errors.noOfSubjects && <small className="text-danger">{errors.noOfSubjects}</small>}
                </div>


                <div className="d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="status"
                      checked={sectionData.status === "1"}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )
    }


      {/* edit section modal */}
       {
        editModal&&(<div className="modal fade show d-block" id="edit_section">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title">Edit Section</h4>
                <button type="button" onClick={(e) => handleCancel(e)} className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>

              <div className="modal-body">
                {/* 🔸 Class */}
                <div className="mb-3">
                  <label className="form-label">Class</label>
                  <CommonSelect
                    className={`select ${errors.class_id ? "is-invalid" : ""}`}
                    options={classOptions}
                    value={sectionData.class_id}
                    onChange={(opt) => handleSelectChange("class_id", opt ? opt.value : "")}
                  />
                  {errors.class_id && <small className="text-danger">{errors.class_id}</small>}
                </div>


                <div className="mb-3">
                  <label className="form-label">Room No</label>
                  <CommonSelect
                    className={`select ${errors.room_no ? "is-invalid" : ""}`}
                    options={roomOptions}
                    value={sectionData.room_no}
                    onChange={(opt) => handleSelectChange("room_no", opt ? opt.value : "")}
                  />
                  {errors.room_no && <small className="text-danger">{errors.room_no}</small>}
                </div>


                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className={`form-control text-uppercase ${errors.section ? "is-invalid" : ""}`}
                    name="section"
                    value={sectionData.section}
                    onChange={handleChange}
                    maxLength={1}
                  />
                  {errors.section && <small className="text-danger">{errors.section}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label">No of Students</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter no of Students"
                    name="noOfStudents"
                    value={sectionData.noOfStudents}
                    onChange={handleChange}
                  />
                  {errors.noOfStudents && <small className="text-danger">{errors.noOfStudents}</small>}
                </div>

                {/* No of Subjects */}
                <div className="mb-3">
                  <label className="form-label">No of Subjects</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter no of Subjects"
                    name="noOfSubjects"
                    value={sectionData.noOfSubjects}
                    onChange={handleChange}
                  />
                  {errors.noOfSubjects && <small className="text-danger">{errors.noOfSubjects}</small>}
                </div>


                <div className="d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="status"
                      checked={sectionData.status === "1"}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>)
       }
      {/* edit section modal */}

      {/* Delete Modal */}
      {
        delModal&&(<div className="modal fade show d-block" id="delete-modal">
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

export default Classes;

