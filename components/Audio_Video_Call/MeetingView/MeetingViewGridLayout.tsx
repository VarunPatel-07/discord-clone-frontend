import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useState } from "react";
import ParticipantProfile from "./ParticipantProfile";

function MeetingViewGridLayout() {
  const { join, participants } = useMeeting();
  const [JoinMeetingPopUp, setJoinMeetingPopUp] = useState(true as boolean);
  // Convert the participants map to an array of IDs

  const joinMeeting = () => {
    setJoinMeetingPopUp(false);
    join();
  };

  return (
    <div>
      {JoinMeetingPopUp ? (
        <button onClick={joinMeeting} className="p-[50px]">
          Join
        </button>
      ) : (
        <div>
          {Array.from(participants.keys()).map((participantId) => (
            <ParticipantProfile
              key={participantId}
              participantId={participantId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MeetingViewGridLayout;
