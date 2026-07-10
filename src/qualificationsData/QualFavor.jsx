import { useEffect, useState } from "react";
import { updateQualScheduleList } from "../utils/dateUtils";
import "./style.css";

export default function QualFavor({ qualList }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // 부모로부터 받은 qualList에서 favorite이 true인 것만 필터링
        const processedList = updateQualScheduleList(qualList);
        const favList = processedList.filter((item) => item.favorite === true);
        setFavorites(favList);
    }, [qualList]);

    return (
        <section className="favor-section">
            <h2 className="favor-title">⭐ 관심 자격증 현황</h2>
            <p className="favor-desc">
                즐겨찾기(★) 해둔 자격증이 총 <strong className="highlight">{favorites.length}개</strong> 있습니다.
            </p>

            {favorites.length === 0 ? (
                <p className="empty-message">즐겨찾기한 자격증이 없습니다. 목록에서 별을 눌러보세요!</p>
            ) : (
                <div className="table-responsive">
                    <table className="favor-table">
                        <thead className="table-head">
                            <tr>
                                <th className="table-th">디데이</th>
                                <th className="table-th">자격증명</th>
                                <th className="table-th">시행기관</th>
                                <th className="table-th">현재상태</th>
                                <th className="table-th">시험일자</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {favorites.map((item) => {
                                // ─── 1. 디데이 숫자 타입 변환 및 텍스트 분기 처리 ───
                                const numericDday = item.dDay !== null ? Number(item.dDay) : null;
                                
                                let dDayText = "일정 미정";
                                let isUrgent = false;

                                if (numericDday !== null) {
                                    if (numericDday === 0) {
                                        dDayText = "D-Day";
                                        isUrgent = true; // 오늘 시험도 강조
                                    } else if (numericDday < 0) {
                                        // 이미 지난 시험 (마이너스 값이 들어왔을 때 -> D+숫자로 변경)
                                        dDayText = `D+${Math.abs(numericDday)}`;
                                        isUrgent = false;
                                    } else {
                                        // 남은 시험 (양수 값이 들어왔을 때 -> D-숫자로 변경)
                                        dDayText = `D-${numericDday}`;
                                        isUrgent = numericDday <= 7; // 7일 이내인 경우만 마크업 강조용
                                    }
                                }

                                return (
                                    <tr className="table-row" key={item.id}>
                                        <td className="table-td text-center">
                                            {/* ─── 2. 조건별 스타일 클래스 적용 ─── */}
                                            <span className={`dday-text ${isUrgent ? "alert-text" : "normal-text"}`}>
                                                {dDayText}
                                            </span>
                                        </td>
                                        <td className="table-td exam-name">
                                            <strong>{item.name}</strong>
                                        </td>
                                        <td className="table-td">{item.agency}</td>
                                        <td className="table-td text-center">
                                            <span className="status-badge">{item.status}</span>
                                        </td>
                                        <td className="table-td text-center">
                                            {item.examDate || "일정 미정"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}