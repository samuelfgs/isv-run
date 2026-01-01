import React, { useState } from "react";
import { Modalidade, Gender, ShirtSize, FormData } from "../../types/isv-run";
import { formatPrice } from "../../lib/price-formatter";

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  openTerms: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  openTerms,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    gender: Gender.MALE,
    shirtSize: ShirtSize.M,
    modalidade: Modalidade.RUN,
    aceitaTermos: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const validateCpf = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    // // Validate first check digit
    // let sum = 0;
    // for (let i = 0; i < 9; i++) {
    //   sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    // }
    // let checkDigit = 11 - (sum % 11);
    // if (checkDigit >= 10) checkDigit = 0;
    // if (checkDigit !== parseInt(cleanCpf.charAt(9))) return false;

    // // Validate second check digit
    // sum = 0;
    // for (let i = 0; i < 10; i++) {
    //   sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    // }
    // checkDigit = 11 - (sum % 11);
    // if (checkDigit >= 10) checkDigit = 0;
    // if (checkDigit !== parseInt(cleanCpf.charAt(10))) return false;
    return true;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFormData({ ...formData, cpf: value });

    // Validate CPF when complete
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length === 11) {
      if (!validateCpf(value)) {
        setCpfError("CPF inválido");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("");
    }
  };

  const validateDate = (dateStr: string): { valid: boolean; error: string } => {
    if (dateStr.length !== 10) {
      return { valid: false, error: "Data incompleta" };
    }

    const parts = dateStr.split("/");
    if (parts.length !== 3) {
      return { valid: false, error: "Data inválida" };
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Check if valid numbers
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return { valid: false, error: "Data inválida" };
    }

    // Check ranges
    if (month < 1 || month > 12) {
      return { valid: false, error: "Mês inválido" };
    }

    if (day < 1 || day > 31) {
      return { valid: false, error: "Dia inválido" };
    }

    // Check if date exists
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return { valid: false, error: "Data não existe" };
    }

    // Check if date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return { valid: false, error: "Data não pode ser no futuro" };
    }

    // Check minimum age (e.g., 5 years old)
    const minAge = 5;
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - minAge);
    if (date > minDate) {
      return { valid: false, error: `Idade mínima: ${minAge} anos` };
    }

    // Check maximum age (e.g., 120 years old)
    const maxAge = 120;
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - maxAge);
    if (date < maxDate) {
      return { valid: false, error: "Data inválida" };
    }

    return { valid: true, error: "" };
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }

    setFormData({ ...formData, dataNascimento: value });

    // Validate date when complete
    if (value.length === 10) {
      const validation = validateDate(value);
      if (!validation.valid) {
        setDateError(validation.error);
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!validateCpf(formData.cpf)) {
      setCpfError("CPF inválido. Por favor, insira um CPF válido.");
      hasError = true;
    }

    const dateValidation = validateDate(formData.dataNascimento);
    if (!dateValidation.valid) {
      setDateError(dateValidation.error);
      hasError = true;
    }

    if (!formData.aceitaTermos) {
      setTermsError("Você precisa aceitar os termos para continuar.");
      hasError = true;
    } else {
      setTermsError("");
    }

    if (hasError) {
      window.scrollTo({
        top: document.querySelector("form")?.offsetTop || 0,
        behavior: "smooth",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          dataNascimento: formData.dataNascimento,
          gender: formData.gender,
          shirtSize: formData.shirtSize,
          modalidade: formData.modalidade,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar inscrição");
      }

      // Success - redirect to MercadoPago payment page
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        // Fallback if no init_point (shouldn't happen)
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(
        error.message || "Erro ao enviar inscrição. Por favor, tente novamente."
      );
      window.scrollTo({
        top: document.querySelector("form")?.offsetTop || 0,
        behavior: "smooth",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 space-y-8"
    >
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Seus Dados</h3>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Nome Completo
          </label>
          <input
            required
            type="text"
            placeholder="Ex: João Silva Santos"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-300"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              E-mail de Contato
            </label>
            <input
              required
              type="email"
              placeholder="joao@exemplo.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-300"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              CPF
            </label>
            <input
              required
              type="text"
              placeholder="000.000.000-00"
              className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:ring-4 transition-all outline-none font-medium tracking-tight ${
                cpfError
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
              }`}
              value={formData.cpf}
              onChange={handleCpfChange}
            />
            {cpfError && (
              <p className="text-xs text-red-500 font-medium ml-1">
                {cpfError}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Data de Nascimento
          </label>
          <input
            required
            type="text"
            placeholder="dd/mm/aaaa"
            className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:ring-4 transition-all outline-none text-slate-900 placeholder:text-slate-300 ${
              dateError
                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
            }`}
            value={formData.dataNascimento}
            onChange={handleDateChange}
          />
          {dateError && (
            <p className="text-xs text-red-500 font-medium ml-1">{dateError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Sexo
            </label>
            <select
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
            >
              <option value={Gender.MALE}>Masculino</option>
              <option value={Gender.FEMALE}>Feminino</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Tamanho da Camisa
            </label>
            <select
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900"
              value={formData.shirtSize}
              onChange={(e) =>
                setFormData({ ...formData, shirtSize: e.target.value as ShirtSize })
              }
            >
              <option value={ShirtSize.PP}>PP</option>
              <option value={ShirtSize.P}>P</option>
              <option value={ShirtSize.M}>M</option>
              <option value={ShirtSize.G}>G</option>
              <option value={ShirtSize.GG}>GG</option>
              <option value={ShirtSize.XGG}>XGG</option>
              <option value={ShirtSize.XXGG}>XXGG</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Sua Escolha</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() =>
              setFormData({ ...formData, modalidade: Modalidade.RUN })
            }
            className={`group p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              formData.modalidade === Modalidade.RUN
                ? "border-blue-600 bg-blue-50/50"
                : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  formData.modalidade === Modalidade.RUN
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300"
                }`}
              >
                {formData.modalidade === Modalidade.RUN && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <svg
                className={`w-8 h-8 ${
                  formData.modalidade === Modalidade.RUN
                    ? "text-blue-600"
                    : "text-slate-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p
              className={`font-black text-lg ${
                formData.modalidade === Modalidade.RUN
                  ? "text-blue-600"
                  : "text-slate-400"
              }`}
            >
              Corrida 5km
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Primeiro pelotão
            </p>
          </div>

          <div
            onClick={() =>
              setFormData({ ...formData, modalidade: Modalidade.WALK })
            }
            className={`group p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              formData.modalidade === Modalidade.WALK
                ? "border-blue-600 bg-blue-50/50"
                : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  formData.modalidade === Modalidade.WALK
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300"
                }`}
              >
                {formData.modalidade === Modalidade.WALK && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <svg
                className={`w-8 h-8 ${
                  formData.modalidade === Modalidade.WALK
                    ? "text-blue-600"
                    : "text-slate-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              className={`font-black text-lg ${
                formData.modalidade === Modalidade.WALK
                  ? "text-blue-600"
                  : "text-slate-400"
              }`}
            >
              Caminhada 5km
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Ritmo livre
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-6">
        <div className="space-y-2">
          <div
            className={`flex items-start gap-4 p-5 rounded-[1.5rem] border ${
              termsError
                ? "bg-red-50 border-red-200"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="relative flex items-center h-5">
              <input
                id="aceitaTermos"
                type="checkbox"
                className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-200 cursor-pointer accent-blue-600"
                checked={formData.aceitaTermos}
                onChange={(e) => {
                  setFormData({ ...formData, aceitaTermos: e.target.checked });
                  if (e.target.checked) setTermsError("");
                }}
              />
            </div>
            <label
              htmlFor="aceitaTermos"
              className="text-xs font-medium text-slate-500 leading-normal select-none cursor-pointer"
            >
              Declaro que li e concordo com o{" "}
              <button
                type="button"
                onClick={openTerms}
                className="text-blue-600 font-bold hover:underline"
              >
                Regulamento Oficial
              </button>{" "}
              da prova, assumindo total responsabilidade pela minha saúde e
              participação.
            </label>
          </div>
          {termsError && (
            <p className="text-xs text-red-500 font-medium ml-1">
              {termsError}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Total a pagar
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formatPrice(process.env.NEXT_PUBLIC_PRICE || "70")}
            </span>
          </div>
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-600 font-medium">{submitError}</p>
            </div>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-5 rounded-3xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
              isSubmitting
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 shadow-blue-500/20"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                PROCESSANDO...
              </>
            ) : (
              "CONFIRMAR INSCRIÇÃO"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
