import { NextRequest } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://0.0.0.0:8000';

interface MessageInput {
  role: string;
  content: string;
  id?: string;
  files?: unknown[];
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    console.log('📨 Request body:', {
      messages_count: body.messages?.length,
    });
    console.log('💬 Messages:', body.messages);

    // Validate and transform frontend Message[] format to backend format
    // Backend expects: {role: string, content: string}[]
    // Frontend sends: {role: string, content: string, id?: string, files?: ...}[]
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'messages field is required and must be an array' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const transformedMessages = body.messages
      .filter((msg: MessageInput) => msg && typeof msg.role === 'string' && typeof msg.content === 'string')
      .map((msg: MessageInput) => ({
        role: msg.role,
        content: msg.content || '',
      }));

    if (transformedMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one valid message is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Forward the request to the backend delta endpoint
    const response = await fetch(
      `${API_BASE_URL}/api/delta/conversations/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: transformedMessages,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return new Response(errorText, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

