import { mockUsers } from "./mockData.mjs";
export const userResolveToGetId = (request, response, next) => {
     const { params: {id}} = request;
     const parseId = parseInt(id);
     if(isNaN(parseId)) return response.status(400).send({msg: 'Bad request. Invalid ID.'});
     const getIndexToUpdate = mockUsers.findIndex(user => user.id === parseId);
     if(getIndexToUpdate === -1) return response.sendStatus(404);
     request.getIndexToUpdate = getIndexToUpdate;
     next()
}