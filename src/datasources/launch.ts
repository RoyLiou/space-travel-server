import { RESTDataSource } from 'apollo-datasource-rest';
import { LaunchType } from '../../custom';

class launchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v4/';
  }

  launchReducer(launch: LaunchType) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.date_unix}`,
      launchpad: launch.launchpad,
      rocket: launch.rocket,
    };
  }

  async getAllLaunches() {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }

  async getLaunchById({ launchId }: { launchId: number }) {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }: { launchIds: number[] }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }
}

export default launchAPI;
