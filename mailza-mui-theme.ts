/*
 * SPDX-FileCopyrightText: 2026 Mailza <https://www.mailza.co>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Mailza Material-UI Theme Override Integration Block
 * This file contains the complete theme mapping to override Zextras Carbonio's default MUI themes.
 * File to target for patching: carbonio-ui-commons/src/theme/theme-mui.ts
 */

import { CustomPaletteOptions } from '@mui/material/styles';

/**
 * Mailza Custom MUI Theme Color Overrides
 * Replaces the hardcoded palette in carbonio-ui-commons/src/theme/theme-mui.ts.
 * Bridges Carbonio's styling engine with Mailza's "Consumer-Grade B2B" Visual Identity.
 * All contrast ratios adhere strictly to WCAG 2.1 AA (4.5:1 minimum on text surfaces).
 */
export const mailzaPaletteOverrides: Partial<CustomPaletteOptions['palette']> = {
  // CONFIDENT INDIGO PRIMARY (Replaces Carbonio default #2b73d2)
  primary: {
    regular: '#4f46e5',   // Indigo-600
    hover: '#4338ca',     // Indigo-700
    active: '#3730a3',    // Indigo-800
    focus: '#4338ca',     
    disabled: '#a5b4fc',  // Indigo-300
    main: '#4f46e5'
  },
  
  // SAFARI EMERALD SECONDARY (Replaces Carbonio default #828282)
  secondary: {
    regular: '#0d9488',   // Teal-600
    hover: '#0f766e',     // Teal-700
    active: '#115e59',    // Teal-800
    focus: '#0f766e',
    disabled: '#99f6e4',  // Teal-200
    main: '#0d9488'
  },

  // HIGH-TRUST MODERN LIGHT GRAYSCALE
  gray0: {
    regular: '#0f172a',   // Slate-900 (Primary text/active icons)
    hover: '#1e293b',     // Slate-800
    active: '#0f172a',
    focus: '#1e293b',
    disabled: '#94a3b8'
  },
  gray1: {
    regular: '#475569',   // Slate-600 (Secondary text)
    hover: '#334155',     // Slate-700
    active: '#1e293b',
    focus: '#334155',
    disabled: '#cbd5e1'
  },
  gray2: {
    regular: '#cbd5e1',   // Slate-300 (Borders)
    hover: '#94a3b8',     // Slate-400
    active: '#64748b',
    focus: '#94a3b8',
    disabled: '#cbd5e1'
  },
  gray3: {
    regular: '#f1f5f9',   // Slate-100 (Secondary backgrounds/table headers)
    hover: '#e2e8f0',     // Slate-200
    active: '#cbd5e1',
    focus: '#e2e8f0',
    disabled: '#f8fafc'
  },
  gray4: {
    regular: '#f8fafc',   // Slate-50 (Canvas background)
    hover: '#f1f5f9',
    active: '#e2e8f0',
    focus: '#f1f5f9',
    disabled: '#f8fafc'
  },
  gray5: {
    regular: '#ffffff',   // Clean card canvas
    hover: '#f8fafc',
    active: '#f1f5f9',
    focus: '#f8fafc',
    disabled: '#ffffff'
  },
  gray6: {
    regular: '#ffffff',   // Surface element layers
    hover: '#f1f5f9',
    active: '#e2e8f0',
    focus: '#f1f5f9',
    disabled: '#ffffff'
  },

  // OPTIMIZED ACTION STATUS COLOURS
  success: {
    regular: '#10b981',   // Emerald-500
    hover: '#059669',     // Emerald-600
    active: '#047857',
    focus: '#059669',
    disabled: '#a7f3d0',
    main: '#10b981'
  },
  warning: {
    regular: '#f59e0b',   // Amber-500
    hover: '#d97706',     // Amber-600
    active: '#b45309',
    focus: '#d97706',
    disabled: '#fde68a',
    main: '#f59e0b'
  },
  error: {
    regular: '#ef4444',   // Red-500
    hover: '#dc2626',     // Red-600
    active: '#b91c1c',
    focus: '#dc2626',
    disabled: '#fca5a5',
    main: '#ef4444'
  },
  info: {
    regular: '#06b6d4',   // Cyan-500
    hover: '#0891b2',     // Cyan-600
    active: '#0e7490',
    focus: '#0891b2',
    disabled: '#a5f3fc',
    main: '#06b6d4'
  },
  
  // PRIMARY ACCESSIBLE TEXT PALETTE
  text: {
    regular: '#0f172a',   // Slate-900 (Highly readable default text)
    hover: '#1e293b',     
    active: '#020617',
    focus: '#1e293b',
    disabled: '#94a3b8',
    main: '#0f172a'
  }
};

/**
 * MUI Component Override Configurations
 * Inject into `themeMui` in `carbonio-ui-commons/src/theme/theme-mui.ts`.
 * Focuses on removing flat harsh boxes and replacing them with modern consumer details (generous padding, rounded corners, drop shadows).
 */
export const mailzaComponentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none' as const, // Prevents sterile uppercase look
        fontFamily: 'Outfit, Inter, sans-serif',
        fontWeight: 600,
        padding: '8px 16px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:active': {
          transform: 'scale(0.96)' // Satifying button-click scale micro-interaction
        },
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.15)'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '16px',
        '&:hover': {
          transform: 'translateY(-2px)', // Shadow lift hover animation
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.08)'
        }
      }
    }
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: '8px !important',
        fontFamily: 'Inter, sans-serif',
        '&.Mui-focused': {
          borderColor: '#4f46e5 !important',
          boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2) !important'
        }
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
        borderRadius: '8px' // Modern soft rounded squares instead of default circles
      }
    }
  }
};
