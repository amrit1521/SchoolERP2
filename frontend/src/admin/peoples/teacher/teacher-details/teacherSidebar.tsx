import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Imageurl } from "../../../../service/api";

type Props = {
  teacher: any;
  loading: boolean;
};

const TeacherSidebar: React.FC<Props> = ({ teacher, loading }) => {

 
  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
      {loading ? (
        <div className="stickybar pb-4">
          {/* Profile Card Skeleton */}
          <div className="card border-white">
            <div className="card-header">
              <div className="d-flex align-items-center flex-wrap row-gap-2">
                {/* Avatar */}
                <div className="d-flex align-items-center justify-content-center avatar avatar-xxl me-2 flex-shrink-0 text-dark frames">
                  <Skeleton width={80} height={80} />
                </div>
                {/* Info */}
                <div className="overflow-hidden">
                  <Skeleton width={120} height={20} className="mb-2" />
                  <Skeleton width={80} height={18} className="mb-2" />
                  <Skeleton width={100} height={16} />
                </div>
              </div>
            </div>

            {/* Basic Info Skeleton */}
            <div className="card-body">
              <h5 className="mb-3">Basic Information</h5>
              <dl className="row mb-0">
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        <Skeleton width={70} height={14} />
                      </dt>
                      <dd className="col-6 mb-3">
                        <Skeleton width={100} height={14} />
                      </dd>
                    </React.Fragment>
                  ))}
              </dl>
            </div>
          </div>

          {/* Primary Contact Info Skeleton */}
          <div className="card border-white">
            <div className="card-body">
              <h5 className="mb-3">Primary Contact Info</h5>
              <div className="d-flex align-items-center mb-3">
                <Skeleton circle width={40} height={40} className="me-2" />
                <div>
                  <Skeleton width={100} height={14} />
                  <Skeleton width={120} height={16} />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Skeleton circle width={40} height={40} className="me-2" />
                <div>
                  <Skeleton width={100} height={14} />
                  <Skeleton width={160} height={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Transport Skeleton */}
          <div className="card border-white mb-0">
            <div className="card-body pb-1">
              <h5 className="mb-3">Hostel / Transport</h5>
              <div className="d-flex align-items-center mb-3">
                <Skeleton circle width={40} height={40} className="me-2" />
                <div>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={100} height={14} />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <Skeleton width={100} height={14} className="mb-2" />
                  <Skeleton width={80} height={14} />
                </div>
                <div className="col-sm-6">
                  <Skeleton width={100} height={14} className="mb-2" />
                  <Skeleton width={80} height={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="stickybar pb-4">
          {/* Profile Card */}
          <div className="card border-white">
            <div className="card-header">
              <div className="d-flex align-items-center flex-wrap row-gap-3">
                <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                  <img
                    src={`${Imageurl}/${teacher.img_src}`}
                    className="img-fluid "
                    alt="img"
                  />
                </div>
                <div className="overflow-hidden">
                  <h5 className="mb-1 text-truncate">
                    {`${teacher.firstname} ${teacher.lastname}`}
                  </h5>
                  <p className="text-primary mb-1">{teacher.teacher_id}</p>
                  <p>Joined : {teacher.date_of_join}</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="card-body">
              <h5 className="mb-3">Basic Information</h5>
              <dl className="row mb-0">
                <dt className="col-6 fw-medium text-dark mb-3">
                  Class Range
                </dt>
                <dd className="col-6 mb-3 text-uppercase">{`${teacher.fromclass} To ${teacher.toclass}`}</dd>
                <dt className="col-6 fw-medium text-dark mb-3">
                  Class & Section
                </dt>
                <dd className="col-6 mb-3 text-uppercase">{teacher.class}-{teacher.section}</dd>
                <dt className="col-6 fw-medium text-dark mb-3">Subject</dt>
                <dd className="col-6 mb-3">{teacher.subject}</dd>
                <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
                <dd className="col-6 mb-3">{teacher.gender}</dd>
                <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
                <dd className="col-6 mb-3">{teacher.blood_gp}</dd>
                <dt className="col-6 fw-medium text-dark mb-0">Language</dt>
                <dd className="col-6 mb-0">
                  {teacher.lan_known && (
                    <span className="badge badge-light text-dark me-2">
                      {JSON.parse(teacher.lan_known).join(',')}
                    </span>
                  )}
                </dd>
              </dl>
            </div>
          </div>

          {/* Primary Contact Info */}
          <div className="card border-white">
            <div className="card-body">
              <h5 className="mb-3">Primary Contact Info</h5>
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-phone" />
                </span>
                <div>
                  <span className="text-dark fw-medium mb-1">Phone Number</span>
                  <p>{teacher.mobile}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-mail" />
                </span>
                <div>
                  <span className="text-dark fw-medium mb-1">Email Address</span>
                  <p>{teacher.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transport Information */}
          <div className="card border-white mb-0">
            <div className="card-body pb-1">
              <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                <li className="nav-item">
                  <Link className="nav-link active" to="#hostel" data-bs-toggle="tab">
                    Hostel
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#transport" data-bs-toggle="tab">
                    Transportation
                  </Link>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="hostel">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-building-fortress fs-16" />
                    </span>
                    <div>
                      <h6 className="fs-14 mb-1">{teacher.hostel}</h6>
                      <p className="text-primary">Room No : {teacher.room_num}</p>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="transport">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-bus fs-16" />
                    </span>
                    <div>
                      <span className="fs-12 mb-1">Route</span>
                      <p className="text-dark">{teacher.route}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Bus Number</span>
                        <p className="text-dark">{teacher.vehicle_num}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Pickup Point</span>
                        <p className="text-dark">{teacher.pickup_point}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSidebar;
