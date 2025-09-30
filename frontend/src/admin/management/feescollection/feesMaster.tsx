import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  // amount,
  DueDate,
  feeGroup,
  feesTypes,
  fineType,
  ids,
  status,
} from "../../../core/common/selectoption/selectoption";

import Table from "../../../core/common/dataTable/index";
import FeesModal from "./feesModal";

import TooltipOption from "../../../core/common/tooltipOption";
import { allFeesMaster } from "../../../service/api";
import { toast } from "react-toastify";
import dayjs from 'dayjs'



const FeesMaster = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = feesMasterData;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  interface FeesMaster {
    id: number;
    amount: string;
    dueDate: string;
    fineType: string;
    status: string;
    fineAmount: string;
    feesGroup: string;
    feesType: string;
  }

  const [feesMasterdata, setFeesMasterdata] = useState<FeesMaster[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)

  const fetchAllMaterFees = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500))
    try {
      const { data } = await allFeesMaster();
      if (data.success) {
        setFeesMasterdata(data.fees_master);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMaterFees();
  }, []);

  const onSubmitMasterFees = () => {
    fetchAllMaterFees()
    setDeleteId(null)
    setEditId(null)
  }



  // Map for table
  const tabledata = feesMasterdata.map((item) => ({
    key: item.id,
    id: item.id,
    feesGroup: item.feesGroup,
    feesType: item.feesType,
    dueDate: dayjs(item.dueDate).format('DD MMM YYYY'),
    amount: item.amount,
    fineType: item.fineType,
    fineAmount: item.fineAmount || "0",
    status: item.status === "1" ? "Active" : "Inactive",
  }));


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Fees Group",
      dataIndex: "feesGroup",
      sorter: (a: any, b: any) => a.feesGroup.length - b.feesGroup.length,
    },
    {
      title: "Fees Type",
      dataIndex: "feesType",
      sorter: (a: any, b: any) => a.feesType.length - b.feesType.length,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a: any, b: any) => a.dueDate.length - b.dueDate.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: any, b: any) => a.amount.length - b.amount.length,
    },
    {
      title: "Fine Type",
      dataIndex: "fineType",
      render: (text: string) => (
        <>
          {text === "" ? (
            <span className="badge bg-soft-warning">None</span>
          ) : text === "percentage" ? (
            <span className="badge bg-soft-info">Percentage</span>
          ) : (
            <span className="badge bg-soft-danger">Fixed</span>
          )}
        </>
      ),
      sorter: (a: any, b: any) => a.fineType.length - b.fineType.length,
    },
    {
      title: "Fine Amount",
      dataIndex: "fineAmount",
      sorter: (a: any, b: any) => a.fineAmount.length - b.fineAmount.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Active" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
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
                  onClick={() => setEditId(id)}
                  data-bs-toggle="modal"
                  data-bs-target="#edit_fees_master"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={() => setDeleteId(id)}
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
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Collection</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Fees Collection</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Fees Master
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_fees_master"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Fees Master
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees Collection</h4>
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
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">ID</label>
                              <CommonSelect
                                className="select"
                                options={ids}
                              // defaultValue={ids[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Fees Group</label>
                              <CommonSelect
                                className="select"
                                options={feeGroup}
                              // defaultValue={feeGroup[0]}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Fees Type</label>
                              <CommonSelect
                                className="select"
                                options={feesTypes}
                              // defaultValue={feesTypes[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Due Date</label>
                              <CommonSelect
                                className="select"
                                options={DueDate}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Fine Type</label>
                              <CommonSelect
                                className="select"
                                options={fineType}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                              // defaultValue={status[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </Link>
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
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
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
              {/* Student List */}
              {
                loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (<> <Table dataSource={tabledata} columns={columns} Selection={true} /></>)
              }
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <FeesModal onAction={onSubmitMasterFees} editId={editId} deleteId={deleteId} type="feesmaster" />
    </>
  );
};

export default FeesMaster;
