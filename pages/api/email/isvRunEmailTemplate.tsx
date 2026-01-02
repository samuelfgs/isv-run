import ReactDOMServer from 'react-dom/server';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Img } from "@react-email/img";

interface ParticipantInfo {
  nome: string;
  modalidade: 'walk' | 'run';
  shirtSize: string;
}

interface IsvRunEmailTemplateProps {
  people: ParticipantInfo[];
}

const IsvRunEmailTemplate = ({ people }: IsvRunEmailTemplateProps) => (
  <Html>
    <Text style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
      ISV RUN 2026
    </Text>
    <Text>
      Parabéns! Sua inscrição foi confirmada com sucesso.
    </Text>
    <Text>
      Data: <b>07 de Fevereiro de 2026</b>
      <br />
      Horário: <b>18:30</b>
      <br />
      Local: <b>Canto do Ilha Porchat</b>
    </Text>
    <Text style={{ marginTop: "20px", fontWeight: "bold" }}>
      {people.length === 1 ? 'Participante:' : 'Participantes:'}
    </Text>
    {people.map((person, index) => (
      <Text key={index} style={{ marginLeft: "20px", marginBottom: "10px" }}>
        <b>{person.nome}</b>
        <br />
        Modalidade: {person.modalidade === 'run' ? 'Corrida 5km' : 'Caminhada 5km'}
        <br />
        Tamanho da Camisa: {person.shirtSize.toUpperCase()}
      </Text>
    ))}
    <Text style={{ marginTop: "20px" }}>
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
    <Img src={"https://igrejasv.com/icons/isv.png"} width={100} height={100} />
  </Html>
);

export const generateIsvRunEmailHtml = (people: ParticipantInfo[]) => {
  const html = ReactDOMServer.renderToStaticMarkup(<IsvRunEmailTemplate people={people} /> as any);
  return `<!DOCTYPE html>${html}`;
};
