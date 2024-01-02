import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'


export const msgService = {
  add,
  query,
  remove
}

function query(filterBy) {
  var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}`;
  console.log(filterBy);
  if (filterBy.aboutChannelId) {
    queryStr += `&aboutChannelId=${filterBy.aboutChannelId}`;
  }

  return httpService.get(`msg`, filterBy);
  // return httpService.get(`review${queryStr}`);
}


async function remove(msgId) {
  await httpService.delete(`msg/${msgId}`)
  // await storageService.remove('review', reviewId)
}

async function add( newMsg ) {
  
  const addedMsg = await httpService.post(`msg`,  newMsg )

  
  return addedMsg
}