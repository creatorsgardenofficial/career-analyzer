import { format } from "date-fns";
import { ja } from "date-fns/locale";
import holidayJp from "holiday-jp";

export function formatDateTime(date: Date): string {
  return format(date, "yyyy/MM/dd HH:mm", { locale: ja });
}

export function formatDateWithHoliday(date: Date | string): string {
  const parsed = typeof date === "string" ? new Date(date) : date;
  const base = format(parsed, "yyyy/MM/dd (EEE)", { locale: ja });
  return holidayJp.isHoliday(parsed) ? `${base} ※祝日` : base;
}

export function getHolidayNote(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return null;
  return holidayJp.isHoliday(parsed)
    ? "この日は祝日です。面談日程の調整時にご注意ください。"
    : null;
}
