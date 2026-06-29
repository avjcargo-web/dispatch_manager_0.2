import "server-only";

type DetailContext = {
  params: Promise<{ id: string }>;
};

type CollectionRepository<TCreate, TRecord> = {
  create: (input: TCreate) => Promise<TRecord>;
  list: () => Promise<TRecord[]>;
  resourceName: string;
};

type DetailRepository<TUpdate, TRecord> = {
  getById: (id: string) => Promise<TRecord | null>;
  remove: (id: string) => Promise<boolean>;
  resourceName: string;
  update: (id: string, input: TUpdate) => Promise<TRecord | null>;
};

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown server error";
}

export function createCollectionRouteHandlers<TCreate, TRecord>(
  repository: CollectionRepository<TCreate, TRecord>,
) {
  return {
    async GET() {
      try {
        const records = await repository.list();
        return Response.json(records);
      } catch (error) {
        return Response.json(
          {
            error: `Failed to list ${repository.resourceName}.`,
            message: toErrorMessage(error),
          },
          { status: 500 },
        );
      }
    },

    async POST(request: Request) {
      try {
        const payload = await request.json();
        const created = await repository.create(payload);
        return Response.json(created, { status: 201 });
      } catch (error) {
        return Response.json(
          {
            error: `Failed to create ${repository.resourceName}.`,
            message: toErrorMessage(error),
          },
          { status: 500 },
        );
      }
    },
  };
}

export function createDetailRouteHandlers<TUpdate, TRecord>(
  repository: DetailRepository<TUpdate, TRecord>,
) {
  return {
    async GET(_request: Request, context: DetailContext) {
      try {
        const { id } = await context.params;
        const record = await repository.getById(id);

        if (!record) {
          return Response.json(
            { error: `${repository.resourceName} not found.` },
            { status: 404 },
          );
        }

        return Response.json(record);
      } catch (error) {
        return Response.json(
          {
            error: `Failed to retrieve ${repository.resourceName}.`,
            message: toErrorMessage(error),
          },
          { status: 500 },
        );
      }
    },

    async PATCH(request: Request, context: DetailContext) {
      try {
        const { id } = await context.params;
        const payload = await request.json();
        const updated = await repository.update(id, payload);

        if (!updated) {
          return Response.json(
            { error: `${repository.resourceName} not found.` },
            { status: 404 },
          );
        }

        return Response.json(updated);
      } catch (error) {
        return Response.json(
          {
            error: `Failed to update ${repository.resourceName}.`,
            message: toErrorMessage(error),
          },
          { status: 500 },
        );
      }
    },

    async DELETE(_request: Request, context: DetailContext) {
      try {
        const { id } = await context.params;
        const deleted = await repository.remove(id);

        if (!deleted) {
          return Response.json(
            { error: `${repository.resourceName} not found.` },
            { status: 404 },
          );
        }

        return Response.json({ deleted: true, id });
      } catch (error) {
        return Response.json(
          {
            error: `Failed to delete ${repository.resourceName}.`,
            message: toErrorMessage(error),
          },
          { status: 500 },
        );
      }
    },
  };
}
