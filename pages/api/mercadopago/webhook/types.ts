export interface WebhookPayload {
  id: string;
  type: string;
  data: {
    id: string;
  };
  action: string;
}

export interface IscritoRecord {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  mercado_pago_id: string;
  email_sent: boolean;
  metadata: {
    modalidade: 'walk' | 'run';
    dataNascimento: string;
    price: number;
    init_point: string;
    people: Array<{
      nome: string;
      cpf: string;
      dataNascimento: string;
      gender: string;
      shirtSize: string;
      modalidade: 'walk' | 'run';
    }>;
    modalidadeDescription: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  paymentId?: string;
  inscritoId?: string;
  message: string;
  alreadySent?: boolean;
}
