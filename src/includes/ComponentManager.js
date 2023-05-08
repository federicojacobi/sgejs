const components = new Map();
let entityManager;
export default class ComponentManager {
	constructor( _entityManager ) {
		if ( _entityManager ) {
			entityManager = _entityManager;
		} else {
			throw 'You must specify an Entity Manager when creating a component manager';
		}
	}

	// add( eid, component ) {
	// 	const typeName = component.constructor.name;
	// 	const componentList = components.get( typeName ) || [];
	// 	componentList.push( { eid, component } );
	// 	components.set( typeName, componentList );

	// 	return this;
	// }
	
	add( eid, component ) {
		const typeName = component.constructor.name;
		const componentList = components.get( eid ) || new Map();
		componentList.set( typeName, component );
		components.set( eid, componentList );

		return this;
	}

	remove( entityId, componentType ) {
		const typeName = componentType.name;
		const componentList = components.get( typeName ) || [];
		const index = componentList.findIndex( (entry) => entry.entityId === entityId );
		if ( index >= 0 ) {
		  componentList.splice( index, 1 );
		}
	}

	getComponentsByEntity( eid ) {
		if ( components.has( eid ) ) {
			return components.get( eid );
		}

		return null;
	}

	/**
	 * 
	 * @param {String[]} componentTypes A list of component types to query
	 * @returns An array of ALL the components for an entity that matches the query
	 */
	query( componentTypes ) {
		let entities = entityManager.getAll();

		if ( ! componentTypes ) {
			componentTypes = [];
		}

		const result = [];
		entities.forEach( e => {
			const map = components.get( e );
			for ( let i = 0; i < componentTypes.length; i++ ) {
				if ( ! map.has( componentTypes[i] ) ) {
					return;
				}
			}
			
			result.push( components.get( e ) );
		} );
		return result;
	}

	getEntitiesByComponents( componentTypes ) {
		let result = entityManager.getAll();

		if ( ! componentTypes ) {
			return result;
		}

		componentTypes.forEach( ( componentTypeName ) => {
			result = result.filter( 
				entity => components.has( entity ) && components.get( entity ).has( componentTypeName )
			);
		} );

		return result;
	}
}