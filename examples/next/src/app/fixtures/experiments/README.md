# Experimentation

These examples demonstrate the original use-case at ASOS for the Toggle project, designed to
take headers coming inbound from an Akamai Edgeworker and vary the server-generated response
sent back to the client, based on decisions held within.

To interact with these experiments, a facsimile / test double fake for the edgeworker is required.

[mod header](https://modheader.com/), or some other tool for modifying request headers should
be used, setting a header called `experiments` with a value of the following type:

```typescript
export type Decision = { [bucket: string]: string };
export type Experiments = {
  decisions: {
    [feature: string]: Decision;
  };
  audience: any;
};
```

## Examples

1. [Varying a Module](./1-varied-component/)
2. [Varying a Module And It's Dependency](./2-variant-with-name-matched-dependency/)
3. [Extending / Composing a Module in Variation](./3-varied-component-extending-control/)
4. [Varying a Variation](./4-varied-variant/)
5. [Opting Out of Join Points using a local Toggle Config](./5-toggle-config-opt-out/)
6. [Filtering Join Points using a Toggle Config](./6-toggle-config-variant-filter-same-directory/)
7. [Using Varied Code without Toggling its Directory](./7-toggle-config-variant-filter-alternate-directory/)
