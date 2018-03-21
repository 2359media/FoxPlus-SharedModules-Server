/**
 * Interface for mapping action and method to add to router
 */
export interface RouteMapper {
    method: string;
    action: string;
    collection: boolean;
}
