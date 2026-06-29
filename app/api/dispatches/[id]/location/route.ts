import {
  updateDispatchLocation,
  type DispatchLocationUpdateInput,
  type DispatchRecord,
} from "@/lib/dispatch-crud";

type DetailContext = {
  params: Promise<{ id: string }>;
};

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown server error";
}

export async function POST(request: Request, context: DetailContext) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as DispatchLocationUpdateInput;
    const record = await updateDispatchLocation(id, payload);

    if (!record) {
      return Response.json({ error: "dispatch not found." }, { status: 404 });
    }

    return Response.json(record satisfies DispatchRecord);
  } catch (error) {
    return Response.json(
      {
        error: "Failed to update dispatch location.",
        message: toErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
