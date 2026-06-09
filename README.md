# FitAI Coach ⚔️

AI-powered fitness platform with Warhammer/Marvel lore rank system, pixel art avatar, Master Yoda guide, and full gamification.

## Quick Start (Day 1)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy env file
cp .env.example .env
# Fill in NEXTAUTH_SECRET (any random string for local dev)

# 3. Run database migration + seed badges
npm run setup

# 4. Start the app
npm run dev
```

Open http://localhost:3000

## Full Setup

### Environment Variables (.env)
```
NEXTAUTH_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=sk-ant-...         # Get from console.anthropic.com
```
AWS and Redis variables only needed for Week 4 deployment.

## Project Structure

```
fitai-coach/
├── app/                        Next.js App Router
│   ├── page.js                 Landing page
│   ├── layout.js               Root layout
│   ├── globals.css             Theme CSS variables + Yoda animations
│   ├── providers.js            SessionProvider + ThemeProvider
│   ├── onboarding/             9-step onboarding flow
│   ├── admin/                  System health dashboard
│   ├── (auth)/                 Login + Signup pages
│   ├── (dashboard)/            Protected pages with sidebar
│   │   ├── dashboard/          Main overview
│   │   ├── workout/            Live workout logger
│   │   ├── progress/           Charts and history
│   │   ├── formcheck/          Video upload + AI feedback
│   │   ├── leaderboard/        Friends comparison
│   │   └── profile/            Stats, badges, themes, avatar
│   └── api/                    REST API endpoints
│       ├── auth/               NextAuth + signup
│       ├── workout/            Plan generation + job status
│       ├── progress/           Session logging + body metrics
│       ├── formcheck/          S3 upload + AI analysis
│       ├── gamification/       XP, badges, streaks
│       ├── leaderboard/        Friends + rankings
│       ├── avatar/             Avatar save/load
│       └── admin/              System stats
│
├── components/
│   ├── layout/Sidebar.js       Navigation + user info
│   ├── yoda/
│   │   ├── MasterYoda.js       Pixel art Yoda SVG + animations
│   │   └── YodaWidget.js       Dashboard corner widget
│   ├── gamification/
│   │   ├── PostWorkoutScreen.js  Full-screen celebration
│   │   ├── BadgesGrid.js         All badges display
│   │   ├── StreakHeatmap.js      LeetCode-style calendar
│   │   └── XPBar.js              Level progress bar
│   ├── avatar/
│   │   ├── AvatarRenderer.js     Renders pixel art avatar
│   │   └── AvatarPicker.js       Customization UI
│   ├── onboarding/
│   │   └── OnboardingFlow.js     9-step guided onboarding
│   ├── themes/
│   │   ├── ThemeProvider.js      Theme context + CSS vars
│   │   └── ThemeSwitcher.js      5-theme picker UI
│   ├── workout/
│   │   ├── WorkoutLogger.js      Live set/rep tracker
│   │   ├── FormCheckUploader.js  S3 video upload
│   │   └── OnboardingForm.js     Quick plan generation
│   ├── progress/
│   │   └── ProgressCharts.js     Recharts visualizations
│   └── ui/
│       ├── Button.js
│       ├── Card.js
│       ├── Badge.js
│       └── Spinner.js
│
├── constants/
│   ├── ranks.js        Session ranks, all-time ranks, level titles, XP table
│   ├── badges.js       All 14 badge definitions
│   ├── themes.js       5 themes with CSS variable values
│   ├── yoda.js         All Yoda quotes by context
│   └── avatars.js      Body types, equipment, fitness legends
│
├── lib/
│   ├── db.js           Prisma client singleton
│   ├── redis.js        Redis client singleton
│   ├── queue.js        BullMQ job queues
│   ├── ai.js           Claude API: plan gen, form check, coaching
│   ├── gamification.js XP calculation, badge checking, streak logic
│   ├── s3.js           AWS S3 presigned URLs + CloudFront
│   ├── ses.js          AWS SES email sending
│   └── utils.js        BMI, volume calc, formatters
│
├── workers/
│   └── index.js        BullMQ workers: plan gen, form check, weekly report
│
├── prisma/
│   ├── schema.prisma   Database schema (SQLite dev, MySQL prod)
│   └── seed.js         Populates Badge table
│
├── __tests__/          Jest unit tests
├── .github/workflows/  CI/CD pipeline
├── Dockerfile.worker   ECS container for workers
├── docker-compose.yml  Local dev with Redis
└── .env.example        All env variables documented
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, JavaScript, Tailwind CSS |
| Auth | NextAuth.js, bcrypt, JWT |
| Database (dev) | SQLite via Prisma |
| Database (prod) | MySQL on AWS RDS |
| AI | Anthropic Claude API |
| Queue | BullMQ + Redis (AWS ElastiCache) |
| Storage | AWS S3 + CloudFront CDN |
| Email | AWS SES |
| Deployment | Vercel + AWS ECS Fargate |
| CI/CD | GitHub Actions |
| Monitoring | AWS CloudWatch |

## Rank System

- **Session ranks**: Initiate → Scout Marine → Space Marine → War Machine → Colossus → Juggernaut → Kratos → Thor Odinson → Primarch → Chaos God → The One Above All
- **All-time ranks**: Neophyte → Battle Brother → Iron Hand → Mjolnir Worthy → Incredible → Vibranium Class → Astartes → Daemon Prince → Emperor's Champion
- **Level titles**: Uninitiated → Recruit → Scout → Battle Brother → Sergeant → Mutant → X-Man → Avenger → Infinity Class → Primarch → Daemon Prince → The Emperor
