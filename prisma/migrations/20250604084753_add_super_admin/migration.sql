-- This is an empty migration.
-- You can add your custom SQL here.

-- Insert Super Admin User
INSERT INTO `Users` (
    `BusinessID`,
    `Role`,
    `Username`,
    `PasswordHash`,
    `FullName`,
    `Email`,
    `IsActive`,
    `CreatedAt`,
    `UpdatedAt`
) VALUES (
    NULL,                       -- BusinessID is NULL for SuperAdmins
    'SuperAdmin',               -- Role
    'superadmin',               -- Username
    '$2a$12$84LqYwyrypCLqTvO1F9QD.Uf5o6w63rgX4h76rrN0dczpIZS411M2', -- PasswordHash (REPLACE THIS!)
    'Super Administrator',      -- FullName
    'superadmin@example.com',   -- Email
    TRUE,                       -- IsActive
    NOW(),                      -- CreatedAt
    NOW()                       -- UpdatedAt
);