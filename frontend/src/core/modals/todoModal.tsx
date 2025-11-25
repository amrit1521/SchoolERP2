import { useEffect, useState } from "react";
import { Eye, Star, Trash2 } from "react-feather/dist";
import { Link } from "react-router-dom";
import Select from "react-select";
import ImageWithBasePath from "../common/imageWithBasePath";
import { Editor } from 'primereact/editor';
import { DatePicker } from "antd";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { addTodo, speTodo } from "../../service/todo";
import { handleModalPopUp } from "../../handlePopUpmodal";
import { appStatus, assigneeOptions, optionsPriority, Tagsoptions } from "../common/selectoption/selectoption";
import DOMPurify from "dompurify";

type props = {
  viewTodoId?: number | null
}

const TodoModal: React.FC<props> = ({ viewTodoId }) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const optionsChoose = [
    { value: "Choose", label: "Choose" },
    { value: "Recent1", label: "Recent1" },
    { value: "Recent2", label: "Recent2" },
  ];

  const optionsSelect = [
    { value: "Select", label: "Select" },
    { value: "Recent1", label: "Recent1" },
    { value: "Recent2", label: "Recent2" },
  ];

  const optionsOnHold = [{ value: "Onhold", label: "Onhold" }];

  ;

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
    else if (formData.description.length > 60) {
      errors.description = "Description must be under 60 characters";
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
    console.log("Final Form Data: ", payload);

    try {

      const { data } = await addTodo(payload)
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
        setText1("");
        handleModalPopUp('note-units')
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
                          <Select
                            className="select"
                            classNamePrefix="react-select"
                            options={assigneeOptions}
                            placeholder="Choose"
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
                          <Select
                            className="select"
                            classNamePrefix="react-select"
                            options={Tagsoptions}
                            placeholder="Select"
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
                          <Select
                            className="select"
                            classNamePrefix="react-select"
                            options={optionsPriority}
                            placeholder="Select"
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

                          <Select
                            className="select"
                            classNamePrefix="react-select"
                            options={appStatus}
                            placeholder="Select"
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
                            value={text1}
                            onTextChange={(e) => {
                              setText1(e.htmlValue ?? "");
                              handleChange("description", e.htmlValue ?? "");
                            }}
                            style={{ height: "130px" }}
                          />

                          {errors.description && (
                            <p className="text-danger" style={{ fontSize: "11px" }}>
                              {errors.description}
                            </p>
                          )}

                          <p>Maximum 60 Characters</p>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btn">
                      <button
                        type="button"
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
                    <h4>Todo Title</h4>
                  </div>
                  <div className=" edit-note-head d-flex align-items-center">
                    <Link to="#" className="me-2">
                      <span>
                        <Trash2 />
                      </span>
                    </Link>
                    <Link to="#" className="me-2">
                      <span>
                        <Star />
                      </span>
                    </Link>
                    <Link to="#" className="me-2">
                      <span>
                        <Eye />
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="btn-close custom-btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  </div>
                </div>
                <div className="modal-body custom-modal-body">
                  <form action="todo">
                    <div className="row">
                      <div className="col-12">
                        <div className="input-blocks">
                          <label className="form-label">Note Title</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Meet Lisa to discuss project details"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="input-blocks">
                          <label className="form-label">Assignee</label>
                          <Select
                            className="select" classNamePrefix="react-select"
                            options={optionsSelect}
                            placeholder="Select"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-blocks">
                          <label className="form-label">Tag</label>
                          <Select
                            className="select" classNamePrefix="react-select"
                            options={optionsOnHold}
                            placeholder="Onhold"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-blocks">
                          <label className="form-label">Priority</label>

                          <Select
                            className="select" classNamePrefix="react-select"
                            options={optionsPriority}
                            placeholder="Priority"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-blocks todo-calendar">
                          <label className="form-label">Due Date</label>
                          <div className="input-groupicon calender-input">
                            <input
                              type="text"
                              className="form-control date-range bookingrange"
                              placeholder="Select"
                              defaultValue="13 Aug 1992"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-blocks">
                          <label className="form-label">Status</label>
                          <Select
                            className="select" classNamePrefix="react-select"
                            options={optionsChoose}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks summer-description-box notes-summernote">
                          <label className="form-label">Descriptions</label>
                          {/* <div id="summernote2" /> */}
                          <Editor
                            value={text2}
                            onTextChange={(e) => setText2(e.htmlValue ?? '')}
                            style={{ height: '130px' }}
                          />
                          <p>Maximum 60 Characters</p>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
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
      <div className="modal fade" id="delete-note-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="delete-popup">
                  <div className="delete-image text-center mx-auto">
                    <ImageWithBasePath
                      src="./assets/img/icons/close-circle.png"
                      alt="Img"
                      className="img-fluid"
                    />
                  </div>
                  <div className="delete-heads">
                    <h4>Are You Sure?</h4>
                    <p>
                      Do you really want to delete this item, This process
                      cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer-btn delete-footer">
                    <Link
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to="#" className="btn btn-submit">
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Note */}
      {/* View Note */}
      <div className="modal fade" id="view-note-units">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg rounded-3 border-0">

            {/* Modal Header */}
            <div className="modal-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-semibold mb-0">{viewTodo.title}</h4>
                <div className="text-primary">{viewTodo.tag}</div>
              </div>

              <div className="d-flex align-items-center gap-3">

                {/* Delete */}
                <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                  <i className="ti ti-trash text-danger fs-5"></i>
                </button>

                {/* Important */}
                <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                  <i className="ti ti-star fs-5 text-warning"></i>
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
