import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            AccessToken: true
        }
    });
    
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const GithubAccessToken = user.AccessToken?.GithubAccessToken;
    if (!GithubAccessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let repos : any= [];
    let page = 1;
    let totalPages;

    do {
        const res = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}`, {
            headers: {
                Authorization: `token ${GithubAccessToken}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        const data = await res.json();
        repos = repos.concat(data.map((repo:any)=> repo.full_name));
        
        const linkHeader = res.headers.get('link');
        const lastPageMatch = linkHeader ? linkHeader.match(/page=(\d+)>; rel="last"/) : null;
        totalPages = lastPageMatch ? parseInt(lastPageMatch[1]) : 1;
        page++;
        
    } while (page <= totalPages);

    return NextResponse.json({ data: repos }, { status: 200 });
}