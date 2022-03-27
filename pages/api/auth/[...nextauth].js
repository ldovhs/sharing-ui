import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { prisma } from "@context/PrismaContext";
import { ethers, utils } from "ethers";
import Enums from "enums";
const CryptoJS = require("crypto-js");

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: "admin-authenticate",
            name: "admin-authenticate",
            type: "credentials",
            /*   
                Authenticating by rebuilding the owner address from the signature and compare with the submitted address
                Update new nonce for next time authentication
            */
            authorize: async (credentials, req) => {
                console.log("Authenticating as admin");
                const { address, signature } = credentials;
                if (!address || !signature) throw new Error("Missing address or signature");

                if (utils.getAddress(address) && !utils.isAddress(address))
                    throw new Error("Invalid wallet address");

                const admin = await prisma.Admin.findFirst({
                    where: {
                        wallet: { equals: address, mode: "insensitive" },
                    },
                });
                if (!admin) throw new Error("Wallet address not belong to any admin!");

                const nonce = admin.nonce.trim();
                const msg = `${Enums.ADMIN_SIGN_MSG}: ${nonce}`;

                const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
                const originalAddress = recoverPersonalSignature({
                    data: msgBufferHex,
                    sig: signature,
                });

                if (originalAddress.toLowerCase() !== address.toLowerCase())
                    throw new Error("Signature verification failed");

                const newNonce = CryptoJS.lib.WordArray.random(16).toString();

                let res = await prisma.Admin.update({
                    where: {
                        //wallet: { equals: originalAddress.toLowerCase(), mode: "insensitive" },
                        id: admin.id,
                    },
                    data: {
                        nonce: newNonce,
                    },
                });

                if (!res) {
                    console.error("cannot update new nonce");
                }

                console.log("Authenticated as admin successfully");
                return { address: originalAddress, isAdmin: true };
            },
        }),
        CredentialsProvider({
            id: "non-admin-authenticate",
            name: "Non-admin authentication",
            type: "credentials",
            authorize: async (credentials, req) => {
                let { address, signature } = credentials;
                if (!address || !signature) throw new Error("Missing address or signature");

                if (utils.getAddress(address) && !utils.isAddress(address))
                    throw new Error("Invalid address");

                const user = await prisma.whiteList.findFirst({
                    where: {
                        wallet: { equals: address, mode: "insensitive" },
                    },
                });

                if (!user) {
                    throw new Error("This wallet is not in our record.");
                }
                const msg = `${Enums.USER_SIGN_MSG}`;
                console.log(123);
                const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
                const originalAddress = recoverPersonalSignature({
                    data: msgBufferHex,
                    sig: signature.trim(),
                });

                if (originalAddress.toLowerCase() !== address.toLowerCase())
                    throw new Error("Signature verification failed");

                console.log("Authenticated as user successfully");

                return { address: originalAddress, isAdmin: false };
            },
        }),
    ],
    session: {
        jwt: true,
        maxAge: 60 * 5, //  30 * 24 * 60 * 60
    },
    jwt: {
        signingKey: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
});
