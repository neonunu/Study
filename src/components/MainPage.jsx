import { Link, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import MyPage from "./MyPage";
import Dashboard from "./Dashboard";
import QualSearch from "../qualificationsData/QualSearch";
import QualAdd from "../qualificationsData/QualAdd";
import QualList from "../qualificationsData/QualList";
import QualFavor from "../qualificationsData/QualFavor";
import "./style.css" 

export default function MainPage({ userIN }) {
    const [userData, setUserData] = useState(userIN);
    const [qualList, setQualList] = useState(() => {
        const saved = localStorage.getItem("myQualifications");
        return saved ? JSON.parse(saved) : [];
    });
    const [page, setPage] = useState("search");

    return (
        <>
            <nav className="nvaBar">
                <Link to={"/"}> 대쉬보드 </Link>
                <Link to={"/QualSearch"}> 자격증 검색 </Link>
                <Link to={"/QualList"}> 자격증 목록 </Link>
                <Link to={"/QualAdd"}> 자격증 등록 </Link>
                <Link to={"/QualFavor"}> 즐겨찾기 </Link>
                <Link to={"/MyPage"}> 나의 정보 </Link>
            </nav>

            <Routes>
                <Route path="/" element={<Dashboard />} />

                <Route path="/QualSearch" element={
                    <QualSearch qualList={qualList} setQualList={setQualList} setPage={setPage} />
                } />

                <Route path="/QualList" element={
                    <QualList qualList={qualList} setQualList={setQualList} />
                } />

                <Route path="/QualAdd" element={
                    <QualAdd qualList={qualList} setQualList={setQualList} />
                } />

                <Route path="/QualFavor" element={
                    <QualFavor qualList={qualList} setQualList={setQualList} />
                } />

                <Route path="/MyPage" element={<MyPage user={userData} />} />
            </Routes>
        </>
    );
}