import { useEffect, useState } from "react";
import PrintQRCode from "./PrintQRCode";

export function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [pc, setPC] = useState<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<String>("not connected with web socket");

  const initiateConnection = () => {
    console.log("initiating connection");
    // console.log(socket);
    if (!socket) {
      alert("Socket not available");
      return;
    }
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "createAnswer") {
        await pc?.setRemoteDescription(msg.sdp);
      } else if (msg.type === "iceCandidate") {
        pc.addIceCandidate(msg.candidate);
      }
    };

    const pc = new RTCPeerConnection();
    // setPC(pc);
    console.log(pc);

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.send(
        JSON.stringify({
          type: "createOffer",
          sdp: pc.localDescription,
        })
      );
    };

    

    pc.onicecandidate =  (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        );
      }
    };
    getCameraStreamAndSend(pc)
  };

  const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
    navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      document.body.appendChild(video);
      stream.getTracks().forEach((track) => {
        pc?.addTrack(track)
      })
    })
  }
  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
      setSocket(socket);
    };
    socket.onmessage = (event: any) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "status") {
        setStatus(msg.msg);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
  }, []);
  return (
    <>
      <div>{status}</div>
      <div>Sender</div>
      <button onClick={initiateConnection}>Call Now</button>
      <div>
      <h1>Welcome to QR Code Generator</h1>
      <PrintQRCode data="https://www.google.com" />
    </div>
    </>
  );
}