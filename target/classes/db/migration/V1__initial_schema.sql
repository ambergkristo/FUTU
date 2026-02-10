CREATE TABLE room (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE slot_template (
  id BIGSERIAL PRIMARY KEY,
  weekday SMALLINT NOT NULL,         -- 1=E ... 7=P
  slot_index SMALLINT NOT NULL,       -- 1..4
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_cents INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE booking (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES room(id),
  booking_date DATE NOT NULL,
  slot_template_id BIGINT NOT NULL REFERENCES slot_template(id),
  status VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_phone VARCHAR(50),
  total_price_cents INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (room_id, booking_date, slot_template_id)
);

CREATE TABLE payment (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES booking(id),
  provider VARCHAR(50),
  provider_payment_id VARCHAR(100),
  status VARCHAR(20),
  amount_cents INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
