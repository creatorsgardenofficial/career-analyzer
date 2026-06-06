declare module "holiday-jp" {
  type HolidayJp = {
    between: (start: Date, end: Date) => Array<{ date: Date; name: string }>;
    isHoliday: (date: Date) => boolean;
  };

  const holidayJp: HolidayJp;
  export default holidayJp;
}
