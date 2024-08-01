import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TutoringCalendar = ({ styles, value, setValue }) => {
  const onChange = (e) => {
    const newE = e;
    e.setDate(e.getDate() + 1);
    const f = newE.toISOString().split("T")[0];
    setValue(f);
  };
  return (
    <>
      <Calendar
        className={styles}
        onChange={onChange}
        tileDisabled={({ date }) => {
          const temp = new Date();
          temp.setDate(temp.getDate() - 1);
          return date <= temp;
        }}
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
