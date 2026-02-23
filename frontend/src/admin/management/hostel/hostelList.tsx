import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import { Link } from "react-router-dom";

import CommonSelect from "../../../core/common/commonSelect";
import {
  Hostel,
  hostelType,
  moreFilterHostel,
} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
// import { hostelListData } from "../../../core/data/json/hostelListData";
import { toast } from "react-toastify";
import { addHostel, allHostel, deleteHostel, editHostel, speHostel } from "../../../service/hostel";
import { Spinner } from "../../../spinner";



export interface Hostel {
  id: number;
  hostelName: string;
  hostelType: "Boys" | "Girls";
  intake: string;
  address: string;
  description: string;
}


export interface HostelFormData {
  hostelName: string;
  hostelType: string;
  intake: string;
  address: string;
  description: string;
}

export interface HostelFormErrors {
  hostelName: string;
  hostelType: string;
  intake: string;
  address: string;
  description: string;
}

const initialFormData = {
  hostelName: "",
  hostelType: "",
  intake: "",
  address: "",
  description: "",
}

const HostelList = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = hostelListData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [hostel, setHostel] = useState<Hostel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addModal ,setAddModal] = useState<boolean>(false)
  const [editModal ,setEditModal] = useState<boolean>(false)

  const fetchHostels = async () => {

    setLoading(true)
    new Promise((res) => setTimeout(res, 400))
    try {
      const { data } = await allHostel()
      if (data.success) {
        setHostel(data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchHostels()
  }, [])

  // add hostel

  const [formData, setFormData] = useState<HostelFormData>(initialFormData);

  const [errors, setErrors] = useState<HostelFormErrors>({
    hostelName: "",
    hostelType: "",
    intake: "",
    address: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null)



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, hostelType: value }));
    setErrors((prev) => ({ ...prev, hostelType: "" }));
  };


  const fetchHostelById = async (id: number) => {
    if (!id) return
    try {
      const { data } = await speHostel(id)
      if (data.success) {
        const res = data.data
        setEditModal(true)
        setFormData({
          hostelName: res.hostelName,
          hostelType: res.hostelType,
          intake: res.intake,
          address: res.address,
          description: res.description,
        })
        setEditId(id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: HostelFormErrors = {
      hostelName: "",
      hostelType: "",
      intake: "",
      address: "",
      description: "",
    };

    if (!formData.hostelName.trim())
      newErrors.hostelName = "Hostel name is required";

    if (!formData.hostelType)
      newErrors.hostelType = "Please select hostel type";

    if (!formData.intake.trim())
      newErrors.intake = "Intake is required";
    else if (!/^\d+$/.test(formData.intake))
      newErrors.intake = "Intake must be a number";

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => val === "");
  };


  // edit

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return
    }

    try {

      if (editId) {
        const { data } = await editHostel(formData, editId)
        if (data.success) {
          toast.success(data.message)
          setEditModal(false)
          setEditId(null)
        }

      } else {
        const { data } = await addHostel(formData)
        if (data.success) {
          toast.success(data.message)
         setAddModal(false)

        }
      }

      setFormData(initialFormData)
      fetchHostels()


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData(initialFormData);
    setErrors({
      hostelName: "",
      hostelType: "",
      intake: "",
      address: "",
      description: "",
    })
    setAddModal(false)
    setEditModal(false)


  }

  // delete----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
   const [delModal  ,setDelModal] = useState<boolean>(false)

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const { data } = await deleteHostel(id)
      if (data.success) {
        toast.success(data.message)
        fetchHostels();
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



  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <div className="link-primary">
          {id}
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Hostel Name",
      dataIndex: "hostelName",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.hostelName.length - b.hostelName.length,
    },
    {
      title: "Hostel Type",
      dataIndex: "hostelType",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.hostelType.length - b.hostelType.length,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a: TableData, b: TableData) =>
        a.address.length - b.address.length,
    },
    {
      title: "Intake",
      dataIndex: "intake",
      sorter: (a: TableData, b: TableData) =>
        a.inTake.length - b.inTake.length,
    },
    {
      title: "Description",
      dataIndex: "description",

      sorter: (a: TableData, b: TableData) => a.description.length - b.description.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
                    onClick={() => fetchHostelById(record.id)}
                   
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>{ setDeleteId(record.id)
                      setDelModal(true)
                     }}
                    className="dropdown-item rounded-1"
                  
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
              <h3 className="page-title mb-1">Hostel</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Hostel
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
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Hostel
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Hostel</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  {/* <PredefinedDateRanges /> */}
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
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={Hostel}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Type</label>
                              <CommonSelect
                                className="select"
                                options={hostelType}
                                defaultValue={hostelType[0].value}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterHostel}
                                defaultValue={moreFilterHostel[0].value}
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
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
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
                loading ? (<Spinner />) : (<Table dataSource={hostel} columns={columns} Selection={true} />)
              }
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Hostel */}
      {
        addModal&&(
           <div className="modal fade show d-block" id="add_hostel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Hostel</h4>
              <button
                onClick={(e) => handleCancel(e)}
                type="button"
                className="btn-close custom-btn-close"
               
              >
                <i className="ti ti-x" />
              </button>
            </div>


            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    <div className="mb-3">
                      <label className="form-label">Hostel Name</label>
                      <input
                        type="text"
                        name="hostelName"
                        value={formData.hostelName}
                        onChange={handleChange}
                        className={`form-control ${errors.hostelName ? "is-invalid" : ""
                          }`}
                      />
                      {errors.hostelName && (
                        <small className="text-danger">
                          {errors.hostelName}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hostel Type</label>
                      <CommonSelect
                        className={`select ${errors.hostelType ? "is-invalid" : ""
                          }`}
                        options={hostelType}
                        value={formData.hostelType}
                        onChange={(opt: any) => handleSelectChange(opt.value)}
                      />
                      {errors.hostelType && (
                        <small className="text-danger">
                          {errors.hostelType}
                        </small>
                      )}
                    </div>

                    {/* Intake */}
                    <div className="mb-3">
                      <label className="form-label">Intake</label>
                      <input
                        type="number"
                        name="intake"
                        value={formData.intake}
                        onChange={handleChange}
                        className={`form-control ${errors.intake ? "is-invalid" : ""
                          }`}
                      />
                      {errors.intake && (
                        <small className="text-danger">{errors.intake}</small>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${errors.address ? "is-invalid" : ""
                          }`}
                      />
                      {errors.address && (
                        <small className="text-danger">{errors.address}</small>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-control ${errors.description ? "is-invalid" : ""
                          }`}
                      />
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={(e) => handleCancel(e)}
                  type="button"
                  className="btn btn-light me-2"
                 
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Hostel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
        )
      }
      {/* /Add Hostel */}
      {/* Edit Hostel */}
      {
        editModal&&(<div className="modal fade show d-block" id="edit_hostel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Hostel</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                 onClick={(e) => handleCancel(e)}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    <div className="mb-3">
                      <label className="form-label">Hostel Name</label>
                      <input
                        type="text"
                        name="hostelName"
                        value={formData.hostelName}
                        onChange={handleChange}
                        className={`form-control ${errors.hostelName ? "is-invalid" : ""
                          }`}
                      />
                      {errors.hostelName && (
                        <small className="text-danger">
                          {errors.hostelName}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hostel Type</label>
                      <CommonSelect
                        className={`select ${errors.hostelType ? "is-invalid" : ""
                          }`}
                        options={hostelType}
                        value={formData.hostelType}
                        onChange={(opt: any) => handleSelectChange(opt.value)}
                      />
                      {errors.hostelType && (
                        <small className="text-danger">
                          {errors.hostelType}
                        </small>
                      )}
                    </div>

                    {/* Intake */}
                    <div className="mb-3">
                      <label className="form-label">Intake</label>
                      <input
                        type="number"
                        name="intake"
                        value={formData.intake}
                        onChange={handleChange}
                        className={`form-control ${errors.intake ? "is-invalid" : ""
                          }`}
                      />
                      {errors.intake && (
                        <small className="text-danger">{errors.intake}</small>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${errors.address ? "is-invalid" : ""
                          }`}
                      />
                      {errors.address && (
                        <small className="text-danger">{errors.address}</small>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-control ${errors.description ? "is-invalid" : ""
                          }`}
                      />
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={(e) => handleCancel(e)}
                  type="button"
                  className="btn btn-light me-2"
                 
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Edit Hostel
                </button>
              </div>
            </form>


          </div>
        </div>
      </div>)
      }
      {/* /Edit Hostel */}

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
                  You want to delete this item, this can not be undone
                  once you delete.
                </p>
                {
                  deleteId && (<div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => cancelDelete(e)}
                      className="btn btn-light me-3"
                      type="button"
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
    </>
  );
};

export default HostelList;
