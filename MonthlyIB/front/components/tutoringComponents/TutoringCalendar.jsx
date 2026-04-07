import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Tutoring.module.css";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TutoringCalendar = ({ className, value, setValue }) => {
  const onChange = (selectedDate) => {
    setValue(formatLocalDate(selectedDate));
  };

  return (
    <>
      <Calendar
        className={className}
        onChange={onChange}
        tileDisabled={({ date }) => {
          const temp = new Date();
          temp.setDate(temp.getDate() - 1);
          return date <= temp;
        }}
        value={value ? new Date(`${value}T00:00:00`) : null}
        calendarType="gregory"
        formatDay={(locale, date) =>
          date.toLocaleString("en", { day: "numeric" })
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") {
            return null;
          }

          if (date.getDay() === 0) {
            return styles.calendarSunday;
          }

          if (date.getDay() === 6) {
            return styles.calendarSaturday;
          }

          return null;
        }}
      />
    </>
  );
};

export default TutoringCalendar;
