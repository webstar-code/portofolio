import faunadb, { Collection, CreateIndex, Get, Index, Match, Ref } from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_DB_KEY!
});
const q = faunadb.query;

interface DailyActivity {
  date: string,
  decimal: string,
  digital: string,
  text: string
}

const CreateIndexOrderByRefDesc = CreateIndex({
  name: "sort_by_ref_desc",
  source: Collection("daily"),
  values: [
    { field: ["ref"], reverse: true },
  ],
  serialized: true
})

export async function getDailyActivityData() {
  try {
    const items = await client.query(
      q.Map(
        q.Paginate(Match(Index("sort_by_ref_desc")), { size: 100 }),
        q.Lambda(['ref'], q.Get(q.Var('ref')))
      )
    ) as { data: { data: DailyActivity }[] };
    return items.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}
const x = {
  decimal
    :
    "3616.95",
  digital
    :
    "3616:57",
  start_date
    :
    "2020-04-26",
  text
    :
    "3,617 hrs 49 mins",
  total_seconds
    :
    13024167.854151
}
export async function getAllTimeHours() {
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
    return result.data
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}