<script setup lang="ts">
import { onMounted, ref } from 'vue'
// @ts-expect-error // typewriter-effect lacks official type definitions, and the module may not be installed
import Typewriter from 'typewriter-effect/dist/core'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '',
  },
  elementTag: {
    type: String,
    default: 'h1',
  },
  className: {
    type: String,
    default: 'text-2xl font-bold',
  },
  strings: {
    type: Array as () => string[],
    default: () => [],
  },
  cursor: {
    type: String,
    default: '|',
  },
  delay: {
    type: [Number, String],
    default: '150',
  },
  deleteSpeed: {
    type: [Number, String],
    default: 'natural',
  },
  preventDelete: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
  pauseFor: {
    type: Number,
    default: 1500,
  },
  devMode: {
    type: Boolean,
    default: false,
  },
  skipAddStyles: {
    type: Boolean,
    default: false,
  },
  wrapperClassName: {
    type: String,
    default: 'Typewriter__wrapper',
  },
  cursorClassName: {
    type: String,
    default: 'Typewriter__cursor',
  },
  stringSplitter: {
    type: Function,
    default: (str: string) => str.split(''),
  },
  onCreateTextNode: {
    type: Function,
    default: null,
  },
  onRemoveNode: {
    type: Function,
    default: null,
  },
})

const typewriterRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (typewriterRef.value) {
    const shouldLoop = props.loop !== undefined ? props.loop : props.strings.length > 1;
    const stringsToUse = props.strings.length > 0 ? props.strings : (props.text ? [props.text] : []);

    if (stringsToUse.length === 0) {
      console.warn("TypewriterHeader: No text or strings provided.")
      return;
    }

    const currentDeleteSpeed = props.preventDelete ? Infinity : props.deleteSpeed;

    const typewriter = new Typewriter(typewriterRef.value, {
      strings: stringsToUse,
      cursor: props.cursor,
      delay: props.delay,
      deleteSpeed: currentDeleteSpeed,
      loop: shouldLoop,
      autoStart: props.autoStart,
      pauseFor: props.pauseFor,
      devMode: props.devMode,
      skipAddStyles: props.skipAddStyles,
      wrapperClassName: props.wrapperClassName,
      cursorClassName: props.cursorClassName,
      stringSplitter: props.stringSplitter,
      onCreateTextNode: props.onCreateTextNode,
      onRemoveNode: props.onRemoveNode,
    })
    typewriter.start()
  }
})
</script>

<template>
  <component :is="props.elementTag" ref="typewriterRef" :class="props.className" />
</template>

<style>
.Typewriter__cursor {
  /* Adjust the animation-duration to control the blinking speed.
     A higher value means a slower blink.
     The !important flag can help ensure this rule overrides the library's default. */
  animation-duration: 2.0s !important;
}
</style> 