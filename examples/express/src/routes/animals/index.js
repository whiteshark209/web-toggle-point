import { Router } from "express";
import streamImage from "./streamImage.js";
import featuresStore from "./featuresStore.js";
import featuresMiddleware from "./middleware.js";

const router = Router();

router.use(featuresMiddleware);
router.get("/images", (_, response) => {
  console.log("running images route");
  return streamImage(response);
});
router.get("/", (_, response) => {
  response.send(`<!DOCTYPE html>
  <html lang="en">
    <body>
      <img src="/animals/images" alt="An animal" data-version="${featuresStore.getFeatures().version}" />
    </body>
  </html>`);
});

export default router;
