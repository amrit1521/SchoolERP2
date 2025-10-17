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
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(
    null
  );

  const handleApplyClick = () => {
    dropdownMenuRef.current?.classList.remove("show");
  };

  // 🔹 Fetch all routes
  const fetchRoutes = async () => {
    try {
      const { data } = await getAllTransportRoutes();
      if (data.success) {
        setTransportRouteList(data.result);
      } else {
        toast.error(data.message || "Failed to load routes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load routes");
    }
  };

  // 🔹 Delete route
  const handleDeleteRoute = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
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
                  onClick={() => setSelectedRoute(record)}
                >
                  <i className="ti ti-edit-circle me-2" /> Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1 text-danger"
                  to="#"
                  onClick={() => handleDeleteRoute(record.id)}
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
            <div className="card-body p-0 py-3">
              <Table
                dataSource={transportRouteList}
                columns={columns}
                Selection={true}
              />
            </div>
          </div>
        </div>
      </div>

      <TransportModal
        onRouteAdded={fetchRoutes}
        onRouteUpdated={fetchRoutes}
        selectedRoute={selectedRoute}
        clearSelected={() => setSelectedRoute(null)}
      />
    </>
  );
};

export default TransportRoutes;
