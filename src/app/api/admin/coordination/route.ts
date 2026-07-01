import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');
        
        let queryDate = new Date();
        if (dateStr) {
            queryDate = new Date(dateStr);
        }
        queryDate.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        let dailyLog = await prisma.coordinationDaily.findFirst({
            where: {
                date: {
                    gte: queryDate,
                    lte: endOfDay
                }
            },
            include: {
                followUps: true,
                reports: true,
                assignments: true,
            }
        });

        if (!dailyLog) {
            // Check if one exists, otherwise return empty state
            return NextResponse.json({ 
                daily: { openTime: null, closeTime: null, notices: "" }, 
                followUps: [], reports: [], assignments: [] 
            });
        }

        return NextResponse.json({
            daily: dailyLog,
            followUps: dailyLog.followUps,
            reports: dailyLog.reports,
            assignments: dailyLog.assignments
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { action, payload } = data;

        // Ensure a daily log exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        let dailyLog = await prisma.coordinationDaily.findFirst({
            where: { date: { gte: today, lte: endOfDay } }
        });

        if (!dailyLog) {
            dailyLog = await prisma.coordinationDaily.create({
                data: { date: new Date() }
            });
        }

        switch (action) {
            case "OPEN_GROUP":
                dailyLog = await prisma.coordinationDaily.update({
                    where: { id: dailyLog.id },
                    data: { openTime: new Date() }
                });
                return NextResponse.json({ success: true, dailyLog });
                
            case "CLOSE_GROUP":
                dailyLog = await prisma.coordinationDaily.update({
                    where: { id: dailyLog.id },
                    data: { closeTime: new Date() }
                });
                return NextResponse.json({ success: true, dailyLog });
                
            case "SAVE_NOTICES":
                dailyLog = await prisma.coordinationDaily.update({
                    where: { id: dailyLog.id },
                    data: { notices: payload.notices }
                });
                if (payload.publishToSocial) {
                    await prisma.socialPost.create({
                        data: {
                            content: `📣 **Avisos de Coordinación**\n\n${payload.notices}`,
                            authorId: session.user.id
                        }
                    });
                }
                return NextResponse.json({ success: true, dailyLog });

            case "ADD_FOLLOW_UP":
                const newFollowUp = await prisma.coordinationFollowUp.create({
                    data: {
                        dailyId: dailyLog.id,
                        clientName: payload.clientName,
                        phone: payload.phone,
                        case: payload.case,
                        responsibleType: payload.responsibleType,
                        advisorId: payload.advisorId
                    }
                });
                return NextResponse.json({ success: true, newFollowUp });

            case "SAVE_REPORT":
                const report = await prisma.coordinationReport.create({
                    data: {
                        dailyId: dailyLog.id,
                        type: payload.type, // "B2B" or "ZOOM"
                        q1: payload.q1,
                        q2: payload.q2,
                        q3: payload.q3,
                        q4: payload.q4,
                        notes: payload.notes
                    }
                });
                return NextResponse.json({ success: true, report });

            case "ADD_ASSIGNMENT":
                const assignment = await prisma.coordinationAssignment.create({
                    data: {
                        dailyId: dailyLog.id,
                        objective: payload.objective,
                        amount: payload.amount,
                        advisorId: payload.advisorId,
                        origin: payload.origin
                    }
                });
                return NextResponse.json({ success: true, assignment });

            default:
                return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
