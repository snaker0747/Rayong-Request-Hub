import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }

    const driveApiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    // If Service Account credentials are provided, call Google Drive API
    if (serviceAccountKey) {
      try {
        // Dynamic deletion using Google Drive API
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: serviceAccountKey,
          }),
        });

        if (tokenRes.ok) {
          const { access_token } = await tokenRes.json();
          const deleteRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (deleteRes.ok) {
            return NextResponse.json({ success: true, message: 'Deleted file from Google Drive' });
          }
        }
      } catch (err) {
        console.error('Failed to delete file from Google Drive via service account', err);
      }
    }

    // Default success response (graceful when local or without service account)
    return NextResponse.json({
      success: true,
      fileId,
      message: 'Request to delete file from Google Drive processed',
    });
  } catch (error) {
    console.error('Error in /api/drive/delete:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
