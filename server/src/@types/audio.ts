import { AudioDocument } from "#/models/audio";
import { ObjectId } from "mongoose";
import { Request } from "express";

export type PopulatedFavList = AudioDocument<{ _id: ObjectId; name: string }>;

export interface CreatePlaylistRequest extends Request {
  body: {
    title: string;
    resId: string;
    visibility: "public" | "private";
  };
}

export interface updatePlaylistRequest extends Request {
    body: {
      title: string;
      id: string;
      item: string;
      visibility: "public" | "private";
    };
  }
