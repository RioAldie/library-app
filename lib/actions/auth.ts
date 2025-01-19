'use server';

import { signIn } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { hash } from 'bcryptjs';
import { error } from 'console';
import { eq } from 'drizzle-orm';

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, 'email' | 'password'>
) => {
  const { email, password } = params;

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { succcess: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, 'Signin error');
    return { success: false, error: 'Signin Error!' };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityCard, universityId, password } =
    params;

  //Check if user exist
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: 'user already exist' };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityCard,
      universityId,
      password: hashedPassword,
    });

    // signin
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, 'signup error');
    return { success: false, error: 'Signup Error!' };
  }
};
