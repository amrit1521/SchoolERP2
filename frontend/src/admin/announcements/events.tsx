import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import CommonSelect from "../../core/common/commonSelect";

import {
  // classes,
  eventCategory,
  // sections,
} from "../../core/common/selectoption/selectoption";
import { DatePicker } from "antd";
import { all_routes } from "../router/all_routes";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { TimePicker } from "antd";
import {
  CreateEvent,
  deleteEvent,
  getAllEvent,
  getAllRoles,
  UploadEventFile,
} from "../../service/api";
import { toast } from "react-toastify";
// interface EventDetails {
//   title: string;
// }

// interface Role {
//   id: number;
//   roleName: string;
// }

// interface EventFormProps {
//   allRoles: Role[];
//   eventCategory: { value: string; label: string }[];
//   handleAddEventClose: () => void;
// }

const Events = () => {
  const routes = all_routes;
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  // const [eventDetails, setEventDetails] = useState<EventDetails>({
  //   title: "",
  // });
  const [allEvent, setAllEvent] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [formData, setFormData] = useState({
    roles: [] as number[],
    title: "",
    category: eventCategory[0],
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    startTime: dayjs("00:00:00", "HH:mm:ss"),
    endTime: dayjs("00:00:00", "HH:mm:ss"),
    attachments: [] as File[],
    message: "",
  });

  const calendarRef = useRef(null);

  const handleDateClick = () => {
    setShowAddEventModal(true);
  };

  const handleEventClick = (info: any) => {
   
    setSelectedEvent(info.event?._def.extendedProps?.item);
    setShowEventDetailsModal(true);
  };

  const handleAddEventClose = () => setShowAddEventModal(false);
  const handleEventDetailsClose = () => setShowEventDetailsModal(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredEvents =
    selectedCategory === "All Category"
      ? allEvent
      : allEvent.filter((event) => event.category === selectedCategory);

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

  const handleCheckboxChange = (roleId: number) => {
    setFormData((prev) => {
      const roles = prev.roles || [];
      const exists = roles.includes(roleId);
      return {
        ...prev,
        roles: exists
          ? roles.filter((id) => id !== roleId)
          : [...roles, roleId],
      };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected: any) => {
    setFormData((prev) => ({ ...prev, category: selected }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attachments: Array.from(files),
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileFormData = new FormData();

    try {
      let uploadedPath = null;
      let fileId = null;

      if (formData.attachments && formData.attachments.length > 0) {
        fileFormData.append("eventfile", formData.attachments[0]);
        const res = await UploadEventFile(fileFormData);
        uploadedPath = res.data.file;
        fileId = res.data.insertId;
      }

      const startDate = formData.startDate
        ? dayjs(formData.startDate).format("YYYY-MM-DD")
        : "";
      const endDate = formData.endDate
        ? dayjs(formData.endDate).format("YYYY-MM-DD")
        : "";
      const startTime = formData.startTime
        ? formData.startTime.format("HH:mm:ss")
        : "";
      const endTime = formData.endTime
        ? formData.endTime.format("HH:mm:ss")
        : "";

      const dateRange = `${startDate}|${endDate}`;
      const timeRange = `${startTime}|${endTime}`;

      const payload = {
        title: formData.title,
        message: formData.message,
        category: formData.category?.value || null,
        dateRange,
        timeRange,
        roles: formData.roles,
        attachement: uploadedPath,
        docsId: fileId,
      };

    

      const { data } = await CreateEvent(payload);

      if (data.success) {
        toast.success(data.message || "Event Created Successfully.");
      
        fetchEvents();
      } else {
        toast.error(data.message || "Event creation failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create Event.");
    }
    handleAddEventClose();
  };

  const fetchEvents = async () => {
    try {
      const { data } = await getAllEvent();

      if (data.success) {
       

        setFormData(
          data.result.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            attachment: item.attachment,
            category: item.event_category,
            dateRange: item.event_date,
            timeRange: item.event_time,
            roles: item.role_id,
            addedOn: item.created_at,
          }))
        );
        setAllEvent(
          data.result.map((item: any) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            attachment: item.attachment,
            category: item.event_category,
            dateRange: item.event_date,
            timeRange: item.event_time,
            roles: item.role_id,
            addedOn: item.created_at,
          }))
        );
      } else {
        toast.error(data.message || "Failed to load event data");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load event data");
    }
  };

  const handleDeleteEvent = async (ids: string) => {
    try {
      ids = ids;
      if (ids) {

        const { data } = await deleteEvent(ids);
      
        if (data.success) {
       
          toast.success(data.message || "Event deleted Successfully.");
          fetchEvents();
          setSelectedEvent(null);
        } else {
          toast.error(data.message || "Event deletion failed.");
        }
        handleEventDetailsClose();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete Event data"
      );
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchEvents();
  }, []);

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">Events</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Announcement</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Events
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
                >
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                  >
                    <i className="ti ti-refresh" />
                  </Link>
                </OverlayTrigger>
              </div>
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Print</Tooltip>}
                >
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                  >
                    <i className="ti ti-printer" />
                  </button>
                </OverlayTrigger>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-light d-flex align-items-center"
                >
                  <i className="ti ti-calendar-up me-2" />
                  Sync with Google Calendar
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            {/* Event Calendar */}
            <div className="col-xl-8 col-xxl-9 theiaStickySidebar">
              <div className="stickybar">
                <div className="card">
                  <div className="card-body">
                    <FullCalendar
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                      ]}
                      initialView="dayGridMonth"
                      events={
                        allEvent &&
                        (allEvent
                          .map((item: any) => {
                            const dateRange = item?.dateRange || "";
                            const startDateStr = dateRange.split("|")[0];
                            const startDate = new Date(startDateStr);

                            if (isNaN(startDate.getTime())) {
                              return null;
                            }

                            return {
                              item: item,
                              title: item?.title,
                              backgroundColor: "#FDE9ED",
                              start: startDate.toISOString().slice(0, 10),
                            };
                          })
                          .filter((event) => event !== null) as any)
                      }
                      headerToolbar={{
                        start: "title",
                        center: "dayGridMonth,dayGridWeek,dayGridDay",
                        end: "custombtn",
                      }}
                      customButtons={{
                        custombtn: {
                          text: "Add New Event",
                          click: handleDateClick,
                        },
                      }}
                      eventClick={handleEventClick}
                      ref={calendarRef}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* /Event Calendar */}
            {/* Event List */}
            <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
              <div className="stickybar">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-3">Events</h5>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {selectedCategory}
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 d-flex align-items-center"
                          onClick={() => handleCategoryChange("Celebration")}
                        >
                          <i className="ti ti-circle-filled fs-8 text-warning me-2" />
                          Celebration
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 d-flex align-items-center"
                          onClick={() => handleCategoryChange("Training")}
                        >
                          <i className="ti ti-circle-filled fs-8 text-success me-2" />
                          Training
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 d-flex align-items-center"
                          onClick={() => handleCategoryChange("Meeting")}
                        >
                          <i className="ti ti-circle-filled fs-8 text-info me-2" />
                          Meeting
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 d-flex align-items-center"
                          onClick={() => handleCategoryChange("Holidays")}
                        >
                          <i className="ti ti-circle-filled fs-8 text-danger me-2" />
                          Holidays
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 d-flex align-items-center"
                          onClick={() => handleCategoryChange("Camp")}
                        >
                          <i className="ti ti-circle-filled fs-8 text-pending me-2" />
                          Camp
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Event Items */}
                {filteredEvents &&
                  filteredEvents.map((event: any) => {
                    return (
                      <div
                        className="border-start border-info border-3 shadow-sm p-3 mb-3 bg-white"
                        key={event.id}
                      >
                        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                          <span className="avatar p-1 me-3 bg-primary-transparent flex-shrink-0">
                            <i className="ti ti-users-group text-info fs-20" />
                          </span>
                          <div className="flex-fill">
                            <h6 className="mb-1">{event?.title}</h6>
                            <p className="fs-12">
                              <i className="ti ti-calendar me-1" />
                              {new Date(
                                event?.dateRange?.split("|")[0]
                              ).toDateString()}{" "}
                              -{" "}
                              {new Date(
                                event?.dateRange?.split("|")[1]
                              ).toDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0 fs-12">
                            <i className="ti ti-clock me-1" />
                            {event?.timeRange
                              ?.split("|")
                              .map((t: any) => {
                                const [h, m] = t.split(":").map(Number);
                                return `${(h % 12 || 12)
                                  .toString()
                                  .padStart(2, "0")}:${m
                                  .toString()
                                  .padStart(2, "0")}${h >= 12 ? "PM" : "AM"}`;
                              })
                              .join(" - ")}
                          </p>
                          <div className="avatar-list-stacked avatar-group-sm">
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-01.jpg"
                                className="rounded"
                                alt="img"
                              />
                            </span>
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-07.jpg"
                                className="rounded"
                                alt="img"
                              />
                            </span>
                            <span className="avatar border-0">
                              <ImageWithBasePath
                                src="assets/img/parents/parent-02.jpg"
                                className="rounded"
                                alt="img"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {/* /Event Items */}
              </div>
              {/* /Event List */}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Event */}
      <Modal show={showAddEventModal} onHide={handleAddEventClose}>
        <div className="modal-header">
          <h4 className="modal-title">New Event</h4>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleAddEventClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form onSubmit={handleCreateEvent}>
          <div className="modal-body">
            <div className="row">
              {/* Event For */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Event For</label>
                <div className="row">
                  {allRoles.map((item: any) => (
                    <div key={item.id} className="col-md-4 col-12 mb-1">
                      <div className="form-check form-check-md">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.roles?.includes(item.id) || false}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                        <span className="text-capitalize">{item.roleName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Event Title */}
              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              {/* Event Category */}
              <div className="mb-3">
                <label className="form-label">Event Category</label>
                <CommonSelect
                  className="select"
                  options={eventCategory}
                  value={formData.category?.value}
                  onChange={handleSelectChange}
                />
              </div>
              {/* Dates */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <DatePicker
                  className="form-control datetimepicker"
                  placeholder="Select Date"
                  value={formData.startDate}
                  onChange={(date: Dayjs | null) =>
                    setFormData((prev: any) => ({ ...prev, startDate: date }))
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <DatePicker
                  className="form-control datetimepicker"
                  placeholder="Select Date"
                  value={formData.endDate}
                  onChange={(date: Dayjs | null) =>
                    setFormData((prev: any) => ({ ...prev, endDate: date }))
                  }
                />
              </div>
              {/* Times */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Time</label>
                <TimePicker
                  className="form-control timepicker"
                  value={formData.startTime}
                  onChange={(time) =>
                    setFormData((prev) => ({ ...prev, startTime: time }))
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Time</label>
                <TimePicker
                  className="form-control timepicker"
                  value={formData.endTime}
                  onChange={(time) =>
                    setFormData((prev) => ({ ...prev, endTime: time }))
                  }
                />
              </div>
              {/* Attachment */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Attachment</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleFileChange}
                />
                {formData.attachments?.length > 0 && (
                  <ul className="mt-2">
                    {formData.attachments.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-md-12">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Link
              to="#"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
              onClick={handleAddEventClose}
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
      {/* /Add Event */}
      {/* Event Details */}
      <Modal show={showEventDetailsModal} onHide={handleEventDetailsClose}>
        <div className="modal-header justify-content-between">
          <span className="d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-8 me-1 text-info" />
            {selectedEvent?.category}
          </span>
          <div className="d-flex align-items-center">
            {/* <Link to="#" className="me-1 fs-18">
              <i className="ti ti-edit-circle" />
            </Link> */}
            <Link
              to="#"
              className="me-1 fs-18"
              onClick={() => handleDeleteEvent(selectedEvent?.id)}
            >
              <i className="ti ti-trash-x" />
            </Link>
            <Link
              to="#"
              className="fs-18"
              data-bs-dismiss="modal"
              onClick={handleEventDetailsClose}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
        </div>
        <div className="modal-body pb-0">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-xl bg-primary-transparent me-3 flex-shrink-0">
              <i className="ti ti-users-group fs-30" />
            </span>
            <div>
              <h3 id="eventTitle" className="mb-1">
                {selectedEvent?.title}
              </h3>
              <div className="d-flex align-items-center flex-wrap">
                <p className="me-3 mb-0">
                  <i className="ti ti-calendar me-1" />
                  {new Date(
                    selectedEvent?.dateRange?.split("|")[0]
                  ).toDateString()}{" "}
                </p>
                <p>
                  <i className="ti ti-calendar me-1" />
                  {selectedEvent?.timeRange
                    ?.split("|")
                    .map((t: any) => {
                      const [h, m] = t.split(":").map(Number);
                      return `${(h % 12 || 12).toString().padStart(2, "0")}:${m
                        .toString()
                        .padStart(2, "0")}${h >= 12 ? "PM" : "AM"}`;
                    })
                    .join(" - ")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-light-400 p-3 rounded mb-3">
            <p>{selectedEvent?.message}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="avatar-list-stacked avatar-group-sm d-flex mb-3">
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-01.jpg"
                  alt="img"
                />
              </span>
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-02.jpg"
                  alt="img"
                />
              </span>
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/teachers/teacher-03.jpg"
                  alt="img"
                />
              </span>
              <Link className="avatar bg-white text-default" to="#">
                +67
              </Link>
            </div>
            <div className="mb-3">
              <p className="mb-1">Event For</p>
              <h6>
                {selectedEvent &&
                  selectedEvent.roles &&
                  selectedEvent.roles
                    .map((roleId: any) => {
                      const role: any = allRoles.find(
                        (r: any) => r.id === roleId
                      );
                      return role ? role.roleName : null;
                    })
                    .filter(Boolean)
                    .join(", ")}
              </h6>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Event Details */}
    </div>
  );
};

export default Events;

{
  /* <i className="ti ti-vacuum-cleaner fs-24" /> */
}
{
  /* <i className="ti ti-user-edit fs-20" /> */
}
{
  /* <i className="ti ti-campfire fs-20" /> */
}
{
  /* <span className="avatar p-1 me-2 bg-success-transparent flex-shrink-0">
<i className="ti ti-clipboard-heart fs-20" />
</span> */
}
