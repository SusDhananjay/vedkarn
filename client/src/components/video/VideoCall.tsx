import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorSmartphone } from "lucide-react";

interface VideoCallProps {
  sessionId: string;
  onEndCall: () => void;
}

export default function VideoCall({ sessionId, onEndCall }: VideoCallProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    initializeWebRTC();
    
    return () => {
      // Clean up
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);
  
  const initializeWebRTC = async () => {
    try {
      // Create WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "join",
            sessionId
          }));
        }
      };
      
      wsRef.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case "joined":
            await setupLocalMedia();
            createPeerConnection();
            break;
            
          case "offer":
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
              const answer = await peerConnectionRef.current.createAnswer();
              await peerConnectionRef.current.setLocalDescription(answer);
              
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                  type: "answer",
                  sessionId,
                  sdp: answer
                }));
              }
            }
            break;
            
          case "answer":
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
            }
            break;
            
          case "candidate":
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
            break;
            
          case "leave":
            handlePeerDisconnect();
            break;
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "Connection error",
          description: "There was an error connecting to the video call server",
          variant: "destructive",
        });
      };
      
      wsRef.current.onclose = () => {
        if (isConnected) {
          toast({
            title: "Disconnected",
            description: "You have been disconnected from the video call",
          });
          handlePeerDisconnect();
        }
      };
      
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      toast({
        title: "Setup error",
        description: "Could not set up video call. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Media access error",
        description: "Could not access camera or microphone",
        variant: "destructive",
      });
    }
  };
  
  const createPeerConnection = () => {
    try {
      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "candidate",
            sessionId,
            candidate: event.candidate
          }));
        }
      };
      
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          toast({
            title: "Connected",
            description: "You are now connected to the video call",
          });
        }
      };
      
      peerConnectionRef.current.oniceconnectionstatechange = () => {
        if (peerConnectionRef.current) {
          if (peerConnectionRef.current.iceConnectionState === "disconnected" ||
              peerConnectionRef.current.iceConnectionState === "failed" ||
              peerConnectionRef.current.iceConnectionState === "closed") {
            handlePeerDisconnect();
          }
        }
      };
      
      // Add local tracks to the peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          if (localStreamRef.current && peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          }
        });
      }
      
      // Create and send offer
      createAndSendOffer();
      
    } catch (error) {
      console.error("Error creating peer connection:", error);
      toast({
        title: "Connection error",
        description: "Could not establish peer connection",
        variant: "destructive",
      });
    }
  };
  
  const createAndSendOffer = async () => {
    try {
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "offer",
            sessionId,
            sdp: offer
          }));
        }
      }
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };
  
  const handlePeerDisconnect = () => {
    setIsConnected(false);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing and revert to camera
        if (screenShareStreamRef.current) {
          screenShareStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (localStreamRef.current && peerConnectionRef.current) {
          // Replace the screen share track with the camera track
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => 
            sender.track && sender.track.kind === 'video'
          );
          
          if (videoSender && videoTrack) {
            videoSender.replaceTrack(videoTrack);
          }
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        }
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        screenShareStreamRef.current = screenStream;
        
        if (peerConnectionRef.current) {
          // Replace camera track with screen share track
          const screenTrack = screenStream.getVideoTracks()[0];
          
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => 
            sender.track && sender.track.kind === 'video'
          );
          
          if (videoSender && screenTrack) {
            videoSender.replaceTrack(screenTrack);
          }
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          
          // When user stops screen sharing via the browser UI
          screenTrack.onended = () => {
            toggleScreenShare();
          };
        }
      }
      
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast({
        title: "Screen share error",
        description: "Could not share your screen",
        variant: "destructive",
      });
    }
  };
  
  const endCall = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "leave",
        sessionId
      }));
    }
    
    onEndCall();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 bg-black">
        {/* Remote video (main view) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] h-auto border-2 border-white rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-4 bg-black bg-opacity-50 rounded-lg">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Waiting for the other participant to join...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-900 flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={!isAudioEnabled ? "bg-red-500 text-white hover:bg-red-600" : ""}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={!isVideoEnabled ? "bg-red-500 text-white hover:bg-red-600" : ""}
        >
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleScreenShare}
          className={isScreenSharing ? "bg-primary text-white hover:bg-primary-600" : ""}
        >
          <MonitorSmartphone />
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          onClick={endCall}
        >
          <PhoneOff />
        </Button>
      </div>
    </div>
  );
}
