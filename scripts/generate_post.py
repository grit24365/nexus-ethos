import os
import datetime
import json
import re
import google.generativeai as genai
from get_analytics_data import get_top_performing_topics

# Configuration
POSTS_DIR = "content/posts"
CATEGORIES = {
    "trends": "AI 기술 동향",
    "opportunity": "AI 시대의 새로운 지평",
    "insight": "에토스의 지혜와 성찰"
}
GA4_PROPERTY_ID = os.getenv("GA4_PROPERTY_ID")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None

def run_gemini(prompt):
    """Calls the Gemini API directly via SDK."""
    if not model:
        print("Error: GEMINI_API_KEY not set.")
        return None
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini SDK: {e}")
        return None

def clean_json(text):
    """Extracts JSON from a potentially markdown-formatted response."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text

def generate_full_post():
    if not GEMINI_API_KEY:
        print("Skipping generation: GEMINI_API_KEY is missing.")
        return

    print("--- Phase 1: Topic Selection (Data-Driven) ---")
    
    # Fetch real performance data
    analytics_insight = ""
    if GA4_PROPERTY_ID:
        try:
            top_posts = get_top_performing_topics(GA4_PROPERTY_ID)
            if top_posts:
                analytics_insight = f"\n[최근 인기 포스트 데이터]: {json.dumps(top_posts, ensure_ascii=False)}\n위 데이터를 분석하여 독자들이 최근 어떤 주제에 가장 큰 반응을 보였는지 파악하고, 그 연장선상에서 더 깊은 통찰을 줄 수 있는 주제를 선정하세요."
        except Exception as e:
            print(f"Warning: Analytics fetch failed, proceeding without data. {e}")

    topic_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    숙련된 지혜의 세대를 위해, 다음의 고단가(High-CPC) 핵심 키워드 중 하나를 포함한 구체적이고 실제적인 주제를 선정하세요.
    핵심 키워드: 금융/자산관리, AI 연금 전략, 상속/법률 서비스, 프리미엄 헬스케어, 리쇼어링 투자 전략.{analytics_insight}
    
    카테고리 옵션:
    - trends: {CATEGORIES['trends']}
    - opportunity: {CATEGORIES['opportunity']}
    - insight: {CATEGORIES['insight']}
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight 중 하나", "title": "구체적인 제목", "key_points": ["실천방안1", "실천방안2", "실천방안3"], "img_keyword": "unsplash_keyword"}}
    """
    
    raw_topic = run_gemini(topic_prompt)
    if not raw_topic: return
    
    try:
        topic_data = json.loads(clean_json(raw_topic))
    except Exception as e:
        print(f"Error parsing topic JSON: {e}\nRaw response: {raw_topic}")
        return

    category = topic_data['category']
    title = topic_data['title']
    
    print(f"Selected Topic: {title} ({category})")
    
    print("--- Phase 2: Content Generation (SEO & Data Optimized) ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    아래 주제로 심층적인 칼럼을 작성하세요.

    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    [필수 작성 가이드라인 - '수익 최적화 및 검색 상단 노출(SEO)' 구현]
    1. 핵심 키워드 전략: 선정된 주제의 핵심 키워드를 제목의 앞부분에 배치하고, 본문 첫 3문장 이내에 반드시 포함하세요.
    2. 소제목(H2, H3) 최적화: 각 섹션의 소제목에 핵심 키워드와 연관 키워드(LSI)를 자연스럽게 녹여내어 검색 엔진이 문맥을 완벽히 파악하게 하세요.
    3. 말투: 노련한 전문가의 1인칭 관찰자 시점(경험 공유형)을 사용하세요. (예: "제가 직접 사용해보니...", "현장에서 만난 리더들은...")
    4. E-E-A-T 강화: 구체적인 데이터, 법령 이름, 최신 경제 수치를 인용하여 글의 권위를 높이세요.
    5. 공유 유도(Call-to-Action): 글의 맨 마지막 문장은 독자가 이 통찰을 주변에 공유하도록 유도하는 따뜻하고 세련된 멘트로 마무리하세요.
    6. 고단가 키워드 배치: 제목과 본문에 금융, 보험, 법률, 투자와 관련된 키워드를 1~2%의 밀도로 자연스럽게 유지하세요.
    7. 실질적 도움: 구체적인 도구 이름, 웹사이트, 실천 수칙 등 '실질적인 정보'를 본문의 50% 이상 채우세요.
    8. 분량 확대: 한글 기준 공백 포함 2,200자 내외로 매우 깊이 있게 작성하세요. 
    9. 서사 부여: 도입부에서 독자의 상황(예: "어느 날 아침 자산 리포트를 보며 느꼈던...")에 공감하는 서사를 먼저 던지세요.
    10. 금기: '4060 세대', '중장년층' 단어 사용 금지. '사회의 중추', '지혜의 목소리' 등으로 대체.

    출력 형식: Markdown (##, ### 헤더 사용)
    """
    
    content = run_gemini(content_prompt)
    if not content: return
    
    # Generic high-quality tech/finance image IDs to rotate
    img_ids = ["photo-1519389950473-47ba0277781c", "photo-1460925895917-afdab827c52f", "photo-1551288049-bbbda536339a", "photo-1518186285589-2f7649de83e0"]
    import random
    selected_img = random.choice(img_ids)
    cover_image = f"https://images.unsplash.com/{selected_img}?q=80&w=1200&auto=format&fit=crop"
    
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    # Clean slug for filename
    slug = re.sub(r'[^a-zA-Z0-9가-힣]', '-', title.lower()).strip('-')[:50]
    filename = f"{today}-{slug}.md"
    filepath = os.path.join(POSTS_DIR, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: \"{today}\"\n")
        f.write(f"category: \"{category}\"\n")
        f.write(f"excerpt: \"{topic_data['key_points'][0]}...\"\n")
        f.write(f"coverImage: \"{cover_image}\"\n")
        f.write("---\n\n")
        f.write(content)
        f.write(f"\n\n---\n*가치 있는 통찰은 나누었을 때 더 큰 지혜가 됩니다. 본 칼럼이 도움이 되셨다면 주변의 소중한 분들에게 공유해 보세요.*")
    
    print(f"Successfully generated data-driven post: {filepath}")

if __name__ == "__main__":
    if not os.path.exists(POSTS_DIR):
        os.makedirs(POSTS_DIR)
    generate_full_post()
