const Controls = ({ setConfig }) => {
  const sizes = ["Small", "Medium", "Large"];
  return (
    <ol>
      {sizes.map((size) => (
        <li key={size}>
          <button onClick={() => setConfig({ "div-style": { size } })}>
            {size}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Controls;
