

import { Link } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
// import { accounts_invoices_data } from "../../core/data/json/accounts_invoices_data";
import type { TableData } from "../../core/data/interface";
import {
  invoiceNumber,
  paymentMethod,
  transactionDate,
} from "../../core/common/selectoption/selectoption";
import CommonSelect from "../../core/common/commonSelect";
import PredefinedDateRanges from "../../core/common/datePicker";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
// import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { useEffect, useState } from "react";
import { allInvoice, deleteInvoice, genInvoice } from "../../service/accounts";
import { Spinner } from "../../spinner";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
// import InvoicePreviewModal from "./invoicePreviewModal";

export interface Invoice {
  id: number;
  customer: string;
  invoiceNumber: string;
  date: string; // ISO date string
  dueDate: string; // ISO date string
  paymentMethod: string;
  status: string;
  description: string;
  total: string;
}


const AccountsInvoices = () => {
  const routes = all_routes;
  // const data = accounts_invoices_data;

  const [invData, setInvData] = useState<Invoice[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [genLoading, setGenLoading] = useState<boolean>(false)
  const [genId, setGenId] = useState<number | null>(null)



  const fetchInvData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 400))
    try {

      const { data } = await allInvoice()
      if (data.success) {
        setInvData(data.data)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvData()
    
  }, [])



  const generateInv = async (id: number) => {
    setGenId(id)
    setGenLoading(true)
    try {
      const { data } = await genInvoice(id);

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setGenLoading(false)
    }
  };


  // delete class room-----------------------------------------------------
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [delModal ,setDelModal] = useState<boolean>(false)
  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    try {

      const { data } = await deleteInvoice(id)
      if (data.success) {
        toast.success(data.message)
        fetchInvData()
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

  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      sorter: (a: TableData, b: TableData) =>
        a.invoiceNumber.length - b.invoiceNumber.length,
      render: (text: any) => (
        <Link
          to="#"
          className="link-primary"
          data-bs-toggle="modal"
          data-bs-target="#view_invoice"
        >
          INV{text}
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text: string) => (
        dayjs(text).format('DD MMM YYYY')
      ),
      sorter: (a: TableData, b: TableData) => a.date.length - b.date.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: TableData, b: TableData) =>
        a.description.length - b.description.length,
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      sorter: (a: TableData, b: TableData) =>
        a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text: string) => (
        dayjs(text).format('DD MMM YYYY')
      ),
      sorter: (a: TableData, b: TableData) =>
        a.dueDate.length - b.dueDate.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
      render: (status: any) => (
        <>
          <span
            className={`badge d-inline-flex align-items-center badge-soft-success
        ${status === "Paid"
                ? "badge-soft-success"
                : status === "overdue"
                  ? "badge-soft-warning"
                  : status === "pending"
                    ? "badge-soft-info"
                    : ""
              }`}
          >
            <i className="ti ti-circle-filled fs-5 me-1" />
            {status}
          </span>
        </>
      ),
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
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
      render: (_: any, record: any) => (
        <>
          {" "}
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
                <Link
                  className="dropdown-item rounded-1"
                  to={`${routes.editInvoice}/${record.id}`}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <button
                onClick={() =>{ setDeleteId(record.id) 
                  setDelModal(true)
                }}
                className="dropdown-item rounded-1"
              
              >
                <i className="ti ti-trash-x me-2" />
                Delete
              </button>
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
              <h3 className="page-title mb-1">Invoices</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Invoices
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to={routes.addInvoice}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Invoices
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Filter Section */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Invoices List</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Date</label>
                              <CommonSelect
                                className="select"
                                options={transactionDate}
                                defaultValue={transactionDate[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Payment Method
                              </label>
                              <CommonSelect
                                className="select"
                                options={paymentMethod}
                                defaultValue={paymentMethod[0]}
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
              {/* Invoice List */}
              {loading ? <Spinner /> : (<Table dataSource={invData} columns={columns} Selection={true} />)}
              {/* /Invoice List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* View Modal */}
     
      {/* <InvoicePreviewModal/> */}
      
      {/* /View Modal */}
      {/* Delete Modal */}
       {
        delModal&&<div className="modal fade show d-block" id="delete-modal">
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
       }
      {/* /Delete Modal */}
    </div>
  );
};

export default AccountsInvoices;
