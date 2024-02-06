<script>
  import { contextKey } from "../lib/context";
  import { getContext } from "svelte";
  import DateView from "./date-view/DateView.svelte";
  import TimeView from "./time-view/TimeView.svelte";

  export let viewContextKey;

  const { config, component } = getContext(contextKey);
  const { isDaytime } = getContext(viewContextKey);

  export let weekStart = 0;
</script>

<div
  class="calendar"
  class:is-range-picker={config.isRangePicker}
  class:day={$isDaytime}
  class:night={!$isDaytime}
>
  <svelte:component
    this={$component === "date-view" ? DateView : TimeView}
    {viewContextKey}
    on:chosen
    {weekStart}
  />
</div>

<style>
  .calendar {
    box-sizing: border-box;
    position: relative;
    user-select: none;
    width: 100%;
    padding-top: 0;
    width: 340px;
    height: 345px;
  }

  /* @media (min-width: 600px) {
    .calendar {
      display: inline-block;
    }
  } */
</style>
