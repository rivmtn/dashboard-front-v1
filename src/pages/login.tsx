import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { LoginDto, LoginFormData, LoginSchema, LoginVo } from "app/auth/schema";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import del from "/public/images/ico-delete.svg";
import Spinner from "components/utils/spinner";

export default function Login() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedId, setSavedId] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [autoLogin, setAutoLogin] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = useCallback(
    async (formData: LoginFormData) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData as LoginDto),
          }
        );
        if (!response.ok) {
          alert(`Error: ${response.status}`);
          return;
        }
        const json = await response.json();
        const message = json.message;
        if (message === "WRONG_ID") {
          alert("아이디가 틀렸습니다.");
          return;
        } else if (message === "WRONG_PASSWORD") {
          alert("비밀번호가 틀렸습니다.");
          return;
        } else if (message !== "SUCCESS") {
          alert(`Error: ${message}`);
          return;
        }
        const data = json.data as LoginVo;
        localStorage.setItem("accessTokenGangsanleeSite", data.accessToken);
        localStorage.setItem("rollGangsanleeSite", data.roll);

        if (rememberMe) {
          localStorage.setItem("savedIdGangsanleeSite", formData.authId);
        } else {
          localStorage.removeItem("savedIdGangsanleeSite");
        }
        if (autoLogin) {
          localStorage.setItem("autoLoginGangsanleeSite", "true");
        } else {
          localStorage.removeItem("autoLoginGangsanleeSite");
        }

        router.push("/report");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    },
    [rememberMe, autoLogin, router]
  );

  useEffect(() => {
    const savedId = localStorage.getItem("savedIdGangsanleeSite");
    const autoLogin = localStorage.getItem("autoLoginGangsanleeSite");
    const accessToken = localStorage.getItem("accessTokenGangsanleeSite");
    if (accessToken && autoLogin === "true") {
      router.push("/report");
    }
    if (savedId) {
      setSavedId(savedId);
      setRememberMe(true);
    }
    if (autoLogin === "true") {
      setAutoLogin(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className={"login"}>
      <form onSubmit={handleSubmit(onSubmit)} className={"form"}>
        <div className={"title"}>
          <h1>로그인</h1>
        </div>
        <div>
          <span>관리자 id: root pw: root</span>
          <br />
          <span>사용자 id: user pw: user</span>
        </div>
        <div className={"input"}>
          <Controller
            name="authId"
            defaultValue={savedId}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl component="fieldset">
                <TextField
                  {...field}
                  variant="outlined"
                  placeholder="아이디"
                  error={Boolean(fieldState.error)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={"inputAdornment"}
                      >
                        <IconButton onClick={() => field.onChange("")}>
                          <Image src={del} width="24" height="24" alt="" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {fieldState.error && (
                  <FormHelperText error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className={"input"}>
          <Controller
            name="password"
            defaultValue={""}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl component="fieldset">
                <TextField
                  {...field}
                  variant="outlined"
                  type="password"
                  placeholder="비밀번호"
                  error={Boolean(fieldState.error)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className={"del-button"}
                          onClick={() => field.onChange("")}
                        >
                          <Image src={del} width="24" height="24" alt="" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {fieldState.error && (
                  <FormHelperText error>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className={"option"}>
          <div>
            <span>아이디 저장</span>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </div>
          <div>
            <span>자동 로그인</span>
            <Checkbox
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
            />
          </div>
        </div>
        <div className={"button-group"}>
          <Button
            className={"button"}
            type="submit"
            size="large"
            variant="contained"
          >
            로그인
          </Button>
        </div>
      </form>
    </section>
  );
}
