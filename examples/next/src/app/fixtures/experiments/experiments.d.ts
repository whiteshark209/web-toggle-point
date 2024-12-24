export type Decision = { [bucket: string]: string };
export type Experiments = {
  decisions: {
    [feature: string]: Decision;
  };
  audience: any;
};
