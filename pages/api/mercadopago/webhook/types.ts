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
  };
}

export interface WebhookResponse {
  success: boolean;
  paymentId?: string;
  inscritoId?: string;
  message: string;
  alreadySent?: boolean;
}
