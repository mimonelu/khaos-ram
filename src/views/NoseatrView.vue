<script lang="ts" setup>
import { reactive } from "vue"
import Loader from "@/components/Loader.vue"
import Nostr from "@/composables/nostr"

const state = reactive<{
  content: string,
  pubkey: string,
  seckey: string,
  step: ConnectionState,
  progress: number,
  relayStateMap: null | RelayStateMap,
}>({
  content: "",
  pubkey: "",
  seckey: "",
  step: "",
  progress: 0,
  relayStateMap: null,
})

const relayStateMapLabel: { [state: string]: string } = {
  "connecting": "🔌",
  "connected": "🔥",
  "disconnected": "👍",
  "failed": "❌",
}

const benthosList = ["🐙", "🦀", "🐚", "🪨"]
const notBenthosList = ["🦑", "🐡", "🐠", "🐟", "🐬", "🦈"]

const irandom = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
const pick = (array: Array<any>): any =>
  array[Math.floor(Math.random() * array.length)]
const wait = (duration: number) =>
  new Promise((resolve: Function) => setTimeout(resolve, duration))

const generate = (): string => {
  const contents: any = []
  for (let y = 0; y < 3; y++) {
    contents[y] = []
    for (let x = 0; x < 10; x++) {
      contents[y][x] = irandom(0, 100) === 0
        ? "💩"
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
  if (state.step === "connecting") return
  state.step = "connecting"
  state.relayStateMap = null
  const result = await Nostr.send({
    pubkey: state.pubkey,
    seckey: state.seckey,
    content: generate(),
    onProgress (relayStateMap: RelayStateMap, progress: number) {
      state.progress = Math.round(progress * 100)
      state.relayStateMap = relayStateMap
    },
  })
  if (result === "disconnected") await wait(500)
  state.step = result
  state.progress = 0
}

state.content = generate()
</script>

<template>
  <main>
    <section>
      <h1>🐠<span>{{ $t("title") }}</span></h1>
      <pre>{{ state.content }}</pre>
      <p>{{ $t("description") }}</p>
      <p class="note">{{ $t("browserExtension") }}</p>
      <form @submit.prevent="send">
        <input
          v-model="state.pubkey"
          class="textbox"
          type="text"
          :disabled="state.step === 'connecting'"
          :placeholder="$t('publicKey')"
        />
        <input
          v-model="state.seckey"
          class="textbox"
          type="current-password"
          :disabled="state.step === 'connecting'"
          :placeholder="$t('secretKey')"
        />
        <button
          class="button"
          :disabled="state.step === 'connecting'"
        >{{ $t("send") }}</button>
        <Loader
          v-if="state.step === 'connecting'"
          :progress="state.progress"
        >{{ $t("sending") }}</Loader>
      </form>
      <p
        v-if="state.step === 'disconnected'"
        class="congrats"
      >{{ $t("successed") }}</p>
      <p
        v-else-if="state.step === 'failed'"
        class="error"
      >{{ $t("failed") }}</p>
      <table class="relays-states">
        <tr
          v-for="relayState, url in state.relayStateMap"
          :data-state="relayState.state"
        >
          <td class="state">{{ relayStateMapLabel[relayState.state] ?? "❓" }}</td>
          <td class="url">{{ url }}</td>
        </tr>
      </table>
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
  padding: 2rem 1rem 8rem;
  width: 24rem;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  grid-gap: 0.5rem;
  line-height: 1;
  & > span {
    font-size: 2rem;
  }
}

pre {
  background-color: blue;
  border-radius: 0.5rem;
  font-size: 1.75rem;
  line-height: 1;
  margin: 0;
  padding: 1rem;
  text-align: center;
  white-space: pre;
}

p {
  text-align: center;
  white-space: pre-wrap;
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

.error {
  color: rgb(var(--notice-color));
}

.congrats {
  color: rgb(var(--accent-color));
}

.relays-states {
  font-size: 0.75rem;
  &:empty {
    display: contents;
  }
  td {
    padding: 0.25rem 0.5rem;
    &:last-child {
      width: 100%;
      word-break: break-all;
    }
  }
  [data-state="3"] {
    color: rgb(var(--notice-color));
  }
}
</style>
