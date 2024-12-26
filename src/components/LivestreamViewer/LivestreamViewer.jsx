import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './LivestreamViewer.css';

const APP_ID = "2bab4ee5dcdf4ec89375fa0a0a1df109";
const CHANNEL_NAME = "admin-channel";
const TOKEN = "007eJxTYGCuEHzs59vSO9Po8t67iRMquiRa/VR2hd3eETNzryVfqooCg1FSYpJJaqppSnJKmklqsoWlsblpWqIBEBqmpBkaWH7IyEpvCGRkSJERZGVkgEAQn5chMSU3M083OSMxLy81h4EBAD7OIeM=";

const LivestreamViewer = () => {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const clientRef = useRef(null);
  const videoTrackRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initAgora = async () => {
      try {
        if (clientRef.current) {
          await cleanup();
        }

        clientRef.current = AgoraRTC.createClient({
          mode: 'live',
          codec: 'vp8',
          role: 'audience'
        });

        clientRef.current.on('user-published', async (user, mediaType) => {
          if (!mounted) return;
          
          try {
            await clientRef.current.subscribe(user, mediaType);
            
            if (mediaType === 'video') {
              if (videoTrackRef.current) {
                videoTrackRef.current.stop();
                videoTrackRef.current = null;
              }

              const container = document.getElementById('remote-stream');
              if (container) {
                container.innerHTML = '';
                videoTrackRef.current = user.videoTrack;
                user.videoTrack.play('remote-stream');
                setIsStreamActive(true);
              }
            }
            if (mediaType === 'audio') {
              user.audioTrack.play();
            }
          } catch (error) {
            console.error('Subscribe error:', error);
          }
        });

        clientRef.current.on('user-unpublished', (user, mediaType) => {
          if (!mounted) return;

          if (mediaType === 'video' && videoTrackRef.current === user.videoTrack) {
            videoTrackRef.current.stop();
            videoTrackRef.current = null;
            setIsStreamActive(false);
          }
        });

        await clientRef.current.join(APP_ID, CHANNEL_NAME, TOKEN, null);
        console.log('Join channel success');

      } catch (error) {
        console.error('Init Agora error:', error);
      }
    };

    const cleanup = async () => {
      if (clientRef.current) {
        if (videoTrackRef.current) {
          videoTrackRef.current.stop();
          videoTrackRef.current = null;
        }

        const container = document.getElementById('remote-stream');
        if (container) {
          container.innerHTML = '';
        }

        await clientRef.current.leave();
        clientRef.current = null;
        setIsStreamActive(false);
      }
    };

    initAgora();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return (
    <div className="livestream-viewer">
      {!isStreamActive && (
        <div className="no-stream">
          <p>Không có buổi phát sóng nào đang diễn ra</p>
        </div>
      )}
      <div 
        id="remote-stream" 
        className="video-container"
        style={{ 
          display: isStreamActive ? 'block' : 'none'
        }}
      />
    </div>
  );
};

export default LivestreamViewer;
