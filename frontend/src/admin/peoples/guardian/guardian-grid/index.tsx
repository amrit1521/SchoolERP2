import { useEffect, useRef, useState } from "react";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import {
  names,
  parent,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import { Modal } from "react-bootstrap";
import GuardianModal from "../guardianModal";
import TooltipOption from "../../../../core/common/tooltipOption";
import { toast } from "react-toastify";
import { allGuardians, deleteGuardian, deleteFile, guardianForEdit, Imageurl, uploadStudentFile, speGuardian, editGuardian } from "../../../../service/api";
import { Skeleton } from "antd";
import { handleModalPopUp } from "../../../../handlePopUpmodal";





export interface GuaData {
  id: number;
  user_id: number;
  img_src: string;
  name: string;
  Gua_Add: string;
  email: string;
  phone_num: string;
  stu_img: string;
  stu_id: string;
  firstname: string;
  lastname: string;
  rollnum:number;
}

export interface SpeGuardianData {
  id: number;
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
  Guardian_Add: string;
  stu_img: string;
  stu_id: number;
  class: string;
  section: string;
  gender: string;
  rollnum: number;
  admissiondate: string;
  admissionnum: string;
  Student_Add: string;
  firstname: string;
  lastname: string;
  status: string;
}

export interface GuardianDataForEdit {
  name: string;
  email: string;
  phone_num: string;
  img_src: string;
}

const GuardianGrid = () => {


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



  const [allGuaData, setAllGuaData] = useState<GuaData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchGuardians = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 800))
    try {
      const { data } = await allGuardians()
      if (data.success) {
        setAllGuaData(data.data)

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    fetchGuardians()
  }, [])

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // speguardiandta ======================================================================

  const [speGuardianData, setSpeGuardianData] = useState<SpeGuardianData | null>(null);
  const [loading2, setLoading2] = useState<boolean>(false);

  const fetchSpecficGuardianData = async (guardianId: number) => {
    setShow(true);
    setLoading2(true);
    // await new Promise((res)=>setTimeout(res,500))
    try {
      const { data } = await speGuardian(guardianId);

      if (data.success) {
        setSpeGuardianData(data.data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading2(false);
    }
  };

  function formatDateHuman(dateStr: string): string {
    // Input format: DD-MM-YYYY
    const [day, month, year] = dateStr.split("-").map(Number);

    // Month names array
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return `${day} ${monthNames[month - 1]} ${year}`;
  }
  // delete -----------------------------------------
  const [guaId, setGuaId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const setDeleteIds = (id: number, userId: number) => {
    setGuaId(id)
    setUserId(userId)
  }


  const handleDelete = async (id: number, userId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(parentId, userId)
    try {

      const { data } = await deleteGuardian(id, userId)
      if (data.success) {
        toast.success(data.message)
        setGuaId(null)
        setUserId(null)
        fetchGuardians()
        handleModalPopUp('delete-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleCancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setGuaId(null)
    setUserId(null)
  }


  // edit guardian-------------------------------------
  const [formData, setFormData] = useState<GuardianDataForEdit>({
    name: "",
    phone_num: "",
    email: "",
    img_src: "",
  });
  const [guaImg, setGuaImg] = useState<File | null>(null)
  const [guaImgId, setGuaImgId] = useState<number | null>(null)
  const [orginalImgPath, setOriginalImgPath] = useState<string>("")
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState<{
    name?: string;
    phone_num?: string;
    email?: string;
  }>({});


  const fetchGuardianDataForEdit = async (id: number) => {
    try {
      const { data } = await guardianForEdit(id)
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

      setGuaImg(file);
      const imgformData = new FormData();
      imgformData.append("stufile", file);

      try {

        const res = await uploadStudentFile(imgformData)
        const uploadedPath = res.data.file;
        const id = res.data.insertId;
        setFormData((prev) => ({ ...prev, img_src: uploadedPath }))
        setGuaImgId(id)


      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };
  const deleteImage = async (id: Number) => {
    if (!id) return;

    try {
      const deletefile = await deleteFile(id)

      if (deletefile.data.success) {
        setGuaImgId(null);
        setGuaImg(null);
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
        const { data } = await editGuardian(formData, editId);
        if (data.success) {
          toast.success(data.message);
          fetchGuardians()
          handleModalPopUp("edit_guardian");
          setFormData({ name: "", phone_num: "", email: "", img_src: "" });
          setErrors({});
          setEditId(null);
          setOriginalImgPath("");
          setGuaImgId(null);
          setGuaImg(null);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault

    handleModalPopUp('edit_guardian')
    setFormData({
      name: "",
      phone_num: "",
      email: "",
      img_src: "",
    })
    setEditId(null)
    setOriginalImgPath('')
    setGuaImgId(null)
    setGuaImg(null)
    setErrors({})
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Guardian</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Guardian
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />

              {/* <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_guardian"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Guardian
                </Link>
              </div> */}
            </div>
          </div>
          {/* /Page Header */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Guardian Grid</h4>
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
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Guardian Name</label>
                            <CommonSelect
                              className="select"
                              options={parent}
                            // defaultValue={parent[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Child</label>
                            <CommonSelect
                              className="select"
                              options={names}
                            // defaultValue={names[0]}
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
                  to={routes.guardiansList}
                  className=" btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.guardiansGrid}
                  className=" active btn btn-icon btn-sm  primary-hover"
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
          <div className="row">
            {/* Guardian Grid */}

            {
              loading ? (
                // 👇 Skeleton Card UI
                [...Array(4)].map((_, index) => (
                  <div className="col-xl-4 col-md-6 d-flex" key={index}>
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <Skeleton.Input active size="small" style={{ width: 80 }} />
                        <Skeleton.Button active size="small" shape="circle" />
                      </div>

                      <div className="card-body">
                        <div className="bg-light-300 rounded-2 p-3 mb-3">
                          <div className="d-flex align-items-center">
                            <Skeleton.Avatar active size="large" shape="circle" />
                            <div className="ms-2 d-flex flex-column" style={{ flex: 1 }}>
                              <Skeleton.Input
                                active
                                size="small"
                                style={{ width: "20%" }}
                              />
                              <Skeleton.Input active size="small" style={{ width: "60%", marginTop: '5px' }} />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between gx-2">
                          <div className="d-flex flex-column">
                            <Skeleton.Input active size="small" style={{ width: 60 }} />
                            <Skeleton.Input active size="small" style={{ width: 100, marginTop: '5px' }} />
                          </div>
                          <div className="d-flex flex-column ">
                            <Skeleton.Input active size="small" style={{ width: 60 }} />
                            <Skeleton.Input active size="small" style={{ width: 100, marginTop: '5px' }} />
                          </div>
                        </div>
                      </div>

                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Skeleton.Avatar active size="default" shape="circle" />
                          <Skeleton.Input
                            active
                            size="small"
                            style={{ width: 120, marginLeft: 10 }}
                          />
                        </div>
                        <Skeleton.Button active size="small" style={{ width: 100 }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : allGuaData.length > 0 ? (
                allGuaData.map((gua) => (
                  <div className="col-xl-4 col-md-6 d-flex" key={gua.id}>
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <Link
                          to="#"
                          className="link-primary"
                          onClick={() => fetchSpecficGuardianData(gua.id)}
                        >
                          {gua.id}
                        </Link>
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
                                  onClick={() => fetchGuardianDataForEdit(gua.id)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_guardian"
                                >
                                  <i className="ti ti-edit-circle me-2" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item rounded-1"
                                  onClick={() => setDeleteIds(gua.id, gua.user_id)}
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
                      </div>

                      <div className="card-body">
                        <div className="bg-light-300 rounded-2 p-3 mb-3">
                          <div className="d-flex align-items-center">
                            <div

                              onClick={() => fetchSpecficGuardianData(gua.id)}
                              className="avatar avatar-lg flex-shrink-0"
                            >
                              <img
                                src={`${Imageurl}/${gua.img_src}`}
                                className="img-fluid rounded-circle"
                                alt="img"
                              />
                            </div>
                            <div className="ms-2">
                              <h6 className="text-dark text-truncate mb-0">
                                <div onClick={() => fetchSpecficGuardianData(gua.id)}>
                                  {gua.name}
                                </div>
                              </h6>
                              <p>Added on {formatDate(gua.Gua_Add)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gx-2">
                          <div>
                            <p className="mb-0">Email</p>
                            <p className="text-dark">{gua.email}</p>
                          </div>
                          <div>
                            <p className="mb-0">Phone</p>
                            <p className="text-dark">{gua.phone_num}</p>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <Link
                              to={`${routes.studentDetail}/${gua.rollnum}`}
                              className="avatar avatar-md flex-shrink-0 p-0 me-2"
                            >
                              <img
                                src={`${Imageurl}/${gua.stu_img}`}
                                alt="img"
                                className="img-fluid rounded-circle"
                              />
                            </Link>
                             <Link
                              to={`${routes.studentDetail}/${gua.rollnum}`} className="text-dark">{`${gua.firstname} ${gua.lastname}`}</Link>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="btn btn-light btn-sm"
                          onClick={() => fetchSpecficGuardianData(gua.id)}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>Not Found</>
              )
            }
            <div className="col-md-12">
              <div className="load-more text-center">
                <Link to="#" className="btn btn-primary">
                  <i className="ti ti-loader-3" />
                  Load More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {
        loading2 ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          speGuardianData && (
            <>
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
                <div className="modal-body mb-0">
                  <div className="guardian-wrap">
                    <div className="row align-items-center">
                      <div className="col-lg-6">
                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-xl me-2">
                            <img
                              src={`${Imageurl}/${speGuardianData.img_src}`}
                              alt="img"
                            />
                          </span>
                          <div className="guardian-name">
                            <h5 className="mb-1">{speGuardianData.name}</h5>
                            <p>
                              Added on {formatDate(speGuardianData.Guardian_Add)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <ul className="d-flex align-items-center">
                          <li className="mb-3 me-5">
                            <p className="mb-1">Email</p>
                            <h6 className="fw-normal">{speGuardianData.email}</h6>
                          </li>
                          <li className="mb-3">
                            <p className="mb-1">Phone</p>
                            <h6 className="fw-normal">
                              {speGuardianData.phone_num}
                            </h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3">Children Details</h5>
                  <div className="border rounded p-4 pb-1 mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
                      <span className="link-primary mb-2">
                        {speGuardianData.admissionnum}
                      </span>
                      <span
                        className={`badge ${speGuardianData.status == "1"
                          ? "badge-soft-success"
                          : "badge-soft-danger"
                          } badge-md mb-2`}
                      >
                        <i className="ti ti-circle-filled me-2" />
                        {speGuardianData.status == "1" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-3">
                        <Link to={`${routes.studentDetail}/${speGuardianData.stu_id}`} className="avatar">
                          <img
                            src={`${Imageurl}/${speGuardianData.stu_img}`}
                            className="img-fluid rounded-circle"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2">
                          <p className="mb-0">
                            <Link to={`${routes.studentDetail}/${speGuardianData.rollnum}`}>{`${speGuardianData.firstname} ${speGuardianData.lastname}`}</Link>
                          </p>
                          <span>
                            {speGuardianData.class}, {speGuardianData.section}
                          </span>
                        </div>
                      </div>

                      <ul className="d-flex align-items-center flex-wrap">
                        <li className="mb-3 me-4">
                          <p className="mb-1">Roll No</p>
                          <h6 className="fw-normal">{speGuardianData.rollnum}</h6>
                        </li>
                        <li className="mb-3 me-4">
                          <p className="mb-1">Gender</p>
                          <h6 className="fw-normal">{speGuardianData.gender}</h6>
                        </li>
                        <li className="mb-3">
                          <p className="mb-1">Date of Joined</p>
                          <h6 className="fw-normal">
                            {formatDateHuman(speGuardianData.admissiondate)}
                          </h6>
                        </li>
                      </ul>

                      <div className="d-flex align-items-center">
                        <Link
                          to={`${routes.studentDetail}/${speGuardianData.rollnum}`}
                          className="btn btn-primary mb-3"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </>
          )
        )
      }

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
                  (guaId && userId) && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => handleCancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e) => handleDelete(guaId, userId, e)} className="btn btn-danger" data-bs-dismiss="modal">
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
      <div className="modal fade" id="edit_guardian">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Guardian</h4>
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
                          guaImgId && guaImg ? (<img
                            src={URL.createObjectURL(guaImg)}
                            alt="guardian"
                            className=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />) : (<img
                            src={`${Imageurl}/${orginalImgPath}`}
                            alt="guardian"
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
                          {guaImgId && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm mb-3"
                              onClick={() => deleteImage(guaImgId)}
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
      <GuardianModal />
    </>
  );
};

export default GuardianGrid;
