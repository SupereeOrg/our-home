import { getAllLetters } from "@/lib/letters";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(getAllLetters());
}
