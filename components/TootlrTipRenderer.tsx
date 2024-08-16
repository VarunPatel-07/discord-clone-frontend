"use client";
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
function TootlrTipRenderer() {
  return (
    <>
      <ReactTooltip id="Reply-Chat-icon-tooltip" place="top" />
      <ReactTooltip id="Edit-Chat-icon-tooltip" place="top" />
      <ReactTooltip id="Delete-Chat-icon-tooltip" place="top" />
      <ReactTooltip id="mic-icon-tooltip" />
      <ReactTooltip id="setting-tooltip" />
      <ReactTooltip id="Server-name-tooltip" />
      <ReactTooltip id="Create-New-Server-tooltip" />
      <ReactTooltip id="HomePage-tooltip" />
      <ReactTooltip id="Explorer-tooltip" />
      <ReactTooltip id="start-call-screen-mic-icon-tooltip" />
      <ReactTooltip id="start-call-screen-video-icon-tooltip" />
      <ReactTooltip id="start-call-screen-call-icon-tooltip" />
    </>
  );
}

export default TootlrTipRenderer;
