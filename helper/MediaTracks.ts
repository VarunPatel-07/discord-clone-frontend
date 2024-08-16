import {
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";

export const getAudioMediaTrack = async (selectedAudioDeviseId: string) => {
  try {
    const CustomAudioTracks = await createMicrophoneAudioTrack({
      microphoneId: selectedAudioDeviseId,
    });
    return CustomAudioTracks;
  } catch (error) {
    console.log("Error creating audio track:", error);
  }
};

export const getVideoMediaTrack = async (selectedVideoDeviseId: string) => {
  try {
    const CustomVideoTracks = await createCameraVideoTrack({
      cameraId: selectedVideoDeviseId,
      encoderConfig: "h540p_w960p",
      multiStream: true,
      optimizationMode: "motion",
    });
    return CustomVideoTracks;
  } catch (error) {
    console.log("Error creating video track:", error);
  }
};
