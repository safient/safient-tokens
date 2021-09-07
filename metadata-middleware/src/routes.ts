import { Express, Request, Response } from "express";
import {
  createItemHandler,
  updateItemHandler,
  getItemHandler,
  deleteItemHandler,
} from "./controller/item.controller";
import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from "./schema/item.schema";

export default function (app: Express) {
  app.get("/status", (req: Request, res: Response) => res.sendStatus(200));

  // Register user
  app.post("/collectible/users", validateRequest(createUserSchema), createUserHandler);

  // Login
  app.post(
    "/collectible/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get the user's sessions
  app.get("/collectible/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/collectible/sessions", requiresUser, invalidateUserSessionHandler);

  // Create an item
  app.post(
    "/collectible/item",
    [requiresUser, validateRequest(createItemSchema)],
    createItemHandler
  );

  // Update an item
  app.put(
    "/collectible/item/:itemId",
    [requiresUser, validateRequest(updateItemSchema)],
    updateItemHandler
  );

  // Get a item
  app.get("/collectible/item/:itemId", getItemHandler);

  // Delete an item
  app.delete(
    "/collectible/item/:itemId",
    [requiresUser, validateRequest(deleteItemSchema)],
    deleteItemHandler
  );
}
