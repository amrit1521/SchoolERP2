import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Select from "react-select";

import TodoModal from "../../core/modals/todoModal";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { lastModified } from "../../core/common/selectoption/selectoption";
import { useEffect, useState } from "react";
import { allTodos, toggleImportantTodo } from "../../service/todo";
import Skeleton from "react-loading-skeleton";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";



export interface ITodo {
  id: number;
  title: string;
  assignee: string;
  tag: string;
  priority: string;
  due_date: string;
  status: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}


const Todo = () => {
  const options = [
    { value: "bulk-actions", label: "Bulk Actions" },
    { value: "delete-marked", label: "Delete Marked" },
    { value: "unmark-all", label: "Unmark All" },
    { value: "mark-all", label: "Mark All" },
  ];
  const routes = all_routes;


  const [todos, setTodos] = useState<ITodo[]>([])
  const [impTodos, setImpTodos] = useState<ITodo[]>([])
  const [trashTodos, setTrashTodo] = useState<ITodo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [viewTodoId, setViewTodoId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [softDeleteId, setSoftDeleteId] = useState<number | null>(null)
  const [restoreId, setRestoreId] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [doneTodos, setDoneTodods] = useState<ITodo[]>([])


  const fetchAllTodos = async () => {
    setLoading(true);

    try {
      const { data } = await allTodos();

      if (data.success) {
        const todos = data.data;
        const all: ITodo[] = [];
        const important: ITodo[] = [];
        const trashed: ITodo[] = [];
        const done: ITodo[] = [];

        todos.forEach((n: any) => {
          const isTrashed = n.is_trashed === 1;
          const status = n.status?.toLowerCase();

          if (isTrashed) {
            trashed.push(n);
            return; 
          }

          all.push(n);

          if (n.is_important === 1) important.push(n);
          if (status === "done") done.push(n);
        });

        setTodos(all);
        setImpTodos(important);
        setTrashTodo(trashed);
        setDoneTodods(done);
      }

    } catch (error) {
      console.error("Fetch Todos Error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllTodos()

  }, [])

  const onAction = () => {
    fetchAllTodos()
  }

  const toggleImportant = async (id: number, isImportant: number) => {
    if (!id) return
    const newIsImportant = isImportant === 1 ? 0 : 1
    try {

      const { data } = await toggleImportantTodo({ isImportant: newIsImportant }, id)
      if (data.success) {
        toast.success(data.message)
        onAction()
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }




  return (
    <>
      <div className="page-wrapper notes-page-wrapper">
        <div className="content pb-4">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3 pb-3 border-bottom position-relative">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Todo</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Todo
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
                  data-bs-target="#note-units"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Task
                </Link>
              </div>
            </div>
            <Link
              id="toggle_btn2"
              className="notes-tog position-absolute start-0 avatar avatar-sm rounded-circle bg-primary text-white"
              to="#"
            >
              <i className="fas fa-chevron-left" />
            </Link>
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-12 sidebars-right theiaStickySidebar section-bulk-widget">
              <div className="stickybar">
                <div className="border rounded-3 mt-4 bg-white p-3">
                  <div className="mb-3 pb-3 border-bottom">
                    <h4 className="d-flex align-items-center">
                      <i className="ti ti-file-text me-2" />
                      Todo List
                    </h4>
                  </div>
                  <div className="border-bottom pb-3 ">
                    <div
                      className="nav flex-column nav-pills"
                      id="v-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <button
                        className="d-flex text-start align-items-center fw-semibold fs-15 nav-link active mb-1"
                        id="v-pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#v-pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="v-pills-profile"
                        aria-selected="true"
                      >
                        <i className="ti ti-inbox me-2" />
                        Inbox
                        {/* <span className="ms-2">1</span> */}
                      </button>
                      <button
                        className="d-flex text-start align-items-center fw-semibold fs-15 nav-link mb-1"
                        id="v-pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#v-pills-home"
                        type="button"
                        role="tab"
                        aria-controls="v-pills-home"
                        aria-selected="false"
                      >
                        <i className="ti ti-circle-check me-2" />
                        Done
                      </button>
                      <button
                        className="d-flex text-start align-items-center fw-semibold fs-15 nav-link mb-1"
                        id="v-pills-messages-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#v-pills-messages"
                        type="button"
                        role="tab"
                        aria-controls="v-pills-messages"
                        aria-selected="false"
                      >
                        <i className="ti ti-star me-2" />
                        Important
                      </button>
                      <button
                        className="d-flex text-start align-items-center fw-semibold fs-15 nav-link mb-0"
                        id="v-pills-settings-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#v-pills-settings"
                        type="button"
                        role="tab"
                        aria-controls="v-pills-settings"
                        aria-selected="false"
                      >
                        <i className="ti ti-trash me-2" />
                        Trash
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="border-bottom px-2 pb-3 mb-3">
                      <h5 className="mb-2">Tags</h5>
                      <div className="d-flex flex-column mt-2">
                        <Link to="#" className="text-info mb-2">
                          <span className="text-info me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Pending
                        </Link>
                        <Link to="#" className="text-danger mb-2">
                          <span className="text-danger me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Onhold
                        </Link>
                        <Link to="#" className="text-warning mb-2">
                          <span className="text-warning me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Inprogress
                        </Link>
                        <Link to="#" className="text-success">
                          <span className="text-success me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Done
                        </Link>
                      </div>
                    </div>
                    <div className="px-2">
                      <h5 className="mb-2">Priority</h5>
                      <div className="d-flex flex-column mt-2">
                        <Link to="#" className="text-warning mb-2">
                          <span className="text-warning me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Medium
                        </Link>
                        <Link to="#" className="text-success mb-2">
                          <span className="text-success me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          High
                        </Link>
                        <Link to="#" className="text-danger">
                          <span className="text-danger me-2">
                            <i className="fas fa-square square-rotate fs-10" />
                          </span>
                          Low
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 budget-role-notes">
              <div className="bg-white rounded-3 d-flex align-items-center justify-content-between flex-wrap my-4 p-3 pb-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <Select
                      options={options}
                      className="select"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <Link to="#" className="btn btn-light">
                    Apply
                  </Link>
                </div>
                <div className="form-sort mb-3">
                  <i className="ti ti-filter feather-filter info-img ms-1" />
                  <Select
                    className="select"
                    classNamePrefix="react-select"
                    options={lastModified}
                    placeholder="Sort by Date"
                  />
                </div>
              </div>

              <div className="tab-content" id="v-pills-tabContent">

                <div
                  className="tab-pane fade active show"
                  id="v-pills-profile"
                  role="tabpanel"
                  aria-labelledby="v-pills-profile-tab"
                >
                  <div className="row">

                    <div className="col-lg-12">

                      {loading ? (
                        <>
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="card mb-3 p-1">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  {/* <Skeleton circle width={40} height={40} className="me-3" /> */}
                                  <div>
                                    <Skeleton width={180} height={18} />
                                    <Skeleton width={120} height={14} className="mt-1" />
                                  </div>
                                </div>

                                <Skeleton width={30} height={30} />
                              </div>

                              <div className="mt-3">
                                <Skeleton height={20} width={100} className="me-2" />
                                <Skeleton height={20} width={60} />
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="accordion todo-accordion" id="accordionExample">
                          {todos && todos.length > 0 ? (
                            <div className="accordion-item">
                              <div className="accordion-header" id="headingOne">
                                <div
                                  className="accordion-button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseOne"
                                  aria-controls="collapseOne"
                                >
                                  <div className="d-flex align-items-center justify-content-between w-100 mb-3">
                                    <div className="d-flex align-items-center">
                                      <span>
                                        <i className="ti ti-calendar-due me-2" />
                                      </span>
                                      <h5 className="fw-semibold">Todo's</h5>
                                    </div>
                                    <div>
                                      <Link to="#">
                                        <span>
                                          <i className="fas fa-chevron-down" />
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div
                                id="collapseOne"
                                className="accordion-collapse collapse show"
                                aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample"
                              >
                                <div className="accordion-body">
                                  {todos.map((todo: any) => (
                                    <div className="card mb-3" key={todo.id}>
                                      <div className="card-body p-3 pb-0">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">

                                          {/* LEFT SECTION */}
                                          <div className="input-block todo-inbox-check d-flex align-items-center w-50 mb-3">
                                            {/* <div className="form-check form-check-md me-2">
                                              <input className="form-check-input" type="checkbox" />
                                            </div> */}

                                            <div className="strike-info">
                                              <h4 className="mb-1 text-capitalize">{todo.title}</h4>
                                              <p
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todo.description) }}
                                              ></p>
                                            </div>
                                          </div>

                                          {/* RIGHT SECTION */}
                                          <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                            <div className="notes-card-body d-flex align-items-center">
                                              <p className={`badge 

                                   
                                     ${todo.priority === "High"
                                                  ? "bg-outline-danger"
                                                  : todo.priority === "Medium"
                                                    ? " bg-outline-warning"
                                                    : " bg-outline-success"
                                                }
                                      d-inline-flex align-items-center me-2 mb-0`}>
                                                <i className="fas fa-circle fs-6 me-1" /> {todo.priority}
                                              </p>
                                              <p className="badge bg-outline-secondary mb-0">{todo.status}</p>
                                            </div>

                                            <div className="d-flex align-items-center">
                                              {
                                                todo.is_important === 1 && (<span>
                                                  <i className="ti ti-star me-2" />
                                                </span>)
                                              }
                                              <span className="avatar avatar-md me-2">
                                                <ImageWithBasePath
                                                  src="assets/img/users/user-24.jpg"
                                                  alt="Img"
                                                  className="img-fluid rounded-circle"
                                                />
                                              </span>

                                              <Link to="#" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fas fa-ellipsis-v" />
                                              </Link>

                                              <div className="dropdown-menu notes-menu dropdown-menu-end">
                                                <Link
                                                  to="#"
                                                  onClick={() => setEditId(todo.id)}
                                                  className="dropdown-item"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#edit-note-units"
                                                >
                                                  <span>
                                                    <i data-feather="edit" />
                                                  </span>
                                                  Edit
                                                </Link>

                                                <Link
                                                  to="#"
                                                  onClick={() => setSoftDeleteId(todo.id)}
                                                  className="dropdown-item"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#trash-modal"
                                                >
                                                  <span>
                                                    <i data-feather="trash-2" />
                                                  </span>
                                                  Delete
                                                </Link>

                                                <Link
                                                  to="#"
                                                  onClick={() => toggleImportant(todo.id, todo.is_important)}
                                                  className="dropdown-item">
                                                  <span>
                                                    <i data-feather="star" />
                                                  </span>
                                                  {todo.is_important ? 'Not Important' : 'Important'}
                                                </Link>

                                                <Link
                                                  to="#"
                                                  onClick={() => setViewTodoId(todo.id)}
                                                  className="dropdown-item"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#view-note-units"
                                                >
                                                  <span>
                                                    <i data-feather="eye" />
                                                  </span>
                                                  View
                                                </Link>
                                              </div>
                                            </div>
                                          </div>

                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                              </div>
                            </div>
                          ) : (
                            <>No Todos Found</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade "
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                >
                  <div className="d-block">

                    {
                      loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <div className="card mb-3" key={index}>
                            <div className="card-body p-3 pb-0">

                              <div className="d-flex align-items-center justify-content-between flex-wrap">

                                {/* LEFT SIDE */}
                                <div className="input-block d-flex align-items-center w-50 mb-3">
                                  {/* <div className="me-2">
                                    <Skeleton circle width={20} height={20} />
                                  </div> */}
                                  <div className="strike-info w-100">
                                    <Skeleton height={20} width="70%" className="mb-2" />
                                    <Skeleton height={14} width="50%" />
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="d-flex align-items-center">
                                    <Skeleton height={25} width={80} className="me-2" />
                                    <Skeleton height={25} width={80} />
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <Skeleton width={20} height={20} className="me-3" />
                                    <Skeleton circle width={40} height={40} className="me-3" />
                                    <Skeleton width={20} height={20} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        doneTodos && doneTodos.length > 0 ? (
                          doneTodos.map((todo: any) => (<div className="card">
                            <div className="card-body p-3 pb-0">
                              <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="input-block todo-inbox-check d-flex align-items-center w-50 mb-3">
                                  {/* <div className="form-check form-check-md me-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                </div> */}
                                  <div className="strike-info">
                                    <h4 className="mb-1 text-capitalize">{todo.title}</h4>
                                    <p
                                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todo.description) }}
                                    ></p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="notes-card-body d-flex align-items-center">
                                    <p className={`badge 
                                     ${todo.priority === "High"
                                        ? "bg-outline-danger"
                                        : todo.priority === "Medium"
                                          ? " bg-outline-warning"
                                          : " bg-outline-success"
                                      }
                                      d-inline-flex align-items-center me-2 mb-0`}>
                                      <i className="fas fa-circle fs-6 me-1" />
                                      {todo.priority}
                                    </p>
                                    <p className="badge bg-outline-info mb-0">
                                      {todo.status}
                                    </p>
                                  </div>
                                  <div className="d-flex align-items-center">
                                     {
                                      todo.is_important===1&&(<span>
                                      <i className="ti ti-star me-2" />
                                    </span>)
                                     }
                                    <span className="avatar avatar-md me-2">
                                      <ImageWithBasePath
                                        src="assets/img/profiles/avatar-05.jpg"
                                        alt="Img"
                                        className="img-fluid rounded-circle"
                                      />
                                    </span>
                                    <Link
                                      to="#"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fas fa-ellipsis-v" />
                                    </Link>
                                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                                      <Link
                                        to="#"
                                        onClick={() => setEditId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit-note-units"
                                      >
                                        <span>
                                          <i data-feather="edit" />
                                        </span>
                                        Edit
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setSoftDeleteId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#trash-modal"
                                      >
                                        <span>
                                          <i data-feather="trash-2" />
                                        </span>
                                        Delete
                                      </Link>
                                      <Link to="#" onClick={() => toggleImportant(todo.id, todo.is_important)} className="dropdown-item">
                                        <span>
                                          <i data-feather="star" />
                                        </span>
                                        {todo.is_important ? 'Not Important' : 'Important'}
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setViewTodoId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#view-note-units"
                                      >
                                        <span>
                                          <i data-feather="eye" />
                                        </span>
                                        View
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>))
                        ) : (<div>Not any important todo !</div>)

                      )
                    }


                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="v-pills-messages"
                  role="tabpanel"
                  aria-labelledby="v-pills-messages-tab"
                >
                  <div className="d-block">

                    {
                      loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <div className="card mb-3" key={index}>
                            <div className="card-body p-3 pb-0">

                              <div className="d-flex align-items-center justify-content-between flex-wrap">

                                {/* LEFT SIDE */}
                                <div className="input-block d-flex align-items-center w-50 mb-3">
                                  {/* <div className="me-2">
                                    <Skeleton circle width={20} height={20} />
                                  </div> */}
                                  <div className="strike-info w-100">
                                    <Skeleton height={20} width="70%" className="mb-2" />
                                    <Skeleton height={14} width="50%" />
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="d-flex align-items-center">
                                    <Skeleton height={25} width={80} className="me-2" />
                                    <Skeleton height={25} width={80} />
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <Skeleton width={20} height={20} className="me-3" />
                                    <Skeleton circle width={40} height={40} className="me-3" />
                                    <Skeleton width={20} height={20} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        impTodos && impTodos.length > 0 ? (
                          impTodos.map((todo: any) => (<div className="card">
                            <div className="card-body p-3 pb-0">
                              <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="input-block todo-inbox-check d-flex align-items-center w-50 mb-3">
                                  {/* <div className="form-check form-check-md me-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                </div> */}
                                  <div className="strike-info">
                                    <h4 className="mb-1 text-capitalize">{todo.title}</h4>
                                    <p
                                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todo.description) }}
                                    ></p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="notes-card-body d-flex align-items-center">
                                    <p className={`badge 
                                     ${todo.priority === "High"
                                        ? "bg-outline-danger"
                                        : todo.priority === "Medium"
                                          ? " bg-outline-warning"
                                          : " bg-outline-success"
                                      }
                                      d-inline-flex align-items-center me-2 mb-0`}>
                                      <i className="fas fa-circle fs-6 me-1" />
                                      {todo.priority}
                                    </p>
                                    <p className="badge bg-outline-info mb-0">
                                      {todo.status}
                                    </p>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <span>
                                      <i className="ti ti-star me-2" />
                                    </span>
                                    <span className="avatar avatar-md me-2">
                                      <ImageWithBasePath
                                        src="assets/img/profiles/avatar-05.jpg"
                                        alt="Img"
                                        className="img-fluid rounded-circle"
                                      />
                                    </span>
                                    <Link
                                      to="#"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fas fa-ellipsis-v" />
                                    </Link>
                                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                                      <Link
                                        to="#"
                                        onClick={() => setEditId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit-note-units"
                                      >
                                        <span>
                                          <i data-feather="edit" />
                                        </span>
                                        Edit
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setSoftDeleteId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#trash-modal"
                                      >
                                        <span>
                                          <i data-feather="trash-2" />
                                        </span>
                                        Delete
                                      </Link>
                                      <Link to="#" onClick={() => toggleImportant(todo.id, todo.is_important)} className="dropdown-item">
                                        <span>
                                          <i data-feather="star" />
                                        </span>
                                        {todo.is_important ? 'Not Important' : 'Important'}
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setViewTodoId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#view-note-units"
                                      >
                                        <span>
                                          <i data-feather="eye" />
                                        </span>
                                        View
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>))
                        ) : (<div>Not any important todo !</div>)

                      )
                    }

                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="v-pills-settings"
                  role="tabpanel"
                  aria-labelledby="v-pills-settings-tab"
                >
                  <div className="d-block">

                    {
                      loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <div className="card mb-3" key={index}>
                            <div className="card-body p-3 pb-0">

                              <div className="d-flex align-items-center justify-content-between flex-wrap">

                                {/* LEFT SIDE */}
                                <div className="input-block d-flex align-items-center w-50 mb-3">
                                  {/* <div className="me-2">
                                    <Skeleton circle width={20} height={20} />
                                  </div> */}
                                  <div className="strike-info w-100">
                                    <Skeleton height={20} width="70%" className="mb-2" />
                                    <Skeleton height={14} width="50%" />
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="d-flex align-items-center">
                                    <Skeleton height={25} width={80} className="me-2" />
                                    <Skeleton height={25} width={80} />
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <Skeleton width={20} height={20} className="me-3" />
                                    <Skeleton circle width={40} height={40} className="me-3" />
                                    <Skeleton width={20} height={20} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        trashTodos && trashTodos.length > 0 ? (
                          trashTodos.map((todo: any) => (<div className="card">
                            <div className="card-body p-3 pb-0">
                              <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="input-block todo-inbox-check d-flex align-items-center w-50 mb-3">
                                  {/* <div className="form-check form-check-md me-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />
                                </div> */}
                                  <div className="strike-info">
                                    <h4 className="mb-1 text-capitalize">{todo.title}</h4>
                                    <p
                                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(todo.description) }}
                                    ></p>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center flex-fill justify-content-between ms-4 mb-3">
                                  <div className="notes-card-body d-flex align-items-center">
                                    <p className={`badge 
                                     ${todo.priority === "High"
                                        ? "bg-outline-danger"
                                        : todo.priority === "Medium"
                                          ? " bg-outline-warning"
                                          : " bg-outline-success"
                                      }
                                      d-inline-flex align-items-center me-2 mb-0`}>
                                      <i className="fas fa-circle fs-6 me-1" />
                                      {todo.priority}
                                    </p>
                                    <p className="badge bg-outline-info mb-0">
                                      {todo.status}
                                    </p>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    {
                                      todo.is_important === 1 && (<span>
                                        <i className="ti ti-star me-2" />
                                      </span>)
                                    }
                                    <span className="avatar avatar-md me-2">
                                      <ImageWithBasePath
                                        src="assets/img/profiles/avatar-05.jpg"
                                        alt="Img"
                                        className="img-fluid rounded-circle"
                                      />
                                    </span>
                                    <Link
                                      to="#"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fas fa-ellipsis-v" />
                                    </Link>
                                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                                      <Link
                                        to="#"
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#restore-modal"
                                        onClick={() => setRestoreId(todo.id)}

                                      >
                                        <span>
                                          <i data-feather="edit" />
                                        </span>
                                        Restore
                                      </Link>
                                      <Link
                                        to="#"
                                        onClick={() => setDeleteId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#delete-modal"
                                      >
                                        <span>
                                          <i data-feather="trash-2" />
                                        </span>
                                        Permanent Delete
                                      </Link>

                                      <Link
                                        to="#"
                                        onClick={() => setViewTodoId(todo.id)}
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#view-note-units"
                                      >
                                        <span>
                                          <i data-feather="eye" />
                                        </span>
                                        View
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>))
                        ) : (<div>Not any important todo !</div>)

                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TodoModal onAction={onAction} viewTodoId={viewTodoId} setDeleteId={setDeleteId} deleteId={deleteId} softDeleteId={softDeleteId} setSoftDeleteId={setSoftDeleteId} setRestoreId={setRestoreId} restoreId={restoreId} setEditId={setEditId} editId={editId} />
    </>
  );
};

export default Todo;
