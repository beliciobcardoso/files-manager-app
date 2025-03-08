import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    return NextResponse.json(
        {
            id: user?.id,
            name: user?.name,
            email: user?.email
        });

}
