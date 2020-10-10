import { ModelCtor } from 'sequelize';

type StoreType = {
  users: ModelCtor;
  trips: ModelCtor;
};

type ContextType = {
  user: {
    id: number;
    email: string;
  } | null;
};

type LaunchType = {
  flight_number: number;
  date_unix: number;
  rocket: string;
  launchpad: string;
};

type TripType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  launchId: string;
  userId: number;
};
