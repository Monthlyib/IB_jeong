import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TutoringCalendar = ({ styles, value, setValue }) => {
  const onChange = (e) => {
    const newE = e;
    e.setDate(e.getDate() + 1);
    const f = newE.toISOString().split("T")[0];
    console.log(f);
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
