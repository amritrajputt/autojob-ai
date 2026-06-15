import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
    varchar,
    uniqueIndex,
    index,
} from 'drizzle-orm/pg-core';


// ENUMS


export const planOfferedEnum = pgEnum('plan_offered', ['free', 'starter', 'premium', 'elite']);

export const jobModelEnum = pgEnum('job_model', ['full_time', 'internship']);

export const workModelEnum = pgEnum('work_model', ['onsite', 'remote', 'hybrid']);

export const applicationStatusEnum = pgEnum('application_status',
    ['pending', 'applied', 'failed', 'skipped', 'manual_required']);

export const applyMethodEnum = pgEnum('apply_method',
    ['email', 'form', 'apply_button', 'comment']);

export const jobSourceEnum = pgEnum('job_source',
    ['telegram', 'linkedin', 'naukri', 'internshala']);

export const subscriptionStatusEnum = pgEnum('subscription_status',
    ['active', 'inactive', 'expired']);



// USERS

export const usersTable = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 200 }).notNull().unique(),
    currentPlan: planOfferedEnum('current_plan').default('free').notNull(),
    isActive: boolean('is_active').default(true),
    isDeleted: boolean('is_deleted').default(false),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});



// RESUMES (1:many, max 3 enforced in service layer)


export const resumeTable = pgTable('resume', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 100 }).notNull(),
    resumeUrl: varchar('resume_url', { length: 500 }).notNull(),
    resumeFileType: varchar('resume_file_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    uploadedAt: timestamp().defaultNow(),
}, (table) => ({
    userIdIdx: index('idx_resume_user').on(table.userId),
}));



// USER PREFERENCES (1:1)


export const userPreferencesTable = pgTable('user_preferences', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
    preferredLocation: varchar('preferred_location', { length: 100 }).array().notNull(),
    qualifications: varchar('qualifications', { length: 100 }).array().notNull(),
    skills: varchar('skills', { length: 100 }).array().notNull(),
    preferredDomain: varchar('preferred_domain', { length: 100 }).array().notNull(),
    preferredJobType: jobModelEnum('preferred_job_type').array().notNull(),
    preferredWorkModel: workModelEnum('preferred_work_model').array().notNull(),
    minExperience: integer('min_experience').notNull().default(0),
    maxExperience: integer('max_experience').notNull().default(0),
    minExpectedSalary: integer('min_salary').notNull().default(0),
    maxExpectedSalary: integer('max_salary').notNull().default(0),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});

export const scraperAccountsTable = pgTable('scraper_accounts', {
    id: uuid().primaryKey().defaultRandom(),
    platform: varchar('platform', { length: 50 }).notNull(), // 'linkedin' | 'naukri' | 'internshala'
    email: varchar('email', { length: 255 }).notNull(),
    cookie: text('cookie').notNull(), // Encrypted session cookie/string
    status: varchar('status', { length: 20 }).default('active'), // 'active' | 'rate_limited' | 'banned'
    lastUsedAt: timestamp('last_used_at'),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});

export const scrapingKeywordsTable = pgTable('scraping_keywords', {
    id: uuid().primaryKey().defaultRandom(),
    keyword: varchar('keyword', { length: 255 }).notNull(),   // e.g. "React Developer"
    location: varchar('location', { length: 255 }),           // e.g. "Bengaluru" or "Remote"
    isStatic: boolean('is_static').default(true),             // true = baseline, false = dynamically added from user preference
    isActive: boolean('is_active').default(true),             // can disable keywords without deleting them
    lastScrapedAt: timestamp('last_scraped_at'),
    createdAt: timestamp().defaultNow(),
});

// GMAIL ACCOUNTS (1:many, max 3 enforced in service layer)


export const gmailAccountsTable = pgTable('gmail_accounts', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').default(true),
    email: varchar('email', { length: 255 }).notNull(),
    dailyMailLimit: integer('daily_mail_limit').notNull().default(25),
    usedMailCount: integer('used_mail_count').notNull().default(0),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    lastResetDate: timestamp().defaultNow(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
}, (table) => ({
    userIdIdx: index('idx_gmail_user').on(table.userId),
}));



// TELEGRAM CHANNELS (1:many)


export const telegramAccountsTable = pgTable('telegram_accounts', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    channelName: varchar('channel_name', { length: 255 }).notNull(),
    telegramUsername: varchar('telegram_username', { length: 255 }).notNull(),
    rssUrl: varchar('rss_url', { length: 255 }).notNull(),
    rssHash: varchar('rss_hash', { length: 255 }),
    lastFetchedAt: timestamp(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
}, (table) => ({
    userIdIdx: index('idx_telegram_user').on(table.userId),
}));



// JOBS — Global/shared pool, NOT per-user


export const jobTable = pgTable('job', {
    id: uuid().primaryKey().defaultRandom(),
    jobSource: jobSourceEnum('source').notNull(),
    jobTitle: varchar('job_title', { length: 255 }).notNull(),
    jobCompany: varchar('company', { length: 255 }).notNull(),
    jobDescription: text('job_description').notNull(),
    jobType: jobModelEnum('job_model'),
    workModel: workModelEnum('work_model'),
    jobLocation: varchar('job_location', { length: 255 }),
    parsedSkills: varchar('parsed_skills', { length: 100 }).array(),
    applyEmail: varchar('apply_email', { length: 255 }),
    applyLink: varchar('apply_link', { length: 500 }),
    applyMethod: applyMethodEnum('apply_method'),
    sourceUrl: varchar('source_url', { length: 500 }).notNull().unique(),
    scrapedAt: timestamp().defaultNow(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});


// APPLICATIONS — links user + job + resume


export const applicationTable = pgTable('applications', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    resumeId: uuid().notNull().references(() => resumeTable.id, { onDelete: 'cascade' }),
    jobId: uuid().notNull().references(() => jobTable.id, { onDelete: 'cascade' }),
    gmailAccountId: uuid().references(() => gmailAccountsTable.id, { onDelete: 'set null' }),

    status: applicationStatusEnum('status').default('pending').notNull(),
    applyMethod: applyMethodEnum('apply_method').notNull(),
    matchScore: integer('match_score').notNull(),

    emailSubject: varchar('email_subject', { length: 255 }),
    emailBody: text('email_body'),
    applicationLink: varchar('application_link', { length: 255 }),
    failureReason: text('failure_reason'),

    appliedDate: timestamp(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
}, (table) => ({
    uniqueUserJob: uniqueIndex('user_job_unique').on(table.userId, table.jobId),
    userIdIdx: index('idx_applications_user').on(table.userId),
    jobIdIdx: index('idx_applications_job').on(table.jobId),
}));



// PLANS — pricing reference table


export const planTable = pgTable('plans', {
    id: uuid().primaryKey().defaultRandom(),
    planType: planOfferedEnum('plan_type').notNull().default('free'),
    planStatus: subscriptionStatusEnum('plan_status').notNull().default('inactive'),
    planPriceInPaise: integer('plan_price_in_paise').notNull().default(0),
    planDurationDays: integer('plan_duration_days').notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});


// SUBSCRIPTIONS (1:1 — current subscription state per user)


export const subscriptionsTable = pgTable('subscription', {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar({ length: 255 }).notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
    planId: uuid().references(() => planTable.id, { onDelete: 'set null' }),

    planType: planOfferedEnum('plan_type').notNull().default('free'),
    planStatus: subscriptionStatusEnum('plan_status').notNull().default('active'),

    trialStartTime: timestamp().defaultNow(),
    trialEndTime: timestamp(),
    trialEmailsUsed: integer('trial_emails_used').notNull().default(0),

    razorpayOrderId: varchar('razorpay_order_id', { length: 255 }),
    razorpaySubscriptionId: varchar('razorpay_subscription_id', { length: 255 }),
    razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),

    currentSubscriptionStartDate: timestamp(),
    currentSubscriptionEndDate: timestamp(),

    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
});