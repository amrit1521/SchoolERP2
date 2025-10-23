import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../../../core/common/dataTable";
import TooltipOption from "../../../core/common/tooltipOption";
import { all_routes } from "../../router/all_routes";
import TransportModal from "./transportModal";
import {
  getAllTransportRoutes,
  deleteTransportRoutesById,
} from "../../../service/api";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
interface TransportRoute {
  id: number;
  routeName: string;
  status: number;
  addedOn?: string;
}

const TransportRoutes = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [transportRouteList, setTransportRouteList] = useState<
    TransportRoute[]
  >([]);
  const [filterRouteList, setFilterRouteList] = useState<TransportRoute[]>([]);
  const [transportRouteOption, setTransportRouteOption] = useState<
    { value: number; label: string }[]
  >([]);
  const statusOption: { value: number; label: string }[] = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(
    null
  );

  const fetchRoutes = async () => {
    try {
      const { data } = await getAllTransportRoutes();
      if (data.success) {
        setTransportRouteList(data.result);
        setFilterRouteList(data.result);
        setTransportRouteOption(
          data.result.map((e: any) => ({ value: e.id, label: e.routeName }))
        );
      } else {
        toast.error(data.message || "Failed to load routes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load routes");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { data } = await deleteTransportRoutesById(id);
      if (data.success) {
        toast.success(data.message || "Route deleted successfully");
        fetchRoutes();
      } else {
        toast.error(data.message || "Failed to delete route");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting route");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  interface FilterData {
    routeName: number | null;
    status: number | null;
  }
  const [filterData, setFilterData] = useState<FilterData>({
    routeName: null,
    status: null,
  });

  const handleFilterSelectChange = (
    name: keyof FilterData,
    value: string | number | null
  ) => {
    setFilterData((prev) => {
      const updated = { ...prev, [name]: value } as FilterData;
      return updated;
    });
  };

  const handleApplyClick = () => {
    if (filterData?.routeName != null && filterData.status !== null) {
      setFilterRouteList(
        transportRouteList.filter(
          (e) => e.id === filterData.routeName && filterData.status === e.status
        )
      );
    }
    dropdownMenuRef.current?.classList.remove("show");
  };

  const handleResetFilter = () => {
    setFilterData({ routeName: null, status: null });
    setFilterRouteList(transportRouteList);
    dropdownMenuRef.current?.classList.remove("show");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <Link to="#" className="link-primary">
          R0{text}
        </Link>
      ),
      sorter: (a: TransportRoute, b: TransportRoute) => a.id - b.id,
    },
    {
      title: "Route Name",
      dataIndex: "routeName",
      sorter: (a: TransportRoute, b: TransportRoute) =>
        a.routeName.localeCompare(b.routeName),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: number) =>
        text === 1 ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i> Active
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i> Inactive
          </span>
        ),
      sorter: (a: TransportRoute, b: TransportRoute) => a.status - b.status,
    },
    {
      title: "Added On",
      dataIndex: "addedOn",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: unknown, record: TransportRoute) => (
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
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_routes"
                  onClick={() => {
                    setSelectedRoute(record);
                  }}
                >
                  <i className="ti ti-edit-circle me-2" /> Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1 text-danger"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={() => setSelectedRoute(record)}
                >
                  <i className="ti ti-trash-x me-2" /> Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Routes</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Routes
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
                  data-bs-target="#add_routes"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Route
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Routes</h4>

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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Routes</label>

                              <CommonSelect
                                className="select"
                                options={transportRouteOption}
                                value={filterData.routeName}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "routeName",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>

                              <CommonSelect
                                className="select"
                                options={statusOption}
                                value={filterData.status}
                                onChange={(option) =>
                                  handleFilterSelectChange(
                                    "status",
                                    option ? option.value : ""
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link
                          to="#"
                          className="btn btn-light me-3"
                          onClick={handleResetFilter}
                        >
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
              <Table
                dataSource={filterRouteList}
                columns={columns}
                Selection={true}
              />
            </div>
          </div>
        </div>
      </div>

      <TransportModal
        onAdded={fetchRoutes}
        onUpdated={fetchRoutes}
        selectedItem={selectedRoute}
        clearSelected={() => setSelectedRoute(null)}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default TransportRoutes;
