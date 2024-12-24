import getIssuerModule from "./getIssuerModule";

describe("getIssuerModule", () => {
  const issuerModule = { resource: Symbol("test-resource") };

  it("should return the module that matches the issuer from the resolve data context", () => {
    expect(
      getIssuerModule({
        compilation: {
          modules: [{ resource: Symbol("test-other-resource") }, issuerModule]
        },
        resolveData: {
          contextInfo: {
            issuer: issuerModule.resource
          }
        }
      })
    ).toBe(issuerModule);
  });
});
