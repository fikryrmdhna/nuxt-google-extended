export function getInitial(user: { first_name: string, last_name?: string | null | undefined, email: string }) {
  if (!user) return ''
  const { first_name, last_name } = user
  // if user.first_name is empty, return initial from email before @
  if (!first_name) return user.email.split('@')[0][0]
  if (last_name) return first_name[0] + last_name[0]
  const firstNameMaybeFullName = first_name.split(' ')
  if (firstNameMaybeFullName.length > 1) {
    return firstNameMaybeFullName[0][0] + firstNameMaybeFullName[firstNameMaybeFullName.length - 1][0]
  }
  if (first_name.length > 1) return first_name[0] + first_name[1]
  return first_name[0]
}

export function getFullname(user: { first_name: string, last_name?: string | null | undefined, email: string }) {
  if (!user) return ''

  const { first_name, last_name } = user
  if (!first_name) return user.email.split('@')[0]

  if (last_name) return `${first_name} ${last_name}`
  return first_name
}
