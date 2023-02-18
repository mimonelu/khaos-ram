import { getEventHash, relayInit, signEvent } from "nostr-tools"

const defaultRelays = {
  "wss://relay.damus.io": { read: true, write: true },
  "wss://eden.nostr.land": { read: true, write: true },
  "wss://relay.snort.social": { read: true, write: true },
  "wss://nos.lol": { read: true, write: true },
  "wss://relay.current.fyi": { read: true, write: true },
  "wss://relay.nostr.wirednet.jp": { read: true, write: true },
  "wss://relay-jp.nostr.wirednet.jp": { read: true, write: true },
  "wss://nostr.h3z.jp": { read: true, write: true },
  "wss://nostr-relay.nokotaro.com": { read: true, write: true },
}

const sendToNostr = async ({ pubkey, seckey, content, window, onProgress }) => {
  if (pubkey === "") {
    try {
      pubkey = await window.nostr?.getPublicKey() ?? ""
    } catch (error) {
      return "canceled"
    }
    if (pubkey === "") {
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
    try {
      event.sig = await window.nostr?.signEvent(event) ?? ""
    } catch (error) {
      return "canceled"
    }
    if (event.sig === "") {
      return "failed"
    }
  } else {
    try {
      event.sig = signEvent(event, seckey)
    } catch (error) {
      return "failed"
    }
  }

  let relays = defaultRelays
  try {
    relays = await window.nostr?.getRelays() ?? {}
    if (Object.keys(relays).length === 0) {
      relays = defaultRelays
    }
  } catch (error) {}

  let done = 1
  try {
    const tasks = Object.keys(relays)
      .filter(url => relays[url].write)
      .map(async url => {
        const relay = relayInit(url)
        await relay.connect()
        // relay.publish(event)
        await relay.close()
        if (onProgress) onProgress(done++ / tasks.length)
      })
    await Promise.allSettled(tasks)
  } catch (error) {
    console.error(error)
    return "failed"
  }

  return "successed"
}

export {
  sendToNostr,
}
