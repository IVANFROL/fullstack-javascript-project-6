import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Task from '../models/Task.js';
import TaskStatus from '../models/TaskStatus.js';
import Label from '../models/Label.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const knex = Knex(config);
Model.knex(knex);

// Регистрируем путь к моделям для строковых ссылок в relationMappings
Model.modelPaths = [path.join(__dirname, '../models')];

export { knex, Model };
