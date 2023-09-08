import NextLink from "next/link";
import React, {
  useContext,
  HTMLAttributes,
  HTMLProps,
  useState,
  useEffect,
} from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import { getMilliseconds } from 'date-fns'
import { ShopLayout } from "../../components/layouts";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { GetServerSideProps } from "next";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const mqtt = require("mqtt");

const host = "mqttbroker.frank4.com.ar";
const port = "9001";

const connectUrl = `ws://${host}:${port}`;
//const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl);

const gradientColors = {
  blue: "#00adb5",
  red: "#ff5722",
};

const EquipmentsPage = () => {
  const [sensorData, setSensorData] = useState({});
  useEffect(() => {
    client.on("connect", () => {
      console.log("Connected");
      client.subscribe("/laboratorio/sensor/#", () => {
        console.log(`Subscribe to topic: /sensor/#`);
      });
      client.publish("/laboratorio/sensor/requieredData",'send', () => {
        console.log(`Data send`);
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
  }, []);

  const getTemperatureColor = (temperature) => {
    if (temperature <= 0) {
      return gradientColors.blue;
    } else if (temperature >= 80) {
      return gradientColors.red;
    } else {
      // Interpolación lineal para calcular el color en el rango intermedio
      const blueValue = (temperature / 80) * 255;
      const redValue = 255 - blueValue;
      return `rgb(${redValue}, 0, ${blueValue})`;
    }
  };

  return (
    <ShopLayout title={"Sensores"} pageDescription={""}>

      {Object.keys(sensorData).map((sensorName) => (
        sensorName == 'Temperatura Chiller' ? 
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
              <Typography variant="h1" sx={{ color: "#202020", fontSize: 120 }}>
                {sensorData[sensorName]}°
              </Typography>
            
            </Stack>
          </CardContent>
        </Card>
      : null
      
      ))}
    </ShopLayout>
  );
};

export default EquipmentsPage;
