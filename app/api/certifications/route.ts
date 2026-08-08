import { NextResponse } from 'next/server'
import { CERTIFICATION_RECORDS, CERTIFICATIONS_FOLDER_ID, CERTIFICATIONS_FOLDER_NAME } from '@/lib/certifications'

export async function GET() {
    return NextResponse.json({
        folder: {
            id: CERTIFICATIONS_FOLDER_ID,
            name: CERTIFICATIONS_FOLDER_NAME,
        },
        docs: CERTIFICATION_RECORDS,
    })
}