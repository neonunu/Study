# Streamlit MPG 데이터 분석 실습

`Streamlit`, `pandas`, `seaborn`, `matplotlib`, `Plotly`를 사용해 SUV 제조사별 평균 고속도로 연비를 분석하고 시각화하는 실습

> 사용자가 작성한 코드는 변경하지 않고 그대로 수록. 코드 설명과 실행 시 참고사항만 별도 구역으로 정리

## 주요 기능

- 텍스트, 제목, 이미지, YouTube 영상 출력
- `mpg.csv` 데이터 읽기
- SUV 데이터 필터링
- 제조사별 평균 고속도로 연비 계산
- Seaborn과 Plotly 막대그래프 출력
- 탭과 사이드바 선택 메뉴 구성

## 프로젝트 구성

```text
streamlit-mpg-dashboard/
├── 1027.py
├── mpg.csv
├── requirements.txt
└── README.md
```

`1027.py`와 `mpg.csv`를 같은 폴더에 배치

## 설치 방법

```bash
pip install streamlit pandas seaborn matplotlib plotly
```

`requirements.txt` 예시:

```text
streamlit
pandas
seaborn
matplotlib
plotly
```

## 실행 방법

```bash
streamlit run 1027.py
```

## 원본 전체 코드

아래 코드는 사용자가 제공한 내용을 수정하지 않고 그대로 옮긴 코드다.

```python
#streamlit run 1027.py
import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px

st.text("hello, world")
st.title('Title...')
st.image('https://www.google.com/imgres?q=로또&imgurl=https%3A%2F%2Fplay-lh.googleusercontent.com%2Ffl2jATc73P-lz7iHlq0TuSvoJLhFOwJ-ZgcnUE82KFTbTnR4x8I7FlOcMylkqKkixXuByL2xE73hC_e0d-HI&imgrefurl=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.posko777.tools.lotto%26hl%3Dko&docid=-S1lEvcvWYIzkM&tbnid=dLnnwm2dEPzvGM&vet=12ahUKEwik7fXTlNmXAxW3juEIHc8YHNIQnPAOegQINxAA..i&w=512&h=512&hcb=2&ved=2ahUKEwik7fXTlNmXAxW3juEIHc8YHNIQnPAOegQINxAA')
st.video('https://youtu.be/1wHHlFE6M9U?si=BLYyFRhczzPXVoV9')

# mpg.csv읽기, dataframe을 화면에 찍는다. 회사별 suv 평균 하이웨이 연비를 찍는다

mpg = pd.read_csv('mpg.csv')
st.dataframe(mpg.query('category == "suv"').groupby('manufacturer').agg(mean_hwy = ('hwy', 'mean')))

result1 = mpg.query('category == "suv"')
result2 = result1.groupby('manufacturer', as_index=False).agg(hwy_mean = ('hwy','mean'))

st.dataframe(result1.head())
st.dataframe(result2.head())

figure1 = plt.figure()
sns.barplot(data=result2,
            x='manufacturer', 
            y='hwy_mean')
st.pyplot(figure1)


chart1 = px.bar(data_frame=result2,
            x='manufacturer', 
            y='hwy_mean')
st.plotly_chart(chart1)

selected_tab1, selected_tab2, selected_tab3 = st.tabs(['tab1', 'tab2', 'tab3'])

with selected_tab1:
    #cat image
    st.text('cat')
    st.image("https://ncsplus.co.kr/_img/ssis/khwis7_0131_001.jpg")
with selected_tab2:
    #dog image
    st.text('cat')
    st.image("https://i.namu.wiki/i/eBKwaGKKWQpqao2rfPiNvPYVeSizoRs0NoWKQbtE_F72RZCtZ5Nl-U1SyjOmSlfSUo5FvtXKD9YXTB377zejqQ.svg")
with selected_tab3:
    #panda image
    st.text('panda')
    st.image("https://cdn.itdaily.kr/news/photo/201603/76702_82937_2010.jpg")

    selected_menu = st.sidebar.selectbox('title', 
                     ['tab1 analyzing', 
                      'tab2 analyzing', 
                      'tab3 analyzing'])

if selected_menu == 'tab1 analyzing':
    #사회보장 진흥원 관련   
    st.text('tab1')
    st.image("https://ncsplus.co.kr/_img/ssis/khwis7_0131_001.jpg")

elif selected_menu == 'tab2 analyzing':
    st.text('tab2')
    st.image("https://i.namu.wiki/i/eBKwaGKKWQpqao2rfPiNvPYVeSizoRs0NoWKQbtE_F72RZCtZ5Nl-U1SyjOmSlfSUo5FvtXKD9YXTB377zejqQ.svg")
elif selected_menu == 'tab3 analyzing':
    st.text('tab3')
    st.image("https://cdn.itdaily.kr/news/photo/201603/76702_82937_2010.jpg")
```

## 구역별 코드 설명

### 1구역: 라이브러리 불러오기

```python
import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
```

**`streamlit`**: Python 코드를 웹 애플리케이션으로 출력

**`pandas`**: CSV 데이터 읽기, 필터링, 그룹화

**`seaborn`과 `matplotlib`**: 정적인 데이터 그래프 생성

**`plotly.express`**: 마우스를 올려 값을 확인할 수 있는 인터랙티브 그래프 생성

### 2구역: 텍스트와 미디어 출력

```python
st.text("hello, world")
st.title('Title...')
st.image('https://www.google.com/imgres?q=로또&imgurl=https%3A%2F%2Fplay-lh.googleusercontent.com%2Ffl2jATc73P-lz7iHlq0TuSvoJLhFOwJ-ZgcnUE82KFTbTnR4x8I7FlOcMylkqKkixXuByL2xE73hC_e0d-HI&imgrefurl=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.posko777.tools.lotto%26hl%3Dko&docid=-S1lEvcvWYIzkM&tbnid=dLnnwm2dEPzvGM&vet=12ahUKEwik7fXTlNmXAxW3juEIHc8YHNIQnPAOegQINxAA..i&w=512&h=512&hcb=2&ved=2ahUKEwik7fXTlNmXAxW3juEIHc8YHNIQnPAOegQINxAA')
st.video('https://youtu.be/1wHHlFE6M9U?si=BLYyFRhczzPXVoV9')
```

- `st.text()`: 일반 텍스트 출력
- `st.title()`: 가장 큰 제목 출력
- `st.image()`: 이미지 주소의 이미지 출력
- `st.video()`: YouTube 주소의 영상 출력

### 3구역: CSV 데이터 읽기와 즉시 집계

```python
# mpg.csv읽기, dataframe을 화면에 찍는다. 회사별 suv 평균 하이웨이 연비를 찍는다

mpg = pd.read_csv('mpg.csv')
st.dataframe(mpg.query('category == "suv"').groupby('manufacturer').agg(mean_hwy = ('hwy', 'mean')))
```

실행 흐름:

```text
mpg.csv 읽기
→ category가 suv인 행 선택
→ manufacturer별 그룹 생성
→ 각 그룹의 hwy 평균 계산
→ Streamlit 데이터프레임으로 출력
```

한 줄 안에서 필터링, 그룹화, 평균 계산, 화면 출력을 모두 처리하는 코드

### 4구역: 분석 과정을 두 단계로 분리

```python
result1 = mpg.query('category == "suv"')
result2 = result1.groupby('manufacturer', as_index=False).agg(hwy_mean = ('hwy','mean'))

st.dataframe(result1.head())
st.dataframe(result2.head())
```

**`result1`**: 전체 자동차 중 `category`가 `suv`인 행만 저장

**`result2`**: `result1`을 제조사별로 그룹화하고 `hwy` 평균 계산

**`as_index=False`**: `manufacturer`를 인덱스가 아닌 일반 열로 유지

**`head()`**: 데이터프레임의 앞부분 5행 확인

### 5구역: Seaborn 막대그래프

```python
figure1 = plt.figure()
sns.barplot(data=result2,
            x='manufacturer', 
            y='hwy_mean')
st.pyplot(figure1)
```

1. `plt.figure()`로 그래프를 그릴 공간 생성
2. `sns.barplot()`으로 제조사별 평균 고속도로 연비 표현
3. `st.pyplot()`으로 Matplotlib 그래프를 Streamlit 화면에 출력

- x축: 제조사 `manufacturer`
- y축: 평균 고속도로 연비 `hwy_mean`

### 6구역: Plotly 막대그래프

```python
chart1 = px.bar(data_frame=result2,
            x='manufacturer', 
            y='hwy_mean')
st.plotly_chart(chart1)
```

`px.bar()`로 같은 분석 결과를 인터랙티브 막대그래프로 생성. 사용자가 막대 위에 마우스를 올려 정확한 값 확인 가능

### 7구역: 탭 생성

```python
selected_tab1, selected_tab2, selected_tab3 = st.tabs(['tab1', 'tab2', 'tab3'])
```

`st.tabs()`가 세 개의 탭을 만들고 각 탭 객체를 다음 변수에 차례대로 저장

| 탭 이름 | 저장 변수 |
| --- | --- |
| `tab1` | `selected_tab1` |
| `tab2` | `selected_tab2` |
| `tab3` | `selected_tab3` |

### 8구역: 탭별 이미지 출력

```python
with selected_tab1:
    #cat image
    st.text('cat')
    st.image("https://ncsplus.co.kr/_img/ssis/khwis7_0131_001.jpg")
with selected_tab2:
    #dog image
    st.text('cat')
    st.image("https://i.namu.wiki/i/eBKwaGKKWQpqao2rfPiNvPYVeSizoRs0NoWKQbtE_F72RZCtZ5Nl-U1SyjOmSlfSUo5FvtXKD9YXTB377zejqQ.svg")
with selected_tab3:
    #panda image
    st.text('panda')
    st.image("https://cdn.itdaily.kr/news/photo/201603/76702_82937_2010.jpg")
```

`with selected_tab1:` 아래의 Streamlit 명령은 첫 번째 탭에 출력. 두 번째와 세 번째 탭도 같은 방식으로 동작

`with` 블록 안의 들여쓰기는 어떤 탭에 출력할지를 구분하므로 그대로 유지해야 한다.

### 9구역: 사이드바 선택 메뉴

```python
    selected_menu = st.sidebar.selectbox('title', 
                     ['tab1 analyzing', 
                      'tab2 analyzing', 
                      'tab3 analyzing'])
```

**`st.sidebar.selectbox()`**: 화면 왼쪽 사이드바에 선택 메뉴 생성

사용자가 선택한 문자열을 `selected_menu` 변수에 저장

#### 사이드바에 자료를 넣는 방법

`selectbox` 외의 텍스트, 이미지, 표, 차트도 사이드바에 출력 가능. 방식은 두 가지

> 아래 예시 코드는 실행 전 예시

**방법 1: `st.sidebar.` 접두사**

위젯 앞에 `st.sidebar.`를 붙여 하나씩 사이드바에 출력

```python
import streamlit as st
import pandas as pd

selected_menu = st.sidebar.selectbox('title', ['홈', '데이터', '차트'])

st.sidebar.write("설명 텍스트")
st.sidebar.image("logo.png")
st.sidebar.dataframe(pd.DataFrame({'a': [1, 2], 'b': [3, 4]}))
```

**방법 2: `with st.sidebar:` 블록**

블록 안의 일반 `st.` 명령을 모두 사이드바에 출력. 여러 요소를 한꺼번에 넣을 때 유리

```python
with st.sidebar:
    selected_menu = st.selectbox('title', ['홈', '데이터', '차트'])
    st.markdown("### 필터")
    year = st.slider('연도', 2020, 2026, 2024)
    df = pd.read_csv('data.csv')
    st.dataframe(df.head())        # 표
    st.line_chart(df['value'])     # 차트
```

| 방식 | 특징 |
| --- | --- |
| `st.sidebar.위젯()` | 요소 하나씩 지정. 사이드바 요소가 적을 때 적합 |
| `with st.sidebar:` | 블록 단위 지정. 8구역의 `with selected_tab1:`과 같은 원리 |

### 10구역: 선택값에 따른 화면 출력

```python
if selected_menu == 'tab1 analyzing':
    #사회보장 진흥원 관련   
    st.text('tab1')
    st.image("https://ncsplus.co.kr/_img/ssis/khwis7_0131_001.jpg")

elif selected_menu == 'tab2 analyzing':
    st.text('tab2')
    st.image("https://i.namu.wiki/i/eBKwaGKKWQpqao2rfPiNvPYVeSizoRs0NoWKQbtE_F72RZCtZ5Nl-U1SyjOmSlfSUo5FvtXKD9YXTB377zejqQ.svg")
elif selected_menu == 'tab3 analyzing':
    st.text('tab3')
    st.image("https://cdn.itdaily.kr/news/photo/201603/76702_82937_2010.jpg")
```

조건문의 실행 흐름:

```text
tab1 analyzing 선택 → tab1 문구와 첫 번째 이미지 출력
tab2 analyzing 선택 → tab2 문구와 두 번째 이미지 출력
tab3 analyzing 선택 → tab3 문구와 세 번째 이미지 출력
```

`if-elif`는 여러 조건 중 일치하는 하나의 코드 블록만 실행

#### 응용 예시: 메뉴별 본문 전환

같은 패턴으로 사이드바 메뉴에 따라 본문에 표나 차트를 바꿔 출력 가능 (실행 전 예시)

```python
if selected_menu == '홈':
    st.title('홈 화면')
elif selected_menu == '데이터':
    st.dataframe(df)
elif selected_menu == '차트':
    st.line_chart(df['value'])
```

## 핵심 데이터 처리 정리

| 코드 | 역할 |
| --- | --- |
| `pd.read_csv('mpg.csv')` | CSV 파일을 데이터프레임으로 읽기 |
| `query('category == "suv"')` | SUV 행만 선택 |
| `groupby('manufacturer')` | 제조사별 그룹 생성 |
| `agg(hwy_mean=('hwy', 'mean'))` | 제조사별 `hwy` 평균 계산 |
| `st.dataframe()` | 데이터프레임을 표로 출력 |
| `sns.barplot()` | Seaborn 막대그래프 생성 |
| `px.bar()` | Plotly 막대그래프 생성 |
| `st.tabs()` | 탭 메뉴 생성 |
| `st.sidebar.selectbox()` | 사이드바 선택 메뉴 생성 |
| `with st.sidebar:` | 블록 안의 요소를 사이드바에 출력 |

## 실행 시 참고사항

- **사이드바 폭**: 좁은 폭 때문에 큰 표나 차트가 잘려 보일 수 있음. 사이드바에는 메뉴와 필터, 본문에는 표와 차트를 배치하는 구성 권장
- **중첩 `columns`**: 사이드바 안에서 `st.columns` 사용은 가능하나, `columns` 안에 `columns`를 다시 넣는 중첩은 Streamlit 버전에 따라 제한
- **사이드바 폭 조절**: CSS 주입으로 변경 가능. 내부 구조(`data-testid`)에 의존하므로 버전 변경 시 동작하지 않을 가능성 있음

```python
st.markdown("<style>[data-testid='stSidebar']{width:400px}</style>", unsafe_allow_html=True)
```
