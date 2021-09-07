import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Item, { ItemDocument } from "../model/item.model";

export async function createItem(input: DocumentDefinition<ItemDocument>) {
  // console.log(Item.count())
  const item = await Item.findOne().sort({ field: 'asc', _id: -1 }).limit(1)
  console.log(item)
  input["itemId"] = item ? item.itemId + 1 : 0
  return Item.create(input);
}

export function findItem(
  query: FilterQuery<ItemDocument>,
  options: QueryOptions = { lean: true }
) {
  return Item.findOne(query, {}, options);
}

export function findAndUpdate(
  query: FilterQuery<ItemDocument>,
  update: UpdateQuery<ItemDocument>,
  options: QueryOptions
) {
  return Item.findOneAndUpdate(query, update, options);
}

export function deleteItem(query: FilterQuery<ItemDocument>) {
  return Item.deleteOne(query);
}
