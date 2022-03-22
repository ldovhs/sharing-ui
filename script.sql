TRUNCATE <table_name> RESTART IDENTITY CASCADE;


npx prisma format
dotenv -e .env.development --npx prisma migrate dev --name postgres-init

INSERT INTO public."RewardType"
VALUES  
(1, 'Mystery Bowl'),
(2, 'Nude'),
(3, 'Bored Ape'),
(4, 'Mint List');