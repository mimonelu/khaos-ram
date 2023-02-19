import "@/assets/main.scss"

import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "@/App.vue"
import router from "@/router"
import i18n from "@/plugins/i18n"
import messages from "@/consts/messages.json"

const app = createApp(App as any)
app.use(createPinia())
app.use(router)
app.use(i18n, messages)
app.mount("#app")
