<script lang="ts">
  import { onMount } from "svelte";
  import { StatusEnum } from "../types";
  import { fly } from "svelte/transition";
  import { sineIn, sineOut } from "svelte/easing";

  export let message: string;
  export let status: StatusEnum;
  export let visible = false;

  onMount(() => {
    const timeout = setTimeout(() => {
      visible = false;
    }, 5000);

    return () => clearTimeout(timeout);
  });
</script>

<div class="fixed z-10 bottom-0 inset-x-0 my-4">
  <div
    in:fly={{
      y: 100,
      easing: sineIn,
      duration: 200,
    }}
    out:fly={{
      y: 100,
      easing: sineOut,
      duration: 150,
    }}
    on:dblclick={() => (visible = false)}
    class="rounded-lg mx-3 md:w-1/3 lg:w-72 text-black px-3 py-4 bg-blueGray-50 shadow-lg border-[1px] border-gray-200"
  >
    <div class="flex justify-between items-center">
      <div class="flex space-x-2 items-center">
        {#if status === StatusEnum.SUCCESS}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        {/if}
        <h1 class="text-base text-gray-600 font-semibold select-none">
          {message}
        </h1>
      </div>
      <svg
        on:click={() => (visible = false)}
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-500 cursor-pointer"
        tabindex="0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>
  </div>
</div>
