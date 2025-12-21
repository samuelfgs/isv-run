
export enum Modalidade {
  WALK = 'walk',
  RUN = 'run'
}

export interface FormData {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  modalidade: Modalidade;
  aceitaTermos: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId?: string;
}
