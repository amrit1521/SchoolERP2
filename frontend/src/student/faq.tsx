
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../core/common/datePicker";
import CommonSelect from "../core/common/commonSelect";
import {
  category3,
  questions,
  sections,
} from "../core/common/selectoption/selectoption";
// import { faq_data } from "../../core/data/json/faq_data";
import type { TableData } from "../core/data/interface";
import Table from "../core/common/dataTable/index";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../core/common/tooltipOption";
import React, { useEffect, useState } from "react";
import { handleModalPopUp } from "../handlePopUpmodal";
import { addFaq, allFaq, deleteFaq, editFaq,replyFaq } from "../service/faq";
import { toast } from "react-toastify";
import { Spinner } from "../spinner";



interface Faq {
  id: number;
  category: string;
  question: string;
  answers: string;
}

interface FAQFormData {
  category: string;
  question: string;
}

interface FAQFormErrors {
  category?: string;
  question?: string;
  answer?: string;
}

const SFaq = () => {
  // const data = faq_data;
  const routes = all_routes;


  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FAQFormData>({
    category: "",
    question: "",

  });
  const [errors, setErrors] = useState<FAQFormErrors>({});
  const [editId, setEditId] = useState<number | null>(null)
  const [answer, setAnswer] = useState<string>("")
  const [replyId, setReplyId] = useState<number | null>(null)



  const fetchFaqs = async () => {
    setLoading(true)
    try {

      const { data } = await allFaq()
      if (data.success) {
        setFaqs(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): FAQFormErrors => {
    const newErrors: FAQFormErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    } else if (formData.category.length < 3) {
      newErrors.category = "Category must be at least 3 characters long";
    }

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    } else if (formData.question.length < 10) {
      newErrors.question = "Question must be at least 10 characters";
    }


    return newErrors;
  };

  // const fetchEditData = async (id: number) => {

  //   if (!id) {
  //     toast.warn('Id not provided !')
  //     return
  //   }
  //   try {

  //     const { data } = await faqById(Number(id))

  //     if (data.success) {
  //       setFormData({
  //         question: data.data.question,
  //         category: data.data.category,

  //       })
  //       setEditId(data.data.id)
  //     }

  //   } catch (error: any) {
  //     console.log(error)
  //     toast.error(error.response.data.message)
  //   }
  // }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {

      const apiCall = editId ? editFaq(formData, editId) : addFaq(formData)

      const { data } = await apiCall
      if (data.success) {
        toast.success(data.message)
        setFormData({ category: "", question: "" });
        setErrors({});
        setEditId(null)
        fetchFaqs()
        handleModalPopUp(editId ? 'edit_faq' : 'add_faq')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  };

  const handleEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({ category: "", question: "" });
    setErrors({});
    setEditId(null)

  }

  // delete class--------------------------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const { data } = await deleteFaq(id)
      if (data.success) {
        setDeleteId(null)
        toast.success(data.message)
        fetchFaqs()
        handleModalPopUp('delete-modal')

      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
  }

  // answer
  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!answer.trim()) {
      toast.error('Ansered is required !')
      return
    } else if (answer.length < 5) {
      toast.error('Ansered must be at least 5 chracters!')
      return
    }
    if (!replyId) {
      return
    }
    const payload = {
      answer:answer
    }
    try {
      const { data } = await replyFaq(payload, replyId)

      if (data.success) {
        toast.success(data.message)
        setReplyId(null)
        setAnswer("")
        fetchFaqs()
        handleModalPopUp('reply_faq')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleAnsCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setAnswer("")
    setReplyId(null)
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: TableData, b: TableData) => a.id - b.id,
      render: (text: any) => (
        <Link to="#" className="link-primary">
          FAQ{text}
        </Link>
      ),
    },
    {
      title: "Questions",
      dataIndex: "question",
      key: "question",
      sorter: (a: FAQFormData, b: FAQFormData) =>
        a.question.length - b.question.length,
    },
    {
      title: "Answers",
      dataIndex: "answer",
      key: "answer",
      render: (text: string, record: any) => (
        text ? (<span>{text}</span>) : (<button data-bs-toggle="modal"
          data-bs-target="#reply_faq" className="btn btn-sm btn-outline-primary" disabled={true} onClick={() => setReplyId(record.id)}>No Answere</button>)

      ),
      sorter: (a: any, b: any) =>
        a.answer.length - b.answer.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a: FAQFormData, b: FAQFormData) =>
        a.category.length - b.category.length,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (_:string, record: any) => (
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
    //               onClick={() => fetchEditData(record.id)}
    //               data-bs-toggle="modal"
    //               data-bs-target="#edit_faq"
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
              <h3 className="page-title mb-1">FAQ</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Content</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    FAQ
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
                  data-bs-target="#add_faq"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add FAQ
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">FAQ List</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Questions</label>
                              <CommonSelect
                                className="select"
                                options={questions}
                                defaultValue={questions[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={sections}
                                defaultValue={sections[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Category</label>
                              <CommonSelect
                                className="select"
                                options={category3}
                                defaultValue={category3[0]}
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
              {/* Faq List */}
              {
                loading ? (<Spinner />) : (<Table dataSource={faqs} columns={columns} Selection={false} />)
              }
              {/* /Faq List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add FAQ */}
      <div className="modal fade" id="add_faq" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add FAQ</h4>
              <button
                onClick={(e) => handleEditCancel(e)}
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* ✅ FORM */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    {/* Category Field */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className={`form-control ${errors.category ? "is-invalid" : ""
                          }`}
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                      />
                      {errors.category && (
                        <div className="text-danger small mt-1">
                          {errors.category}
                        </div>
                      )}
                    </div>

                    {/* Question Field */}
                    <div className="mb-3">
                      <label className="form-label">Question</label>
                      <textarea
                        name="question"
                        className={`form-control ${errors.question ? "is-invalid" : ""
                          }`}
                        rows={4}
                        value={formData.question}
                        onChange={handleChange}
                        placeholder="Enter your question"
                      />
                      {errors.question && (
                        <div className="text-danger small mt-1">
                          {errors.question}
                        </div>
                      )}
                    </div>

                    {/* Answer Field */}
                    {/* <div className="mb-0">
                      <label className="form-label">Answer</label>
                      <textarea
                        name="answer"
                        className={`form-control ${errors.answer ? "is-invalid" : ""
                          }`}
                        rows={4}
                        value={formData.answer}
                        onChange={handleChange}
                        placeholder="Enter the answer"
                      />
                      {errors.answer && (
                        <div className="text-danger small mt-1">
                          {errors.answer}
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={(e) => handleEditCancel(e)}
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add FAQ */}
      {/* Edit FAQ */}
      <div className="modal fade" id="edit_faq">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit FAQ</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">

                    {/* Category Field */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className={`form-control ${errors.category ? "is-invalid" : ""
                          }`}
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                      />
                      {errors.category && (
                        <div className="text-danger small mt-1">
                          {errors.category}
                        </div>
                      )}
                    </div>

                    {/* Question Field */}
                    <div className="mb-3">
                      <label className="form-label">Question</label>
                      <textarea
                        name="question"
                        className={`form-control ${errors.question ? "is-invalid" : ""
                          }`}
                        rows={4}
                        value={formData.question}
                        onChange={handleChange}
                        placeholder="Enter your question"
                      />
                      {errors.question && (
                        <div className="text-danger small mt-1">
                          {errors.question}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={(e) => handleEditCancel(e)}
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Edit FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit FAQ */}

      {/* ANS FAQ */}
      <div className="modal fade" id="reply_faq" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Ans FAQ</h4>
              <button
                onClick={(e) => handleAnsCancel(e)}
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* ✅ FORM */}
            <form onSubmit={handleSubmitAnswer}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Answer Field */}
                    <div className="mb-0">
                      <label className="form-label">Answer</label>
                      <textarea
                        name="answer"
                        className={`form-control`}
                        rows={4}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the answer"
                      />

                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={(e) => handleAnsCancel(e)}
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Ans FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add FAQ */}
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
                  You want to delete all the marked items, this cant be undone once
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
                        Yes, Delete
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

export default SFaq;
