import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PredefinedDateRanges from "../../core/common/datePicker";
// import type { TableData } from "../../core/data/interface";
import Table from "../../core/common/dataTable/index";
// import { permission } from "../../core/data/json/permission";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import {
  addModules,
  getAllModules,
  getAllRolePermissions,
  savePermissions,
} from "../../service/api";
import { toast } from "react-toastify";

const Permission = () => {
  const routes = all_routes;
  const location = useLocation();
  const { roleId } = location.state || {};
  const [permissionData, setPermissionData] = useState<any[]>([]);
  // permission.map((item: any, index: number) => ({
  //   id: index + 1,
  //   ...item,
  //   created: false,
  //   view: false,
  //   edit: false,
  //   delete: false,
  //   allowAll: false,
  // }))
  const fetchModule = async () => {
    if (!roleId) {
      toast.error("roleId is required.");
      return;
    }
    try {
      const { data } = await getAllModules();
      const result = await getAllRolePermissions(roleId);
      if (data.success) {
        // console.log("roles data: ", data.result);
        // setPermissionData(
        //   data.result.map((item: any) => ({
        //     id: item.id,
        //     modules: item.name,
        //     created: false,
        //     view: false,
        //     edit: false,
        //     delete: false,
        //     allowAll: false,
        //   }))
        // );
        const modules = data.result;
        const permissions = result.data?.result || [];
        console.log("permission: ", permissions);
        const combined = modules.map((module: any) => {
          const modulePerm = permissions.find(
            (perm: any) => perm.module_id === module.id
          );
          console.log("modulePerm: ", modulePerm);
          return {
            id: module.id,
            modules: module.name,
            created: !!modulePerm?.created,
            view: !!modulePerm?.view,
            edit: !!modulePerm?.edit,
            delete: !!modulePerm?.delete,
            allowAll: !!(
              modulePerm?.created &&
              modulePerm?.view &&
              modulePerm?.edit &&
              modulePerm?.delete
            ),
          };
        });
        setPermissionData(combined);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load modules data"
      );
    }
  };

  useEffect(() => {
    fetchModule();
  }, []);

  const [moduleName, setModuleName] = useState<string>("");
  const [slugName, setSlugName] = useState<string>("");

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName && !slugName) {
      toast.error("both data are required");
      return;
    }
    try {
      const payload = {
        name: moduleName,
        slug: slugName,
      };
      const { data } = await addModules(payload);
      console.log("module data : ", data);
      if (data.success) {
        toast.success(data.message || "module added successfully.");
        setModuleName("");
        setSlugName("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create module");
    }
  };

  const handlePermissionChange = (
    id: number,
    field: string,
    checked: boolean
  ) => {
    setPermissionData((prev) =>
      prev.map((perm) => {
        if (perm.id === id) {
          if (field === "allowAll") {
            return {
              ...perm,
              allowAll: checked,
              created: checked,
              view: checked,
              edit: checked,
              delete: checked,
            };
          }
          const updated = { ...perm, [field]: checked };
          if (!checked) updated.allowAll = false;
          else if (
            updated.created &&
            updated.view &&
            updated.edit &&
            updated.delete
          ) {
            updated.allowAll = true;
          }
          return updated;
        }
        return perm;
      })
    );
  };

  // const handlePermissionChange = (
  //   id: number,
  //   field: string,
  //   checked: boolean
  // ) => {
  //   setPermissionData((prev) =>
  //     prev.map((perm) => {
  //       if (perm.id !== id) return perm;

  //       const updated = { ...perm, [field]: checked };

  //       // recompute allowAll
  //       updated.allowAll =
  //         updated.created && updated.view && updated.edit && updated.delete;

  //       // if toggling allowAll, set all fields
  //       if (field === "allowAll") {
  //         updated.created =
  //           updated.view =
  //           updated.edit =
  //           updated.delete =
  //             checked;
  //       }

  //       return updated;
  //     })
  //   );
  // };

  const handleSavePermission = async () => {
    console.log("Updated Permissions:", permissionData, roleId);
    try {
      const payload = {
        permissions: permissionData,
        role_id: roleId,
      };
      if (roleId) {
        const { data } = await savePermissions(payload);
        if (data.success) {
          toast.success(data.message || "permission saved Successfully.");
        } else {
          toast.error(data.message || "saving permission failed.");
        }
      } else {
        toast.error("roleId not found. please select role.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save permission."
      );
    }
  };

  const columns = [
    {
      title: "Modules",
      dataIndex: "modules",
      key: "modules",
    },
    {
      title: "Created",
      dataIndex: "created",
      render: (_: any, record: any) => (
        <>
          <label className="checkboxs">
            <input
              type="checkbox"
              checked={record.created}
              onChange={(e) =>
                handlePermissionChange(record.id, "created", e.target.checked)
              }
            />
            <span className="checkmarks" />
          </label>
        </>
      ),
    },
    {
      title: "View",
      dataIndex: "view",
      render: (_: any, record: any) => {
        console.log(record);
        return (
          <>
            <label className="checkboxs">
              <input
                type="checkbox"
                checked={record.view}
                onChange={(e) =>
                  handlePermissionChange(record.id, "view", e.target.checked)
                }
              />
              <span className="checkmarks" />
            </label>
          </>
        );
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      render: (_: any, record: any) => (
        <>
          <label className="checkboxs">
            <input
              type="checkbox"
              checked={record.edit}
              onChange={(e) =>
                handlePermissionChange(record.id, "edit", e.target.checked)
              }
            />
            <span className="checkmarks" />
          </label>
        </>
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_: any, record: any) => (
        <>
          <label className="checkboxs">
            <input
              type="checkbox"
              checked={record.delete}
              onChange={(e) =>
                handlePermissionChange(record.id, "delete", e.target.checked)
              }
            />
            <span className="checkmarks" />
          </label>
        </>
      ),
    },
    {
      title: "AllowAll",
      dataIndex: "allowAll",
      render: (_: any, record: any) => (
        <>
          <label className="checkboxs">
            <input
              type="checkbox"
              checked={record.allowAll}
              onChange={(e) =>
                handlePermissionChange(record.id, "allowAll", e.target.checked)
              }
            />
            <span className="checkmarks" />
          </label>
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
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-1">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_role"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Module
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-warning d-flex align-items-center"
                    onClick={handleSavePermission}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Save Permission
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
                {/* Student List */}
                <Table
                  columns={columns}
                  dataSource={permissionData}
                  Selection={true}
                />
                {/* /Student List */}
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
                <h4 className="modal-title">Add Module</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setModuleName("");
                    setSlugName("");
                  }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleCreateModule}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="form-label">Module Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Module Name"
                          value={moduleName}
                          onChange={(e: any) => setModuleName(e.target.value)}
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Slug Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Slug Name"
                          value={slugName}
                          onChange={(e: any) => setSlugName(e.target.value)}
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
                      setModuleName("");
                      setSlugName("");
                    }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Role */}
      </>
    </div>
  );
};

export default Permission;
