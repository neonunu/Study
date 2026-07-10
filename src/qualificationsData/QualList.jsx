import { useEffect, useState } from "react";
import QualModify from "./QualModify";
import QualDetail from "./QualDetail"; // 🌟 상세페이지 컴포넌트 임포트
import "./style.css";

export default function QualList({ qualList, setQualList }) {
    const [list, setList] = useState(qualList);
    const [filterInterest, setFilterInterest] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    // ─── 상태 관리 추가 ───
    const [isEditing, setIsEditing] = useState(false);
    const [editingTarget, setEditingTarget] = useState(null);
    const [isViewingDetail, setIsViewingDetail] = useState(false); // 🌟 상세페이지 오픈 여부
    const [detailTarget, setDetailTarget] = useState(null);       // 🌟 상세페이지로 보낼 자격증 데이터

    useEffect(() => {
        // 기존의 외부 유틸 함수 대신 목록 내부 렌더링 시점에 실시간으로 계산하도록 깔끔하게 정돈합니다.
        setList(qualList);
    }, [qualList]);

    const handleToggleFavorite = (id) => {
        const updatedList = qualList.map((item) =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
        );
        setQualList(updatedList);
        localStorage.setItem("myQualifications", JSON.stringify(updatedList));
    };

    const handleDelete = (id) => {
        if (!window.confirm("정말 이 자격증을 삭제하시겠습니까?")) return;
        const filteredList = qualList.filter((item) => item.id !== id);
        setQualList(filteredList);
        localStorage.setItem("myQualifications", JSON.stringify(filteredList));
    };

    // ─── 수정 핸들러 ───
    const handleEditStart = (item) => {
        setEditingTarget(item);
        setIsEditing(true);
    };

    const handleEditEnd = () => {
        setIsEditing(false);
        setEditingTarget(null);
    };

    // 🌟 ─── 상세 보기 핸들러 신설 ───
    const handleDetailStart = (item) => {
        setDetailTarget(item);
        setIsViewingDetail(true);
    };

    const handleDetailEnd = () => {
        setIsViewingDetail(false);
        setDetailTarget(null);
    };

    const filteredList = list.filter((item) => {
        const matchInterest = filterInterest === "" || item.field === filterInterest;
        let matchDate = true;

        if (item.examDate) {
            const examDate = new Date(item.examDate);
            if (filterStartDate && examDate < new Date(filterStartDate)) matchDate = false;
            if (filterEndDate && examDate > new Date(filterEndDate)) matchDate = false;
        }
        return matchInterest && matchDate;
    });

    // ─── 조건부 렌더링 1: 수정 모드 ───
    if (isEditing) {
        return (
            <QualModify
                targetQual={editingTarget}
                onCancel={handleEditEnd}
                onSave={handleEditEnd}
                setQualList={setQualList}
            />
        );
    }

    // 🌟 ─── 조건부 렌더링 2: 상세 정보 모드 ───
    if (isViewingDetail) {
        return (
            <QualDetail
                targetQual={detailTarget}
                onClose={handleDetailEnd}
            />
        );
    }

    return (
        <section className="quallist-section">
            <h2 className="quallist-title">내 자격증 목록</h2>

            {/* ─── 상단 필터 컨트롤 박스 ─── */}
            <div className="filter-container">
                <div className="filter-group">
                    <label className="filter-label">분야선택</label>
                    <select
                        className="form-select filter-select"
                        value={filterInterest}
                        onChange={(e) => setFilterInterest(e.target.value)}
                    >
                        <option value="">전체보기</option>
                        <option value="컴퓨터">컴퓨터</option>
                        <option value="정보통신">정보통신</option>
                        <option value="전기·전자">전기·전자</option>
                        <option value="사무·경영">사무·경영</option>
                        <option value="기계">기계</option>
                        <option value="건축">건축</option>
                        <option value="화학">화학</option>
                        <option value="식품">식품</option>
                    </select>
                </div>

                <span className="filter-divider">|</span>

                <div className="filter-group">
                    <label className="filter-label">시험일 범위</label>
                    <div className="filter-date-wrapper">
                        <input
                            type="date"
                            className="form-input filter-date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                        />
                        <span className="date-wave">~</span>
                        <input
                            type="date"
                            className="form-input filter-date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ─── 결과 리스트 테이블 ─── */}
            {filteredList.length === 0 ? (
                <p className="empty-message">조건에 맞는 자격증이 없습니다.</p>
            ) : (
                <div className="table-responsive">
                    <table className="quallist-table">
                        <thead className="table-head">
                            <tr>
                                <th className="table-th text-center">즐겨찾기</th>
                                <th className="table-th">자격증명</th>
                                <th className="table-th text-center">분야</th>
                                <th className="table-th text-center">상태</th>
                                <th className="table-th text-center">시험일</th>
                                <th className="table-th text-center">접수기간</th>
                                <th className="table-th text-center">D-Day</th>
                                <th className="table-th">메모</th>
                                <th className="table-th text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredList.map((item) => {
                                const numericDday = item.dDay !== null ? Number(item.dDay) : null;
                                const isOverdue = numericDday !== null && numericDday < 0;

                                let dDayText = "일정 미정";
                                if (numericDday !== null) {
                                    if (numericDday === 0) dDayText = "D-Day";
                                    else if (numericDday < 0) dDayText = `D+${Math.abs(numericDday)}`;
                                    else dDayText = `D-${numericDday}`;
                                }

                                return (
                                    <tr className="table-row" key={item.id}>
                                        <td className="table-td text-center">
                                            <button
                                                type="button"
                                                className={`btn-favorite ${item.favorite ? "is-active" : ""}`}
                                                onClick={() => handleToggleFavorite(item.id)}
                                            >
                                                {item.favorite ? "★" : "☆"}
                                            </button>
                                        </td>
                                        {/* 🌟 자격증명 영역 클릭 인터랙션 구현 */}
                                        <td className="table-td exam-name">
                                            <span
                                                onClick={() => handleDetailStart(item)}
                                                className="clickable-qual-name"
                                            >
                                                {item.name}
                                            </span>
                                        </td>
                                        <td className="table-td text-center qual-field-cell">
                                            <span className="field-badge" style={{
                                                backgroundColor: "#f0f2f5",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                color: "#4e5968"
                                            }}>
                                                {item.field || "-"}
                                            </span>
                                        </td>
                                        <td className="table-td text-center">
                                            <span className="status-badge">{item.status}</span>
                                        </td>
                                        <td className="table-td text-center">{item.examDate || "미정"}</td>
                                        <td className="table-td text-center date-period">
                                            {item.applyDate?.start ? `${item.applyDate.start} ~ ${item.applyDate.end}` : "미정"}
                                        </td>
                                        <td className="table-td text-center">
                                            <span className={`dday-tag ${isOverdue ? "is-overdue" : "is-urgent"}`}>
                                                {dDayText}
                                            </span>
                                        </td>
                                        <td className="table-td memo-cell">{item.memo || "-"}</td>
                                        <td className="table-td text-center">
                                            <div className="action-buttons">
                                                <button
                                                    type="button"
                                                    className="btn-action btn-edit"
                                                    onClick={() => handleEditStart(item)}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
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