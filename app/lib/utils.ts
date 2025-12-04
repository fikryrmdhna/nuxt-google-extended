export function constructMultipleQueryString(sourceList: string[], keyParams: string) {
  const params = new URLSearchParams()
  sourceList.forEach((item) => {
    params.append(`${keyParams}[]`, item)
  })
  return params.toString()
}
