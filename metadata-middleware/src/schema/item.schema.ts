import { object, string, array } from "yup";

const payload = {
  body: object({
  //   title: string().required("Title is required"),
  //   body: string()
  //     .required("Body is required")
  //     .min(120, "Body is too short - should be 120 chars minimum."),
  // }
    description: string().required("Description of the collectible is required"), 
    external_url: string(), 
    image: string(), 
    name: string().required("Name is required"),
    attributes: array(), 
  }
  
  ),
};

const params = {
  params: object({
    itemId: string().required("itemId is required"),
  }),
};

export const createItemSchema = object({
  ...payload,
});

export const updateItemSchema = object({
  ...params,
  ...payload,
});

export const deleteItemSchema = object({
  ...params,
});
