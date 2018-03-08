import axios from '@/main'

let base = '/api'
const request = (url, options = {}, method = 'get') => {
  let key = ~['delete', 'get', 'head'].indexOf(method) ? 'params' : 'data' // bitwise NOT: ~N -> -(N+1)
  return axios(Object.assign({'url': url, 'method': method}, {[key]: options}))
  .then(res => res)
}
// regsiter
const register = data => {
  return request(`${base}/register`, data, 'post')
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
  return request(`${base}/user/${id}`, params)
}
// get follows
const fetchFollows = (userid, follow, params) => {
  return request(`${base}/user/${userid}/${follow}`, params)
}
// get a user's activity
const fetchMyActivity = (userid, params) => {
  return request(`${base}/${userid}/myactivity`, params)
}
// get feeds
const fetchFeeds = (params) => {
  return request(`${base}/feeds`, params)
}

const editProfile = (params) => {
  return request(`${base}/editprofile`, params, 'post')
}
// check if follow someone
const checkFollowing = (userid, params) => {
  return request(`${base}/checkfollow/${userid}`, params)
}
// fo / unfo someone
const followOne = (action, userid, params) => {
  return request(`${base}/${action}/user/${userid}`, params)
}
// create new rut
const newRut = (params, demandid) => {
  return request(`${base}/create/${demandid}`, params, 'post')
}
// get ruts for index page
const fetchIndexRuts = params => {
  return request(`${base}/index/ruts`, params)
}
// get some working on items to challenge page
const fetchChallengeItems = params => {
  return request(`${base}/challengeitems`, params)
}
// per created, stared, ..
const fetchProfileRuts = (action, userid, params) => {  // act: created, star
  return request(`${base}/${userid}/${action}/ruts`, params)
}
// search ruts
const searchRuts = (params) => {
  return request(`${base}/searchruts`, params)
}
// get a rut
const fetchRut = (rutid, params) => { // !!
  return request(`${base}/rut/${rutid}`, params)
}
// get more tips of a rut
const fetchRutTips = (rutid, params) => {
  return request(`${base}/rut/${rutid}/tips`, params)
}
// get demands of a rut response to
const fetchRutDemands = (rutid, params) => {
  return request(`${base}/rut/${rutid}/demands`, params)
}
// check if user star  a rut
const checkStar = (rutid, action, params) => {
  return request(`${base}/check${action}/rut/${rutid}`, params)
}
// tag star  a rut
const starRut = (action, rutid, params) => {
  return request(`${base}/${action}/rut/${rutid}`, params)
}
// check rut if locked, when edit rut's tag
const checkRutLocked = (userid, rutid, params) => {
  return request(`${base}/checkifrut/${rutid}/lockedto/${userid}`, params)
}
// check rut if editable i.e. unlocked and permitted
const checkEditable = (userid, rutid, params) => {
  return request(`${base}/checkif/${userid}/caneditrut/${rutid}`, params)
}
// unlock rut
const lockRut = (rutid, params) => {
  return request(`${base}/lockrut/${rutid}`, params)
}
// lock rut
const unlockRut = (rutid, params) => {
  return request(`${base}/unlockrut/${rutid}`, params)
}
// edit rut
const editRut = (rutid, params) => {
  return request(`${base}/editrut/${rutid}`, params, 'post')
}
// edit rut credential or epilog
const editRutce = (rutid, params) => {
  return request(`${base}/editrutce/${rutid}`, params, 'post')
}
// edit rut's tags
const editTags = (rutid, params) => {
  return request(`${base}/edittags/${rutid}`, params, 'post')
}
// add existing item to rut
const itemToRut = (itemid, rutid, params) => {
  return request(`${base}/item/${itemid}/torut/${rutid}`, params, 'post')
}
// edit tips
const editTips = (cid, params) => {
  return request(`${base}/edittips/${cid}`, params, 'post')
}
// delete Tips
const deleteTips = (cid, params) => {
  return request(`${base}/del/tips/${cid}`, params)
}
// create new road
const newRoad = params => {
  return request(`${base}/newroad`, params, 'post')
}
// edit road
const editRoad = (roadid, params) => {
  return request(`${base}/editroad/${roadid}`, params, 'post')
}
// edit deadline
const editDeadline = (roadid, params) => {
  return request(`${base}/resetdeadline/${roadid}`, params)
}
// edit mark in road
const editMark = (gid, params) => {
  return request(`${base}/editmark/${gid}`, params, 'post')
}
// delete mark
const deleteMark = (gid, params) => {
  return request(`${base}/delmark/${gid}`, params)
}
// add item to road
const itemToRoad = (itemid, roadid, params) => {
  return request(`${base}/item/${itemid}/toroad/${roadid}`, params, 'post')
}
// get a road
const fetchRoad = (roadid, params) => {
  return request(`${base}/road/${roadid}`, params)
}
// get roads
const fetchRoads = (userid, params) => {
  return request(`${base}/${userid}/roads`, params)
}
// get challenging road
const fetchOnRoad = params => {
  return request(`${base}/getonroad`, params)
}
// mark road as done
const markRoadDone = (roadid, params) => {
  return request(`${base}/markasdone/${roadid}`, params)
}
// get all roads
const fetchAllRoads = (userid, params) => {
  return request(`${base}/${userid}/allroads`, params)
}
// get favored tags
const fetchFavTags = (userid, params) => { // !!
  return request(`${base}/${userid}/fav/tags`, params)
}
// get tag
const fetchTag = (tagid, params) => { // !!
  return request(`${base}/tag/${tagid}`, params)
}
// fetch ruts of a Tag
const fetchTagRuts = (tagid, params) => { // !!
  return request(`${base}/tag/${tagid}/ruts`, params)
}
// lock tag
const lockTag = (tagid, params) => {
  return request(`${base}/locktag/${tagid}`, params)
}
// unlock tag
const unlockTag = (tagid, params) => {
  return request(`${base}/unlocktag/${tagid}`, params)
}
// check tag if locked, when edit tag
const checkTagLocked = (userid, tagid, params) => {
  return request(`${base}/checkiftag/${tagid}/lockedto/${userid}`, params)
}
// edit tag
const editTag = (tagid, params) => {
  return request(`${base}/edittag/${tagid}`, params, 'post')
}
// check faving tag
const checkFav = (tagid, params) => {
  return request(`${base}/checkfavtag/${tagid}`, params)
}
// fav unfav tag
const favTag = (action, tagid, params) => {
  return request(`${base}/${action}/tag/${tagid}`, params)
}
// get Item
const fetchItem = (itemid, params) => {
  return request(`${base}/item/${itemid}`, params)
}
// fetch reviews of the item
const fetchItemReviews = (itemid, params) => {
  return request(`${base}/item/${itemid}/reviews`, params)
}
// fetch inruts of the item
const fetchInRuts = (itemid, params) => {
  return request(`${base}/item/${itemid}/inruts`, params)
}
// search items
const searchItems = (label, params) => {
  return request(`${base}/search/${label}/items`, params)
}
// lock tag
const lockItem = (itemid, params) => {
  return request(`${base}/lockitem/${itemid}`, params)
}
// unlock item
const unlockItem = (itemid, params) => {
  return request(`${base}/unlockitem/${itemid}`, params)
}
// check item if locked, when edit item
const checkItemLocked = (userid, itemid, params) => {
  return request(`${base}/checkifitem/${itemid}/lockedto/${userid}`, params)
}
// add new item directly, not to list
const newItem = (params) => {
  return request(`${base}/newitem`, params, 'post')
}
// edit item
const editItem = (itemid, params) => {
  return request(`${base}/edititem/${itemid}`, params, 'post')
}
// fetch to-dos, doings, dones
const fetchProfileItems = (flag, userid, params) => {
  return request(`${base}/${userid}/${flag}/items`, params)
}

const checkFlag = (itemid, params) => {
  return request(`${base}/checkflag/item/${itemid}`, params)
}

const flagItem = (flag, itemid, params) => {
  return request(`${base}/flag${flag}/item/${itemid}`, params)
}

const fetchClips = params => {
  return request(`${base}/clips`, params)
}

const newClip = params => {
  return request(`${base}/newclip`, params, 'post')
}
// upvote clip
const upvoteClip = (clipid, params) => {
  return request(`${base}/upvoteclip/${clipid}`, params)
}
// create review
const newReview = (itemid, params) => {
  return request(`${base}/newreview/${itemid}`, params, 'post')
}
// fetch review
const fetchReview = (reviewid, params) => {
  return request(`${base}/review/${reviewid}`, params)
}
// fetch review's comments
const fetchReviewComments = (reviewid, params) => {
  return request(`${base}/review/${reviewid}/comments`, params)
}
// edit review
const editReview = (reviewid, params) => {
  return request(`${base}/editreview/${reviewid}`, params, 'post')
}
// upvote review
const upvoteReview = (reviewid, params) => {
  return request(`${base}/upvotereview/${reviewid}`, params)
}
// fetch user's review
const fetchProfileReviews = (userid, params) => {
  return request(`${base}/user/${userid}/reviews`, params)
}
// fetch user's demands
const fetchProfileDemands = (userid, params) => {
  return request(`${base}/user/${userid}/demands`, params)
}
// get demand list
const fetchDemands = (params) => {
  return request(`${base}/demands`, params)
}
// get a demand only
const fetchOnlyDemand = (demandid, params) => {
  return request(`${base}/onlydemand/${demandid}`, params)
}
// get specific demand
const fetchDemand = (demandid, params) => {
  return request(`${base}/demand/${demandid}`, params)
}
// get comments of specific demand
const fetchDemandComments = (demandid, params) => {
  return request(`${base}/demand/${demandid}/comments`, params)
}
// get answers of specific demand
const fetchDemandAnswers = (demandid, params) => {
  return request(`${base}/demand/${demandid}/answers`, params)
}
// submit new demand
const newDemand = params => {
  return request(`${base}/newdemand`, params, 'post')
}
// upvote demand
const upvoteDemand = (demandid, params) => {
  return request(`${base}/upvotedemand/${demandid}`, params)
}
// link a rut to demand as Answer
const rutAsAnswer = (rutid, demandid, params) => {
  return request(`${base}/rut/${rutid}/answerdemand/${demandid}`, params)
}
// post new comment
const newComment = (ref, id, params) => {
  return request(`${base}/comment/${ref}/${id}`, params, 'post')
}
// get comments for a rut
const fetchRutComments = (rutid, params) => {
  return request(`${base}/commentsonrut/${rutid}`, params)
}
// get circles for a rut
const fetchCircles = params => {
  return request(`${base}/circles`, params)
}
// post new circle
const postCircle = params => {
  return request(`${base}/newcircle`, params, 'post')
}
// edit circle
const editCircle = (cid, params) => {
  return request(`${base}/editcircle/${cid}`, params, 'post')
}
// del circle
const delCircle = (cid, params) => {
  return request(`${base}/delcircle/${cid}`, params)
}
// get headline list
const fetchHeadlines = (params) => {
  return request(`${base}/headlines`, params)
}
// get headline
const fetchHeadline = (headlineid, params) => {
  return request(`${base}/headline/${headlineid}`, params)
}
// get comments of a headline
const fetchHlComments = (headlineid, params) => {
  return request(`${base}/headline/${headlineid}/comments`, params)
}
// post new headline
const newHeadline = params => {
  return request(`${base}/newheadline`, params, 'post')
}
// upvote headline
const upvoteHeadline = (headlineid, params) => {
  return request(`${base}/upvoteheadline/${headlineid}`, params)
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
  fetchFollows,
  fetchMyActivity,
  fetchFeeds,
  editProfile,
  checkFollowing,
  followOne,
  newRut,
  fetchIndexRuts,
  fetchChallengeItems,
  fetchProfileRuts,
  searchRuts,
  fetchRut,
  fetchRutTips,
  fetchRutDemands,
  fetchRutComments,
  fetchCircles,
  postCircle,
  editCircle,
  delCircle,
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
  fetchAllRoads,
  fetchOnRoad,
  markRoadDone,
  fetchFavTags,
  fetchTag,
  fetchTagRuts,
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
  newItem,
  editItem,
  fetchProfileItems,
  fetchClips,
  newReview,
  fetchReview,
  fetchReviewComments,
  editReview,
  upvoteReview,
  fetchProfileReviews,
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
  fetchHeadlines,
  fetchHeadline,
  fetchHlComments,
  newHeadline,
  upvoteHeadline
}
