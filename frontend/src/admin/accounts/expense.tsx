
import { Link } from "react-router-dom";
// import { expense_data } from "../../core/data/json/expense_data";
import Table from "../../core/common/dataTable/index";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import {
  category2,
  expenseName,
  invoiceNumber,
  paymentMethod,
} from "../../core/common/selectoption/selectoption";
import type { TableData } from "../../core/data/interface";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import React, { useEffect, useState } from "react";
import { addExpense, allExpense, delExpense, editExpense, expCatForOpt, genExpenseInv, speExpense } from "../../service/accounts";
import { DatePicker } from "antd";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import { handleModalPopUp } from "../../handlePopUpmodal";
import { Spinner } from "../../spinner";

export interface Expense {
  id: number;
  expenseName: string;
  date: string;
  amount: number;
  invoiceNo: number;
  paymentMethod: string;
  description: string;
  category: string;
}


interface ExpenseFormData {
  name: string;
  mobile: string;
  email: string;
  expenseName: string;
  category: number | null;
  date: string | null;
  amount: number | null;
  invoiceNo: number | null;
  paymentMethod: number | null;
  description: string;
  status: string;
}

// Interface for errors
interface ExpenseFormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  expenseName?: string;
  category?: string;
  date?: string;
  amount?: string;
  invoiceNo?: string;
  paymentMethod?: string;
  description?: string;
}

const initaldata = {
  name: "",
  mobile: "",
  email: "",
  expenseName: "",
  category: null,
  date: null,
  amount: null,
  invoiceNo: null,
  paymentMethod: null,
  description: "",
  status: '1'
}

const Expense = () => {
  // const data = expense_data;
  const routes = all_routes;

  const [expcatopt, setexpopt] = useState<{ value: number, label: string }[]>([]);
  const [allexpdata, setAllexpdata] = useState<Expense[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<ExpenseFormData>(initaldata);
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [editId, setEditId] = useState<number | null>(null)

  const fetchExpCatForOpt = async () => {
    try {
      const { data } = await expCatForOpt();
      if (data.success) {
        setexpopt(data.data.map((s: any) => ({ value: s.id, label: s.category })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllExpData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await allExpense()
      if (data.success) {
        setAllexpdata(data.data)
      }

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpCatForOpt();
    fetchAllExpData()
  }, []);


  const validate = (): boolean => {
    const newErrors: ExpenseFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required!";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters!";
    }

    const mobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required!";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number!";
    }

 
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address!";
    }

  
    if (!formData.expenseName.trim()) {
      newErrors.expenseName = "Expense Name is required!";
    }


    if (!formData.category) {
      newErrors.category = "Category is required!";
    }

   
    if (!formData.date) {
      newErrors.date = "Date is required!";
    }

   
    if (formData.amount === null || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0!";
    }

    if (formData.invoiceNo === null || formData.invoiceNo <= 0) {
      newErrors.invoiceNo = "Invoice No must be greater than 0!";
    }

 
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required!";
    }

 
    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
    setErrors((prev)=>({...prev , [name]:undefined}))
  };


  const handleSelectChange = (name: keyof ExpenseFormData, value: number | string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
     setErrors((prev)=>({...prev , [name]:undefined}))
  };


  const handleDateChange = (field: keyof ExpenseFormData, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
     setErrors((prev)=>({...prev , [field]:undefined}))
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      "status": (checked ? "1" : "0")
    }));
  };

  const fetchById = async (id: number) => {

    try {

      const { data } = await speExpense(id)
      if (data.success) {
        const res = data.data
        setFormData({
          name: res.name,
          mobile: res.mobile,
          email: res.email,
          expenseName: res.exp_name,
          category: res.category_id,
          date: dayjs(res.date).format('DD MMM YYYY'),
          amount: res.amount,
          invoiceNo: res.invoice_no,
          paymentMethod: res.payment_method,
          description: res.description,
          status: res.status
        })
        setEditId(id)
      }

    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("First fix errors !")
      return
    }
    try {

      const apiCall = editId ? editExpense(formData, editId) : addExpense(formData)
      const { data } = await apiCall;
      if (data.success) {
        toast.success(data.message)
        setFormData(initaldata)
        fetchAllExpData()
        handleModalPopUp(editId ? 'edit_expenses' : 'add_expenses')
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.respons.data.message)
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setFormData(initaldata)
    setEditId(null)
    setErrors({})
  }

  // delete class room-----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    try {

      const { data } = await delExpense(id)
      if (data.success) {
        toast.success(data.message)
        fetchAllExpData()
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

  const generateInv = async (id: number) => {
    try {
      const { data } = await genExpenseInv(id);

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expense-invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      console.log("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };




  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: any) => (
        <Link to="#" className="link-primary">
          EXP{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Expense Name",
      dataIndex: "expenseName",
      sorter: (a: TableData, b: TableData) => a.expenseName.length - b.expenseName.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: TableData, b: TableData) => a.description.length - b.description.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: TableData, b: TableData) => a.category.length - b.category.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => a.amount - b.amount,
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      sorter: (a: TableData, b: TableData) => a.invoiceNo.length - b.invoiceNo.length,
      render: (text: any) => (
        <Link to="#" className="link-primary">
          INV-{text}
        </Link>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      sorter: (a: TableData, b: TableData) => a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: "Generate Invoice",
      dataIndex: "inv",
      render: (_: any, record: any) => (
        <>
          <button onClick={() => generateInv(record.id)} className="btn btn-sm btn-outline-success ">Gen-Invoice</button>
        </>
      ),
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
                    onClick={(() => fetchById(record.id))}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_expenses"
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
              <h3 className="page-title mb-1">Expense</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Expense
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
                  data-bs-target="#add_expenses"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Expense
                </Link>
              </div>
            </div>
          </div>
          {/* Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Expense List</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Expense Name</label>
                              <CommonSelect
                                className="select"
                                options={expenseName}
                                defaultValue={expenseName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Category</label>
                              <CommonSelect
                                className="select"
                                options={category2}
                                defaultValue={category2[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Invoice Number
                              </label>
                              <CommonSelect
                                className="select"
                                options={invoiceNumber}
                                defaultValue={invoiceNumber[0]}
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
              {/* Expenses List */}
              {
                loading ? <Spinner /> : (<Table dataSource={allexpdata} columns={columns} Selection={true} />)
              }
              {/* /Expenses List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Expenses */}
      <div className="modal fade" id="add_expenses">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Expense</h4>
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
                    <div className="row">
                           <div className="mb-3 col col-sm-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                     <div className="mb-3 col col-sm-6">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="phone"
                        name="mobile"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                      {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                    </div>
                    </div>
                     <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    {/* Expense Name */}
                    <div className="mb-3">
                      <label className="form-label">Expense Name</label>
                      <input
                        type="text"
                        name="expenseName"
                        className={`form-control ${errors.expenseName ? "is-invalid" : ""}`}
                        value={formData.expenseName}
                        onChange={handleChange}
                      />
                      {errors.expenseName && <div className="invalid-feedback">{errors.expenseName}</div>}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <CommonSelect
                        className={`select ${errors.category ? "is-invalid" : ""}`}
                        options={expcatopt}
                        value={formData.category}
                        onChange={(opt) => handleSelectChange("category", opt?.value || "")}
                      />
                      {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                    </div>

                    {/* Date */}
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <div className="input-icon position-relative">
                        <DatePicker
                          className={`form-control datetimepicker`}
                          format="DD MMM YYYY"
                          value={
                            formData.date
                              ? dayjs(formData.date, "DD MMM YYYY")
                              : null
                          }
                          placeholder="Select Date"
                          onChange={(dateString) =>
                            handleDateChange(
                              "date",
                              Array.isArray(dateString)
                                ? dateString[0]
                                : dateString
                            )
                          }
                        />

                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                        value={formData.amount ?? ""}
                        onChange={handleChange}
                      />
                      {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>

                    {/* Invoice No */}
                    <div className="mb-3">
                      <label className="form-label">Invoice No</label>
                      <input
                        type="number"
                        name="invoiceNo"
                        className={`form-control ${errors.invoiceNo ? "is-invalid" : ""}`}
                        value={formData.invoiceNo ?? ""}
                        onChange={handleChange}
                      />
                      {errors.invoiceNo && <div className="invalid-feedback">{errors.invoiceNo}</div>}
                    </div>

                    {/* Payment Method */}
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <CommonSelect
                        className={`select ${errors.paymentMethod ? "is-invalid" : ""}`}
                        options={paymentMethod}
                        value={formData.paymentMethod}
                        onChange={(opt) => handleSelectChange("paymentMethod", opt?.value || "")}
                      />
                      {errors.paymentMethod && <div className="invalid-feedback d-block">{errors.paymentMethod}</div>}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        className="form-control"
                        value={formData.description}
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
                          role="switch"
                          id="switch-sm2"
                          name="status"
                          checked={formData.status === "1"}
                          onChange={handleStatusChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button"
                  onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Expenses */}
      {/* Edit Expenses */}
      <div className="modal fade" id="edit_expenses">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Expense</h4>
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
                    <div className="row">
                           <div className="mb-3 col col-sm-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                     <div className="mb-3 col col-sm-6">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="phone"
                        name="mobile"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                      {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                    </div>
                    </div>
                     <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    {/* Expense Name */}
                    <div className="mb-3">
                      <label className="form-label">Expense Name</label>
                      <input
                        type="text"
                        name="expenseName"
                        className={`form-control ${errors.expenseName ? "is-invalid" : ""}`}
                        value={formData.expenseName}
                        onChange={handleChange}
                      />
                      {errors.expenseName && <div className="invalid-feedback">{errors.expenseName}</div>}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <CommonSelect
                        className={`select ${errors.category ? "is-invalid" : ""}`}
                        options={expcatopt}
                        value={formData.category}
                        onChange={(opt) => handleSelectChange("category", opt?.value || "")}
                      />
                      {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                    </div>

                    {/* Date */}
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <div className="input-icon position-relative">
                        <DatePicker
                          className={`form-control datetimepicker`}
                          format="DD MMM YYYY"
                          value={
                            formData.date
                              ? dayjs(formData.date, "DD MMM YYYY")
                              : null
                          }
                          placeholder="Select Date"
                          onChange={(dateString) =>
                            handleDateChange(
                              "date",
                              Array.isArray(dateString)
                                ? dateString[0]
                                : dateString
                            )
                          }
                        />

                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                        value={formData.amount ?? ""}
                        onChange={handleChange}
                      />
                      {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>

                    {/* Invoice No */}
                    <div className="mb-3">
                      <label className="form-label">Invoice No</label>
                      <input
                        type="number"
                        name="invoiceNo"
                        className={`form-control ${errors.invoiceNo ? "is-invalid" : ""}`}
                        value={formData.invoiceNo ?? ""}
                        onChange={handleChange}
                      />
                      {errors.invoiceNo && <div className="invalid-feedback">{errors.invoiceNo}</div>}
                    </div>

                    {/* Payment Method */}
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <CommonSelect
                        className={`select ${errors.paymentMethod ? "is-invalid" : ""}`}
                        options={paymentMethod}
                        value={formData.paymentMethod}
                        onChange={(opt) => handleSelectChange("paymentMethod", opt?.value || "")}
                      />
                      {errors.paymentMethod && <div className="invalid-feedback d-block">{errors.paymentMethod}</div>}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        className="form-control"
                        value={formData.description}
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
                          role="switch"
                          id="switch-sm2"
                          name="status"
                          checked={formData.status === "1"}
                          onChange={handleStatusChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button"
                  onClick={(e) => handleCancel(e)} className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Edit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Expenses */}
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
                  You want to delete  marked item, this can't be undone
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

export default Expense;
