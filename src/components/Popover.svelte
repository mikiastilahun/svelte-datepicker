<script>
  import { onMount, createEventDispatcher, getContext, tick } from "svelte";
  import { contextKey } from "./lib/context.js";
  import { getPosition } from "./lib/positioning.js";
  import { once } from "./lib/event-handling.js";
  import { clickOutside } from "./actions/click-outside.js";

  const { isOpen, isClosing, config, resetView } = getContext(contextKey);
  const dispatch = createEventDispatcher();

  let popover;
  let w;
  let triggerContainer;
  let contentsAnimated;
  let contentsWrapper;
  let isFullscreen = false;
  let translateY = 0;
  let translateX = 0;

  export let trigger;

  export function close() {
    isClosing.set(true);
    once(contentsAnimated, "animationend", () => {
      isClosing.set(false);
      isOpen.set(false);
      dispatch("closed");
    });
  }

  function checkForFocusLoss(evt) {
    if (!$isOpen) return;
    let el = evt.target;
    do {
      if (el === popover) {
        return;
      }
      el = el.parentNode;
    } while (el);
    close();
  }

  onMount(() => {
    config.closeOnFocusLoss &&
      document.addEventListener("click", checkForFocusLoss);
    if (!trigger) {
      return;
    }
    triggerContainer.appendChild(trigger.parentNode.removeChild(trigger));

    return () => {
      config.closeOnFocusLoss &&
        document.removeEventListener("click", checkForFocusLoss);
    };
  });

  const doOpen = async (e) => {
    isOpen.set(true);
    resetView();

    await tick();
    const { top, left, fullscreen } = getPosition(window, e, config);
    isFullscreen = fullscreen;

    translateY = top;
    translateX = left;

    dispatch("opened");
  };
</script>

<svelte:window bind:innerWidth={w} />
<div class="sc-popover" bind:this={popover}>
  <div class="trigger" on:click={doOpen} bind:this={triggerContainer}>
    <slot name="trigger" />
  </div>
  <div
    class="contents-wrapper"
    class:visible={$isOpen}
    class:shrink={$isClosing}
    class:is-fullscreen={isFullscreen}
    bind:this={contentsWrapper}
  >
    <div
      class="wrapper"
      bind:this={contentsAnimated}
      use:clickOutside={() => isOpen.set(false)}
    >
      <div class="contents-inner">
        <div class="flex justify-end p-4">
          <button
            class="border rounded-full h-8 w-8 text-lg"
            on:click={() => {
              close();
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5 inline-block"
              ><line x1="18" y1="6" x2="6" y2="18" /><line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              /></svg
            >
          </button>
        </div>

        <slot name="contents" />
      </div>
    </div>
  </div>
</div>

<style>
  .sc-popover {
    position: relative;
  }

  .contents-wrapper {
    padding: 16px;
    position: fixed;
    transition: none;
    justify-content: center;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    transform: translate3d(0, 0, 0);
    z-index: 2;
    inset: 0;
    display: none;
  }

  .contents-wrapper.visible {
    display: flex;
  }

  .contents-wrapper.visible.is-fullscreen {
    display: flex;
    width: 100vw;
    height: 100%;
    padding-bottom: 80px;
    overflow: scroll;
  }

  .contents-wrapper.visible .wrapper {
    opacity: 1;
    transform: scale(1);
    display: block;
  }

  .contents-wrapper.shrink .wrapper {
    animation: shrink 150ms forwards cubic-bezier(0.92, 0.09, 0.18, 1.05);
  }

  .wrapper {
    background: #fff;
    box-shadow: 0px 10px 26px rgba(0, 0, 0, 0.4);
    opacity: 0.8;
    padding-top: 0;
    display: none;
    animation: grow 200ms forwards cubic-bezier(0.92, 0.09, 0.18, 1.05);
  }

  .contents-inner {
    animation: fadeIn 400ms forwards;
  }

  @keyframes grow {
    0% {
      transform: scale(0.9, 0.1);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(0.9, 0.1);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
