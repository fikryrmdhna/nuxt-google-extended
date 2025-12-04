import CryptoJS from 'crypto-js'
import { MULTIMEDIA_LIST } from '../lib/constant'

export function getPathTargeting() {
  const route = useRoute()
  const pathSegments = route.path.split('/').filter(Boolean)
  const isArticleDetail = pathSegments.length >= 2 && /-/.test(pathSegments[pathSegments.length - 1])
  const plusSegment = pathSegments[0] === 'plus' ? 'tempoplus' : pathSegments[0]

  return pathSegments.length === 0
    ? 'Homepage'
    : pathSegments[0] === 'mingguan'
      ? 'mingguan'
      : pathSegments[0] === 'foto'
        ? 'MultimediaFoto'
        : pathSegments[0] === 'plus'
          ? pathSegments[1] || 'tempoplus'
          : isArticleDetail
            ? plusSegment
            : (pathSegments[1] || plusSegment)
}

export function checkGptMultimedia() {
  let checkPathTargeting = getPathTargeting()
  if (MULTIMEDIA_LIST.includes(checkPathTargeting)) {
    const dataPathTarget = MULTIMEDIA_LIST.find(item => item === checkPathTargeting)
    if (dataPathTarget === 'multimedia') {
      checkPathTargeting = 'MultimediaBeranda'
    }
    else {
      checkPathTargeting = `Multimedia${capitalizeFirstLetter(dataPathTarget)}`
    }
  }

  return checkPathTargeting
}

export function generateSha256(string: string = '') {
  if (!string) return string
  return CryptoJS.SHA256(string).toString(CryptoJS.enc.Hex)
}
