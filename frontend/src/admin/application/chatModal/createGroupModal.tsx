import React, { useState, useMemo } from "react";

interface Props {
  users: any[];
  show: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; members: number[] }) => void;
  currentUserId: number;
  imageUrl: string;
}

const CreateGroupModal: React.FC<Props> = ({
  users,
  show,
  onClose,
  onCreate,
  currentUserId,
  imageUrl,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const toggleUser = (id: number) => {
    
    if (id === currentUserId) return;

    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  // FILTER + SEARCH  
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchName =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role_name.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter === "All"
          ? true
          : u.role_name.toLowerCase() === roleFilter.toLowerCase();

      return matchName && matchRole;
    });
  }, [search, roleFilter, users]);

  const handleCreate = () => {
    if (!groupName.trim()) {
      alert("Please enter group name");
      return;
    }

    onCreate({
      name: groupName,
      members: selectedUsers,
    });

    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg rounded-4 border-0">

          {/* HEADER */}
          <div className="modal-header bg-light border-bottom-0">
            <h4 className="modal-title fw-bold">Create New Group</h4>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* Group Name */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Group Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* SEARCH + FILTER */}
            <div className="d-flex gap-3 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Librarian">librarian</option>
                <option value="Accountant">Accountant</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            <hr />

            {/* MEMBERS LIST */}
            <h5 className="fw-bold mb-3">Select Members</h5>

            <div
              style={{
                maxHeight: "350px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
              className="custom-scrollbar"
            >
              {filteredUsers.length === 0 && (
                <p className="text-muted text-center py-3">
                  No users found...
                </p>
              )}

              {filteredUsers.map((u) => (
                <div
                  key={u.user_id}
                  className={`d-flex align-items-center p-2 border rounded mb-2 
                    ${selectedUsers.includes(u.user_id) ? "bg-secondary text-white" : ""}`}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onClick={() => toggleUser(u.user_id)}
                >
                  <input
                    style={{cursor:'pointer'}}
                    type="checkbox"
                    className="me-3"
                    checked={selectedUsers.includes(u.user_id)}
                    onChange={() => toggleUser(u.user_id)}
                  />

                  <div className="avatar me-3">
                    <img
                      src={`${imageUrl}/${u.user_img}`}
                      className="rounded-circle"
                      width={50}
                      height={50}
                      alt="user"
                    />
                  </div>

                  <div className="flex-grow-1">
                    <h6 className="mb-0 text-capitalize fw-semibold">
                      {u.name}
                    </h6>
                    <small className="text-capitalize">
                      {u.role_name}
                    </small>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer border-top-0">
            <button className="btn  btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary " onClick={handleCreate}>
              Create Group
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
