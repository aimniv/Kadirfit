import React, { useState } from 'react';
import { X, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export const AssessmentFormModal: React.FC = () => {
  const { notify } = useDialog();
  const {
    assessmentModalOpen,
    closeAssessmentModal,
    currentUser,
    submitAssessment,
    assessments
  } = useApp();

  const existing = currentUser ? assessments.find(a => a.userId === currentUser.id) : null;

  const [fullName, setFullName] = useState(currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [age, setAge] = useState(existing?.age ? String(existing.age) : '26');
  const [gender, setGender] = useState<'erkek' | 'kadin' | 'diger'>(existing?.gender || 'erkek');
  const [height, setHeight] = useState(existing?.height ? String(existing.height) : '180');
  const [weight, setWeight] = useState(existing?.weight ? String(existing.weight) : '82');
  const [targetWeight, setTargetWeight] = useState(existing?.targetWeight ? String(existing.targetWeight) : '76');
  const [primaryGoal, setPrimaryGoal] = useState<'kilo_verme' | 'kas_kazanimi' | 'yag_yakimi' | 'kondisyon' | 'yarisma_hazirligi'>(
    existing?.primaryGoal || 'yag_yakimi'
  );
  const [experienceLevel, setExperienceLevel] = useState<'baslangic' | 'orta' | 'ileri' | 'yarisici'>(
    existing?.experienceLevel || 'orta'
  );
  const [trainingDays, setTrainingDays] = useState(existing?.trainingDaysPerWeek || 4);
  const [gymOrHome, setGymOrHome] = useState<'salon' | 'ev'>(existing?.gymOrHome || 'salon');
  const [injuries, setInjuries] = useState(existing?.injuriesOrHealthIssues || '');
  const [dietary, setDietary] = useState(existing?.dietaryRestrictions || '');
  const [activity, setActivity] = useState<'dusuk' | 'orta' | 'yuksek'>(existing?.dailyActivityLevel || 'orta');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!assessmentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await submitAssessment({
      userEmail: email,
      fullName,
      age: parseInt(age) || 25,
      gender,
      height: parseInt(height) || 175,
      weight: parseFloat(weight) || 75,
      targetWeight: parseFloat(targetWeight) || 70,
      primaryGoal,
      experienceLevel,
      trainingDaysPerWeek: trainingDays,
      gymOrHome,
      injuriesOrHealthIssues: injuries,
      dietaryRestrictions: dietary,
      dailyActivityLevel: activity
    });
    if (!res.success) {
      notify(res.message || 'Form gönderilemedi. Lütfen tekrar deneyin.', 'error');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      closeAssessmentModal();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAssessmentModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-wider mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>KADIRFIT BİREYSEL ANALİZ</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ÖN DEĞERLENDİRME VE ANATOMİ FORMU
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Kadir Hoca'nın size %100 uyumlu antrenman ve beslenme programınızı hazırlaması için lütfen aşağıdaki soruları eksiksiz yanıtlayın.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="font-display text-2xl font-bold text-white uppercase">Formunuz Başarıyla Alındı!</h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Bilgileriniz antrenörümüz Kadir Arslan'ın sistemine düştü. Özel programınız 48 saat içinde kullanıcı panelinize yüklenecektir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Adınız Soyadınız *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">E-Posta Adresiniz *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Yaşınız *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Cinsiyet</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value="erkek">Erkek</option>
                  <option value="kadin">Kadın</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Boyunuz (cm) *</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Güncel Kilo (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Birincil Hedefiniz *</label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value="yag_yakimi">Yağ Yakımı & Definasyon</option>
                  <option value="kas_kazanimi">Yağsız Kas Kütlesi (Clean Bulk)</option>
                  <option value="kilo_verme">Ciddi Kilo Verme & Sıkılaşma</option>
                  <option value="kondisyon">Atletik Performans & Güç</option>
                  <option value="yarisma_hazirligi">Müsabaka & Çekim Hazırlığı</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Hedeflediğiniz Kilo (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Spor Geçmişiniz</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value="baslangic">Yeni Başlayan (0-6 Ay)</option>
                  <option value="orta">Orta Seviye (1-3 Yıl)</option>
                  <option value="ileri">İleri Seviye (3+ Yıl)</option>
                  <option value="yarisici">Müsabık Atlet</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Haftalık Antrenman Günü</label>
                <select
                  value={trainingDays}
                  onChange={(e) => setTrainingDays(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value={3}>Haftada 3 Gün</option>
                  <option value={4}>Haftada 4 Gün (Tavsiye Edilen)</option>
                  <option value={5}>Haftada 5 Gün</option>
                  <option value={6}>Haftada 6 Gün</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Antrenman Nerede?</label>
                <select
                  value={gymOrHome}
                  onChange={(e) => setGymOrHome(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value="salon">Fitness Salonu</option>
                  <option value="ev">Evde (Dambıl / Direnç Lastiği)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Sakatlık, Fıtık veya Kronik Sağlık Durumları:</label>
              <textarea
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="Bel fıtığı, menisküs, omuz sıkışması gibi durumları belirtiniz (Egzersiz açıları buna göre modifiye edilecektir)..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                rows={2}
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Beslenme Alışkanlıkları & Alerjiler:</label>
              <textarea
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="Laktoz hassasiyeti, vejetaryen, sevmediğiniz yemekler veya özel diyet tercihiniz..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                rows={2}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/30"
            >
              <span>Formu Kadir Hoca'ya Gönder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
