import { useState } from "react";
import "./style.css";

// FAQ 목록 데이터 정의
const faqList = [
    {
        question: "자격증은 어떻게 등록하나요?",
        answer: "자격증 등록 메뉴에서 정보를 입력한 뒤 등록 버튼을 누르세요."
    },
    {
        question: "즐겨찾기는 어디에서 확인하나요?",
        answer: "목록에서 즐겨찾기를 누른 뒤 즐겨찾기 메뉴에서 확인할 수 있습니다."
    },
    {
        question: "등록한 내용을 수정할 수 있나요?",
        answer: "자격증 상세정보 또는 목록의 수정 버튼을 이용하세요."
    }
];

function MyPage({ user }) {
    
    // 유저 초기 상태값 설정
    const [userData, setUserData] = useState(() => {
        if (user) return user;

        const currentStorageList = JSON.parse(localStorage.getItem("userList")) || [];
        
        if (savedSession) {
            const sessionUser = JSON.parse(savedSession);
            const myRealData = currentStorageList.find(item => item.id === sessionUser.id);
            if (myRealData) return myRealData;
        }

        return { name: "", id: "", email: "", pw: ""};
    });

    // 🌟 FAQ 아코디언 상태 관리 (클릭한 항목의 인덱스 저장, 다시 누르면 닫힘)
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // 사용자가 입력창에 글자를 타이핑할 때 실행
    function changeUser(event) {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }

    // [저장 버튼]을 누를 때만 로컬스토리지에 최종 반영
    function saveUser(event) {
        event.preventDefault();

        const currentStorageList = JSON.parse(localStorage.getItem("userList")) || [];

        const updatedList = currentStorageList.map((item) => {
            if (item.id === userData.id) {
                return userData; 
            }
            return item;
        });

        localStorage.setItem("userList", JSON.stringify(updatedList));
        localStorage.setItem("qual-user", JSON.stringify(userData));

        alert("내 정보가 안전하게 저장되었습니다!");
    }

    return (
        <section className="mypage-section">
            <h2 className="mypage-title">내 정보</h2>
            
            <form className="mypage-form" onSubmit={saveUser}>
                {/* 1. 이름 */}
                <div className="form-group">
                    <label className="form-label">이름</label>
                    <input 
                        className="form-input" 
                        name="name" 
                        value={userData.name} 
                        onChange={changeUser} 
                    />
                </div>

                {/* 2. 아이디 */}
                <div className="form-group">
                    <label className="form-label">아이디</label>
                    <input 
                        className="form-input readonly-input" 
                        name="id" 
                        value={userData.id} 
                        readOnly 
                    />
                </div>
                
                {/* 3. 이메일 */}
                <div className="form-group">
                    <label className="form-label">이메일</label>
                    <input 
                        className="form-input" 
                        name="email" 
                        type="email" 
                        value={userData.email} 
                        onChange={changeUser} 
                    />
                </div>
                
                {/* 4. 패스워드 */}
                <div className="form-group">
                    <label className="form-label">패스워드</label>
                    <input 
                        className="form-input" 
                        name="pw" 
                        type="password" 
                        value={userData.pw} 
                        onChange={changeUser} 
                    />
                </div>
                
                <button type="submit" className="submit-button">저장</button>
            </form>

            {/* 🌟 ─── 하단 FAQ 섹션 추가 ─── */}
            <hr className="mypage-divider" style={{ margin: "40px 0", border: "none", borderTop: "1px dashed #ccc" }} />
            
            <div className="faq-section">
                <h3 className="faq-title" style={{ marginBottom: "20px", fontSize: "1.5rem" }}>자주 묻는 질문 (FAQ)</h3>
                <div className="faq-container">
                    {faqList.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={index} className={`faq-item ${isOpen ? "is-open" : ""}`} style={{ marginBottom: "12px", border: "1px solid #e0e0e0", borderRadius: "6px" }}>
                                <button
                                    type="button"
                                    className="faq-question-btn"
                                    onClick={() => toggleFaq(index)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "15px",
                                        background: "#f9f9f9",
                                        border: "none",
                                        borderRadius: isOpen ? "6px 6px 0 0" : "6px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        fontSize: "1rem",
                                        fontWeight: "bold"
                                    }}
                                >
                                    <span className="faq-question-text">Q. {faq.question}</span>
                                    <span className="faq-arrow-icon" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                        ▼
                                    </span>
                                </button>
                                
                                {isOpen && (
                                    <div className="faq-answer-box" style={{ padding: "15px", background: "#fff", borderTop: "1px solid #e0e0e0", lineHeight: "1.5", color: "#555" }}>
                                        <p className="faq-answer-text">A. {faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default MyPage;