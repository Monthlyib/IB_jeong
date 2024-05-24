import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TutoringCalendar = ({ styles, value, setValue }) => {
  const onChange = (e) => {
    e.setDate(e.getDate() + 1);
    const f = e.toISOString();
    setValue(f);
  };
  return (
    <>
      <Calendar
        className={styles}
        onChange={onChange}
        value={value}
        calendarType="hebrew"
        formatDay={(locale, date) =>
          date.toLocaleString("en", { day: "numeric" })
        }
      />
    </>
  );
};

export default TutoringCalendar;
