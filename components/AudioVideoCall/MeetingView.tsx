import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
function MeetingView() {
  const [MeetingStatus, setMeetingStatus] = useState("" as string);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setMeetingStatus("Joined"),
  });
  const joinMeeting = () => {
    setMeetingStatus("Joining");
    join();
  };
  return (
    <div>
      {MeetingStatus === "Joined" && (
        <div>
          {Array.from(participants.keys()).map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      )}
      {MeetingStatus === "Joining" && <p>Joining the meeting...</p>}
      {MeetingStatus === "" && (
        <button onClick={joinMeeting}>Join Meeting</button>
      )}
    </div>
  );
}

export default MeetingView;
