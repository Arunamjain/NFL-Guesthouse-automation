CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "email" varchar UNIQUE NOT NULL,
  "employee_id" varchar UNIQUE,
  "full_name" varchar NOT NULL,
  "designation" varchar,
  "department" varchar,
  "category" varchar,
  "role" varchar,
  "phone" varchar,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "guest_houses" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "name" varchar UNIQUE NOT NULL,
  "address" text,
  "total_rooms" int,
  "amenities" text[],
  "description" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rooms" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "guest_house_id" uuid NOT NULL,
  "room_number" varchar NOT NULL,
  "room_type" varchar,
  "eligible_category" varchar,
  "floor" int,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bookings" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "employee_id" uuid NOT NULL,
  "guest_house_id" uuid NOT NULL,
  "room_id" uuid,
  "check_in_date" date NOT NULL,
  "check_out_date" date NOT NULL,
  "purpose_of_visit" text,
  "no_of_guests" int DEFAULT 1,
  "status" varchar,
  "hr_remarks" text,
  "approved_by" uuid,
  "approved_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "payments" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "booking_id" uuid UNIQUE NOT NULL,
  "amount" numeric NOT NULL,
  "utr_number" varchar,
  "payment_screenshot_url" text,
  "submitted_at" timestamp,
  "verified_at" timestamp,
  "verified_by" uuid,
  "status" varchar,
  "rejection_reason" text
);

CREATE TABLE "qr_passes" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "booking_id" uuid UNIQUE NOT NULL,
  "qr_code_data" text NOT NULL,
  "issued_at" timestamp DEFAULT (now()),
  "expires_at" timestamp,
  "is_used" boolean DEFAULT false,
  "scanned_at" timestamp
);

CREATE TABLE "notifications" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "booking_id" uuid,
  "type" varchar,
  "message" text,
  "is_read" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "feedback" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "booking_id" uuid UNIQUE NOT NULL,
  "employee_id" uuid NOT NULL,
  "rating" int,
  "comments" text,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "users"."category" IS 'A, B or C - determines room eligibility';

COMMENT ON COLUMN "users"."role" IS 'employee, hr, admin';

COMMENT ON COLUMN "guest_houses"."name" IS 'vasundra or dangoti';

COMMENT ON COLUMN "rooms"."room_type" IS 'single, double, suite';

COMMENT ON COLUMN "rooms"."eligible_category" IS 'A, B or C';

COMMENT ON COLUMN "bookings"."room_id" IS 'set after HR approval';

COMMENT ON COLUMN "bookings"."status" IS 'pending, approved, rejected, payment_pending, payment_submitted, payment_verified, checked_in, checked_out, cancelled';

COMMENT ON COLUMN "payments"."utr_number" IS 'bank transfer reference';

COMMENT ON COLUMN "payments"."status" IS 'pending, verified, rejected';

COMMENT ON COLUMN "notifications"."type" IS 'booking_submitted, booking_approved, booking_rejected, payment_verified, qr_issued, checkin_reminder';

COMMENT ON COLUMN "feedback"."rating" IS '1 to 5';

ALTER TABLE "rooms" ADD FOREIGN KEY ("guest_house_id") REFERENCES "guest_houses" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("employee_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("guest_house_id") REFERENCES "guest_houses" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("approved_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("id") REFERENCES "payments" ("booking_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "payments" ADD FOREIGN KEY ("verified_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("id") REFERENCES "qr_passes" ("booking_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "bookings" ADD FOREIGN KEY ("id") REFERENCES "feedback" ("booking_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "feedback" ADD FOREIGN KEY ("employee_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
