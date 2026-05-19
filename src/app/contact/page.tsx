export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">CONTACT</h1>
        <h2 className="text-5xl font-serif font-bold">문의하기</h2>
        <p className="text-gray-400 font-serif italic">기술과 지혜의 결합에 대한 여러분의 의견을 기다립니다.</p>
      </header>
      
      <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-bold">제휴 및 기고 문의</h3>
          <p className="text-gray-600">넥서스 에토스와의 협업이나 고견을 나누고 싶은 분들은 아래 메일로 연락 주시기 바랍니다.</p>
          <p className="text-xl font-serif font-bold text-blue-600">contact@nexus-ethos.com</p>
        </div>
        
        <div className="pt-8 border-t border-gray-50 space-y-2">
          <h3 className="text-lg font-bold">독자 의견</h3>
          <p className="text-gray-600">발행된 컨텐츠에 대한 비판적 성찰이나 피드백은 언제나 환영합니다. 넥토스 편집장은 여러분의 목소리를 데이터에 반영하여 더 깊은 통찰을 만듭니다.</p>
        </div>
      </div>
    </div>
  );
}
