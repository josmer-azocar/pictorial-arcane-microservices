-- Seed inicial para Pictorial Arcane.
-- Se ejecuta al levantar el backend y deja una base consistente para desarrollo/pruebas.
-- Credenciales de prueba:
--   * Password de todos los usuarios: password
--   * Security code de todos los clientes: 123456

TRUNCATE TABLE
    payments,
    sale,
    memberships,
    client_answer,
    painting,
    sculpture,
    photography,
    ceramic,
    goldsmith,
    artwork,
    artist_genre,
    questions,
    clients,
    users,
    artist,
    genre
RESTART IDENTITY CASCADE;

INSERT INTO genre (id_genre, name, description, created_at, modified_at) VALUES
    (1, 'Pintura', 'Obras pictoricas sobre lienzo, papel y superficies mixtas.', TIMESTAMP '2026-03-11 08:00:00', TIMESTAMP '2026-03-11 08:00:00'),
    (2, 'Escultura', 'Piezas tridimensionales talladas, modeladas o ensambladas.', TIMESTAMP '2026-03-11 08:01:00', TIMESTAMP '2026-03-11 08:01:00'),
    (3, 'Fotografia', 'Capturas fotograficas impresas o montadas para exhibicion.', TIMESTAMP '2026-03-11 08:02:00', TIMESTAMP '2026-03-11 08:02:00'),
    (4, 'Ceramica', 'Obras moldeadas en barro o arcilla con acabado artesanal.', TIMESTAMP '2026-03-11 08:03:00', TIMESTAMP '2026-03-11 08:03:00'),
    (5, 'Orfebreria', 'Piezas artisticas trabajadas en metales y piedras.', TIMESTAMP '2026-03-11 08:04:00', TIMESTAMP '2026-03-11 08:04:00');

INSERT INTO artist (id_artist, name, last_name, nationality, biography, commission_rate, birthdate, image_url, created_at, modified_at) VALUES
    (1, 'josue', 'azocar', 'VE', 'Artista emergente venezolano enfocado en retratos y naturaleza.', 0.05, DATE '2006-06-05', NULL, TIMESTAMP '2026-03-11 08:10:00', TIMESTAMP '2026-03-11 08:10:00'),
    (2, 'Ester', 'Colera', 'VE', 'Estudiante de Unearte, premiada por sus obras al oleo desde temprana edad.', 0.10, DATE '2005-09-01', NULL, TIMESTAMP '2026-03-11 08:11:00', TIMESTAMP '2026-03-11 08:11:00'),
    (3, 'carlos', 'rojas', 'ES', 'Escultor y ceramista con piezas de estudio contemporaneo.', 0.08, DATE '1996-04-12', NULL, TIMESTAMP '2026-03-11 08:12:00', TIMESTAMP '2026-03-11 08:12:00'),
    (4, 'Leonor', 'Perez', 'CO', 'Fotografa documental dedicada a paisajes urbanos y memoria visual.', 0.07, DATE '1990-02-14', NULL, TIMESTAMP '2026-03-11 08:13:00', TIMESTAMP '2026-03-11 08:13:00'),
    (5, 'Diego', 'Salcedo', 'AR', 'Escultor de piezas en piedra y madera de pequeno formato.', 0.09, DATE '1988-09-23', NULL, TIMESTAMP '2026-03-11 08:14:00', TIMESTAMP '2026-03-11 08:14:00'),
    (6, 'Andrea', 'Ruiz', 'VE', 'Pintora de bodegones y escenas costumbristas con colores calidos.', 0.06, DATE '1994-07-10', NULL, TIMESTAMP '2026-03-11 08:15:00', TIMESTAMP '2026-03-11 08:15:00'),
    (7, 'Mateo', 'Blanco', 'CL', 'Ceramista centrado en vasijas y piezas utilitarias decorativas.', 0.07, DATE '1992-12-19', NULL, TIMESTAMP '2026-03-11 08:16:00', TIMESTAMP '2026-03-11 08:16:00'),
    (8, 'Yailin', 'la mas viral', 'DO', 'Ilustradora digital y creadora de fan art colorido.', 0.05, DATE '2000-01-01', 'https://storagepictorial.blob.core.windows.net/pictorialpictures/0551589b-1079-4eed-8fd8-8f4d9a273b2c-E.png', TIMESTAMP '2026-03-11 08:17:00', TIMESTAMP '2026-03-11 08:17:00'),
    (9, 'Valentina', 'Suarez', 'UY', 'Fotografa de naturaleza especializada en aves y luz tropical.', 0.05, DATE '1997-05-05', NULL, TIMESTAMP '2026-03-11 08:18:00', TIMESTAMP '2026-03-11 08:18:00'),
    (10, 'Trasnocho', 'Proyecto', 'VE', 'Colectivo creativo enfocado en propuestas urbanas y experimentales.', 0.05, DATE '2003-11-21', 'https://storagepictorial.blob.core.windows.net/pictorialpictures/d3541f5c-f880-4187-a23c-835e10f784a9-7147ffe22cf3bff5a2388b98ba96b6a6.jpg', TIMESTAMP '2026-03-11 08:19:00', TIMESTAMP '2026-03-11 08:19:00'),
    (11, 'Rafael', 'Mendez', 'MX', 'Orfebre de piezas minimalistas en plata y bronce.', 0.06, DATE '1987-03-30', NULL, TIMESTAMP '2026-03-11 08:20:00', TIMESTAMP '2026-03-11 08:20:00'),
    (12, 'Elisa', 'Montoya', 'PE', 'Ceramista contemporanea con interes en formas botanicas.', 0.07, DATE '1991-01-18', NULL, TIMESTAMP '2026-03-11 08:21:00', TIMESTAMP '2026-03-11 08:21:00'),
    (13, 'Kim', 'Jungkook', 'KR', 'Artista pop con piezas visuales inspiradas en musica y cultura digital.', 0.05, DATE '1998-08-23', 'https://storagepictorial.blob.core.windows.net/pictorialpictures/20782c54-8dc5-45e5-8353-9f81a5a7b292-Screenshot%202026-03-11%20at%2012-36-46%20wojak%20-%20Buscar%20con%20Google.png', TIMESTAMP '2026-03-11 08:22:00', TIMESTAMP '2026-03-11 08:22:00'),
    (14, 'Maria Corina', 'Machado mcm', 'VE', 'Coleccion de obras simbolicas y piezas figurativas de fuerte identidad.', 0.05, DATE '1980-02-21', 'https://storagepictorial.blob.core.windows.net/pictorialpictures/ad63868b-e04e-4c6a-bb5a-01fd99a797ae-mcm.png', TIMESTAMP '2026-03-11 08:23:00', TIMESTAMP '2026-03-11 08:23:00');

INSERT INTO users (dni, email, password, first_name, last_name, date_of_birth, gender, role, created_at, modified_at) VALUES
    (9000001, 'admin1@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Ana', 'Herrera', DATE '1988-04-16', 'FEMALE', 'ADMIN', TIMESTAMP '2026-03-10 09:00:00', TIMESTAMP '2026-03-10 09:00:00'),
    (9000002, 'admin2@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Luis', 'Rivas', DATE '1985-11-03', 'MALE', 'ADMIN', TIMESTAMP '2026-03-10 09:01:00', TIMESTAMP '2026-03-10 09:01:00'),
    (9000003, 'admin3@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Carmen', 'Silva', DATE '1990-06-28', 'FEMALE', 'ADMIN', TIMESTAMP '2026-03-10 09:02:00', TIMESTAMP '2026-03-10 09:02:00'),
    (2000001, 'maria.gomez@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Maria', 'Gomez', DATE '1995-03-08', 'FEMALE', 'CLIENT', TIMESTAMP '2026-03-10 09:10:00', TIMESTAMP '2026-03-10 09:10:00'),
    (2000002, 'pedro.lopez@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Pedro', 'Lopez', DATE '1993-07-12', 'MALE', 'CLIENT', TIMESTAMP '2026-03-10 09:11:00', TIMESTAMP '2026-03-10 09:11:00'),
    (2000003, 'lucia.mendez@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Lucia', 'Mendez', DATE '1998-01-21', 'FEMALE', 'CLIENT', TIMESTAMP '2026-03-10 09:12:00', TIMESTAMP '2026-03-10 09:12:00'),
    (2000004, 'andres.vega@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Andres', 'Vega', DATE '1991-09-30', 'MALE', 'CLIENT', TIMESTAMP '2026-03-10 09:13:00', TIMESTAMP '2026-03-10 09:13:00'),
    (2000005, 'sofia.navas@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Sofia', 'Navas', DATE '1997-12-17', 'FEMALE', 'CLIENT', TIMESTAMP '2026-03-10 09:14:00', TIMESTAMP '2026-03-10 09:14:00'),
    (2000006, 'diego.perez@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Diego', 'Perez', DATE '1989-08-05', 'MALE', 'CLIENT', TIMESTAMP '2026-03-10 09:15:00', TIMESTAMP '2026-03-10 09:15:00'),
    (2000007, 'camila.ramos@pictorial.local', '$2a$10$wW5FIrth1ETZl/XoONee5O7BrsF8/aMOkVzyMGjnB/fpHtT8bpw6a', 'Camila', 'Ramos', DATE '1996-05-27', 'OTHER', 'CLIENT', TIMESTAMP '2026-03-10 09:16:00', TIMESTAMP '2026-03-10 09:16:00');

INSERT INTO clients (dni, credit_card_number, security_code, postal_code, created_at, modified_at) VALUES
    (2000001, 4111111111111111, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1010, TIMESTAMP '2026-03-10 10:00:00', TIMESTAMP '2026-03-10 10:00:00'),
    (2000002, 5555444433331111, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1020, TIMESTAMP '2026-03-10 10:01:00', TIMESTAMP '2026-03-10 10:01:00'),
    (2000003, 4012888888881881, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1030, TIMESTAMP '2026-03-10 10:02:00', TIMESTAMP '2026-03-10 10:02:00'),
    (2000004, 4222222222222222, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1040, TIMESTAMP '2026-03-10 10:03:00', TIMESTAMP '2026-03-10 10:03:00'),
    (2000005, 378282246310005, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1050, TIMESTAMP '2026-03-10 10:04:00', TIMESTAMP '2026-03-10 10:04:00'),
    (2000006, 6011111111111117, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1060, TIMESTAMP '2026-03-10 10:05:00', TIMESTAMP '2026-03-10 10:05:00'),
    (2000007, 3530111333300000, '$2a$10$pIijSCUIXDoCzmDX9bC.yuVO4tC3q6UGHsQddp9aD.BFnX9MXUuqG', 1070, TIMESTAMP '2026-03-10 10:06:00', TIMESTAMP '2026-03-10 10:06:00');

INSERT INTO questions (id_question, wording, created_at, modified_at) VALUES
    (1, 'Ciudad favorita', TIMESTAMP '2026-03-10 10:10:00', TIMESTAMP '2026-03-10 10:10:00'),
    (2, 'Nombre de tu mascota', TIMESTAMP '2026-03-10 10:11:00', TIMESTAMP '2026-03-10 10:11:00'),
    (3, 'Color favorito', TIMESTAMP '2026-03-10 10:12:00', TIMESTAMP '2026-03-10 10:12:00'),
    (4, 'Universidad favorita', TIMESTAMP '2026-03-10 10:13:00', TIMESTAMP '2026-03-10 10:13:00'),
    (5, 'Metal precioso favorito', TIMESTAMP '2026-03-10 10:14:00', TIMESTAMP '2026-03-10 10:14:00'),
    (6, 'Pais que mas recuerdas', TIMESTAMP '2026-03-10 10:15:00', TIMESTAMP '2026-03-10 10:15:00'),
    (7, 'Cancion que te inspira', TIMESTAMP '2026-03-10 10:16:00', TIMESTAMP '2026-03-10 10:16:00'),
    (8, 'Plato preferido', TIMESTAMP '2026-03-10 10:17:00', TIMESTAMP '2026-03-10 10:17:00'),
    (9, 'Libro favorito', TIMESTAMP '2026-03-10 10:18:00', TIMESTAMP '2026-03-10 10:18:00'),
    (10, 'Primer maestro de arte', TIMESTAMP '2026-03-10 10:19:00', TIMESTAMP '2026-03-10 10:19:00');

INSERT INTO memberships (id_membership, dni_client, amount_paid, payment_date, expiry_date, status, created_at, modified_at) VALUES
    (1, 2000001, 10.0, DATE '2026-01-15', DATE '2027-01-15', 'ACTIVE', TIMESTAMP '2026-01-15 09:00:00', TIMESTAMP '2026-01-15 09:00:00'),
    (2, 2000002, 10.0, DATE '2026-02-01', DATE '2027-02-01', 'ACTIVE', TIMESTAMP '2026-02-01 09:00:00', TIMESTAMP '2026-02-01 09:00:00'),
    (3, 2000003, 10.0, DATE '2025-12-20', DATE '2026-12-20', 'ACTIVE', TIMESTAMP '2025-12-20 09:00:00', TIMESTAMP '2025-12-20 09:00:00'),
    (4, 2000004, 10.0, DATE '2024-02-10', DATE '2025-02-10', 'EXPIRED', TIMESTAMP '2024-02-10 09:00:00', TIMESTAMP '2025-02-10 09:00:00'),
    (5, 2000005, 10.0, DATE '2026-03-01', DATE '2027-03-01', 'ACTIVE', TIMESTAMP '2026-03-01 09:00:00', TIMESTAMP '2026-03-01 09:00:00'),
    (6, 2000006, 10.0, DATE '2025-06-15', DATE '2026-06-15', 'CANCELLED', TIMESTAMP '2025-06-15 09:00:00', TIMESTAMP '2026-01-10 09:00:00'),
    (7, 2000007, 10.0, DATE '2024-05-20', DATE '2025-05-20', 'EXPIRED', TIMESTAMP '2024-05-20 09:00:00', TIMESTAMP '2025-05-20 09:00:00');

INSERT INTO artist_genre (id_artist, id_genre) VALUES
    (1, 1), (1, 2), (1, 4),
    (2, 1), (2, 3), (2, 4),
    (3, 1), (3, 2),
    (4, 3),
    (5, 2),
    (6, 1),
    (7, 4),
    (8, 1),
    (9, 3),
    (10, 2),
    (11, 5),
    (12, 4),
    (13, 1), (13, 5),
    (14, 2), (14, 3);

INSERT INTO artwork (id_artwork, name, status, price, id_artist, id_genre, image_url, created_at, modified_at) VALUES
    (1, 'El grito', 'RESERVED', 500.0, 2, 1, NULL, TIMESTAMP '2026-03-01 08:00:00', TIMESTAMP '2026-03-10 15:00:00'),
    (2, 'el columpio', 'AVAILABLE', 500.0, 2, 1, NULL, TIMESTAMP '2026-03-01 08:01:00', TIMESTAMP '2026-03-01 08:01:00'),
    (3, 'La mona lisa', 'AVAILABLE', 1000.0, 1, 1, NULL, TIMESTAMP '2026-03-01 08:02:00', TIMESTAMP '2026-03-01 08:02:00'),
    (4, 'la piedra', 'AVAILABLE', 2.0, 1, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/b380ccc3-306e-497d-9fb5-fcb4dd35bfac-ines.jpg', TIMESTAMP '2026-03-01 08:03:00', TIMESTAMP '2026-03-01 08:03:00'),
    (5, 'mujer pinta', 'RESERVED', 499.0, 2, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/1139ad3d-b97a-4bfe-99a7-9341b1d0c918-about-img.jpg', TIMESTAMP '2026-03-01 08:04:00', TIMESTAMP '2026-03-10 15:01:00'),
    (6, 'mona tiesa jajajaj', 'AVAILABLE', 44.0, 3, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/2be8a50e-873f-4f81-9837-6ae2794513df-monatiesa.jpg', TIMESTAMP '2026-03-01 08:05:00', TIMESTAMP '2026-03-01 08:05:00'),
    (9, 'La copa', 'RESERVED', 50.0, 2, 3, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/b311e8e8-e649-4583-a11d-c39296ecdefa-copa.jpg', TIMESTAMP '2026-03-01 08:06:00', TIMESTAMP '2026-03-10 15:02:00'),
    (10, 'Manzanas Marrones', 'AVAILABLE', 30.0, 1, 4, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/466f8258-1445-4c93-a57b-0f8dfe8cf6f6-manzana.jpg', TIMESTAMP '2026-03-01 08:07:00', TIMESTAMP '2026-03-01 08:07:00'),
    (11, 'Vasija Flor', 'AVAILABLE', 120.0, 2, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/895a074d-67e4-4b1c-aac8-9dc25bdac43e-vasijaflor.jpg', TIMESTAMP '2026-03-01 08:08:00', TIMESTAMP '2026-03-01 08:08:00'),
    (12, 'Pareja', 'AVAILABLE', 5000.0, 3, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/22e6a178-2723-4764-b882-8044960a32a6-pareja.jpg', TIMESTAMP '2026-03-01 08:09:00', TIMESTAMP '2026-03-01 08:09:00'),
    (13, 'Bolsa', 'AVAILABLE', 200.0, 3, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/3fc0442b-ccda-46da-af27-2186e2d6dbca-bolsaamarilla.jpg', TIMESTAMP '2026-03-01 08:10:00', TIMESTAMP '2026-03-01 08:10:00'),
    (16, 'mona lisa', 'AVAILABLE', 11.0, 1, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/a1d86ecd-816e-4ac9-a627-97b36e6ddb08-pandemia.jpg', TIMESTAMP '2026-03-01 08:11:00', TIMESTAMP '2026-03-01 08:11:00'),
    (18, 'la playa', 'AVAILABLE', 5.0, 2, 3, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/68041603-6999-496a-9e0e-65aaf3750bd4-playa.jpg', TIMESTAMP '2026-03-01 08:12:00', TIMESTAMP '2026-03-01 08:12:00'),
    (19, 'caras rojas', 'AVAILABLE', 300.0, 1, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/19c16e43-543c-41a0-8194-3e3fcbfa8224-pexels-mikebirdy-189449.jpg', TIMESTAMP '2026-03-01 08:13:00', TIMESTAMP '2026-03-01 08:13:00'),
    (20, 'dragon', 'AVAILABLE', 333.0, 2, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/1c089917-e5ff-4fe2-b4d1-96dca53c4e3f-pexels-pixabay-208326.jpg', TIMESTAMP '2026-03-01 08:14:00', TIMESTAMP '2026-03-01 08:14:00'),
    (21, 'cuerpo mujer', 'AVAILABLE', 44.0, 1, 4, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/a7af2178-1153-4b1e-8b66-da79b11cb3cc-cuerpomujer2.jpg', TIMESTAMP '2026-03-01 08:15:00', TIMESTAMP '2026-03-01 08:15:00'),
    (23, 'ojo', 'SOLD', 99.0, 2, 1, NULL, TIMESTAMP '2026-02-18 08:16:00', TIMESTAMP '2026-02-18 12:00:00'),
    (27, 'abstractoaaaa', 'AVAILABLE', 55.0, 10, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/dbd7077d-c107-4695-bfd5-cf96344d6933-pexels-holman-2269667.jpg', TIMESTAMP '2026-03-01 08:17:00', TIMESTAMP '2026-03-01 08:17:00'),
    (28, 'sylveon', 'AVAILABLE', 50.0, 8, 1, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/6e74a88b-989c-462c-93bd-6e794dc73cc1-700.png', TIMESTAMP '2026-03-01 08:18:00', TIMESTAMP '2026-03-01 08:18:00'),
    (30, 'Loro', 'AVAILABLE', 10.0, 14, 3, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/e7296f26-fbdd-483a-a8ba-bfc1ac3ac231-loro.jpg', TIMESTAMP '2026-03-01 08:19:00', TIMESTAMP '2026-03-01 08:19:00'),
    (31, 'Therian', 'AVAILABLE', 50.0, 14, 2, 'https://storagepictorial.blob.core.windows.net/pictorialpictures/99b94fc5-c6b2-41d1-abcf-8ce3fd5ff5f1-therian.jpg', TIMESTAMP '2026-03-01 08:20:00', TIMESTAMP '2026-03-01 08:20:00'),
    (32, 'Collar Solar', 'AVAILABLE', 240.0, 13, 5, NULL, TIMESTAMP '2026-03-01 08:21:00', TIMESTAMP '2026-03-01 08:21:00'),
    (33, 'Anillo Aurora', 'AVAILABLE', 180.0, 11, 5, NULL, TIMESTAMP '2026-03-01 08:22:00', TIMESTAMP '2026-03-01 08:22:00'),
    (35, 'Joya del Alba', 'SOLD', 320.0, 13, 5, NULL, TIMESTAMP '2026-03-02 08:23:00', TIMESTAMP '2026-03-08 18:30:00');

INSERT INTO painting (id_artwork, technique, holder, style, framed, width, height) VALUES
    (1, 'Oleo', 'Madera', 'Expresivo', 'YES', 90.0, 120.0),
    (2, 'Acrilico', 'Madera', 'Clasico', 'YES', 85.0, 100.0),
    (3, 'Oleo', 'Madera', 'Renacentista', 'YES', 77.0, 110.0),
    (5, 'Oleo', 'Metal', 'Figurativo', 'YES', 80.0, 100.0),
    (6, 'Acrilico', 'Madera', 'Pop', 'NO', 45.0, 60.0),
    (10, 'Acrilico', 'Madera', 'Bodegon', 'YES', 40.0, 50.0),
    (16, 'Mixta', 'Madera', 'Contempo', 'NO', 35.0, 45.0),
    (19, 'Acrilico', 'Lienzo', 'Abstracto', 'YES', 70.0, 70.0),
    (27, 'Digital', 'Metal', 'Abstracto', 'NO', 50.0, 50.0),
    (28, 'Digital', 'Madera', 'Anime', 'NO', 42.0, 42.0),
    (31, 'Mixta', 'Madera', 'Conceptual', 'YES', 48.0, 65.0);

INSERT INTO sculpture (id_artwork, material, weight, length, width, depth) VALUES
    (4, 'Piedra caliza', 8.5, 30.0, 18.0, 14.0),
    (12, 'Bronce', 42.0, 110.0, 45.0, 38.0),
    (20, 'Resina', 12.0, 55.0, 25.0, 22.0),
    (21, 'Yeso', 7.8, 40.0, 20.0, 18.0);

INSERT INTO photography (id_artwork, print_type, resolution, color, serial_number, camera) VALUES
    (9, 'Giclee', '4K', 'Color', 'PH-0009', 'Canon'),
    (18, 'Mate', '4K', 'Color', 'PH-0018', 'Nikon'),
    (23, 'Glossy', '6K', 'Color', 'PH-0023', 'Sony'),
    (30, 'Mate', '4K', 'Color', 'PH-0030', 'Canon');

INSERT INTO ceramic (id_artwork, material_type, technique, finish, cooking_temperature, weight, width, height) VALUES
    (11, 'Arcilla', 'Torno', 'Esmaltado', 980.0, 2.4, 18.0, 25.0),
    (13, 'Gres', 'Manual', 'Mate', 1020.0, 1.8, 22.0, 20.0);

INSERT INTO goldsmith (id_artwork, material, precious_stones, weight) VALUES
    (32, 'Plata', 'Cuarzo', 0.35),
    (33, 'Bronce', 'Ninguna', 0.22),
    (35, 'Oro', 'Ambar', 0.48);

INSERT INTO sale (id_sale, id_artwork, dni_client, dni_admin, sale_date, description, sale_price, profit_percentage, profit_amount, tax_amount, total_paid, shipping_address, shipping_status, sale_status, created_at, modified_at) VALUES
    (1, 1, 2000001, NULL, DATE '2026-03-10', 'Reserva web en espera de validacion administrativa.', 500.0, 0.10, 50.0, 80.0, 580.0, 'Av. Libertador, Caracas', 'PENDING', 'PENDING', TIMESTAMP '2026-03-10 14:00:00', TIMESTAMP '2026-03-10 14:00:00'),
    (2, 5, 2000002, NULL, DATE '2026-03-10', 'Reserva realizada desde el portal del cliente.', 499.0, 0.10, 49.9, 79.84, 578.84, 'Calle 72, Maracaibo', 'PENDING', 'PENDING', TIMESTAMP '2026-03-10 14:15:00', TIMESTAMP '2026-03-10 14:15:00'),
    (3, 9, 2000003, NULL, DATE '2026-03-11', 'Reserva confirmada por cliente con membresia activa.', 50.0, 0.10, 5.0, 8.0, 58.0, 'Av. Principal, Valencia', 'PENDING', 'PENDING', TIMESTAMP '2026-03-11 09:30:00', TIMESTAMP '2026-03-11 09:30:00'),
    (4, 23, 2000004, 9000001, DATE '2026-02-18', 'Compra aprobada y pagada en taquilla.', 99.0, 0.10, 9.9, 15.84, 114.84, 'Residencias Sol, Barquisimeto', 'SHIPPED', 'APPROVED', TIMESTAMP '2026-02-18 11:00:00', TIMESTAMP '2026-02-19 08:00:00'),
    (5, 2, 2000005, 9000002, DATE '2026-02-25', 'Reserva cancelada por datos de envio incompletos.', 500.0, 0.10, 50.0, 80.0, 580.0, 'Urb. La Arboleda, Maracay', 'CANCELED', 'CANCELED', TIMESTAMP '2026-02-25 10:00:00', TIMESTAMP '2026-02-25 16:00:00'),
    (6, 4, 2000006, 9000002, DATE '2026-02-26', 'Reserva cancelada por desistimiento del cliente.', 2.0, 0.05, 0.1, 0.32, 2.32, 'Sector Centro, Cumana', 'CANCELED', 'CANCELED', TIMESTAMP '2026-02-26 10:00:00', TIMESTAMP '2026-02-26 13:30:00'),
    (7, 19, 2000007, 9000003, DATE '2026-02-27', 'Reserva revertida tras no completar el pago.', 300.0, 0.05, 15.0, 48.0, 348.0, 'Av. Fuerzas Armadas, Caracas', 'CANCELED', 'CANCELED', TIMESTAMP '2026-02-27 11:00:00', TIMESTAMP '2026-02-27 18:10:00'),
    (8, 35, 2000005, 9000001, DATE '2026-03-08', 'Venta aprobada y pendiente de despacho.', 320.0, 0.05, 16.0, 51.2, 371.2, 'Residencias Vista Real, Lecheria', 'PENDING', 'APPROVED', TIMESTAMP '2026-03-08 12:00:00', TIMESTAMP '2026-03-08 18:30:00');

INSERT INTO payments (id_sale, amount, payment_date, bank_name, reference, created_at, modified_at) VALUES
    (4, 114.84, DATE '2026-02-18', 'Banco de Venezuela', 'PAGO-2026-0004', TIMESTAMP '2026-02-18 11:30:00', TIMESTAMP '2026-02-18 11:30:00'),
    (8, 371.2, DATE '2026-03-08', 'Banesco', 'PAGO-2026-0008', TIMESTAMP '2026-03-08 18:35:00', TIMESTAMP '2026-03-08 18:35:00');

INSERT INTO client_answer (id_client_answer, dni, question_id, answer, created_at, modified_at) VALUES
    (1, 2000001, 1, '$2a$10$p4aDKdXzKwCQ/.oVEKR8D.dWRmmO1P5UuE/2UCfE77kFWRinhHpn6', TIMESTAMP '2026-03-10 11:00:00', TIMESTAMP '2026-03-10 11:00:00'),
    (2, 2000001, 2, '$2a$10$v3WOTyZ22evK0JzSYqYxcebinkIgfgyGGAl/YqiCg7mhqw9yqN/Nm', TIMESTAMP '2026-03-10 11:01:00', TIMESTAMP '2026-03-10 11:01:00'),
    (3, 2000002, 3, '$2a$10$/EAmOqmec493HmY4g2.gl.gZSPI2LQBbCWJCy108dvcfOoJPEp8.2', TIMESTAMP '2026-03-10 11:02:00', TIMESTAMP '2026-03-10 11:02:00'),
    (4, 2000002, 4, '$2a$10$gjFc91DwTcdgPV/gQkF2tuoKAvRsmJnJeghLEfQX.qW37GPcNg60i', TIMESTAMP '2026-03-10 11:03:00', TIMESTAMP '2026-03-10 11:03:00'),
    (5, 2000003, 5, '$2a$10$2pXPbJtlxFH/UqE68bANhegTwFmhfVg13HEwXvDLmgbmuSHa9/DBW', TIMESTAMP '2026-03-10 11:04:00', TIMESTAMP '2026-03-10 11:04:00'),
    (6, 2000003, 1, '$2a$10$p4aDKdXzKwCQ/.oVEKR8D.dWRmmO1P5UuE/2UCfE77kFWRinhHpn6', TIMESTAMP '2026-03-10 11:05:00', TIMESTAMP '2026-03-10 11:05:00'),
    (7, 2000004, 6, '$2a$10$GWoc7vhmivZxD8ufjAPueOzlA9vbCJgIQdcY.JszG6R0krOvT4N9e', TIMESTAMP '2026-03-10 11:06:00', TIMESTAMP '2026-03-10 11:06:00'),
    (8, 2000004, 3, '$2a$10$/EAmOqmec493HmY4g2.gl.gZSPI2LQBbCWJCy108dvcfOoJPEp8.2', TIMESTAMP '2026-03-10 11:07:00', TIMESTAMP '2026-03-10 11:07:00'),
    (9, 2000005, 4, '$2a$10$gjFc91DwTcdgPV/gQkF2tuoKAvRsmJnJeghLEfQX.qW37GPcNg60i', TIMESTAMP '2026-03-10 11:08:00', TIMESTAMP '2026-03-10 11:08:00'),
    (10, 2000005, 2, '$2a$10$v3WOTyZ22evK0JzSYqYxcebinkIgfgyGGAl/YqiCg7mhqw9yqN/Nm', TIMESTAMP '2026-03-10 11:09:00', TIMESTAMP '2026-03-10 11:09:00');

SELECT setval(pg_get_serial_sequence('genre', 'id_genre'), COALESCE((SELECT MAX(id_genre) FROM genre), 1), true);
SELECT setval(pg_get_serial_sequence('artist', 'id_artist'), COALESCE((SELECT MAX(id_artist) FROM artist), 1), true);
SELECT setval(pg_get_serial_sequence('artwork', 'id_artwork'), COALESCE((SELECT MAX(id_artwork) FROM artwork), 1), true);
SELECT setval(pg_get_serial_sequence('questions', 'id_question'), COALESCE((SELECT MAX(id_question) FROM questions), 1), true);
SELECT setval(pg_get_serial_sequence('memberships', 'id_membership'), COALESCE((SELECT MAX(id_membership) FROM memberships), 1), true);
SELECT setval(pg_get_serial_sequence('sale', 'id_sale'), COALESCE((SELECT MAX(id_sale) FROM sale), 1), true);
SELECT setval('client_answer_seq', COALESCE((SELECT MAX(id_client_answer) FROM client_answer), 1), true);

