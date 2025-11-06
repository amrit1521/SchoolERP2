// import { DatePicker } from "antd";

import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import { all_routes } from "../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import { useEffect, useMemo, useState } from "react";
import {
  CreateNotice,
  deleteNotice,
  getAllNotice,
  getAllRoles,
  updateNotice,
  UploadNoticeFile,
} from "../../service/api";
import { toast } from "react-toastify";

const NoticeBoard = () => {
  const routes = all_routes;

  //add message:
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachement, setAttachement] = useState<File | any | null>(null);
  const [messageTo, setMessageTo] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allNotice, setAllNotice] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [messageToOption, setMessageToOption] = useState<
    { value: number; label: string }[]
  >([]);
  // const [addedOnFilterOption, setAddedOnFilterOption] = useState<
  //   { value: string; label: string }[]
  // >([]);
  const [selectedMessageTo, setSelectedMessageTo] = useState<string | null>(
    null
  );
  const [selectedAddedDate, setSelectedAddedDate] = useState<string | null>(
    null
  );
  const [filteredNotice, setFilteredNotice] = useState<any[]>([]);
  const formReset = () => {
    setTitle("");
    setMessage("");
    setAttachement(null);
    setMessageTo([]);
  };
  const addedOnFilterOption = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
  ];
  const fetchRoles = async () => {
    try {
      const { data } = await getAllRoles();
      if (data.success) {
       
        setAllRoles(
          data.result.map((item: any) => ({
            id: item.id,
            roleName: item.role_name,
          }))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load roles data");
    }
  };

  const fetchNotice = async () => {
    try {
      const { data } = await getAllNotice();
      if (data.success) {
        console.log("notice data: ", data.result);
        setAllNotice(
          data.result.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            attachment: item.attachment,
            role_id: item.role_id,
            addedOn: item.created_at,
          }))
        );
        // setAddedOnFilterOption(
        //   data.result.map((item: any) => ({
        //     value: item.created_at,
        //     label: new Date(item.created_at).toLocaleDateString(),
        //   }))
        // );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load notice data"
      );
    }
  };

  const handleCheckboxChange = (id: number) => {
    setMessageTo((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 4 * 1024 * 1024) {
        alert("File size must be less than 4MB");
        e.target.value = "";
        return;
      }

      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed");
        e.target.value = "";
        return;
      }

      setAttachement(file);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      let uploadedPath = null;
      let id = null;
      if (attachement) {
        formData.append("noticefile", attachement);
        const res = await UploadNoticeFile(formData);
        uploadedPath = res.data.file;
        id = res.data.insertId;
      }
      const payload = {
        title: title,
        message: message,
        attachement: uploadedPath,
        messageTo: messageTo,
        docsId: id,
      };
      console.log("notice Data: ", payload);
      const { data } = await CreateNotice(payload);
      if (data.success) {
        console.log(data);
        toast.success(data.message || "Notice Created Successfully.");
        formReset();
        fetchNotice();
        const modalEl = document.getElementById("add_message");
        if (modalEl) {
          const bs = (window as any).bootstrap;
          const modalInstance =
            bs?.Modal?.getInstance(modalEl) ?? new bs.Modal(modalEl);
          modalInstance?.hide();
        }
      } else {
        toast.error(data.message || "Notice creation failed.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load Notice data"
      );
    }
  };

  const handleDeleteNotice = async () => {
    try {
      if (selectedNotice) {
        console.log("slectedNotice: ", selectedNotice);
        const { data } = await deleteNotice(selectedNotice.id);
        console.log(data);
        if (data.success) {
          console.log(data);
          toast.success(data.message || "Notice deleted Successfully.");
          fetchNotice();
          setSelectedNotice(null);
          const modalEl = document.getElementById("delete-modal");
          if (modalEl) {
            const bs = (window as any).bootstrap;
            const modalInstance =
              bs?.Modal?.getInstance(modalEl) ?? new bs.Modal(modalEl);
            modalInstance?.hide();
          }
        } else {
          toast.error(data.message || "Notice deletion failed.");
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete Notice data"
      );
    }
  };

  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      let uploadedPath = null;
      let id = null;

      if (
        selectedNotice &&
        attachement &&
        attachement.name !== selectedNotice.attachment
      ) {
        formData.append("noticefile", attachement);
        const res = await UploadNoticeFile(formData);
        uploadedPath = res.data.file;
        id = res.data.insertId;
      }

      if (!messageTo || !Array.isArray(messageTo) || messageTo.length === 0) {
        toast.error("Please select recipients");
        return;
      }

      const payload = {
        title: title,
        message: message,
        attachement: uploadedPath || selectedNotice?.attachment || null,
        messageTo: messageTo,
        docsId: id,
        noticeId: selectedNotice?.id,
      };
      console.log("payload: ", payload);
      const { data } = await updateNotice(payload);

      if (data.success) {
        toast.success(data.message || "Notice updated Successfully.");
        formReset();
        fetchNotice();
        setSelectedNotice(null);
        const modalEl = document.getElementById("edit_message");
        if (modalEl) {
          const bs = (window as any).bootstrap;
          const modalInstance =
            bs?.Modal?.getInstance(modalEl) ?? new bs.Modal(modalEl);
          modalInstance?.hide();
        }
      } else {
        toast.error(data.message || "Notice updation failed.");
      }
    } catch (error: any) {
      console.error(error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to load Notice data"
      );
    }
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();

    let filtered = [...allNotice];

    if (selectedMessageTo) {
      filtered = filtered.filter((notice: any) => {
        try {
          const roles = JSON.parse(notice.role_id || "[]");
          return roles.includes(parseInt(selectedMessageTo));
        } catch {
          return false;
        }
      });
    }

    if (selectedAddedDate) {
      const today = new Date();
      filtered = filtered.filter((notice: any) => {
        const added = new Date(notice.addedOn);
        switch (selectedAddedDate) {
          case "today":
            return added.toDateString() === new Date().toDateString();
          case "last7days":
            return added >= new Date(today.setDate(today.getDate() - 7));
          case "last30days":
            return added >= new Date(today.setDate(today.getDate() - 30));
          default:
            return true;
        }
      });
    }

    setFilteredNotice(filtered);
  };

  const handleResetFilter = () => {
    setSelectedMessageTo(null);
    setSelectedAddedDate(null);
    setFilteredNotice(allNotice);
  };

  useMemo(() => {
    if (allRoles) {
      setMessageToOption(
        allRoles.map((e: any) => ({ value: e.id, label: e.roleName }))
      );
    }
  }, [allRoles]);

  console.log("aallNotice : ", allNotice);
  useEffect(() => {
    fetchRoles();
    fetchNotice();
  }, []);

  return (
    <>
      {" "}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Notice Board</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Announcement</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Notice Board
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_message"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Message
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="d-flex align-items-center justify-content-end flex-wrap mb-2">
            <div className="form-check me-2 mb-3">
              <input className="form-check-input" type="checkbox" />
              <span className="checkmarks">Mark &amp; Delete All</span>
            </div>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>
              <div className="dropdown mb-3">
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
                  <form onSubmit={handleApplyFilter}>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom pb-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Message to</label>
                            <CommonSelect
                              className="select"
                              options={messageToOption}
                              value={
                                selectedMessageTo
                                  ? messageToOption.find(
                                      (opt: any) =>
                                        opt.value === selectedMessageTo
                                    )?.value
                                  : null
                              }
                              onChange={(value: any) =>
                                setSelectedMessageTo(value?.value || null)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Added Date</label>
                            <CommonSelect
                              className="select"
                              options={addedOnFilterOption}
                              value={
                                selectedAddedDate
                                  ? addedOnFilterOption.find(
                                      (opt) => opt.value === selectedAddedDate
                                    )?.value
                                  : null
                              }
                              onChange={(value: any) =>
                                setSelectedAddedDate(value?.value || null)
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
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Notice Board List */}
          {(filteredNotice.length > 0 ? filteredNotice : allNotice).map(
            (notice: any) => (
              <div key={notice.id} className="card board-hover mb-3">
                <div className="card-body d-md-flex align-items-center justify-content-between pb-1">
                  <div className="d-flex align-items-center mb-3">
                    <div className="form-check form-check-md me-2">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                    <span className="bg-soft-primary text-primary avatar avatar-md me-2 br-5 flex-shrink-0">
                      <i className="ti ti-notification fs-16" />
                    </span>
                    <div>
                      <h6 className="mb-1 fw-semibold">
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#view_details"
                          onClick={() => setSelectedNotice(notice)}
                        >
                          {notice.title}
                        </Link>
                      </h6>
                      <p>
                        <i className="ti ti-calendar me-1" />
                        Added on:{" "}
                        {new Date(notice.addedOn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Board actions remain unchanged */}
                  <div className="d-flex align-items-center board-action mb-3">
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_message"
                      className="text-primary border rounded p-1 badge me-1 primary-btn-hover"
                      onClick={() => {
                        setSelectedNotice(notice);
                        setTitle(notice.title || "");
                        setMessage(notice.message || "");
                        setAttachement(notice.attachment || null);
                        try {
                          const parsedRoles =
                            typeof notice.role_id === "string"
                              ? JSON.parse(notice.role_id)
                              : notice.role_id || [];
                          setMessageTo(parsedRoles);
                        } catch {
                          setMessageTo([]);
                        }
                      }}
                    >
                      <i className="ti ti-edit-circle fs-16" />
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                      className="text-danger border rounded p-1 badge danger-btn-hover"
                      onClick={() => setSelectedNotice(notice)}
                    >
                      <i className="ti ti-trash-x fs-16" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
          {/* Notice Board List */}
          <div className="text-center">
            <Link to="#" className="btn btn-primary">
              <i className="ti ti-loader-3 me-2" />
              Load More
            </Link>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Messase */}
      <div className="modal fade" id="add_message">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">New Message</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => formReset()}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleCreateNotice}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e: any) => setTitle(e.target?.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="bg-light p-3 pb-2 rounded">
                        <div className="mb-3">
                          <label className="form-label">Attachment</label>
                          <p>Upload size of 4MB, Accepted Format PDF</p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                            <i className="ti ti-file-upload me-1" />
                            Upload
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={handleFileChange}
                            />
                          </div>
                          {attachement && (
                            <span className="ms-2 text-muted">
                              {attachement["name"]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        defaultValue={""}
                        value={message}
                        onChange={(e: any) => setMessage(e.target?.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Message To</label>
                      <div className="row">
                        {allRoles.map((item: any, index: number) => {
                          return (
                            <div key={index} className="col-md-6 col-12 mb-1">
                              <div className="form-check form-check-md">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  onChange={() => handleCheckboxChange(item.id)}
                                />
                                <span className="text-capitalize">
                                  {item?.roleName}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={() => formReset()}
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Add New Mesaage
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Messase */}
      {/* Edit Messase */}
      <div className="modal fade" id="edit_message">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Message</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => formReset()}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleUpdateNotice}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e: any) => setTitle(e.target?.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="bg-light p-3 pb-2 rounded">
                        <div className="mb-3">
                          <label className="form-label">Attachment</label>
                          <p>Upload size of 4MB, Accepted Format PDF</p>
                        </div>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                            <i className="ti ti-file-upload me-1" />
                            Upload
                            <input
                              type="file"
                              className="form-control image_sign"
                              onChange={handleFileChange}
                            />
                          </div>
                          {attachement && (
                            <span className="ms-2 text-muted">
                              {typeof attachement === "string"
                                ? attachement.split("/").pop()
                                : attachement.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Add Comment"
                        value={message}
                        onChange={(e: any) => setMessage(e.target?.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Message To</label>
                      <div className="row">
                        {allRoles.map((item: any, index: number) => (
                          <div key={index} className="col-md-6 col-12 mb-1">
                            <div className="form-check form-check-md">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={messageTo.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                              <span className="text-capitalize">
                                {item?.roleName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={() => formReset()}
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Messase */}
      {/* View Details */}
      <div className="modal fade" id="view_details">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{selectedNotice?.title}</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="mb-3">
                <p className="mb-1">Dear parents,</p>
                <p>{selectedNotice?.message}</p>
              </div>

              {selectedNotice?.attachment && (
                <div className="mb-3">
                  <div className="bg-light p-3 pb-2 rounded">
                    <div className="mb-0">
                      <label className="form-label">Attachment</label>
                      <p className="text-primary">
                        <a
                          href={selectedNotice.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedNotice.attachment.split("/").pop()}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label d-block">Message To</label>
                {selectedNotice &&
                  JSON.parse(selectedNotice?.role_id)?.map((role: string) => (
                    <span key={role} className="badge badge-soft-primary me-2">
                      {
                        allRoles.filter((rol: any) => role == rol.id)[0][
                          "roleName"
                        ]
                      }
                    </span>
                  ))}
              </div>

              <div className="border-top pt-3">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="d-flex align-items-center me-4 mb-3">
                    <span className="avatar avatar-sm bg-light me-1">
                      <i className="ti ti-calendar text-default fs-14" />
                    </span>
                    Added on:{" "}
                    {selectedNotice
                      ? new Date(selectedNotice.addedOn).toLocaleDateString()
                      : ""}
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-sm bg-light me-1">
                      <i className="ti ti-user-edit text-default fs-14" />
                    </span>
                    Added By : {selectedNotice?.added_by || "Admin"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
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
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteNotice}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </>
  );
};

export default NoticeBoard;
