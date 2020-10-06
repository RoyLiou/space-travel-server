import { RESTDataSource } from 'apollo-datasource-rest';

class launchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v4/';
  }

  launchReducer(launch: LaunchType) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.date_unix}`,
    };
  }

  async getAllLaunches() {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }
}

export default launchAPI;
