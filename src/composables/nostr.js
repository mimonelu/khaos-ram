import { getEventHash, relayInit, signEvent } from "nostr-tools"
import nip07 from "@/composables/nip07"

const defaultRelays = {
  "wss://eden.nostr.land": { read: true, write: true },
  "wss://nos.lol": { read: true, write: true },
  "wss://nostr.h3z.jp": { read: true, write: true },
  "wss://nostr-relay.nokotaro.com": { read: true, write: true },
  "wss://relay.current.fyi": { read: true, write: true },
  "wss://relay.damus.io": { read: true, write: true },
  "wss://relay.nostr.wirednet.jp": { read: true, write: true },
  "wss://relay.s-nort.social": { read: true, write: true },
  "wss://relay-jp.nostr.wirednet.jp": { read: true, write: true },
}

const sendToNostr = async ({ pubkey, seckey, content, onProgress }) => {
  if (pubkey === "") {
    pubkey = await nip07.getPublicKey()
    if (pubkey === null) {
      return "canceled"
    } else if (pubkey === "") {
      return "failed"
    }
  }

  const event = {
    kind: 1,
    pubkey,
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
    event.sig = await nip07.getSig(event)
    if (event.sig === null) {
      return "canceled"
    } else if (event.sig === "") {
      return "failed"
    }
  } else {
    try {
      event.sig = signEvent(event, seckey)
    } catch (error) {
      return "failed"
    }
  }

  let relays = (await nip07.getRelays()) ?? {}
  if (Object.keys(relays).length === 0) {
    relays = defaultRelays
  }

  const relayStates = Object.keys(relays)
    .filter(url => relays[url].write)
    .map(url => ({ url, result: 0 }))

  let done = 1
  const tasks = relayStates.map(async relayState => {
    relayState.state = 1
    try {
      const relay = relayInit(relayState.url)
      await relay.connect()
      // relay.publish(event)
      await relay.close()
      relayState.state = 2
    } catch (error) {
      relayState.state = 3
    }
    if (onProgress) onProgress(relayStates, done++ / relayStates.length)
  })
  await Promise.allSettled(tasks)

  return "successed"
}

export {
  sendToNostr,
}
