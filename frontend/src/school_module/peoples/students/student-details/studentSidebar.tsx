import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Imageurl } from "../../../../service/api";

type Props = {
  student: any,
  loading: boolean
}

const StudentSidebar: React.FC<Props> = ({ student, loading }) => {
  
  return (
    <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
     {
      loading?     <div className="stickybar pb-4">

        {/* Profile Card Skeleton */}
        <div className="card border-white">
          <div className="card-header">
            <div className="d-flex align-items-center  flex-wrap row-gap-2">
              {/* Avatar */}
              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl  me-2 flex-shrink-0 text-dark frames">
                <Skeleton  width={80} height={80} />
              </div>
              {/* Info */}
              <div className="overflow-hidden">
                <Skeleton width={80} height={20} className="mb-2" />
                <Skeleton width={120} height={22} className="mb-2" />
                <Skeleton width={100} height={16} />
              </div>
            </div>
          </div>

          {/* Basic Info Skeleton */}
          <div className="card-body">
            <h5 className="mb-3">Basic Information</h5>
            <dl className="row mb-0">
              {Array(6).fill(0).map((_, idx) => (
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
            <Skeleton width="100%" height={32} className="mt-3" />
          </div>
        </div>

        {/* Primary Contact Info */}
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

        {/* Transport Info Skeleton */}
        <div className="card border-white mb-0">
          <div className="card-body pb-1">
            <h5 className="mb-3">Transport Information</h5>
            <div className="d-flex align-items-center mb-3">
              <Skeleton circle width={40} height={40} className="me-2" />
              <div>
                <Skeleton width={100} height={16} />
                <Skeleton width={120} height={14} />
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

      </div>: <div className="stickybar pb-4">
        <div className="card border-white">
          <div className="card-header">
            <div className="d-flex align-items-center flex-wrap row-gap-3">
              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                <img
                  src={`${Imageurl}/${student.stu_img}`}
                  className="img-fluid "
                  alt="img"
                />
              </div>
              <div className="overflow-hidden">
                <span className={`badge ${student.status == 1 ? 'badge-soft-success' : 'badge-soft-danger'}  d-inline-flex align-items-center mb-1`}>
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {student.status == 1 ? 'Active' : 'Inactive'}
                </span>
                <h5 className="mb-1 text-truncate">{`${student.firstname} ${student.lastname}`}</h5>
                <p className="text-primary">{student.admissionnum}</p>
              </div>
            </div>
          </div>
          {/* Basic Information */}
          <div className="card-body">
            <h5 className="mb-3">Basic Information</h5>
            <dl className="row mb-0">
              <dt className="col-6 fw-medium text-dark mb-3">Roll No</dt>
              <dd className="col-6 mb-3">{student.rollnum}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
              <dd className="col-6 mb-3">{student.gender}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
              <dd className="col-6 mb-3">{student.dob}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
              <dd className="col-6 mb-3">{student.bloodgp}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">House</dt>
              <dd className="col-6 mb-3">{student.house}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Reigion</dt>
              <dd className="col-6 mb-3">{student.religion}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Caste</dt>
              <dd className="col-6 mb-3">{student.caste}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Category</dt>
              <dd className="col-6 mb-3">{student.category}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Mother tongue</dt>
              <dd className="col-6 mb-3">{student.motherton}</dd>
              <dt className="col-6 fw-medium text-dark mb-3">Language</dt>
              <dd className="col-6 mb-3">
                {student.lanknown && (<span className="badge badge-light text-dark me-2">
                  {JSON.parse(student.lanknown).join(',')}
                </span>)}
                {/* <span className="badge badge-light text-dark">Spanish</span> */}
              </dd>
            </dl>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_fees_collect"
              className="btn btn-primary btn-sm w-100"
            >
              Add Fees
            </Link>
          </div>
          {/* /Basic Information */}
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
                <p>{student.mobile}</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                <i className="ti ti-mail" />
              </span>
              <div>
                <span className="text-dark fw-medium mb-1">Email Address</span>
                <p>{student.email}</p>
              </div>
            </div>
          </div>
        </div>
        {/* /Primary Contact Info */}
        {/* Sibiling Information */}
        {/* <div className="card border-white">
          <div className="card-body">
            <h5 className="mb-3">Sibiling Information</h5>
            <div className="d-flex align-items-center bg-light-300 rounded p-3 mb-3">
              <span className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/students/student-06.jpg"
                  className="img-fluid rounded"
                  alt="img"
                />
              </span>
              <div className="ms-2">
                <h5 className="fs-14">Ralph Claudia</h5>
                <p>III, B</p>
              </div>
            </div>
            <div className="d-flex align-items-center bg-light-300 rounded p-3">
              <span className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/students/student-07.jpg"
                  className="img-fluid rounded"
                  alt="img"
                />
              </span>
              <div className="ms-2">
                <h5 className="fs-14">Julie Scott</h5>
                <p>V, A</p>
              </div>
            </div>
          </div>
        </div> */}
        {/* /Sibiling Information */}
        {/* Transport Information */}
        <div className="card border-white mb-0">
          <div className="card-body pb-1">
            <ul className="nav nav-tabs nav-tabs-bottom mb-3">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#hostel"
                  data-bs-toggle="tab"
                >
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
                    <h6 className="fs-14 mb-1">{student.hostel}</h6>
                    <p className="text-primary">Room No : {student.room_num}</p>
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
                    <p className="text-dark">{student.route}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <span className="fs-12 mb-1">Bus Number</span>
                      <p className="text-dark">{student.vehicle_num}</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <span className="fs-12 mb-1">Pickup Point</span>
                      <p className="text-dark">{student.pickup_point}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Transport Information */}
      </div>
     }
    </div>


  );
};

export default StudentSidebar;
