// stores/articleStore.ts
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articleUuid: null as string | null,
  }),
  actions: {
    setArticleUuid(uuid: string | null) {
      this.articleUuid = uuid
    },
  },
  getters: {
    getArticleUuid: state => state.articleUuid,
  },
})
