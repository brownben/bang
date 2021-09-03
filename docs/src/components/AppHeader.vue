<template>
  <header
    class="
      flex flex-col
      items-center
      justify-center
      w-full
      gap-12
      px-6
      py-10
      text-center
      bg-gradient-to-br
      from-orange-500
      to-orange-400
      sm:gap-14
    "
  >
    <img src="/Logo.svg" class="h-60" />
    <h1 class="sr-only">Bang</h1>

    <div class="flex flex-wrap space-y-4 text-center sm:space-y-0 sm:space-x-4">
      <a
        href="https://github.com/brownben/bang"
        class="
          flex-none
          w-full
          px-6
          py-3
          text-lg
          font-semibold
          leading-6
          text-white
          transition-colors
          duration-200
          bg-orange-500
          border border-transparent
          sm:w-auto
          hover:bg-orange-600
          rounded-xl
          focus:ring-4 focus:ring-orange-300 focus:outline-none
        "
      >
        Checkout the Code
      </a>

      <button
        type="button"
        class="
          flex
          items-center
          justify-center
          flex-none
          w-full
          gap-4
          px-2
          py-3
          font-mono
          leading-6
          text-orange-600
          transition-colors
          duration-200
          sm:w-auto
          bg-orange-50
          hover:text-orange-800
          sm:px-6
          rounded-xl
          focus:ring-4 focus:ring-orange-300 focus:outline-none
        "
        @click="copy"
      >
        <span class="text-gray-800"> npm i @bang!/cli </span>
        <span v-cloak class="sr-only">(click to copy to clipboard)</span>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          v-cloak
        >
          <path
            d="M8 16c0 1.886 0 2.828.586 3.414C9.172 20 10.114 20 12 20h4c1.886 0 2.828 0 3.414-.586C20 18.828 20 17.886 20 16v-4c0-1.886 0-2.828-.586-3.414C18.828 8 17.886 8 16 8m-8 8h4c1.886 0 2.828 0 3.414-.586C16 14.828 16 13.886 16 12V8m-8 8c-1.886 0-2.828 0-3.414-.586C4 14.828 4 13.886 4 12V8c0-1.886 0-2.828.586-3.414C5.172 4 6.114 4 8 4h4c1.886 0 2.828 0 3.414.586C16 5.172 16 6.114 16 8"
          />
        </svg>
      </button>
    </div>
  </header>
</template>
<script lang="ts">
export default {
  setup() {
    return {
      copy: () => navigator.clipboard.writeText('npm i @bang!/cli'),
    }
  },
}
</script>
