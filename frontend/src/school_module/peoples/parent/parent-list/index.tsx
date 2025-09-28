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
import { allParents, Imageurl, speParent } from "../../../../service/api";
import { toast } from "react-toastify";

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

  interface ParentData {
    id: number;
    name: string;
    email: string;
    phone_num: string;
    img_src: string;
    Parent_Add: string;   // ISO date string
    stu_img: string;
    stu_id: number;
    section: string;
    class: string;
    Student_Add: string;  // ISO date string
    firstname: string;
    lastname: string;
  }

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
    name: parent.name,
    child: `${parent.firstname} ${parent.lastname}`,
    class: `${parent.class},${parent.section}`,
    phone: parent.phone_num,
    email: parent.email,
    stu_id: parent.stu_id,
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


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" onClick={() => setShow(true)} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
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
      render: () => (
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
                    onClick={() => setShow(true)}
                  >
                    <i className="ti ti-menu me-2" />
                    View Parent
                  </Link>
                </li>
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

              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_parent"
                  className="btn btn-primary"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Parent
                </Link>
              </div>
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
