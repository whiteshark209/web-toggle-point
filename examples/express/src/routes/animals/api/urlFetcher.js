class Fetcher {
  #endpoint;
  constructor(endpoint) {
    if (new.target === Fetcher) {
      throw new TypeError("Fetcher is Abstract and cannot be instantiated");
    }
    this.#endpoint = endpoint;
  }
  async fetch() {
    return await (await fetch(this.#endpoint)).json();
  }
}

export default Fetcher;
