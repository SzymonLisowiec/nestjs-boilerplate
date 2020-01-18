import { Schema } from 'mongoose';

export const UserLocalizationSchema = new Schema({
  language: {
    type: String,
  },
  // country: {
  //   type: String,
  // },
}, {
  id: false,
  versionKey: false,
});
