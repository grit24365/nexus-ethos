import os
import datetime
import json
import re
from google import genai
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

# Initialize Gemini with the new SDK
def get_gemini_client():
    if not GEMINI_API_KEY:
        return None
    return genai.Client(api_key=GEMINI_API_KEY)

def run_gemini(prompt):
    """Calls the Gemini API using the latest google-genai SDK."""
    client = get_gemini_client()
    if not client:
        print("CRITICAL ERROR: GEMINI_API_KEY is not available.")
        return None
    
    # Retry logic for 429 errors
    import time
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            if "429" in str(e) and attempt < 2:
                print(f"Quota reached, retrying in 10s... (Attempt {attempt + 1})")
                time.sleep(10)
                continue
            print(f"Error calling Gemini SDK: {e}")
            return None
    return None

def clean_json(text):
    """Extracts JSON from a potentially markdown-formatted response."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text

def generate_full_post():
    if not GEMINI_API_KEY:
        print("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables.")
        exit(1)

    print("--- Phase 1: Topic Selection (Data-Driven) ---")
    
    analytics_insight = ""
    if GA4_PROPERTY_ID:
        try:
            print(f"Fetching analytics for Property ID: {GA4_PROPERTY_ID}")
            top_posts = get_top_performing_topics(GA4_PROPERTY_ID)
            if top_posts:
                analytics_insight = f"\n[최근 인기 포스트 데이터]: {json.dumps(top_posts, ensure_ascii=False)}\n위 데이터를 분석하여 독자들이 최근 어떤 주제에 가장 큰 반응을 보였는지 파악하고, 그 연장선상에서 더 깊은 통찰을 줄 수 있는 주제를 선정하세요."
        except Exception as e:
            print(f"Warning: Analytics fetch failed. {e}")

    topic_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    숙련된 지혜의 세대를 위해, 다음의 고단가(High-CPC) 핵심 키워드 중 하나를 포함한 구체적이고 실제적인 주제를 선정하세요.
    핵심 키워드: 금융/자산관리, AI 연금 전략, 상속/법률 서비스, 프리미엄 헬스케어, 리쇼어링 투자 전략.{analytics_insight}
    
    카테고리 옵션:
    - trends: {CATEGORIES['trends']}
    - opportunity: {CATEGORIES['opportunity']}
    - insight: {CATEGORIES['insight']}
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight 중 하나", "title": "구체적인 제목", "key_points": ["실천방안1", "실천방안2", "실천방안3"]}}
    """
    
    print("Requesting topic...")
    raw_topic = run_gemini(topic_prompt)
    if not raw_topic: exit(1)
    
    try:
        topic_data = json.loads(clean_json(raw_topic))
    except Exception as e:
        print(f"JSON Error: {e}\nRaw: {raw_topic}")
        exit(1)

    category = topic_data['category']
    title = topic_data['title']
    print(f"Selected: {title}")
    
    print("--- Phase 2: Content Generation ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    아래 주제로 심층적인 칼럼을 작성하세요.

    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    [필수 가이드라인]
    1. 말투: 노련한 전문가의 1인칭 관찰자 시점(경험 공유형).
    2. SEO: 제목 앞부분에 키워드 배치, 본문 첫 3문장에 키워드 포함.
    3. 실질적 도움: 구체적인 도구 이름, 웹사이트, 수치 포함.
    4. 분량: 한글 기준 2,200자 내외로 매우 깊이 있게. 
    5. 금기: '4060 세대' 사용 금지. '사회의 중추' 등으로 대체.
    6. 마지막 문장: 주변 공유 유도 멘트.

    출력 형식: Markdown (##, ### 사용)
    """
    
    content = run_gemini(content_prompt)
    if not content: exit(1)
    
    img_ids = ["photo-1519389950473-47ba0277781c", "photo-1460925895917-afdab827c52f", "photo-1551288049-bbbda536339a", "photo-1518186285589-2f7649de83e0"]
    import random
    cover_image = f"https://images.unsplash.com/{random.choice(img_ids)}?q=80&w=1200&auto=format&fit=crop"
    
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    slug = re.sub(r'[^a-zA-Z0-9가-힣]', '-', title.lower()).strip('-')[:50]
    filepath = os.path.join(POSTS_DIR, f"{today}-{slug}.md")
    
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
    
    print(f"SUCCESS: Post saved as {filepath}")

if __name__ == "__main__":
    if not os.path.exists(POSTS_DIR): os.makedirs(POSTS_DIR)
    generate_full_post()
