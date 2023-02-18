<script setup>
import { reactive } from "vue"
import Loader from "@/components/Loader.vue"
import { sendToNostr } from "@/composables/nostr"
import { irandom, pick, wait } from "@/composables/util"

const benthosList = [ "🐙", "🦀", "🐚", "🪨" ]
const notBenthosList = ["🦑", "🐡", "🐠", "🐟", "🐬", "🦈" ]

const generate = () => {
  const contents = []
  for (let y = 0; y < 3; y++) {
    contents[y] = []
    for (let x = 0; x < 10; x++) {
      contents[y][x] = irandom(0, 100) === 0
        ? "💩"
        : irandom(0, 1) === 1
          ? " "
          : irandom(0, 1) === 1
            ? "🫧"
            : pick(notBenthosList)
    }
    contents[y] = contents[y].join("")
  }
  contents[3] = []
  for (let x = 0; x < 10; x++) {
    contents[3][x] = irandom(0, 1) === 1
      ? "🪸"
      : pick(benthosList)
  }
  contents[3] = contents[3].join("")
  return contents.join("\n")
}

const send = async () => {
  if (state.step === "sending") return
  state.step = "sending"
  const result = await sendToNostr({
    pubkey: state.pubkey,
    seckey: state.seckey,
    content: generate(),
    window,
    onProgress (progress) {
      state.progress = Math.round(progress * 100)
    },
  })
  if (result === "successed") await wait(500)
  state.step = result
  state.progress = 0
}

const state = reactive({
  content: generate(),
  pubkey: "",
  seckey: "",
  step: "",
  progress: 0,
})
</script>

<template>
  <main>
    <section>
      <h1>🐟</h1>
      <pre>{{ state.content }}</pre>
      <p>Release sea creatures into Nostr.</p>
      <p class="note">Support for browser extensions.</p>
      <form @submit.prevent="send">
        <input
          v-model="state.pubkey"
          type="text"
          autocomplete="off"
          :disabled="state.step === 'sending'"
          placeholder="Public key"
        >
        <input
          v-model="state.seckey"
          type="password"
          autocomplete="off"
          :disabled="state.step === 'sending'"
          placeholder="Secret key"
        >
        <div
          v-if="state.step === 'failed'"
          class="error"
        >Failed. Something is wrong...</div>
        <div
          v-else-if="state.step === 'successed'"
          class="congrats"
        >Successed!</div>
        <button :disabled="state.step === 'sending'">Send</button>
        <Loader
          v-if="state.step === 'sending'"
          :progress="state.progress"
        >Sending...</Loader>
      </form>
      <p class="note">&copy; 2023 mimonelu</p>
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-gap: 1rem;
  padding: 2rem;
}

h1 {
  font-size: 4rem;
  line-height: 1;
  text-align: center;
}

pre {
  background-color: blue;
  border-radius: 0.5rem;
  font-size: 1.75rem;
  line-height: 1;
  margin: 0;
  padding: 1rem;
  white-space: pre;
}

p {
  text-align: center;
}

.note {
  font-size: 0.75rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-gap: 1rem;
  position: relative;
}

input[type="password"],
input[type="text"] {
  border: 1px solid rgb(var(--access-color));
  border-radius: 0.5rem;
  line-height: 1.375;
  padding: 0.5rem 1rem;
  width: 100%;
  user-select: unset;
  &::placeholder {
    color: rgba(var(--access-color), 0.75);
  }
  &:focus {
    box-shadow: 0 0 0 1px rgb(var(--bg-color)), 0 0 0 4px rgb(var(--accent-color));
  }
}

.error {
  color: rgb(var(--notice-color));
}

.congrats {
  color: rgb(var(--accent-color));
}

button {
  background-color: rgb(var(--access-color));
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: rgb(var(--fg-color));
  cursor: pointer;
  font-weight: bold;
  line-height: 1.375;
  padding: 0.5rem 2rem;
  &:focus {
    box-shadow: 0 0 0 1px rgb(var(--bg-color)), 0 0 0 4px rgb(var(--accent-color));
  }
}
</style>
