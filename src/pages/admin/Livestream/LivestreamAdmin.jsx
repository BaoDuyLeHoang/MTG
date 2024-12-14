import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import SideBar from '../../../components/Sidebar/sideBar';
import './LivestreamAdmin.css';

const APP_ID = "2bab4ee5dcdf4ec89375fa0a0a1df109"; // Thay thế bằng App ID mới của bạn
const CHANNEL_NAME = "admin-channel";
const TOKEN = "007eJxTYHh5+ELOgaMxYkd8fy1XUWudclBkaUpMPUvRTqGtF0/I9M9UYDBKSkwySU01TUlOSTNJTbawNDY3TUs0AELDlDRDA8vVETHpDYGMDGeW72JlZIBAEJ+XITElNzNPNzkjMS8vNYeBAQAqHyUi"; // Thay thế bằng token mới

const fetchToken = async () => {
  try {
    // Gọi API của bạn để lấy token
    const response = await fetch('your-token-server-endpoint');
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

const LivestreamAdmin = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [viewers, setViewers] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({
      mode: "live",
      codec: "vp8",
      role: "host",
      channelProfile: 1
    });

    agoraClient.on("user-joined", () => {
      setViewers(prev => prev + 1);
    });

    agoraClient.on("user-left", () => {
      setViewers(prev => Math.max(0, prev - 1));
    });

    setClient(agoraClient);

    return () => {
      stopStream();
    };
  }, []);

  const startStream = async () => {
    if (!client) return;

    try {
      // Nếu bạn có server để lấy token
      // const token = await fetchToken();
      
      console.log('Joining channel with:', {
        appId: APP_ID,
        channel: CHANNEL_NAME,
        token: TOKEN
      });

      // Join channel
      await client.join(APP_ID, CHANNEL_NAME, TOKEN || null, null);
      console.log('Joined channel successfully');

      // Create tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      console.log('Tracks created');
      
      // Publish tracks
      await client.publish([audioTrack, videoTrack]);
      console.log('Tracks published');
      
      videoTrack.play('local-video');
      
      setLocalTracks([audioTrack, videoTrack]);
      setIsStreaming(true);

    } catch (error) {
      console.error('Detailed error:', error);
      alert('Không thể bắt đầu stream. Vui lòng kiểm tra console để biết thêm chi tiết.');
    }
  };

  const stopStream = async () => {
    if (!client) return;

    try {
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });
      setLocalTracks([]);

      await client.leave();
      setIsStreaming(false);
      setViewers(0);

    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  return (
    <div className="livestream-admin-container">
      <SideBar />
      <div className="livestream-content-admin">
        <div className="livestream-header-admin">
          <h2>Quản lý Livestream</h2>
          {isStreaming && (
            <div className="live-indicator">
              ĐANG PHÁT TRỰC TIẾP
            </div>
          )}
        </div>

        <div className="stream-controls-container">
          <div className="stream-controls">
            {!isStreaming ? (
              <button onClick={startStream} className="start-stream">
                <i className="fas fa-play"></i>
                Bắt đầu Stream
              </button>
            ) : (
              <button onClick={stopStream} className="stop-stream">
                <i className="fas fa-stop"></i>
                Dừng Stream
              </button>
            )}
          </div>
        </div>

        <div className="stream-info">
          <div className="stream-info-header">
            <h3>Thông tin Stream</h3>
          </div>
          <div className="stream-stats">
            <div className="stat-item">
              <div className="stat-value">{viewers}</div>
              <div className="stat-label">Người xem</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{isStreaming ? 'Đang phát' : 'Offline'}</div>
              <div className="stat-label">Trạng thái</div>
            </div>
          </div>
        </div>

        <div className="video-container-wrapper">
          <div id="local-video" className="video-container-admin" />
        </div>
      </div>
    </div>
  );
};

export default LivestreamAdmin;
