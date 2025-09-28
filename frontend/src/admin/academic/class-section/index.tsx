import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Core imports
import Table from "../../../core/common/dataTable";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import TooltipOption from "../../../core/common/tooltipOption";

// Data & API
import { all_routes } from "../../router/all_routes";
import { activeList } from "../../../core/common/selectoption/selectoption";
import { getAllSection, addClassSection, deleteSection, speSection, editSection } from "../../../service/api";
import { handleModalPopUp } from "../../../handlePopUpmodal";

// ✅ Interfaces
interface AllSection {
  id: number;
  section: string;
  status: string;
}

interface TableData {
  key: number;
  id: number;
  sectionName: string;
  status: string;
}

interface SectionData {
  section: string;
  status: string;
}

const ClassSection: React.FC = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // 🔹 State
  const [allSections, setAllSections] = useState<AllSection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionData, setSectionData] = useState<SectionData>({
    section: "",
    status: "0",
  });
  const [editId, setEditId] = useState<number | null>(null)

  // 🔹 Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSectionData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };


  const fetchSectionbyId = async (id: number) => {

    try {
      const { data } = await speSection(id)

      if (data.success) {
        setEditId(id)
        setSectionData({
          section: data.data.section,
          status: data.data.status
        })
      }

    } catch (error) {
      console.log(error)
    }

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionData.section.length > 1) {
      toast.error('It is not valid section name !')
      return
    }
    try {

      if (editId) {

        const {data} = await editSection(sectionData , editId);
        if(data.success){
            toast.success(data.message)
            handleModalPopUp('edit_section')
            setEditId(null)
        }

      } else {
        const { data } = await addClassSection(sectionData);
        if (data.success) {
          toast.success(data.message)
          handleModalPopUp('add_class_section')
        }
      }

      setSectionData({ section: "", status: "0" });
      fetchSection();

    } catch (error) {
      console.error(error);
      toast.error("Failed to add section");
    }
  };



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
  // 🔹 Table Data
  const tableData: TableData[] = allSections.map((item) => ({
    key: item.id,
    id: item.id,
    sectionName: item.section,
    status: item.status === "1" ? "Active" : "Inactive",
  }));





  // delete section----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(id)
    try {

      const { data } = await deleteSection(id)
      if (data.success) {
        toast.success(data.message)
        fetchSection();
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

  // 🔹 Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id - b.id,
      render: (id: number) => <Link to="#" className="link-primary">{id}</Link>,
    },
    {
      title: "Section Name",
      dataIndex: "sectionName",
      render: (text: string) => (
        <span className="text-uppercase">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.sectionName.localeCompare(b.sectionName),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: TableData, b: TableData) => a.status.localeCompare(b.status),
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
                data-bs-toggle="modal"
                data-bs-target="#edit_section"
              >
                <i className="ti ti-edit-circle me-2" /> Edit
              </button>
            </li>
            <li>
              <button
                className="dropdown-item rounded-1"
                onClick={() => setDeleteId(id)}
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
              >
                <i className="ti ti-trash-x me-2" /> Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ];

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
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_class_section"
              >
                <i className="ti ti-square-rounded-plus-filled me-2" />
                Add Section
              </Link>
            </div>
          </div>
        </div>

        {/* 🔹 Table Card */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Class Section</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>

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
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Table columns={columns} dataSource={tableData} Selection />
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Add Section Modal */}
      <div className="modal fade" id="add_class_section">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title">Add Section</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="section"
                    value={sectionData.section}
                    onChange={handleChange}
                  />
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
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* edit section modal */}
      <div className="modal fade" id="edit_section">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title">Edit Section</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="section"
                    value={sectionData.section}
                    onChange={handleChange}
                  />
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
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" >
                  Edit Section
                </button>
              </div>
            </form>
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

  );
};

export default ClassSection;
