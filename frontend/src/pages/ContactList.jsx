import { useState, useEffect, useContext, useCallback } from 'react';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import { EditIcon, DeleteIcon, PlusIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/icons';
import { getContacts, deleteContact } from '@/utils/contactStorage';
import { ToastContext } from '@/context/ToastContext';

const PAGE_SIZE = 10;

/**
 * Patient list page — table view with search, pagination, and inline delete confirm.
 *
 * @param {Function} onAdd        - Called when the "Register Patient" button is clicked
 * @param {Function} onEdit       - Called with the contact object when edit is triggered
 * @param {number}   refreshKey   - Incrementing this value forces a data re-fetch (after add/edit)
 */
export default function ContactList({ onAdd, onEdit, refreshKey }) {
  const { showToast } = useContext(ToastContext);

  const [contacts,   setContacts]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [isLoading,  setIsLoading]  = useState(true);
  const [hasError,   setHasError]   = useState(false);
  const [confirmId,  setConfirmId]  = useState(null);

  useEffect(() => {
    setPage(1);
    setConfirmId(null);
  }, [search]);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const result = await getContacts({ search, page, limit: PAGE_SIZE });
      setContacts(result.contacts);
      setTotalPages(result.pages);
      setTotal(result.total);
    } catch {
      setHasError(true);
      showToast('Failed to load patients', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, page, refreshKey, showToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /**
   * Deletes the given contact after the user confirms via the inline confirm row.
   * @param {{ id: number, firstName: string, lastName: string }} contact
   */
  const handleConfirmDelete = async (contact) => {
    try {
      await deleteContact(contact.id);
      showToast(`${contact.firstName} ${contact.lastName} removed`, 'success');
      setConfirmId(null);
      fetchContacts();
    } catch (err) {
      showToast(err.message || 'Error removing patient', 'error');
    }
  };

  const initials = (c) =>
    `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase();

  const pageStart = (page - 1) * PAGE_SIZE + 1;
  const pageEnd   = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="list-layout">
      <PageHeader
        title="Patients"
        count={!isLoading && !hasError ? total : undefined}
        search={
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients…"
            ariaLabel="Search patients"
          />
        }
        action={
          <Button variant="primary" size="md" icon={PlusIcon} onClick={onAdd}>
            Register Patient
          </Button>
        }
      />

      {isLoading && (
        <div className="loading-state">
          <span className="spinner" />
          Loading…
        </div>
      )}

      {!isLoading && hasError && (
        <div className="error-banner">
          <span>Could not load patients.</span>
          <Button variant="secondary" size="sm" onClick={fetchContacts}>Retry</Button>
        </div>
      )}

      {!isLoading && !hasError && contacts.length === 0 && (
        <div className="empty-state">
          <UserIcon className="empty-icon" style={{ width: 40, height: 40 }} />
          <p className="empty-title">{search ? 'No patients found' : 'No patients yet'}</p>
          <p className="empty-subtitle">
            {search ? 'Try a different search term' : 'Register the first patient to get started'}
          </p>
          {!search && (
            <Button variant="primary" size="md" icon={PlusIcon} onClick={onAdd}>
              Register Patient
            </Button>
          )}
        </div>
      )}

      {!isLoading && !hasError && contacts.length > 0 && (
        <>
          <div className="patient-table-wrap">
            <table className="patient-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => {
                  const isConfirming = confirmId === contact.id;
                  return (
                    <tr key={contact.id} className={isConfirming ? 'row-confirming' : ''}>
                      <td>
                        <div className="contact-avatar">{initials(contact)}</div>
                      </td>
                      <td>
                        <span className="contact-name">
                          {contact.firstName} {contact.lastName}
                        </span>
                      </td>
                      <td>
                        <span className="contact-meta">{contact.email}</span>
                      </td>
                      <td>
                        <span className="contact-meta">{contact.phone}</span>
                      </td>
                      <td>
                        <span className="contact-meta">{contact.address}</span>
                      </td>
                      <td>
                        {!isConfirming ? (
                          <div className="contact-actions">
                            <Button
                              variant="ghost"
                              iconOnly
                              icon={EditIcon}
                              onClick={() => onEdit(contact)}
                              title="Edit patient"
                              aria-label={`Edit ${contact.firstName}`}
                            />
                            <Button
                              variant="danger"
                              iconOnly
                              icon={DeleteIcon}
                              onClick={() => setConfirmId(contact.id)}
                              title="Remove patient"
                              aria-label={`Remove ${contact.firstName}`}
                            />
                          </div>
                        ) : (
                          <div className="confirm-row">
                            <button
                              className="confirm-yes"
                              onClick={() => handleConfirmDelete(contact)}
                            >
                              Remove
                            </button>
                            <Button
                              variant="ghost"
                              iconOnly
                              icon={CloseIcon}
                              onClick={() => setConfirmId(null)}
                              title="Cancel"
                              aria-label="Cancel remove"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                {pageStart}–{pageEnd} of {total} patients
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon style={{ width: 13, height: 13 }} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '…' ? (
                      <span key={`ell-${idx}`} className="page-btn" style={{ cursor: 'default', opacity: 0.4 }}>…</span>
                    ) : (
                      <button
                        key={item}
                        className={`page-btn${page === item ? ' active' : ''}`}
                        onClick={() => setPage(item)}
                        aria-current={page === item ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRightIcon style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
