'use client';

import { useField } from '@payloadcms/ui';
import type { TextFieldClientComponent } from 'payload';

const PlayDateField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path });
  const id = `field-${path}`;
  return <div className="field-type text" style={{ marginBottom: 24 }}>
    <label className="field-label" htmlFor={id}>Play date{field.required ? ' *' : ''}</label>
    <input id={id} type="date" value={value || ''} readOnly={readOnly || field.admin?.readOnly} required={field.required} aria-invalid={showError || undefined} aria-describedby={`${id}-description`} onChange={event => setValue(event.target.value)} style={{ display: 'block', width: '100%', maxWidth: 320, minHeight: 44, padding: '10px 12px', color: 'var(--theme-text)', background: 'var(--theme-input-bg)', border: '1px solid var(--theme-elevation-200)', borderRadius: 4, font: 'inherit' }} />
    <p id={`${id}-description`} style={{ marginTop: 8, color: showError ? 'var(--theme-error-500)' : 'var(--theme-elevation-600)' }}>{showError ? String(errorMessage || 'Choose a valid date.') : 'New puzzles start one day after the latest scheduled puzzle. You can choose any date. Opens at midnight Eastern.'}</p>
  </div>;
};

export default PlayDateField;
