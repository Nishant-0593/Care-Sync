-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'parent',
    "otp" VARCHAR(255),
    "otp_expires" TIMESTAMP(6),
    "contacts" JSONB DEFAULT '[]',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

