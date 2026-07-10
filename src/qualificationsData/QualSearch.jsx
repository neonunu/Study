import { useState } from "react";
import { updateQualSchedule } from "../utils/dateUtils";
import "./style.css";

const QNET_API_URL =
    "/qnet/api/service/rest/InquiryTestDatesNationalProfessionalQualificationSVC/getList";

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

function formatDate(dateText) {
    if (!dateText || dateText.length !== 8) return "";
    return `${dateText.slice(0, 4)}-${dateText.slice(4, 6)}-${dateText.slice(6, 8)}`;
}

function getText(item, tagName) {
    return item.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
}

function parseQualList(xmlText, seriesCd) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    if (xml.getElementsByTagName("parsererror").length > 0) {
        throw new Error("XML parsing failed");
    }

    // 🌟 추가: seriesCd에 대응하는 한글 분야(label) 매핑 찾기
    const matchedSeries = seriesOptions.find((opt) => opt.value === seriesCd);
    const fieldLabel = matchedSeries ? matchedSeries.label : "";

    return Array.from(xml.getElementsByTagName("item")).map((item, index) => {
        const start = formatDate(getText(item, "examregstartdt"));
        const end = formatDate(getText(item, "examregenddt"));

        return {
            id: `qnet-${seriesCd}-${index}`,
            name: getText(item, "description"),
            agency: "한국산업인력공단",
            field: fieldLabel, // 🌟 기존 빈 문자열("")에서 한글 분야 이름으로 저장되도록 변경!
            applyDate: { start: start, end: end },
            examDate: formatDate(getText(item, "examstartdt")),
            passDate: formatDate(getText(item, "passstartdt")),
            favorite: false,
            memo: ""
        };
    });
}

function removeDuplicateQuals(qualList) {
    const qualMap = new Map();
    qualList.forEach((qual) => {
        const key = `${qual.name}-${qual.applyDate.start}-${qual.examDate}`;
        if (!qualMap.has(key)) {
            qualMap.set(key, qual);
        }
    });
    return Array.from(qualMap.values());
}

export default function QualSearch({ qualList, setQualList, setPage }) {
    const [search, setSearch] = useState("");
    const [selectedSeriesList, setSelectedSeriesList] = useState(["43"]);
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const filteredList = searchList.filter(
        (qual) =>
            qual.name.includes(search) ||
            qual.agency.includes(search) ||
            qual.field.includes(search)
    );

    function changeSeries(event) {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedSeriesList([...selectedSeriesList, value]);
            return;
        }
        setSelectedSeriesList(selectedSeriesList.filter((seriesCd) => seriesCd !== value));
    }

    async function fetchQualsBySeries(seriesCd) {
        const apiKey = import.meta.env.VITE_QNET_API_KEY;
        const params = new URLSearchParams({ seriesCd, ServiceKey: apiKey });
        const response = await fetch(`${QNET_API_URL}?${params.toString()}`);

        if (!response.ok) throw new Error(`${seriesCd} 계열 API 요청 실패`);

        const xmlText = await response.text();
        return parseQualList(xmlText, seriesCd);
    }

    async function searchQuals() {
        if (selectedSeriesList.length === 0) {
            setSearchList([]);
            setError("계열을 하나 이상 선택해주세요.");
            setSearched(true);
            return;
        }

        setLoading(true);
        setError("");
        setSearched(true);

        try {
            const results = await Promise.all(
                selectedSeriesList.map((seriesCd) => fetchQualsBySeries(seriesCd))
            );

            const flatResults = results.flat();
            const uniqueResults = removeDuplicateQuals(flatResults);

            setSearchList(uniqueResults);
        } catch (err) {
            console.error("조회 에러 상세:", err);
            setSearchList([]);
            setError("공공데이터 조회에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    }

    function addQual(selectedQual) {
        const alreadyAdded = qualList.find((qual) => qual.name === selectedQual.name);
        if (alreadyAdded) {
            alert("이미 내 목록에 있는 자격증입니다.");
            return;
        }

        const nextId = qualList.length === 0 ? 1 : Math.max(...qualList.map((q) => q.id)) + 1;

        // 🌟 selectedQual에 이미 field 데이터("컴퓨터", "전기·전자" 등)가 들어있으므로 구조 분해 시 그대로 함께 넘어갑니다.
        const newQual = updateQualSchedule({ ...selectedQual, id: nextId });
        const updatedList = [...qualList, newQual];

        setQualList(updatedList);
        localStorage.setItem("myQualifications", JSON.stringify(updatedList));

        alert(`${selectedQual.name}(이)가 내 목록에 추가되었습니다.`);
    }

    return (
        <section className="search-section">
            <h2 className="search-title">자격증 검색</h2>
            
            <div className="search-bar-container">
                <input
                    className="form-input search-input"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="찾고 싶은 자격증을 입력하세요"
                />
                <button 
                    type="button" 
                    className="submit-button search-button" 
                    onClick={searchQuals} 
                    disabled={loading}
                >
                    {loading ? "조회 중..." : "검색"}
                </button>
            </div>

            <div className="series-filter-box">
                <p className="filter-box-title">관심 계열 선택</p>
                <div className="checkbox-group">
                    {seriesOptions.map((series) => (
                        <label className="checkbox-label" key={series.value}>
                            <input
                                type="checkbox"
                                className="filter-checkbox"
                                value={series.value}
                                checked={selectedSeriesList.includes(series.value)}
                                onChange={changeSeries}
                            />
                            <span className="checkbox-text">{series.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {loading && <p className="status-message loading-text">🔄 공공데이터를 조회하고 있습니다...</p>}
            {error && <p className="status-message error-text">⚠️ {error}</p>}

            {!loading && !error && searched && filteredList.length === 0 && (
                <p className="empty-message">검색 결과가 없습니다. 다른 조건으로 검색해보세요.</p>
            )}

            {!loading && !error && filteredList.length > 0 && (
                <div className="search-result-grid">
                    {filteredList.map((qual) => (
                        <div className="result-card" key={qual.id}>
                            <div className="card-main">
                                <h3 className="result-card-title">{qual.name}</h3>
                                {qual.field && <span className="search-field-badge" style={{
                                    display: "inline-block",
                                    backgroundColor: "#e8f5e9",
                                    color: "#2e7d32",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "0.8rem",
                                    marginBottom: "10px",
                                    fontWeight: "bold"
                                }}>{qual.field}</span>}
                                <div className="result-card-details">
                                    <p className="detail-item">
                                        <span className="detail-label">시험일:</span> 
                                        <span className="detail-value">{qual.examDate || "미정"}</span>
                                    </p>
                                    <p className="detail-item">
                                        <span className="detail-label">접수기간:</span> 
                                        <span className="detail-value">
                                            {qual.applyDate.start ? `${qual.applyDate.start} ~ ${qual.applyDate.end}` : "미정"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                className="btn-add-list" 
                                onClick={() => addQual(qual)}
                            >
                                ➕ 내 목록에 추가
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}