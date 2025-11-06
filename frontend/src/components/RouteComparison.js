import React from 'react';
import './RouteComparison.css';

function RouteComparison({ routeOptions, comparison, onSelectRoute, selectedRoute }) {
  const { cheapest, fastest, bestValue } = routeOptions;

  const routes = [
    { key: 'cheapest', data: cheapest, icon: '💰', color: '#10b981' },
    { key: 'fastest', data: fastest, icon: '⚡', color: '#3b82f6' },
    { key: 'bestValue', data: bestValue, icon: '⭐', color: '#8b5cf6' }
  ];

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="route-comparison">
      <div className="comparison-header">
        <h3>🚆 경로 옵션을 선택하세요</h3>
        <p className="comparison-subtitle">
          목적지까지 가는 방법이 여러 가지 있어요. 원하는 옵션을 선택하세요!
        </p>
      </div>

      {/* Savings Banner */}
      {comparison.savings.amount > 0 && (
        <div className="savings-banner">
          <span className="savings-icon">💡</span>
          <span className="savings-text">
            최저 비용 경로를 선택하면 <strong>{comparison.savings.formatted}</strong>을 절약할 수 있어요!
            (약 {comparison.savings.percentage}% 절감)
          </span>
        </div>
      )}

      {/* Route Cards */}
      <div className="route-cards">
        {routes.map((route) => (
          <div
            key={route.key}
            className={`route-card ${selectedRoute === route.key ? 'selected' : ''}`}
            onClick={() => onSelectRoute(route.key)}
            style={{ '--route-color': route.color }}
          >
            <div className="route-card-header">
              <span className="route-icon">{route.icon}</span>
              <div className="route-title">
                <h4>{route.data.label}</h4>
                <p>{route.data.description}</p>
              </div>
              {selectedRoute === route.key && (
                <span className="selected-badge">선택됨</span>
              )}
            </div>

            <div className="route-card-stats">
              <div className="stat-item">
                <span className="stat-label">교통비</span>
                <span className="stat-value cost">{route.data.costFormatted}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">소요 시간</span>
                <span className="stat-value">{formatTime(route.data.duration)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">환승</span>
                <span className="stat-value">{route.data.transfers}회</span>
              </div>
            </div>

            {/* Highlight for each route type */}
            {route.key === 'cheapest' && (
              <div className="route-highlight">
                가장 저렴한 선택! 예산을 아끼고 싶다면 추천해요.
              </div>
            )}
            {route.key === 'fastest' && (
              <div className="route-highlight">
                가장 빠른 선택! 시간이 중요하다면 이 경로를 추천해요.
              </div>
            )}
            {route.key === 'bestValue' && (
              <div className="route-highlight">
                가성비 최고! 시간과 비용의 균형이 가장 좋아요.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <div className="comparison-details">
        <h4>📊 상세 비교</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>최저 비용</th>
              <th>최단 시간</th>
              <th>최고 가성비</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>교통비</td>
              <td className={cheapest.cost === Math.min(cheapest.cost, fastest.cost, bestValue.cost) ? 'best' : ''}>
                {cheapest.costFormatted}
              </td>
              <td className={fastest.cost === Math.min(cheapest.cost, fastest.cost, bestValue.cost) ? 'best' : ''}>
                {fastest.costFormatted}
              </td>
              <td className={bestValue.cost === Math.min(cheapest.cost, fastest.cost, bestValue.cost) ? 'best' : ''}>
                {bestValue.costFormatted}
              </td>
            </tr>
            <tr>
              <td>소요 시간</td>
              <td className={cheapest.duration === Math.min(cheapest.duration, fastest.duration, bestValue.duration) ? 'best' : ''}>
                {formatTime(cheapest.duration)}
              </td>
              <td className={fastest.duration === Math.min(cheapest.duration, fastest.duration, bestValue.duration) ? 'best' : ''}>
                {formatTime(fastest.duration)}
              </td>
              <td className={bestValue.duration === Math.min(cheapest.duration, fastest.duration, bestValue.duration) ? 'best' : ''}>
                {formatTime(bestValue.duration)}
              </td>
            </tr>
            <tr>
              <td>환승 횟수</td>
              <td className={cheapest.transfers === Math.min(cheapest.transfers, fastest.transfers, bestValue.transfers) ? 'best' : ''}>
                {cheapest.transfers}회
              </td>
              <td className={fastest.transfers === Math.min(cheapest.transfers, fastest.transfers, bestValue.transfers) ? 'best' : ''}>
                {fastest.transfers}회
              </td>
              <td className={bestValue.transfers === Math.min(cheapest.transfers, fastest.transfers, bestValue.transfers) ? 'best' : ''}>
                {bestValue.transfers}회
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional Info */}
      {comparison.timeDifference !== 0 && (
        <div className="additional-info">
          <p>
            ⏱️ 최저 비용 경로는 최단 시간 경로보다 <strong>{Math.abs(comparison.timeDifference)}분</strong>
            {comparison.timeDifference > 0 ? ' 더 걸립니다' : ' 더 빠릅니다'}.
          </p>
        </div>
      )}
    </div>
  );
}

export default RouteComparison;
