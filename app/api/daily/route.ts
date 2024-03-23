export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';
import faunadb, { Index, Match } from 'faunadb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new faunadb.Client({
    secret: process.env.DB_KEY!
  });
  const q = faunadb.query;
  try {
    const items = await client.query(
      q.Map(
        q.Paginate(Match(Index("sort_by_ref_desc")), { size: 365 }),
        q.Lambda(['ref'], q.Get(q.Var('ref')))
      )
    ) as any;
    return NextResponse.json({ data: items.data }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err, message: "Internal server error" }, { status: 500 })
  };
}