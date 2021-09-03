<template>
  <section class="relative mt-6 group">
    <textarea
      v-model="currentCommand"
      v-show="isMounted"
      ref="textarea"
      class="
        relative
        z-10
        block
        w-full
        p-4
        font-mono
        text-transparent
        whitespace-pre
        bg-transparent
        outline-none
        resize-none
        rounded-xl
        h-96
      "
      :disabled="!isMounted"
      spellcheck="false"
      style="caret-color: white"
      @scroll="syncScroll"
    />

    <pre
      class="
        top-0
        left-0
        z-0
        w-full
        p-4
        overflow-auto
        font-mono
        text-gray-100
        bg-gray-800
        rounded-lg
        h-96
      "
      :class="{ 'relative z-20': !isMounted, absolute: isMounted }"
      ref="highlightContainer"
      aria-hidden="true"
    ><code class="language-bang" ref="highlightContent" v-html="highlightedHtml"></code></pre>
    <div
      v-if="isMounted"
      class="
        absolute
        top-0
        right-0
        z-20
        flex
        gap-2
        p-2
        mr-1
        transition
        rounded-lg
        opacity-0
        group-hover:opacity-100
        group-focus-within:opacity-100
      "
    >
      <button
        @click="run"
        title="Run"
        class="
          p-2
          text-gray-300
          transition
          bg-gray-700
          rounded-lg
          hover:bg-gray-600
          focus:bg-gray-600 focus:ring-2
          ring-gray-400
          focus:outline-none
        "
      >
        <span class="sr-only">Run</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button
        @click="copy"
        title="Copy"
        class="
          p-2
          text-gray-300
          transition
          bg-gray-700
          rounded-lg
          hover:bg-gray-600
          focus:bg-gray-600 focus:ring-2
          ring-gray-400
          focus:outline-none
        "
      >
        <span class="sr-only">Copy</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </button>
      <button
        @click="clear"
        title="Clear"
        class="
          p-2
          text-gray-300
          transition
          bg-gray-700
          rounded-lg
          hover:bg-gray-600
          focus:bg-gray-600 focus:ring-2
          ring-gray-400
          focus:outline-none
        "
      >
        <span class="sr-only">Clear</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="
        flex flex-col
        items-center
        justify-center
        gap-2
        p-4
        my-4
        font-sans
        text-center text-white
        rounded-lg
        bg-gradient-to-r
        from-red-600
        to-red-500
        sm:flex-row-reverse sm:gap-8 sm:justify-between sm:text-left
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 sm:h-10 sm:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div class="flex-shrink">
        <h3 class="text-2xl font-bold sm:inline-block">Error</h3>

        <p>{{ errorMessage.message }}</p>
        <p v-if="errorMessage.line" class="text-sm sm:inline-block">
          Line: {{ errorMessage.line }}
        </p>
      </div>
    </div>

    <div
      v-if="output"
      class="
        gap-4
        p-4
        my-4
        font-sans
        text-white
        rounded-lg
        bg-gradient-to-r
        from-orange-600
        to-orange-500
      "
    >
      <h3 class="mb-2 text-2xl font-bold sm:inline-block">Output</h3>

      <p v-for="line of output.split('\n')">{{ line }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { execute, Interpreter, BangError } from '@bang!/language'
import Prism from 'prismjs'
import { addBang } from '@bang!/prism'

const sampleCode = `from maths import { floor }

const isEven = (number) =>
  const dividedBy2 = number / 2
  return dividedBy2 == floor(dividedBy2)

let counter = 0
const evenNumbers = []

while (counter < 10)
  if (isEven(counter))
    evenNumbers.push(counter)
  else
    print(counter.toString() + ' is an odd number')
  counter += 1

print('The even numbers are: ' + evenNumbers.join(', '))`

export default {
  props: {
    code: {
      type: String,
      default: sampleCode,
    },
  },

  setup(props) {
    addBang(Prism)

    const isMounted = ref(false)
    const output = ref('')
    const errorMessage = ref<BangError>()
    const currentCommand = ref(props.code)
    const textarea = ref<HTMLTextAreaElement>()
    const highlightContainer = ref<HTMLElement>()
    const highlightContent = ref<HTMLPreElement>()
    const highlightedHtml = ref()

    onMounted(() => {
      isMounted.value = true
    })

    const run = async () => {
      try {
        const interpreter = new Interpreter({
          printFunction: (value: unknown) => {
            output.value += `\n${value}`
          },
        })
        try {
          output.value = ''
          await execute(currentCommand.value, interpreter)
          errorMessage.value = undefined
        } catch (error) {
          errorMessage.value = error
        }
      } catch (error) {
        console.log(error)
      }
    }

    const clear = () => {
      if (
        confirm(
          'Are you sure you want to clear all code? This action cannot be reversed'
        )
      ) {
        currentCommand.value = ''
        output.value = ''
        errorMessage.value = undefined
      }
    }

    const copy = () => {
      if (textarea.value) {
        textarea.value.select()
        document.execCommand('copy')
      }
    }

    const syncScroll = () => {
      if (highlightContainer.value && textarea.value) {
        highlightContainer.value.scrollTop = textarea.value.scrollTop
        highlightContainer.value.scrollLeft = textarea.value.scrollLeft
      }
    }

    highlightedHtml.value = Prism.highlight(
      currentCommand.value,
      Prism.languages.bang,
      'bang'
    )
    watchEffect(() => {
      highlightedHtml.value = Prism.highlight(
        currentCommand.value,
        Prism.languages.bang,
        'bang'
      )
    })

    return {
      isMounted,
      copy,
      syncScroll,
      clear,
      output,
      errorMessage,
      currentCommand,
      textarea,
      highlightContainer,
      highlightContent,
      highlightedHtml,
      run,
    }
  },
}
</script>

<style lang="postcss">
textarea::selection {
  @apply bg-gray-50 bg-opacity-20;
}

::-webkit-scrollbar-corner {
  display: none;
}
pre::-webkit-scrollbar {
  overflow: hidden;
}

textarea::-webkit-scrollbar {
  @apply w-2 h-2;
}
textarea::-webkit-scrollbar-thumb {
  @apply bg-gray-700 rounded-xl;
}
</style>
