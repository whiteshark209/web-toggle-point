import Fetcher from "../../urlFetcher.js";

class CatsFetcher extends Fetcher {
  constructor() {
    super("https://api.thecatapi.com/v1/images/search");
  }
  async fetch() {
    const [{ url }] = await super.fetch();
    return url;
  }
}

export default CatsFetcher;
