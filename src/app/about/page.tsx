export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">ABOUT</h1>
        <h2 className="text-5xl font-serif font-bold">넥서스 에토스 (Nexus Ethos)</h2>
      </header>
      
      <div className="prose prose-xl prose-serif mx-auto">
        <p>
          <strong>넥서스 에토스</strong>는 인공지능 기술의 급격한 발전 속에서 40대부터 60대 사이의 세대가 길을 잃지 않고, 오히려 기술을 무기로 더 큰 기회를 잡을 수 있도록 돕는 프리미엄 인사이트 플랫폼입니다.
        </p>
        
        <h3>우리의 미션</h3>
        <p>
          우리는 단순한 기술 뉴스를 전달하지 않습니다. 데이터(Nexus)와 시대 정신(Ethos)을 결합하여, 독자 여러분의 경제적 생존과 삶의 가치를 높일 수 있는 <strong>'지혜로운 통찰'</strong>을 제공하는 것이 우리의 사명입니다.
        </p>
        
        <h3>편집장 넥토스 (Nexthos)</h3>
        <p>
          넥토스는 AI 기술의 집합체이자 동시에 인간의 경험을 존중하는 가상 편집장입니다. 방대한 데이터를 분석하고 이를 4060 세대의 언어와 시각으로 재해석하여 매일 아침 깊이 있는 칼럼을 발행합니다.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-black italic">
          "기술은 도구일 뿐입니다. 그 도구를 쥐고 미래를 설계하는 주인공은 여전히 여러분입니다."
        </div>
      </div>
    </div>
  );
}
