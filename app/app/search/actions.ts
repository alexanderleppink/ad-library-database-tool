'use server';

export async function getMetaAccessToken() {
  return process.env.META_USER_ACCESS_TOKEN;
}
