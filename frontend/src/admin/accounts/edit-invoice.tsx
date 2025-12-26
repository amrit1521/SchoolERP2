import { Link, useNavigate, useParams } from "react-router-dom";
import CommonSelect from "../../core/common/commonSelect";
import {
  // customerName,
  invStatus,
  paymentMethod,
  productName,
} from "../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";
import { all_routes } from "../../router/all_routes";
import dayjs from "dayjs";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { deleteInvoiceFile, editInvoice, speInvoice, uploadInvoiceFile } from "../../service/accounts";
import { Imageurl, stuForOption2 } from "../../service/api";


interface InvoiceForm {
  customer: number | null;
  invoiceNo: string;
  invoiceDate: string | null;
  dueDate: string | null;
  method: string;
  status: 'paid' | 'pending' | 'overdue'
  notes: string;
  terms: string;
  signatureName: string;
  description: string;
}

interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percent
}

interface InvoiceData extends InvoiceForm {
  products: Product[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
}

const EditInvoice: React.FC = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const { id } = useParams()
  const [students, setStudents] = useState<{ value: string; label: string }[]>([]);
  const fetchStudents = async () => {
    try {
      const { data } = await stuForOption2();

      if (data.success) {
        setStudents(
          data.data.map((s: any) => ({
            value: s.userId,
            label: `${s.firstname} ${s.lastname}`
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };


  const [form, setForm] = useState<InvoiceForm>({
    customer: null,
    invoiceNo: "",
    invoiceDate: null,
    dueDate: null,
    method: "",
    status: 'paid',
    notes: "",
    terms: "",
    signatureName: "",
    description: ""
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>({
    name: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
  });
  const [taxPercent, setTaxPercent] = useState<number>(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [logo, setLogo] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null)

  const [logoimgpath, setLogoimgpath] = useState<string>("");
  const [signimgpath, setSignimgpath] = useState<string>("");

  const [logoimgid, setLogoimgid] = useState<number | null>(null)
  const [signimgid, setSignimgid] = useState<number | null>(null)

  const [originalLogoPath, setOriginalLogoPath] = useState<string>("")
  const [originalSignPath, setOriginalSignPath] = useState<string>("")


  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    fieldName: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Allow only image or PDF
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        toast.error("Only JPG, PNG, or PDF files are allowed.");
        return;
      }

      const maxSizeInBytes = 4 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("File size should not exceed 4MB.");
        return;
      }


      setFile(file);

      const formData = new FormData();
      formData.append("invoice", file);

      try {

        const res = await uploadInvoiceFile(formData)
        const uploadedPath = res.data.file;
        const id = res.data.insertId;

        if (fieldName === "logoimgpath") {
          setLogoimgpath(uploadedPath);
          setLogoimgid(id)

        } else if (fieldName === "signimgpath") {
          setSignimgpath(uploadedPath);
          setSignimgid(id)

        }

      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const deleteImage = async (id: number) => {
    if (!id) return;

    try {
      const deletefile = await deleteInvoiceFile(id)

      if (deletefile.data.success) {
        // Student image
        if (id === logoimgid) {
          setLogoimgid(null);
          setLogo(null);
          setLogoimgpath("");
        }

        // Father image
        else if (id === signimgid) {
          setSignimgid(null);
          setSignature(null);
          setSignimgpath("");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const subtotal = products.reduce(
    (acc, p) => acc + p.quantity * p.unitPrice,
    0
  );
  const totalDiscount = products.reduce(
    (acc, p) => acc + (p.unitPrice * p.quantity * p.discount) / 100,
    0
  );
  const subtotalAfterProductDiscount = subtotal - totalDiscount;
  const tax = (subtotalAfterProductDiscount * taxPercent) / 100;
  const total = subtotalAfterProductDiscount + tax;



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleDateChange = (field: keyof InvoiceForm, date: Date | null) => {
    setForm((prev) => ({ ...prev, [field]: date }));
    //  setErrors((prev)=>({...prev , [field]:undefined}))
  };

  const handleAddProduct = () => {
    if (!selectedProduct.name || selectedProduct.quantity <= 0) return;
    setProducts([...products, selectedProduct]);
    setSelectedProduct({ name: "", quantity: 1, unitPrice: 0, discount: 0 });
  };

  const handleDeleteProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const validateInvoice = () => {
    const newErrors: Record<string, string> = {};

    if (!form.customer) newErrors.customer = "Customer name is required";
    if (!form.invoiceNo.trim()) newErrors.invoiceNo = "Invoice number is required";
    if (!form.invoiceDate) newErrors.invoiceDate = "Invoice date is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    if (!products.length) newErrors.products = "At least one product is required";
    if (subtotal <= 0) newErrors.subtotal = "Subtotal must be greater than zero";
    if (!form.signatureName.trim()) newErrors.signatureName = "Signature name is required";
    if (!form.method.trim()) newErrors.method = "Payment method is required "
    if (!form.description.trim()) newErrors.description = "Description is required "
    else if (form.description.length < 10) newErrors.description = "Description must be at least 10 Characters"

    // Optional fields but recommended
    if (!form.notes.trim()) newErrors.notes = "Notes cannot be empty ";
    if (!form.terms.trim()) newErrors.terms = "Terms & Conditions are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      customer: null,
      invoiceNo: "",
      invoiceDate: null,
      dueDate: null,
      notes: "",
      method: "",
      status: "paid",
      terms: "",
      signatureName: "",
      description: ""
    });
    setProducts([]);
    setSelectedProduct({ name: "", quantity: 1, unitPrice: 0, discount: 0 });
    setTaxPercent(18);

    setLogo(null);
    setSignature(null);
    setLogoimgpath("");
    setSignimgpath("");
    setLogoimgid(null);
    setSignimgid(null);
    setOriginalLogoPath('')
    setOriginalSignPath('')

    setErrors({});
    navigate(routes.accountsInvoices)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateInvoice();
    if (!isValid) {
      toast.warn("Please fix the validation errors before submitting.");
      return;
    }
    if (!originalLogoPath && !logoimgpath) {
      toast.error('School Logo Is Required !')
      return
    }
    if (!signimgpath && !originalSignPath) {
      toast.error('Signature img is required !')
      return
    }

    try {
      const data: InvoiceData = {
        ...form,
        products,
        subtotal,
        totalDiscount,
        tax,
        total,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (logoimgpath || originalLogoPath) formData.append("logo", logoimgpath || originalLogoPath);
      if (signimgpath || originalSignPath) formData.append("signature", signimgpath || originalSignPath);

      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const response = await editInvoice(formData, Number(id))
      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
      }


    } catch (error: any) {
      console.error("❌ Error while submitting invoice:", error);
      toast.error(error.response.data.message)
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    resetForm()
  }


  // fetching invoice data for edit

  const fetchInvoiceData = async (id: number) => {
    try {
      const { data } = await speInvoice(id); // Your API must return data like the JSON you showed
      if (data.success) {
        const invoice = data.data;

        setForm({
          customer: Number(invoice.customer),
          invoiceNo: invoice.invoiceNo,
          invoiceDate: dayjs(invoice.invoiceDate).format('DD MMM YYYY'),
          dueDate: dayjs(invoice.dueDate).format('DD MMM YYYY'),
          method: invoice.method,
          status: invoice.status,
          notes: invoice.notes,
          terms: invoice.terms,
          signatureName: invoice.signatureName,
          description: invoice.description,
        });
        setTaxPercent(invoice.taxPercent)
        setProducts(invoice.products || []);
        setLogoimgpath(invoice.logo ? invoice.logo : "");
        setSignimgpath(invoice.signature ? invoice.signature : "");
        setOriginalLogoPath(invoice.logo ? invoice.logo : "");
        setOriginalSignPath(invoice.signature ? invoice.signature : "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load invoice data");
    }
  };

  useEffect(() => {
    fetchStudents()
    if (id) fetchInvoiceData(Number(id));

  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Edit Invoice</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={routes.teacherList}>Finance &amp; Accounts</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Invoice
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {/* ✅ Company Logo Section */}
            <div className="card-header bg-light d-flex align-items-center">
              <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                <i className="ti ti-user-check fs-16" />
              </span>
              <h4 className="text-dark mb-0">Company Logo</h4>
            </div>
            <div className="card-body pb-1">
              <div className="profile-wrap mb-3 d-flex align-items-center">
                <div className="bg-white me-3">
                  {
                    !logoimgid ? (<p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={`${Imageurl}/${originalLogoPath}`} alt="" /></p>) :
                      !logo ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                        <i className="ti ti-photo-plus fs-16" />
                      </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(logo)} alt="" /></p>
                  }
                </div>
                <div className="profile-upload">
                  <div className="profile-uploader d-flex align-items-center">
                    <div className="drag-upload-btn mb-3">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setLogo, 'logoimgpath')}
                        className="form-control image-sign"
                      />
                    </div><span className="text-danger"> *</span>
                    {logoimgid && (<div onClick={() => deleteImage(logoimgid)} className="btn btn-outline-danger mb-3 ">
                      Remove
                    </div>)}
                  </div>
                  <p className="fs-12">
                    Upload image size 4MB, Format JPG, PNG,
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Customer Info */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h4 className="text-dark mb-0">Customer Information</h4>
              </div>
              <div className="card-body p-2">
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <CommonSelect
                      className={`select `}
                      options={students}
                      value={form.customer}
                      onChange={(v: any) =>
                        setForm((prev) => ({ ...prev, customer: v.value }))
                      }
                    />
                    {errors.customer && <p className="text-danger small">{errors.customer}</p>}
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Invoice Number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="invoiceNo"
                      className={`form-control `}
                      value={form.invoiceNo}
                      onChange={handleChange}
                    />
                    {errors.invoiceNo && <p className="text-danger small">{errors.invoiceNo}</p>}
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Invoice Date</label>
                    {/* <div className="input-icon position-relative"> */}
                    <DatePicker
                      className={`form-control datetimepicker`}
                      format="DD MMM YYYY"
                      value={
                        form.invoiceDate
                          ? dayjs(form.invoiceDate, "DD MMM YYYY")
                          : null
                      }
                      placeholder="Select Date"
                      onChange={(dateString) =>
                        handleDateChange(
                          "invoiceDate",
                          Array.isArray(dateString)
                            ? dateString[0]
                            : dateString
                        )
                      }
                    />

                    {/* <span className="input-icon-addon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    {errors.invoiceDate && <p className="text-danger small">{errors.invoiceDate}</p>}
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Due Date <span className="text-danger">*</span></label>
                    <DatePicker
                      className={`form-control datetimepicker`}
                      format="DD MMM YYYY"
                      value={
                        form.dueDate
                          ? dayjs(form.dueDate, "DD MMM YYYY")
                          : null
                      }
                      placeholder="Select Date"
                      onChange={(dateString) =>
                        handleDateChange(
                          "dueDate",
                          Array.isArray(dateString)
                            ? dateString[0]
                            : dateString
                        )
                      }
                    />
                    {errors.dueDate && <p className="text-danger small">{errors.dueDate}</p>}
                  </div>
                </div>
              </div>
            </div>
            {/* other info */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h4 className="text-dark mb-0">Other Information</h4>
              </div>
              <div className="card-body p-2">
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Payment Method <span className="text-danger">*</span></label>
                    <CommonSelect
                      className={`select `}
                      options={paymentMethod}
                      value={form.method}
                      onChange={(v: any) =>
                        setForm((prev) => ({ ...prev, method: v.value }))
                      }
                    />
                    {errors.method && <p className="text-danger small">{errors.method}</p>}
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Status</label>
                    <CommonSelect
                      className={`select text-capitalize`}
                      options={invStatus}
                      value={form.status}
                      onChange={(v: any) =>
                        setForm((prev) => ({ ...prev, status: v.value }))
                      }
                    />

                  </div>
                  <div className=" col-md-6">
                    <label className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea
                      name="description"
                      rows={4}
                      className="form-control"
                      value={form.description}
                      onChange={handleChange}
                    />
                    {errors.description && (<div className="text-small text-danger">{errors.description}</div>)}
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Product Section */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h4 className="text-dark mb-0">Product Information</h4>
              </div>
              {errors.products && <p className="text-danger small ms-4">{errors.products}</p>}
              <div className="card-body pb-0">
                <div className="row align-items-end">
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Product Name <span className="text-danger">*</span></label>
                    <CommonSelect
                      className={`select`}
                      options={productName}
                      onChange={(v: any) =>
                        setSelectedProduct((prev) => ({
                          ...prev,
                          name: v.value,
                        }))
                      }
                    />

                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Quantity <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedProduct.quantity}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev,
                          quantity: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Unit Price (₹) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedProduct.unitPrice}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev,
                          unitPrice: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="col-lg-2 col-md-6 my-2 my-sm-0">
                    <Link
                      to="#"
                      onClick={handleAddProduct}
                      className="btn btn-primary"
                    >
                      <i className="ti ti-plus me-2" />
                      Add to Bill
                    </Link>
                  </div>

                  {/* ✅ Product Table */}
                  <div className="col-md-12 mt-3">
                    <div className="table-responsive invoice-table">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Discount %</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p, i) => (
                            <tr key={i}>
                              <td>{p.name}</td>
                              <td>{p.quantity}</td>
                              <td>₹{Number(p.unitPrice).toFixed(2)}</td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={p.discount}
                                  onChange={(e) => {
                                    const newProducts = [...products];
                                    newProducts[i].discount = Number(
                                      e.target.value
                                    );
                                    setProducts(newProducts);
                                  }}
                                />
                              </td>
                              <td>
                                ₹
                                {(
                                  p.quantity * p.unitPrice -
                                  (p.unitPrice *
                                    p.quantity *
                                    p.discount) /
                                  100
                                ).toFixed(2)}
                              </td>
                              <td>
                                <Link
                                  to="#"
                                  onClick={() => handleDeleteProduct(i)}
                                >
                                  <i className="ti ti-trash text-danger" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* ✅ Notes & Signature Section */}
            <div className="invoice-info row mx-2">
              <div className="col-lg-8">
                <label className="form-label">Notes<span className="text-danger">*</span></label>
                <Editor
                  value={form.notes}
                  onTextChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      notes: e.htmlValue ?? "",
                    }))
                  }
                  style={{ height: "130px" }}
                />
                {errors.notes && <p className="text-danger small">{errors.notes}</p>}
                <label className="form-label mt-3">
                  Terms & Conditions<span className="text-danger">*</span>
                </label>
                <Editor
                  value={form.terms}
                  onTextChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      terms: e.htmlValue ?? "",
                    }))
                  }
                  style={{ height: "130px" }}
                />
                {errors.terms && <p className="text-danger small">{errors.terms}</p>}

              </div>

              {/* ✅ Signature Section */}
              <div className="col-lg-4">
                <div className="card invoice-amount-details">
                  <ul>
                    <li>
                      <span>Subtotal</span>
                      <h6>₹{subtotal.toFixed(2)}</h6>
                    </li>
                    <li>
                      <span>Product Discount</span>
                      <h6>₹{totalDiscount.toFixed(2)}</h6>
                    </li>
                    <li>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Overall Tax (%)</span>
                        <input
                          type="number"
                          className="form-control ms-2"
                          style={{ width: "100px" }}
                          value={taxPercent}
                          onChange={(e) =>
                            setTaxPercent(Number(e.target.value))
                          }
                        />
                      </div>
                    </li>
                    <li>
                      <span>Tax</span>
                      <h6>₹{tax.toFixed(2)}</h6>
                    </li>
                    <li>
                      <h5>Total</h5>
                      <h5>₹{total.toFixed(2)}</h5>
                    </li>
                  </ul>

                  <label className="form-label">Signature Name</label>
                  <input
                    type="text"
                    name="signatureName"
                    className="form-control"
                    value={form.signatureName}
                    onChange={handleChange}
                  />
                  {errors.signatureName && (<div className="text-small text-danger">{errors.signatureName}</div>)}



                  <div className="card-body pb-1">
                    <div className="profile-wrap mb-3 d-flex align-items-center">
                      <div className="bg-white me-3">
                        {
                          !signimgid ? (<p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={`${Imageurl}/${originalSignPath}`} alt="" /></p>) :
                            !signature ? <><div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div></> : <p className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0  frames"><img className="" src={URL.createObjectURL(signature)} alt="" /></p>
                        }

                      </div>
                      <div className="profile-upload">
                        <div className="profile-uploader d-flex align-items-center">
                          <div className="drag-upload-btn mb-3">
                            Upload Signature
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, setSignature, 'signimgpath')}
                              className="form-control image-sign"
                            />
                          </div><span className="text-danger"> *</span>
                          {signimgid && (<div onClick={() => deleteImage(signimgid)} className="btn btn-outline-danger mb-3 ">
                            Remove
                          </div>)}
                        </div>
                        <p className="fs-12">
                          Upload image size 4MB, Format JPG, PNG,
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="text-end m-3">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Edit Invoice
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoice;
