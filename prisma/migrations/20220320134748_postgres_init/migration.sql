-- AlterTable
ALTER TABLE "Anomuras" ALTER COLUMN "headpieces" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PendingReward" ALTER COLUMN "twitter" DROP NOT NULL,
ALTER COLUMN "twitter" SET DEFAULT E'',
ALTER COLUMN "discordId" DROP NOT NULL,
ALTER COLUMN "discordId" SET DEFAULT E'';

-- AlterTable
ALTER TABLE "Reward" ALTER COLUMN "twitter" DROP NOT NULL,
ALTER COLUMN "twitter" SET DEFAULT E'',
ALTER COLUMN "discordId" DROP NOT NULL,
ALTER COLUMN "discordId" SET DEFAULT E'';
