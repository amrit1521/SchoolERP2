
import { Link } from "react-router-dom";
import DefaultEditor from "react-simple-wysiwyg";
import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { addNote, deleteNote, speNote, updateNote } from "../../service/note";
import { toast } from "react-toastify";
import dayjs from 'dayjs'
import CommonSelect from "../../core/common/commonSelect";
import { handleModalPopUp } from "../../handlePopUpmodal";
import DOMPurify from "dompurify";



type props = {
  editId?: number | null
  viewNoteId?: number | null
  deleteId?: number | null
}

const NotesModal: React.FC<props> = ({ editId, viewNoteId, deleteId }) => {
  const Tagsoptions = [
    { value: "Important", label: "Important" },
    { value: "Academic", label: "Academic" },
    { value: "OfficeWork", label: "OfficeWork" },
    { value: "HomeWork", label: "HomeWork" },
  ];

  const status = [
    { value: "Pending", label: "Pending" },
    { value: "Onhold", label: "Onhold" },
    { value: "InProgress", label: "Inprogress" },
    { value: "Done", label: "Done" },
  ];

  const optionsPriority = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const assigneeOptions = [
    { value: "", label: "Select" },
    { value: "all_teachers", label: "All Teachers" },
    { value: "all_staff", label: "All Staff" }
  ];


  // add note
  interface INoteForm {
    title: string;
    assignee_group: string;
    tag: string;
    priority: string;
    due_date: string;
    status: string;
    description: string;
    created_by: number | null
  }
  const [userId, setuserId] = useState<number | null>(null)
  const [formData, setFormData] = useState<INoteForm>({
    title: "",
    assignee_group: "",
    tag: "",
    priority: "",
    due_date: "",
    status: "",
    description: "",
    created_by: userId
  });

  const [errors, setErrors] = useState<any>({});
  const [viewNote, setViewNote] = useState<any>({})
  useEffect(() => {

    const token = localStorage.getItem('token')
    if (token) {
      setuserId(JSON.parse(token).id ?? null)
    }

  }, [])



  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let tempErrors: any = {};

    if (!formData.title.trim()) {
      tempErrors.title = "Title is required !";
    } else if (formData.title.length < 5) {
      tempErrors.title = "Title should be at least 5 chracters !";
    }
    if (!formData.assignee_group) tempErrors.assignee_group = "Assignee is required !";
    if (!formData.tag) tempErrors.tag = "Tag is rquired !";
    if (!formData.priority) tempErrors.priority = "Priority is required !";
    if (!formData.status) tempErrors.status = "Status is requred !";
    if (!formData.due_date) tempErrors.due_date = "Due date is required !";
    if (!formData.description.trim())
      tempErrors.description = "Description is required !";
    else if (formData.description.length < 20)
      tempErrors.description = "Description should be at least 20 chracters !";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        ...formData,
        created_by: userId,
      };


      const apiCall = editId ? updateNote(payload, editId) : addNote(payload)

      const { data } = await apiCall;
      if (data?.success) {
        toast.success(data.message);
        setFormData({
          title: "",
          assignee_group: "",
          tag: "",
          priority: "",
          due_date: "",
          status: "",
          description: "",
          created_by: userId,
        });

        handleModalPopUp(editId ? 'edit-note-units' : 'note-units')
        editId = null
      }
    } catch (error: any) {
      console.error("Error creating note:", error);
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong while creating the note."
      );
    }
  };



  const fetchSpeNote = async (id: number) => {

    if (!id) return
    try {

      const { data } = await speNote(id)
      if (data.success) {
        const res = data.data
        setFormData({
          title: res.title,
          assignee_group: res.assignee_group,
          tag: res.tag,
          priority: res.priority,
          due_date: dayjs(res.due_date).format('DD MMM YYYY'),
          status: res.status,
          description: res.description,
          created_by: userId,
        })
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (editId) {
      fetchSpeNote(editId)
    }
  }, [editId])


  const fetchSpeViewNote = async (id: number) => {
    if (!id) return
    try {
      const { data } = await speNote(id)
      if (data.success) {
        setViewNote(data.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (viewNoteId) {
      fetchSpeViewNote(viewNoteId)
    }
  }, [viewNoteId])

  const permanentDeleteNote = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!deleteId) {
      toast.warn("Note Id is required !")
      return
    }

    try {

      const { data } = await deleteNote(deleteId)
      if (data.success) {
        toast.success(data.message)
        deleteId = null
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      {/* Add Note */}
      <div className="modal fade" id="note-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Add Notes</h4>
              <button
                type="button"
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

                  {/* Title */}
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Todo Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                      {errors.title && <p style={{ fontSize: '11px' }} className="text-danger">{errors.title}</p>}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Assignee</label>
                      <CommonSelect
                        className="select"
                        options={assigneeOptions}
                        value={formData.assignee_group}

                        onChange={(e: any) => handleChange("assignee_group", e.value)}
                      />
                      {errors.assignee_group && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.assignee_group}</p>
                      )}
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Tag</label>
                      <CommonSelect
                        options={Tagsoptions}
                        className="select"
                        value={formData.tag}
                        onChange={(e: any) => handleChange("tag", e.value)}
                      />
                      {errors.tag && <p style={{ fontSize: '11px' }} className="text-danger">{errors.tag}</p>}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <CommonSelect
                        options={optionsPriority}
                        value={formData.priority}
                        className="select"
                        onChange={(e: any) => handleChange("priority", e.value)}
                      />
                      {errors.priority && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.priority}</p>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Due Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={formData.due_date ? dayjs(formData.due_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleChange("due_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {errors.due_date && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.due_date}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        options={status}
                        className="select"
                        value={formData.status}
                        onChange={(e: any) => handleChange("status", e.value)}
                      />
                      {errors.status && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.status}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <DefaultEditor
                        value={formData.description}

                        onChange={(e) => handleChange("description", e.target.value)}
                      />
                      {errors.description && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.description}</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>

      {/* /Add Note */}
      {/* Edit Note */}
      <div className="modal fade" id="edit-note-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Notes</h4>
              <button
                type="button"
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

                  {/* Title */}
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Todo Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                      {errors.title && <p style={{ fontSize: '11px' }} className="text-danger">{errors.title}</p>}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Assignee</label>
                      <CommonSelect
                        className="select"
                        options={assigneeOptions}
                        value={formData.assignee_group}

                        onChange={(e: any) => handleChange("assignee_group", e.value)}
                      />
                      {errors.assignee_group && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.assignee_group}</p>
                      )}
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Tag</label>
                      <CommonSelect
                        options={Tagsoptions}
                        className="select"
                        value={formData.tag}
                        onChange={(e: any) => handleChange("tag", e.value)}
                      />
                      {errors.tag && <p style={{ fontSize: '11px' }} className="text-danger">{errors.tag}</p>}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <CommonSelect
                        options={optionsPriority}
                        value={formData.priority}
                        className="select"
                        onChange={(e: any) => handleChange("priority", e.value)}
                      />
                      {errors.priority && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.priority}</p>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Due Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="DD MMM YYYY"
                        value={formData.due_date ? dayjs(formData.due_date, "DD MMM YYYY") : null}
                        placeholder="Select Date"
                        onChange={(date) => handleChange("due_date", date ? dayjs(date).format("DD MMM YYYY") : "")}
                      />
                      {errors.due_date && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.due_date}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <CommonSelect
                        options={status}
                        className="select"
                        value={formData.status}
                        onChange={(e: any) => handleChange("status", e.value)}
                      />
                      {errors.status && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.status}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <DefaultEditor
                        value={formData.description}

                        onChange={(e) => handleChange("description", e.target.value)}
                      />
                      {errors.description && (
                        <p style={{ fontSize: '11px' }} className="text-danger">{errors.description}</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      {/* /Edit Note */}
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
                  You want to permanent delete this items, this can not be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button onClick={(e) => permanentDeleteNote(e)} type="submit" className="btn btn-danger">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
      {/* View Note */}
      <div className="modal fade" id="view-note-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header">
                  <div className="d-flex align-items-center">
                    <h4 className="modal-title me-3">Notes</h4>
                    <p className="text-info">{viewNote.tag}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-close custom-btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="ti ti-x" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div>
                        <h4 className="mb-2">
                          {viewNote.title}
                        </h4>
                        <p
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(viewNote.description) }}
                        >

                        </p>
                        <p className="badge bg-outline-danger d-inline-flex align-items-center mb-0">
                          <i className="fas fa-circle fs-6 me-1" /> {viewNote.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /View Note */}
    </>
  );
};

export default NotesModal;
