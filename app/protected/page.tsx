import { auth } from '@/auth'

const Page = async () => {
  const session = await auth()
  return <div>{JSON.stringify(session)}</div>
}

export default Page
