import { WebSocketServer, WebSocket } from 'ws';

interface SignalingMessage {
  type: string;
  sessionId: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

interface SessionParticipant {
  socket: WebSocket;
  userId?: number;
}

export function setupSignalingServer(wss: WebSocketServer) {
  // Store active sessions and their participants
  const sessions: Map<string, SessionParticipant[]> = new Map();

  wss.on('connection', (socket: WebSocket) => {
    console.log('WebSocket connection established');

    socket.on('message', (messageData: string) => {
      try {
        const message: SignalingMessage = JSON.parse(messageData);
        
        if (!message.sessionId) {
          console.error('Missing sessionId in message');
          return;
        }

        console.log(`Received ${message.type} message for session ${message.sessionId}`);

        switch (message.type) {
          case 'join':
            handleJoin(message.sessionId, socket);
            break;
          
          case 'offer':
            handleOffer(message.sessionId, socket, message.sdp);
            break;
          
          case 'answer':
            handleAnswer(message.sessionId, socket, message.sdp);
            break;
          
          case 'candidate':
            handleCandidate(message.sessionId, socket, message.candidate);
            break;
          
          case 'leave':
            handleLeave(message.sessionId, socket);
            break;
          
          default:
            console.warn(`Unknown message type: ${message.type}`);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    socket.on('close', () => {
      console.log('WebSocket connection closed');
      
      // Remove the socket from all sessions
      for (const [sessionId, participants] of sessions.entries()) {
        const index = participants.findIndex(p => p.socket === socket);
        if (index !== -1) {
          handleLeave(sessionId, socket);
        }
      }
    });
  });

  function handleJoin(sessionId: string, socket: WebSocket) {
    // Get or create session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    
    const participants = sessions.get(sessionId)!;
    
    // Check if the socket is already in the session
    const existingParticipant = participants.find(p => p.socket === socket);
    if (existingParticipant) {
      return;
    }
    
    // Add the new participant
    participants.push({ socket });
    
    // Notify the participant that they've joined
    sendToSocket(socket, {
      type: 'joined',
      sessionId
    });
    
    // If there are already two participants, notify them to start negotiation
    if (participants.length === 2) {
      sendToSocket(participants[0].socket, {
        type: 'ready',
        sessionId
      });
    }
    
    // Log the current session state
    console.log(`Session ${sessionId} now has ${participants.length} participant(s)`);
  }

  function handleOffer(sessionId: string, socket: WebSocket, sdp?: RTCSessionDescriptionInit) {
    if (!sdp) {
      console.error('Missing SDP in offer message');
      return;
    }
    
    const participants = sessions.get(sessionId);
    if (!participants) {
      console.error(`Session ${sessionId} not found`);
      return;
    }
    
    // Find the participant who sent the offer
    const senderIndex = participants.findIndex(p => p.socket === socket);
    if (senderIndex === -1) {
      console.error('Sender not found in session');
      return;
    }
    
    // Find the other participant
    const otherIndex = senderIndex === 0 ? 1 : 0;
    if (otherIndex >= participants.length) {
      console.error('No other participant found in session');
      return;
    }
    
    // Forward the offer to the other participant
    sendToSocket(participants[otherIndex].socket, {
      type: 'offer',
      sessionId,
      sdp
    });
  }

  function handleAnswer(sessionId: string, socket: WebSocket, sdp?: RTCSessionDescriptionInit) {
    if (!sdp) {
      console.error('Missing SDP in answer message');
      return;
    }
    
    const participants = sessions.get(sessionId);
    if (!participants) {
      console.error(`Session ${sessionId} not found`);
      return;
    }
    
    // Find the participant who sent the answer
    const senderIndex = participants.findIndex(p => p.socket === socket);
    if (senderIndex === -1) {
      console.error('Sender not found in session');
      return;
    }
    
    // Find the other participant
    const otherIndex = senderIndex === 0 ? 1 : 0;
    if (otherIndex >= participants.length) {
      console.error('No other participant found in session');
      return;
    }
    
    // Forward the answer to the other participant
    sendToSocket(participants[otherIndex].socket, {
      type: 'answer',
      sessionId,
      sdp
    });
  }

  function handleCandidate(sessionId: string, socket: WebSocket, candidate?: RTCIceCandidateInit) {
    if (!candidate) {
      console.error('Missing candidate in candidate message');
      return;
    }
    
    const participants = sessions.get(sessionId);
    if (!participants) {
      console.error(`Session ${sessionId} not found`);
      return;
    }
    
    // Find the participant who sent the candidate
    const senderIndex = participants.findIndex(p => p.socket === socket);
    if (senderIndex === -1) {
      console.error('Sender not found in session');
      return;
    }
    
    // Find the other participant
    const otherIndex = senderIndex === 0 ? 1 : 0;
    if (otherIndex >= participants.length) {
      console.error('No other participant found in session');
      return;
    }
    
    // Forward the candidate to the other participant
    sendToSocket(participants[otherIndex].socket, {
      type: 'candidate',
      sessionId,
      candidate
    });
  }

  function handleLeave(sessionId: string, socket: WebSocket) {
    const participants = sessions.get(sessionId);
    if (!participants) {
      return;
    }
    
    // Find the participant who is leaving
    const leavingIndex = participants.findIndex(p => p.socket === socket);
    if (leavingIndex === -1) {
      return;
    }
    
    // Remove the leaving participant
    participants.splice(leavingIndex, 1);
    
    // If there are still participants, notify them
    for (const participant of participants) {
      sendToSocket(participant.socket, {
        type: 'leave',
        sessionId
      });
    }
    
    // If no participants remain, remove the session
    if (participants.length === 0) {
      sessions.delete(sessionId);
      console.log(`Session ${sessionId} removed`);
    } else {
      console.log(`Session ${sessionId} now has ${participants.length} participant(s)`);
    }
  }

  function sendToSocket(socket: WebSocket, message: any) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
}
