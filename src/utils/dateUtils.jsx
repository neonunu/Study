const DAY_TIME = 1000 * 60 * 60 * 24;

function parseDate(dateText) {
  if (!dateText) return null;
  // 문자열인 경우 분리
  if (typeof dateText === "string") {
    const [year, month, date] = dateText.split("-").map(Number);
    if (!year || !month || !date) return null;
    return new Date(year, month - 1, date);
  }
  // 이미 Date 객체인 경우 그대로 반환
  if (dateText instanceof Date) return dateText;
  return null;
}

function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// 🌟 접수 기간을 각각의 Date 객체로 직접 반환
export function parseApplyDate(applyDate) {
  if (!applyDate || typeof applyDate !== 'object') {
    return { startDate: null, endDate: null };
  }
  return {
    startDate: parseDate(applyDate.start),
    endDate: parseDate(applyDate.end)
  };
}

export function calculateDDay(examDate) {
  const exam = parseDate(examDate);
  if (!exam) return null;
  return Math.ceil((exam.getTime() - getToday().getTime()) / DAY_TIME);
}

export function calculateStatus(applyDateObj, examDate) {
  const today = getToday();
  const exam = parseDate(examDate);
  
  // applyDateObj가 { start, end } 형태라고 가정
  const startDate = parseDate(applyDateObj?.start);
  const endDate = parseDate(applyDateObj?.end);

  if (!exam || !startDate || !endDate) return "접수예정";
  if (today < startDate) return "접수예정";
  if (today >= startDate && today <= endDate) return "접수중";
  if (today >= exam) return "시험완료";
  return "시험예정";
}

export function updateQualSchedule(qual) {
  return {
    ...qual,
    dDay: calculateDDay(qual.examDate),
    // 이제 applyDate는 객체 형태 { start: "2026-06-01", end: "2026-06-10" }를 기대합니다.
    status: calculateStatus(qual.applyDate, qual.examDate)
  };
}

export function updateQualScheduleList(qualList) {
  return qualList.map((qual) => updateQualSchedule(qual));
}

// ... sortQualsByExamDate 및 getUpcomingQuals는 동일