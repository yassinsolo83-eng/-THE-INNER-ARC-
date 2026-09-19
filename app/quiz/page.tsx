import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { QuizFlow } from '@/components/quiz-flow'

export const metadata = { title: 'Discover Yourself — The Inner Arc' }

export default async function QuizPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/quiz')

  const { data: existing } = await supabase
    .from('client_birth_profiles')
    .select('*')
    .eq('client_id', user.id)
    .single()

  return <QuizFlow userId={user.id} existing={existing} />
}
