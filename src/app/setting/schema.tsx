export interface SettingVo {
  settingId?: string;
  startDate?: string;
  endDate?: string;
  ratio?: string;
}
export interface SettingDto extends SettingVo {}

import { z } from "zod";

const isValidDate = (dateStr: string): boolean => {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const lastDayOfMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= lastDayOfMonth;
};

export const SettingSchema = z.object({
  startDate: z
    .string()
    .refine(
      (value) => value === "" || (/^\d{8}$/.test(value) && isValidDate(value)),
      {
        message: "올바른 날짜 형식(YYYYMMDD)을 입력해주세요.",
      }
    ),
  endDate: z
    .string()
    .refine(
      (value) => value === "" || (/^\d{8}$/.test(value) && isValidDate(value)),
      {
        message: "올바른 날짜 형식(YYYYMMDD)을 입력해주세요.",
      }
    ),
  ratio: z.string().refine((value) => /^(100|[1-9]?[0-9])$/.test(value), {
    message: "0~100 사이의 정수 형식으로 입력해주세요.",
  }),
});
export type SettingFormData = z.infer<typeof SettingSchema>;
