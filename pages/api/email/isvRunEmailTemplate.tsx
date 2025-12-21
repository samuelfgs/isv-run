import ReactDOMServer from 'react-dom/server';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Img } from "@react-email/img";

interface IsvRunEmailTemplateProps {
  modalidade: 'walk' | 'run';
}

const IsvRunEmailTemplate = ({ modalidade }: IsvRunEmailTemplateProps) => (
  <Html>
    <Text style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
      ISV RUN 2026
    </Text>
    <Text>
      Parabéns! Sua inscrição foi confirmada com sucesso.
    </Text>
    <Text>
      Modalidade: <b>{modalidade === 'run' ? 'Corrida 5km' : 'Caminhada 5km'}</b>
    </Text>
    <Text>
      Data: <b>07 de Fevereiro de 2026</b>
      <br />
      Horário: <b>18:30</b>
      <br />
      Local: <b>Canto do Ilha Porchat</b>
    </Text>
    <Text>
      Em <b>anexo</b> está o QR Code e o comprovante da sua inscrição!
      <br />
      Gostaríamos de informar que, para garantir uma experiência segura e eficiente, a apresentação do QR Code é indispensável no momento do check-in. Portanto, solicitamos que você tenha o QR Code em mãos, seja em formato digital no seu dispositivo móvel ou impresso em papel, para facilitar a identificação e registro durante a entrada do evento.
    </Text>
    <Text>
      Nos vemos no dia da corrida!
    </Text>
    <Text>
      Igreja em SV
    </Text>
    <Img src={"https://igrejasv.com/plasmic/a_d/images/isv.png"} width={100} height={100} />
  </Html>
);

export const generateIsvRunEmailHtml = (modalidade: 'walk' | 'run') => {
  const html = ReactDOMServer.renderToStaticMarkup(<IsvRunEmailTemplate modalidade={modalidade} /> as any);
  return `<!DOCTYPE html>${html}`;
};
