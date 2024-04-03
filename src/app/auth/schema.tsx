export interface LoginDto {
  authId: string;
  password: string;
}

export interface LoginVo {
  accessToken: string;
  roll: string;
}

import { z } from "zod";

export const LoginSchema = z.object({
  authId: z.string().min(1, "아이디를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
export type LoginFormData = z.infer<typeof LoginSchema>;

