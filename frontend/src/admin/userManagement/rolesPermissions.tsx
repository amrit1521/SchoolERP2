// import { rolesPermissionsData } from "../../core/data/json/rolesPermissions";
import Table from "../../core/common/dataTable/index";
import type { TableData } from "../../core/data/interface";
import PredefinedDateRanges from "../../core/common/datePicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { useMemo, useState } from "react";
import {
  createRoles,
  deleteRolesById,
  getAllRoles,
  updateRoles,
} from "../../service/api";
import { toast } from "react-toastify";

interface Roles {
  id: number;
  roleName: string;
  description: string;
  createdOn: string;
}

const RolesPermissions = () => {
  const routes = all_routes;
  // const data = rolesPermissionsData;
  const [allRoles, setAllRoles] = useState<Roles[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [roleDescription, setRoleDescription] = useState<string>("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const fetchRoles = async () => {
    try {
      const { data } = await getAllRoles();
      if (data.success) {
        console.log("roles data: ", data.result);
        setAllRoles(
          data.result.map((item: any) => ({
            id: item.id,
            roleName: item.role_name,
            description: item.description,
            createdOn: item.created_at,
          }))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load roles data");
    }
  };

  useMemo(() => {
    fetchRoles();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!roleName.trim()) {
      newErrors.roleName = "Role Name is required";
    }
    if (!roleDescription.trim()) {
      newErrors.roleDescription = "Role Description is required";
    }
    return newErrors;
  };

  const handleCreateRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const payload = {
        role_name: roleName,
        description: roleDescription,
      };
      const { data } = await createRoles(payload);
      if (data.success) {
        toast.success(data.message || "role created Scuccessfully.");
        fetchRoles();
      } else {
        toast.error(data.message || "roles creation failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create roles");
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("update Data: ", roleName, roleDescription, roleId);
    try {
      const payload = {
        role_name: roleName,
        description: roleDescription,
      };
      const { data } = await updateRoles(payload, roleId);
      if (data.success) {
        toast.success(data.message || "role udpated Scuccessfully.");
        fetchRoles();
      } else {
        toast.error(data.message || "roles udpation failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update roles");
    }
  };

  const handleDelete = async () => {
    try {
      console.log("deleteId: ", roleId);
      const { data } = await deleteRolesById(roleId);
      if (data.success) {
        fetchRoles();
        setRoleId(null);
        toast.success(data.message || "roles deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete roles");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting roles.");
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      render: (_: any, record: any) => {
        return <span className="text-capitalize">{record.roleName}</span>;
      },
      sorter: (a: TableData, b: TableData) =>
        a.roleName.length - b.roleName.length,
    },

    {
      title: "Created On",
      dataIndex: "createdOn",
      render: (_: any, record: any) => {
        const date = new Date(record.createdOn);
        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return <span>{formatted}</span>;
      },
      sorter: (a: TableData, b: TableData) =>
        a.createdOn.length - b.createdOn.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
              data-bs-toggle="modal"
              data-bs-target="#edit_role"
              onClick={() => {
                setRoleName(record.roleName);
                setRoleDescription(record.description);
                setRoleId(record.id);
              }}
            >
              <i className="ti ti-edit-circle text-primary" />
            </Link>
            <Link
              to={routes.permissions}
              state={{ roleId: record.id }}
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle  p-0 me-2"
            >
              <i className="ti ti-shield text-skyblue" />
            </Link>
            <Link
              to="#"
              className="btn btn-outline-light bg-white btn-icon d-flex align-items-center justify-content-center rounded-circle p-0 me-3"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
              onClick={() => {
                setRoleId(record.id);
              }}
            >
              <i className="ti ti-trash-x text-danger" />
            </Link>
          </div>
        </>
      ),
    },
  ];
  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Roles &amp; Permissions</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">User Management</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Roles &amp; Permissions
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
                    data-bs-target="#add_role"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Role
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Roles &amp; Permissions List</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                    <PredefinedDateRanges />
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
                {/* Role Permission List */}
                <Table
                  columns={columns}
                  dataSource={allRoles}
                  Selection={true}
                />
                {/* /Role Permission List */}
              </div>
            </div>
            {/* /Filter Section */}
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Role */}
        <div className="modal fade" id="add_role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Role</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleCreateRoles}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="col-form-label">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                        />
                        {errors.roleName && (
                          <div className="invalid-feedback">
                            {errors.roleName}
                          </div>
                        )}
                      </div>
                      <div className="mb-0">
                        <label className="col-form-label">
                          Role Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={roleDescription}
                          onChange={(e) => setRoleDescription(e.target.value)}
                        />
                        {errors.roleName && (
                          <div className="invalid-feedback">
                            {errors.roleDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setRoleName("");
                      setRoleDescription("");
                    }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Role */}
        {/* Edit Role */}
        <div className="modal fade" id="edit_role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Role</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setRoleName("");
                    setRoleDescription("");
                    setRoleId(null);
                  }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="col-form-label">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                        />
                      </div>
                      <div className="mb-0">
                        <label className="col-form-label">
                          Role Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={roleDescription}
                          onChange={(e) => setRoleDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setRoleName("");
                      setRoleDescription("");
                      setRoleId(null);
                    }}
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={handleUpdateRole}
                  >
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Role */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                      onClick={() => setRoleId(null)}
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                      onClick={handleDelete}
                    >
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </div>
  );
};

export default RolesPermissions;
