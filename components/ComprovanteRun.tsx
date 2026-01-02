import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontSize: "14px",
    fontWeight: "light",
  },
  section: {
    margin: 15,
    padding: 15,
    textAlign: "center",
    gap: 15,
  },
});

interface ParticipantData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  gender: string;
  shirtSize: string;
  modalidade: 'walk' | 'run';
}

interface ParticipantWithQR extends ParticipantData {
  qrCodeSvg: any;
}

interface ComprovanteRunProps {
  people: ParticipantWithQR[];
  email: string;
}

export const ComprovanteRun = (props: ComprovanteRunProps) => {
  const { people, email } = props;
  const idx = email.indexOf("@");

  return (
    <Document>
      {people.map((person, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Comprovante de Inscrição</Text>
            <View
              style={{
                display: "flex",
                gap: 15,
              }}
            >
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-start",
                }}
              >
                <Text>ISV RUN 2026</Text>
                <Text style={{ color: "#8d8d8d" }}>Igreja em São Vicente</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "flex-start",
                }}
              >
                <Text>Modalidade: {person.modalidade === 'run' ? 'Corrida 5km' : 'Caminhada 5km'}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  gap: 15,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={"https://construcao.igrejasv.com/calendar.png"}
                    style={{ width: 30, height: 30 }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    <Text>07 de Fevereiro de 2026</Text>
                    <Text>18:30</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={"https://construcao.igrejasv.com/marker.png"}
                    style={{ width: 30, height: 30 }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.5,
                    }}
                  >
                    <Text>Canto do Ilha Porchat</Text>
                    <Text>São Vicente</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <View style={{ display: "flex", lineHeight: 1.5 }}>
                  <Text style={{ color: "#8d8d8d" }}>E-mail de Contato</Text>
                  <Text>
                    {email.slice(0, 3) +
                      "******" +
                      email.slice(idx - 1)}
                  </Text>
                </View>

                <View style={{ display: "flex", lineHeight: 1.5, gap: 10 }}>
                  <Text style={{ color: "#8d8d8d" }}>Participante</Text>
                  <View style={{ display: "flex", gap: 5, paddingLeft: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{person.nome}</Text>
                    <Text style={{ fontSize: 12 }}>
                      CPF: {person.cpf.slice(0, 3) + "*******" + person.cpf.slice(-2)}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      Modalidade: {person.modalidade === 'run' ? 'Corrida 5km' : 'Caminhada 5km'}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      Tamanho da Camisa: {person.shirtSize.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ display: "flex", alignItems: "center" }}>
                  <Image source={person.qrCodeSvg} style={{ width: 150, height: 150 }} />
                </View>
              </View>
            </View>
            <View style={{ display: "flex", alignItems: "center" }}>
              <Image
                source="https://ad20.igrejasv.com/plasmic/a_d_2/images/isv.png"
                style={{ width: 100, height: 100 }}
              />
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};
