
import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/isv-run/RegistrationForm';
import TermsModal from '../components/isv-run/TermsModal';
import { FormData } from '../types/isv-run';
import { formatPrice } from '../lib/price-formatter';

const IsvRun: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegistration = (data: FormData) => {
    setUserName(data.nome.split(' ')[0]);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900">Vaga Reservada!</h1>
            <p className="text-lg text-slate-600">
              Que alegria ter você conosco, <span className="text-blue-600 font-bold">{userName}</span>!
              A <span className="font-bold">Igreja em São Vicente</span> recebeu seu pedido. Verifique seu e-mail para as instruções de pagamento.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-left">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Encontro Marcado</p>
                <p className="text-xl font-bold text-slate-900">07 de Fevereiro</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(process.env.NEXT_PUBLIC_PRICE || '70')}</p>
              </div>
            </div>
            <div className="h-px bg-slate-200 w-full"></div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Localização</p>
              <p className="text-lg font-bold text-slate-900">Praia Central (Posto 2), São Vicente</p>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            Inscrito! Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <div className={`font-black text-2xl tracking-tighter transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`}>
              ISV<span className={scrolled ? 'text-slate-900' : 'text-blue-400'}>RUN</span>
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>
              Igreja em São Vicente
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=2000"
            alt="Igreja em São Vicente Beach Run"
            className="w-full h-full object-cover animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-6 animate-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/90 text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg backdrop-blur-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
              Igreja em São Vicente
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              FÉ, COMUNHÃO <br/> E <span className="text-blue-400">ENERGIA.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-md font-medium leading-relaxed">
              Uma corrida de gratidão e comunhão com toda nossa comunidade.
            </p>
          </div>

          <div className="hidden md:flex justify-end animate-in slide-in-from-right-10 duration-700">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-white space-y-4 shadow-2xl">
               <div>
                <div className="text-5xl font-black">18:30</div>
                <div className="text-sm font-bold opacity-60 uppercase tracking-widest">Largada</div>
               </div>
               <div className="bg-blue-600 px-4 py-2 rounded-xl text-center">
                 <span className="text-2xl font-black">{formatPrice(process.env.NEXT_PUBLIC_PRICE || '70')}</span>
                 <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Inscrição Única</p>
               </div>
               <div className="pt-2 flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                   <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                 </div>
                 <div className="text-sm">
                   <p className="font-bold">Canto do Ilha Porchat</p>
                   <p className="opacity-60 italic">São Vicente</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Main Registration Content */}
      <main id="inscricao" className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Caminhando Juntos</h2>
            <div className="h-2 w-20 bg-blue-600 rounded-full"></div>
            <p className="text-lg text-slate-600 leading-relaxed">
              O evento <strong className="font-bold text-slate-900">ISV RUN</strong> é realizado pela <strong className="font-bold text-slate-900">Igreja em São Vicente</strong> para promover a saúde e o convívio fraternal. O valor de <strong className="font-bold text-slate-900">{formatPrice(process.env.NEXT_PUBLIC_PRICE || '70')}</strong> cobre o kit e a infraestrutura da prova.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg leading-tight">Evento Para a Família</h4>
                <p className="text-slate-500 text-sm">Espaço aberto para todas as idades, da caminhada leve à corrida 5k.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.705 2.705 0 01-3 0 2.701 2.701 0 01-3 0 2.701 2.701 0 01-3 0 2.704 2.704 0 01-1.5-.454M21 12.773c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.705 2.705 0 01-3 0 2.701 2.701 0 01-3 0 2.701 2.701 0 01-3 0 2.704 2.704 0 01-1.5-.454M21 10c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.705 2.705 0 01-3 0 2.701 2.701 0 01-3 0 2.701 2.701 0 01-3 0 2.704 2.704 0 01-1.5-.454M19 18v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3M4 11V5a2 2 0 012-2h12a2 2 0 012 2v6"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg leading-tight">Kit Atleta</h4>
                <p className="text-slate-500 text-sm">Camiseta e brindes preparados com carinho pela nossa igreja.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg leading-tight">Confraternização Final</h4>
                <p className="text-slate-500 text-sm">Momento de comunhão e hidratação na chegada.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <RegistrationForm
            onSubmit={handleRegistration}
            openTerms={() => setIsTermsOpen(true)}
          />
        </div>
      </main>

      <footer className="bg-slate-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="font-black text-3xl tracking-tighter">
                ISV<span className="text-blue-500">RUN</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                Igreja em São Vicente
              </div>
            </div>
            <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0">
              Promovendo união e vida plena através do esporte e da comunhão.
            </p>
            <a
              href="https://www.instagram.com/igrejaemsv/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-bold text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @igrejaemsv
            </a>
          </div>

          <div className="flex justify-center gap-12">
            <div className="text-center">
              <p className="text-3xl font-black text-white">ISV</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Realização</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">5K</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trajeto</p>
            </div>
          </div>

          <div className="text-slate-500 text-sm md:text-right">
            <p>&copy; 2026 IGREJA EM SÃO VICENTE.</p>
            <p>Siga-nos: @igrejaemsv</p>
          </div>
        </div>
      </footer>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

    </div>
  );
};

export default IsvRun;
