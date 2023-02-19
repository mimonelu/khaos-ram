export default {
  install (app, messages) {
    app.config.globalProperties.$t = key => {
      const language = window.navigator.language
      const message = messages[language] ?? messages.en
      return message[key] ?? messages.en[key] ?? ""
    }
  }
}
