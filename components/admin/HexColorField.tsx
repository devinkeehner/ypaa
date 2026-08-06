"use client";

import { useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

import styles from "./hex-color-field.module.css";

const HEX = /^#[0-9a-f]{6}$/i;

export const HexColorField: TextFieldClientComponent = ({ field, path }) => {
  const { errorMessage, setValue, showError, value } = useField<string>({ path });
  const textValue = typeof value === "string" ? value : "";
  const pickerValue = HEX.test(textValue) ? textValue : "#000000";
  const label = typeof field.label === "string" ? field.label : field.name;

  return <div className={styles.field}>
    <label htmlFor={`${path}-hex`}>{label}{field.required ? <span> *</span> : null}</label>
    <div className={styles.controls}>
      <input aria-label={`${label} color picker`} className={styles.picker} onChange={(event) => setValue(event.target.value.toUpperCase())} type="color" value={pickerValue} />
      <input aria-invalid={showError || undefined} id={`${path}-hex`} maxLength={7} onChange={(event) => setValue(event.target.value.toUpperCase())} placeholder="#E85E27" type="text" value={textValue} />
      <span aria-hidden="true" className={styles.swatch} style={{ background: pickerValue }} />
    </div>
    {showError ? <p className={styles.error}>{String(errorMessage || "Enter a valid six-digit hex color.")}</p> : <p className={styles.description}>Choose a color or paste an exact six-digit hex code.</p>}
  </div>;
};

export default HexColorField;
