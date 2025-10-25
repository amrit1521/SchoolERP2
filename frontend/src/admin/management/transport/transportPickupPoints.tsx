import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { all_routes } from "../../router/all_routes";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import Table from "../../../core/common/dataTable";
import TooltipOption from "../../../core/common/tooltipOption";
import TransportModal from "./transportModal";

import {
  getAllPickupPoints,
  deletePickupPointById,
} from "../../../service/api"; // Implement these API methods

import { status as statusOptions } from "../../../core/common/selectoption/selectoption";

interface PickupPoint {
  id: number;
  pickPointName: string;
  status: string;
  addedOn?: string;
}

const TransportPickupPoints = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [filteredPickupPoints, setFilteredPickupPoints] = useState<
    PickupPoint[]
  >([]);
  const [pickupPointOption, setPickupPointOption] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedPickupPoint, setSelectedPickupPoint] =
    useState<PickupPoint | null>(null);

  const [filters, setFilters] = useState<{
    pickupPoint: number | null;
    status: string | null;
  }>({
    pickupPoint: null,
    status: null,
  });

  const fetchPickupPoints = async () => {
    try {
      const { data } = await getAllPickupPoints();
      if (data.success) {
        console.log("data: ", data);
        setPickupPoints(data.result);
        setFilteredPickupPoints(data.result);
        setPickupPointOption(
          data.result.map((point: PickupPoint) => ({
            value: point.id,
            label: point.pickPointName,
          }))
        );
      } else {
        toast.error(data.message || "Failed to fetch pickup points");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch pickup points"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { data } = await deletePickupPointById(id);
      if (data.success) {
        toast.success(data.message || "Pickup point deleted successfully");
        fetchPickupPoints();
      } else {
        toast.error(data.message || "Failed to delete pickup point");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting pickup point");
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    let filtered = pickupPoints;
    if (filters.pickupPoint !== null) {
      filtered = filtered.filter((e) => e.id === filters.pickupPoint);
    }
    if (filters.status !== null) {
      filtered = filtered.filter(
        (e) => parseInt(e.status) === parseInt(filters.status || "0")
      );
    }

    setFilteredPickupPoints(filtered);
    dropdownMenuRef.current?.classList.remove("show");
  };

  const handleResetFilter = () => {
    setFilters({ pickupPoint: null, status: null });
    setFilteredPickupPoints(pickupPoints);
    dropdownMenuRef.current?.classList.remove("show");
  };

  useEffect(() => {
    fetchPickupPoints();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => <Link to="#">PP0{text}</Link>,
      sorter: (a: PickupPoint, b: PickupPoint) => a.id - b.id,
    },
    {
      title: "Pickup Point",
      dataIndex: "pickPointName",
      sorter: (a: PickupPoint, b: PickupPoint) =>
        a.pickPointName.localeCompare(b.pickPointName),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: number) =>
        text === 1 ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" /> Active
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" /> Inactive
          </span>
        ),
      sorter: (a: PickupPoint, b: PickupPoint) =>
        a.status.localeCompare(b.status),
    },
    {
      title: "Added On",
      dataIndex: "addedOn",
      sorter: (a: PickupPoint, b: PickupPoint) =>
        new Date(a.addedOn || "").getTime() -
        new Date(b.addedOn || "").getTime(),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: unknown, record: PickupPoint) => (
        <div className="dropdown">
          <Link
            to="#"
            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
            data-bs-toggle="dropdown"
          >
            <i className="ti ti-dots-vertical fs-14" />
          </Link>
          <ul className="dropdown-menu dropdown-menu-right p-3">
            <li>
              <Link
                to="#"
                className="dropdown-item rounded-1"
                data-bs-toggle="modal"
                data-bs-target="#edit_pickup"
                onClick={() => setSelectedPickupPoint(record)}
              >
                <i className="ti ti-edit-circle me-2" />
                Edit
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="dropdown-item rounded-1 text-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={() => setSelectedPickupPoint(record)}
              >
                <i className="ti ti-trash-x me-2" />
                Delete
              </Link>
            </li>
          </ul>
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
              <h3 className="page-title mb-1">Pickup Points</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Management</li>
                  <li className="breadcrumb-item active">Pickup Points</li>
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
                  data-bs-target="#add_pickup"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Pickup Point
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Pickup Points List</h4>
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
                        <div className="mb-3">
                          <label className="form-label">Pickup Point</label>
                          <CommonSelect
                            options={pickupPointOption}
                            value={filters.pickupPoint}
                            onChange={(option) =>
                              handleFilterChange(
                                "pickupPoint",
                                option ? option.value : null
                              )
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <CommonSelect
                            options={statusOptions}
                            value={filters.status}
                            onChange={(option) =>
                              handleFilterChange(
                                "status",
                                option ? option.value : null
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light me-3"
                          onClick={handleResetFilter}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleApplyFilter}
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0 py-3">
              <Table
                dataSource={filteredPickupPoints}
                columns={columns}
                Selection={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TransportModal
        onAdded={fetchPickupPoints}
        onUpdated={fetchPickupPoints}
        selectedItem={selectedPickupPoint}
        clearSelected={() => setSelectedPickupPoint(null)}
        handleDelete={() =>
          selectedPickupPoint && handleDelete(selectedPickupPoint.id)
        }
      />
    </>
  );
};

export default TransportPickupPoints;
