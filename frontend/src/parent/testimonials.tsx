
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../core/common/datePicker";
import CommonSelect from "../core/common/commonSelect";
import { page, parent } from "../core/common/selectoption/selectoption";
// import { testimonials_data } from "../../core/data/json/testimonials_data";
import Table from "../core/common/dataTable/index";
// import ImageWithBasePath from "../../core/common/imageWithBasePath";
// import { DatePicker } from "antd";
import type { TableData } from "../core/data/interface";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../core/common/tooltipOption";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../handlePopUpmodal";
import { addTestiMonials, allTestimonials, deleteTestimonials, editTestimonials} from "../service/testimonials";
import { Imageurl } from "../service/api";
import dayjs from 'dayjs'
import { Spinner } from "../spinner";
export interface Testimonial {
  id: number;
  content: string;
  created_at: string;
  role_name: string;
  name: string;
  user_img: string | null;
}

const PTestimonials = () => {
  // const data = testimonials_data;
  const routes = all_routes;
  const [testiMonials, setTestiMonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [userId, setUserId] = useState<number | null>(null)
  const [roleId, setRoleId] = useState<number | null>(null)
  const [error, setError] = useState<string>("")
  const [editId, setEditId] = useState<number | null>(null)



  const fetchTestiMonials = async () => {
    setLoading(true)
    try {

      const { data } = await allTestimonials()

      if (data.success) {
        setTestiMonials(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      setUserId(token ? JSON.parse(token)?.id : null)
      setRoleId(token ? JSON.parse(token)?.role : null)
    }
    fetchTestiMonials()
  }, [])


  // const fetchByID = async (id: number) => {
  //   if (!id) return
  //   try {

  //     const { data } = await speTestimonials(id)
  //     if (data.success) {
  //       setContent(data.data.content)
  //       setEditId(data.data.id)
  //     }

  //   } catch (error: any) {
  //     console.log(error)
  //     toast.error(error.response.data.message)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) {
      setError("Content is required !")
      return
    } else if (content.length < 10) {
      setError("Content must be at least 10 characters !")
      return
    }
    const payload = {
      userId,
      content
    }

    try {

      const { data } = await addTestiMonials(payload)

      if (data.success) {
        toast.success(data.message)
        setContent("")
        setError("")
        fetchTestiMonials()
        handleModalPopUp('add_testimonials')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) {
      setError("Content is required !")
      return
    } else if (content.length < 10) {
      setError("Content must be at least 10 characters !")
      return
    }
    if (!editId) return

    const payload = {
      userId,
      content,
      role: roleId
    }

    try {

      const { data } = await editTestimonials(payload, editId)

      if (data.success) {
        toast.success(data.message)
        setContent("")
        setError("")
        setEditId(null)
        fetchTestiMonials()
        handleModalPopUp('edit_testimonials')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleCancelTestimonials = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setContent("")
    setError("")
    setEditId(null)
  }


  // delete class--------------------------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delLoading, setDelLoading] = useState<boolean>(false)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setDelLoading(true)
    if (!userId || !roleId || !id) {
      return
    }
    try {
      const { data } = await deleteTestimonials(id, userId, roleId)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchTestiMonials()
        handleModalPopUp('delete-modal')

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.error)
    } finally {
      setDelLoading(false)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }

  const tableData = testiMonials.map((t) => (
    {
      key: t.id,
      id: t.id,
      img: t.user_img,
      author: t.name,
      role: t.role_name,
      content: t.content,
      dateAdded: t.created_at

    }
  ))

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id - b.id,
      render: (text: any) => (
        <Link to="#" className="link-primary">
          TES{text}
        </Link>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      sorter: (a: TableData, b: TableData) => a.author.length - b.author.length,
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <img
              src={`${Imageurl}/${record.img}`}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link className="text-capitalize" to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.role.length - b.role.length,
    },
    {
      title: "Content",
      dataIndex: "content",
      sorter: (a: TableData, b: TableData) =>
        a.content.length - b.content.length,
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.dateAdded.length - b.dateAdded.length,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: (_: string, record: any) => (
    //     <div className="d-flex align-items-center">
    //       <div className="dropdown">
    //         <Link
    //           to="#"
    //           className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
    //           data-bs-toggle="dropdown"
    //           aria-expanded="false"
    //         >
    //           <i className="ti ti-dots-vertical fs-14" />
    //         </Link>
    //         <ul className="dropdown-menu dropdown-menu-right p-3">
    //           <li>
    //             <button
    //               className="dropdown-item rounded-1"
    //               onClick={() => fetchByID(record.id)}
    //               data-bs-toggle="modal"
    //               data-bs-target="#edit_testimonials"
    //             >
    //               <i className="ti ti-edit-circle me-2" />
    //               Edit
    //             </button>
    //           </li>
    //           <li>
    //             <button
    //               className="dropdown-item rounded-1"
    //               onClick={() => setDeleteId(record.id)}
    //               data-bs-toggle="modal"
    //               data-bs-target="#delete-modal"
    //             >
    //               <i className="ti ti-trash-x me-2" />
    //               Delete
    //             </button>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Testimonials</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Content</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Testimonials
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
                  data-bs-target="#add_testimonials"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Testimonials
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Testimonials List</h4>
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
                  <div className="dropdown-menu drop-width">
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Author</label>
                              <CommonSelect
                                className="select"
                                options={parent}
                                defaultValue={parent[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Role</label>
                              <CommonSelect
                                className="select"
                                options={page}
                                defaultValue={page[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
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
              {/* Testimonials List */}
              {
                loading ? (<Spinner />) : (<Table dataSource={tableData} columns={columns} Selection={false} />)
              }
              {/* /Testimonials List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Testimonials */}
      <div className="modal fade" id="add_testimonials">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Testimonial</h4>
              <button
                type="button"
                onClick={(e) => handleCancelTestimonials(e)}
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
                    {/* <div className="mb-3">
                      <label className="form-label">Author</label>
                      <CommonSelect
                        className="select"
                        options={parent}
                        defaultValue={parent[0]}
                      />
                    </div> */}
                    {/* <div className="mb-3">
                      <label className="form-label">Role</label>
                      <CommonSelect
                        className="select"
                        options={page}
                        defaultValue={page[0]}
                      />
                    </div> */}
                    {/* <div className="mb-3">
                      <label className="form-label">Date Added</label>
                      <div className="date-pic">
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="Select Date"
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                    </div> */}
                    <div className="mb-0">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        defaultValue={""}
                      />
                      {
                        error && (<div className="text-danger" style={{ fontSize: '11px' }}>{error}</div>)
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancelTestimonials(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Testimoial
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Add Testimonials */}
      {/* Edit Testimonials */}
      <div className="modal fade" id="edit_testimonials">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Testimonial</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* <div className="mb-3">
                      <label className="form-label">Author</label>
                      <CommonSelect
                        className="select"
                        options={parent}
                        defaultValue={parent[0]}
                      />
                    </div> */}
                    {/* <div className="mb-3">
                      <label className="form-label">Role</label>
                      <CommonSelect
                        className="select"
                        options={page}
                        defaultValue={page[0]}
                      />
                    </div> */}
                    {/* <div className="mb-3">
                      <label className="form-label">Date Added</label>
                      <div className="date-pic">
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="Select Date"
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                    </div> */}
                    <div className="mb-0">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        defaultValue={""}
                      />
                      {
                        error && (<div className="text-danger" style={{ fontSize: '11px' }}>{error}</div>)
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={(e) => handleCancelTestimonials(e)}
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
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
      {/* Edit Testimonials */}
      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this items, this cant be undone once
                  you delete.
                </p>
                {
                  deleteId && (
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={(e) => cancelDelete(e)}
                        className="btn btn-light me-3"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button className="btn btn-danger" onClick={(e) => handleDelete(deleteId, e)}>
                        {delLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>

                    </div>
                  )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </div>
  );
};

export default PTestimonials;
