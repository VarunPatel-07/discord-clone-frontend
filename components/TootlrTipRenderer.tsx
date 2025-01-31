"use client";
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
function TootlrTipRenderer() {
  return (
    <>
      <ReactTooltip
        id="Reply-Chat-icon-tooltip"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="Edit-Chat-icon-tooltip"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="Delete-Chat-icon-tooltip"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip id="mic-icon-tooltip" style={{ backgroundColor: "white", color: "black" }} opacity={1} />
      <ReactTooltip
        id="setting-tooltip"
        style={{ backgroundColor: "white", color: "black", zIndex: "10" }}
        opacity={1}
      />
      <ReactTooltip id="Server-name-tooltip" style={{ backgroundColor: "white", color: "black" }} opacity={1} />
      <ReactTooltip id="Create-New-Server-tooltip" style={{ backgroundColor: "white", color: "black" }} opacity={1} />
      <ReactTooltip id="HomePage-tooltip" style={{ backgroundColor: "white", color: "black" }} opacity={1} />
      <ReactTooltip id="Explorer-tooltip" style={{ backgroundColor: "white", color: "black" }} opacity={1} />
      <ReactTooltip
        id="start-call-screen-mic-icon-tooltip"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="start-call-screen-video-icon-tooltip"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="start-call-screen-call-icon-tooltip"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip id="End-TheCallButton" style={{ backgroundColor: "white", color: "black" }} opacity={1} />

      <ReactTooltip
        id="edit-channel-tooltip-text"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="delete-channel-tooltip-text"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />

      <ReactTooltip
        id="edit-channel-tooltip-audio"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="delete-channel-tooltip-audio"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />

      <ReactTooltip
        id="edit-channel-tooltip-video"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
      <ReactTooltip
        id="delete-channel-tooltip-video"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />

      <ReactTooltip
        id="general-channel-tooltip"
        place="top"
        style={{ backgroundColor: "white", color: "black" }}
        opacity={1}
      />
    </>
  );
}

export default TootlrTipRenderer;
