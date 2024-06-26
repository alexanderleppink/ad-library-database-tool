import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './SubmitButton';
import { TextInput } from 'flowbite-react';

export default function Login() {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/app');
  };

  return (
    <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-8 m-auto">
      <h2 className="text-3xl my-4">Login to your account</h2>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <TextInput name="email" placeholder="you@example.com" required />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <TextInput type="password" name="password" placeholder="••••••••" required />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
      </form>
    </div>
  );
}
