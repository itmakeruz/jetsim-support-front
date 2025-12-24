interface CustomLabelProps {
  labelText: string;
  className?: string;
  htmlFor?: string;
}

function CustomLabel({ labelText, className = "", htmlFor }: CustomLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-main-black whitespace-nowrap font-normal text-base ${className}`}
    >
      {labelText}
    </label>
  );
}

export default CustomLabel;
