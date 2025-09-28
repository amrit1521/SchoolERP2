import React, { useEffect, useRef, useState } from "react";
// import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import ParentModal from "../parentModal";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import {
  names,
  parent,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import { Modal } from "react-bootstrap";
import TooltipOption from "../../../../core/common/tooltipOption";
import { allParents, deleteParent, Imageurl, speParent } from "../../../../service/api";
import { toast } from "react-toastify";
import { Skeleton } from "antd";
import { handleModalPopUp } from "../../../../handlePopUpmodal";

const ParentGrid = () => {
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
  interface ParentData {
    id: number;
    img_src: string;
    name: string;
    Parent_Add: string;
    email: string;
    phone_num: string;
    stu_img: string;
    firstname: string;
    lastname: string;
  }


  const [allparentData, setAllParentData] = useState<ParentData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchParents = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 800))
    try {
      const { data } = await allParents()
      if (data.success) {
        setAllParentData(data.data)

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    fetchParents()
  }, [])

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // speparentdta ======================================================================

  // Interface define kijiye
  interface SpeParentData {
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
  const [parentId, setParentId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const setDleteIds = (id: number, userId: number) => {
    setParentId(id)
    setUserId(userId)
  }


  const handleDelete = async(id:number , userId:number ,e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // console.log(parentId, userId)
    try {


      const {data} = await deleteParent(id , userId)
        if(data.success){
          toast.success(data.message)
           setParentId(null)
           setUserId(null)
           fetchParents()
           handleModalPopUp('delete-modal')
        }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleCancelDelete = (e:React.MouseEvent<HTMLButtonElement>)=>{
           e.preventDefault()
           setParentId(null)
           setUserId(null)
  }


  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Parents</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
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
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_parent"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Parent
                </Link>
              </div> */}
            </div>
          </div>
          {/* /Page Header */}
          <div className="bg-white p-3 border rounded-1 d-flex align-items-center justify-content-between flex-wrap mb-4 pb-0">
            <h4 className="mb-3">Parents Grid</h4>
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
                            <label className="form-label">Parent</label>
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
                  to={routes.parentList}
                  className=" btn btn-icon btn-sm me-1 bg-light primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={routes.parentGrid}
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

            {loading
              ? [...Array(5)].map((_, index) => (
                <div className="col-xl-4 col-md-6 d-flex" key={index}>
                  <div className="card flex-fill">
                    {/* Card Header */}
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <Skeleton.Input style={{ width: 60 }} active size="small" />
                      <Skeleton.Button active size="small" shape="circle" />
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <div className="bg-light-300 rounded-2 p-3 mb-3">
                        <div className="d-flex align-items-center">
                          <Skeleton.Avatar active size="large" shape="circle" />
                          <div className="ms-2 d-flex flex-column" style={{ flex: 1 }}>
                            <Skeleton.Input
                              style={{ width: "50%", marginBottom: 8 }}
                              active
                              size="small"
                            />
                            <Skeleton.Input
                              style={{ width: "45%" }}
                              active
                              size="small"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between gx-2">
                        <div className="d-flex flex-column">
                          <Skeleton.Input
                            style={{ width: 60, marginBottom: 6 }}
                            active
                            size="small"
                          />
                          <Skeleton.Input
                            style={{ width: 120 }}
                            active
                            size="small"
                          />
                        </div>
                        <div className="d-flex flex-column">
                          <Skeleton.Input
                            style={{ width: 60, marginBottom: 6 }}
                            active
                            size="small"
                          />
                          <Skeleton.Input
                            style={{ width: 100 }}
                            active
                            size="small"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Skeleton.Avatar
                          active
                          size="default"
                          shape="circle"
                          className="me-2"
                        />
                        <Skeleton.Input
                          style={{ width: 100 }}
                          active
                          size="small"
                        />
                      </div>
                      <Skeleton.Button active size="small" style={{ width: 80 }} />
                    </div>
                  </div>
                </div>
              ))
              : allparentData.length > 0
                ? allparentData.map((parent: any) => (
                  <div className="col-xl-4 col-md-6 d-flex" key={parent.id}>
                    <div className="card flex-fill">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <Link
                          to="#"
                          className="link-primary"
                          onClick={() => setShow(true)}
                        >
                          {parent.id}
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
                                <Link
                                  className="dropdown-item rounded-1"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_parent"
                                >
                                  <i className="ti ti-edit-circle me-2" />
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item rounded-1"
                                  onClick={() => setDleteIds(parent.id, parent.user_id)}
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
                            <Link
                              to="#"
                              onClick={() => fetchSpecficParentData(parent.id)}
                              className="avatar avatar-lg flex-shrink-0"
                            >
                              <img
                                src={`${Imageurl}/${parent.img_src}`}
                                className="img-fluid rounded-circle"
                                alt="img"
                              />
                            </Link>
                            <div className="ms-2">
                              <h6 className="text-dark text-truncate mb-0">
                                <p style={{ cursor: 'pointer' }} onClick={() => fetchSpecficParentData(parent.id)}>
                                  {parent.name}
                                </p>
                              </h6>
                              <p>Added on {formatDate(parent.Parent_Add)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gx-2">
                          <div>
                            <p className="mb-0">Email</p>
                            <p className="text-dark">{parent.email}</p>
                          </div>
                          <div>
                            <p className="mb-0">Phone</p>
                            <p className="text-dark">{parent.phone_num}</p>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <Link
                              to={`${routes.studentDetail}/${parent.stu_id}`}
                              className="avatar avatar-md flex-shrink-0 p-0 me-2"
                            >
                              <img
                                src={`${Imageurl}${parent.stu_img}`}
                                alt="img"
                                className="img-fluid rounded-circle"
                              />
                            </Link>
                            <p className="text-dark">{`${parent.firstname} ${parent.lastname}`}</p>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="btn btn-light btn-sm"
                          onClick={() => fetchSpecficParentData(parent.id)}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
                : <>No data found</>}


            {/* /Parent Grid */}
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
                      onClick={(e)=>handleCancelDelete(e)}
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button onClick={(e)=>handleDelete(parentId , userId ,e)} className="btn btn-danger" data-bs-dismiss="modal">
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
      {/* /Page Wrapper */}
      <ParentModal />

      {
        loading2 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (speParentData && (<><Modal show={show} onHide={handleClose} centered size="lg">
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
                  <Link to={`${routes.studentDetail}/${speParentData.stu_id}`} className="avatar">
                    <img
                      src={`${Imageurl}/${speParentData.stu_img}`}
                      className="img-fluid rounded-circle"
                      alt="img"
                    />
                  </Link>
                  <div className="ms-2">
                    <p className="mb-0">
                      <Link to={`${routes.studentDetail}/${speParentData.stu_id}`}>{`${speParentData.firstname} ${speParentData.lastname}`}</Link>
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
                    <h6 className="fw-normal">{formatDateHuman(speParentData.admissiondate)}</h6>
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
        </Modal></>))
      }
    </>
  );
};

export default ParentGrid;
