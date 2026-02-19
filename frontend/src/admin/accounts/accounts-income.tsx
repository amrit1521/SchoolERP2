
import { Link } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
// import { accounts_income_data } from "../../core/data/json/accounts_income_data";
import type { TableData } from "../../core/data/interface";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import {
  incomeName,
  invoiceNumber,
  paymentMethod,
  source,
} from "../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
import { addIncome, allIncome, delIncome, editIncome, genIncomeInv, speIncome } from "../../service/accounts";
import { Spinner } from "../../spinner";

export interface Income {
  id: number;
  incomeName: string;
  date: string;
  amount: number;
  invoiceNo: number;
  paymentMethod: string;
  description: string;
  source: string;
}

interface IncomeFormData {
  name: string;
  mobile: string;
  email: string;
  incomeName: string;
  source: string;
  date: string | null;
  amount: number | null;
  invoiceNo: number | null;
  paymentMethod: string | "";
  description: string;
  status: string;
}

interface IncomeFormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  incomeName?: string;
  source?: string;
  date?: string;
  amount?: string;
  invoiceNo?: string;
  paymentMethod?: string;
  description?: string;
}


const initialData: IncomeFormData = {
  name: "",
  mobile: "",
  email: "",
  incomeName: "",
  source: "",
  date: null,
  amount: null,
  invoiceNo: null,
  paymentMethod: "",
  description: "",
  status: "1"
};

const AccountsIncome = () => {
  const routes = all_routes;
  // const data = accounts_income_data;


  const [allIncomeData, setAllIncomeData] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IncomeFormData>(initialData);
  const [errors, setErrors] = useState<IncomeFormErrors>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [genLoading, setGenLoading] = useState<boolean>(false)
  const [genId, setGenId] = useState<number | null>(null)
  const [addModal, setAddModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)


  const fetchAllIncome = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await allIncome();
      if (data.success) setAllIncomeData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIncome();
  }, []);



  const validate = (): boolean => {
    const newErrors: IncomeFormErrors = {};

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
    if (!formData.incomeName.trim()) newErrors.incomeName = "Income Name is required";
    else if (formData.incomeName.length < 5) newErrors.incomeName = "Income name must be at least 5 chracherts !"

    if (!formData.source.trim()) newErrors.source = "Source is required";
    else if (formData.source.length < 3) newErrors.source = "Source name must be at least 3 chracherts !"
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.amount === null || formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (formData.invoiceNo === null || formData.invoiceNo <= 0) newErrors.invoiceNo = "Invoice No must be greater than 0";
    if (formData.paymentMethod === null) newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  };



  const handleSelectChange = (name: keyof IncomeFormData, value: number | string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleDateChange = (field: keyof IncomeFormData, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
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
      const { data } = await speIncome(id);
      if (data.success) {
        const res = data.data;
        setEditModal(true)
        setFormData({
          name: res.name,
          mobile: res.mobile,
          email: res.email,
          incomeName: res.incomeName,
          source: res.source,
          date: dayjs(res.date).format("DD MMM YYYY"),
          amount: res.amount,
          invoiceNo: res.invoiceNo,
          paymentMethod: res.paymentMethod,
          description: res.description,
          status: res.status
        });
        setEditId(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix errors first!");
      return;
    }
    // console.log(formData)
    try {
      const apiCall = editId ? editIncome(formData, editId) : addIncome(formData);
      const { data } = await apiCall;
      if (data.success) {
        toast.success(data.message);
        setFormData(initialData);
        fetchAllIncome();
        setEditId(null)
        setAddModal(false)
        setEditModal(false)
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData(initialData);
    setEditId(null);
    setErrors({});
    setEditId(null)
    setAddModal(false)
    setEditModal(false)
  };


  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delModal, setDelModal] = useState<boolean>(false)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    try {

      const { data } = await delIncome(id)
      if (data.success) {
        toast.success(data.message)
        fetchAllIncome()
        setDelModal(false)
      }


    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDeleteId(null)
    setDelModal(false)
  }


  const generateInv = async (id: number) => {
    setGenId(id)
    setGenLoading(true)
    try {
      const { data } = await genIncomeInv(id);

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `income-invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      // console.log("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setGenLoading(false)
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <Link
          to="#"
          className="link-primary"
        // data-bs-toggle="modal"
        // data-bs-target="#view_invoice"
        >
          INC{id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Income Name",
      dataIndex: "incomeName",
      sorter: (a: TableData, b: TableData) =>
        a.incomeName.length - b.incomeName.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: string) => (
        <span>{text ? text : "_"}</span>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.description.length - b.description.length,
    },
    {
      title: "Source",
      dataIndex: "source",
      sorter: (a: TableData, b: TableData) => a.source.length - b.source.length,
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
      sorter: (a: TableData, b: TableData) =>
        a.invoiceNo - b.invoiceNo,
      render: (text: any) => (
        <Link
          to="#"
          className="link-primary"
        // data-bs-toggle="modal"
        // data-bs-target="#view_invoice"
        >
          INV-{text}
        </Link>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      sorter: (a: TableData, b: TableData) =>
        a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: "Generate Invoice",
      dataIndex: "inv",
      render: (_: any, record: any) => (
        <>
          <button onClick={() => generateInv(record.id)} className="btn btn-sm btn-outline-success ">{genId === record.id && genLoading ? 'Generating...' : 'Gen-Invoice'}</button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <>
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
                  onClick={() => fetchById(record.id)}

                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => {
                    setDeleteId(record.id)
                    setDelModal(true)
                  }}

                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </button>
              </li>
            </ul>
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
              <h3 className="page-title mb-1">Income</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Income
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => setAddModal(true)}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Income
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Income List</h4>
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
                              <label className="form-label">Income Name</label>
                              <CommonSelect
                                className="select"
                                options={incomeName}
                                defaultValue={incomeName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Source</label>
                              <CommonSelect
                                className="select"
                                options={source}
                                defaultValue={source[0]}
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
              {/* Income List */}
              {
                loading ? <Spinner /> : (<Table dataSource={allIncomeData} columns={columns} Selection={true} />)
              }
              {/* /Income List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Income */}
      {
        addModal && (<div className="modal fade show d-block" id="add_income">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Income</h4>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-close custom-btn-close"
                
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
                      <div className="mb-3">
                        <label className="form-label">Income Name</label>
                        <input
                          type="text"
                          name="incomeName"
                          className={`form-control ${errors.incomeName ? "is-invalid" : ""}`}
                          value={formData.incomeName}
                          onChange={handleChange}
                        />
                        {errors.incomeName && <div className="invalid-feedback">{errors.incomeName}</div>}
                      </div>


                      <div className="mb-3">
                        <label className="form-label">Source</label>
                        <input
                          type="text"
                          name="source"
                          value={formData.source}
                          onChange={handleChange}
                          className="form-control"
                          autoComplete="off"
                        />
                        {errors.source && <div className="invalid-feedback d-block">{errors.source}</div>}
                      </div>


                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <div className="input-icon position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format="DD MMM YYYY"
                            value={formData.date ? dayjs(formData.date, "DD MMM YYYY") : null}
                            placeholder="Select Date"
                            onChange={(dateString) =>
                              handleDateChange(
                                "date",
                                Array.isArray(dateString) ? dateString[0] : dateString
                              )
                            }
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                          {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
                        </div>
                      </div>


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
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-light me-2"
                   
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Income
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
      }
      {/* /Add Income */}

      {/* Edit Income */}
       {
        editModal&&(<div className="modal fade show d-block" id="edit_income">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Income</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                  onClick={handleCancel}
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
                    <div className="mb-3">
                      <label className="form-label">Income Name</label>
                      <input
                        type="text"
                        name="incomeName"
                        className={`form-control ${errors.incomeName ? "is-invalid" : ""}`}
                        value={formData.incomeName}
                        onChange={handleChange}
                      />
                      {errors.incomeName && <div className="invalid-feedback">{errors.incomeName}</div>}
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Source</label>
                      <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="form-control"
                        autoComplete="off"
                      />
                      {errors.source && <div className="invalid-feedback d-block">{errors.source}</div>}
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <div className="input-icon position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format="DD MMM YYYY"
                          value={formData.date ? dayjs(formData.date, "DD MMM YYYY") : null}
                          placeholder="Select Date"
                          onChange={(dateString) =>
                            handleDateChange(
                              "date",
                              Array.isArray(dateString) ? dateString[0] : dateString
                            )
                          }
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
                      </div>
                    </div>


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
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-light me-2"
                 
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
      </div>)
       }
      {/* /Edit Income */}
      {/* Delete Modal */}
      {
        delModal && (<div className="modal fade show d-block" id="delete-modal">
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

    </div>
  );
};

export default AccountsIncome;
