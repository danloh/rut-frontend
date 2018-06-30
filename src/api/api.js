import axios from '@/main'

let base = '/api'
const request = (url, options = {}, method = 'get') => {
  let key = ~['delete', 'get', 'head'].indexOf(method) ? 'params' : 'data' // bitwise NOT: ~N -> -(N+1)
  return axios(Object.assign({'url': url, 'method': method}, {[key]: options}))
  .then(res => res)
}
// regsiter
const register = data => {
  return request(`${base}/users`, data, 'post')
}
// check name when regsiter
const checkName = (name) => {
  return request(`${base}/checkname/${name}`)
}
// check email when regsiter
const checkEmail = (email) => {
  return request(`${base}/checkemail/${email}`)
}
// confirm email
const confirm = (token) => {
  return request(`${base}/confirm/${token}`)
}
// send reconfirm email
const reConfirmEmail = () => {
  return request(`${base}/confirm`)
}
// change password
const change = (data) => {
  return request(`${base}/changepassword`, data, 'post')
}
// request rest password if forget password
const reqReset = (data) => {
  return request(`${base}/reset`, data, 'post')
}
// rest password per token if forget password
const reset = (token, data) => {
  return request(`${base}/reset/${token}`, data, 'post')
}
// check token if expired
const checkExpired = (token, params) => {
  return request(`${base}/checkifexpired/${token}`, params)
}
// login
const login = params => {
  return request(`${base}/login`, params)
}
// get authed user info
const fetchCurrentUser = params => {
  return request(`${base}/currentuser`, params)
}
// get user info
const fetchUser = (id, params) => {
  return request(`${base}/users/${id}`, params)
}
// get follows
const fetchFolloweds = (userid, params) => {
  return request(`${base}/users/${userid}/followeds`, params)
}
// get a user's activity
const fetchMyActivity = (userid, params) => {
  return request(`${base}/users/${userid}/myactivity`, params)
}
// get feeds
const fetchFeeds = (params) => {
  return request(`${base}/users/feeds`, params)
}
// get heats
const fetchHeats = (userid, params) => {
  return request(`${base}/users/${userid}/eventheat`, params)
}

const editProfile = (params) => {
  return request(`${base}/users`, params, 'put')
}
// check if follow someone
const checkFollowing = (userid, params) => {
  return request(`${base}/users/${userid}/iffollow`, params)
}
// fo / unfo someone
const followOne = (action, userid, params) => {
  let mtd = action === 'follow' ? 'patch' : 'delete'
  return request(`${base}/users/${userid}/follows`, params, mtd)
}
// create new rut
const newRut = params => {
  return request(`${base}/ruts`, params, 'post')
}
// get ruts for index page
const fetchIndexRuts = params => {
  return request(`${base}/ruts/index`, params)
}
// get some working items to challenge page
const fetchChallengeItems = params => {
  return request(`${base}/users/challengeitems`, params)
}
// per created, stared, ..
const fetchProfileRuts = (action, userid, params) => {  // act: created, star
  return request(`${base}/users/${userid}/${action}ruts`, params)
}
// search ruts
const searchRuts = (params) => {
  return request(`${base}/ruts/search`, params)
}
// get a rut
const fetchRut = (rutid, params) => { // !!
  return request(`${base}/ruts/${rutid}`, params)
}
// check if user star  a rut
const checkStar = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/star`, params, 'get')
}
// tag star  a rut
const starRut = (action, rutid, params) => {
  let mtd = action === 'star' ? 'patch' : 'delete'
  return request(`${base}/ruts/${rutid}/stars`, params, mtd)
}
// check rut if locked, when edit rut's tag
const checkRutLocked = (userid, rutid, params) => {
  return request(`${base}/ruts/${rutid}/locked/${userid}`, params)
}
// check rut if editable i.e. unlocked and permitted
const checkEditable = (userid, rutid, params) => {
  return request(`${base}/ruts/${rutid}/editable/${userid}`, params)
}
// unlock rut
const lockRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/lock`, params)
}
// lock rut
const unlockRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/unlock`, params)
}
// edit rut
const editRut = (rutid, params) => {
  return request(`${base}/ruts/${rutid}`, params, 'put')
}
// edit rut credential or epilog
const editRutce = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/ce`, params, 'patch')
}
// edit rut's tags
const editTags = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/tags`, params, 'patch')
}
// add existing item to rut
const itemToRut = (itemid, rutid, params) => {
  return request(`${base}/ruts/${rutid}/items/${itemid}`, params, 'post')
}
// edit tips
const editTips = (cid, params) => {
  return request(`${base}/tips/${cid}`, params, 'put')
}
// delete Tips
const deleteTips = (cid, params) => {
  return request(`${base}/tips/${cid}`, params, 'delete')
}
// create new road
const newRoad = params => {
  return request(`${base}/roads`, params, 'post')
}
// edit road
const editRoad = (roadid, params) => {
  return request(`${base}/roads/${roadid}`, params, 'put')
}
// edit deadline
const editDeadline = (roadid, params) => {
  return request(`${base}/roads/${roadid}/deadline`, params, 'patch')
}
// edit mark in road
const editMark = (gid, params) => {
  return request(`${base}/marks/${gid}`, params, 'put')
}
// delete mark
const deleteMark = (gid, params) => {
  return request(`${base}/marks/${gid}`, params, 'delete')
}
// add item to road
const itemToRoad = (itemid, roadid, params) => {
  return request(`${base}/roads/${roadid}/items/${itemid}`, params, 'post')
}
// convert road to rut
const roadToRut = (roadid, params) => {
  return request(`${base}/road/${roadid}/torut`, params, 'patch')
}
// get a road
const fetchRoad = (roadid, params) => {
  return request(`${base}/roads/${roadid}`, params)
}
// get roads
const fetchRoads = params => {
  return request(`${base}/roads`, params)
}
// get challenging road
const fetchOnRoad = params => {
  return request(`${base}/getonroad`, params)
}
// mark road as done
const markRoadDone = (roadid, params) => {
  return request(`${base}/roads/${roadid}/done`, params, 'patch')
}
// get favored tags
const fetchFavTags = (userid, params) => { // !!
  return request(`${base}/users/${userid}/favtags`, params)
}
// get tag
const fetchTag = (tagname, params) => { // !!
  return request(`${base}/tags/${tagname}`, params)
}
// fetch ruts of a Tag
const fetchTagRuts = (tagname, params) => {
  return request(`${base}/tags/${tagname}/ruts`, params)
}
// fetch demands of a Tag
const fetchTagDemands = (tagname, params) => {
  return request(`${base}/tags/${tagname}/demands`, params)
}
// fetch items of a Tag
const fetchTagItems = (tagname, params) => {
  return request(`${base}/tags/${tagname}/items`, params)
}
// fetch comments of a Tag
const fetchTagComments = (tagname, params) => {
  return request(`${base}/tags/${tagname}/comments`, params)
}
// lock tag
const lockTag = (tagid, params) => {
  return request(`${base}/tags/${tagid}/lock`, params)
}
// unlock tag
const unlockTag = (tagid, params) => {
  return request(`${base}/tags/${tagid}/unlock`, params)
}
// check tag if locked, when edit tag
const checkTagLocked = (userid, tagid, params) => {
  return request(`${base}/tags/${tagid}/locked/${userid}`, params)
}
// edit tag
const editTag = (tagid, params) => {
  return request(`${base}/tags/${tagid}`, params, 'put')
}
// check faving tag
const checkFav = (tagid, params) => {
  return request(`${base}/tags/${tagid}/faver`, params)
}
// fav unfav tag
const favTag = (action, tagid, params) => {
  let mtd = action === 'fav' ? 'patch' : 'delete'
  return request(`${base}/tags/${tagid}/favers`, params, mtd)
}
// get Item
const fetchItem = (itemid, params) => {
  return request(`${base}/items/${itemid}`, params)
}
// fetch reviews of the item
const fetchItemReviews = (itemid, params) => {
  return request(`${base}/items/${itemid}/reviews`, params)
}
// fetch inruts of the item
const fetchInRuts = (itemid, params) => {
  return request(`${base}/items/${itemid}/inruts`, params)
}
// search items
const searchItems = (label, params) => {
  return request(`${base}/items/search/${label}`, params)
}
// lock tag
const lockItem = (itemid, params) => {
  return request(`${base}/items/${itemid}/lock`, params)
}
// unlock item
const unlockItem = (itemid, params) => {
  return request(`${base}/items/${itemid}/unlock`, params)
}
// check item if locked, when edit item
const checkItemLocked = (userid, itemid, params) => {
  return request(`${base}/items/${itemid}/locked/${userid}`, params)
}
// fetch submitted items
const fetchSubmits = (params) => {
  return request(`${base}/items/submitted`, params)
}
// add new item directly, not to list
const newItem = (params) => {
  return request(`${base}/items`, params, 'post')
}
// edit item
const editItem = (itemid, params) => {
  return request(`${base}/items/${itemid}`, params, 'put')
}
// add item's tag
const addItemTag = (itemid, params) => {
  return request(`${base}/items/${itemid}/tags`, params, 'post')
}
// fetch to-dos, doings, dones
const fetchProfileItems = (flag, userid, params) => {
  return request(`${base}/users/${userid}/${flag}items`, params)
}

const checkFlag = (itemid, params) => {
  return request(`${base}/items/${itemid}/flag`, params)
}

const flagItem = (flag, itemid, params) => {
  return request(`${base}/items/${itemid}/flag${flag}`, params, 'patch')
}

const fetchClips = params => {
  return request(`${base}/clips`, params)
}

const newClip = params => {
  return request(`${base}/clips`, params, 'post')
}
// upvote clip
const upvoteClip = (clipid, params) => {
  return request(`${base}/clips/${clipid}/voters`, params, 'patch')
}
// create review
const newReview = params => {
  return request(`${base}/reviews`, params, 'post')
}
// fetch review
const fetchReview = (reviewid, params) => {
  return request(`${base}/reviews/${reviewid}`, params)
}
// fetch review's comments
const fetchReviewComments = (reviewid, params) => {
  return request(`${base}/reviews/${reviewid}/comments`, params)
}
// edit review
const editReview = (reviewid, params) => {
  return request(`${base}/reviews/${reviewid}`, params, 'put')
}
// upvote review
const upvoteReview = (reviewid, params) => {
  return request(`${base}/reviews/${reviewid}/voters`, params, 'patch')
}
// fetch user's demands
const fetchProfileDemands = (userid, params) => {
  return request(`${base}/users/${userid}/demands`, params)
}
// get demand list
const fetchDemands = (params) => {
  return request(`${base}/demands`, params)
}
// get a demand only
const fetchOnlyDemand = (demandid, params) => {
  return request(`${base}/demand/${demandid}`, params)
}
// get specific demand
const fetchDemand = (demandid, params) => {
  return request(`${base}/demands/${demandid}`, params)
}
// get comments of specific demand
const fetchDemandComments = (demandid, params) => {
  return request(`${base}/demands/${demandid}/comments`, params)
}
// get answers of specific demand
const fetchDemandAnswers = (demandid, params) => {
  return request(`${base}/demands/${demandid}/answers`, params)
}
// submit new demand
const newDemand = params => {
  return request(`${base}/demands`, params, 'post')
}
// upvote demand
const upvoteDemand = (demandid, params) => {
  return request(`${base}/demands/${demandid}/voters`, params, 'patch')
}
// link a rut to demand as Answer
const rutAsAnswer = (rutid, demandid, params) => {
  return request(`${base}/demands/${demandid}/ruts/${rutid}`, params, 'patch')
}
// post new comment
const newComment = (ref, id, params) => {
  return request(`${base}/comment/${ref}/${id}`, params, 'post')
}
// upvote comment
const upvoteComment = (commentid, params) => {
  return request(`${base}/comments/${commentid}/voters`, params, 'patch')
}
// get comments for a rut
const fetchRutComments = (rutid, params) => {
  return request(`${base}/ruts/${rutid}/comments`, params)
}
// get circles for a rut
const fetchCircles = params => {
  return request(`${base}/circles`, params)
}
// post new circle
const postCircle = params => {
  return request(`${base}/circles`, params, 'post')
}
// edit circle
const editCircle = (cid, params) => {
  return request(`${base}/circles/${cid}`, params, 'put')
}
// disable circle
const disCircle = (cid, params) => {
  return request(`${base}/circles/${cid}/disabled`, params, 'patch')
}
// get headline list
const fetchHeadlines = (params) => {
  return request(`${base}/headlines`, params)
}
// get headline
const fetchHeadline = (headlineid, params) => {
  return request(`${base}/headlines/${headlineid}`, params)
}
// get comments of a headline
const fetchHlComments = (headlineid, params) => {
  return request(`${base}/headlines/${headlineid}/comments`, params)
}
// post new headline
const newHeadline = params => {
  return request(`${base}/headlines`, params, 'post')
}
// edit headline
const editArticle = (articleid, params) => {
  return request(`${base}/headlines/${articleid}`, params, 'put')
}
// upvote headline
const upvoteHeadline = (headlineid, params) => {
  return request(`${base}/headlines/${headlineid}/voters`, params, 'patch')
}
// just for error test
const testError = (params) => {
  return request(`${base}/testerror`, params)
}

export {
  testError,
  axios,
  register,
  checkName,
  checkEmail,
  confirm,
  change,
  reqReset,
  reset,
  checkExpired,
  login,
  reConfirmEmail,
  fetchCurrentUser,
  fetchUser,
  fetchFolloweds,
  fetchMyActivity,
  fetchFeeds,
  fetchHeats,
  editProfile,
  checkFollowing,
  followOne,
  newRut,
  fetchIndexRuts,
  fetchChallengeItems,
  fetchProfileRuts,
  searchRuts,
  fetchRut,
  fetchRutComments,
  fetchCircles,
  postCircle,
  editCircle,
  disCircle,
  checkStar,
  starRut,
  checkRutLocked,
  checkEditable,
  lockRut,
  unlockRut,
  editRut,
  editRutce,
  editTags,
  itemToRut,
  editTips,
  deleteTips,
  newRoad,
  editRoad,
  editDeadline,
  editMark,
  deleteMark,
  itemToRoad,
  fetchRoad,
  fetchRoads,
  fetchOnRoad,
  markRoadDone,
  roadToRut,
  fetchFavTags,
  fetchTag,
  fetchTagRuts,
  fetchTagDemands,
  fetchTagItems,
  fetchTagComments,
  lockTag,
  unlockTag,
  checkTagLocked,
  editTag,
  checkFav,
  favTag,
  fetchItem,
  fetchItemReviews,
  fetchInRuts,
  checkFlag,
  flagItem,
  searchItems,
  lockItem,
  unlockItem,
  checkItemLocked,
  fetchSubmits,
  newItem,
  editItem,
  addItemTag,
  fetchProfileItems,
  fetchClips,
  newReview,
  fetchReview,
  fetchReviewComments,
  editReview,
  upvoteReview,
  fetchProfileDemands,
  fetchDemands,
  fetchOnlyDemand,
  fetchDemand,
  fetchDemandComments,
  fetchDemandAnswers,
  newClip,
  upvoteClip,
  newDemand,
  upvoteDemand,
  rutAsAnswer,
  newComment,
  upvoteComment,
  fetchHeadlines,
  fetchHeadline,
  fetchHlComments,
  newHeadline,
  editArticle,
  upvoteHeadline
}
