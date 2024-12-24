const generatePointCut = ({ pointCuts, path }) => {
  const pointCutName = path.slice(1);
  const {
    togglePointModule,
    toggleHandler = "@asos/web-toggle-point-webpack/pathSegmentToggleHandler"
  } = pointCuts.find(({ name }) => name === pointCutName);

  return `import togglePoint from "${togglePointModule}";
import handler from "${toggleHandler}";
export default (rest) => handler({ togglePoint, ...rest });`;
};

export default generatePointCut;
