export function stringifyQuery(obj: Record<string, any>) {
  const params = new URLSearchParams()

  for (const key in obj) {
    const value = obj[key]

    if (Array.isArray(value))
      value.forEach(v => params.append(key, v))
    else
      params.append(key, value)
  }

  return params.toString()
}
