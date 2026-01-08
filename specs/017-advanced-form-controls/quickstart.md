# Quickstart: Advanced Form Controls

**Feature**: 017-advanced-form-controls
**Date**: 2026-01-06

This guide provides quick examples for implementing each advanced form control component.

---

## Prerequisites

Ensure the design system packages are installed:

```bash
pnpm add @ds/wc @ds/css @ds/tokens
# For React:
pnpm add @ds/react
# For DatePicker/TimePicker (peer dependency):
pnpm add date-fns @date-fns/tz
```

Import base styles:

```css
@import '@ds/css';
```

---

## 1. Select

### Web Component

```html
<ds-field>
  <ds-label>Country</ds-label>
  <ds-select placeholder="Select a country" searchable clearable>
    <ds-select-group label="North America">
      <ds-select-option value="us">United States</ds-select-option>
      <ds-select-option value="ca">Canada</ds-select-option>
      <ds-select-option value="mx">Mexico</ds-select-option>
    </ds-select-group>
    <ds-select-group label="Europe">
      <ds-select-option value="uk">United Kingdom</ds-select-option>
      <ds-select-option value="de">Germany</ds-select-option>
      <ds-select-option value="fr">France</ds-select-option>
    </ds-select-group>
  </ds-select>
  <ds-field-description>Choose your country of residence</ds-field-description>
</ds-field>

<script>
  const select = document.querySelector('ds-select');
  select.addEventListener('ds:change', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>
```

### React

```tsx
import { Select, Field, Label } from '@ds/react';

function CountrySelect() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Field>
      <Label>Country</Label>
      <Select
        value={value}
        onValueChange={setValue}
        placeholder="Select a country"
        searchable
        clearable
      >
        <Select.Group label="North America">
          <Select.Option value="us">United States</Select.Option>
          <Select.Option value="ca">Canada</Select.Option>
        </Select.Group>
      </Select>
    </Field>
  );
}
```

---

## 2. Combobox

### Web Component (Async Multi-Select)

```html
<ds-field>
  <ds-label>Assign Users</ds-label>
  <ds-combobox multiple placeholder="Search users..." debounce="300">
  </ds-combobox>
</ds-field>

<script>
  const combobox = document.querySelector('ds-combobox');

  combobox.loadItems = async (query) => {
    const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
    const users = await res.json();
    return users.map(u => ({ value: u.id, label: u.name }));
  };

  combobox.addEventListener('ds:change', (e) => {
    console.log('Selected users:', e.detail.value);
  });
</script>
```

### React

```tsx
import { Combobox, Field, Label } from '@ds/react';

function UserPicker() {
  const [selected, setSelected] = useState<string[]>([]);

  const loadUsers = async (query: string) => {
    const res = await fetch(`/api/users?q=${query}`);
    return res.json();
  };

  return (
    <Field>
      <Label>Assign Users</Label>
      <Combobox
        multiple
        value={selected}
        onValueChange={setSelected}
        loadItems={loadUsers}
        placeholder="Search users..."
      >
        <Combobox.Input />
        <Combobox.Content>
          <Combobox.Empty>No users found</Combobox.Empty>
          <Combobox.Loading>Loading...</Combobox.Loading>
        </Combobox.Content>
      </Combobox>
    </Field>
  );
}
```

---

## 3. DatePicker

### Web Component

```html
<ds-field>
  <ds-label>Check-in / Check-out</ds-label>
  <ds-date-picker
    mode="range"
    min="2026-01-01"
    locale="en-US"
    placeholder="Select dates"
  ></ds-date-picker>
</ds-field>

<script>
  const picker = document.querySelector('ds-date-picker');
  picker.addEventListener('ds:change', (e) => {
    console.log('Range:', e.detail.start, '-', e.detail.end);
  });
</script>
```

### React

```tsx
import { DatePicker, Field, Label } from '@ds/react';

function BookingDates() {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  return (
    <Field>
      <Label>Check-in / Check-out</Label>
      <DatePicker
        mode="range"
        startDate={range.start}
        endDate={range.end}
        onRangeChange={setRange}
        min={new Date()}
        locale="en-US"
      />
    </Field>
  );
}
```

---

## 4. Slider

### Web Component (Range)

```html
<ds-field>
  <ds-label>Price Range</ds-label>
  <ds-slider
    range
    min="0"
    max="1000"
    step="10"
    min-value="100"
    max-value="500"
    show-tooltip
  ></ds-slider>
  <ds-field-description>$100 - $500</ds-field-description>
</ds-field>

<script>
  const slider = document.querySelector('ds-slider');
  const desc = document.querySelector('ds-field-description');

  slider.addEventListener('ds:change', (e) => {
    desc.textContent = `$${e.detail.min} - $${e.detail.max}`;
  });
</script>
```

### React

```tsx
import { Slider, Field, Label, FieldDescription } from '@ds/react';

function PriceFilter() {
  const [range, setRange] = useState({ min: 100, max: 500 });

  return (
    <Field>
      <Label>Price Range</Label>
      <Slider
        range
        min={0}
        max={1000}
        step={10}
        minValue={range.min}
        maxValue={range.max}
        onRangeChange={setRange}
        showTooltip
      />
      <FieldDescription>${range.min} - ${range.max}</FieldDescription>
    </Field>
  );
}
```

---

## 5. NumberInput

### Web Component

```html
<ds-field>
  <ds-label>Quantity</ds-label>
  <ds-number-input
    value="1"
    min="1"
    max="99"
    step="1"
  ></ds-number-input>
</ds-field>

<script>
  const input = document.querySelector('ds-number-input');
  input.addEventListener('ds:change', (e) => {
    console.log('Quantity:', e.detail.value);
  });
</script>
```

### React

```tsx
import { NumberInput, Field, Label } from '@ds/react';

function QuantitySelector() {
  const [qty, setQty] = useState(1);

  return (
    <Field>
      <Label>Quantity</Label>
      <NumberInput
        value={qty}
        onValueChange={setQty}
        min={1}
        max={99}
      />
    </Field>
  );
}
```

---

## 6. FileUpload

### Web Component

```html
<ds-field>
  <ds-label>Documents</ds-label>
  <ds-file-upload
    accept=".pdf,.doc,.docx"
    multiple
    max-size="10485760"
    max-files="5"
  >
    <p>Drag files here or click to browse</p>
  </ds-file-upload>
</ds-field>

<script>
  const upload = document.querySelector('ds-file-upload');

  upload.onUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
  };

  upload.addEventListener('ds:select', (e) => {
    console.log('Files selected:', e.detail.files);
  });
</script>
```

### React

```tsx
import { FileUpload, Field, Label } from '@ds/react';

function DocumentUploader() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
  };

  return (
    <Field>
      <Label>Documents</Label>
      <FileUpload
        accept=".pdf,.doc,.docx"
        multiple
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        onFilesChange={setFiles}
        onUpload={handleUpload}
      >
        <FileUpload.DropZone>
          <p>Drag files here or click to browse</p>
        </FileUpload.DropZone>
        <FileUpload.FileList />
      </FileUpload>
    </Field>
  );
}
```

---

## 7. TimePicker

### Web Component

```html
<ds-field>
  <ds-label>Appointment Time</ds-label>
  <ds-time-picker
    format="12h"
    minute-step="15"
    placeholder="Select time"
  ></ds-time-picker>
</ds-field>

<script>
  const picker = document.querySelector('ds-time-picker');
  picker.addEventListener('ds:change', (e) => {
    console.log('Time:', e.detail.value); // "14:30"
  });
</script>
```

### React

```tsx
import { TimePicker, Field, Label } from '@ds/react';

function AppointmentTime() {
  const [time, setTime] = useState<{ hours: number; minutes: number } | null>(null);

  return (
    <Field>
      <Label>Appointment Time</Label>
      <TimePicker
        value={time}
        onValueChange={setTime}
        format="12h"
        minuteStep={15}
      />
    </Field>
  );
}
```

---

## 8. PinInput

### Web Component

```html
<ds-field>
  <ds-label>Verification Code</ds-label>
  <ds-pin-input length="6" mask></ds-pin-input>
  <ds-field-description>Enter the 6-digit code sent to your phone</ds-field-description>
</ds-field>

<script>
  const pin = document.querySelector('ds-pin-input');
  pin.addEventListener('ds:complete', async (e) => {
    console.log('Verifying:', e.detail.value);
    await verifyOTP(e.detail.value);
  });
</script>
```

### React

```tsx
import { PinInput, Field, Label, FieldDescription } from '@ds/react';

function OTPVerification() {
  const handleComplete = async (value: string) => {
    await verifyOTP(value);
  };

  return (
    <Field>
      <Label>Verification Code</Label>
      <PinInput
        length={6}
        mask
        onComplete={handleComplete}
      />
      <FieldDescription>Enter the 6-digit code sent to your phone</FieldDescription>
    </Field>
  );
}
```

---

## Validation Checklist

Before shipping, verify each component:

- [ ] Keyboard navigation works (Tab, Arrow keys, Enter, Escape)
- [ ] Screen reader announces labels, values, and state changes
- [ ] Error states show `aria-invalid="true"` and announce errors
- [ ] Reduced motion is respected (`prefers-reduced-motion`)
- [ ] Virtualization activates for >100 options (Select/Combobox)
- [ ] Form submission includes component values
- [ ] Disabled state prevents interaction
- [ ] Component works without JavaScript (SSR fallback)
