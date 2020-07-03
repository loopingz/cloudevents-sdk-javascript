import { CloudEventV1Service, CloudEventV1Type } from "../event";

/**
 * DiscoveryService to implement the discovery spec:
 *
 * It provides a way to register Service through programmation and annotation
 *
 * It also include a express method to expose it through your API
 */
export class DiscoveryService {
  /**
   * Services mapped by name
   */
  static servicesMap: { [key: string]: CloudEventV1Service } = {};
  /**
   * Events mapped by type
   */
  static eventsMap: { [key: string]: CloudEventV1Service[] } = {};

  /**
   * Register your service to the DiscoveryService
   *
   * Annotation to declare a Service
   *
   * TODO Implement after discussion with team
   * It would add a @Service in front of class to declare a new service
   */
  static Service() {
    // TO IMPLEMENT
  }

  /**
   * Register your service to the DiscoveryService
   *
   * @param service to register
   */
  static registerService(service: CloudEventV1Service): void {
    if (DiscoveryService.servicesMap[service.name]) {
      throw new Error(`Service ${service.name} is already registered`);
    }
    DiscoveryService.servicesMap[service.name] = service;
    service.types.forEach((evt) => {
      DiscoveryService.eventsMap[evt.type] = DiscoveryService.eventsMap[evt.type] || [];
      DiscoveryService.eventsMap[evt.type].push(service);
    });
  }

  /**
   * Retrieve all services
   */
  static getServices(): CloudEventV1Service[] {
    return this.searchService();
  }

  /**
   * Search for a service
   * @param term to search for, case insensitive
   */
  static searchService(term: string = ""): CloudEventV1Service[] {
    //
    const searchTerm = term.toLowerCase();
    return Object.keys(DiscoveryService.servicesMap)
      .filter((k) => term === "" || k.toLowerCase().includes(searchTerm))
      .map((k) => DiscoveryService.servicesMap[k]);
  }

  /**
   * Retrieve all event types
   */
  static getTypes(): { [key: string]: CloudEventV1Service[] } {
    return this.searchType();
  }

  /**
   * Search for a type of event
   * @param term to search for, case insensitive
   */
  static searchType(term: string = ""): { [key: string]: CloudEventV1Service[] } {
    const searchTerm = term.toLowerCase();
    let result: { [key: string]: CloudEventV1Service[] } = {};
    Object.keys(DiscoveryService.eventsMap)
      .filter((k) => term === "" || k.toLowerCase().includes(searchTerm))
      .forEach((k) => (result[k] = DiscoveryService.eventsMap[k]));
    return result;
  }

  /**
   * Express handler
   *
   * You can add it
   *
   * @param app Your express app
   * @param prefix Prefix for all discovery url
   * @param permissions Callback to implement CloudEvent permissions
   */
  static express(
    app: any,
    prefix: string = "",
    permissions: (name: string, type: "Service" | "Type", req: any) => boolean = () => true,
  ) {
    /**
     * Based on the spec
     * Note: for each query if the client is not authorized to see any particular
     * entity then that entity MUST be excluded from the response.
     *
     * Therefore we filter events from service as they are an entity
     *
     * TODO Need to confirm this with the group
     */
    const filterTypes = (object: CloudEventV1Service, req: any) => {
      return { ...object, types: object.types.filter((type) => permissions(type.type, "Type", req)) };
    };
    // Implement services listing
    app.get(`${prefix}/services`, (req: any, res: any) => {
      let term = req.query.matching || "";
      res.status(200).json(
        DiscoveryService.searchService(term)
          .filter((service) => permissions(service.name, "Service", req))
          .map((service) => filterTypes(service, req)),
      );
      res.end();
    });
    app.get(new RegExp(prefix + "/services/.+"), (req: any, res: any) => {
      let name = req.url.substr(prefix.length + "/services/".length);
      if (
        // Non existing service
        !DiscoveryService.servicesMap[name] ||
        // User does not have permission
        !permissions(name, "Service", req)
      ) {
        res.status(404).end();
        return;
      }
      res.status(200).json(filterTypes(DiscoveryService.servicesMap[name], req));
    });
    app.get(`${prefix}/types`, (req: any, res: any) => {
      let term = req.query.matching || "";
      let types = DiscoveryService.searchType(term);
      let result: { [key: string]: CloudEventV1Service[] } = {};
      for (let i in types) {
        if (permissions(i, "Type", req)) {
          result[i] = types[i]
            .filter((service) => permissions(service.name, "Service", req))
            .map((service) => filterTypes(service, req));
        }
      }
      res.status(200).json(result);
      res.end();
    });
    app.get(new RegExp(prefix + "/types/.+"), (req: any, res: any) => {
      let name = req.url.substr(prefix.length + "/types/".length);
      if (
        // Non existing type
        !DiscoveryService.eventsMap[name] ||
        // User does not have permission
        !permissions(name, "Type", req)
      ) {
        res.status(404).end();
        return;
      }
      // Filter service and events from service
      let result = DiscoveryService.eventsMap[name]
        .filter((service) => permissions(service.name, "Service", req))
        .map((service) => filterTypes(service, req));
      // If no service with this event is available to the user return 404
      if (result.length === 0) {
        res.status(404).end();
        return;
      }
      res.status(200).json({ [name]: result });
    });
  }
}
