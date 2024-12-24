import { Router } from "express";
import streamImage from "./streamImage.js";
import featuresStore from "./featuresStore.js";
import featuresMiddleware from "./middleware.js";

const router = new Router();
router.use(featuresMiddleware);
router.get("/", (_, response) => {
  response.send(`<!DOCTYPE html>
<html lang="en">
  <body>
    <img src="/animals/images" alt="An animal" data-version="${featuresStore.getFeatures().version}" />
  </body>
</html>`);
});
router.get("/images", (_, response) => {
  return streamImage(response);
});

export default router;
