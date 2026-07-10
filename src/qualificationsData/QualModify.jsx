import { useState } from "react";
import { updateQualSchedule } from "../utils/dateUtils";

export default function QualModify({ targetQual, onCancel, onSave, setQualList }) {
    // applyDate 객체 구조를 분리하여 폼 필드와 매핑 (★ favorite 제거, field 유지)
    const [qual, setQual] = useState({
        ...targetQual,
        field: targetQual.field || "",
        start: targetQual.applyDate?.start || "",
        end: targetQual.applyDate?.end || "",
        memo: targetQual.memo || ""
    });

    // 🌟 분야 선택 옵션 유지
    const seriesOptions = [
        { label: "컴퓨터", value: "40" },
        { label: "정보통신", value: "41" },
        { label: "전기·전자", value: "43" },
        { label: "사무·경영", value: "01" },
        { label: "기계", value: "44" },
        { label: "건축", value: "55" },
        { label: "화학", value: "51" },
        { label: "식품", value: "26" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQual({
            ...qual,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!qual.name.trim() || !qual.agency.trim()) {
            alert("자격증명과 시행기관은 필수 입력 사항입니다!");
            return;
        }

        const storedData = localStorage.getItem("myQualifications");
        const qualList = storedData ? JSON.parse(storedData) : [];

        // 기존에 저장되어 있던 favorite 값을 유지하기 위해 targetQual.favorite 병합
        const updatedQual = updateQualSchedule({
            ...qual,
            favorite: targetQual.favorite, 
            applyDate: { start: qual.start, end: qual.end }
        });

        const updatedList = qualList.map((item) =>
            item.id === qual.id ? updatedQual : item
        );

        localStorage.setItem("myQualifications", JSON.stringify(updatedList));
        setQualList(updatedList); // 부모 상태 갱신

        alert(`${qual.name} 자격증 정보가 수정되었습니다.`);
        onSave(); // 수정 완료 후 목록으로 복귀
    };

    return (
        <div className="qual-modify-container">
            {/* ─── 상단 헤더 (관심목록 버튼 제거) ─── */}
            <div className="qual-modify-header">
                <h2 className="qual-modify-title">
                    자격증 수정 <span className="qual-id">(ID: {qual.id})</span>
                </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="qual-modify-form">
                {/* 1. 자격증명 */}
                <div className="form-group">
                    <label className="form-label">자격증명 <span className="required-star">*</span></label>
                    <input 
                        type="text" 
                        name="name" 
                        value={qual.name} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                    />
                </div>
                
                {/* 2. 시행기관 */}
                <div className="form-group">
                    <label className="form-label">시행기관 <span className="required-star">*</span></label>
                    <input 
                        type="text" 
                        name="agency" 
                        value={qual.agency} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                    />
                </div>

                {/* 3. 분야 선택 (유지) */}
                <div className="form-group">
                    <label className="form-label">분야</label>
                    <select 
                        className="form-select" 
                        name="field" 
                        value={qual.field} 
                        onChange={handleChange}
                    >
                        <option value="">-- 분야 선택 --</option>
                        {seriesOptions.map((opt) => (
                            <option key={opt.value} value={opt.label}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                
                {/* 4. 시험일 */}
                <div className="form-group">
                    <label className="form-label">시험일</label>
                    <input 
                        type="date" 
                        name="examDate" 
                        value={qual.examDate} 
                        onChange={handleChange} 
                        className="form-input" 
                    />
                </div>

                {/* 5. 접수 일정 */}
                <div className="form-row" style={{ display: "flex", gap: "10px" }}>
                    <div className="form-group flex-1" style={{ flex: 1 }}>
                        <label className="form-label">접수 시작일</label>
                        <input 
                            type="date" 
                            name="start" 
                            value={qual.start} 
                            onChange={handleChange} 
                            className="form-input" 
                        />
                    </div>
                    <div className="form-group flex-1" style={{ flex: 1 }}>
                        <label className="form-label">접수 종료일</label>
                        <input 
                            type="date" 
                            name="end" 
                            value={qual.end} 
                            onChange={handleChange} 
                            className="form-input" 
                        />
                    </div>
                </div>

                {/* 6. 메모 */}
                <div className="form-group">
                    <label className="form-label">메모</label>
                    <textarea 
                        name="memo" 
                        value={qual.memo} 
                        onChange={handleChange} 
                        className="form-textarea" 
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-submit">수정완료</button>
                    <button type="button" onClick={onCancel} className="btn btn-cancel">취소</button>
                </div>
            </form>
        </div>
    );
}