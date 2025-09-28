import { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import {
  allClass,
  names,
  parent,
  status,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import { Modal } from "react-bootstrap";
import GuardianModal from "../guardianModal";
import type { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
// import { guardianListData } from "../../../../core/data/json/guardianList";
import TooltipOption from "../../../../core/common/tooltipOption";
import { allGuardians, Imageurl, speGuardian } from "../../../../service/api";
import { toast } from "react-toastify";

const GuardianList = () => {
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
  // const data = guardianListData;

  interface GuaData {
    id: number;
    name: string;
    email: string;
    phone_num: string;
    img_src: string;
    Gua_Add: string;   // ISO date string
    stu_img: string;
    stu_id: number;
    section: string;
    class: string;
    Student_Add: string;  // ISO date string
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


  const tableData = allGuaData.map((guardian) => ({
    key: guardian.id,
    id: guardian.id,
    name: guardian.name,
    child: `${guardian.firstname} ${guardian.lastname}`,
    class: `${guardian.class}, ${guardian.section}`,
    phone: guardian.phone_num,
    email: guardian.email,
    stu_id: guardian.stu_id,
    stu_img: guardian.stu_img,
    img: guardian.img_src
  }));





  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" onClick={() => setShow(true)} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Guardian Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="avatar avatar-md"
            onClick={() => fetchSpecficGuardianData(record.id)}
          >
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#" onClick={() =>  fetchSpecficGuardianData(record.id)}>
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
          <Link to={`${routes.studentDetail}/${record.stu_id}`} className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.stu_img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={`${routes.studentDetail}/${record.stu_id}`}>{text}</Link>
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
      dataIndex: "action",
      render: (text:string,record:any) => (
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
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    onClick={() =>  fetchSpecficGuardianData(record.id)}
                  >
                    <i className="ti ti-menu me-2" />
                    View Guardian{text?"":""}
                  </Link>
                </li>
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
        </>
      ),
    },
  ];
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
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Guardian List</h4>
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
                              <label className="form-label">Guardian</label>
                              <CommonSelect
                                className="select"
                                options={parent}
                                // defaultValue={parent[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Child</label>
                              <CommonSelect
                                className="select"
                                options={names}
                                // defaultValue={names[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                // defaultValue={allClass[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                                // defaultValue={status[0]}
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
                    className="active btn btn-icon btn-sm me-1 primary-hover"
                  >
                    <i className="ti ti-list-tree" />
                  </Link>
                  <Link
                    to={routes.guardiansGrid}
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
                ) :
                  (<Table dataSource={tableData} columns={columns} Selection={true} />)
              }

              {/* /Student List */}
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
                              style={{objectFit:'cover'}}
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
                          <ImageWithBasePath
                            src={speGuardianData.stu_img}
                            className="rounded-circle object-fit-cover"
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

export default GuardianList;
