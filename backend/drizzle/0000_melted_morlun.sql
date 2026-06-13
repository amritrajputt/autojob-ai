CREATE TYPE "public"."application_status" AS ENUM('pending', 'applied', 'failed', 'skipped', 'manual_required');--> statement-breakpoint
CREATE TYPE "public"."apply_method" AS ENUM('email', 'form', 'apply_button', 'comment');--> statement-breakpoint
CREATE TYPE "public"."job_model" AS ENUM('full_time', 'internship');--> statement-breakpoint
CREATE TYPE "public"."job_source" AS ENUM('telegram', 'linkedin', 'naukri', 'internshala');--> statement-breakpoint
CREATE TYPE "public"."plan_offered" AS ENUM('free', 'starter', 'premium', 'elite');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'expired');--> statement-breakpoint
CREATE TYPE "public"."work_model" AS ENUM('onsite', 'remote', 'hybrid');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"resumeId" uuid NOT NULL,
	"jobId" uuid NOT NULL,
	"gmailAccountId" uuid,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"apply_method" "apply_method" NOT NULL,
	"match_score" integer NOT NULL,
	"email_subject" varchar(255),
	"email_body" text,
	"application_link" varchar(255),
	"failure_reason" text,
	"appliedDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gmail_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"is_active" boolean DEFAULT true,
	"email" varchar(255) NOT NULL,
	"daily_mail_limit" integer DEFAULT 25 NOT NULL,
	"used_mail_count" integer DEFAULT 0 NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"lastResetDate" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"groq_api_key" text,
	"linkedin_cookie" text,
	"linkedin_cookie_status" varchar(20) DEFAULT 'not_set',
	"naukri_cookie" text,
	"internshala_cookie" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "integrations_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "job_source" NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"job_description" text NOT NULL,
	"job_model" "job_model",
	"work_model" "work_model",
	"job_location" varchar(255),
	"parsed_skills" varchar(100)[],
	"apply_email" varchar(255),
	"apply_link" varchar(500),
	"apply_method" "apply_method",
	"source_url" varchar(500) NOT NULL,
	"scrapedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "job_source_url_unique" UNIQUE("source_url")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_type" "plan_offered" DEFAULT 'free' NOT NULL,
	"plan_status" "subscription_status" DEFAULT 'inactive' NOT NULL,
	"plan_price_in_paise" integer DEFAULT 0 NOT NULL,
	"plan_duration_days" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"resume_url" varchar(500) NOT NULL,
	"resume_file_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"uploadedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"planId" uuid,
	"plan_type" "plan_offered" DEFAULT 'free' NOT NULL,
	"plan_status" "subscription_status" DEFAULT 'active' NOT NULL,
	"trialStartTime" timestamp DEFAULT now(),
	"trialEndTime" timestamp,
	"trial_emails_used" integer DEFAULT 0 NOT NULL,
	"razorpay_order_id" varchar(255),
	"razorpay_subscription_id" varchar(255),
	"razorpay_payment_id" varchar(255),
	"currentSubscriptionStartDate" timestamp,
	"currentSubscriptionEndDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "subscription_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "telegram_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"channel_name" varchar(255) NOT NULL,
	"telegram_username" varchar(255) NOT NULL,
	"rss_url" varchar(255) NOT NULL,
	"rss_hash" varchar(255),
	"lastFetchedAt" timestamp,
	"is_active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"preferred_location" varchar(100)[] NOT NULL,
	"qualifications" varchar(100)[] NOT NULL,
	"skills" varchar(100)[] NOT NULL,
	"preferred_domain" varchar(100)[] NOT NULL,
	"preferred_job_type" "job_model"[] NOT NULL,
	"preferred_work_model" "work_model"[] NOT NULL,
	"min_experience" integer DEFAULT 0 NOT NULL,
	"max_experience" integer DEFAULT 0 NOT NULL,
	"min_salary" integer DEFAULT 0 NOT NULL,
	"max_salary" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(200) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"refresh_token_hash" varchar(255),
	"reset_password_token" varchar(255),
	"resetPasswordExpires" timestamp,
	"current_plan" "plan_offered" DEFAULT 'free' NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resumeId_resume_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_job_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_gmailAccountId_gmail_accounts_id_fk" FOREIGN KEY ("gmailAccountId") REFERENCES "public"."gmail_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gmail_accounts" ADD CONSTRAINT "gmail_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_accounts" ADD CONSTRAINT "telegram_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_job_unique" ON "applications" USING btree ("userId","jobId");--> statement-breakpoint
CREATE INDEX "idx_applications_user" ON "applications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_applications_job" ON "applications" USING btree ("jobId");--> statement-breakpoint
CREATE INDEX "idx_gmail_user" ON "gmail_accounts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_resume_user" ON "resume" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_telegram_user" ON "telegram_accounts" USING btree ("userId");