class PeerService {
  peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    });
  }

  async generateAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    try {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error;
    }
  }

  async setRemoteDescription(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error("Error setting remote description:", error);
      throw error;
    }
  }

  async generateOffer(): Promise<RTCSessionDescriptionInit> {
    try {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error generating offer:", error);
      throw error;
    }
  }
}

const peerService = new PeerService();
export default peerService;
