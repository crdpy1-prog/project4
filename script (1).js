
// API 설정
const API_BASE_URL = 'https://api-v2.deepsearch.com';
const API_KEY = 'your-api-key'; // 실제 API 키로 교체해주세요

// 오늘 날짜 가져오기
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
}

// 어려운 단어 사전
const DIFFICULT_WORDS = {
    '정치': '국가나 지역의 정책과 권력에 관한 활동',
    '경제': '상품과 서비스의 생산, 분배, 소비에 관한 활동',
    '환경': '생물이 살아가는 주변 조건이나 상황',
    '과학': '자연 현상을 체계적으로 연구하는 학문',
    '사회': '사람들이 모여 살아가는 집단이나 공동체',
    '국정감사': '국회가 정부 업무를 점검하는 제도',
    '예산안': '정부가 1년간 쓸 돈의 계획서',
    '인플레이션': '물가가 지속적으로 오르는 현상',
    '재생에너지': '햇빛, 바람 등 자연에서 얻는 에너지',
    '기후변화': '지구의 기후가 장기간에 걸쳐 변하는 현상',
    '인공지능': '컴퓨터가 인간처럼 학습하고 판단하는 기술',
    '블록체인': '거래 기록을 안전하게 보관하는 기술',
    '메타버스': '가상현실과 현실이 결합된 3차원 공간',
    '탄소중립': '배출하는 탄소와 흡수하는 탄소량을 같게 하는 것',
    '아시안컵': '아시아 축구 연맹에서 주최하는 국가대항전',
    '월드컵': '국제축구연맹에서 4년마다 개최하는 세계 대회',
    '올림픽': '4년마다 열리는 세계 최대 종합 스포츠 대회',
    '16강': '토너먼트에서 상위 16팀이 겨루는 단계'
};

// 카테고리별 키워드 매핑
const CATEGORY_KEYWORDS = {
    'politics': ['정치', '국회', '정부', '대통령', '선거', '정당', '국정감사'],
    'science': ['과학', '기술', '연구', '발견', '혁신', 'AI', '인공지능', '우주'],
    'environment': ['환경', '기후', '에너지', '탄소', '재생에너지', '온실가스', '생태계'],
    'economy': ['경제', '금융', '주식', '부동산', '물가', '인플레이션', 'GDP', '예산'],
    'society': ['사회', '교육', '복지', '문화', '의료', '범죄', '사건사고'],
    'sports': ['스포츠', '축구', '야구', '농구', '배구', '올림픽', '월드컵', '경기', '선수', '리그']
};

// 샘플 뉴스 데이터 (API 연동 전 테스트용)
const SAMPLE_NEWS = [
    {
        title: "정부, 2024년 예산안 국회 제출",
        summary: [
            "정부가 내년도 예산 규모를 656조원으로 편성해 국회에 제출했습니다.",
            "전년 대비 2.8% 증가한 규모로 복지와 국방 분야 투자를 확대했습니다.", 
            "국회는 12월까지 예산안을 심사해 최종 확정할 예정입니다."
        ],
        category: "politics",
        source: "https://news.example.com/politics/budget-2024",
        time: "2시간 전"
    },
    {
        title: "한국 연구진, 양자컴퓨터 핵심기술 개발",
        summary: [
            "국내 연구진이 양자컴퓨터의 연산 속도를 10배 향상시키는 기술을 개발했습니다.",
            "이 기술은 암호화와 신약 개발 분야에서 혁신적 변화를 가져올 것으로 예상됩니다.",
            "연구 결과는 국제 학술지 '네이처'에 게재될 예정입니다."
        ],
        category: "science", 
        source: "https://news.example.com/science/quantum-computer",
        time: "4시간 전"
    },
    {
        title: "국내 재생에너지 발전량 30% 돌파",
        summary: [
            "올해 국내 재생에너지 발전량이 전체의 30%를 넘어섰다고 발표했습니다.",
            "태양광과 풍력 발전 시설 확대로 탄소중립 목표 달성에 한 걸음 더 다가갔습니다.",
            "정부는 2030년까지 재생에너지 비중을 50%로 확대할 계획입니다."
        ],
        category: "environment",
        source: "https://news.example.com/environment/renewable-energy", 
        time: "6시간 전"
    },
    {
        title: "주택시장 안정화 조짐, 매매거래량 감소",
        summary: [
            "전국 주택 매매거래량이 전월 대비 15% 감소하며 시장 안정화 조짐을 보입니다.",
            "금리 인상과 대출 규제 강화로 투기 수요가 줄어든 것으로 분석됩니다.",
            "전문가들은 향후 6개월간 집값 상승률이 둔화될 것으로 전망했습니다."
        ],
        category: "economy",
        source: "https://news.example.com/economy/housing-market",
        time: "8시간 전"
    },
    {
        title: "전국 학교 급식비 무상 지원 확대",
        summary: [
            "내년부터 전국 모든 초중고등학교에서 급식비를 무상으로 지원합니다.",
            "교육부는 연간 3조원의 예산을 투입해 학부모 부담을 덜어줄 계획입니다.",
            "이로써 교육 격차 해소와 학생 복지 향상에 기여할 것으로 기대됩니다."
        ],
        category: "society",
        source: "https://news.example.com/society/free-school-meals",
        time: "1일 전"
    },
    {
        title: "한국 축구대표팀, 아시안컵 16강 진출",
        summary: [
            "한국 축구대표팀이 아시안컵 조별리그 마지막 경기에서 3-1로 승리했습니다.",
            "손흥민의 2골과 김민재의 1골로 조 1위로 16강에 진출했습니다.",
            "16강전은 다음 주 화요일 오후 8시에 열릴 예정입니다."
        ],
        category: "sports",
        source: "https://news.example.com/sports/korea-football-asian-cup",
        time: "3시간 전"
    }
];

let currentNews = [];
let currentCategory = 'all';

// DOM 요소들
const newsContainer = document.getElementById('news-container');
const categoryBtns = document.querySelectorAll('.category-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const tooltip = document.getElementById('tooltip');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // 실제 API에서 오늘의 뉴스 가져오기
    fetchNews();
}

function setupEventListeners() {
    // 카테고리 버튼 이벤트
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            selectCategory(category, this);
        });
    });

    // 툴팁 이벤트
    setupTooltipEvents();
}

function selectCategory(category, btnElement) {
    currentCategory = category;
    
    // 버튼 활성화 상태 변경
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    
    // 뉴스 필터링
    filterNews(category);
}

function filterNews(category) {
    let filteredNews;
    
    if (category === 'all') {
        filteredNews = currentNews;
    } else {
        filteredNews = currentNews.filter(news => news.category === category);
    }
    
    displayNews(filteredNews);
}

function displayNews(newsArray) {
    if (newsArray.length === 0) {
        newsContainer.innerHTML = '<div class="no-news">해당 카테고리의 뉴스가 없습니다.</div>';
        return;
    }
    
    newsContainer.innerHTML = newsArray.map(news => createNewsCard(news)).join('');
    setupTooltipEvents();
}

function createNewsCard(news) {
    const categoryName = getCategoryName(news.category);
    const summaryHTML = news.summary.map((line, index) => 
        `<div class="summary-line">
            <span class="summary-number">${index + 1}</span>
            <span class="summary-text">${highlightDifficultWords(line)}</span>
        </div>`
    ).join('');
    
    return `
        <div class="news-card" data-category="${news.category}">
            <div class="news-category">${categoryName}</div>
            <h2 class="news-title">${highlightDifficultWords(news.title)}</h2>
            <div class="news-summary">
                ${summaryHTML}
            </div>
            <div class="news-source">
                <a href="${news.source}" target="_blank" class="source-link">원문 보기</a>
                <span class="news-time">${news.time}</span>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const categoryNames = {
        'politics': '정치',
        'science': '과학',
        'environment': '환경', 
        'economy': '경제',
        'society': '사회',
        'sports': '스포츠'
    };
    return categoryNames[category] || '기타';
}

function highlightDifficultWords(text) {
    let highlightedText = text;
    
    Object.keys(DIFFICULT_WORDS).forEach(word => {
        const regex = new RegExp(`(${word})`, 'g');
        highlightedText = highlightedText.replace(regex, 
            `<span class="difficult-word" data-tooltip="${DIFFICULT_WORDS[word]}">$1</span>`
        );
    });
    
    return highlightedText;
}

function setupTooltipEvents() {
    const difficultWords = document.querySelectorAll('.difficult-word');
    
    difficultWords.forEach(word => {
        word.addEventListener('mouseenter', showTooltip);
        word.addEventListener('mouseleave', hideTooltip);
        word.addEventListener('mousemove', moveTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.dataset.tooltip;
    tooltip.textContent = tooltipText;
    tooltip.classList.add('show');
    moveTooltip(e);
}

function hideTooltip() {
    tooltip.classList.remove('show');
}

function moveTooltip(e) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const x = e.clientX - tooltipRect.width / 2;
    const y = e.clientY - tooltipRect.height - 10;
    
    tooltip.style.left = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10)) + 'px';
    tooltip.style.top = Math.max(10, y) + 'px';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError() {
    loading.style.display = 'none';
    errorMessage.style.display = 'block';
}

// DeepSearch API 호출 함수
async function fetchNews() {
    try {
        showLoading();
        
        const today = getTodayDate();
        
        // 오늘의 뉴스 가져오기
        const response = await fetch(`${API_BASE_URL}/news/search`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: '한국 뉴스',
                date_from: today,
                date_to: today,
                language: 'ko',
                sort_by: 'publishedAt',
                page_size: 20
            })
        });
        
        if (!response.ok) {
            // API 키가 잘못되었거나 연결 실패시 샘플 데이터 사용
            console.warn('API 호출 실패, 샘플 데이터를 사용합니다.');
            currentNews = SAMPLE_NEWS;
            displayNews(currentNews);
            hideLoading();
            return;
        }
        
        const data = await response.json();
        currentNews = processNewsData(data);
        
        if (currentNews.length === 0) {
            // 오늘 뉴스가 없으면 최근 뉴스 가져오기
            await fetchRecentNews();
        } else {
            displayNews(currentNews);
            hideLoading();
        }
        
    } catch (error) {
        console.error('뉴스 로딩 실패:', error);
        // 오류 발생시 샘플 데이터로 폴백
        currentNews = SAMPLE_NEWS;
        displayNews(currentNews);
        hideLoading();
    }
}

// 최근 뉴스 가져오기 (오늘 뉴스가 없을 때)
async function fetchRecentNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/news/search`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: '한국 뉴스',
                language: 'ko',
                sort_by: 'publishedAt',
                page_size: 20
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentNews = processNewsData(data);
            displayNews(currentNews);
        } else {
            currentNews = SAMPLE_NEWS;
            displayNews(currentNews);
        }
        hideLoading();
        
    } catch (error) {
        console.error('최근 뉴스 로딩 실패:', error);
        currentNews = SAMPLE_NEWS;
        displayNews(currentNews);
        hideLoading();
    }
}

function processNewsData(apiData) {
    // DeepSearch API 응답 데이터를 우리 형식으로 변환
    const articles = apiData.data?.articles || apiData.articles || [];
    
    return articles.map(article => ({
        title: article.title || '제목 없음',
        summary: generateSummary(article.content || article.description || article.title),
        category: categorizeNews((article.title || '') + ' ' + (article.content || article.description || '')),
        source: article.url || article.link || '#',
        time: formatTime(article.publishedAt || article.published_at || new Date().toISOString())
    })).filter(news => news.title !== '제목 없음');
}

function generateSummary(content) {
    // 긴 뉴스 내용을 3줄로 요약하는 로직
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    const summaryLines = [];
    
    if (sentences.length >= 3) {
        summaryLines.push(sentences[0].trim() + '.');
        summaryLines.push(sentences[Math.floor(sentences.length / 2)].trim() + '.');
        summaryLines.push(sentences[sentences.length - 1].trim() + '.');
    } else {
        return sentences.map(s => s.trim() + '.');
    }
    
    return summaryLines;
}

function categorizeNews(text) {
    // 텍스트 분석으로 카테고리 자동 분류
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'society'; // 기본 카테고리
}

function formatTime(timestamp) {
    // 시간 포맷팅
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffHours = Math.floor((now - newsTime) / (1000 * 60 * 60));
    
    if (diffHours < 1) return '방금 전';
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
}

function showLoading() {
    loading.style.display = 'block';
    newsContainer.innerHTML = '';
    errorMessage.style.display = 'none';
}

// 페이지 새로고침 함수
function refreshNews() {
    fetchNews();
}

// 자동 새로고침 (30분마다)
setInterval(() => {
    console.log('뉴스 자동 업데이트 중...');
    fetchNews();
}, 30 * 60 * 1000); // 30분
