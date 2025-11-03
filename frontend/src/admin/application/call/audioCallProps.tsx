import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface AudioCallPropss {
  roomID: string;
  userName: string;
}

const AudioCallProps: React.FC<AudioCallPropss> = ({ roomID, userName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoInstanceRef = useRef<any>(null);

  useEffect(() => {
    const appID = 1170893203; // ✅ Your Zego App ID
    const serverSecret = "74d1731fd5a6b96b3a72f1c4c0cf4d25"; // ✅ Your Server Secret
    const userID = Date.now().toString(); // ✅ Each user unique ID

    if (zegoInstanceRef.current) return; // Prevent duplicate join

    // ✅ Create Zego token (testing only)
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    // ✅ Create instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zegoInstanceRef.current = zp;

    // ✅ Join the room with all features
    zp.joinRoom({
      container: containerRef.current!,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${window.location.origin}/application/${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, 
      },
      showScreenSharingButton: true, // ✅ allow screen sharing
      showMyCameraToggleButton: true, // ✅ allow turning camera on/off
    //   showMicrophoneToggleButton: true, 
      showTextChat: true, // ✅ in-room text chat
      showUserList: true, // ✅ show participants
      showLayoutButton: true, // ✅ allow grid/speaker view toggle
      showRoomTimer: true, // ✅ show how long the call has been active
      turnOnCameraWhenJoining: false, // start with camera off
      turnOnMicrophoneWhenJoining: true, // mic on initially
      showAudioVideoSettingsButton: true, // ✅ settings popup
      showLeavingView: true, // ✅ leave confirmation dialog
      showPreJoinView: true, // ✅ preview before joining
      layout: "Auto",
      onLeaveRoom: () => {
        console.log("✅ You left the call");
      },
    });

    // ✅ Cleanup on unmount
    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
    };
  }, [roomID, userName]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-12">
                <div
                  ref={containerRef}
                  style={{
                    width: "100%",
                    height: "100vh",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCallProps;
