import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TextField,
} from "@mui/material";
import { MemberFormData, MemberSchema } from "app/member/schema";
import { MemberDto } from "app/member/schema";
import CloseIcon from "assets/icons/close";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const MemberCreateModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(MemberSchema),
  });
  const onSubmit = useCallback(
    async (formData: MemberFormData) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/member`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessTokenGangsanleeSite")}`,
            },
            body: JSON.stringify(formData as MemberDto),
          }
        );
        if (!response.ok) {
          alert(`Error: ${response.status}`);
          return;
        }
        const json = await response.json();
        const message = json.message;
        if (
          message === "NO_ACCESS_TOKEN" ||
          message === "EXPIRED_ACCESS_TOKEN" ||
          message === "WRONG_ACCESS_TOKEN"
        ) {
          alert("로그인이 필요합니다.");
          localStorage.removeItem("accessTokenGangsanleeSite");
          router.push("/login");
          return;
        } else if (message === "ACCESS_DENIED") {
          alert("접근 권한이 없습니다.");
          localStorage.removeItem("accessTokenGangsanleeSite");
          router.push("/login");
        } else if (message === "DUPLICATED_ID") {
          alert("이미 존재하는 아이디입니다.");
          return;
        } else if (message !== "SUCCESS") {
          alert(`Error: ${message}`);
          return;
        }
        alert("사용자가 생성되었습니다.");
        router.reload();
      } catch (error) {
        alert(`Error: ${error}`);
      }
    },
    [router]
  );

  useEffect(() => {
    if (open) {
      reset({
        roll: "user",
        authId: "",
        password: "",
        pwConfirm: "",
        apiKey: "",
      });
    }
  }, [open, reset]);
  return (
    <Dialog className="modal" open={open} onClose={() => setOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <strong>
            <span>사용자 생성</span>
          </strong>
          <Button className="close-button" onClick={() => setOpen(false)}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Table>
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "70%" }} />
            </colgroup>
            <TableBody>
              <tr>
                <th scope="row">
                  권한<span style={{ color: "red" }}>*</span>
                </th>
                <td>
                  <Controller
                    name="roll"
                    defaultValue={"user"}
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="user"
                            control={<Radio />}
                            label="user"
                          />
                          <FormControlLabel
                            value="admin"
                            control={<Radio />}
                            label="admin"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">
                  아이디<span style={{ color: "red" }}>*</span>
                </th>
                <td>
                  <Controller
                    name="authId"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="아이디"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.authId && (
                    <FormHelperText error>
                      {errors.authId.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  비밀번호<span style={{ color: "red" }}>*</span>
                </th>
                <td>
                  <Controller
                    name="password"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          type="password"
                          variant="outlined"
                          placeholder="비밀번호"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.password && (
                    <FormHelperText error>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row" />
                <td>
                  <Controller
                    name="pwConfirm"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          type="password"
                          variant="outlined"
                          placeholder="비밀번호 확인"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.pwConfirm && (
                    <FormHelperText error>
                      {errors.pwConfirm.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  API KEY<span style={{ color: "red" }}>*</span>
                </th>
                <td>
                  <Controller
                    name="apiKey"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="API KEY"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.apiKey && (
                    <FormHelperText error>
                      {errors.apiKey.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
            </TableBody>
          </Table>
          <div className="dialog-button">
            <Button type="submit">확인</Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
