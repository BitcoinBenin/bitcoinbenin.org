import { getGalleryData } from "@/lib/gallery";
import { NextResponse } from "next/server";

// Cette route API utilise maintenant la logique partagée pour récupérer les données.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route /api/gallery failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery data" },
      { status: 500 }
    );
  }
}