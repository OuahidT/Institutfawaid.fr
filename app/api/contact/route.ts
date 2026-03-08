import { NextResponse } from 'next/server';

import { buildContactEmailText, parseContactPayload } from '@/lib/contact';

export const runtime = 'nodejs';

type ResendEmailResponse = {
  id?: string;
  error?: {
    message?: string;
  };
};

function getRequiredEnvVar(name: 'RESEND_API_KEY' | 'CONTACT_TO_EMAIL' | 'CONTACT_FROM_EMAIL') {
  const value = process.env[name]?.trim();
  return value || '';
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Requête invalide. Merci de vérifier les informations saisies.',
      },
      { status: 400 }
    );
  }

  const { data, errors, isValid } = parseContactPayload(payload);

  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        message: 'Merci de corriger les champs signalés.',
        errors,
      },
      { status: 400 }
    );
  }

  const resendApiKey = getRequiredEnvVar('RESEND_API_KEY');
  const toEmail = getRequiredEnvVar('CONTACT_TO_EMAIL');
  const fromEmail = getRequiredEnvVar('CONTACT_FROM_EMAIL');

  if (!resendApiKey || !toEmail || !fromEmail) {
    console.error('Contact API misconfiguration: missing required environment variables.');
    return NextResponse.json(
      {
        success: false,
        message: 'Service de contact momentanément indisponible. Merci de réessayer plus tard.',
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `Nouveau message de contact - ${data.fullName}`,
        text: buildContactEmailText(data),
      }),
    });

    const result = (await response.json().catch(() => ({}))) as ResendEmailResponse;

    if (!response.ok || !result.id) {
      console.error('Resend API error:', {
        status: response.status,
        message: result.error?.message ?? 'Unknown error',
      });
      return NextResponse.json(
        {
          success: false,
          message: "L'envoi a échoué. Merci de réessayer dans quelques instants.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons rapidement.',
    });
  } catch (error) {
    console.error('Contact API unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "L'envoi est momentanément indisponible. Merci de réessayer plus tard.",
      },
      { status: 500 }
    );
  }
}
