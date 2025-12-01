import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Editor } from 'primereact/editor';
import { DatePicker } from "antd";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { addTodo, permDelete, restoreTodo, softDeleteTodo, speTodo, updateTodo } from "../../service/todo";
import { handleModalPopUp } from "../../handlePopUpmodal";
import { appStatus, assigneeOptions, optionsPriority, Tagsoptions } from "../common/selectoption/selectoption";
import DOMPurify from "dompurify";
import CommonSelect from "../common/commonSelect";

type props = {
  onAction: () => void
  viewTodoId?: number | null
  setDeleteId: React.Dispatch<React.SetStateAction<number | null>>
  deleteId?: number | null
  setSoftDeleteId: React.Dispatch<React.SetStateAction<number | null>>
  softDeleteId?: number | null
  setRestoreId: React.Dispatch<React.SetStateAction<number | null>>
  restoreId?: number | null
  setEditId: React.Dispatch<React.SetStateAction<number | null>>
  editId?: number | null
}

const TodoModal: React.FC<props> = ({ onAction, viewTodoId, setDeleteId, deleteId, setSoftDeleteId, softDeleteId, setRestoreId, restoreId, setEditId, editId }) => {
  // const [text1, setText1] = useState('');


  interface TodoForm {
    title: string;
    assignee: string;
    tag: string;
    priority: string;
    due_date: string;
    status: string;
    description: string;
    created_by: number | null
  }

  // ---------- FORM STATE ----------
  const [userId, setUserId] = useState<number | null>(null)
  const [formData, setFormData] = useState<TodoForm>({
    title: "",
    assignee: "",
    tag: "",
    priority: "",
    due_date: "",
    status: "",
    description: "",
    created_by: userId
  });
  const [errors, setErrors] = useState<any>({})
  const [viewTodo, setViewTodo] = useState<any>({})


  // --------- HANDLE INPUT ----------
  const handleChange = (field: keyof TodoForm, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setErrors((prev: any) => ({ ...prev, [field]: undefined }))
  };

  const validateTodo = (formData: any) => {
    let errors: any = {};

    if (!formData.title?.trim()) errors.title = "Title is required";
    else if (formData.title.length < 5) errors.title = "Title must be at least 5 chracters !";
    if (!formData.assignee) errors.assignee = "Assignee is required";
    if (!formData.tag) errors.tag = "Tag is required";
    if (!formData.priority) errors.priority = "Priority is required";
    if (!formData.due_date) errors.due_date = "Due date is required";
    if (!formData.status) errors.status = "Status is required";

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }
    else if (formData.description.length > 150) {
      errors.description = "Description must be under 150 characters";
    }

    return errors;
  };


  // ---------- HANDLE SUBMIT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTodo(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      ...formData,
      created_by: userId
    }
    try {

      const apiCall = editId ? updateTodo(payload, editId) : addTodo(payload)

      const { data } = await apiCall
      if (data.success) {
        toast.success(data.message)
        setFormData({
          title: "",
          assignee: "",
          tag: "",
          priority: "",
          due_date: "",
          status: "",
          description: "",
          created_by: userId
        });
        setEditId(null);
        onAction()
        setErrors({})
        handleModalPopUp(editId ? 'edit-note-units' : 'note-units')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }


  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUserId(JSON.parse(token).id ?? null)
    }

  }, [])

  // view todo

  const fetchSpeTodo = async () => {
    if (!viewTodoId) return
    try {
      const { data } = await speTodo(viewTodoId)
      if (data.success) {
        setViewTodo(data.data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.mesaage)
    }
  }

  useEffect(() => {
    fetchSpeTodo()
  }, [viewTodoId])

  // edit todo

  const setSpeTodoForEdit = async () => {
    if (!editId) return
    try {
      const { data } = await speTodo(editId)
      if (data.success) {
        const res = data.data
        setFormData({
          title: res.title,
          assignee: res.assignee,
          tag: res.tag,
          priority: res.priority,
          due_date: dayjs(res.due_date).format('DD MMM YYYY'),
          status: res.status,
          description: res.description,
          created_by: userId
        });

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }

  }

  useEffect(() => {
    setSpeTodoForEdit()
  }, [editId])


  // delete todo
  const softDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!softDeleteId) return
    try {

      const { data } = await softDeleteTodo(softDeleteId)
      if (data.success) {
        toast.success(data.mesaage)
        setSoftDeleteId(null)
        onAction()
        handleModalPopUp('trash-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const deleteTodo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!deleteId) return
    try {

      const { data } = await permDelete(deleteId)
      if (data.success) {
        toast.success(data.mesaage)
        setDeleteId(null)
        onAction()
        handleModalPopUp('delete-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const restoreTrashTodo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!restoreId) return
    try {

      const { data } = await restoreTodo(restoreId)
      if (data.success) {
        toast.success(data.mesaage)
        setRestoreId(null)
        onAction()
        handleModalPopUp('restore-modal')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  // handle cancel
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({
      title: "",
      assignee: "",
      tag: "",
      priority: "",
      due_date: "",
      status: "",
      description: "",
      created_by: userId
    });
    setEditId(null)
    setErrors({})

  }

  return (
    <div>
      {/* Add Note */}
      <div className="modal fade" id="note-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Todo</h4>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCancel(e)}
                    className="btn-close custom-btn-close"
                    data-bs-dismiss="modal"
                  >
                    <i className="ti ti-x"></i>
                  </button>
                </div>

                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
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

                          {errors.title && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.title}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Assignee */}
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Assignee</label>
                          <CommonSelect
                            className="select"
                            options={assigneeOptions}
                            value={formData.assignee}
                            onChange={(e: any) => handleChange("assignee", e.value)}
                          />

                          {errors.assignee && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.assignee}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tag */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Tag</label>
                          <CommonSelect
                            className="select"

                            options={Tagsoptions}
                            value={formData.tag}
                            onChange={(e: any) => handleChange("tag", e.value)}
                          />

                          {errors.tag && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.tag}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Priority</label>
                          <CommonSelect
                            className="select"
                            options={optionsPriority}
                            value={formData.priority}
                            onChange={(e: any) => handleChange("priority", e.value)}
                          />

                          {errors.priority && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.priority}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="col-6">
                        <div className="input-blocks todo-calendar">
                          <label className="form-label">Due Date</label>

                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              formData.due_date
                                ? dayjs(formData.due_date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(date) =>
                              handleChange(
                                "due_date",
                                date ? dayjs(date).format("DD MMM YYYY") : ""
                              )
                            }
                          />

                          {errors.due_date && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.due_date}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Status</label>

                          <CommonSelect
                            className="select"

                            options={appStatus}
                            value={formData.status}
                            onChange={(e: any) => handleChange("status", e.value)}
                          />

                          {errors.status && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.status}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-lg-12">
                        <div className="mb-3 summer-description-box notes-summernote">
                          <label className="form-label">Descriptions</label>

                          <Editor
                            value={formData.description}
                            onTextChange={(e) => {
                              // setText1(e.htmlValue ?? "");
                              handleChange("description", e.htmlValue ?? "");
                            }}
                            style={{ height: "130px" }}
                          />

                          {errors.description && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.description}
                            </p>
                          )}

                          <p>Maximum 150 Characters</p>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        onClick={(e) => handleCancel(e)}
                        className="btn btn-sm btn-danger me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-sm btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Note */}

      {/* Edit Note */}
      <div className="modal fade" id="edit-note-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Todo</h4>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCancel(e)}
                    className="btn-close custom-btn-close"
                    data-bs-dismiss="modal"
                  >
                    <i className="ti ti-x"></i>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
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

                          {errors.title && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.title}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Assignee */}
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Assignee</label>
                          <CommonSelect
                            className="select"

                            options={assigneeOptions}
                            value={formData.assignee}
                            onChange={(e: any) => handleChange("assignee", e.value)}
                          />

                          {errors.assignee && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.assignee}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tag */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Tag</label>
                          <CommonSelect
                            className="select"

                            options={Tagsoptions}
                            value={formData.tag}
                            onChange={(e: any) => handleChange("tag", e.value)}
                          />

                          {errors.tag && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.tag}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Priority</label>
                          <CommonSelect
                            className="select"
                            options={optionsPriority}
                            value={formData.priority}
                            onChange={(e: any) => handleChange("priority", e.value)}
                          />

                          {errors.priority && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.priority}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="col-6">
                        <div className="input-blocks todo-calendar">
                          <label className="form-label">Due Date</label>

                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={
                              formData.due_date
                                ? dayjs(formData.due_date, "DD MMM YYYY")
                                : null
                            }
                            placeholder="Select Date"
                            onChange={(date) =>
                              handleChange(
                                "due_date",
                                date ? dayjs(date).format("DD MMM YYYY") : ""
                              )
                            }
                          />

                          {errors.due_date && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.due_date}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Status</label>

                          <CommonSelect
                            className="select"

                            options={appStatus}
                            value={formData.status}
                            onChange={(e: any) => handleChange("status", e.value)}
                          />

                          {errors.status && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.status}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-lg-12">
                        <div className="mb-3 summer-description-box notes-summernote">
                          <label className="form-label">Descriptions</label>

                          <Editor
                            value={formData.description}
                            onTextChange={(e) => {
                              handleChange("description", e.htmlValue ?? "");
                            }}
                            style={{ height: "130px" }}
                          />

                          {errors.description && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.description}
                            </p>
                          )}

                          <p>Maximum 150 Characters</p>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        onClick={(e) => handleCancel(e)}
                        className="btn btn-sm btn-danger me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-sm btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Note */}

      {/* Delete Note */}
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
                  <button onClick={(e) => deleteTodo(e)} type="submit" className="btn btn-danger">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Note */}

      {/*soft Delete Note */}
      <div className="modal fade" id="trash-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Move to Trash</h4>
                <p>
                  You want to move to trash this item.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button onClick={(e) => softDelete(e)} type="submit" className="btn btn-danger">
                    Yes, Trash
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /soft Delete Note */}

      {/* {restore modal} */}
      <div className="modal fade" id="restore-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-restore" />

                </span>
                <h4>Restore Note</h4>
                <p>
                  You want to restore this item.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button onClick={(e) => restoreTrashTodo(e)} type="submit" className="btn btn-success">
                    Yes,Restore
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* {restore modal} */}

      {/* View Note */}
      <div className="modal fade" id="view-note-units">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content shadow-lg rounded-3 border-0">

            {/* Modal Header */}
            <div className="modal-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-semibold mb-0">Todo</h4>
                <div className="text-primary">{viewTodo.tag}</div>
              </div>

              <div className="d-flex align-items-center gap-3">

                {/* Delete */}
                <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                  <i className="ti ti-trash text-danger fs-5"></i>
                </button>

                {/* Important */}
                <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                  <i className="ti ti-star fs-4 text-warning"></i>
                </button>

                {/* Close */}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">

              {/* Main content card */}
              <div className="card border-0 shadow-sm p-3">

                {/* Title & Description */}
                <h5 className="fw-bold text-dark mb-2">{viewTodo.title}</h5>

                <p
                  className="text-muted lh-base mb-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(viewTodo.description),
                  }}
                ></p>

                {/* Priority Badge */}
                <p className="mb-0">
                  <span className={`badge px-2 py-2 rounded-2 ${viewTodo.priority === "High"
                    ? "bg-danger"
                    : viewTodo.priority === "Medium"
                      ? "bg-warning"
                      : "bg-success"
                    }`}>
                    <i className="fas fa-circle me-2"></i>
                    {viewTodo.priority}
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 p-3">
              <button
                type="button"
                className="btn btn-sm btn-secondary px-4"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* /View Note */}
    </div>
  );
};

export default TodoModal;
