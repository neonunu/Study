import { useState } from "react";
import { updateQualSchedule } from "../utils/dateUtils";
import "./style.css";

export default function QualAdd({ qualList, setQualList }) {
    // 🌟 데이터 속성명 통일 및 applyDate 객체 구조로 초기화
    const [qual, setQual] = useState({
        name: "",
        agency: "",
        field: "",
        status: "접수대기",
        start: "", // 접수 시작일
        end: "",   // 접수 종료일
        examDate: "",
        memo: "",
        favorite: false
    });

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

        // 1. 고유 ID 생성 (기존 목록의 최대 ID + 1)
        const nextId = qualList.length === 0 ? 1 : Math.max(...qualList.map((q) => q.id)) + 1;

        // 2. 입력된 데이터를 바탕으로 상태(status)와 D-Day 자동 계산
        // applyDate를 { start, end } 객체 구조로 묶어서 전달
        const newQual = updateQualSchedule({
            ...qual,
            id: nextId,
            applyDate: { start: qual.start, end: qual.end }
        });

        // 3. 전체 목록 업데이트
        const updatedList = [...qualList, newQual];
        setQualList(updatedList);

        // 4. 로컬스토리지에 저장
        localStorage.setItem("myQualifications", JSON.stringify(updatedList));

        alert(`${qual.name}이(가) 등록되었습니다!`);

        // 5. 폼 초기화
        setQual({
            name: "",
            agency: "",
            field: "",
            status: "접수대기",
            start: "",
            end: "",
            examDate: "",
            memo: "",
            favorite: false
        });
    };

    return (
        <section className="qual-add-section">
            <h2 className="qual-add-title">자격증 등록</h2>
            
            <form className="qual-add-form" onSubmit={handleSubmit}>
                {/* 1. 자격증명 */}
                <div className="form-group">
                    <label className="form-label">자격증명 <span className="required-star">*</span></label>
                    <input 
                        type="text" 
                        className="form-input" 
                        name="name" 
                        value={qual.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {/* 2. 시행기관 */}
                <div className="form-group">
                    <label className="form-label">시행기관 <span className="required-star">*</span></label>
                    <input 
                        type="text" 
                        className="form-input" 
                        name="agency" 
                        value={qual.agency} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {/* 3. 분야 선택 */}
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
                        className="form-input" 
                        name="examDate" 
                        value={qual.examDate} 
                        onChange={handleChange} 
                    />
                </div>

                {/* 5. 접수 일정 (시작일 & 종료일 나란히 배치용 row 구조) */}
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label className="form-label">접수 시작일</label>
                        <input 
                            type="date" 
                            className="form-input" 
                            name="start" 
                            value={qual.start} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label className="form-label">접수 종료일</label>
                        <input 
                            type="date" 
                            className="form-input" 
                            name="end" 
                            value={qual.end} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                {/* 6. 메모 */}
                <div className="form-group">
                    <label className="form-label">메모</label>
                    <textarea 
                        className="form-textarea" 
                        name="memo" 
                        value={qual.memo} 
                        onChange={handleChange} 
                        rows="4"
                    />
                </div>

                <button type="submit" className="submit-button">등록하기</button>
            </form>
        </section>
    );
}