-- Enable email confirmations
ALTER TABLE auth.users 
ADD COLUMN email_confirmed_at TIMESTAMPTZ,
ADD COLUMN confirmation_token TEXT,
ADD COLUMN confirmation_sent_at TIMESTAMPTZ;

-- Update auth settings to require email confirmation
UPDATE auth.config 
SET config = jsonb_set(
  config,
  '{mailer, validate_email}',
  'true'::jsonb
);

-- Set up email templates
INSERT INTO auth.mfa_factors (user_id, factor_type, status, created_at, updated_at)
SELECT 
  id,
  'email',
  'verified',
  NOW(),
  NOW()
FROM auth.users
ON CONFLICT DO NOTHING;

-- Configure email templates
UPDATE auth.config
SET config = jsonb_set(
  config,
  '{mailer, templates}',
  '{
    "confirmation": {
      "subject": "Confirma tu correo electrónico - KLV Sistema de Gastos",
      "content_html": "<h2>Confirma tu correo electrónico</h2><p>Haz clic en el siguiente enlace para confirmar tu correo electrónico:</p><p><a href=\"{{ .ConfirmationURL }}\">Confirmar correo electrónico</a></p>",
      "content_text": "Confirma tu correo electrónico\n\nHaz clic en el siguiente enlace para confirmar tu correo electrónico:\n\n{{ .ConfirmationURL }}"
    },
    "recovery": {
      "subject": "Restablece tu contraseña - KLV Sistema de Gastos",
      "content_html": "<h2>Restablece tu contraseña</h2><p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href=\"{{ .RecoveryURL }}\">Restablecer contraseña</a></p>",
      "content_text": "Restablece tu contraseña\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n\n{{ .RecoveryURL }}"
    },
    "magic_link": {
      "subject": "Tu enlace de acceso - KLV Sistema de Gastos",
      "content_html": "<h2>Accede a tu cuenta</h2><p>Haz clic en el siguiente enlace para acceder a tu cuenta:</p><p><a href=\"{{ .MagicLinkURL }}\">Acceder a mi cuenta</a></p>",
      "content_text": "Accede a tu cuenta\n\nHaz clic en el siguiente enlace para acceder a tu cuenta:\n\n{{ .MagicLinkURL }}"
    }
  }'::jsonb
);