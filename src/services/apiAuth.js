import supabase, { supabaseUrl } from './supabase'

export async function signup({ fullName, email, password }) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: '',
      },
    },
  })

  if (error) throw new Error('Failed register', { cause: error })
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error('Login error', { cause: error })

  return data
}

export async function getCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData.session) return null

  const { data, error } = await supabase.auth.getUser()

  console.log('DATA USER', data)

  if (error) throw new Error(error.message)

  return data?.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update Password Or Username
  let updateData
  if (password) updateData = { password }
  if (fullName) updateData = { data: { fullName } }

  const { data, error } = await supabase.auth.updateUser(updateData)
  if (error) throw new Error(error.message)
  //* if no avatar
  if (!avatar) return data

  //* if any avatar
  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`

  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar)

  if (storageError) throw new Error(storageError.message)

  // 3. Update Avatar in the User
  const { data: updateUser, error: errorAvatar } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    })

  if (errorAvatar) throw new Error(errorAvatar.message)
  return updateUser
}
