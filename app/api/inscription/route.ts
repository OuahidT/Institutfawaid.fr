import { NextResponse } from 'next/server';

import { createRegistrationRequest, type PublicRegistrationInput } from '@/lib/internal/registration-service';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublicRegistrationInput;
    await createRegistrationRequest(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Une erreur est survenue lors de l’enregistrement de votre demande.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
