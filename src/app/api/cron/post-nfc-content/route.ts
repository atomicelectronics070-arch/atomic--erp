import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import contentCalendar from '@/data/nfc-content-calendar.json'

// Vercel Cron: Runs daily at 14:00 UTC (9:00 AM Ecuador time)
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    // Security: Verify cron secret to prevent unauthorized triggering
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Get social settings (Meta credentials)
        const settings = await (prisma as any).socialSettings.findFirst()

        if (!settings?.metaPageToken || !settings?.metaPageId) {
            return NextResponse.json({
                success: false,
                error: 'Meta Page credentials not configured. Go to Dashboard → Settings → Social Media to configure your Facebook Page Token and Page ID.'
            }, { status: 400 })
        }

        // 2. Find which day to post based on campaign start date
        const campaignStart = settings.campaignStartDate
            ? new Date(settings.campaignStartDate)
            : null

        if (!campaignStart) {
            return NextResponse.json({
                success: false,
                error: 'Campaign start date not set. Configure it in Dashboard → Settings → Social Media.'
            }, { status: 400 })
        }

        const today = new Date()
        const daysDiff = Math.floor((today.getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24))
        const dayIndex = daysDiff % contentCalendar.length // cycle through all 30 posts

        if (daysDiff < 0) {
            return NextResponse.json({
                success: false,
                message: `Campaign has not started yet. Starts on ${campaignStart.toLocaleDateString('es-EC')}.`
            })
        }

        const todayContent = contentCalendar[dayIndex]
        if (!todayContent) {
            return NextResponse.json({ success: false, error: 'Content not found for this day' }, { status: 404 })
        }

        // 3. Compose the full post text
        const postMessage = `${todayContent.title}\n\n${todayContent.body}\n\n${todayContent.hashtags}\n\n📞 Contáctanos: wa.me/593969043453`

        // 4. Post to Facebook Page
        const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${settings.metaPageId}/feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: postMessage,
                access_token: settings.metaPageToken,
            })
        })

        const fbData = await fbResponse.json()

        if (!fbResponse.ok || fbData.error) {
            console.error('Facebook API error:', fbData)
            // Log failed post
            await (prisma as any).nfcCampaignPost.create({
                data: {
                    content: postMessage,
                    platform: 'facebook',
                    status: 'FAILED',
                    errorMessage: fbData.error?.message || 'Unknown Facebook API error',
                    dayNumber: dayIndex + 1,
                }
            }).catch(() => {}) // Don't fail if logging fails
            return NextResponse.json({
                success: false,
                day: dayIndex + 1,
                error: fbData.error?.message || 'Facebook API error',
                fbData
            }, { status: 500 })
        }

        // 5. Log success to database
        await (prisma as any).nfcCampaignPost.create({
            data: {
                content: postMessage,
                platform: 'facebook',
                status: 'PUBLISHED',
                externalPostId: fbData.id,
                dayNumber: dayIndex + 1,
            }
        }).catch(() => {}) // Don't fail if logging fails

        console.log(`✅ NFC Campaign Day ${dayIndex + 1} posted to Facebook. Post ID: ${fbData.id}`)

        return NextResponse.json({
            success: true,
            day: dayIndex + 1,
            title: todayContent.title,
            postId: fbData.id,
            postedAt: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('Cron post error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
