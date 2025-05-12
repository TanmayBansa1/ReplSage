import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { transcribeMeeting } from '~/lib/assemblyai';
import { auth } from '@clerk/nextjs/server';

export const MAX_DURATION = 300; 

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Get the server-side session
    const { userId } = await auth();
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { meetingUrl, meetingId } = body;

    // Validate input
    if (!meetingUrl || !meetingId) {
      return NextResponse.json({ error: 'Missing meetingUrl or meetingId' }, { status: 400 });
    }

    // Set a timeout 5 minutes


    try {

          // Transcribe the meeting
          //sample https://assembly.ai/sports_injuries.mp3
          const { summaries } = await transcribeMeeting(meetingUrl);
          
          // Create issues from summaries
          await db.issue.createMany({
            data: summaries.map((summary) => ({
              meetingId: meetingId,
              start: summary.start,
              end: summary.end,
              gist: summary.gist,
              headline: summary.headline,
              summary: summary.summary
            }))
          });

          // Update meeting status
          await db.meeting.update({
            where: { id: meetingId },
            data: {
              status: 'COMPLETED',
              name: summaries[0]!.headline
            }
          });
      return NextResponse.json("successfully processed meeting", { status: 200 });
    } catch (error) {
      // Log the error
      console.error('Meeting processing error:', error);

      // Update meeting status to FAILED
      await db.meeting.update({
        where: { id: meetingId },
        data: { status: 'FAILED' }
      });

      return NextResponse.json({ 
        error: 'Failed to process meeting', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in process-meeting route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Ensure this route can handle POST requests
export const config = {
  api: {
    bodyParser: true,
  },
};
