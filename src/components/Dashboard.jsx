import { useState, useEffect } from "react";
import "./style.css";

export default function Dashboard() {
    const [favorites, setFavorites] = useState([]);
    const [upcomingExams, setUpcomingExams] = useState([]);  // 7일 이내
    const [upcomingMonth, setUpcomingMonth] = useState([]); // 30일 이내
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const storedData = localStorage.getItem("myQualifications");
        if (storedData) {
            const allList = JSON.parse(storedData);
            setTotalCount(allList.length);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // ① 즐겨찾기 속성명 수정: qfavorite -> favorite
            const favList = allList.filter((item) => item.favorite === true);
            setFavorites(favList);

            // ② 7일 이내 시험 속성명 수정: qTstart -> examDate 및 오타(gameDate) 수정
            const upcomingList = allList.filter((item) => {
                if (!item.examDate) return false; 
                const examDate = new Date(item.examDate);
                examDate.setHours(0, 0, 0, 0); // 오타 수정 (gameDate -> examDate)
                const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 7;
            });
            setUpcomingExams(upcomingList);

            // ③ 30일 이내 시험 속성명 수정: qTstart -> examDate
            const monthList = allList.filter((item) => {
                if (!item.examDate) return false;
                const examDate = new Date(item.examDate);
                examDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 30;
            });
            setUpcomingMonth(monthList);
        }
    }, []);

    const getDDayText = (targetDateStr) => {
        if (!targetDateStr) return "일정 미정";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(targetDateStr);
        examDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) return `D-${diffDays}`;
        if (diffDays === 0) return "D-Day (오늘)";
        return `D+${Math.abs(diffDays)} (종료)`;
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">대시보드</h2>

            {/* ─── 요약 카드 ─── */}
            <div className="summary-section">
                <div className="summary-box">
                    <h3>전체 자격증</h3>
                    <p className="count">{totalCount}개</p>
                </div>
                <div className="summary-box">
                    <h3>즐겨찾기</h3>
                    <p className="count">{favorites.length}개</p>
                </div>
                <div className="summary-box">
                    <h3>30일 이내 시험</h3>
                    <p className="count">{upcomingMonth.length}개</p>
                </div>
            </div>

            <hr className="section-divider" />

            {/* ─── 7일 이내 시험 임박 알림 ─── */}
            <div className="upcoming-alert-section">
                <h3 className="section-title">🚨 시험 임박 알림 (7일 이내)</h3>
                <p className="section-desc">
                    일주일 이내에 시험이 예정된 자격증이 총 <strong className="highlight">{upcomingExams.length}개</strong> 있습니다.
                </p>

                {upcomingExams.length === 0 ? (
                    <p className="empty-message">현재 7일 이내에 예정된 시험이 없습니다.</p>
                ) : (
                    <div className="exam-card-list">
                        {upcomingExams.map((item) => (
                            <div className="exam-card urgent" key={`upcoming-${item.id}`}>
                                <div className="card-header">
                                    {/* 속성명 수정: qTstart -> examDate, qname -> name */}
                                    <span className="dday-badge alert">{getDDayText(item.examDate)}</span>
                                    <strong className="exam-name">{item.name}</strong>
                                </div>
                                
                                <div className="meta-details">
                                    <div className="meta-item">
                                        <span className="meta-label">시행기관</span>
                                        <span className="meta-value">{item.agency || item.qagency}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">현재상태</span>
                                        <span className="meta-value">{item.status || item.qnow}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">시험일자</span>
                                        <span className="meta-value">{item.examDate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="section-divider" />

            {/* ─── 30일 이내 다가오는 일정 ─── */}
            <div className="monthly-schedule-section">
                <h3 className="section-title">📅 다가오는 일정 (30일 이내)</h3>
                {upcomingMonth.length === 0 ? (
                    <p className="empty-message">30일 이내 시험이 없습니다.</p>
                ) : (
                    <div className="schedule-grid">
                        {upcomingMonth.map((item) => (
                            <div className="schedule-mini-box" key={`month-${item.id}`}>
                                {/* 속성명 수정: qname -> name, qTstart -> examDate */}
                                <strong className="exam-name">{item.name}</strong>
                                <p className="exam-date">시험일: {item.examDate}</p>
                                <p className="dday-text alert">{getDDayText(item.examDate)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="section-divider" />

            {/* ─── 즐겨찾기 현황 ─── */}
            <div className="favorites-section">
                <h3 className="section-title">⭐ 관심 자격증 현황</h3>
                <p className="section-desc">
                    즐겨찾기(★) 해둔 자격증이 총 <strong className="highlight">{favorites.length}개</strong> 있습니다.
                </p>

                {favorites.length === 0 ? (
                    <p className="empty-message">즐겨찾기한 자격증이 없습니다. 목록에서 별을 눌러보세요!</p>
                ) : (
                    <div className="exam-card-list">
                        {favorites.map((item) => {
                            {/* 속성명 수정: qTstart -> examDate */}
                            const dDayText = getDDayText(item.examDate);
                            const isUrgent = dDayText.startsWith("D-") && !dDayText.includes("종료");
                            
                            return (
                                <div className={`exam-card ${isUrgent ? "urgent" : ""}`} key={`fav-${item.id}`}>
                                    <div className="card-header">
                                        <span className={`dday-badge ${isUrgent ? "alert" : "normal"}`}>
                                            {dDayText}
                                        </span>
                                        {/* 속성명 수정: qname -> name */}
                                        <strong className="exam-name">{item.name}</strong>
                                    </div>

                                    <div className="meta-details">
                                        <div className="meta-item">
                                            <span className="meta-label">시행기관</span>
                                            <span className="meta-value">{item.agency || item.qagency}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">현재상태</span>
                                            <span className="meta-value">{item.status || item.qnow}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">시험일자</span>
                                            <span className="meta-value">{item.examDate || "일정 미정"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}