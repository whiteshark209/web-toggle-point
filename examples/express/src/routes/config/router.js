import { Router, static as assetsFolder } from "express";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.js";

const router = new Router();

router.use(assetsFolder("public"));
router.get("/*", (req, res) => {
  const { pipe } = renderToPipeableStream(
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
        <link href="main.css" rel="stylesheet" />
      </head>
      <body>
        <div>
          <App config={JSON.parse(process.env.CONFIG || null)} />
        </div>
        <p>
          (try re-starting server with a different start command / .env file)
        </p>
      </body>
    </html>,
    {
      bootstrapScripts: ["/config/main.js"],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-type", "text/html");
        pipe(res);
      },
      onShellError() {
        res.statusCode = 500;
        res.send("<!doctype html><p>Loading...</p>");
      }
    }
  );
});

export default router;
