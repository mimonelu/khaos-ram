import { getEventHash, relayInit, signEvent } from "nostr-tools"
import nip07 from "@/composables/nip07"

const defaultRelays: RelayMap = {
  "wss://eden.nostr.land": { read: true, write: true },
  "wss://nos.lol": { read: true, write: true },
  "wss://nostr.h3z.jp": { read: true, write: true },
  "wss://nostr-relay.nokotaro.com": { read: true, write: true },
  "wss://relay.current.fyi": { read: true, write: true },
  "wss://relay.damus.io": { read: true, write: true },
  "wss://relay.nostr.wirednet.jp": { read: true, write: true },
  "wss://relay.snort.social": { read: true, write: true },
  "wss://relay-jp.nostr.wirednet.jp": { read: true, write: true },
}

const send = async ({
  pubkey,
  seckey,
  content,
  onProgress
}: {
  pubkey: null | string,
  seckey: null | string,
  content: string,
  onProgress: (relayStateMap: RelayStateMap, progress: number) => void
}): Promise<ConnectionState> => {
  if (pubkey === "") {
    pubkey = await nip07.getPublicKey()
    if (pubkey === null) {
      return "canceled"
    } else if (pubkey === "") {
      return "failed"
    }
  }

  const event: NostrEvent = {
    id: "",
    sig: "",
    kind: 1,
    pubkey: pubkey as string,
    created_at: Math.round(Date.now() / 1000),
    tags: [],
    content,
  }

  try {
    event.id = getEventHash(event)
  } catch (error) {
    return "failed"
  }

  if (seckey === "") {
    event.sig = await nip07.getSig(event) as string
    if (event.sig === null) {
      return "canceled"
    } else if (event.sig === "") {
      return "failed"
    }
  } else {
    try {
      event.sig = signEvent(event, seckey as string)
    } catch (error) {
      return "failed"
    }
  }

  let relays: RelayMap = (await nip07.getRelays()) ?? {}
  if (Object.keys(relays).length === 0) {
    relays = defaultRelays
  }

  const relayStateMap: RelayStateMap = {}
  Object.keys(relays)
    .filter((url: string) => relays[url].write)
    .forEach((url: string) => relayStateMap[url] = { state: "" })

  let done = 1
  const tasks = Object.keys(relayStateMap).map(async url => {
    const relayState = relayStateMap[url]
    relayState.state = "connecting"
    try {
      const relay = relayInit(url)
      relay.on("connect", () => {
        relayState.state = "connected"
      })
      relay.on("disconnect", () => {
        relayState.state = "disconnected"
        relay.close()
      })
      relay.on("error", () => {
        relayState.state = "failed"
        relay.close()
      })
      relay.on("notice", () => {
        relayState.state = "failed"
        relay.close()
      })
      await relay.connect()
      const pub = relay.publish(event)
      pub.on("ok", () => {
        relayState.state = "disconnected"
        relay.close()
      })
      pub.on("failed", (reason: string) => {
        relayState.state = "failed"
        relay.close()
        console.error(reason)
      })
      // await relay.close()
      // relayState.state = "disconnected"
    } catch (error) {
      relayState.state = "failed"
    }
    if (onProgress) onProgress(relayStateMap, done++ / Object.keys(relayStateMap).length)
  })
  await Promise.allSettled(tasks)

  return "disconnected"
}

export default {
  send,
}
