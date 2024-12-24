import express from "express";
import animalsRouter from "./routes/animals/router.js";
import configRouter from "./routes/config/router.js";

const app = express();
const PORT = process.env.PORT;

app.use("/animals", animalsRouter);
app.use("/config", configRouter);
app.get("/", (_, response) => {
  response.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin={"true"}
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Didact Gothic", sans-serif;
        font-weight: 400;
        font-style: normal;
        height: 100vh;
        display: flex;
        margin: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <ul>
      <li><a href="/animals">Version header with nodeRequestScoped store</a></li>
      <li><a href="/config">.env config with ssrBackedReactContext store for initial value in browser</a></li>
    </ul>
  </body>
</html>`);
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
