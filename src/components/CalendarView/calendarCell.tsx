import { useRef } from "react";
import {
  mergeProps,
  useCalendarCell,
  useFocusRing,
  useLocale,
} from "react-aria";
import { CalendarState } from "react-stately";
import {
  CalendarDate,
  getDayOfWeek,
  getLocalTimeZone,
  isToday,
} from "@internationalized/date";
import { cn } from "@/lib/utils";
import dateMark from "@/actions/dateMark";

export function CalendarCell({
  state,
  date,
  currentMonth,
  calendarData, //C
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  calendarData: string; //C
}) {
  let ref = useRef(null);
  let { locale } = useLocale(); //C
  let dayofweek = getDayOfWeek(date, locale); //C
  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  const isDateToday = isToday(date, getLocalTimeZone());
  let stringdate = dayofweek.toString(); //C
  let isMarkedDate = calendarData?.includes(stringdate); //C

  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className="size-10 outline-none group rounded-md"
      >
        <div
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-semibold",
            isDisabled ? "text-muted-foreground cursor-not-allowed" : "",
            isSelected ? "bg-primary text-white" : "",
            !isSelected && !isDisabled ? "hover:bg-primary/10" : ""
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-2.5 transform-translate-x-1/2 translate-y-1/2 size-1.5 bg-primary rounded-full",
                isSelected && "bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
