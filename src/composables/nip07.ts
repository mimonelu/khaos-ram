export type NostrNip07 = {
  getPublicKey: () => Promise<string>;
  getRelays?: () => Promise<RelayMap>;
  signEvent: (event: NostrEvent) => Promise<NostrEvent>;
  nip04?: {
    decrypt: (pubkey: string, ciphertext: string) => string;
    encrypt: (pubkey: string, plaintext: string) => string;
  };
}

declare const window: {
  nostr?: NostrNip07;
}

export default {
  async getPublicKey (): Promise<null | string> {
    try {
      return await window.nostr?.getPublicKey() ?? ""
    } catch (error) {
      return null
    }
  },

  async getRelays (): Promise<null | RelayMap> {
    try {
      if (window.nostr?.getRelays) {
        return await window.nostr.getRelays() ?? {}
      }
      return {}
    } catch (error) {
      return null
    }
  },

  async getSig (event: NostrEvent): Promise<null | string> {
    try {
      const newEvent: null | NostrEvent = await window.nostr?.signEvent(event) ?? null
      return newEvent?.sig ?? null
    } catch (error) {
      return null
    }
  },
}
