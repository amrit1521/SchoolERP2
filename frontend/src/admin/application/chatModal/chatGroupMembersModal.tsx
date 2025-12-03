import React from "react";
import { toast } from "react-toastify";
import { removeMemberFromGroup } from "../../../service/chat";
import Swal from "sweetalert2";

interface Member {
    user_id: number;
    name: string;
    role_name: string;
    user_img: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    members: Member[];
    imageUrl: string;
    groupData: { id: number | null, name: string };
    onReportUser: (userId: number) => void;
    currentUserId: number | null
}

const GroupMembersModal: React.FC<Props> = ({
    show,
    onClose,
    setMembers,
    members,
    imageUrl,
    groupData,
    onReportUser,
    currentUserId
}) => {



    const removeMember = async (conversationId: number | null, memberId: number) => {
        if (!conversationId || !memberId) {
            toast.error("Please provide required data!");
            return;
        }

        // ✅ SweetAlert Confirmation
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to remove this member from the group?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Remove",
            cancelButtonText: "Cancel"
        });

        // ❌ User clicked Cancel
        if (!result.isConfirmed) return;

        const payLoad = {
            memberId,
            removedBy: currentUserId,
        };

        try {
            const { data } = await removeMemberFromGroup(payLoad, conversationId);

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Member Removed",
                    text: data.message,
                    timer: 1500,
                    showConfirmButton: false
                });

                // ✅ Update UI
                setMembers((prev) => prev.filter((m) => m.user_id !== memberId));
            }
        } catch (error: any) {
            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong!",
            });
        }
    };




    return (
        <div className={`modal fade ${show ? "show d-block" : ""}`}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow-lg rounded-3">

                    {/* HEADER */}
                    <div className="modal-header border-bottom">
                        <h4 className="modal-title d-flex align-items-center gap-2">
                            <i className="bx bx-users fs-4"></i>Group Name:{groupData.name}
                        </h4>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body" style={{ maxHeight: "450px", overflowY: "auto" }}>

                        {members.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="bx bx-user-x fs-1"></i>
                                <p className="mt-2">No Members Found</p>
                            </div>
                        ) : (
                            <ul className="list-unstyled m-0">
                                {members.map((m) => (
                                    <li
                                        key={m.user_id}
                                        className="p-2 mb-2 border rounded d-flex align-items-center"
                                    >
                                        {/* Avatar */}
                                        <div className="avatar avatar-lg me-3 flex-shrink-0">
                                            <img
                                                src={`${imageUrl}/${m.user_img}`}
                                                alt="user"
                                                className="rounded-circle"
                                                width={50}
                                                height={50}
                                            />
                                        </div>

                                        {/* Name + Role */}
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 text-capitalize">{m.name}</h6>
                                            <small className="text-muted text-capitalize">
                                                {m.role_name}
                                            </small>
                                        </div>

                                        {/* User Icon */}
                                        <div className="d-flex gap-2 flex-shrink-0">

                                            <div
                                                className="d-flex align-items-center gap-1 text-danger "
                                                onClick={() => removeMember(groupData.id, m.user_id)}
                                            >
                                                <i className="bx bx-user-x fs-4" title="remove user" />
                                                {/* <span>Remove</span> */}
                                            </div>

                                            <div
                                                className="d-flex align-items-center gap-1 text-danger "
                                                onClick={() => onReportUser(m.user_id)}
                                            >
                                                <i className="bx bx-error-circle fs-4" title="report user" />
                                                {/* <span>Report</span> */}
                                            </div>

                                        </div>


                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer border-top">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GroupMembersModal;
