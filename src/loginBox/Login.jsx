import "./style.css"
export default function Login({ onLoginSuccess }) {

    const handleLogin = (e) => {
        e.preventDefault();

        // 1. 폼 데이터를 딕셔너리(객체) 형태로 한 번에 가져오기
        const formData = new FormData(e.currentTarget);

        const loginInput = {
            id: formData.get("id"),
            pw: formData.get("pw")
        };

        // 2. 필수 입력값 확인
        if (!loginInput.id || !loginInput.pw) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        // 3. 로컬스토리지에서 회원 목록 가져오기
        const currentStorageList = JSON.parse(localStorage.getItem("userList")) || [];

        // 4. id와 pw가 일치하는 회원 찾기
        const foundUser = currentStorageList.find(
            (user) => user.id === loginInput.id && user.pw === loginInput.pw
        );

        if (foundUser) {
            alert(`${foundUser.name}님, 환영합니다!`);
            onLoginSuccess(foundUser);
        } else {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="Box">
            <h3>로그인</h3>
            <div>
                ID : <input type="text" name="id" placeholder="아이디" />
            </div>
            <div>
                PW : <input type="password" name="pw" placeholder="비밀번호" />
            </div>
            <button type="submit">로그인</button>
        </form>
    );
}