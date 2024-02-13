import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import minMax from "dayjs/plugin/minMax";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { weekStartStore } from "./week-start";

dayjs.extend(localeData);
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(updateLocale);

weekStartStore.subscribe((value) => {
  dayjs.updateLocale("en", {
    weekStart: value,
  });
});

export { dayjs };
