export interface MemberVo {
  memberId?: string;
  roll?: string;
  authId?: string;
  password?: string;
  apiKey?: string;
  createdAt?: string;
}

export interface MemberDto extends MemberVo {}

import { z } from "zod";

export const MemberSchema = z
  .object({
    roll: z.string().min(1, "권한을 선택해주세요."),
    authId: z.string().min(1, "아이디를 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
    pwConfirm: z.string().min(1, "비밀번호를 다시 입력해주세요."),
    apiKey: z.string().min(1, "API KEY를 입력해주세요."),
  })
  .refine((data) => data.password === data.pwConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["pwConfirm"],
  });
export type MemberFormData = z.infer<typeof MemberSchema>;