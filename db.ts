import faunadb, { Collection, CreateIndex, Index, Match } from 'faunadb';

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