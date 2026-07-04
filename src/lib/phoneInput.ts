import {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'

export type { CountryCode }

export interface PhoneCountry {
  code: CountryCode
  name: string
  dialCode: string
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

export const PHONE_COUNTRIES: PhoneCountry[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'TZ'

export function detectCountryFromInput(input: string): CountryCode | undefined {
  const typer = new AsYouType()
  typer.input(input.startsWith('+') ? input : `+${input}`)
  return typer.getCountry()
}

export function formatNationalAsYouType(nationalDigits: string, country: CountryCode): string {
  const typer = new AsYouType(country)
  return typer.input(nationalDigits)
}

export function toInternationalDisplay(
  nationalDigits: string,
  country: CountryCode,
): string {
  const digits = nationalDigits.replace(/\D/g, '')
  if (!digits) return ''

  const parsed = parsePhoneNumberFromString(digits, country)
  if (parsed?.isValid()) return parsed.formatInternational()

  const dial = getCountryCallingCode(country)
  const typer = new AsYouType(country)
  const formattedNational = typer.input(digits)
  return `+${dial} ${formattedNational}`.trim()
}

export function parseStoredPhone(
  value: string,
  fallbackCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): { country: CountryCode; nationalDigits: string; display: string } {
  if (!value.trim()) {
    return { country: fallbackCountry, nationalDigits: '', display: '' }
  }

  const parsed = parsePhoneNumberFromString(value)
  if (parsed) {
    return {
      country: parsed.country ?? fallbackCountry,
      nationalDigits: parsed.nationalNumber,
      display: parsed.formatInternational(),
    }
  }

  const digits = value.replace(/\D/g, '')
  return {
    country: fallbackCountry,
    nationalDigits: digits,
    display: toInternationalDisplay(digits, fallbackCountry),
  }
}

export function validatePhone(value: string): { valid: boolean; message?: string } {
  const trimmed = value.trim()
  if (!trimmed) return { valid: true }

  if (!isValidPhoneNumber(trimmed)) {
    return { valid: false, message: 'Enter a valid phone number (e.g. +255 656 631 1XX)' }
  }

  return { valid: true }
}
