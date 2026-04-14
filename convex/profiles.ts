import { queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const listProfile = query({
  args: {
    titleId: v.optional(v.id("titles")),
    searchTerm: v.optional(v.string()),
  },
  async handler(ctx, args) {
    let usersQuery = ctx.db.query("profile");

    if (args.titleId) {
      usersQuery = usersQuery.filter((q) =>
        q.eq(q.field("title"), args.titleId),
      );
    }

    const users = await usersQuery.collect();

    let filteredUsers = users;
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
    }

    const enrichedUsers = await Promise.all(
      filteredUsers.map(async (user) => {
        const title = user.title ? await ctx.db.get(user.title) : "";

        return {
          ...user,
          title,
        };
      }),
    );

    return enrichedUsers;
  },
});

export const getProfileByUsername = query({
  args: { username: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("profile")
      .withIndex("by_username", (q) =>
        q.eq("username", args.username.toLowerCase()),
      )
      .unique();

    if (!user) return null;

    const title = await ctx.db.get(user.title);
    return { ...user, title };
  },
});

export const getProfile = query({
  args: {},
  async handler(ctx) {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const user = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();

    if (!user) return null;

    return await ctx.db
      .get(user.title)
      .then((title) => ({ ...user, title }))
      .catch(() => ({ ...user, title: null }));
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    return await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();
  },
});

export const createProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("profile", {
      userId: authUser._id,
      email: authUser.email,
      firstName: args.firstName,
      lastName: args.lastName,
      username: args.username.toLowerCase(),
      phoneNumbers: [],
      profileImage: null,
      title: null,
      shortBio: null,
      links: [],
      projects: [],
    });
  },
});
