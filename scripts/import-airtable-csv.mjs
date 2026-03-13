import fs from 'node:fs/promises';
import path from 'node:path';

import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function toInteger(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const normalized = String(value).replace(',', '.').trim();
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.trunc(parsed);
}

function toNullableInteger(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = toInteger(value, Number.NaN);
  return Number.isNaN(parsed) ? null : parsed;
}

function toBoolean(value) {
  const normalized = normalizeText(value);
  return ['1', 'true', 'yes', 'oui', 'on', 'pause', 'arrêt', 'arret'].includes(normalized);
}

function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function normalizeCountryDialCode(value) {
  const digits = digitsOnly(value);
  if (!digits) return '+33';
  return `+${digits}`;
}

function normalizeWhatsappNumber(value, options = {}) {
  if (!value) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  let normalized = trimmed.replace(/[\s().-]/g, '');
  if (!normalized) return null;

  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  const selectedDialCode = normalizeCountryDialCode(options.countryDialCode ?? '+33');
  const selectedDialDigits = selectedDialCode.slice(1);
  const startsWithPlus = normalized.startsWith('+');
  let digits = digitsOnly(normalized);

  if (!digits) return null;

  if (startsWithPlus) return `+${digits}`;
  if (digits.startsWith(selectedDialDigits)) return `+${digits}`;

  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
    if (!digits) return null;
    return `+${selectedDialDigits}${digits}`;
  }

  return `+${selectedDialDigits}${digits}`;
}

function buildStudentKey(fullName, whatsappNumber) {
  return `${normalizeText(fullName)}|${normalizeText(whatsappNumber)}`;
}

function pickColumn(row, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      return row[key];
    }
  }
  return '';
}

async function main() {
  const csvArgPath = process.argv[2] ?? 'data/airtable-export.csv';
  const csvPath = path.resolve(process.cwd(), csvArgPath);

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SECRET_KEY');

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const csvContent = await fs.readFile(csvPath, 'utf-8');
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  const { data: teachers, error: teachersError } = await supabase.from('teachers').select('id,name,slug');
  if (teachersError) throw teachersError;

  const teacherMap = new Map();
  for (const teacher of teachers ?? []) {
    teacherMap.set(normalizeText(teacher.name), teacher.id);
    teacherMap.set(normalizeText(teacher.slug), teacher.id);
  }

  const { data: existingStudents, error: existingStudentsError } = await supabase
    .from('students')
    .select('id,full_name,whatsapp_number');
  if (existingStudentsError) throw existingStudentsError;

  const existingStudentMap = new Map();
  for (const student of existingStudents ?? []) {
    const normalizedWhatsapp =
      normalizeWhatsappNumber(student.whatsapp_number ?? '', { countryDialCode: '+33' }) ??
      (student.whatsapp_number ?? '');
    existingStudentMap.set(buildStudentKey(student.full_name, normalizedWhatsapp), student.id);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const warnings = [];

  for (const row of rows) {
    const fullName = String(pickColumn(row, ['Nom']) ?? '').trim();
    if (!fullName) {
      skipped += 1;
      warnings.push('Ligne ignorée: colonne "Nom" vide.');
      continue;
    }

    const whatsappNumber = String(pickColumn(row, ['Numéro WhatsApp', 'Numero WhatsApp']) ?? '').trim();
    const normalizedWhatsappNumber = normalizeWhatsappNumber(whatsappNumber, { countryDialCode: '+33' });
    const teacherRaw = String(pickColumn(row, ['Professeur assigné', 'Professeur assigne']) ?? '').trim();
    const teacherId = teacherRaw ? teacherMap.get(normalizeText(teacherRaw)) ?? null : null;

    if (teacherRaw && !teacherId) {
      warnings.push(`Professeur non trouvé pour "${fullName}": "${teacherRaw}". Importé sans professeur.`);
    }

    const payload = {
      full_name: fullName,
      gender: String(pickColumn(row, ['Genre']) ?? '').trim() || null,
      age: toNullableInteger(pickColumn(row, ['Âge', 'Age'])),
      whatsapp_number: normalizedWhatsappNumber || whatsappNumber || null,
      course_type: String(pickColumn(row, ['Type de cours']) ?? '').trim() || null,
      hours_per_week: toNullableInteger(
        pickColumn(row, ["Nombre d'heures par semaine", 'Nombre d’heures par semaine', 'Nombre heures par semaine'])
      ),
      payment_method: String(pickColumn(row, ['Moyen de paiement']) ?? '').trim() || null,
      teacher_id: teacherId,
      validated_timeslot: String(pickColumn(row, ['Créneau validé', 'Creneau valide']) ?? '').trim() || null,
      total_courses_purchased: Math.max(0, toInteger(pickColumn(row, ['Total de cours achetés', 'Total de cours achetes']), 0)),
      courses_completed: Math.max(0, toInteger(pickColumn(row, ['Cours effectués', 'Cours effectues']), 0)),
      is_paused: toBoolean(pickColumn(row, ['Arrêt / pause', 'Arret / pause', 'Pause'])),
    };

    const key = buildStudentKey(fullName, normalizedWhatsappNumber || whatsappNumber);
    const existingId = existingStudentMap.get(key);

    if (existingId) {
      const { error } = await supabase.from('students').update(payload).eq('id', existingId);
      if (error) {
        warnings.push(`Échec update pour "${fullName}": ${error.message}`);
        continue;
      }
      updated += 1;
      continue;
    }

    const { data, error } = await supabase.from('students').insert(payload).select('id').single();
    if (error) {
      warnings.push(`Échec insert pour "${fullName}": ${error.message}`);
      continue;
    }

    existingStudentMap.set(key, data.id);
    inserted += 1;
  }

  console.log('Import Airtable terminé');
  console.log(`- Lignes CSV: ${rows.length}`);
  console.log(`- Élèves insérés: ${inserted}`);
  console.log(`- Élèves mis à jour: ${updated}`);
  console.log(`- Lignes ignorées: ${skipped}`);
  console.log(
    '- Note: "Cours restants" n’est pas importé comme source de vérité. Le solde est calculé via total_courses_purchased - courses_completed.'
  );

  if (warnings.length > 0) {
    console.log('\nAvertissements:');
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }
}

main().catch((error) => {
  console.error('Import Airtable en échec:', error);
  process.exit(1);
});
