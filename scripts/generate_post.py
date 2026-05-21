import os
import datetime
import json
import re
import random
import string
import google.generativeai as genai
import warnings
from get_analytics_data import get_top_performing_topics

# Ignore the FutureWarning
warnings.filterwarnings("ignore", category=FutureWarning)

# Configuration
POSTS_DIR = "content/posts"
CATEGORIES = {
    "trends": "Trend",
    "opportunity": "Opportunity",
    "insight": "Insight"
}
GA4_PROPERTY_ID = os.getenv("GA4_PROPERTY_ID")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini with the stable SDK
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def find_available_model():
    """Lists and finds the best available model to avoid 404 errors."""
    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        priority = ['models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'models/gemini-2.0-flash']
        for p in priority:
            if p in available_models:
                return p.replace('models/', '')
        if available_models:
            return available_models[0].replace('models/', '')
    except Exception as e:
        print(f"Error listing models: {e}")
    return 'gemini-1.5-flash'

def run_gemini(prompt):
    """Calls the Gemini API with auto-detected model."""
    if not GEMINI_API_KEY:
        print("CRITICAL ERROR: GEMINI_API_KEY is not available.")
        return None
    
    model_name = find_available_model()
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        print(f"Generation failed with {model_name}: {e}")
    return None

def clean_json(text):
    """Extracts JSON from a potentially markdown-formatted response."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return match.group(0) if match else text

def generate_full_post():
    if not GEMINI_API_KEY:
        print("CRITICAL ERROR: GEMINI_API_KEY is missing.")
        exit(1)

    print("--- Phase 1: Topic Selection (Balanced & Alternating) ---")
    
    # Determine content type balance (alternating logic)
    # We use the count of existing posts to alternate
    existing_posts = len([f for f in os.listdir(POSTS_DIR) if f.endswith('.md')])
    content_style = "practical" if existing_posts % 2 == 0 else "insightful"
    
    analytics_insight = ""
    if GA4_PROPERTY_ID:
        try:
            top_posts = get_top_performing_topics(GA4_PROPERTY_ID)
            if top_posts:
                analytics_insight = f"\n[최근 인기 포스트 데이터]: {json.dumps(top_posts, ensure_ascii=False)}"
        except Exception as e:
            print(f"Warning: Analytics fetch failed: {e}")

    topic_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    지혜로운 독자를 위해 오늘의 포스팅 주제를 선정하세요.
    
    이번 포스팅은 **{content_style}** 스타일로 작성해야 합니다.
    - practical: 당장 오늘부터 적용 가능한 구체적인 도구와 활용법 위주.
    - insightful: 기술의 본질, 가치관의 변화 등 거시적 통찰 위주.
    
    {analytics_insight}
    
    핵심 키워드: 금융/자산관리, AI 연금 전략, 상속/법률 서비스, 프리미엄 헬스케어, 리쇼어링 투자 전략.
    카테고리 옵션: trends, opportunity, insight 중 하나.
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight", "title": "구체적인 제목", "key_points": ["요점1", "요점2", "요점3"], "style": "{content_style}"}}
    """
    
    raw_topic = run_gemini(topic_prompt)
    if not raw_topic: exit(1)
    
    try:
        topic_data = json.loads(clean_json(raw_topic))
    except Exception as e:
        print(f"JSON Error: {e}\nRaw: {raw_topic}")
        exit(1)

    category = topic_data['category']
    title = topic_data['title']
    print(f"Selected: {title} ({topic_data['style']})")
    
    print("--- Phase 2: Content Generation (The Golden Standard) ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    아래 주제로 **{topic_data['style']}** 스타일의 칼럼을 작성하세요.

    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    [글쓰기 골든 스탠다드 - 반드시 준수]
    1. 말투: 따뜻한 멘토의 공감(70%) + 냉철한 분석가의 권위(30%)를 섞은 '품격 있는 대화체'.
    2. 분량: 공백 포함 **1,200자 내외**로 압축된 통찰 제공. (너무 길게 늘어지지 말 것)
    3. 구조 (3단 구성): 
       - 도입: 독자의 상황에 공감하는 짧은 에피소드나 질문.
       - 본문: 3개의 핵심 리스트(Bullet point)와 그에 대한 간결한 설명.
       - 결론: 독자를 향한 격려와 성찰의 제언.
    4. 내용: **{topic_data['style']}** 스타일에 충실할 것.
    5. SEO: 제목에 키워드 포함, 본문 첫 문장에 핵심 주제 명시.
    6. 금기: '4060 세대' 단어 사용 절대 금지. '사회의 중심축', '숙련된 지혜의 세대' 등으로 표현.
    7. 마지막 문장: 공유 유도 문구 ("가치 있는 통찰은 나누었을 때 더 큰 지혜가 됩니다...")

    출력 형식: Markdown (## 헤더 사용)
    """
    
    content = run_gemini(content_prompt)
    if not content: exit(1)
    
    img_ids = ["photo-1519389950473-47ba0277781c", "photo-1460925895917-afdab827c52f", "photo-1551288049-bbbda536339a", "photo-1518186285589-2f7649de83e0"]
    cover_image = f"https://images.unsplash.com/{random.choice(img_ids)}?q=80&w=1200&auto=format&fit=crop"
    
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.datetime.now().strftime("%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    filepath = os.path.join(POSTS_DIR, f"{today}-{category}-{timestamp}-{random_str}.md")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: \"{today}\"\n")
        f.write(f"category: \"{category}\"\n")
        f.write(f"excerpt: \"{topic_data['key_points'][0]}...\"\n")
        f.write(f"coverImage: \"{cover_image}\"\n")
        f.write("---\n\n")
        f.write(content)
    
    print(f"SUCCESS: Post saved as {filepath}")

if __name__ == "__main__":
    if not os.path.exists(POSTS_DIR): os.makedirs(POSTS_DIR)
    generate_full_post()
