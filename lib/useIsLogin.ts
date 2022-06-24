import { useEffect, useState } from "react";

export default function useIsLogin(): boolean {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLogin(true);
    }
  }, [isLogin]);

  return isLogin;
}
