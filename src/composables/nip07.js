export default {
  async getPublicKey () {
    try {
      return await window.nostr?.getPublicKey() ?? ""
    } catch (error) {
      return null
    }
  },

  async getSig (event) {
    try {
      return await window.nostr?.signEvent(event) ?? ""
    } catch (error) {
      return null
    }
  },

  async getRelays () {
    try {
      return await window.nostr?.getRelays() ?? {}
    } catch (error) {
      return null
    }
  },
}
