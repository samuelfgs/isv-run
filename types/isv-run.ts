
export enum Modalidade {
  WALK = 'walk',
  RUN = 'run'
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F'
}

export enum ShirtSize {
  PP = 'PP',
  P = 'P',
  M = 'M',
  G = 'G',
  GG = 'GG',
  XGG = 'XGG',
  XXGG = 'XXGG'
}

export interface FormData {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  gender: Gender;
  shirtSize: ShirtSize;
  modalidade: Modalidade;
  aceitaTermos: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId?: string;
}
