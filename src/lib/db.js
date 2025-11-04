import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile.js';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const knex = Knex(config);
Model.knex(knex);

export { knex, Model };
