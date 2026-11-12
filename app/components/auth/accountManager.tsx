import { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { AccountMode } from "./account.types";
import { IoIosCloseCircle } from "react-icons/io";

export default function AccountManager({
  onClose
}: {
  onClose: () => void
}) {
  const [mode, setMode] = useState<AccountMode>(AccountMode.LOGIN);
  return (
    <div className="relative rounded-lg">
      <IoIosCloseCircle className="absolute cursor-pointer size-[30px] top-2 right-2 text-icy-aqua-400 " onClick={onClose}/>
      {
        (mode === "LOGIN") ? 
        <LoginForm onChangeMode={() => setMode(AccountMode.REGISTER)}/> : 
        <RegisterForm onChangeMode={() => setMode(AccountMode.LOGIN)}/>
      }
    </div>
  );
}