<script setup lang="ts">
import type { ArticleDetailResponse } from '../../types/article'

const {
  article,
} = defineProps<{
  article: ArticleDetailResponse | null
}>()

const isMounted = ref(false)

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

watchEffect(() => {
  console.log(isMounted.value, typeof GaaMetering !== 'undefined')
  if (isMounted.value && typeof GaaMetering !== 'undefined') {
    console.log('isMounted and GaaMetering is defined')
    if (GaaMetering.isGaa()) {
      console.log('running InitGaaMetering')
      InitGaaMetering()
    }
  }
})

function InitGaaMetering() {
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

  // const handleRedirectLoginPromise = new Promise((resolve) => {
  // GaaMetering.getLoginPromise().then(() => {
  //   // TODO: Handle login for the existing user and resolve the userState.
  //   // Example userState below is for a registered user with no publisher access.
  //   const loggedInUserState = {
  //     granted: false,
  //   }
  //   resolve(loggedInUserState)
  // })
  // })

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
    // handleLoginPromise: handleRedirectLoginPromise,
    registerUserPromise: handleRegisterUserPromise,
    publisherEntitlementPromise: handlePublisherEntitlementPromise,
    unlockArticle: handleUnlockArticle,
    showPaywall: handleShowPaywall,
    handleSwGEntitlement: handleSwgEntitlement,
    shouldInitializeSwG: false,
  })

  console.log('isGaa?', GaaMetering.isGaa(), GaaMetering.init())
}
</script>

<template>
  <h1>Article Detail Component</h1>
</template>
