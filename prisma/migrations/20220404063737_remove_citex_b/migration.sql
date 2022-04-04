-- AddForeignKey
ALTER TABLE "Anomuras" ADD CONSTRAINT "Anomuras_playersWallet_fkey" FOREIGN KEY ("playersWallet") REFERENCES "Players"("wallet") ON DELETE SET NULL ON UPDATE CASCADE;
