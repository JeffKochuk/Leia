import { Mongo } from 'meteor/mongo';

export const Segments = new Mongo.Collection('segments');
export const EloquaLogs = new Mongo.Collection('eloquaLogs');
export const Logs = new Mongo.Collection('logs');



