import React from 'react';
import '../../../style/HomePage.css';

const HomePage = () => {
  // Dữ liệu demo với nhiều thông tin hơn
  const stats = [
    { label: 'Bệnh nhân đặt lịch', value: 120, color: '#1e429f', trend: '+12%' },
    { label: 'Bệnh nhân đang chờ', value: 35, color: '#ffb300', trend: '-5%' },
    { label: 'Bác sĩ hoạt động', value: 12, color: '#43a047', trend: '+2' },
    { label: 'Doanh thu hôm nay', value: '2.4M', color: '#e91e63', trend: '+18%' },
  ];

  const recentActivities = [
    { time: '09:30', action: 'Bệnh nhân Nguyễn Văn A đặt lịch khám', type: 'appointment' },
    { time: '09:15', action: 'BS. Trần Thị B hoàn thành ca khám', type: 'completed' },
    { time: '09:00', action: 'Hệ thống backup dữ liệu thành công', type: 'system' },
    { time: '08:45', action: 'Bệnh nhân Lê Văn C hủy lịch hẹn', type: 'cancelled' },
  ];

  const quickActions = [
    { title: 'Thêm bệnh nhân mới', icon: '👤', color: '#1e429f' },
    { title: 'Xem lịch hẹn', icon: '📅', color: '#43a047' },
    { title: 'Quản lý bác sĩ', icon: '👨‍⚕️', color: '#ffb300' },
    { title: 'Báo cáo thống kê', icon: '📊', color: '#e91e63' },
  ];

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1 className="home-title">Tổng quan hệ thống</h1>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="home-stats">
        {stats.map((item, idx) => (
          <div className="home-stat-card" key={idx} style={{ borderColor: item.color }}>
            <div className="stat-header">
              <div className="stat-value" style={{ color: item.color }}>{item.value}</div>
              <div className="stat-trend" style={{ color: item.trend.startsWith('+') ? '#43a047' : '#f44336' }}>
                {item.trend}
              </div>
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="home-content-row">
        {/* Charts Section */}
        <div className="charts-section">
          <div className="home-charts-row">
            <div className="home-chart-card">
              <div className="chart-title">Biểu đồ bệnh nhân đặt lịch</div>
              <div className="fake-bar-chart">
                <div className="bar" style={{height: '60%', background: '#1e429f'}}></div>
                <div className="bar" style={{height: '80%', background: '#43a047'}}></div>
                <div className="bar" style={{height: '40%', background: '#ffb300'}}></div>
                <div className="bar" style={{height: '70%', background: '#1e429f'}}></div>
                <div className="bar" style={{height: '50%', background: '#ffb300'}}></div>
                <div className="bar" style={{height: '90%', background: '#43a047'}}></div>
                <div className="bar" style={{height: '65%', background: '#e91e63'}}></div>
              </div>
              <div className="chart-labels">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
            </div>
            
            <div className="home-chart-card">
              <div className="chart-title">Tỉ lệ trạng thái bệnh nhân</div>
              <div className="fake-pie-chart">
                <div className="pie-slice" style={{background: 'conic-gradient(#1e429f 0% 60%, #ffb300 60% 85%, #43a047 85% 100%)'}}></div>
                <div className="pie-legend">
                  <span><span className="dot" style={{background: '#1e429f'}}></span>Đặt lịch (60%)</span>
                  <span><span className="dot" style={{background: '#ffb300'}}></span>Đang chờ (25%)</span>
                  <span><span className="dot" style={{background: '#43a047'}}></span>Hoàn thành (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {/* Quick Actions */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Thao tác nhanh</h3>
            <div className="quick-actions">
              {quickActions.map((action, idx) => (
                <div className="quick-action-card" key={idx}>
                  <div className="action-icon" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <span className="action-title">{action.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Hoạt động gần đây</h3>
            <div className="recent-activities">
              {recentActivities.map((activity, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-content">
                    <div className={`activity-dot ${activity.type}`}></div>
                    <span className="activity-text">{activity.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;