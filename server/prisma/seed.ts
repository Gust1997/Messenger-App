import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const users = [
        { username: "alice", pw: "alice123" },
        { username: "bob", pw: "bob123" },
        { username: "charles", pw: "charles123" },
        { username: "john", pw: "john123" },
        { username: "liam", pw: "liam123" },
        { username: "gustavo", pw: "gustavo123" },
    ];

    for (const u of users) {
        const hash = await bcrypt.hash(u.pw, 10);
        await prisma.user.upsert({
            where: { username: u.username },
            update: {},
            create: { username: u.username, password: hash }
        });
    }

    console.log("Finished seeding users.")
}

main()
  .finally(async () => { await prisma.$disconnect(); });