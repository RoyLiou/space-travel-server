import SQL, { Sequelize } from 'sequelize';
import { LaunchConnection } from '../custom';

export const createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  });

  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING,
  });

  const trips = db.define('trip', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    launchId: SQL.STRING,
    userId: SQL.INTEGER,
  });

  return { users, trips };
};

export const paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  getCursor,
}: {
  after: number;
  pageSize: number;
  results: LaunchConnection[];
  getCursor?: (item: unknown) => null;
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex((item: any) => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    const itemCursor = item.cursor ? item.cursor : getCursor && getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};
