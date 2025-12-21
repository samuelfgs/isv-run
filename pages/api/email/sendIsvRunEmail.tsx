import { renderToBuffer } from '@react-pdf/renderer';
import { ComprovanteRun } from '@/components/ComprovanteRun';
import { generateIsvRunEmailHtml } from './isvRunEmailTemplate';
import { generateQRCodeSvg } from '../email';
import type { IscritoRecord } from '../mercadopago/webhook/types';
import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: 'contato@igrejasv.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends ISV RUN confirmation email with QR code and PDF receipt
 * @param inscrito - Registration record from database
 * @returns Promise that resolves when email is sent
 */
export const sendIsvRunEmail = async (inscrito: IscritoRecord) => {
  const { id, nome, email, cpf, metadata } = inscrito;
  const { modalidade } = metadata;

  // Generate QR code for check-in
  const qrCodeUrl = `https://igrejasv.com/ingresso/run/${id}`;
  const qrCodeBuffer = await generateQRCodeSvg(qrCodeUrl);
  const buf = Buffer.from(qrCodeBuffer as any);

  // Generate PDF receipt
  const pdfBuffer = await renderToBuffer(
    <ComprovanteRun
      name={nome}
      email={email}
      cpf={cpf}
      svg={buf}
      modalidade={modalidade}
    />
  );

  // Email configuration
  const mailOptions = {
    from: 'Igreja SV <contato@igrejasv.com>',
    to: email,
    subject: 'Inscrição Confirmada - ISV RUN 2026',
    html: generateIsvRunEmailHtml(modalidade),
    attachments: [
      {
        filename: 'comprovante-isv-run.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ]
  };

  // Send email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending ISV RUN email:', error);
        reject(error);
      } else {
        console.log('ISV RUN email sent successfully:', info);

        // Send copy to tracking email
        try {
          const trackingMailOptions = {
            ...mailOptions,
            to: `fgs.samuel+${id}@gmail.com`,
          };
          await transporter.sendMail(trackingMailOptions);
        } catch (trackingError) {
          console.error('Error sending tracking email:', trackingError);
          // Don't fail the whole process if tracking email fails
        }

        resolve(info);
      }
    });
  });
};
