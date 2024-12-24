import Fetcher from "../../urlFetcher.js";

class DogsFetcher extends Fetcher {
  constructor() {
    super("https://dog.ceo/api/breeds/image/random");
  }
  async fetch() {
    const { message } = await super.fetch();
    return message;
  }
}

export default DogsFetcher;
