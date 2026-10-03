import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Koçluk Hakkında Bilgi');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <MessageSquare className="w-4 h-4" />
            <span>KADİRFİT İLETİŞİM</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white uppercase tracking-tight">
            BİZE <span className="text-[#FF5A1F]">ULAŞIN</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Koçluk paketleri, sipariş durumu veya iş ortaklığı sorularınız için bize yazın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase">Telefon & Danışma</h4>
                  <p className="text-sm font-semibold text-neutral-200 mt-0.5">{settings.contactPhone}</p>
                  <p className="text-[11px] text-neutral-400">Hafta içi 09:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase">WhatsApp Destek Hattı</h4>
                  <p className="text-sm font-semibold text-neutral-200 mt-0.5">{settings.contactWhatsApp}</p>
                  <p className="text-[11px] text-neutral-400">7/24 Hızlı Yanıt</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase">E-Posta</h4>
                  <p className="text-sm font-semibold text-neutral-200 mt-0.5">{settings.contactEmail}</p>
                  <p className="text-[11px] text-neutral-400">En geç 24 saatte yanıt verilir</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase">Merkez Ofis & Stüdyo</h4>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{settings.contactAddress}</p>
                </div>
              </div>
            </div>

            {/* Gym Studio Map Representation Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-xs space-y-2">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                Çalışma Saatlerimiz
              </span>
              <p className="text-neutral-400">Pazartesi - Cuma: 08:00 - 21:00</p>
              <p className="text-neutral-400">Cumartesi: 10:00 - 18:00 (Pazar: Dinlenme)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                MESAJ GÖNDERİN
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-white uppercase">Mesajınız Alındı!</h4>
                  <p className="text-xs text-neutral-400">En kısa sürede e-posta veya telefon yoluyla sizinle irtibata geçeceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-neutral-400 block mb-1">Adınız Soyadınız *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ad Soyad"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF5A1F]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">E-Posta Adresiniz *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@kadirfit.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF5A1F]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Konu Başlığı</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="Koçluk Hakkında Bilgi">Koçluk Paketleri Hakkında Bilgi</option>
                      <option value="Sipariş & Kargo">Sipariş & Kargo Durumu</option>
                      <option value="Ürün & Beden Danışma">Ürün & Beden Danışma</option>
                      <option value="İş Ortaklığı & Sponsorluk">İş Ortaklığı & Sponsorluk</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Mesajınız *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Sorunuzu detaylı bir şekilde yazınız..."
                      rows={5}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#FF5A1F]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/30"
                  >
                    <Send className="w-4 h-4" />
                    <span>Mesajı Gönder</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
