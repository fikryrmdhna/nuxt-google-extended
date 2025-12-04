export interface ISubMailType {
  id: number
  title: string
  frequency: string
  description: string
  is_subscribed: boolean
  is_locked: boolean
}

export interface IMailTypeCategory {
  title: string
  description: string
  mail_types: ISubMailType[] | null
}

export interface IAuthMailTypesResponse {
  status: string
  message: string
  categories: IMailTypeCategory[]
  show_button_subscribe_all?: boolean
  show_button_unsubscribe_all?: boolean
}

export interface ISubscription {
  subscription_name: string
  start_time: string
  end_time: string
  is_vip?: boolean
}

export interface IGetSubscriptionResponse {
  status: string
  message: string
  page: number
  page_count: number
  items_per_page: number
  total_subscriptions: number
  subscriptions: ISubscription[]
}

export interface IGetTransactionResponse {
  status: string
  message: string
  page: number
  page_count: number
  items_per_page: number
  total_payments: number
  payments: IPayment[]
}

export interface IPayment {
  payment_type: string
  paid_at: string
  transaction_id: string
  amount: number
  payment_method: string | null
  receipts: {
    label: string
    is_disabled: boolean
    url: string | null
  }
  recurrent: {
    id: number
    label: string
    color: string
    is_stop_recurrent: boolean
    label_stop_recurrent: string | null
    is_disabled: boolean
    text_previous_attempt: string | null
    text_next_attempt: string | null
  }
}

export interface IGetUserResponse {
  status: string
  message: string
  user: IUser
}

export interface IUser {
  id: number
  email: string
  fullname: string
  phone_number: string | null
  birthday: string
  city: string | null
  confirmed_at: string | null
  nonvip_subscription: boolean
  nonvip_periode_subscription_start: string
  nonvip_periode_subscription_end: string
  vip_subscription: boolean
  vip_period_subscription_start: string
  vip_period_subscription_end: string
}

export interface IUpdateUserRequest {
  fullname: string
  birthday: string
  phone_number: string
  city: string
}

export interface ErrorResponse {
  message: string
  status: string
}

export interface ICheckVoucherRequest {
  code: string
  user_id: number
}

export interface ICheckVoucherResponse {
  voucher_id: number
  voucher_type: string
  user_type: number
  discount: number
  currency: string
  discounted_amount: number
  subscription_type_id: number
  subscription_code: string
  subscription_type_name: string
}

export interface IRedeemVoucherRequest {
  code: string
  subscription_type_code: string
  user_id: number
}

export interface IChangePasswordRequest {
  actual_password: string
  new_password: string
  password_confirmation: string
  is_logout_device: boolean
}
