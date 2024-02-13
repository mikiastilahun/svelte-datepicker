<script>
  import dayjs from "dayjs";
  import { getContext } from "svelte";

  import quarterOfYear from "dayjs/plugin/quarterOfYear";
  import updateLocale from "dayjs/plugin/updateLocale";

  dayjs.extend(quarterOfYear);

  dayjs.extend(updateLocale);

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let weekStart = 0;
  export let startContextKey;
  export let endContextKey;

  let end = getContext(endContextKey);
  let start = getContext(startContextKey);

  console.log({
    end,
    start,
  });

  dayjs.updateLocale("en", {
    weekStart: weekStart,
  });

  let filters = {
    today: {
      start: dayjs(),
      end: dayjs(),
    },
    yesterday: {
      start: dayjs().subtract(1, "day"),
      end: dayjs().subtract(1, "day"),
    },

    "this week": {
      start: dayjs().startOf("week"),
      end: dayjs(),
    },
    "last week": {
      start: dayjs().startOf("week").subtract(1, "week"),
      end: dayjs().endOf("week").subtract(1, "week"),
    },
    "this month": {
      start: dayjs().startOf("month"),
      end: dayjs(),
    },
    "last month": {
      start: dayjs().startOf("month").subtract(1, "month"),
      end: dayjs().endOf("month").subtract(1, "month").endOf("month"),
    },
    "this quarter": {
      start: dayjs().startOf("quarter"),
      end: dayjs(),
    },
    "last quarter": {
      start: dayjs().startOf("quarter").subtract(1, "quarter"),
      end: dayjs().endOf("quarter").subtract(1, "quarter"),
    },
    "this year": {
      start: dayjs().startOf("year"),
      end: dayjs(),
    },
    "last year": {
      start: dayjs().startOf("year").subtract(1, "year"),
      end: dayjs().endOf("year").subtract(1, "year"),
    },
  };
</script>

<div class="grid grid-cols-2 gap-2">
  {#each Object.keys(filters) as filter}
    <button
      class="text-center py-3 px-6 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all text-sm font-semibold"
      on:click={() => {
        if (
          dayjs(filters[filter].start).get("M") ===
          dayjs(filters[filter].end).get("M")
        ) {
          end.displayedDate.update((v) =>
            v.month(dayjs(filters[filter].start).get("M"))
          );
        } else {
          console.log({
            start: dayjs(filters[filter].start).year(),
            end: dayjs(filters[filter].end).year(),
          });
          start.displayedDate.update((v) =>
            v.year(dayjs(filters[filter].start).year())
          );

          end.displayedDate.update((v) =>
            v.year(dayjs(filters[filter].end).year())
          );
          start.displayedDate.update((v) =>
            v.month(dayjs(filters[filter].start).get("M"))
          );

          end.displayedDate.update((v) =>
            v.month(dayjs(filters[filter].end).get("M"))
          );
        }

        dispatch("commonFilterSelected", {
          start: dayjs(filters[filter].start).format(),
          end: dayjs(filters[filter].end).format(),
        });
      }}
    >
      <span class="capitalize">{filter}</span>
    </button>
  {/each}
</div>
