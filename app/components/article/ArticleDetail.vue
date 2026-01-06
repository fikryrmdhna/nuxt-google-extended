<script setup lang="ts">
import type { ArticleDetailResponse } from '../../types/article'

const {
  article,
} = defineProps<{
  article: ArticleDetailResponse | null
}>()

// const isMounted = ref(false)

const content = ref('')
if (article && article?.data && article?.data?.content) {
  content.value = article?.data?.content
}

const saveStatus = ref<boolean | null>(null)

const adScripts = ref()

watch(adScripts, (scripts: any) => {
  if (scripts && Array.isArray(scripts)) {
    useHead({ script: scripts })
  }
}, { immediate: true })

watch(() => saveStatus, (newSaveStatus: any) => {
  if (newSaveStatus !== undefined) {
    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
  }
})

function InitGaaMetering() {
  console.log('InitGaaMetering START')
  const userState = { granted: false }

  const handleRegisterUserPromise = new Promise((resolve) => {
    // GaaMetering.getGaaUserPromise().then((gaaUser) => {
    //   // TODO: Handle registration for the gaaUser and resolve the userState.
    //   // Example userState below is for a registered user with publisher metering access.
    //   const registeredUserState = {
    //     granted: false,
    //   }
    //   resolve(registeredUserState)
    // })
    resolve(userState)
  })

  const handlePublisherEntitlementPromise = new Promise((resolve) => {
    // TODO: Fetch userState from the server and resolve it.
    console.log('publisherEntitleMentPromise', userState)
    resolve(userState)
  })

  const handleRedirectLoginPromise = new Promise((resolve) => {
    GaaMetering.getLoginPromise().then(() => {
      // TODO: Handle login for the existing user and resolve the userState.
      // Example userState below is for a registered user with no publisher access.
      const loggedInUserState = {
        granted: false,
      }
      resolve(loggedInUserState)
    })
  })

  function handleSwgEntitlement(entitlement) {
    // TODO: Handle SwG entitlement if you implement SwG.
    console.log('handleSwgEntitlement', entitlement)
  }

  function handleShowPaywall() {
    // TODO: Implement showPaywall method.
    console.log('Show paywall')
  }

  function handleUnlockArticle() {
    // TODO: Implement unlockArticle method.
    console.log('Unlock article')
  }

  GaaMetering.init({
    googleApiClientId: '1075765094546-2rri7lpa3mgg5sbe995p0hmsd5i10mv5.apps.googleusercontent.com',
    userState,
    allowedReferrers: ['http://localhost:3000', 'https://tempo.co', 'https://dua.tempo.co', 'https://nuxt-google-extended.vercel.app', 'https://koran.tempo.co', 'https://subscribe.tempo.co', 'https://subscribe.staging.tempo.co'],
    handleLoginPromise: handleRedirectLoginPromise,
    registerUserPromise: handleRegisterUserPromise,
    publisherEntitlementPromise: handlePublisherEntitlementPromise,
    unlockArticle: handleUnlockArticle,
    showPaywall: handleShowPaywall,
    handleSwGEntitlement: handleSwgEntitlement,
    shouldInitializeSwG: true,
  })

  console.log('isGaa?', GaaMetering.isGaa())
}

const loadGaaScript = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    console.log('Assigning InitGaaMetering to window')
    window.InitGaaMetering = InitGaaMetering
    loadGaaScript.value = true
  }
})

useHead({
  script: computed(() => loadGaaScript.value
    ? [
        {
          src: 'https://news.google.com/swg/js/v1/swg-gaa.js',
          async: true,
          onload: () => {
            console.log('swg-gaa loaded callback triggered')
            InitGaaMetering()
          },
        },
      ]
    : []),
})
</script>

<template>
  <h1>Article Detail Component</h1>
</template>
