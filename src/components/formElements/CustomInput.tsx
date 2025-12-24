import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEvent } from "react";

interface CustomInputProps {
  name?: string;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
  value: string | number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  divClassname?: string;
  inputDivClassname?: string;
  inputClassname?: string;
  textareaClassname?: string;
  rest?: any;
  step?: string;
}

export default function CustomInput({
  name,
  label,
  type = "text",
  placeholder = "",
  required = false,
  value,
  onChange,
  error = "",
  divClassname = "",
  inputDivClassname = "",
  inputClassname = "",
  textareaClassname = "",
  step = "1",
  ...rest
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const textarea = type === "textarea";
  const actualType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-[6px] w-full ${divClassname}`}>
      {label && (
        <label className="text-sm font-medium text-main-black">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ✅ TEXTAREA */}
      <div
        className={`relative flex items-center rounded-[6px] px-2 py-1 min-h-[40px] border border-main-black ${inputDivClassname} ${
          error ? "border-red-500" : ""
        }`}
      >
        {textarea && (
          <textarea
            className={`w-full text-main-black bg-transparent placeholder-main-grey !outline-none min-h-28 ${textareaClassname}`}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            name={name}
            {...rest}
          />
        )}
        {!textarea && (
          <input
            name={name}
            type={actualType}
            className={`w-full text-main-black bg-transparent placeholder-main-grey ${inputClassname}`}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            step={step}
            {...rest}
          />
        )}

        {/* ✅ PASSWORD ko‘zcha */}
        {type === "password" && (
          <span
            className="absolute right-3 w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        )}
      </div>

      {/* ✅ ERROR */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
