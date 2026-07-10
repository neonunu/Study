import "./style.css"
import { useState } from "react";
import Login from "./Login";
import Regis from "./Regis";
import MainPage from "../components/MainPage";


export default function LoginPage() {
    const [view, setView] = useState("login");
    const [currentUser, setCurrentUser] = useState(null);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user); // 로그인한 유저 정보 저장
        setView("MainPage");    // 화면을 마이페이지로 변경
    };

    // ⭕ [핵심 변경] 만약 현재 view가 mypage라면, 아래의 Welcome 껍데기를 다 무시하고 
    // 오직 MyPage 컴포넌트만 통째로 리턴하여 주소가 이동한 효과를 줍니다.
    if (view === "MainPage") {
        return <MainPage userIN={currentUser} />;
    }

    // view가 login이나 register일 때만 이 아래의 Welcome 화면이 렌더링됩니다.
    return (
        <div className="loginPageBox">
            <h2>Welcome</h2>

            <div className="loginBtnBox">
                <button onClick={() => setView("login")} disabled={view === "login"} className="loginPageBtn">
                    로그인
                </button>
                <button onClick={() => setView("register")} disabled={view === "register"} className="loginPageBtn">
                    회원가입
                </button>
            </div>

            {/* view 상태에 따른 화면 렌더링 */}
            {view === "login" && (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}

            {view === "register" && (
                <Regis setView={setView} />
            )}
        </div>
    );
}