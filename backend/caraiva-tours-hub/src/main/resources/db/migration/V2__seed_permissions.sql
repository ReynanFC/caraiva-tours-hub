CREATE UNIQUE INDEX IF NOT EXISTS uk_permission_role ON permission (role);

INSERT INTO permission(role) VALUES ('ADMIN'),('EMPLOYEE')
    ON CONFLICT (role) DO NOTHING;
