import React from "react";
import "./style.css";

export default function QualDetail({ targetQual, onClose }) {
    // 만약 전달받은 자격증 데이터가 없다면 예외 처리
    if (!targetQual) {
        return (
            <div className="qual-detail-container is-empty">
                <p className="empty-message">선택된 자격증 정보가 없습니다.</p>
                <div className="form-actions">
                    <button type="button" className="btn btn-cancel" onClick={onClose}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // D-Day 숫자 형변환 및 출력 텍스트 정의 (QualList와 로직 통일)
    const numericDday = targetQual.dDay !== null ? Number(targetQual.dDay) : null;
    const isOverdue = numericDday !== null && numericDday < 0;
    
    let dDayText = "일정 미정";
    if (numericDday !== null) {
        if (numericDday === 0) dDayText = "D-Day";
        else if (numericDday < 0) dDayText = `D+${Math.abs(numericDday)}`;
        else dDayText = `D-${numericDday}`;
    }

    return (
        <div className="qual-detail-container">
            {/* 상단 헤더 영역 */}
            <div className="qual-detail-header">
                <h2 className="qual-detail-title">
                    {targetQual.name} <span className="qual-id">(ID: {targetQual.id})</span>
                </h2>
                {/* 즐겨찾기 상태 아이콘 표시 */}
                {targetQual.favorite && (
                    <span className="detail-favorite-badge" title="관심 자격증">
                        ★
                    </span>
                )}
            </div>

            {/* 상세 정보 격자/목록 구조 */}
            <div className="qual-detail-body">
                
                {/* 1. 시행기관 */}
                <div className="detail-group">
                    <span className="detail-label">시행기관</span>
                    <span className="detail-value">{targetQual.agency || "-"}</span>
                </div>

                {/* 2. 분야 */}
                <div className="detail-group">
                    <span className="detail-label">분야</span>
                    <span className="detail-value">
                        {targetQual.field ? (
                            <span className="field-badge">
                                {targetQual.field}
                            </span>
                        ) : "-"}
                    </span>
                </div>

                {/* 3. 진행 상태 및 D-Day */}
                <div className="detail-group align-center">
                    <span className="detail-label">현재상태 / D-Day</span>
                    <div className="detail-value badge-wrapper">
                        <span className="status-badge">{targetQual.status}</span>
                        <span className={`dday-tag ${isOverdue ? "is-overdue" : "is-urgent"}`}>
                            {dDayText}
                        </span>
                    </div>
                </div>

                {/* 4. 접수 기간 */}
                <div className="detail-group">
                    <span className="detail-label">접수기간</span>
                    <span className="detail-value">
                        {targetQual.applyDate?.start ? `${targetQual.applyDate.start} ~ ${targetQual.applyDate.end}` : "일정 미정"}
                    </span>
                </div>

                {/* 5. 시험일 */}
                <div className="detail-group">
                    <span className="detail-label">시험일자</span>
                    <span className="detail-value">{targetQual.examDate || "일정 미정"}</span>
                </div>

                {/* 6. 합격자 발표일 (보너스 항목) */}
                {targetQual.passDate && (
                    <div className="detail-group">
                        <span className="detail-label">합격발표일</span>
                        <span className="detail-value">{targetQual.passDate}</span>
                    </div>
                )}

                {/* 7. 메모 내용 */}
                <div className="detail-group direction-column">
                    <span className="detail-label">메모</span>
                    <div className="detail-memo-box">
                        {targetQual.memo || "등록된 메모가 없습니다."}
                    </div>
                </div>
            </div>

            {/* 하단 제어 버튼 조작 영역 */}
            <div className="form-actions align-center">
                <button type="button" className="btn btn-cancel" onClick={onClose}>
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
}