
export const filterToQuery = (searchText,nameField) => ({[nameField]:{"like":searchText,"options":"i"}})

export const querySearchTextInsensitive = searchText => ({like:searchText,options:'i'});

