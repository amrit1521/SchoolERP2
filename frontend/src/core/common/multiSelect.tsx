import Select from "react-select";
import type { MultiValue, ActionMeta } from "react-select";

export type Option = {
  value: string | number;
  label: string;
};

export interface MultiSelectProps {
  options: Option[];
  value: Option[]; // ✅ Controlled value
  className?: string;
  placeholder?: string;
  onChange?: (values: (string | number)[]) => void; // Returns only values
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  className,
  placeholder = "Select",
  onChange,
}) => {
  const handleChange = (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
    const selected = newValue as Option[];
    console.log(actionMeta ? "": "");
    if (onChange) {
      onChange(selected.map((opt) => opt.value));
    }
  };

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      options={options}
      value={value}
      onChange={handleChange}
      isMulti
      placeholder={placeholder}
    />
  );
};

export default MultiSelect;
