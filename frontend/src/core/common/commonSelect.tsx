import { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string | number;
  label: string;
};

export interface SelectProps {
  options: Option[];
  value?: string | number |null;        
  defaultValue?: string | number | {};  
  className?: string;
  styles?: any;
  onChange?: (value: Option | null) => void;
}

const CommonSelect: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  className,
  styles,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

 
  useEffect(() => {
    if (value !== undefined) {
      const found = options.find((opt) => opt.value === value) || null;
      setSelectedOption(found);
    } else if (defaultValue !== undefined) {
      const found = options.find((opt) => opt.value === defaultValue) || null;
      setSelectedOption(found);
    }
  }, [value, defaultValue, options]);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
    if (onChange) onChange(option); // 🔹 pass selected object back
  };

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      styles={styles}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
    />
  );
};

export default CommonSelect;
