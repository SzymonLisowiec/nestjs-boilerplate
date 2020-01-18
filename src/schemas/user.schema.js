import { Schema } from 'mongoose';
import { UserTotpSchema } from './user-totp.schema';
import { UserLocalizationSchema } from './user-localization.schema';

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  totp: {
    type: UserTotpSchema,
    default: null,
  },
  roles: {
    type: [String],
    required: true,
    default: ['user'],
  },
  localization: {
    type: UserLocalizationSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  registrationConfirmedAt: {
    type: Date,
  },
}, {
  versionKey: false,
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.totp;
    },
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.totp;
    },
  },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  return next();
});
