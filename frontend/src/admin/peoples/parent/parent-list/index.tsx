import { useEffect, useRef, useState } from "react";
import ParentModal from "../parentModal";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  allClass,
  names,
  parent,
  status,
} from "../../../../core/common/selectoption/selectoption";
// import { parentData } from "../../../../core/data/json/parentlistdata";
import type { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import TooltipOption from "../../../../core/common/tooltipOption";
import { allParents, deleteFile, deleteParent, editParent, Imageurl, parentForEdit, speParent, uploadStudentFile } from "../../../../service/api";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../../../handlePopUpmodal";

export interface ParentData {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
  Parent_Add: string;   
  stu_img: string;
  stu_id: number;
  section: string;
  class: string;
  Student_Add: string;  
  firstname: string;
  lastname: string;
  rollnum:number;
}

export interface SpeParentData {
  id: number;
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
  Parent_Add: string;
  stu_img: string;
  stu_id: number;
  class: string;
  section: string;
  gender: string;
  rollnum: string;
  admissiondate: string;
  admissionnum: string;
  Student_Add: string;
  firstname: string;
  lastname: string;
  status: string;
}

export interface ParentDataForEdit {
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
}

const ParentList = () => {
  const [show, setShow] = useState(false);
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const handleClose = () => {
    setShow(false);
  };



  const [parents, setParents] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const fetchParentsData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await allParents()
      if (data.success) {
        setParents(data.data)

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParentsData()

  }, [])


  const tableData = parents.map((parent) => ({
    key: parent.id,
    id: parent.id,
    userId: parent.user_id,
    name: parent.name,
    child: `${parent.firstname} ${parent.lastname}`,
    class: `${parent.class},${parent.section}`,
    phone: parent.phone_num,
    email: parent.email,
   rollnum:parent.rollnum,
    stu_img: parent.stu_img,
    img: parent.img_src

  }))


  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // speparentdta ======================================================================


  // useState ka sahi tareeka
  const [speParentData, setSpeParentData] = useState<SpeParentData | null>(null);
  const [loading2, setLoading2] = useState<boolean>(false)


  const fetchSpecficParentData = async (parentId: number) => {
    setShow(true)
    setLoading2(true)
    // await new Promise((res)=>setTimeout(res,500))
    try {

      const { data } = await speParent(parentId)

      if (data.success) {
        setSpeParentData(data.data)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading2(false)
    }
  }

  // delete -----------------------------------------
  const [parentId, setParentId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const setDleteIds = (id: number, userId: number) => {
    setParentId(id)
    setUserId(userId)
  }


  const handleDelete = async (id: number, userId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(id, userId)
    try {


      const { data } = await deleteParent(id, userId)
      if (data.success) {
        toast.success(data.message)
        setParentId(null)
        setUserId(null)
        fetchParentsData()
        handleModalPopUp('delete-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleCancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setParentId(null)
    setUserId(null)
  }

  // edit parent-------------------------------------
  const [formData, setFormData] = useState<ParentDataForEdit>({
    name: "",
    phone_num: "",
    email: "",
    img_src: "",
  });
  const [fatImg, setFatImg] = useState<File | null>(null)
  const [fatImgId, setFatImgId] = useState<number | null>(null)
  const [orginalImgPath, setOriginalImgPath] = useState<string>("")
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState<{
    name?: string;
    phone_num?: string;
    email?: string;
  }>({});


  const fetchParentDataForEdit = async (id: number) => {
    try {
      const { data } = await parentForEdit(id)
      if (data.success) {
        setFormData({
          name: data.data.name,
          phone_num: data.data.phone_num,
          email: data.data.email,
          img_src: data.data.img_src,
        })
        setEditId(id)
        setOriginalImgPath(data.data.img_src)
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];


      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPG, PNG files are allowed.");
        return;
      }

      setFatImg(file);
      const imgformData = new FormData();
      imgformData.append("stufile", file);

      try {

        const res = await uploadStudentFile(imgformData)
        const uploadedPath = res.data.file;
        const id = res.data.insertId;
        setFormData((prev) => ({ ...prev, img_src: uploadedPath }))
        setFatImgId(id)


      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };
  const deleteImage = async (id: number) => {
    if (!id) return;

    try {
      const deletefile = await deleteFile(id)

      if (deletefile.data.success) {
        setFatImgId(null);
        setFatImg(null);
        setFormData((prev) => ({ ...prev, img_src: orginalImgPath }))
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const validateForm = () => {
    const newErrors: typeof errors = {};


    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }


    if (!formData.phone_num.trim()) {
      newErrors.phone_num = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_num)) {
      newErrors.phone_num = "Phone number must be 10 digits";
    }


    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) {
        const { data } = await editParent(formData, editId);
        if (data.success) {
          toast.success(data.message);
          fetchParentsData()
          handleModalPopUp("edit_parent");
          setFormData({ name: "", phone_num: "", email: "", img_src: "" });
          setErrors({});
          setEditId(null);
          setOriginalImgPath("");
          setFatImgId(null);
          setFatImg(null);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault

    handleModalPopUp('edit_parent')
    setFormData({
      name: "",
      phone_num: "",
      email: "",
      img_src: "",
    })
    setEditId(null)
    setOriginalImgPath('')
    setFatImgId(null)
    setFatImg(null)
    setErrors({})

  }


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <div  onClick={() => setShow(true)} className="link-primary">
          PRT{text}
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Parent Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="avatar avatar-md"
            onClick={() => fetchSpecficParentData(record.id)}
          >
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#" onClick={() => fetchSpecficParentData(record.id)}>
                {text}
              </Link>
            </p>
            <span className="fs-12">{record.Addedon}</span>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Child",
      dataIndex: "child",
      render: (text: string, record: any) => (

        <div className="d-flex align-items-center">
          <Link to={`${routes.studentDetail}/${record.rollnum}`} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.stu_img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.studentDetail}/${record.rollnum}`}>{text}</Link>
            </p>
            <span className="fs-12">{record.class}</span>
          </div>
        </div>
        
      ),
      sorter: (a: TableData, b: TableData) => a.Child.length - b.Child.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: TableData, b: TableData) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: TableData, b: TableData) => a.email.length - b.email.length,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number, record: any) => (
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
                    onClick={() => fetchSpecficParentData(id)}
                  >
                    <i className="ti ti-menu me-2" />
                    View Parent
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => fetchParentDataForEdit(id)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_parent"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => setDleteIds(id, record.userId)}
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

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Parents</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">People</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Parents
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              {/* <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_parent"
                  className="btn btn-primary"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Parent
                </Link>
              </div> */}
            </div>
          </div>
          {/* /Page Header */}
          {/* Parent List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Parents List</h4>
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
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Parent</label>
                              <CommonSelect
                                className="select"
                                options={parent}
                                defaultValue={parent[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Child</label>
                              <CommonSelect
                                className="select"
                                options={names}
                                defaultValue={names[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                defaultValue={allClass[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                                defaultValue={status[0]}
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
                <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                  <Link
                    to={routes.parentList}
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.parentGrid}
                    className="btn btn-icon btn-sm bg-light primary-hover"
                  >
                    <i className="ti ti-grid-dots" />
                  </Link>
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
              {/* Student List */}
              {
                loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (<Table dataSource={tableData} columns={columns} Selection={true} />)
              }

              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
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
                  (parentId && userId) && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => handleCancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e) => handleDelete(parentId, userId, e)} className="btn btn-danger" >
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

      {/* Edit Parent */}
      <div className="modal fade" id="edit_parent">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Parent</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div id="modal-tag" className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
                      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">

                        {
                          fatImgId && fatImg ? (<img
                            src={URL.createObjectURL(fatImg)}
                            alt="Parent"
                            className=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />) : (<img
                            src={`${Imageurl}/${orginalImgPath}`}
                            alt="Parent"
                            className=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />)
                        }
                      </div>

                      <div className="profile-upload">
                        <div className="profile-uploader d-flex align-items-center">
                          <div className="drag-upload-btn mb-3">
                            Upload
                            <input
                              type="file"
                              className="form-control image-sign"
                              onChange={handleFileChange}
                            />
                          </div>
                          {fatImgId && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mb-3"
                              onClick={() => deleteImage(fatImgId)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Enter Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.phone_num ? "is-invalid" : ""}`}
                        placeholder="Enter Phone Number"
                        name="phone_num"
                        value={formData.phone_num}
                        onChange={handleChange}
                      />
                      {errors.phone_num && (
                        <div className="invalid-feedback">{errors.phone_num}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>


                  </div>
                </div>
              </div>


              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => cancelEdit(e)}
                  className="btn btn-light me-2"

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
      {/* /Edit Parent */}

      <ParentModal />


      <Modal show={show} onHide={handleClose} centered size="lg">
        <div className="modal-header">
          <h4 className="modal-title">View Details</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        {
          loading2 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) :
            (speParentData && (
              <div className="modal-body mb-0">
                <div className="parent-wrap">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <div className="d-flex align-items-center mb-3">
                        <span className="avatar avatar-xl me-2">
                          <img
                            src={`${Imageurl}/${speParentData.img_src}`}
                            alt="img"
                          />
                        </span>
                        <div className="parent-name">
                          <h5 className="mb-1">Thomas</h5>
                          <p>Added on {formatDate(speParentData.Parent_Add)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <ul className="d-flex align-items-center">
                        <li className="mb-3 me-5">
                          <p className="mb-1">Email</p>
                          <h6 className="fw-normal">{speParentData.email}</h6>
                        </li>
                        <li className="mb-3">
                          <p className="mb-1">Phone</p>
                          <h6 className="fw-normal">{speParentData.phone_num}</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <h5 className="mb-3">Children Details</h5>
                <div className="border rounded p-4 pb-1 mb-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
                    <span className="link-primary mb-2">{speParentData.admissionnum}</span>
                    <span className={`badge ${speParentData.status == "1" ? "badge-soft-success" : "badge-soft-danger"} badge-md mb-2`}>
                      <i className="ti ti-circle-filled me-2" />
                      {speParentData.status == "1" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-3">
                      <Link to={routes.studentDetail} className="avatar">
                        <img
                          src={`${Imageurl}/${speParentData.stu_img}`}
                          className="img-fluid rounded-circle"
                          alt="img"
                        />
                      </Link>
                      <div className="ms-2">
                        <p className="mb-0">
                          <Link to={routes.studentDetail}>{`${speParentData.firstname} ${speParentData.lastname}`}</Link>
                        </p>
                        <span>{speParentData.class}, {speParentData.section}</span>
                      </div>
                    </div>
                    <ul className="d-flex align-items-center flex-wrap">
                      <li className="mb-3 me-4">
                        <p className="mb-1">Roll No</p>
                        <h6 className="fw-normal">{speParentData.rollnum}</h6>
                      </li>
                      <li className="mb-3 me-4">
                        <p className="mb-1">Gender</p>
                        <h6 className="fw-normal">{speParentData.gender}</h6>
                      </li>
                      <li className="mb-3">
                        <p className="mb-1">Date of Joined</p>
                        <h6 className="fw-normal">{formatDate(speParentData.admissiondate)}</h6>
                      </li>
                    </ul>
                    <div className="d-flex align-items-center">
                      <Link
                        to={`${routes.studentDetail}/${speParentData.stu_id}`}
                        className="btn btn-primary mb-3"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            ))
        }

      </Modal>

    </>



  );
};

export default ParentList;
