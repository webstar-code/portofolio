export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';
import faunadb, { Collection, Create, Ref } from 'faunadb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new faunadb.Client({
    secret: process.env.DB_KEY!
  });

  function getISODateString() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    return isoString.substring(0, 10);
  }
  const currentDate = getISODateString();
  const url = `https://wakatime.com/api/v1/users/current/summaries?start=${currentDate}&end=${currentDate}&api_key=${process.env.WAKA_KEY}`
  try {
    return await fetch(url)
      .then(res => res.json())
      .then(async (res) => {
        const result = res;
        const newDoc = {
          decimal: result.cumulative_total.decimal,
          digital: result.cumulative_total.digital,
          text: result.cumulative_total.text,
          start: result.start,
          end: result.end,
        }
        const query = Create(Ref(Collection("daily"), currentDate.replaceAll("-", "")), {
          data: {
            ...newDoc
          },
        })
        const response = await client.query(query) as any;
        return NextResponse.json({ data: response.data.data }, { status: 200 })
      })
  } catch (err) {
    return NextResponse.json({ error: err, message: "Internal server error" }, { status: 500 })
  };

}