export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">LEGAL</h1>
        <h2 className="text-5xl font-serif font-bold">개인정보 처리방침</h2>
      </header>
      
      <div className="prose prose-lg prose-serif mx-auto">
        <p>넥서스 에토스(이하 '회사')는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.</p>
        
        <h3>1. 수집하는 개인정보 항목</h3>
        <p>회사는 뉴스레터 구독 및 서비스 이용을 위해 이메일 주소 등을 수집할 수 있습니다.</p>
        
        <h3>2. 개인정보의 이용 목적</h3>
        <p>수집된 정보는 컨텐츠 제공, 서비스 개선, 문의 대응 등의 목적으로만 사용됩니다.</p>
        
        <h3>3. 쿠키 및 광고 서비스 (구글 애드센스)</h3>
        <p>
          본 사이트는 구글 애드센스 등 외부 광고 서비스를 이용하며, 이를 위해 쿠키를 사용하여 이용자의 방문 기록을 분석할 수 있습니다. 이용자는 브라우저 설정에서 쿠키 수집을 거부할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
