<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { contextKey } from "./lib/context.js";

  export let continueText;
  export let cancelText;

  const dispatch = createEventDispatcher();

  const { config, component, isDateChosen } = getContext(contextKey);

  function finalise() {
    isDateChosen.set(true);
    dispatch("close");
  }

  function progress() {
    isDateChosen.set(false);
    if ($component === "date-view") {
      if (config.isTimePicker) {
        component.set("time-view");
      } else {
        finalise();
      }
    } else if ($component === "time-view") {
      finalise();
    }
  }
</script>

<div class="toolbar gap-2">
  <button
    type="button"
    class="text-center py-3 px-6 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all text-sm font-semibold bg-primary border-primary text-primary-fg"
    on:click|preventDefault={progress}
  >
    {continueText}
  </button>
  <button
    type="button"
    class="text-center py-3 px-6 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all text-sm font-semibold bg-accent border-accent text-accent-fg"
    on:click|preventDefault={() => {
      dispatch("close");
    }}
  >
    {cancelText}
  </button>
</div>

<style>
  .toolbar {
    padding: 0;
    display: flex;
    flex: 1 0 auto;
    justify-content: center;
  }

  @media (min-width: 600px) {
    .toolbar {
      border-top: 1px solid var(--toolbar-border-color);
      padding: 6px;
      justify-content: flex-end;
    }
  }
</style>
