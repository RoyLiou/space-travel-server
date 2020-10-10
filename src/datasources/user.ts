import { DataSource, DataSourceConfig } from 'apollo-datasource';
import isEmail from 'isemail';
import { StoreType, ContextType, TripType } from '../../custom';

class UserAPI extends DataSource {
  store: StoreType;
  context: ContextType;

  constructor({ store }: { store: StoreType }) {
    super();
    this.store = store as StoreType;
    this.context = {
      user: null,
    };
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   **/
  initialize(config: DataSourceConfig<ContextType>) {
    this.context = config.context;
  }

  async findOrCreateUser({ email: emailArg }: { email: string }) {
    const email = this.context.user ? this.context.user.email : emailArg;

    if (!email || isEmail.validate(email)) return null;
    if (!this.store.users) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ launchIds }: { launchIds: string[] }) {
    const userId = this.context.user && this.context.user.id;

    if (!userId) return;

    const results = [];

    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }: { launchId: string }) {
    const userId = this.context.user && this.context.user.id;

    if (!userId) return;

    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });

    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }: { launchId: string }) {
    const userId = this.context.user && this.context.user.id;

    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user && this.context.user.id;
    const found = await this.store.trips.findAll({ where: { userId } });

    return found && found.length
      ? found
          .map((item: { dataValues: TripType }) => item.dataValues.launchId)
          .filter((launchId: string) => !!launchId)
      : [];
  }

  async isBookedOnLaunch({ launchId }: { launchId: string }) {
    if (!this.context || !this.context.user) return false;

    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });

    return found && found.length > 0;
  }
}

export default UserAPI;
