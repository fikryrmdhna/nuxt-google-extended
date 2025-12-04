export function useStatusHelper() {
  const { data, status } = useAuth()
  const isLoggedIn = computed(() => status.value === 'authenticated')
  const isSubscribed = computed(() => !!data.value?.nonvip_subscription)
  const isVip = computed(() => !!data.value?.vip_subscription)
  const subscriptionStatus = computed(() => {
    if (isVip.value) return 'vip'
    if (isSubscribed.value) return 'nonvip'
    return 'none'
  })

  return {
    isLoggedIn,
    isSubscribed,
    isVip,
    subscriptionStatus,
  }
}
