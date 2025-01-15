import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import SideBar from '../../../components/Sidebar/sideBar';
import './LivestreamAdmin.css';

const APP_ID = "2bab4ee5dcdf4ec89375fa0a0a1df109"; // Thay thế bằng App ID mới của bạn
const CHANNEL_NAME = "admin-channel";
const TOKEN = "007eJxTYHi/8+OfXovgunNR7JZp4hyNvy4db4za37Xoj55QovLHOWsVGIySEpNMUlNNU5JT0kxSky0sjc1N0xINgNAwJc3QwJI1rT29IZCRoUGdhYERCkF8XobElNzMPN3kjMS8vNQcBgYABsAjmg=="; // Thay thế bằng token mới

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

  const [duration, setDuration] = useState(0);
  
  // Add timer interval reference
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({
      mode: "live",
      codec: "vp8",
      role: "host",
      channelProfile: 1
    });









    setClient(agoraClient);

    return () => {
      stopStream();
    };
  }, []);

  const startStream = async () => {
    if (!client) return;

    try {










      await client.join(APP_ID, CHANNEL_NAME, TOKEN || null, null);



      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();



      await client.publish([audioTrack, videoTrack]);


      videoTrack.play('local-video');
      
      setLocalTracks([audioTrack, videoTrack]);
      setIsStreaming(true);

      // Start duration timer
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);

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


      // Clear duration timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setDuration(0);

    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  // Format duration to HH:MM:SS
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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


              <div className="stat-value">{formatDuration(duration)}</div>
              <div className="stat-label">Thời gian phát sóng</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Trạng thái</div>
              <div className="stat-value">{isStreaming ? 'Đang phát' : 'Offline'}</div>

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