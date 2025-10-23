
import { Link } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
// import { expense_category_data } from "../../core/data/json/expenses_category_data";
import type { TableData } from "../../core/data/interface";
import CommonSelect from "../../core/common/commonSelect";
import { category2 } from "../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../core/common/datePicker";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import React, { useEffect, useState } from "react";
import { addExpCat, allExpCat, delExpCat, editExpCat, speExpCat } from "../../service/accounts";
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../handlePopUpmodal";
import { Spinner } from "../../spinner";

interface ExpenseCategory {
  id: number;
  category: string;
  description: string;
}


interface ExpenseCategoryForm {
  category: string;
  description: string;
}

interface FormErrors {
  category?: string;
  description?: string;
}



const ExpensesCategory = () => {
  // const data = expense_category_data;
  const routes = all_routes;

  const [allCate, setAllCate] = useState<ExpenseCategory[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<ExpenseCategoryForm>({
    category: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null)
  const [errors, setErrors] = useState<FormErrors>({});



  const fetchExpCat = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await allExpCat()
      if (data.success) {
        setAllCate(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpCat()

  }, [])




  // add category
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    } else if (formData.category.length < 3) {
      newErrors.category = "Category must be at least 3 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const fetchByid = async (id: number) => {
    if (!id) return

    try {
      const { data } = await speExpCat(id)
      if (data.success) {
        const res = data.data
        setFormData({
          category: res.category,
          description: res.description,
        })
        setEditId(id)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const apiCall = editId ? editExpCat(formData, editId) : addExpCat(formData)
      const { data } = await apiCall
      if (data.success) {
        toast.success(data.message)
        setFormData({ category: "", description: "" });
        fetchExpCat()
        setEditId(null)
        handleModalPopUp(editId ? 'edit_expenses_category' : 'add_expenses_category')
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.respons.data.message)
    }
  };


  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData({ category: "", description: "" });
    setErrors({})


  }

  // delete class room-----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(id)
    e.preventDefault()
    try {

      const { data } = await delExpCat(id)
      if (data.success) {
        toast.success(data.message)
        fetchExpCat()
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <Link to="#" className="link-primary">
          EXP-{id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: TableData, b: TableData) =>
        a.category.length - b.category.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: TableData, b: TableData) =>
        a.description.length - b.description.length,
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
                    onClick={(() => fetchByid(record.id))}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_expenses_category"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setDeleteId(record.id)}
                    className="dropdown-item rounded-1"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
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
    <div>
      {" "}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Expense Category</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Expense Category
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
                  data-bs-target="#add_expenses_category"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Category
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Expense Category List</h4>
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
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Category</label>
                              <CommonSelect
                                className="select"
                                options={category2}
                                defaultValue={category2[0]}
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
              {/* Expenses Category List */}
              {
                loading ? <Spinner /> : (<Table dataSource={allCate} columns={columns} Selection={true} />)
              }
              {/* /Expenses Category List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Expenses Category */}
      <div className="modal fade" id="add_expenses_category">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button
                type="button"
                onClick={(e) => handleCancel(e)}
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
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className={`form-control ${errors.category ? "is-invalid" : ""}`}
                        value={formData.category}
                        onChange={handleChange}
                      />
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Expenses Category */}
      {/* Edit Expenses Category */}
      <div className="modal fade" id="edit_expenses_category">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Category</h4>
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
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className={`form-control ${errors.category ? "is-invalid" : ""}`}
                        value={formData.category}
                        onChange={handleChange}
                      />
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
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
      {/* /Edit Expenses Category */}
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
                  You want to delete  marked item, this cant be undone
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

export default ExpensesCategory;
