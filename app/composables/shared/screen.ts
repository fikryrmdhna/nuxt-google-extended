import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isSmallScreen = breakpoints.smallerOrEqual('sm')
export const isMediumOrLargeScreen = breakpoints.between('sm', 'xl')
export const isDesktopScreen = breakpoints.greaterOrEqual('lg')
export const isExtraLargeScreen = breakpoints.smallerOrEqual('xl')
