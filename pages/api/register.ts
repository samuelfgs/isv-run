import type { NextApiRequest, NextApiResponse } from "next";
import { Preference } from "mercadopago";
import { client } from "@/lib/mercadopago";
import { nanoid } from "nanoid";
import { Modalidade } from "@/types/isv-run";
import { supabase } from "@/lib/supabase";

const PRICE = (+process.env.NEXT_PUBLIC_PRICE! || 60);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nome, cpf, email, dataNascimento, modalidade } = req.body;

    // Validate required fields
    if (!nome || !cpf || !email || !dataNascimento || !modalidade) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Generate unique MercadoPago ID
    const mercadoPagoId = nanoid() + nanoid();

    // Create MercadoPago preference
    const preference = new Preference(client);
    const mercadoPagoBody = {
      items: [
        {
          id: "0",
          title: `ISV RUN - ${modalidade === Modalidade.RUN ? 'Corrida 5km' : 'Caminhada 5km'}`,
          description: "Inscrição para ISV RUN - Igreja em São Vicente - 07 de Fevereiro",
          quantity: 1,
          currency_id: "BRL",
          unit_price: PRICE,
        }
      ],
      payer: {
        name: nome,
        email: email,
      },
      external_reference: mercadoPagoId,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_ENDPOINT}/success`,
        failure: `${process.env.NEXT_PUBLIC_ENDPOINT}/`,
        pending: `${process.env.NEXT_PUBLIC_ENDPOINT}/`,
      },
      auto_return: "approved" as const,
      notification_url: `${process.env.NEXT_PUBLIC_ENDPOINT}/api/mercadopago/webhook/`,
    };

    let mercadoPagoResponse;
    try {
      mercadoPagoResponse = await preference.create({ body: mercadoPagoBody });
    } catch (error: any) {
      console.error('MercadoPago error:', error);
      console.error(mercadoPagoBody)
      return res.status(500).json({ error: 'Erro ao criar preferência de pagamento', details: error.message });
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('inscritos')
      .insert([
        {
          nome,
          cpf,
          email,
          mercado_pago_id: mercadoPagoId,
          metadata: {
            modalidade,
            dataNascimento,
            price: PRICE,
            init_point: mercadoPagoResponse.init_point
          }
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Erro ao salvar inscrição', details: error.message });
    }

    return res.status(201).json({
      success: true,
      data,
      init_point: mercadoPagoResponse.init_point
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
}
