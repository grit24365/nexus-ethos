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

def run_gemini(prompt):
    """Calls the Gemini API with multiple model fallbacks to handle 429 quota errors."""
    if not GEMINI_API_KEY:
        print("CRITICAL ERROR: GEMINI_API_KEY is not available.")
        return None
    
    # Priority list of models to try
    models_to_try = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash', # Try 2.0 last if others fail
        'gemini-pro'
    ]
    
    for model_name in models_to_try:
        try:
            print(f"Attempting with model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg:
                print(f"Quota exceeded for {model_name}. Trying next model...")
                continue
            elif "404" in error_msg:
                print(f"Model {model_name} not found. Trying next model...")
                continue
            else:
                print(f"Generation failed with {model_name}: {e}")
                continue
                
    print("CRITICAL ERROR: All models failed or reached quota.")
    return None

def clean_json(text):
    """Extracts JSON from a potentially markdown-formatted response."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return match.group(0) if match else text

def generate_full_post():
    if not GEMINI_API_KEY:
        print("CRITICAL ERROR: GEMINI_API_KEY is missing.")
        exit(1)

    print("--- Phase 1: Topic Selection ---")
    
    # Alternating logic based on post count
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
    {analytics_insight}
    핵심 키워드: 금융/자산관리, AI 연금 전략, 상속/법률 서비스, 프리미엄 헬스케어, 리쇼어링 투자 전략.
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight", "title": "제목", "key_points": ["요점1", "요점2", "요점3"], "style": "{content_style}"}}
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
    
    print("--- Phase 2: Content Generation ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    아래 주제로 **{topic_data['style']}** 스타일의 칼럼을 작성하세요.

    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    [글쓰기 골든 스탠다드]
    1. 말투: 따뜻한 멘토의 공감(70%) + 냉철한 분석가의 권위(30%).
    2. 분량: 공백 포함 **1,200자 내외**.
    3. 구조: 도입(공감) - 본문(3개 리스트 상세 설명) - 결론(성찰).
    4. 금기: '4060 세대' 단어 금지. '사회의 중심축', '숙련된 지혜의 세대' 등으로 표현.
    5. 마지막 문장: 공유 유도 문구 필수.

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
