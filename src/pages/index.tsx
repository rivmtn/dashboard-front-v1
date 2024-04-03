import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokenGangsanleeSite");
    const autoLogin = localStorage.getItem("autoLoginGangsanleeSite");
    if (accessToken && autoLogin === "true") {
      router.push("/report");
    } else {
      router.push("/login");
    }
  }, []);
  return <></>;
}
