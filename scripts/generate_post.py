import os
import subprocess
import datetime
import json
import re

# Configuration
POSTS_DIR = "content/posts"
CATEGORIES = {
    "trends": "최신 AI 기술 동향과 미래 전망",
    "opportunity": "AI 시대 위기와 새로운 기회",
    "insight": "4060 세대의 무기로 AI 시대 살아남기 위한 통찰"
}

def run_gemini(prompt):
    """Calls the Gemini CLI to process a prompt."""
    try:
        # We use 'gemini-cli ask' as the command
        # In a real environment, you might need the full path or environment setup
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
    print("--- Phase 1: Topic Selection ---")
    topic_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    40~60대 독자를 타겟으로, 인공지능 기술이 그들의 경제적 생존과 삶의 질에 미치는 영향에 대한 '깊이 있고 진지한' 포스팅 주제를 선정하세요.
    
    카테고리 옵션:
    - trends: {CATEGORIES['trends']}
    - opportunity: {CATEGORIES['opportunity']}
    - insight: {CATEGORIES['insight']}
    
    응답은 반드시 아래 JSON 형식으로만 해주세요:
    {{"category": "trends/opportunity/insight 중 하나", "title": "제목", "key_points": ["요점1", "요점2", "요점3"]}}
    """
    
    raw_topic = run_gemini(topic_prompt)
    if not raw_topic: return
    
    topic_data = json.loads(clean_json(raw_topic))
    category = topic_data['category']
    title = topic_data['title']
    img_keyword = topic_data.get('img_keyword', 'technology')
    
    print(f"Selected Topic: {title} ({category})")
    
    # Simple Unsplash image integration
    cover_image = f"https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" # Default
    # In a real setup, we could use an API to fetch a specific image for the keyword
    
    print("--- Phase 2: Content Generation ---")
    content_prompt = f"""
    당신은 '넥서스 에토스(Nexus Ethos)'의 편집장 '넥토스(Nexthos)'입니다. 
    40~60대 독자를 위해 아래 주제로 심층적인 칼럼을 작성하세요.
    
    주제: {title}
    요점: {", ".join(topic_data['key_points'])}
    
    작성 가이드라인:
    1. 말투: 진지하고, 지적이며, 품격 있는 문체 (경어체).
    2. 타겟: 40~60대 (은퇴 설계, 자산 보호, 커리어 전환에 민감함).
    3. 구조: 도입부 - 본문(3개 섹션 이상) - 결론(성찰과 제언).
    4. 분량: 한글 기준 1500자 내외의 깊이 있는 내용.
    5. SEO: 제목에 핵심 키워드 포함, 도입부에 주제 요약 포함.
    
    출력 형식:
    - 서론(Excerpt)을 먼저 작성하고, 그 뒤에 본문을 작성하세요.
    - Markdown 형식을 사용하세요 (## 헤더 등).
    """
    
    content = run_gemini(content_prompt)
    if not content: return
    
    # Save to file
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    slug = re.sub(r'[^a-z0-9]', '-', title.lower()).strip('-')[:50]
    filename = f"{today}-{slug}.md"
    filepath = os.path.join(POSTS_DIR, filename)
    
    # Split content into excerpt and main body (assuming AI follows instructions)
    # If not, we can do some basic parsing.
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: \"{today}\"\n")
        f.write(f"category: \"{category}\"\n")
        f.write(f"excerpt: \"{topic_data['key_points'][0]}...\"\n") # Simplified
        f.write(f"coverImage: \"{cover_image}\"\n")
        f.write("---\n\n")
        f.write(content)
    
    print(f"Successfully generated post: {filepath}")

if __name__ == "__main__":
    if not os.path.exists(POSTS_DIR):
        os.makedirs(POSTS_DIR)
    generate_full_post()
