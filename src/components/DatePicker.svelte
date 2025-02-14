<script>
  import Popover from "./Popover.svelte";
  import { dayjs } from "./lib/date-utils";
  import { contextKey, setup } from "./lib/context";
  import { createEventDispatcher, setContext, getContext } from "svelte";
  import { CalendarStyle } from "../calendar-style.js";
  import { createViewContext } from "./lib/view-context.js";
  import Toolbar from "./Toolbar.svelte";
  import View from "./view/View.svelte";
  import CommonlyUsedFitlers from "./view/CommonlyUsedFitlers.svelte";
  import { weekStartStore } from "./lib/week-start";

  export let range = false;
  export let defaultRange = [1, "month"];
  export let placeholder = "Choose Date";
  export let format = "DD / MM / YYYY";
  export let start = dayjs().subtract(1, "year");
  export let end = dayjs().add(1, "year");
  export let trigger = null;
  export let selectableCallback = null;
  export let styling = new CalendarStyle();
  export let selected;
  export let closeOnFocusLoss = true;
  export let time = false;
  export let morning = 7;
  export let night = 19;
  export let minuteStep = 5;
  export let continueText = "Continue";
  export let cancelText = "Cancel";
  export let weekStart = 0;

  weekStartStore.set(weekStart);

  const dispatch = createEventDispatcher();

  const startContextKey = {};
  const endContextKey = {};

  const config = {
    start: dayjs(start),
    end: dayjs(end),
    isRangePicker: range,
    defaultRange,
    isTimePicker: time,
    closeOnFocusLoss,
    format,
    morning,
    night,
    selectableCallback,
    minuteStep: parseInt(minuteStep),
  };

  setContext(contextKey, setup(selected, config));
  setContext("weekStart", weekStart);
  const {
    selectedStartDate,
    selectedEndDate,
    isOpen,
    isClosing,
    highlighted,
    formatter,
    isDateChosen,
    isSelectingFirstDate,
  } = getContext(contextKey);

  setContext(startContextKey, createViewContext(true, getContext(contextKey)));

  if (config.isRangePicker) {
    setContext(endContextKey, createViewContext(false, getContext(contextKey)));
  }

  let popover;

  function initialisePicker() {
    highlighted.set($selectedStartDate);
    dispatch("open");
  }

  function setRangeValue() {
    selected = [$selectedStartDate, $selectedEndDate];
    dispatch("range-selected", {
      from: $selectedStartDate.toDate(),
      to: $selectedEndDate.toDate(),
    });
  }

  function setDateValue() {
    selected = $selectedStartDate.toDate();
    dispatch("date-selected", {
      date: $selectedStartDate.toDate(),
    });
  }

  function swapDatesIfRequired() {
    if (!config.isRangePicker) {
      return;
    }
    const from = $selectedStartDate;
    const to = $selectedEndDate;
    if (to.isBefore(from)) {
      selectedStartDate.set(to);
      selectedEndDate.set(from);
    }
  }

  function addDate(e) {
    const { date } = e.detail;
    if ($isSelectingFirstDate) {
      selectedStartDate.set(date);
    } else {
      selectedEndDate.set(date);
    }
    swapDatesIfRequired();
    config.isRangePicker && isSelectingFirstDate.update((v) => !v);
  }

  function close() {
    swapDatesIfRequired();
    popover.close();
  }

  $: {
    if ($isDateChosen) {
      config.isRangePicker ? setRangeValue() : setDateValue();
      dispatch("change");
    }
  }
</script>

<div
  class="datepicker"
  class:open={$isOpen}
  class:closing={$isClosing}
  style={styling.toWrapperStyle()}
>
  <Popover
    {trigger}
    bind:this={popover}
    on:opened={initialisePicker}
    on:closed={() => dispatch("close")}
  >
    <div slot="trigger">
      <slot formatted={$formatter}>
        {#if !trigger}
          <button class="calendar-button" type="button">
            {#if $isDateChosen}
              {$formatter.formattedCombined}
            {:else}
              {placeholder}
            {/if}
          </button>
        {/if}
      </slot>
    </div>
    <div
      class="contents"
      slot="contents"
      class:is-range-picker={config.isRangePicker}
    >
      <div class="view">
        <View
          viewContextKey={startContextKey}
          on:chosen={addDate}
          {weekStart}
        />
        {#if config.isRangePicker}
          <View
            viewContextKey={endContextKey}
            on:chosen={addDate}
            {weekStart}
          />
        {/if}
      </div>
      <div class="commonlyUsedFilter">
        <CommonlyUsedFitlers
          {startContextKey}
          {endContextKey}
          {weekStart}
          on:commonFilterSelected={(e) => {
            selectedStartDate.set(dayjs(e.detail.start));
            selectedEndDate.set(dayjs(e.detail.end));

            swapDatesIfRequired();
            config.isRangePicker && isSelectingFirstDate.update((v) => !v);
          }}
        />
      </div>
      <Toolbar {continueText} {cancelText} on:close={close} />
    </div>
  </Popover>
</div>

<style>
  .datepicker {
    display: inline-block;
    text-align: center;
    overflow: visible;
    width: var(--datepicker-width);
  }

  .calendar-button {
    padding: 10px 20px;
    border: 1px solid var(--button-border-color);
    display: block;
    text-align: center;
    width: var(--button-width);
    text-decoration: none;
    cursor: pointer;
    background: var(--button-background-color);
    color: var(--button-text-color);
    border-radius: 7px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .contents {
    min-width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--content-background);
  }

  .view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .commonlyUsedFilter {
    max-height: 500px;
    overflow-y: scroll;
  }
  @media (min-width: 680px) {
    .view {
      flex-direction: row;
      justify-content: center;
    }
  }
</style>
