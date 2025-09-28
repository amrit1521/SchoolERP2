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
import { allGuardians, Imageurl, speGuardian } from "../../../../service/api";
import { Skeleton } from "antd";

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

  interface GuaData {
    id: number;
    img_src: string;
    name: string;
    Gua_Add: string;
    email: string;
    phone_num: string;
    stu_img: string;
    stu_id: string;
    firstname: string;
    lastname: string;
  }


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

  // Interface define kijiye
  interface SpeGuardianData {
    id: number;
    name: string;
    email: string;
    phone_num: string;
    img_src: string;
    Guardian_Add: string;   // ✅ Parent_Add → Guardian_Add
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
  const [speGuardianData, setSpeGuardianData] = useState<SpeGuardianData | null>(null);
  const [loading2, setLoading2] = useState<boolean>(false);

  const fetchSpecficGuardianData = async (guardianId: number) => {
    setShow(true);
    setLoading2(true);
    // await new Promise((res)=>setTimeout(res,500))
    try {
      const { data } = await speGuardian(guardianId); // ✅ API call bhi guardian
      // console.log(data)
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

              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_guardian"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Guardian
                </Link>
              </div>
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
                                <Link
                                  className="dropdown-item rounded-1"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_guardian"
                                >
                                  <i className="ti ti-edit-circle me-2" />
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item rounded-1"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete-modal"
                                >
                                  <i className="ti ti-trash-x me-2" />
                                  Delete
                                </Link>
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
                              to={`${routes.studentDetail}/${gua.stu_id}`}
                              className="avatar avatar-md flex-shrink-0 p-0 me-2"
                            >
                              <img
                                src={`${Imageurl}/${gua.stu_img}`}
                                alt="img"
                                className="img-fluid rounded-circle"
                              />
                            </Link>
                            <p className="text-dark">{`${gua.firstname} ${gua.lastname}`}</p>
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
      <GuardianModal />

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
                  <div className="guardian-wrap"> {/* ✅ parent-wrap → guardian-wrap */}
                    <div className="row align-items-center">
                      <div className="col-lg-6">
                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-xl me-2">
                            <img
                              src={`${Imageurl}/${speGuardianData.img_src}`}
                              alt="img"
                            />
                          </span>
                          <div className="guardian-name"> {/* ✅ parent-name → guardian-name */}
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
                            <Link to={`${routes.studentDetail}/${speGuardianData.stu_id}`}>{`${speGuardianData.firstname} ${speGuardianData.lastname}`}</Link>
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
                          to={`${routes.studentDetail}/${speGuardianData.stu_id}`}
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


    </>
  );
};

export default GuardianGrid;
