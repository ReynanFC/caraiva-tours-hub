DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
            CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'EMPLOYEE');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
            CREATE TYPE booking_status_enum AS ENUM ('PENDING_RECEIPT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status_enum') THEN
            CREATE TYPE refund_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commission_type_enum') THEN
            CREATE TYPE commission_type_enum AS ENUM ('PERCENTAGE', 'FIXED');
        END IF;
    END $$;

CREATE TABLE category_tour (
     category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE pickup_location (
     pickup_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     cep VARCHAR(9),
     location_name VARCHAR(150) NOT NULL,
     reference_point VARCHAR(255),
     applied_pickup_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE permission (
     permission_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     role user_role_enum NOT NULL
);

CREATE TABLE users (
     user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     external_user_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
     user_name VARCHAR(50) NOT NULL,
     full_name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     pix_key VARCHAR(255),
     password VARCHAR(255) NOT NULL,
     enabled BOOLEAN DEFAULT TRUE NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE client (
     client_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     phone VARCHAR(20) NOT NULL UNIQUE,
     email VARCHAR(100) UNIQUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tour (
     tour_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     name VARCHAR(150) UNIQUE NOT NULL,
     description TEXT,
     base_price_per_person NUMERIC(10,2) CHECK(base_price_per_person > 0) NOT NULL,
     promo_price_per_person NUMERIC(10,2) CHECK(promo_price_per_person >= 0),
     commission_type commission_type_enum DEFAULT 'PERCENTAGE' NOT NULL,
     commission_value NUMERIC(10,2) NOT NULL CHECK(commission_value > 0),
     duration INTERVAL NOT NULL,
     available BOOLEAN DEFAULT TRUE NOT NULL,
     image_url VARCHAR(255),
     is_combo BOOLEAN DEFAULT FALSE NOT NULL,
     is_promotional BOOLEAN DEFAULT FALSE NOT NULL,
     category_id BIGINT NOT NULL,
      CONSTRAINT chk_tour_prices
          CHECK (promo_price_per_person IS NULL OR promo_price_per_person < base_price_per_person)
);

CREATE TABLE payment (
     payment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     amount_paid NUMERIC(10,2) NOT NULL,
     external_receipt_url VARCHAR(255) NOT NULL,
     paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE booking (
     booking_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     custom_schedule TIMESTAMP NOT NULL,
     manual_discount NUMERIC(10,2) DEFAULT 0.00 CHECK(manual_discount <= total_price_snapshot),
     total_price_snapshot NUMERIC(10,2) NOT NULL CHECK(total_price_snapshot > 0),
     unit_price_snapshot NUMERIC(10,2) NOT NULL CHECK(unit_price_snapshot > 0),
     commission_snapshot NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK(commission_snapshot >= 0),
     current_status booking_status_enum NOT NULL DEFAULT 'PENDING_RECEIPT',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
     tour_id BIGINT NOT NULL,
     client_id BIGINT NOT NULL,
     user_id BIGINT NOT NULL,
     pickup_id BIGINT NOT NULL,
     payment_id BIGINT
);

CREATE TABLE group_member (
     group_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     is_lap_child BOOLEAN DEFAULT FALSE NOT NULL,
     booking_id BIGINT NOT NULL
);

CREATE TABLE refund_request (
     refund_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     reason VARCHAR(255) NOT NULL,
     refund_status refund_status_enum NOT NULL DEFAULT 'PENDING',
     requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
     resolved_at TIMESTAMP,
     booking_id BIGINT NOT NULL,
     resolved_by_user_id BIGINT NOT NULL
);

CREATE TABLE status_history (
     status_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     previous_status booking_status_enum,
     new_status booking_status_enum NOT NULL,
     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
     booking_id BIGINT NOT NULL,
     user_id BIGINT NOT NULL
);

CREATE TABLE user_permission (
     permission_id BIGINT NOT NULL,
     user_id BIGINT NOT NULL,
     PRIMARY KEY (permission_id, user_id)
);

ALTER TABLE user_permission ADD CONSTRAINT fk_user_permission_permission FOREIGN KEY (permission_id) REFERENCES permission (permission_id) ON DELETE CASCADE;
ALTER TABLE user_permission ADD CONSTRAINT fk_user_permission_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;
ALTER TABLE tour ADD CONSTRAINT fk_tour_category FOREIGN KEY (category_id) REFERENCES category_tour (category_id) ON DELETE RESTRICT;
ALTER TABLE booking ADD CONSTRAINT fk_booking_tour FOREIGN KEY (tour_id) REFERENCES tour (tour_id) ON DELETE RESTRICT;
ALTER TABLE booking ADD CONSTRAINT fk_booking_client FOREIGN KEY (client_id) REFERENCES client (client_id) ON DELETE RESTRICT;
ALTER TABLE booking ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT;
ALTER TABLE booking ADD CONSTRAINT fk_booking_pickup FOREIGN KEY (pickup_id) REFERENCES pickup_location (pickup_id) ON DELETE RESTRICT;
ALTER TABLE booking ADD CONSTRAINT fk_booking_payment FOREIGN KEY (payment_id) REFERENCES payment (payment_id) ON DELETE SET NULL;
ALTER TABLE group_member ADD CONSTRAINT fk_group_member_booking FOREIGN KEY (booking_id) REFERENCES booking (booking_id) ON DELETE CASCADE;
ALTER TABLE refund_request ADD CONSTRAINT fk_refund_booking FOREIGN KEY (booking_id) REFERENCES booking (booking_id) ON DELETE CASCADE;
ALTER TABLE refund_request ADD CONSTRAINT fk_refund_resolved_by_user FOREIGN KEY (resolved_by_user_id) REFERENCES users (user_id) ON DELETE RESTRICT;
ALTER TABLE status_history ADD CONSTRAINT fk_status_history_booking FOREIGN KEY (booking_id) REFERENCES booking (booking_id) ON DELETE CASCADE;
ALTER TABLE status_history ADD CONSTRAINT fk_status_history_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT;

CREATE INDEX idx_client_phone ON client(phone);
CREATE INDEX idx_booking_tour_id ON booking(tour_id);
CREATE INDEX idx_booking_client_id ON booking(client_id);
CREATE INDEX idx_booking_user_id ON booking(user_id);
CREATE INDEX idx_booking_pickup_id ON booking(pickup_id);
CREATE UNIQUE INDEX idx_booking_payment_id ON booking(payment_id);
CREATE INDEX idx_tour_category_id ON tour(category_id);
CREATE INDEX idx_group_member_booking_id ON group_member(booking_id);
CREATE INDEX idx_refund_request_booking_id ON refund_request(booking_id);
CREATE INDEX idx_refund_request_resolved_by_user_id ON refund_request(resolved_by_user_id);
CREATE INDEX idx_status_history_booking_id ON status_history(booking_id);
CREATE INDEX idx_status_history_user_id ON status_history(user_id);