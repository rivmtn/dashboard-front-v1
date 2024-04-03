import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Table,
  TableBody,
  TextField,
} from "@mui/material";
import { SettingFormData, SettingSchema, SettingDto } from "app/setting/schema";
import CloseIcon from "assets/icons/close";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const SettingCreateModal = ({
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
  } = useForm<SettingFormData>({
    resolver: zodResolver(SettingSchema),
  });
  const onSubmit = useCallback(
    async (formData: SettingFormData) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/setting`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessTokenGangsanleeSite")}`,
            },
            body: JSON.stringify(formData as SettingDto),
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
          return;
        } else if (message !== "SUCCESS") {
          alert(`Error: ${message}`);
          return;
        }
        alert("설정이 생성되었습니다.");
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
        startDate: "",
        endDate: "",
        ratio: "",
      });
    }
  }, [open, reset]);
  return (
    <Dialog className="modal" open={open} onClose={() => setOpen(false)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <strong>
            <span>설정 생성</span>
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
                <th scope="row">시작일</th>
                <td>
                  <Controller
                    name="startDate"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="YYYYMMDD"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.startDate && (
                    <FormHelperText error>
                      {errors.startDate.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">종료일</th>
                <td>
                  <Controller
                    name="endDate"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="YYYYMMDD"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.endDate && (
                    <FormHelperText error>
                      {errors.endDate.message}
                    </FormHelperText>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  비율(%)<span style={{ color: "red" }}>*</span>
                </th>
                <td>
                  <Controller
                    name="ratio"
                    defaultValue={""}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl component="fieldset">
                        <TextField
                          {...field}
                          variant="outlined"
                          placeholder="0~100 사이의 정수"
                          error={Boolean(fieldState.error)}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.ratio && (
                    <FormHelperText error>
                      {errors.ratio.message}
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
