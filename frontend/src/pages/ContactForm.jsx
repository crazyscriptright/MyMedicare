import { useState, useEffect, useContext } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { CheckIcon, UserIcon, MailIcon, PhoneIcon, MapIcon } from '@/icons';
import { addContact, updateContact, validateContact } from '@/utils/contactStorage';
import { ToastContext } from '@/context/ToastContext';

/**
 * Form for creating or editing a patient record.
 * Rendered inside a Sheet panel — no back navigation needed.
 *
 * @param {Object|null} contact   - Existing contact to edit, or null for a new record
 * @param {Function}    onSave    - Called after a successful save; triggers list refresh + sheet close
 * @param {Function}    onCancel  - Called when the Cancel button is clicked
 */
export default function ContactForm({ contact, onSave, onCancel }) {
  const { showToast } = useContext(ToastContext);

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    address:   '',
  });

  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setForm({
        firstName: contact.firstName ?? '',
        lastName:  contact.lastName  ?? '',
        email:     contact.email     ?? '',
        phone:     contact.phone     ?? '',
        address:   contact.address   ?? '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateContact(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast(Object.values(validationErrors)[0], 'error', 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      if (contact?.id) {
        await updateContact(contact.id, form);
        showToast('Patient updated!', 'success');
      } else {
        await addContact(form);
        showToast('Patient registered!', 'success');
      }
      onSave();
    } catch (err) {
      showToast(err.message || 'Error saving patient', 'error', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <Input
          label="First Name"
          name="firstName"
          placeholder="John"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
          icon={UserIcon}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange}
          error={errors.lastName}
          icon={UserIcon}
          required
        />
      </div>

      <div style={{ marginTop: '0.85rem' }}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={MailIcon}
          required
        />
      </div>

      <div style={{ marginTop: '0.85rem' }}>
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="10-digit number (e.g. 9876543210)"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={PhoneIcon}
          required
        />
      </div>

      <div style={{ marginTop: '0.85rem' }}>
        <Input
          label="Address"
          name="address"
          type="textarea"
          placeholder="123 Main St, City, State"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
          icon={MapIcon}
          required
        />
      </div>

      <div
        className="form-footer"
        style={{ marginLeft: '-1.25rem', marginRight: '-1.25rem', marginBottom: '-1.25rem', marginTop: '1.25rem' }}
      >
        <Button type="button" variant="secondary" size="md" onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" icon={CheckIcon} disabled={isSubmitting} style={{ flex: 1 }}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
