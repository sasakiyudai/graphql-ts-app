import {
  extendType,
  idArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        return context.prisma.link.findUnique({ where: { id: args.id } });
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        });
        return newLink;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: stringArg(),
        url: stringArg(),
      },
      resolve(parent, args, context) {
        const updatedLink = context.prisma.link.update({
          where: {
            id: args.id,
          },
          data: {
            description: args.description ?? undefined,
            url: args.url ?? undefined,
          },
        });
        return updatedLink;
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        const link = context.prisma.link.delete({ where: { id: args.id } });
        return link;
      },
    });
  },
});
