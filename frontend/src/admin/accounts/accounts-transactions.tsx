
import { Link } from "react-router-dom";
// import { accounts_transactions_data } from "../../core/data/json/accounts_transactions_data";
import Table from "../../core/common/dataTable/index";
import type { TableData } from "../../core/data/interface";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import {
  transactionDate,
  transactionId,
  transactionType,
} from "../../core/common/selectoption/selectoption";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { useEffect, useState } from "react";
import { getTransactionsData } from "../../service/accounts";
import { Spinner } from "../../spinner";
import dayjs from 'dayjs'


interface TransactionData {
  id: number;
  source: string;
  date: string;
  amount: number;
  method: string;
  type: string;
  status: "1" | "0"
}

const AccountsTransactions = () => {
  // const data = accounts_transactions_data;
  const routes = all_routes;

  const [transData, setTransData] = useState<TransactionData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 300))

    try {

      const { data } = await getTransactionsData()
      if (data.success) {
        setTransData(data.data)
      }

    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: any) => (
        <Link to="#" className="link-primary">
          FT-{text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Transaction Source",
      dataIndex: "source",
      key:"source",
      sorter: (a: TableData, b: TableData) =>
        a.source.length - b.source.length,
    },
    {
      title: "Transaction Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => (
        <span>{dayjs(text).format('DD MMM YYYY')}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.date.length - b.date.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: TableData, b: TableData) => a.amount - b.amount,
    },
    {
      title: "Transaction Type",
      dataIndex: "type",
      key: "type",
      render: (text: string) => (
        <span className="text-capitalize">{text}</span>
      ),
      sorter: (a: TableData, b: TableData) => a.type.length - b.type.length,
    },
    {
      title: "Payment Method",
      dataIndex: "method",
      key: "method",
      sorter: (a: TableData, b: TableData) => a.method.length - b.method.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
      render: (status: any) => (
        <>
          <span
            className={`badge d-inline-flex align-items-center badge-soft-success
        ${status === "1"
                ? "badge-soft-success"
                : "badge-soft-warning"

              }`}
          >
            <i className="ti ti-circle-filled fs-5 me-1" />
            {status === '1' ? "Completed" : "Pending"}
          </span>
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
              <h3 className="page-title mb-1">Transactions</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance &amp; Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Transactions
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Filter Section */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Transactions List</h4>
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
                                Transaction ID
                              </label>
                              <CommonSelect
                                className="select"
                                options={transactionId}
                                defaultValue={transactionId[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Transaction Type
                              </label>
                              <CommonSelect
                                className="select"
                                options={transactionType}
                                defaultValue={transactionType[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Transaction Date
                              </label>
                              <CommonSelect
                                className="select"
                                options={transactionDate}
                                defaultValue={transactionDate[0]}
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
              {/* Transaction List */}
              {
                loading ? <Spinner /> : (<Table dataSource={transData}  columns={columns} />)
              }
              {/* /Transaction List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  );
};

export default AccountsTransactions;
