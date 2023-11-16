import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import { getMilliseconds } from "date-fns";
import { ShopLayout } from "../../components/layouts";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import RefreshIcon from "@mui/icons-material/Refresh";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";

const mqtt = require("mqtt");

const host = "mqttbroker.frank4.com.ar";
const port = "9001";

const connectUrl = `ws://${host}:${port}`;

const waitForData = (client) => {
  return new Promise((resolve) => {
    let timer;
    const timeout = 5000; // Tiempo límite en milisegundos (en este ejemplo, 10 segundos).
    const initialSensorData = { OUT: null, IN: null };

    const onDataReceived = () => {
      clearTimeout(timer);
      resolve(initialSensorData);
    };

    timer = setTimeout(() => {
      // Si el tiempo límite se alcanza, resuelve la promesa con datos nulos.
      resolve(initialSensorData);
    }, timeout);

    client.on("message", (topic, payload) => {
      onDataReceived();

      const sensorName = topic.split("/").pop();

      // Actualizar los datos iniciales con los datos del sensor correspondiente
      if (sensorName === "OUT" || sensorName === "IN") {
        initialSensorData[sensorName] = payload.toString();
      }

      // Si tienes los datos de "OUT" y "IN", resuelve la promesa
      if (initialSensorData.OUT !== null && initialSensorData.IN !== null) {
        resolve(initialSensorData);
      }
    });
  });
};

const requestData = () => {
  const client2 = mqtt.connect(connectUrl);
  client2.on("connect", () => {
    console.log("Connected to client2");
    client2.publish("/INGENIERIA/SENSOR/REQUEST", "SEND", () => {
      console.log("Request sent successfully");
      client2.end(); // Cierra la conexión después de enviar el mensaje
    });
  });
};



const EquipmentsPage = ({ initialSensorData }) => {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const handleRefreshClick = async () => {
    requestData(); // Llama a requestData para enviar la solicitud.
    const client = mqtt.connect(connectUrl); // Crea un nuevo cliente MQTT
    client.on("connect", () => {
      client.subscribe("/INGENIERIA/RM/CHILLER_RESONANCIA/#");
    });

    // Espera a que los datos se actualicen utilizando waitForData y el cliente MQTT
    waitForData(client).then((refreshedSensorData) => {
      // Limpia el cliente MQTT después de obtener los datos
      client.end();

      // Actualiza el estado con los nuevos datos.
      setSensorData(refreshedSensorData);
    });

  };
  useEffect(() => {
    const client = mqtt.connect(connectUrl);

    client.on("connect", () => {
      client.subscribe("/INGENIERIA/RM/CHILLER_RESONANCIA/#");
    });

    client.on("message", (topic, payload) => {
      console.log("Received Message:", topic, payload.toString());

      const sensorName = topic.split("/").pop();

      setSensorData((prevData) => ({
        ...prevData,
        [sensorName]: payload.toString(),
      }));
    });

    return () => {
      client.end();
    };
  }, []);
  return (
    <ShopLayout title={"Sensores"} pageDescription={""}>
      <Card sx={{ width: 375 }} key={getMilliseconds(new Date())}>
        <CardHeader
          title={<Typography variant="h1">Chiller resonancia</Typography>}
          action={
            <IconButton aria-label="settings" onClick={handleRefreshClick}>
              <RefreshIcon />
            </IconButton>
          }
          avatar={<ThermostatIcon sx={{ color: "#202020", fontSize: 42 }} />}
        />
        <CardContent>
          {sensorData["IN"] == null && sensorData["IN"] == null ? (
            <Typography
   variant="h1"
              align="center"
              sx={{ color: "GRAY", fontSize: 32,paddingTop: 5.3, paddingBottom: 5.3 }}
            >
              DESCONECTADO
            </Typography>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Box sx={{ width: "50%" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <SouthIcon />
                  <Typography variant="subtitle1">Entrada:</Typography>
                </Stack>
                {sensorData["IN"] == "ERROR" ? (
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ paddingTop: 3.5, paddingBottom: 3.5 }}
                  >
                    ERROR
                  </Typography>
                ) : (
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ color: "#202020", fontSize: 78 }}
                  >
                    {sensorData["IN"]}°
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: "50%" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <NorthIcon />
                  <Typography variant="subtitle1">Salida:</Typography>
                </Stack>
                {sensorData["OUT"] == "ERROR" ? (
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ paddingTop: 3.5, paddingBottom: 3.5 }}
                  >
                    ERROR
                  </Typography>
                ) : (
                  <Typography
                    variant="h1"
                    align="center"
                    sx={{ color: "#202020", fontSize: 78 }}
                  >
                    {sensorData["OUT"]}°
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    </ShopLayout>
  );
};

export default EquipmentsPage;

export async function getServerSideProps(context) {
  const client = mqtt.connect(connectUrl);

  client.on("connect", () => {
    console.log("Connected");
    client.subscribe("/INGENIERIA/RM/CHILLER_RESONANCIA/#", () => {
      console.log(`Subscribe to topic: /sensor/#`);
    });
    client.publish("/INGENIERIA/SENSOR/REQUEST", "SEND", () => {
      console.log("Publish error: ");
    });
  });

  const initialSensorData = { OUT: null, IN: null };

  const sensorData = await waitForData(client);

  // Limpia el cliente MQTT después de obtener los datos iniciales
  client.end();

  console.log(sensorData);

  return {
    props: { initialSensorData: sensorData },
  };
}