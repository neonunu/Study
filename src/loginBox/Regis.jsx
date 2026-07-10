import "./style.css"
export default function Regis({ setView }) {

    const handleRegister = (e) => {
        e.preventDefault();

        // 1. 폼 데이터 한 번에 가져오기
        const formData = new FormData(e.currentTarget);

        // 2. 각 input의 name 속성을 기준으로 값 추출하여 딕셔너리 만들기
        const userInfo = {
            name: formData.get("name"),
            id: formData.get("id"),
            pw: formData.get("pw"),
            email: formData.get("email")
        };

        // 3. [수정] 유효성 검사 (userInfo.을 붙여서 딕셔너리 안의 값을 검사합니다)
        if (!userInfo.id || !userInfo.pw || !userInfo.name || !userInfo.email) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        // 4. 로컬스토리지에서 기존 리스트 가져오기
        const currentStorageList = JSON.parse(localStorage.getItem("userList")) || [];

        // 5. [수정] 아이디 중복 체크 (여기도 userInfo.id로 비교해 줍니다)
        const isDuplicate = currentStorageList.some(user => user.id === userInfo.id);
        if (isDuplicate) {
            alert("이미 존재하는 아이디입니다.");
            return;
        }

        // 6. 로컬스토리지에 저장
        const updatedList = [...currentStorageList, userInfo];
        localStorage.setItem("userList", JSON.stringify(updatedList));

        alert("회원가입 성공! 로그인 해주세요.");
        setView("login");
    };

    return (
        <form onSubmit={handleRegister} className="Box">
            <h3>회원가입</h3>
            <div>이름: <input type="text" name="name" /></div>
            <div>ID: <input type="text" name="id" /></div>
            <div>PW: <input type="password" name="pw" /></div>
            <div>이메일: <input type="email" name="email" /></div>
            <button type="submit">가입하기</button>
        </form>
    );
}