-- CreateTable
CREATE TABLE "User" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL,
    "session_data" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("session_id")
);
