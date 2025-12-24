import { useMask } from "@react-input/mask";
import CustomLabel from "./CustomLabel";

interface MaskedPhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
  divClassname?: string;
  disabled?: boolean;
}

const MaskedPhoneInput: React.FC<MaskedPhoneInputProps> = ({
  value,
  onChange,
  name,
  placeholder = "+998 __ ___ __ __",
  label,
  className = "",
  required,
  divClassname = "",
  disabled = false,
}) => {
  const inputRef = useMask({
    mask: "+998 __ ___ __ __",
    replacement: { _: /\d/ },
    showMask: true,
  });

  return (
    <div className={`flex items-center justify-between gap-2 ${divClassname}`}>
      {label && <CustomLabel labelText={label} />}
      <input
        ref={inputRef}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        className={`border w-full outline-none px-4 py-3 border-[rgb(116,120,141,0.35)] rounded text-sm 
          ${className} ${disabled ? "!border-transparent" : ""}
          `}
      />
    </div>
  );
};

export default MaskedPhoneInput;
