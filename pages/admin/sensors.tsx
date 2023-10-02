import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardContent, Stack } from "@mui/material";
import { getMilliseconds } from "date-fns";
import { ShopLayout } from "../../components/layouts";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const mqtt = require("mqtt");

const host = "mqttbroker.frank4.com.ar";
const port = "9001";

const connectUrl = `ws://${host}:${port}`;

const EquipmentsPage = ({ initialSensorData }) => {
  const [sensorData, setSensorData] = useState(initialSensorData);

  useEffect(() => {
    const client = mqtt.connect(connectUrl);

    client.on("connect", () => {
      console.log("Connected");
      client.subscribe("/laboratorio/sensor/#", () => {
        console.log(`Subscribe to topic: /sensor/#`);
      });
    });

    client.on("message", (topic, payload) => {
      console.log("Received Message:", topic, payload.toString());

      // Extraer el nombre del sensor del tema
      const sensorName = topic.split("/").pop();

      // Actualiza el estado con los datos del sensor correspondiente
      setSensorData((prevData) => ({
        ...prevData,
        [sensorName]: payload.toString(),
      }));
    });

    // Limpia el cliente MQTT cuando el componente se desmonta
    return () => {
      client.end();
    };
  }, []); // El segundo argumento [] garantiza que este efecto solo se ejecute una vez al montar el componente

  return (
    <ShopLayout title={"Sensores"} pageDescription={""}>
      {Object.keys(sensorData).map((sensorName) =>
        sensorName === "Temperatura Chiller" ? (
          <Card
            sx={{ maxWidth: 375 }}
            key={getMilliseconds(new Date())}
          >
            <CardHeader title={sensorName} />
            <CardContent>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <ThermostatIcon sx={{ color: "#202020", fontSize: 78 }} />
                <Typography
                  variant="h1"
                  sx={{ color: "#202020", fontSize: 120 }}
                >
                  {sensorData[sensorName]}°
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : null
      )}
    </ShopLayout>
  );
};

export default EquipmentsPage;

export async function getServerSideProps(context) {
  const client = mqtt.connect(connectUrl);

  client.on("connect", () => {
    console.log("Connected");
    client.subscribe("/laboratorio/sensor/#", () => {
      console.log(`Subscribe to topic: /sensor/#`);
    });
  });

  const initialSensorData = {}; // Aquí puedes cargar datos iniciales si es necesario

  // Esperar a que la conexión MQTT esté lista antes de obtener datos iniciales
  await new Promise<void>((resolve) => {
    client.on("message", (topic, payload) => {
      console.log("Received Message:", topic, payload.toString());

      // Extraer el nombre del sensor del tema
      const sensorName = topic.split("/").pop();

      // Actualizar los datos iniciales con los datos del sensor correspondiente
      initialSensorData[sensorName] = payload.toString();

      // Si tienes todos los datos iniciales que necesitas, resuelve la promesa
      if (Object.keys(initialSensorData).length === 1) {
        resolve();
      }
    });
  });

  // Limpia el cliente MQTT después de obtener los datos iniciales
  client.end();

  return {
    props: { initialSensorData },
  };
}
