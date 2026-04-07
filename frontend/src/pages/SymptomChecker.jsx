import React, { useState } from 'react';
import { assets, specialityData } from '../assets/assets';

const SymptomChecker = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const specialtyTagMap = {
    'General physician': 'General physician',
    Gynecologist: 'Gynecologist',
    Dermatologist: 'Dermatologist',
    Pediatricians: 'Pediatricians',
    Neurologist: 'Neurologist',
    Gastroenterologist: 'Gastroenterologist',
  };

  const normalizedResult = result ? result.replace(/\s+/g, ' ').trim() : '';
  const suggestedSpecialty = specialityData.find(
    (item) => specialtyTagMap[item.speciality] === normalizedResult
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Replace with your backend endpoint that calls OpenAI
      const response = await fetch(`${API}/api/symptom-checker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: input })
      });

      const data = await response.json();
      if (data.specialty) {
        setResult(data.specialty);
      } else {
        setError(data.message || 'No recommendation found.');
      }
    } catch {
      setError('Error connecting to AI service.');
    }
    setLoading(false);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              <img src={assets.verified_icon} alt="Verified" className="h-4 w-4" />
              AI Assisted Triage
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Symptom Checker
              <span className="block text-slate-500">Get the right specialist suggestion in seconds.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Describe your symptoms in simple language. Our assistant analyzes the input and recommends which type of doctor you should consult next.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="symptoms" className="block text-sm font-semibold text-slate-700">
                  Enter your symptoms
                </label>
                <textarea
                  id="symptoms"
                  className="min-h-[130px] w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-300"
                  placeholder="Example: fever for 3 days, headache, mild throat pain"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
                  disabled={loading}
                >
                  {loading ? 'Analyzing symptoms...' : 'Find Recommended Specialist'}
                </button>
              </form>

              {result && (
                <div className="mt-4 rounded-xl border border-slate-300 bg-slate-100 p-4 text-left text-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Suggested Specialty
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    {suggestedSpecialty && (
                      <img src={suggestedSpecialty.image} alt={suggestedSpecialty.speciality} className="h-10 w-10 rounded-lg bg-white p-2" />
                    )}
                    <p className="text-lg font-bold">{result}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-stone-300 bg-stone-100 p-4 text-sm text-stone-700">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {specialityData.map((item) => (
                <span
                  key={item.speciality}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  <img src={item.image} alt={item.speciality} className="h-4 w-4" />
                  {item.speciality}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden h-full min-h-[580px] bg-slate-900 lg:block">
            <img
              src={assets.about_image}
              alt="Medical team"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-200">Clinical Guidance</p>
                <p className="mt-2 text-lg font-semibold text-white">Fast screening to help you book with the right department.</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src={assets.group_profiles} alt="Doctors" className="h-9" />
                  <p className="text-sm text-slate-200">Trusted by patients for quick specialist direction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;