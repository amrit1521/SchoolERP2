import { useEffect, useRef, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DatePicker } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../../../node_modules/react-perfect-scrollbar/dist/css/styles.css";
import React from "react";
import { allChatUsers, allConversationforSpecficUser, clearRoomChat, createPrivateRoom, deleteMessage, deleteRoom, msgReactionsUpdate, msgReportUpdate, msgStarUpdate, OnlineChatUsers, reportUser, sendFile, sendMessage, speConversationForARoom } from "../../service/chat";
import { Spinner } from "../../spinner";
import { toast } from "react-toastify";
import { Socket, io } from "socket.io-client";
import { format, isToday, isYesterday } from 'date-fns';
import { CiMicrophoneOn } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { GrResume } from "react-icons/gr";
import { FaStopCircle } from "react-icons/fa";
import { Audiourl, Documenturl, Imageurl, Videourl } from "../../service/api";
import { MdOutlineAttachFile } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import Swal from "sweetalert2";



const Chat = () => {

  const useBodyClass = (className: string) => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname === "/application/chat") {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
      return () => {
        document.body.classList.remove(className);
      };
    }, [location.pathname, className]);
  };
  useBodyClass("app-chat");

  const routes = all_routes;
  // const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = useState(false);
  const [isShow, setShow] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  // const [showEmoji2, setShowEmoji2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);



  const handleShowClass = () => {
    setShow(true);
  };

  const handleShowremoveClass = () => {
    setShow(false);
  };

  const handleAddVisible = () => {
    setIsVisible(true);
  };

  const handleRemoveVisible = () => {
    setIsVisible(false);
  };
  const BASE_URL: string = import.meta.env.VITE_SERVERURL || "http://localhost:3004";

  const [users, setUsers] = useState<any>([]);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [allConversationUser, setAllConverSationUser] = useState<any>([]);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [speRoomConv, setSpeRoomConv] = useState<any>([]);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // const [previewFile , setPreviewFile] = useState<string>("")
  const [loading3, setLoading3] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [otherUser, setOtherUser] = useState<any>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [replyData, setReplyData] = useState<{ id: number | null; text: string }>({
    id: null,
    text: "",
  });
  const [showPicker, setShowPicker] = useState(false);
  const [currImg, setCurrImg] = useState<string | null>(null)
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?/;




  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  // ====================== SOCKET INIT =========================

  useEffect(() => {
    const s = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(s);
    if (currentUserId) {
      s.emit("user_connected", currentUserId);
    }
    s.on("new_message", (msg: any) => {
      if (msg.conversation_id !== conversationId) return;
      if (msg.reply_to) {
        const parentMsg = speRoomConv.find((m: any) => m.id === msg.reply_to);
        if (parentMsg) {
          msg.reply = {
            id: parentMsg.id,
            message_text: parentMsg.message_text,
            message_type: parentMsg.message_type,
            file_url: parentMsg.file_url,
          };
        }
      }
      setSpeRoomConv((prev: any) => [...prev, msg]);
      scrollToBottom();
    });
    s.on("message_deleted", ({ messageId }) => {
      setSpeRoomConv((prev: any) =>
        prev.filter((msg: any) => msg.id !== messageId)
      );
    });
    s.on("message_updated", (updated: any) => {
      setSpeRoomConv((prev: any) =>
        prev.map((msg: any) =>
          msg.id === updated.id ? { ...msg, ...updated } : msg
        )
      );
    });
    s.on("star_updated", ({ messageId, isStar }) => {
      setSpeRoomConv((prev: any) =>
        prev.map((msg: any) =>
          msg.id === messageId ? { ...msg, isStar } : msg
        )
      );
    });


    s.on("report_updated", ({ messageId, isReported }) => {
      setSpeRoomConv((prev: any) =>
        prev.map((msg: any) =>
          msg.id === messageId ? { ...msg, isReported } : msg
        )
      );
    });

    s.on("reaction_updated", ({ messageId, reactions }) => {
      setSpeRoomConv((prev: any) =>
        prev.map((msg: any) =>
          msg.id === messageId ? { ...msg, reaction: reactions } : msg
        )
      );
    });

    // -------------------------
    // CLEANUP
    // -------------------------
    return () => {
      s.off("new_message");
      s.off("message_deleted");
      s.off("message_updated");
      s.off("star_updated");
      s.off("report_updated");
      s.off("reaction_updated");
      s.disconnect();
    };
  }, [currentUserId, conversationId]);



  // =============== JOIN / LEAVE ROOM =====================
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit("join_conversation", conversationId);

      return () => {
        socket.emit("leave_conversation", conversationId);
      };
    }
  }, [socket, conversationId]);



  // ===================== FETCH USERS ======================
  const fetchUsers = async () => {
    try {
      const { data } = await allChatUsers();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const { data } = await OnlineChatUsers();
      if (data.success) {
        setOnlineUsers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllConverationWithUser = async (id: number) => {
    setLoading1(true);
    try {
      const { data } = await allConversationforSpecficUser(id);
      if (data.success) {
        setAllConverSationUser(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading1(false);
    }
  };

  const fetchSpeRoomConv = async (roomId: number, userId: number) => {
    setTimeout(scrollToBottom, 1);
    setLoading2(true);
    try {
      const { data } = await speConversationForARoom(roomId, userId);
      if (data.success) {
        setSpeRoomConv(data.data);
        setOtherUser(data.userData);
        setConversationId(roomId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };


  const closeSpeConversation = () => {
    setConversationId(null)
    setOtherUser({})
    setSpeRoomConv([])
  }

  const privateRoom = async (id: number) => {
    if (!currentUserId || !id) {
      toast.success("Sender and Receiver id is required");
      return;
    }

    const payload = {
      sender_id: currentUserId,
      receiver_id: id,
    };

    try {
      const { data } = await createPrivateRoom(payload);
      if (data.success) {
        fetchSpeRoomConv(data.data.conversation_id, id);
        setIsNewChat(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // clear chat
  const clearChat = async (conversationId: number | null) => {
    if (!conversationId) return;

    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the entire chat history!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear chat",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-4 shadow-lg",
        confirmButton: "px-4 py-2 rounded-3",
        cancelButton: "px-4 py-2 rounded-3"
      }
    });


    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await clearRoomChat(conversationId);

      if (data.success) {
        Swal.fire({
          title: "Cleared!",
          text: "Chat cleared successfully.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        setSpeRoomConv([]);
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const deleteChat = async (conversationId: number | null) => {
    if (!conversationId) return;

    const confirmation = await Swal.fire({
      title: "Delete Chat?",
      text: "This will permanently delete this chat room and all messages!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-4 shadow-lg",
        confirmButton: "px-4 py-2 rounded-3",
        cancelButton: "px-4 py-2 rounded-3",
      },
    });

    if (!confirmation.isConfirmed) return;
    try {
      const { data } = await deleteRoom(conversationId);
      if (data.success) {
        setConversationId(null);
        setOtherUser({});
        setSpeRoomConv([]);

        if (currentUserId) {
          fetchAllConverationWithUser(currentUserId);
        }


        Swal.fire({
          title: "Deleted!",
          text: "Chat room and messages deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  // ON MOUNT 
  useEffect(() => {
    const tokenStr = localStorage.getItem("token");
    if (tokenStr) {
      const token = JSON.parse(tokenStr);
      setCurrentUserId(token.id);
      fetchAllConverationWithUser(token.id);
    }
  }, []);

  useEffect(() => {
    fetchOnlineUsers();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles: File[] = Array.from(fileList);


    if (selectedFiles.length > 5) {
      alert("You can upload maximum 5 files at once.");
      e.target.value = ""; // reset input
      return;
    }

    setFiles(selectedFiles);

    e.target.value = "";
  };

  // SEND MESSAGE 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!message.trim() && files.length === 0) return;
    if (!conversationId || !currentUserId) return;

    setLoading3(true);

    try {
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("conversation_id", String(conversationId));
        formData.append("sender_id", String(currentUserId));
        formData.append("reply_to", String(replyData.id || null));
        files.forEach((file) => {
          formData.append("chatfile", file);
        });
        const { data } = await sendFile(formData);

        if (data.success) {
          console.log("Files sent:", data.data);
        }
        setFiles([]);
        setMessage("");
        setReplyData({ id: null, text: "" });

        setLoading3(false);
        return; // important
      }
      let payload: any = {
        conversation_id: conversationId,
        sender_id: currentUserId,
        message_text: message,
        message_type: "text",
        reply_to: replyData.id || null
      };

      // if (replyData.id) {
      //   payload.reply_to = replyData.id;
      // }

      const { data } = await sendMessage(payload);

      if (data.success) {
        setReplyData({ id: null, text: "" });
      }

      setMessage("");

    } catch (error) {
      console.error("Error sending:", error);
    } finally {
      setLoading3(false);
    }
  };

  // AUDIO RECORDING
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        setRecordTime(0);

        const file = new File([audioBlob], "voice-message.webm", {
          type: "audio/webm",
        });

        if (!conversationId || !currentUserId) {
          toast.error("First select user !");
          return;
        }

        const formData = new FormData();
        formData.append("sender_id", String(currentUserId));
        formData.append("conversation_id", String(conversationId));
        formData.append("chatfile", file, "audioMessage.webm");

        const { data } = await sendFile(formData);
        if (data.success) {
          // const newMessage = data.data;

          // socket?.emit("send_message", formData);

          // setSpeRoomConv((prev: any) => [...prev, newMessage]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordTime(0);
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      toast.error(err.response?.data?.message || "Mic error ! mic not supported !");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // ================= DELETE MESSAGE ==================
  const deleteUserMessage = async (id: number) => {
    if (!id) {
      toast.error("Id Not Provided or This message already deleted !");
      return;
    }
    try {
      const { data } = await deleteMessage(id);
      if (data.success) {
        setSpeRoomConv((prev: any) => prev.filter((msg: any) => msg.id !== id));
        toast.success("Message deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  // =============== STAR MESSAGE ===================
  const toggleStar = async (id: number, isStar: number) => {
    const newValue = isStar ? 0 : 1;
    try {
      const { data } = await msgStarUpdate({ isStar: newValue }, id);
      if (!data.success) return;
      setSpeRoomConv((prev: any[]) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isStar: newValue } : msg))
      );
    } catch (err) {
      console.error("Star update failed:", err);
    }
  };
  // =============== REPORT MESSAGE ===================
  const toggleReport = async (messageId: number, currentReport: number) => {
    try {
      const newReportValue = currentReport === 1 ? 0 : 1;

      const { data } = await msgReportUpdate(
        { isReported: newReportValue },
        messageId
      );

      if (data.success) {
        setSpeRoomConv((prev: any) =>
          prev.map((m: any) =>
            m.id === messageId ? { ...m, isReported: newReportValue } : m
          )
        );
      }
    } catch (error) {
      console.log("Report toggle failed:", error);
    }
  };
  // =============== REACTIONS ===================
  const toggleReaction = async (
    messageId: number,
    currentReactions: any[],
    newEmoji: string
  ) => {
    try {
      const existingReaction = currentReactions?.find(
        (r: any) => r.userId === currentUserId
      );

      const finalEmoji =
        existingReaction && existingReaction.emoji === newEmoji
          ? null
          : newEmoji;

      const { data } = await msgReactionsUpdate(
        { emoji: finalEmoji, userId: currentUserId },
        messageId
      );

      if (data.success) {
        setSpeRoomConv((prev: any) =>
          prev.map((msg: any) => {
            if (msg.id !== messageId) return msg;
            let updatedReactions = [...msg.reaction];
            if (existingReaction) {
              if (finalEmoji === null) {
                updatedReactions = updatedReactions.filter(
                  (r: any) => r.userId !== currentUserId
                );
              } else {
                updatedReactions = updatedReactions.map((r: any) =>
                  r.userId === currentUserId ? { ...r, emoji: finalEmoji } : r
                );
              }
            } else {
              if (finalEmoji !== null) {
                updatedReactions.push({
                  userId: currentUserId,
                  emoji: finalEmoji,
                });
              }
            }

            return { ...msg, reaction: updatedReactions };
          })
        );
      }
    } catch (error) {
      console.log("Reaction toggle failed:", error);
    }
  };
  // ========= TIME FORMATTERS ==============
  function formatTimeAgo(dateInput: string | number | Date): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid date";
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const formatMessageTimeInConversation = (dateString: any) => {

    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(date.getTime() + istOffset);

    if (isToday(istTime)) return format(istTime, "hh:mm a");
    if (isYesterday(istTime)) return `Yesterday, ${format(istTime, "hh:mm a")}`;
    return format(istTime, "dd MMM, hh:mm a");
  };

  // report user
  const handleReportUser = async (userId: number) => {
    if (!currentUserId) return toast.error("Login first");

    try {
      const reason = prompt("Why are you reporting this user?");
      if (!reason || !reason.trim()) {
        toast.error('Reason is required !')
        return
      } else if (reason.length < 10) {
        toast.error('Reason should be at least 10 chracters !')
        return
      }
      const payload = {
        reportedUserId: userId,
        reportedBy: currentUserId,
        reason,
        conversationId
      }
      const { data } = await reportUser(payload)

      if (data.success) {
        toast.success("User reported successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to report user");
    }
  };

  // emoji

  const pickerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const onEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };



  return (
    <>
      <div className="main-chat-blk">
        <div className="main-wrapper">
          <div className="page-wrapper chat-page-wrapper">
            <div className="content">
              {/* sidebar group */}
              <div className="sidebar-group left-sidebar chat_sidebar">
                {/* Chats sidebar */}
                <div
                  id="chats"
                  className="left-sidebar-wrap sidebar active slimscroll"
                >
                  <div className="slimscroll-active-sidebar">
                    {/* Left Chat Title */}
                    <div className="left-chat-title all-chats d-flex justify-content-between align-items-center">
                      <div className="setting-title-head">
                        <h4> All Chats</h4>
                      </div>
                      <div className="add-section">
                        <ul>
                          <li>
                            <Link to="#" className="user-chat-search-btn">
                              <i className="bx bx-search" />
                            </Link>
                          </li>
                          <li>
                            <div className="chat-action-btns">
                              <div className="chat-action-col">
                                <Link
                                  className="#"
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="bx bx-dots-vertical-rounded" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <button onClick={() => {
                                    fetchUsers()
                                    setIsNewChat(true)
                                  }
                                  } className="dropdown-item ">
                                    <span>
                                      <i className="bx bx-message-rounded-add" />
                                    </span>
                                    New Chat{" "}
                                  </button>
                                  <Link to="#" className="dropdown-item">
                                    <span>
                                      <i className="bx bx-user-circle" />
                                    </span>
                                    Create Group
                                  </Link>
                                  {/* <Link to="#" className="dropdown-item">
                                    <span>
                                      <i className="bx bx-user-plus" />
                                    </span>
                                    Invite Others
                                  </Link> */}
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        {/* Chat Search */}
                        <div className="user-chat-search">
                          <form>
                            <span className="form-control-feedback">
                              <i className="bx bx-search" />
                            </span>
                            <input
                              type="text"
                              name="chat-search"
                              placeholder="Search"
                              className="form-control"
                            />
                            <div className="user-close-btn-chat">
                              <span className="material-icons">close</span>
                            </div>
                          </form>
                        </div>
                        {/* /Chat Search */}
                      </div>
                    </div>
                    {/* /Left Chat Title */}
                    {/* Top Online Contacts */}
                    <div className="top-online-contacts p-4 pb-0">
                      <div className="fav-title">
                        <h5>Online Now</h5>
                        {/* <Link to="#">View All</Link> */}
                      </div>
                      {/* <Slider {...profile}> */}
                      <div className="d-flex gap-1">
                        {
                          onlineUsers && onlineUsers.length > 0 ? (
                            onlineUsers
                              // 👇 current user ko exclude kar diya
                              .filter((u: any) => u.user_id !== currentUserId)
                              .map((u: any, index: number) => (
                                <div
                                  style={{ cursor: 'pointer' }}
                                  key={index}
                                  onClick={() => privateRoom(u.user_id)}
                                  className="top-contacts-box me-1"
                                >
                                  <div className="avatar avatar-lg avatar-online border border-1">
                                    <img
                                      src={u.user_img ? `${Imageurl}/${u.user_img}` : "/assets/img/profiles/avatar-01.jpg"}
                                      className="rounded-circle"
                                      alt={u.name || "User"}
                                    />
                                  </div>
                                  {/* <span>{u.name}</span> */}
                                </div>
                              ))
                          ) : (
                            <div className="text-muted text-center w-100">No User Online</div>
                          )
                        }
                      </div>
                      {/* <div className="top-contacts-box  me-1">
                          <div className="avatar avatar-lg avatar-online">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="top-contacts-box me-1">
                          <div className="avatar avatar-lg avatar-online">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-07.jpg"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="top-contacts-box me-1">
                          <div className="avatar avatar-lg avatar-online">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-05.jpg"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="top-contacts-box me-1">
                          <div className="avatar avatar-lg avatar-online">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-03.jpg"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="top-contacts-box me-1">
                          <div className="avatar avatar-lg avatar-online">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle"
                              alt=""
                            />
                          </div>
                        </div> */}
                      {/* </Slider> */}
                    </div>
                    {/* /Top Online Contacts */}
                    <div className="sidebar-body chat-body" id="chatsidebar">
                      {
                        isNewChat ? <>
                          <h5 className="mb-3">New Chat</h5>
                          <ul className="mb-3">

                            {
                              users && users.map((u: any) => (
                                <li key={u.user_id} onClick={() => privateRoom(u.user_id)} className="user-list-item">
                                  <Link
                                    to="#"
                                    className="p-2 border rounded d-block mb-2"
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className="avatar  avatar-lg  me-2 flex-shrink-0">
                                        <img
                                          src={`${Imageurl}/${u.user_img}`}
                                          className="rounded-circle"
                                          alt="image"
                                        />
                                      </div>
                                      <div className="flex-grow-1 overflow-hidden me-2">
                                        <h6 className="mb-1 text-truncate text-capitalize">
                                          {u.name}
                                        </h6>
                                        <p className="text-truncate text-capitalize">
                                          {u.role_name}
                                        </p>
                                      </div>
                                      <div className="flex-shrink-0 align-self-start text-end">
                                        {/* <small className="text-muted">
                                          {u.role_name}
                                        </small> */}
                                        {/* <div className="chat-pin">
                                          <i className="bx bx-pin me-2" />
                                          <i className="bx bx-check-double" />
                                        </div> */}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))
                            }

                          </ul></> : <>
                          {/* Left Chat Title */}
                          {
                            loading1 ? <Spinner /> : (<>
                              <h5 className="mb-3">Recent Chat</h5>
                              {/* /Left Chat Title */}

                              {
                                allConversationUser.length > 0 ? allConversationUser && allConversationUser.map((u: any) => (
                                  <ul className="user-list">

                                    <li key={u.conversation_id} onClick={() => fetchSpeRoomConv(u.conversation_id, u.other_user_id)} className="user-list-item">
                                      <div

                                        className="p-2 border rounded d-block mb-2"
                                      >
                                        <div className="d-flex align-items-center">
                                          <div className={`avatar  avatar-lg ${u.is_online ? 'avatar-online' : ''} me-2 flex-shrink-0`}>
                                            {
                                              u.user_img ? (<img
                                                src={`${Imageurl}/${u.user_img}`}
                                                className="rounded-circle"
                                                alt="image"
                                              />) : (<ImageWithBasePath
                                                src="assets/img/profiles/avatar-04.jpg"
                                                className="rounded-circle"
                                                alt="image"
                                              />)
                                            }
                                          </div>
                                          <div className="flex-grow-1 overflow-hidden me-2">
                                            <h6 className="mb-1 text-truncate">
                                              {u.name}
                                            </h6>
                                            <p className="text-truncate">
                                              <i className="bx  me-1" />
                                              {u.last_message}
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 align-self-start text-end">
                                            <small className="text-muted">
                                              {u.last_message_time ? formatTimeAgo(u.last_message_time) : ""}
                                            </small>
                                            <div>
                                              {/* <i className="bx bx-check-double" /> */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                  </ul>
                                ))
                                  :
                                  <ul className="user-list">

                                    <li className="user-list-item">
                                      <div

                                        className="p-2 border rounded d-block mb-2"
                                      >
                                        <div className="d-flex align-items-center">
                                          <div className={`avatar  avatar-lg me-2 flex-shrink-0`}>
                                            <ImageWithBasePath
                                              src="assets/img/profiles/avatar-04.jpg"
                                              className="rounded-circle"
                                              alt="image"
                                            />

                                          </div>
                                          <div className="flex-grow-1 overflow-hidden me-2">
                                            <h6 className="mb-1 text-truncate">
                                              No User
                                            </h6>
                                            <p className="text-truncate">
                                              <i className="bx  me-1" />
                                              Please Select User
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 align-self-start text-end">
                                            <small className="text-muted">

                                            </small>
                                            <div>
                                              {/* <i className="bx bx-check-double" /> */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                              }

                            </>)
                          }
                        </>
                      }
                    </div>
                  </div>
                </div>

                {/* / Chats sidebar */}
              </div>
              {/* /Sidebar group */}

              {/* Chat */}

              <div className="chat chat-messages" id="middle">
                <div ref={chatAreaRef} className="slimscroll">
                  <PerfectScrollbar>
                    <div className="chat-header">
                      <div className="user-details">
                        <div className="d-lg-none">
                          <ul className="list-inline mt-2 me-2">
                            <li className="list-inline-item">
                              <Link
                                className="text-muted px-0 left_sides"
                                to="#"
                                data-chat="open"
                              >
                                <i className="fas fa-arrow-left" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="avatar avatar-lg me-2">
                          {
                            otherUser.user_img ? (<img
                              onClick={() => {
                                setOpen2(true)
                                setCurrImg(otherUser.user_img)
                              }}
                              src={`${Imageurl}/${otherUser.user_img}`}
                              className="rounded-circle dreams_chat"
                              style={{ cursor: 'pointer' }}
                              alt="image"
                            />) : (
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-02.jpg"
                                className="rounded-circle dreams_chat"
                                alt="image"
                              />)
                          }
                        </div>
                        <div>
                          <h6>{otherUser ? otherUser.name : "Select User"}</h6>
                          <small className="last-seen">
                            {otherUser?.is_online === 1
                              ? "Online"
                              : otherUser?.last_seen
                                ? `Last Seen ${formatMessageTimeInConversation(otherUser.last_seen)}`
                                : "Last Seen: Just now"}
                          </small>

                        </div>
                      </div>
                      <div className="chat-options ">
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              className="btn btn-outline-light chat-search-btn"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Search"
                              onClick={handleShowClass}
                            >
                              <i className="bx bx-search" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id={`tooltip-${routes.videoCall}`}>
                                  Video Call
                                </Tooltip>
                              }
                            >
                              <Link
                                to={routes.videoCall}
                                className="btn btn-outline-light"
                              >
                                <i className="bx bx-video" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li className="list-inline-item">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id={`tooltip-${routes.audioCall}`}>
                                  Voice Call
                                </Tooltip>
                              }
                            >
                              <Link
                                to={routes.audioCall}
                                className="btn btn-outline-light"
                              >
                                <i className="bx bx-phone" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li className="list-inline-item dream_profile_menu">
                            <Link
                              to="#"
                              className="btn btn-outline-light not-chat-user"
                              onClick={handleAddVisible}
                            >
                              <i className="bx bx-info-circle" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <Link
                              className="btn btn-outline-light no-bg"
                              to="#"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bx bx-dots-vertical-rounded" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              <Link onClick={closeSpeConversation} to="#" className="dropdown-item ">
                                <span>
                                  <i className="bx bx-x" />
                                </span>
                                Close Chat{" "}
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-volume-mute" />
                                </span>
                                Mute Notification
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-time-five" />
                                </span>
                                Disappearing Message
                              </Link>
                              <Link to="#" onClick={() => clearChat(conversationId)} className="dropdown-item">
                                <span>
                                  <i className="bx bx-brush-alt" />
                                </span>
                                Clear Message
                              </Link>
                              <Link to="#" onClick={() => deleteChat(conversationId)} className="dropdown-item">
                                <span>
                                  <i className="bx bx-trash-alt" />
                                </span>
                                Delete Chat
                              </Link>
                              <button disabled={otherUser.is_reported} onClick={() => handleReportUser(otherUser.id)} className="dropdown-item">

                                {
                                  otherUser.is_reported ? (<span className="text-danger">
                                    <i className="bx bx-dislike" />
                                  </span>) : (<span>
                                    <i className="bx bx-like" />
                                  </span>)
                                }
                                {otherUser.is_reported ? "reported" : "report"}

                              </button>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-block" />
                                </span>
                                Block
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                      {/* Chat Search */}
                      <div
                        className={
                          isShow ? "chat-search visible-chat" : "chat-search"
                        }
                      >
                        <form>
                          <span
                            className="form-control-feedback"
                            onClick={handleShowClass}
                          >
                            <i className="bx bx-search" />
                          </span>
                          <input
                            type="text"
                            name="chat-search"
                            placeholder="Search Chats"
                            className="form-control"
                          />
                          <div
                            className="close-btn-chat"
                            onClick={handleShowremoveClass}
                          >
                            <i className="fa fa-close" />
                          </div>
                        </form>
                      </div>
                      {/* /Chat Search */}
                    </div>

                    <div className="chat-body">
                      <div className="messages">
                        {
                          loading2 ? <div className="mx-auto"><Spinner /> </div> : (

                            speRoomConv.length == 0 ? <div className="text-center mx-auto mt-5 text-muted" style={{ fontSize: '14PX' }}>
                              Select a User to begin the conversation !
                            </div>
                              : (speRoomConv && speRoomConv.map((m: any) => (
                                m.sender_id === currentUserId ? <> <div className="chats chats-right">
                                  <div className="chat-content">
                                    <div className="chat-profile-name text-end">

                                      <h6>
                                        {m.name}<span>{formatMessageTimeInConversation(m.created_at)}</span>
                                      </h6>
                                      {m.isStar === 1 && (
                                        <span className="reported-label text-danger">⭐</span>
                                      )}
                                      {m.isReported === 1 && (
                                        <span className="reported-label text-danger">⚠</span>
                                      )}
                                      <div className="chat-action-btns ms-3">
                                        <div className="chat-action-col">
                                          <Link
                                            className="#"
                                            to="#"
                                            data-bs-toggle="dropdown"
                                          >
                                            <i className="bx bx-dots-horizontal-rounded" />
                                          </Link>
                                          <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                            <Link
                                              to="#"
                                              className="dropdown-item message-info-left"
                                            >
                                              <span>
                                                <i className="bx bx-info-circle" />
                                              </span>
                                              Message Info{" "}
                                            </Link>
                                            <button
                                              onClick={() => setReplyData({
                                                id: m.id,
                                                text: m.message_text
                                              })}
                                              className="dropdown-item">
                                              <span>
                                                <i className="bx bx-share" />
                                              </span>
                                              Reply
                                            </button>

                                            <Link
                                              to="#"
                                              className="dropdown-item"
                                              data-bs-toggle="modal"
                                              data-bs-target="#forward-message"
                                            >
                                              <span>
                                                <i className="bx bx-reply" />
                                              </span>
                                              Forward
                                            </Link>
                                            {/* <button
                                            onClick={() => toggleStar(m.id, m.isStar)}
                                            className="dropdown-item">
                                            <span>
                                              <i className="bx bx-star" />
                                            </span>
                                            {m.isStar === 1 ? 'UnStar Message' : 'Star Message'}
                                          </button> */}
                                            {/* <Link
                                            to="#"
                                            className="dropdown-item"
                                            data-bs-toggle="modal"
                                            data-bs-target="#report-user"
                                          >
                                            <span>
                                              <i className="bx bx-dislike" />
                                            </span>
                                            Report
                                          </Link> */}
                                            <button

                                              onClick={() => deleteUserMessage(m.id)}
                                              className="dropdown-item"
                                            // data-bs-toggle="modal"
                                            // data-bs-target="#delete-message"
                                            >
                                              <span>
                                                <i className="bx bx-trash" />
                                              </span>
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>


                                    <div className="message-content">

                                      {/* 🟦 Reply Box */}
                                      {m.reply && (
                                        <div
                                          style={{
                                            background: "#f6f7f9",
                                            borderLeft: "4px solid #4a7dff",
                                            padding: "8px 10px",
                                            marginBottom: "10px",
                                            borderRadius: "6px",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                                          }}
                                        >

                                          {/* Reply TEXT */}
                                          {m.reply.message_type === "text" && (
                                            <div style={{ fontSize: "13px", color: "#333", lineHeight: "1.3" }}>
                                              {m.reply.message_text}
                                            </div>
                                          )}

                                          {/* Reply IMAGE */}
                                          {m.reply.message_type === "image" && m.reply.file_url && (
                                            <img
                                              onClick={() => {
                                                setOpen2(true)
                                                setCurrImg(m.reply.file_url)
                                              }}
                                              src={`${Imageurl}/${m.reply.file_url}`}
                                              alt="reply-img"
                                              style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "8px",
                                                marginTop: "5px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          )}

                                          {/* Reply AUDIO */}
                                          {m.reply.message_type === "audio" && m.reply.file_url && (
                                            <audio
                                              controls
                                              preload="auto"
                                              style={{ width: "180px", height: "28px", marginTop: "5px" }}
                                            >
                                              <source
                                                src={`${Audiourl}/${m.reply.file_url}`}
                                                type="audio/webm"
                                              />
                                            </audio>
                                          )}

                                          {/* {replay video} */}
                                          {m.reply.message_type === "video" && m.reply.file_url && (
                                            <video
                                              controls
                                              style={{ width: "200px", borderRadius: "10px" }}
                                            >
                                              <source src={`${Videourl}/${m.reply.file_url}`} type="video/mp4" />
                                            </video>
                                          )}

                                          {/* Reply DOCUMENT */}
                                          {m.reply.message_type === "document" && m.reply.file_url && (
                                            <a
                                              href={`${Documenturl}/${m.reply.file_url}`}
                                              download={m.reply.file_original_name}
                                              target="_blank"
                                              style={{
                                                display: "inline-block",
                                                marginTop: "4px",
                                                padding: "6px 10px",
                                                background: "#ececec",
                                                borderRadius: "4px",
                                                fontSize: "13px",
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              📄 {m.reply.message_text || "Document"}
                                            </a>
                                          )}



                                        </div>
                                      )}

                                      {/* 🟩 MAIN MESSAGE */}

                                      {/* Main TEXT */}
                                      {m.message_type === "text" && (
                                        urlRegex.test(m.message_text) ? (
                                          <a
                                            href={m.message_text}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: "14px", lineHeight: "1.4" }}
                                          >
                                            {m.message_text}
                                          </a>
                                        ) : (
                                          <span style={{ fontSize: "14px", lineHeight: "1.4" }}>
                                            {m.message_text}
                                          </span>
                                        )
                                      )}


                                      {/* Main IMAGE */}
                                      {m.message_type === "image" && m.file_url && (
                                        <img
                                          onClick={() => {
                                            setOpen2(true)
                                            setCurrImg(m.file_url)
                                          }}
                                          src={`${Imageurl}/${m.file_url}`}
                                          alt="msg-img"
                                          style={{
                                            width: "220px",
                                            borderRadius: "10px",
                                            marginTop: "3px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}

                                      {/* Main AUDIO */}
                                      {m.message_type === "audio" && m.file_url && (
                                        <audio
                                          controls
                                          preload="auto"
                                          style={{
                                            width: "220px",
                                            height: "32px",
                                            marginTop: "3px",
                                            display: "block",
                                          }}
                                        >
                                          <source src={`${Audiourl}/${m.file_url}`} type="audio/webm" />
                                        </audio>
                                      )}

                                      {/* Main DOCUMENT */}
                                      {m.message_type === "document" && m.file_url && (
                                        <a
                                          href={`${Documenturl}/${m.file_url}`}
                                          download={m.file_original_name}
                                          target="_blank"
                                          style={{
                                            display: "inline-block",
                                            padding: "7px 10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            background: "#f2f2f2",
                                            cursor: "pointer",
                                          }}
                                        >
                                          📄 {m.file_original_name}
                                        </a>
                                      )}

                                      {m.message_type === "video" && m.file_url && (
                                        <video
                                          controls
                                          style={{ width: "250px", borderRadius: "10px" }}
                                        >
                                          <source src={`${Videourl}/${m.file_url}`} type="video/mp4" />
                                        </video>
                                      )}

                                      {/* 🟨 Reaction UI */}
                                      <div className="emoj-group rig-emoji-group me-3 sm:me-5">
                                        <ul>
                                          <li className="emoj-action">
                                            <Link to="#" onClick={() => setShowEmoji(!showEmoji)}>
                                              <i className="bx bx-smile" />
                                            </Link>

                                            {showEmoji && (
                                              <div
                                                className="emoj-group-list d-block"
                                                style={{ marginTop: "5px" }}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: "6px",
                                                    padding: "6px 10px",
                                                    background: "white",
                                                    borderRadius: "50px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                                  }}
                                                >
                                                  {["😂", "❤️", "👍", "😢", "🔥", "😍", "👏"].map((em) => (
                                                    <span
                                                      key={em}
                                                      onClick={() => toggleReaction(m.id, m.reaction, em)}
                                                      style={{
                                                        fontSize: "18px",
                                                        cursor: "pointer",
                                                        padding: "5px",
                                                        borderRadius: "50%",
                                                        transition: "transform 0.2s",
                                                      }}
                                                      onMouseEnter={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1.4)")
                                                      }
                                                      onMouseLeave={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1)")
                                                      }
                                                    >
                                                      {em}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </li>

                                          <li>
                                            <Link
                                              to="#"
                                              onClick={() =>
                                                setReplyData({
                                                  id: m.id,
                                                  text: m.message_text,

                                                })
                                              }
                                            >
                                              <i className="bx bx-share" />
                                            </Link>
                                          </li>
                                        </ul>

                                      </div>
                                    </div>




                                    {Array.isArray(m.reaction) && m.reaction.length > 0 && (
                                      <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                                        {m.reaction.map((reaction: any, index: any) => (
                                          <span
                                            key={`${reaction.userId}-${index}`}
                                            style={{
                                              fontSize: "18px",
                                              padding: "1px",
                                              borderRadius: "6px",
                                              transition: "transform 0.15s ease",
                                              cursor: "default"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                          >
                                            {reaction.emoji}
                                          </span>
                                        ))}
                                      </div>
                                    )}


                                  </div>

                                  <div className="chat-avatar">
                                    {
                                      m.user_img ? (<img
                                        src={`${Imageurl}/${m.user_img}`}
                                        className="rounded-circle dreams_chat"
                                        alt="image"
                                      />) : (
                                        <ImageWithBasePath
                                          src="assets/img/profiles/avatar-02.jpg"
                                          className="rounded-circle dreams_chat"
                                          alt="image"
                                        />)
                                    }
                                  </div>

                                </div></> : <><div className="chats">
                                  <div className="chat-avatar">

                                    {
                                      m.user_img ? (<img
                                        src={`${Imageurl}/${m.user_img}`}
                                        className="rounded-circle dreams_chat"
                                        alt="image"
                                      />) : (
                                        <ImageWithBasePath
                                          src="assets/img/profiles/avatar-02.jpg"
                                          className="rounded-circle dreams_chat"
                                          alt="image"
                                        />)
                                    }


                                  </div>
                                  <div className="chat-content">
                                    <div className="chat-profile-name">

                                      <h6>
                                        {m.name}<span>{formatMessageTimeInConversation(m.created_at)}</span>
                                      </h6>
                                      {m.isStar === 1 && (
                                        <span className="reported-label text-danger">⭐</span>
                                      )}

                                      {m.isReported === 1 && (
                                        <span className="reported-label text-danger">⚠</span>
                                      )}
                                      <div className="chat-action-btns ms-3">
                                        <div className="chat-action-col">
                                          <Link
                                            className="#"
                                            to="#"
                                            data-bs-toggle="dropdown"
                                          >
                                            <i className="bx bx-dots-horizontal-rounded" />
                                          </Link>
                                          <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                            <Link
                                              to="#"
                                              className="dropdown-item message-info-left"
                                            >
                                              <span>
                                                <i className="bx bx-info-circle" />
                                              </span>
                                              Message Info{" "}
                                            </Link>
                                            <button
                                              onClick={() => setReplyData({
                                                id: m.id,
                                                text: m.message_text
                                              })}
                                              className="dropdown-item">
                                              <span>
                                                <i className="bx bx-share" />
                                              </span>
                                              Reply
                                            </button>

                                            <Link
                                              to="#"
                                              className="dropdown-item"
                                              data-bs-toggle="modal"
                                              data-bs-target="#forward-message"
                                            >
                                              <span>
                                                <i className="bx bx-reply" />
                                              </span>
                                              Forward
                                            </Link>
                                            <button
                                              onClick={() => toggleStar(m.id, m.isStar)}
                                              className="dropdown-item">
                                              <span>
                                                <i className="bx bx-star" />
                                              </span>
                                              {m.isStar === 1 ? 'UnStar Message' : 'Star Message'}
                                            </button>
                                            <button
                                              onClick={() => toggleReport(m.id, m.isReported)}
                                              className="dropdown-item"
                                              data-bs-toggle="modal"
                                              data-bs-target="#report-user"
                                            >
                                              <span>
                                                <i className="bx bx-dislike" />
                                              </span>
                                              {m.isReported ? "Unreport" : "Report"}
                                            </button>
                                            {/* <Link
                                            to="#"
                                            className="dropdown-item"
                                            data-bs-toggle="modal"
                                            data-bs-target="#delete-message"
                                          >
                                            <span>
                                              <i className="bx bx-trash" />
                                            </span>
                                            Delete
                                          </Link> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="message-content">

                                      {/* 🟦 Reply Box */}
                                      {m.reply && (
                                        <div
                                          style={{
                                            background: "#f6f7f9",
                                            borderLeft: "4px solid #4a7dff",
                                            padding: "8px 10px",
                                            marginBottom: "10px",
                                            borderRadius: "6px",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                                          }}
                                        >

                                          {/* Reply TEXT */}
                                          {m.reply.message_type === "text" && (
                                            <div style={{ fontSize: "13px", color: "#333", lineHeight: "1.3" }}>
                                              {m.reply.message_text}
                                            </div>
                                          )}

                                          {/* Reply IMAGE */}
                                          {m.reply.message_type === "image" && m.reply.file_url && (
                                            <img
                                              onClick={() => {
                                                setOpen2(true)
                                                setCurrImg(m.reply.file_url)
                                              }}
                                              src={`${Imageurl}/${m.reply.file_url}`}
                                              alt="reply-img"
                                              style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "8px",
                                                marginTop: "5px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          )}

                                          {/* Reply AUDIO */}
                                          {m.reply.message_type === "audio" && m.reply.file_url && (
                                            <audio
                                              controls
                                              preload="auto"
                                              style={{ width: "180px", height: "28px", marginTop: "5px" }}
                                            >
                                              <source
                                                src={`${Audiourl}/${m.reply.file_url}`}
                                                type="audio/webm"
                                              />
                                            </audio>
                                          )}

                                          {/* {replay video} */}
                                          {m.reply.message_type === "video" && m.reply.file_url && (
                                            <video
                                              controls
                                              style={{ width: "200px", borderRadius: "10px" }}
                                            >
                                              <source src={`${Videourl}/${m.reply.file_url}`} type="video/mp4" />
                                            </video>
                                          )}

                                          {/* Reply DOCUMENT */}
                                          {m.reply.message_type === "document" && m.reply.file_url && (
                                            <a
                                              href={`${Documenturl}/${m.reply.file_url}`}
                                              download={m.reply.file_original_name}
                                              target="_blank"
                                              style={{
                                                display: "inline-block",
                                                marginTop: "4px",
                                                padding: "6px 10px",
                                                background: "#ececec",
                                                borderRadius: "4px",
                                                fontSize: "13px",
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              📄 {m.reply.message_text || "Document"}
                                            </a>
                                          )}


                                        </div>
                                      )}

                                      {/* 🟩 MAIN MESSAGE */}

                                      {/* Main TEXT */}
                                      {
                                        m.message_type === "text" && (
                                          urlRegex.test(m.message_text)
                                            ? (
                                              <a
                                                href={m.message_text}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: "14px", lineHeight: "1.4" }}
                                              >
                                                {m.message_text}
                                              </a>
                                            ) : (
                                              <span style={{ fontSize: "14px", lineHeight: "1.4" }}>
                                                {m.message_text}
                                              </span>
                                            )
                                        )}


                                      {/* Main IMAGE */}
                                      {m.message_type === "image" && m.file_url && (
                                        <img
                                          onClick={() => {
                                            setOpen2(true)
                                            setCurrImg(m.file_url)
                                          }}
                                          src={`${Imageurl}/${m.file_url}`}
                                          alt="msg-img"
                                          style={{
                                            width: "220px",
                                            borderRadius: "10px",
                                            marginTop: "3px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}

                                      {/* Main AUDIO */}
                                      {m.message_type === "audio" && m.file_url && (
                                        <audio
                                          controls
                                          preload="auto"
                                          style={{
                                            width: "220px",
                                            height: "32px",
                                            marginTop: "3px",
                                            display: "block",
                                          }}
                                        >
                                          <source src={`${Audiourl}/${m.file_url}`} type="audio/webm" />
                                        </audio>
                                      )}

                                      {/* Main DOCUMENT */}
                                      {m.message_type === "document" && m.file_url && (
                                        <a
                                          href={`${Documenturl}/${m.file_url}`}
                                          download={m.file_original_name}
                                          target="_blank"
                                          style={{
                                            display: "inline-block",
                                            padding: "7px 10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            background: "#f2f2f2",
                                            cursor: "pointer",
                                          }}
                                        >
                                          📄 {m.file_original_name}
                                        </a>
                                      )}

                                      {m.message_type === "video" && m.file_url && (
                                        <video
                                          controls
                                          style={{ width: "250px", borderRadius: "10px" }}
                                        >
                                          <source src={`${Videourl}/${m.file_url}`} type="video/mp4" />
                                        </video>
                                      )}


                                      {/* 🟨 Reaction UI */}
                                      <div className="emoj-group ">

                                        <ul>
                                          <li className="emoj-action">
                                            <Link to="#" onClick={() => setShowEmoji(!showEmoji)}>
                                              <i className="bx bx-smile" />
                                            </Link>

                                            {showEmoji && (
                                              <div
                                                className="emoj-group-list d-block"
                                                style={{ marginTop: "5px" }}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: "6px",
                                                    padding: "6px 10px",
                                                    background: "white",
                                                    borderRadius: "50px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                                  }}
                                                >
                                                  {["😂", "❤️", "👍", "😢", "🔥", "😍", "👏"].map((em) => (
                                                    <span
                                                      key={em}
                                                      onClick={() => toggleReaction(m.id, m.reaction, em)}
                                                      style={{
                                                        fontSize: "18px",
                                                        cursor: "pointer",
                                                        padding: "5px",
                                                        borderRadius: "50%",
                                                        transition: "transform 0.2s",
                                                      }}
                                                      onMouseEnter={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1.4)")
                                                      }
                                                      onMouseLeave={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1)")
                                                      }
                                                    >
                                                      {em}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </li>

                                          <li>
                                            <Link
                                              to="#"
                                              onClick={() =>
                                                setReplyData({
                                                  id: m.id,
                                                  text: m.message_text,

                                                })
                                              }
                                            >
                                              <i className="bx bx-share" />
                                            </Link>
                                          </li>
                                        </ul>

                                      </div>
                                    </div>
                                    {Array.isArray(m.reaction) && m.reaction.length > 0 && (
                                      <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                                        {m.reaction.map((reaction: any, index: any) => (
                                          <span
                                            key={`${reaction.userId}-${index}`}
                                            style={{
                                              fontSize: "18px",
                                              padding: "1px",
                                              borderRadius: "6px",
                                              transition: "transform 0.15s ease",
                                              cursor: "default"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                          >
                                            {reaction.emoji}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                </>

                              )))
                          )
                        }


                        {/* <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Hello <Link to="#">@Alex</Link> Thank you for the
                              beautiful web design ahead schedule.
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chat-line">
                          <span className="chat-date">Today, July 24</span>
                        </div>
                        <div className="chats chats-right">
                          <div className="chat-content">
                            <div className="chat-profile-name text-end">
                              <h6>
                                Alex Smith<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content ">
                              <div className="emoj-group rig-emoji-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="chat-voice-group">
                                <ul>
                                  <li>
                                    <Link to="#">
                                      <span>
                                        <ImageWithBasePath
                                          src="assets/img/icons/play-01.svg"
                                          alt="image"
                                        />
                                      </span>
                                    </Link>
                                  </li>
                                  <li>
                                    <ImageWithBasePath
                                      src="assets/img/icons/voice.svg"
                                      alt="image"
                                    />
                                  </li>
                                  <li>0:05</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-10.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                                <span className="check-star">
                                  <i className="bx bxs-star" />
                                </span>
                              </h6>
                              <div className="chat-action-btns ms-2">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bxs-star" />
                                      </span>
                                      Unstar Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content award-link chat-award-link">
                              <Link to="#" className="mb-1">
                                https://www.youtube.com/watch?v=GCmL3mS0Psk
                              </Link>
                              <ImageWithBasePath
                                src="assets/img/sending-img.png"
                                alt="img"
                              />
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chats chats-right">
                          <div className="chat-content">
                            <div className="chat-profile-name justify-content-end">
                              <h6>
                                Alex Smith<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content fancy-msg-box">
                              <div className="emoj-group wrap-emoji-group ">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="download-col">
                                <ul className="nav mb-0">
                                  <Lightbox
                                    open={open1}
                                    close={() => setOpen1(false)}
                                    slides={[
                                      {
                                        src: "/assets/img/media/media-02.jpg",
                                      },
                                      {
                                        src: "/assets/img/media/media-03.jpg",
                                      },
                                      {
                                        src: "/assets/img/media/media-01.jpg",
                                      },
                                    ]}
                                  />
                                  <li>
                                    <div className="image-download-col">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="#"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath
                                          src="assets/img/media/media-02.jpg"
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="image-download-col ">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="#"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath
                                          src="assets/img/media/media-03.jpg"
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="image-download-col image-not-download">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="assets/img/media/media-01.jpg"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath src="assets/img/media/media-01.jpg" />
                                        <span>10+</span>
                                      </Link>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-10.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content review-files">
                              <p className="d-flex align-items-center">
                                Please check and review the files
                                <span className="ms-1 d-flex">
                                  <ImageWithBasePath
                                    src="assets/img/icons/smile-chat.svg"
                                    alt="Icon"
                                  />
                                </span>
                              </p>
                              <div className="file-download d-flex align-items-center mb-0">
                                <div className="file-type d-flex align-items-center justify-content-center me-2">
                                  <i className="bx bxs-file-doc" />
                                </div>
                                <div className="file-details">
                                  <span className="file-name">
                                    Landing_page_V1.doc
                                  </span>
                                  <ul>
                                    <li>80 Bytes</li>
                                    <li>
                                      <Link to="#">Download</Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="like-chat-grp">
                              <ul>
                                <li className="like-chat">
                                  <Link to="#">
                                    2
                                    <ImageWithBasePath
                                      src="assets/img/icons/like.svg"
                                      alt="Icon"
                                    />
                                  </Link>
                                </li>
                                <li className="comment-chat">
                                  <Link to="#">
                                    2
                                    <ImageWithBasePath
                                      src="assets/img/icons/heart.svg"
                                      alt="Icon"
                                    />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Thank you for your support
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${showEmoji ? "d-block" : ""
                                        } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content chat-cont-type">
                            <div className="chat-profile-name chat-type-wrapper">
                              <p>Mark Villiams Typing...</p>
                            </div>
                          </div>
                        </div>
                        <div className="chats forward-chat-msg">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Thank you for your support
                            </div>
                          </div>
                        </div> */}

                      </div>
                    </div>
                    {replyData.id && (
                      <div
                        className="reply-box"
                        style={{
                          background: "#ffffff",
                          padding: "10px 12px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          borderLeft: "4px solid #4a6cf7",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          marginBottom: "8px",
                          gap: "10px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#4a6cf7",
                              display: "block",
                              marginBottom: "2px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Replying to
                          </span>

                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: "#333",
                              fontWeight: "500",
                              lineHeight: "18px",
                              wordBreak: "break-word",
                            }}
                          >
                            {replyData.text.length > 80
                              ? replyData.text.substring(0, 80) + "..."
                              : replyData.text}
                          </p>
                        </div>

                        <button
                          onClick={() => setReplyData({ id: null, text: "" })}
                          style={{
                            background: "#eef2ff",
                            border: "none",
                            width: "26px",
                            height: "26px",
                            borderRadius: "6px",
                            fontSize: "18px",
                            lineHeight: "18px",
                            cursor: "pointer",
                            color: "#4a6cf7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "0.2s",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </PerfectScrollbar>

                </div>

                <div
                  // className="chat-footer"
                  style={{
                    borderRadius: "12px",
                    padding: "10px",
                    borderTop: "1px solid #e5e5e5",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >


                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Left dropdown */}
                    <div
                      className="chat-action-col"
                      style={{
                        position: "relative",
                      }}
                    >
                      <Link
                        className="action-circle"
                        to="#"
                        data-bs-toggle="dropdown"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#333",
                        }}
                      >
                        <MdOutlineAttachFile />
                      </Link>

                      <div
                        className="dropdown-menu dropdown-menu-start"
                        style={{
                          position: "absolute",
                          top: "40px",
                          left: "0",
                          background: "#fff",
                          padding: "8px",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                      >
                        <div
                          className="dropdown-item"
                          style={{
                            padding: "6px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            borderRadius: "6px",
                          }}
                        >
                          <i className="bx bx-image" style={{ fontSize: "18px" }} />
                          <label htmlFor="img" style={{ cursor: "pointer", margin: 0 }}>
                            Send File
                          </label>
                          <input
                            type="file"
                            name="img"
                            id="img"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx,.zip,.txt"
                            onChange={handleFileChange}
                            className="d-none"
                          />
                        </div>


                      </div>
                    </div>

                    {/* Emoji Button */}
                    <div className="smile-foot">
                      <Link
                        to="#"
                        className="action-circle"
                        onClick={() => setShowPicker(!showPicker)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#333",
                        }}
                      >
                        <i className="bx bx-smile" />
                      </Link>
                      {showPicker && (
                        <div ref={pickerRef} style={{ position: "absolute", bottom: "100px", right: "100px" }}>
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                    {/* Voice recorder */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {!isRecording ? (
                        <CiMicrophoneOn
                          size={26}
                          onClick={startRecording}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <>
                          {!isPaused ? (
                            <CiPause1 size={26} onClick={pauseRecording} style={{ cursor: "pointer" }} />
                          ) : (
                            <GrResume size={26} onClick={resumeRecording} style={{ cursor: "pointer" }} />
                          )}

                          <FaStopCircle
                            onClick={stopRecording}
                            size={26}
                            style={{ cursor: "pointer" }}
                          />
                        </>
                      )}

                      {isRecording && (
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#555" }}>
                          {formatTime(recordTime)}
                        </p>
                      )}
                    </div>

                    {/* Input */}
                    <input
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      type="text"
                      placeholder="Type your message..."
                      style={{
                        flex: 1,
                        height: "40px",
                        borderRadius: "20px",
                        border: "1px solid #ccc",
                        padding: "0 14px",
                        fontSize: "14px",
                      }}
                    />

                    {/* Send Btn */}
                    <button
                      className="btn send-btn"
                      type="submit"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#4a6cf7",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {loading3 ? (
                        <i className="bx-loader-alt bx-spin" />
                      ) : (
                        <i className="bx bx-paper-plane" />
                      )}
                    </button>
                  </form>
                </div>

              </div>
              {/* /Chat */}
              {/* Right sidebar */}
              <div
                className={
                  isVisible
                    ? "right-sidebar right_sidebar_profile right-side-contact show-right-sidebar"
                    : "right-sidebar right_sidebar_profile right-side-contact hide-right-sidebar"
                }
                id="middle1"
              >
                <div className="right-sidebar-wrap active">
                  <div className="slimscroll">
                    <PerfectScrollbar>
                      <div className="left-chat-title d-flex justify-content-between align-items-center border-bottom-0">
                        <div className="fav-title mb-0">
                          <h6>Contact Info</h6>
                        </div>
                        <div className="contact-close_call text-end">
                          <Link to="#" className="close_profile close-star">
                            <i className="bx bxs-star" />
                          </Link>
                          <Link
                            to="#"
                            className="close_profile close-trash"
                            onClick={handleRemoveVisible}
                          >
                            <i className="bx bx-trash" />
                          </Link>
                        </div>
                      </div>
                      <div className="sidebar-body">
                        <div className="mt-0 right_sidebar_logo">
                          <div className="text-center right-sidebar-profile">
                            <figure className={`avatar avatar-xl mb-3 ${otherUser.is_online ? 'avatar-online' : ''}`}>

                              {
                                otherUser.user_img ? (<img
                                  onClick={() => {
                                    setOpen2(true)
                                    setCurrImg(otherUser.user_img)
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  src={`${Imageurl}/${otherUser.user_img}`}
                                  className="rounded-circle"
                                  alt="image"
                                />) : (<ImageWithBasePath

                                  src="assets/img/profiles/avatar-02.jpg"
                                  className="rounded-circle"
                                  alt="image"
                                />)
                              }


                            </figure>
                            <h5 className="profile-name">{otherUser.name}</h5>
                            <div className="last-seen-profile">
                              <span>{otherUser?.is_online === 1
                                ? "Online"
                                : otherUser?.last_seen
                                  ? `Last Seen ${formatMessageTimeInConversation(otherUser.last_seen)}`
                                  : "Last Seen: Just now"}</span>
                            </div>
                            <div className="chat-options chat-option-profile">
                              <ul className="list-inline">
                                <li className="list-inline-item">
                                  <Link
                                    to="audio-call"
                                    className="btn btn-outline-light "
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Voice Call"
                                  >
                                    <i className="bx bx-phone" />
                                  </Link>
                                </li>
                                <li className="list-inline-item ">
                                  <Link
                                    to="video-call"
                                    className="btn btn-outline-light profile-open"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Video Call"
                                  >
                                    <i className="bx bx-video" />
                                  </Link>
                                </li>
                                <li className="list-inline-item">
                                  <Link
                                    to="#"
                                    className="btn btn-outline-light"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Chat"
                                  >
                                    <i className="bx bx-message-square-dots" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-member-details">
                            <div className="member-details">
                              <ul>

                                <li>
                                  <h6>Phone</h6>
                                  <span>{otherUser.mobile}</span>
                                </li>
                                <li>
                                  <h6>Email Address</h6>
                                  <span>{otherUser.email}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="right-sidebar-head share-media">
                        <div className="share-media-blk">
                          <h5>Shared Media</h5>
                          <Link to="#">View All</Link>
                        </div>
                        <div className="about-media-tabs">
                          <nav>
                            <div className="nav nav-tabs " id="nav-tab">
                              <Link
                                className="nav-item nav-link active"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                to="#info"
                              >
                                Photos
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab1"
                                data-bs-toggle="tab"
                                to="#Participants"
                              >
                                Videos
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab2"
                                data-bs-toggle="tab"
                                to="#media"
                              >
                                File
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab3"
                                data-bs-toggle="tab"
                                to="#link"
                              >
                                Link
                              </Link>
                            </div>
                          </nav>
                          <div className="tab-content pt-0" id="nav-tabContent">

                            <div
                              className="tab-pane fade show active"
                              id="info"
                            >
                              <ul className="nav share-media-img mb-0">
                                <Lightbox
                                  open={open2}
                                  close={() => {
                                    setOpen2(false)
                                    setCurrImg(null)
                                  }}
                                  slides={[
                                    {
                                      src: `${Imageurl}/${currImg}`
                                    },
                                    // {
                                    //   src: "/assets/img/media/media-02.jpg",
                                    // },
                                    // {
                                    //   src: "/assets/img/media/media-03.jpg",
                                    // },
                                    // {
                                    //   src: "/assets/img/media/media-04.jpg",
                                    // },
                                    // {
                                    //   src: "/assets/img/media/media-02.jpg",
                                    // },
                                  ]}
                                />

                                {
                                  speRoomConv && speRoomConv.map((m: any) => (
                                    m.message_type === 'image' && (<li key={m.id}>
                                      <Link
                                        onClick={() => {
                                          setOpen2(true)
                                          setCurrImg(m.file_url)
                                        }}
                                        to="#"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <img
                                          src={`${Imageurl}/${m.file_url}`}
                                          alt="msg-img"
                                          style={{
                                            // width: "220px",
                                            borderRadius: "10px",
                                            marginTop: "3px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </Link>
                                    </li>)

                                  ))
                                }
                              </ul>
                            </div>

                            <div className="tab-pane fade" id="Participants">
                              <ul className="nav share-media-img mb-0">

                                {
                                  speRoomConv && speRoomConv.map((m: any) => (
                                    m.message_type === 'video' && (<li key={m.id}>
                                      <Link to="#">
                                        <video
                                          controls
                                          style={{ width: "180px", borderRadius: "10px" }}
                                        >
                                          <source src={`${Videourl}/${m.file_url}`} type="video/mp4" />
                                        </video>
                                        {/* <span>
                                          <i className="bx bx-play-circle" />
                                        </span> */}
                                      </Link>

                                    </li>)

                                  ))
                                }


                              </ul>
                            </div>

                            <div className="tab-pane fade" id="media">
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file-doc" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>Landing_page_V1.doc</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file-pdf" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>Design Guideless.pdf</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>sample site.txt</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                            </div>

                            <div className="tab-pane fade" id="link">

                              {
                                speRoomConv && speRoomConv.map((m: any) => (
                                  (
                                    m.message_type === "text" && urlRegex.test(m.message_text)
                                  ) && (
                                    <div className="media-link-grp" key={m.id}>

                                      <div className="link-img">
                                        <Link to="#">
                                          <ImageWithBasePath
                                             width={25}
                                            src="assets/img/media/media-link-01.jpg"
                                            alt="Img"
                                          />
                                        </Link>
                                      </div>

                                      <div className="media-link-detail">
                                        <a
                                          href={m.message_text}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ fontSize: "14px", lineHeight: "1.4" }}
                                        >
                                          {m.message_text}
                                        </a>
                                      </div>

                                    </div>
                                  )
                                ))
                              }


                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="chat-message-grp">
                        <ul>
                          <li>
                            <Link to="#" className="star-message-left">
                              <div className="stared-group">
                                <span className="star-message">
                                  <i className="bx bx-star" />
                                </span>
                                <h6>Starred Messages</h6>
                              </div>
                              <div className="count-group">
                                <span>{otherUser.starCount}</span>
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="mute-message">
                                  {" "}
                                  <i className="bx bx-microphone-off" />
                                </span>
                                <h6>Mute Notifications</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="block-message">
                                  {" "}
                                  <i className="bx bx-x-circle" />
                                </span>
                                <h6>Block User</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              onClick={(e) => {
                                if (otherUser.is_reported) {
                                  e.preventDefault();
                                  return;
                                }
                                handleReportUser(otherUser.id);
                              }}
                              style={{
                                pointerEvents: otherUser.is_reported ? "none" : "auto",
                                opacity: otherUser.is_reported ? 0.6 : 1,
                                cursor: otherUser.is_reported ? "not-allowed" : "pointer",
                              }}
                            >
                              <div className="stared-group">
                                <span
                                  className={`report-message ${otherUser.is_reported ? "text-danger" : ""
                                    }`}
                                >
                                  <i className="bx bx-user-x" />
                                </span>
                                <h6>{otherUser.is_reported ? "Reported" : "Report User"}</h6>
                              </div>

                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>

                          </li>
                          <li>
                            <Link to="#" onClick={() => deleteChat(conversationId)}>
                              <div className="stared-group">
                                <span className="delete-message">
                                  {" "}
                                  <i className="bx bx-trash-alt" />
                                </span>
                                <h6>Delete Chat</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </div>
                </div>
              </div>
              {/* Right sidebar */}
            </div>
          </div>

          <div>
            {/* Add Transfer */}
            <div className="modal fade" id="add-units">
              <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
                <div className="modal-content">
                  <div className="page-wrapper-new p-0">
                    <div className="content">
                      <div className="modal-header border-0 custom-modal-header">
                        <div className="page-title">
                          <h4>Add Transfer</h4>
                        </div>
                        <button
                          type="button"
                          className="close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body custom-modal-body">
                        <div className="row">
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="input-blocks">
                              <label>Date</label>
                              <div className="input-groupicon calender-input">
                                <i
                                  data-feather="calendar"
                                  className="info-img"
                                />
                                <input
                                  type="text"
                                  className="datetimepicker form-control"
                                  placeholder="Select Date"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="input-blocks">
                              <label>From</label>
                              <select className="select">
                                <option>Choose</option>
                                <option>Store 1</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="input-blocks">
                              <label>To</label>
                              <select className="select">
                                <option>Choose</option>
                                <option>Store 2</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="input-blocks">
                              <label>Product Name</label>
                              <input
                                type="text"
                                placeholder="Please type product code and select"
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="modal-body-table">
                              <div className="table-responsive">
                                <table className="table  datanew">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Qty</th>
                                      <th>Purchase Price($)</th>
                                      <th>Discount($)</th>
                                      <th>Tax(%)</th>
                                      <th>Tax Amount($)</th>
                                      <th>Unit Cost($)</th>
                                      <th>Total Cost(%)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                      <td className="p-5" />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="input-blocks">
                                <label>Order Tax</label>
                                <input type="text" defaultValue={0} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="input-blocks">
                                <label>Discount</label>
                                <input type="text" defaultValue={0} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="input-blocks">
                                <label>Shipping</label>
                                <input type="text" defaultValue={0} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="input-blocks">
                                <label>Status</label>
                                <select className="select">
                                  <option>Choose</option>
                                  <option>Sent</option>
                                  <option>Pending</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-blocks summer-description-box">
                            <label>Notes</label>
                            <div id="summernote" />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="modal-footer-btn">
                            <Link
                              to="#"
                              className="btn btn-cancel me-2"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </Link>
                            <Link to="#" className="btn btn-submit">
                              Submit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Add Transfer */}
            {/* Edit Transfer */}
            <div className="modal fade" id="edit-units">
              <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
                <div className="modal-content">
                  <div className="page-wrapper-new p-0">
                    <div className="content">
                      <div className="modal-header border-0 custom-modal-header">
                        <div className="page-title">
                          <h4>Edit Transfer</h4>
                        </div>
                        <button
                          type="button"
                          className="close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body custom-modal-body">
                        <div>
                          <div>
                            <div className="row">
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="input-blocks">
                                  <label>Date</label>
                                  <div className="input-groupicon calender-input">
                                    <i
                                      data-feather="calendar"
                                      className="info-img"
                                    />
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      placeholder="Select Date"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="input-blocks">
                                  <label>From</label>
                                  <select className="select">
                                    <option>Store 1</option>
                                    <option>Choose</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="input-blocks">
                                  <label>To</label>
                                  <select className="select">
                                    <option>Store 2</option>
                                    <option>Choose</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-12 col-sm-6 col-12">
                                <div className="input-blocks">
                                  <label>Product</label>
                                  <div className="input-groupicon">
                                    <input
                                      type="text"
                                      placeholder="Scan/Search Product by code and select..."
                                    />
                                    <div className="addonset">
                                      <ImageWithBasePath
                                        src="assets/img/icons/scanners.svg"
                                        alt="img"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="modal-body-table total-orders">
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>Product Name</th>
                                          <th>QTY</th>
                                          <th>Purchase Price($) </th>
                                          <th>Discount($) </th>
                                          <th>Tax %</th>
                                          <th>Tax Amount($)</th>
                                          <th className="text-end">
                                            Unit Cost($)
                                          </th>
                                          <th className="text-end">
                                            Total Cost ($){" "}
                                          </th>
                                          <th />
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <div className="productimgname">
                                              <Link
                                                to="#"
                                                className="product-img stock-img"
                                              >
                                                <ImageWithBasePath
                                                  src="assets/img/products/stock-img-02.png"
                                                  alt="product"
                                                />
                                              </Link>
                                              <Link to="#">Nike Jordan</Link>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="product-quantity">
                                              <span className="quantity-btn">
                                                +
                                                <i
                                                  data-feather="plus-circle"
                                                  className="plus-circle"
                                                />
                                              </span>
                                              <input
                                                type="text"
                                                className="quntity-input"
                                                defaultValue={10}
                                              />
                                              <span className="quantity-btn">
                                                <i
                                                  data-feather="minus-circle"
                                                  className="feather-search"
                                                />
                                              </span>
                                            </div>
                                          </td>
                                          <td>2000</td>
                                          <td>500.00</td>
                                          <td>0.00</td>
                                          <td>0.00</td>
                                          <td className="text-end">0.00</td>
                                          <td className="text-end">1500</td>
                                          <td>
                                            <Link to="#" className="delete-set">
                                              <ImageWithBasePath
                                                src="assets/img/icons/delete.svg"
                                                alt="svg"
                                              />
                                            </Link>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 float-md-right">
                                <div className="total-order">
                                  <ul>
                                    <li>
                                      <h4>Order Tax</h4>
                                      <h5>$ 0.00</h5>
                                    </li>
                                    <li>
                                      <h4>Discount</h4>
                                      <h5>$ 0.00</h5>
                                    </li>
                                    <li>
                                      <h4>Shipping</h4>
                                      <h5>$ 0.00</h5>
                                    </li>
                                    <li className="total">
                                      <h4>Grand Total</h4>
                                      <h5>$1500.00</h5>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-3 col-sm-6 col-12">
                                <div className="input-blocks">
                                  <label>Order Tax</label>
                                  <input type="text" defaultValue={0} />
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 col-12">
                                <div className="input-blocks">
                                  <label>Discount</label>
                                  <input type="text" defaultValue={0} />
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 col-12">
                                <div className="input-blocks">
                                  <label>Shipping</label>
                                  <input type="text" defaultValue={0} />
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 col-12">
                                <div className="input-blocks">
                                  <label>Status</label>
                                  <select className="select">
                                    <option>Sent</option>
                                    <option>Pending</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-blocks summer-description-box">
                            <label>Description</label>
                            <div id="summernote2">
                              <p>
                                These shoes are made with the highest quality
                                materials.{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="modal-footer-btn">
                            <Link
                              to="#"
                              className="btn btn-cancel me-2"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </Link>
                            <Link to="#" className="btn btn-submit">
                              Save Changes
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Edit Transfer */}
            {/* Import Purchase */}
            <div className="modal fade" id="view-notes">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="page-wrapper-new p-0">
                    <div className="content">
                      <div className="modal-header border-0 custom-modal-header">
                        <div className="page-title">
                          <h4>Import Transfer</h4>
                        </div>
                        <button
                          type="button"
                          className="close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body custom-modal-body">
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>From</label>
                              <select className="select">
                                <option>Choose</option>
                                <option>Store 1</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>To</label>
                              <select className="select">
                                <option>Choose</option>
                                <option>Store 2</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Satus</label>
                              <select className="select">
                                <option>Choose</option>
                                <option>Sent</option>
                                <option>Pending</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12 col-sm-6 col-12">
                            <div className="row">
                              <div>
                                {/* <div class="input-blocks download">
                        <Link class="btn btn-submit">Download Sample File</Link>
                      </div> */}
                                <div className="modal-footer-btn download-file">
                                  <Link to="#" className="btn btn-submit">
                                    Download Sample File
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-blocks image-upload-down">
                              <label> Upload CSV File</label>
                              <div className="image-upload download">
                                <input type="file" />
                                <div className="image-uploads">
                                  <ImageWithBasePath
                                    src="assets/img/download-img.png"
                                    alt="img"
                                  />
                                  <h4>
                                    Drag and drop a <span>file to upload</span>
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Shipping</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-blocks summer-description-box transfer">
                            <label>Description</label>
                            <div id="summernote3"></div>
                            <p>Maximum 60 Characters</p>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="modal-footer-btn">
                            <Link
                              to="#"
                              className="btn btn-cancel me-2"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </Link>

                            <Link to="#" className="btn btn-submit">
                              Submit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Import Purchase */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
