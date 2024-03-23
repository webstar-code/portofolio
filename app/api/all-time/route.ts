export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';
import faunadb, { Collection, Get, Ref } from 'faunadb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new faunadb.Client({
    secret: process.env.DB_KEY!
  });
  try {
    const result = await client.query(
      Get(Ref(Collection("all_time"), "392996195750904401"))
    ) as {
      data: {
        decimal: string;
        digital: string;
        start_date: string;
        text: string;
        total_seconds: number;
      }
    }
    return NextResponse.json({ data: result.data }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err, message: "Internal server error" }, { status: 500 })
  };
}
