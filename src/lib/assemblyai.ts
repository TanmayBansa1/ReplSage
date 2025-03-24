import {AssemblyAI} from 'assemblyai'
// Validate API key
const validateApiKey = (apiKey?: string) => {
    if (!apiKey) {
        throw new Error('AssemblyAI API key is missing. Please set ASSEMBLYAI_API_KEY in your environment variables.');
    }
}

// Validate API key at import time
try {
    validateApiKey(process.env.ASSEMBLYAI_API_KEY);
} catch (error) {
    console.error('AssemblyAI API Key Validation Error:', error);
}
const client  = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
})

const msTotime = async (ms: number) => {
    const seconds = Math.floor(ms/1000);
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const transcribeMeeting = async (meetingUrl: string)=>{

    const transcript = await client.transcripts.transcribe({
        audio_url: meetingUrl,
        auto_chapters: true
    });

    const summaries = await Promise.all(transcript.chapters?.map(async (chapter) => {
        return {
            gist: chapter.gist,
            start: await msTotime(chapter.start),
            end: await msTotime(chapter.end),
            summary: chapter.summary,
            headline: chapter.headline,
            
        }
    }) ?? [])

    if(transcript.text === undefined || transcript.text === null){
        throw new Error('Transcript text is undefined or not found')
    }
    return {
        summaries
    }
}