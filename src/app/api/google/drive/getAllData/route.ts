import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 },
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!user) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 },
        );
    }

    const googleNode = await prisma.googleNode.findUnique({
        where: {
            nodeId: new URL(req.url).searchParams.get('nodeId') as string
        }
    })
    return NextResponse.json({success : true , data : googleNode});
}
