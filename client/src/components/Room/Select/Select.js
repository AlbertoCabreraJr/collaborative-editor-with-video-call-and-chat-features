const Select = ({
  onChangeHandler,
  options,
  selectName,
  cssClass,
  defaultVal,
}) => {
  return (
    <select className={cssClass} onChange={onChangeHandler}>
      <option key="selectName" selected disabled>
        {selectName}
      </option>
      <option key="default" disabled>
        Default-{defaultVal}
      </option>
      {options.map((op, index) => (
        <option key={index} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
};

export default Select;
