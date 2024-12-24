import { Readable } from "stream";
import { pipeline } from "stream/promises";
import UrlFetcher from "./api/urlFetcher.js";

const streamImage = async (response) => {
  const url = await new UrlFetcher().fetch();
  const imageResponse = await fetch(url);
  for (const header of ["Content-Type", "Content-Length"]) {
    response.setHeader(header, imageResponse.headers.get(header));
  }
  pipeline(Readable.fromWeb(imageResponse.body), response);
};

export default streamImage;
