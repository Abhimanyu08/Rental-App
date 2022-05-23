import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import session from "express-session";

interface Context {
	req: Request & { session: typeof session & { userId: number } };
	res: Response;
	prisma: PrismaClient;
}

export default Context;
