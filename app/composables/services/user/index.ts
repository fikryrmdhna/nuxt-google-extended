import type { IAuthMailTypesResponse, IChangePasswordRequest, ICheckVoucherRequest, ICheckVoucherResponse, IGetSubscriptionResponse, IGetTransactionResponse, IGetUserResponse, IRedeemVoucherRequest, IUpdateUserRequest } from './type'

export async function useListNotifications(): Promise<IAuthMailTypesResponse> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''

  const headers = new Headers()
  headers.append('Authorization', token)
  const ssoURL = nuxtApp.$config.public.ssoURL

  const response = await fetch(
    `${ssoURL}/api/v2/mail-settings/list-notifications`,
    {
      headers,
    },
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || response.statusText)
  }
  return response.json()
}

export async function useUpdateNotifications(mailType: number, isSubscribed: boolean): Promise<void> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''

  const headers = new Headers()
  headers.append('Authorization', token)
  const ssoURL = nuxtApp.$config.public.ssoURL

  await fetch(
    `${ssoURL}/api/v2/mail-settings/update-notifications`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mail_type: mailType,
        is_subscribed: isSubscribed,
      }),
    },
  )
}

export async function useListSubscriptions(): Promise<IGetSubscriptionResponse> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''
  const headers = new Headers()
  headers.append('Authorization', token)

  const ssoURL = nuxtApp.$config.public.ssoURL

  const response = await fetch(
    `${ssoURL}/api/v2/subscriptions/history`,
    {
      headers,
    },
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || response.statusText)
  }
  return response.json()
}

export async function useUserInfo(): Promise<IGetUserResponse> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''
  const headers = new Headers()
  const publicConfig = nuxtApp.$config.public
  headers.append('Authorization', token)
  headers.append('X-Platform-Application', publicConfig.platform as string)
  headers.append('X-Platform-Token', publicConfig.token as string)

  const ssoURL = publicConfig.ssoURL
  const response = await fetch(
    `${ssoURL}/api/v2/users/info`,
    {
      headers,
    },
  )
  return response.json()
}

export async function useUpdateUserInfo(
  user: IUpdateUserRequest,
): Promise<string> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''
  const headers = new Headers()
  headers.append('Authorization', token)

  const ssoURL = nuxtApp.$config.public.ssoURL
  const response = await fetch(
    `${ssoURL}/api/v2/users/update-info`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fullname: user.fullname,
        birthday: user.birthday,
        phone_number: user.phone_number,
        city: user.city,
      }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || response.statusText)
  }

  return 'Update Success'
}

export async function useCheckVoucher(
  request: ICheckVoucherRequest,
): Promise<ICheckVoucherResponse> {
  const nuxtApp = useNuxtApp()
  const ssoURL = nuxtApp.$config.public.ssoURL
  const token = useAuth().token.value || ''
  const headers = new Headers()
  const publicConfig = nuxtApp.$config.public
  headers.append('Authorization', token)
  headers.append('X-Platform-Application', publicConfig.platform as string)
  headers.append('X-Platform-Token', publicConfig.token as string)
  const response = await fetch(`${ssoURL}/api/v1/voucher-instant/check`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      code: request.code,
      user_id: request.user_id,
    }),
  })
  return response.json()
}

export async function useRedeemVoucher(
  request: IRedeemVoucherRequest,
): Promise<any> {
  const nuxtApp = useNuxtApp()
  const ssoURL = nuxtApp.$config.public.ssoURL
  const token = useAuth().token.value || ''
  const headers = new Headers()
  const publicConfig = nuxtApp.$config.public
  headers.append('Authorization', token)
  headers.append('X-Platform-Application', publicConfig.platform as string)
  headers.append('X-Platform-Token', publicConfig.token as string)
  const response = await fetch(`${ssoURL}/api/v1/voucher/activate-free-sub`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      code: request.code,
      user_id: request.user_id,
      subscription_type_code: request.subscription_type_code,
    }),
  })
  return response.json()
}

export async function useChangePassword(
  request: IChangePasswordRequest,
): Promise<any> {
  const nuxtApp = useNuxtApp()
  const ssoURL = nuxtApp.$config.public.ssoURL
  const token = useAuth().token.value || ''
  const headers = new Headers()
  const publicConfig = nuxtApp.$config.public
  const isLogoutParams = request.is_logout_device ? 'logout-other-device' : ''
  headers.append('Authorization', token)
  headers.append('X-Platform-Application', publicConfig.platform as string)
  headers.append('X-Platform-Token', publicConfig.token as string)
  const response = await fetch(`${ssoURL}/api/v2/users/change-password?do=${isLogoutParams}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      actual_password: request.actual_password,
      new_password: request.new_password,
      password_confirmation: request.password_confirmation,
    }),
  })
  return response.json()
}

export async function useLogoutOtherDevices(): Promise<any> {
  const nuxtApp = useNuxtApp()
  const ssoURL = nuxtApp.$config.public.ssoURL
  const token = useAuth().token.value || ''
  const headers = new Headers()
  const publicConfig = nuxtApp.$config.public
  headers.append('Authorization', token)
  headers.append('X-Platform-Application', publicConfig.platform as string)
  headers.append('X-Platform-Token', publicConfig.token as string)
  const response = await fetch(`${ssoURL}/users/users/settings/?do=devicesLogout&ref=${nuxtApp.$config.public.url}`, {
    method: 'GET',
    headers,
  })
  return response.json()
}

export async function useListTransactions(
  page: number,
): Promise<IGetTransactionResponse> {
  const nuxtApp = useNuxtApp()
  const token = useAuth().token.value || ''
  const headers = new Headers()
  headers.append('Authorization', token)

  const ssoURL = nuxtApp.$config.public.ssoURL

  const response = await fetch(
    `${ssoURL}/api/v2/transactions/history?page=${page}`,
    {
      headers,
    },
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || response.statusText)
  }
  return response.json()
}

export async function fetchLatestRSSData(url: string, source: string, logoimage: string) {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    const parser = new DOMParser()
    const data = await response.json()
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml')

    const item = xmlDoc.querySelector('item')
    if (item) {
      const title = item.querySelector('title')?.textContent?.trim()
      const link = item.querySelector('link')?.textContent?.trim()
      const image = item.querySelector('img')?.textContent?.trim()
        || item.querySelector('media\\:content')?.getAttribute('url')
        || item.querySelector('enclosure')?.getAttribute('url')
        || `/dummies/img_placeholder.png`
      return { title, link, image, source, logoimage }
    }
  }
  catch (error) {
    console.error(`Error fetching RSS data from ${url}:`, error)
  }
  return null
}
