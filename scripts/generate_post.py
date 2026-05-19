import os
import subprocess
import datetime
import json
import re

# Configuration
POSTS_DIR = "content/posts"
CATEGORIES = {
    "trends": "AI 기술 동향",
    "opportunity": "AI 시대의 새로운 지평",
    "insight": "에토스의 지혜와 성찰"
}

def run_gemini(prompt):
    """Calls the Gemini CLI to process a prompt."""
    try:
        result = subprocess.run(
            ["gemini-cli", "ask", prompt],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return None

def clean_json(text):
    """Extracts JSON from a potentially markdown-formatted response."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text

def generate_full_post():
    print("--- Phase 1: Topic Selection (Monetization & Practicality) ---")
    topic_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    숙련된 지혜의 세대를 위해, 다음의 고단가(High-CPC) 핵심 키워드 중 하나를 포함한 구체적이고 실제적인 주제를 선정하세요.
    핵심 키워드: 금융/자산관리, AI 연금 전략, 상속/법률 서비스, 프리미엄 헬스케어, 리쇼어링 투자 전략.
    
    카테고리 옵션:
    - trends: {CATEGORIES['trends']}
    - opportunity: {CATEGORIES['opportunity']}
    - insight: {CATEGORIES['insight']}
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight 중 하나", "title": "구체적인 제목", "key_points": ["실천방안1", "실천방안2", "실천방안3"], "img_keyword": "unsplash_keyword"}}
    """
    
    raw_topic = run_gemini(topic_prompt)
    if not raw_topic: return
    
    topic_data = json.loads(clean_json(raw_topic))
    category = topic_data['category']
    title = topic_data['title']
    
    print(f"Selected Topic: {title} ({category})")
    
    print("--- Phase 2: Content Generation (E-E-A-T & Revenue Optimized) ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    아래 주제로 심층적인 칼럼을 작성하세요.

    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    [필수 작성 가이드라인 - '수익 최적화 및 신뢰도' 구현]
    1. 말투: 노련한 전문가의 1인칭 관찰자 시점(경험 공유형)을 사용하세요. (예: "제가 직접 사용해보니...", "현장에서 만난 리더들은...")
    2. E-E-A-T 강화: 구체적인 데이터, 법령 이름, 최신 경제 수치를 인용하여 글의 권위를 높이세요.
    3. 고단가 키워드 배치: 제목과 본문 도입부에 금융, 보험, 법률, 투자와 관련된 키워드를 자연스럽게 녹여내세요.
    4. 실질적 도움: 구체적인 도구 이름, 웹사이트, 실천 수칙 등 '실질적인 정보'를 본문의 50% 이상 채우세요.
    5. 분량 확대: 한글 기준 공백 포함 2,200자 내외로 매우 깊이 있게 작성하세요. 
    6. 서사 부여: 도입부에서 독자의 상황(예: "어느 날 아침 자산 리포트를 보며 느꼈던...")에 공감하는 서사를 먼저 던지세요.
    7. 금기: '4060 세대', '중장년층' 단어 사용 금지. '사회의 중추', '지혜의 목소리' 등으로 대체.

    출력 형식: Markdown (## 헤더 사용)
    """
    
    content = run_gemini(content_prompt)
    if not content: return
    
    cover_image = f"https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop" # Default
    
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    slug = re.sub(r'[^a-z0-9]', '-', title.lower()).strip('-')[:50]
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
    
    print(f"Successfully generated optimized post: {filepath}")

if __name__ == "__main__":
    if not os.path.exists(POSTS_DIR):
        os.makedirs(POSTS_DIR)
    generate_full_post()
