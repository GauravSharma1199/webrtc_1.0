import { useEffect, useState } from "react";

export function Receiver() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [canPlay, setCanPlay] = useState(false);

  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<String>("not connect with WebSocket");



  const startRecieving = (socket: WebSocket) => {
    console.log("startRecieving");
    console.log(socket);

    const video = document.createElement("video");
    document.body.appendChild(video);
    setVideoElement(video);

    const pc = new RTCPeerConnection();
    pc.ontrack = (event) => {
      video.srcObject = new MediaStream([event.track]);
      // video.play();
      setCanPlay(true);
    };
    socket.onmessage = (event) => {
      console.log("ans", event);

      const msg = JSON.parse(event.data);
      if (msg.type === "status") {
        setStatus(msg.msg);
      } else if (msg.type === "createOffer") {
        pc.setRemoteDescription(msg.sdp).then(() => {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            socket.send(
              JSON.stringify({
                type: "createAnswer",
                sdp: answer,
              })
            );
          });
        });
      } else if (msg.type === "iceCandidate") {
        pc.addIceCandidate(msg.candidate);
      }
    };
  };
  const handlePlayVideo = () => {
    if (videoElement) {
      videoElement
        .play()
        .catch((error) => console.error("Error playing video:", error));
    }
  };
  useEffect(() => {
    // const socket = connectWebSocket();
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "reciever",
        })
      );
      // setSocket(socket);
    };
    startRecieving(socket);
  
  }, []);

  return (
    <>
      <div>{status}</div>
      <div>Receiver</div>
      <div>
        {canPlay && <button onClick={handlePlayVideo}>Play Video</button>}
      </div>
    </>
  );
}
