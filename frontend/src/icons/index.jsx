// SVG icon components — accept both className and style props
// Default size is controlled by CSS; override with style={{ width, height }} as needed

const icon = (path, viewBox = '0 0 24 24', fill = 'none') =>
  function Icon({ className, style }) {
    return (
      <svg
        className={className}
        style={style}
        fill={fill}
        stroke={fill === 'none' ? 'currentColor' : undefined}
        viewBox={viewBox}
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };

export const SunIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
);

export const MoonIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
);

export const PlusIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
);

export const EditIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
);

export const DeleteIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
);

export const CheckIcon = icon(
  <path fillRule="evenodd" clipRule="evenodd"
    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />,
  '0 0 20 20', 'currentColor'
);

export const CloseIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
);

export const UserIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
);

export const MailIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
);

export const PhoneIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502.609l-2.01 1.042a1 1 0 00-.02 1.092l2.828 2.828a1 1 0 001.092-.02l1.042-2.01a1 1 0 01.609-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
);

export const MapIcon = icon(
  <>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </>
);

export const SearchIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
);

export const ChevronLeftIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
);

export const ChevronRightIcon = icon(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
);
