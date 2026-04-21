import { config } from '../config/env';

const API_URL = `${config.apiUrl}/api/contacts`;

// Map backend snake_case fields to frontend camelCase
const toFrontend = (c) => ({
  id:        c.id,
  firstName: c.first_name,
  lastName:  c.last_name,
  email:     c.email,
  phone:     c.phone,
  address:   c.address,
});

// Map frontend camelCase fields to backend snake_case
const toBackend = (c) => ({
  first_name: c.firstName,
  last_name:  c.lastName,
  email:      c.email,
  phone:      c.phone,
  address:    c.address,
});

/**
 * Fetch a paginated list of contacts from the backend.
 *
 * @param {Object} opts
 * @param {string} opts.search  – optional search query
 * @param {number} opts.page    – 1-based page number (default 1)
 * @param {number} opts.limit   – records per page (default 10)
 * @returns {Promise<{ contacts, total, page, pages }>}
 */
export const getContacts = async ({ search = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search.trim()) params.set('search', search.trim());

  const response = await fetch(`${API_URL}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch contacts');

  const data = await response.json();
  return {
    contacts: data.contacts.map(toFrontend),
    total:    data.total,
    page:     data.page,
    pages:    data.pages,
    limit:    data.limit,
  };
};

/**
 * Create a new contact.
 * @param {Object} contact – camelCase contact data
 * @returns {Promise<{ id, ...contact }>}
 */
export const addContact = async (contact) => {
  const response = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(toBackend(contact)),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0] || 'Failed to create contact');

  return { id: data.id, ...contact };
};

/**
 * Update an existing contact.
 * @param {number} id      – contact id
 * @param {Object} contact – camelCase updated fields
 */
export const updateContact = async (id, contact) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(toBackend(contact)),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0] || 'Failed to update contact');

  return { id, ...contact };
};

/**
 * Delete a contact by id.
 * @param {number} id
 */
export const deleteContact = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.errors?.[0] || 'Failed to delete contact');
  return true;
};

/**
 * Client-side validation before sending to backend.
 * Returns an object with field-keyed error strings (empty if valid).
 */
export const validateContact = (data) => {
  const errors = {};

  if (!data.firstName?.trim())  errors.firstName = 'First name is required';
  if (!data.lastName?.trim())   errors.lastName  = 'Last name is required';
  if (!data.address?.trim())    errors.address   = 'Address is required';

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{7,}$/.test(data.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone must have at least 7 digits';
  }

  return errors;
};
