// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import CustomInput from "@/components/formElements/CustomInput";
import UniversalBtn from "@/components/buttons/UniversalBtn";
import { handleChange } from "@/utils/handleChange";
import { reconnectSocket } from "@/lib/socket";

import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login, token, getProfile } = useAuthStore();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  useEffect(() => {
    const checkExistingAuth = async () => {
      if (token) {
        navigate("/", { replace: true });
      }
    };

    checkExistingAuth();
  }, [token, getProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    if (result.success) {
      // Login qilgandan keyin socket reconnect qilish
      reconnectSocket();
      toast.success(result.message);
      setLoading(false);
      navigate("/");
    } else {
      toast.error(result.message || "Ошибка входа!");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-2xl p-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-main-black">
          Вход в Jetsim
        </h2>
        <CustomInput
          label="Логин"
          placeholder="Логин"
          name="login"
          required
          value={form.login}
          onChange={handleChange(setForm)}
        />
        <CustomInput
          type="password"
          label="Пароль"
          placeholder="Пароль"
          name="password"
          required
          value={form.password}
          inputDivClassname="pr-[30px]"
          onChange={handleChange(setForm)}
        />
        <UniversalBtn
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 disabled:cursor-not-allowed bg-main-color rounded justify-center hover:bg-main-color/90! disabled:bg-main-color/50!"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Войти"}
        </UniversalBtn>
      </form>
    </div>
  );
}
