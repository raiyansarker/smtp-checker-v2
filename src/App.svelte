<script lang="ts">
  import Header from "./components/Header.svelte";
  import Notice from "./components/Notice.svelte";
  import Form from "./components/Form.svelte";
</script>

<Header />
<div class="w-11/12 sm:w-10/12 md:w-8/12 xl:w-6/12 my-8 sm:my-14 mx-auto">
  <div class="grid grid-cols-1 gap-y-10">
    <Notice />
    <Form />
  </div>
</div>

<style lang="postcss" global>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :global(body) {
    font-family: "Roboto", sans-serif;
    @apply bg-white overflow-x-hidden;
  }

  :global(*) {
    transition: all 200ms;
  }
</style>
