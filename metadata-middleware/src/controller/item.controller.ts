import { Request, Response } from "express";
import { get } from "lodash";
import {
  createItem,
  findItem,
  findAndUpdate,
  deleteItem,
} from "../service/item.service";

export async function createItemHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const body = req.body;

  const item = await createItem({ ...body, user: userId });

  return res.send(item);
}

export async function updateItemHandler(req: Request, res: Response) {

  const itemId = get(req, "params.itemId");
  const update = req.body;

  const item = await findItem({ itemId });

  if (!item) {
    return res.sendStatus(404);
  }


  const updatedPost = await findAndUpdate({ itemId }, update, { new: true });

  return res.send(updatedPost);
}
export async function getItemHandler(req: Request, res: Response) {
  const itemId = get(req, "params.itemId");
  const item = await findItem({ itemId });

  if (!item) {
    return res.sendStatus(404);
  }

  return res.send(item);
}

export async function deleteItemHandler(req: Request, res: Response) {

  const itemId = get(req, "params.itemId");

  const item = await findItem({ itemId });

  if (!item) {
    return res.sendStatus(404);
  }


  await deleteItem({ itemId });

  return res.sendStatus(200);
}
