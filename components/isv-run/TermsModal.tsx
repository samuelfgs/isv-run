
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Regulamento e Termo de Responsabilidade</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto text-gray-700 leading-relaxed space-y-4">
          <p className="font-semibold text-lg">Ao participar deste evento, o atleta declara:</p>
          <p>1. Gozar de plena saúde física e mental e não possuir impedimento médico para a prática de atividades físicas de alta intensidade.</p>
          <p>2. Estar ciente de que a corrida é uma atividade que envolve riscos e assume total responsabilidade por qualquer dano pessoal ou material decorrente de sua participação.</p>
          <p>3. Autorizar o uso de sua imagem para fins de divulgação do evento em qualquer meio de comunicação, sem ônus para os organizadores.</p>
          <p>4. Comprometer-se a respeitar as regras do evento, o percurso estabelecido e as orientações da equipe de staff.</p>
        </div>

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Entendido e Aceito
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
