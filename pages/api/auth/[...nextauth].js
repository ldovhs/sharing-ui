import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { prisma } from "@context/PrismaContext";
import { utils } from "ethers";
import Enums from "enums";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

const CryptoJS = require("crypto-js");

const {
    NEXT_PUBLIC_NEXTAUTH_SECRET,
    NEXT_PUBLIC_DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    NEXT_PUBLIC_TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET,
} = process.env;

const options = {
    providers: [
        /*   
            Update new nonce for next time authentication
            Authenticating by rebuilding the owner address from the signature and compare with the submitted address
        */
        CredentialsProvider({
            id: "admin-authenticate",
            name: "admin-authenticate",
            type: "credentials",

            authorize: async (credentials, req) => {
                const { address, signature } = credentials;
                if (!address || !signature) throw new Error("Missing address or signature");

                let wallet = utils.getAddress(address);
                if (!wallet && !utils.isAddress(address)) throw new Error("Invalid wallet address");

                const admin = await prisma.admin.findUnique({
                    where: {
                        wallet,
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
                console.log("Authenticating as user");
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
                    throw new Error("This wallet account is not in our record.");
                }

                const msg = `${Enums.USER_SIGN_MSG}`;

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
        // default should be [origin]/api/auth/callback/[provider] ~ https://next-auth.js.org/configuration/providers/oauth
        DiscordProvider({
            clientId: NEXT_PUBLIC_DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
        }),
        TwitterProvider({
            clientId: NEXT_PUBLIC_TWITTER_CLIENT_ID,
            clientSecret: TWITTER_CLIENT_SECRET,
            version: "2.0",
        }),
    ],
    // site: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    debug: true,
    session: {
        jwt: true,
        maxAge: 60 * 60 * 24 * 5, //  30 * 24 * 60 * 60
    },
    jwt: {
        signingKey: NEXT_PUBLIC_NEXTAUTH_SECRET,
    },
    callbacks: {
        signIn: async (user, account, profile) => {
            console.log(user);
            if (user?.account?.provider === "discord") {
                let discordId = user.account.providerAccountId;
                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        discordId,
                    },
                });

                if (!existingUser) {
                    let error = `Discord ${user.profile.username}#${user.profile.discriminator} not found in our database.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }
                return true;
            }

            if (user.account.provider === "twitter") {
                let twitterId = user.account.providerAccountId;

                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        twitterId,
                    },
                });

                if (!existingUser) {
                    let error = `Twitter ${user.user.name} not found in our database.`;
                    return `/challenger/quest-redirect?error=${error}`;
                }
                return true;
            }

            return true;
        },
        async redirect({ url, baseUrl }) {
            return url;
        },

        async session({ session, token }) {
            console.log(session);
            session.profile = token.profile;
            session.user = token.user;
            session.provider = token.provider;
            return session;
        },
        async jwt({ token, user, account, profile }) {
            console.log(token);
            if (user) {
                token.profile = profile;
                token.user = user;
                token.provider = account.provider;
            }
            return token;
        },
    },
    secret: NEXT_PUBLIC_NEXTAUTH_SECRET,
};

export default (req, res) => {
    if (process.env.VERCEL) {
        // prefer NEXTAUTH_URL, fallback to x-forwarded-host
        req.headers["x-forwarded-host"] =
            process.env.NEXTAUTH_URL || req.headers["x-forwarded-host"];
    }
    return NextAuth(req, res, options);
};
