import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies(); // ✅ REQUIRED in Next.js 16

  const supabase = createClient(cookieStore); // ✅ PASS IT HERE

  const { data: todos, error } = await supabase
    .from('todos')
    .select();

  if (error) {
    return <p>Error loading todos</p>;
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}