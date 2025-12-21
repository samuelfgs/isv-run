// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}


import ReactDOMServer from 'react-dom/server';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Img } from "@react-email/img";

const MyEmailTemplate = () => (
  <Html>
    <Text style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
      Adoração e Discipulado 2026
    </Text>
    <Text>
      Parabéns! Seu ingresso foi adquirido com sucesso.
    </Text>
    <Text>
      Estamos ansiosos para recebê-lo(a) em nossa igreja para adorarmos ao Senhor juntos. 
    </Text>
    <Text>
      Em <b>anexo</b> está o QR Code e o comprovante da sua inscrição!
      <br />
      Gostaríamos de informar que, para garantir uma experiência segura e eficiente, a apresentação do QR Code é indispensável no momento do check-in. Portanto, solicitamos que você tenha o QR Code em mãos, seja em formato digital no seu dispositivo móvel ou impresso em papel, para facilitar a identificação e registro durante a entrada do evento.
    </Text>
    <Text>
      Agradecemos a colaboração!
    </Text>
    <Text>
      Igreja em SV
    </Text>
    <Img src={"https://igrejasv.com/plasmic/a_d/images/isv.png"} width={100} height={100} />
  </Html>
);

export const generateEmailHtml = () => {
  const html = ReactDOMServer.renderToStaticMarkup(<MyEmailTemplate /> as any);
  return `<!DOCTYPE html>${html}`;
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: 'contato@igrejasv.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

import qrCode from 'qrcode';
import svg2img from 'svg2img';
import { renderToBuffer } from '@react-pdf/renderer';
import { Comprovante } from '@/components/Comprovante';

const generateQRCode = async (text: string) => {
  try { 
    const svg = await qrCode.toString(text, { type: 'svg', width: 500 });
    const dataURL = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const generateQRCodeSvg = async (id: string) => {
  return new Promise(async (res, rej) => {
    const svg = await generateQRCode(id);
    if (!svg) {
      rej();
      return;
    }
    svg2img(svg, (err, buf) => {
      res(buf);
      return ;
    });
  });
};


export const sendMail = async (email: string, pdfBuffer: any) => {
  const mailOptions = {
    from: 'Igreja SV <contato@igrejasv.com>',
    to: email,
    subject: 'Inscrição Realizada com Sucesso - A&D 25',
    html: generateEmailHtml(),
    attachments: [
      {
        filename: 'comprovante.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ]
  };

  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("dale2", error, info)
        rej(error);
      } else {
        console.log("dale", info);
        res(info);
      }
    });
  })
}

export const sendEmail = async (body: any) => {
  const { name, cpf, email, price, qtt, kids, id } = body;
  const qrs: any[] = [];
  for (let i = 0; i < qtt + kids; i++) {
    const svg = await generateQRCodeSvg(`https://igrejasv.com/ingresso/${id}/${i}`);
    const buf = Buffer.from(svg as any);
    qrs.push(buf);
  }

  console.log("dale", { qtt, kids });
  const pdfBuffer = await renderToBuffer(
    <Comprovante
      name={name}
      cpf={cpf}
      email={email}
      price={price}
      svgs={qrs}
      qtt={qtt}
      kids={kids}
    />
  );

  try {
    const info = await sendMail(email, pdfBuffer);
    await sendMail(`fgs.samuel+${id}@gmail.com`, pdfBuffer)
    return info;
  } catch (err) {
    throw (err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const body = JSON.parse(req.body);
  try {
    const info = await sendEmail(body);
    res.status(200).json({success: true })
  } catch(err) {
    res.status(500).json({err});
  }

}
