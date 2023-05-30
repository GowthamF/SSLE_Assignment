import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export const formatDate = (date: string | Date) => {
  return dayjs(date).format("MMMM Do, YYYY");
};
