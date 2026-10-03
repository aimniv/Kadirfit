import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LegalPageProps {
  initialDoc?: string;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialDoc = 'kvkk' }) => {
  const { settings } = useApp();
  const [activeDoc, setActiveDoc] = useState<string>(initialDoc);

  const docs = [
    {
      id: 'kvkk',
      title: 'KVKK Aydınlatma Metni',
      content: settings.kvkkText
    },
    {
      id: 'mesafeli_satis',
      title: 'Mesafeli Satış Sözleşmesi',
      content: settings.distanceSalesContractText
    },
    {
      id: 'on_bilgilendirme',
      title: 'Ön Bilgilendirme Formu',
      content: settings.preInformationFormText
    },
    {
      id: 'uyelik',
      title: 'Üyelik Sözleşmesi',
      content: settings.membershipAgreementText
    },
    {
      id: 'cerez',
      title: 'Çerez (Cookie) Politikası',
      content: settings.cookiePolicyText
    },
    {
      id: 'iade_degisim',
      title: 'İade ve Değişim Koşulları',
      content: settings.returnPolicyText
    }
  ];

  const currentDoc = docs.find(d => d.id === activeDoc) || docs[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>TÜRKİYE MEVZUATINA UYGUN</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            YASAL BİLGİLENDİRME & SÖZLEŞMELER
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm">
            6698 sayılı KVKK ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca hazırlanan resmi metinler.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-neutral-800 pb-4">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeDoc === doc.id
                  ? 'bg-[#FF5A1F] text-white'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>

        {/* Active Document Viewer */}
        <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
            <FileText className="w-6 h-6 text-[#FF5A1F]" />
            <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
              {currentDoc.title}
            </h2>
          </div>

          <div className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-mono bg-black/40 p-6 rounded-xl border border-neutral-850">
            {currentDoc.content}
          </div>

          <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
            <span>Yürürlük Tarihi: 01.01.2026</span>
            <span>Kadirfit Spor ve Sağlıklı Yaşam A.Ş.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
