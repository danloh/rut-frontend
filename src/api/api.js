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
// get one challenge rut
const fetchChallengeRut = params => {
  return request(`${base}/challengerut`, params)
}
// get some working on items to challenge page
const fetchChallengeItems = params => {
  return request(`${base}/challengeitems`, params)
}
// set challenge deadline
const setDeadline = params => {
  return request(`${base}/setdeadline`, params)
}

const fetchProfileRuts = (action, userid, params) => {  // act: created, challenge, star
  return request(`${base}/${userid}/${action}/ruts`, params)
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
// get challengers of a rut response to
const fetchRutChallengers = (rutid, params) => {
  return request(`${base}/rut/${rutid}/challengers`, params)
}
// check if user star or challenge a rut
const checkSC = (rutid, action, params) => {
  return request(`${base}/check${action}/rut/${rutid}`, params)
}
// tag star or challenge a rut
const scRut = (action, rutid, params) => {
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
// edit rut's tags
const editTags = (rutid, params) => {
  return request(`${base}/edittags/${rutid}`, params, 'post')
}
// add item to rut, new or check existing
const addItem = (rutid, params) => {
  return request(`${base}/additemtorut/${rutid}`, params, 'post')
}
// add existing item to rut
const itemToRut = (itemid, rutid, params) => {
  return request(`${base}/item/${itemid}/torut/${rutid}`, params)
}
// check item to add
const checkItem = (rutid, params) => {
  return request(`${base}/checkitemtoadd/${rutid}`, params, 'post')
}
// edit tips
const editTips = (cid, params) => {
  return request(`${base}/edittips/${cid}`, params, 'post')
}
// delete Tips
const deleteTips = (cid, params) => {
  return request(`${base}/del/tips/${cid}`, params)
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
// edit item
const editItem = (itemid, params) => {
  return request(`${base}/edititem/${itemid}`, params, 'post')
}

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
// for specific item or user
const fetchIUClips = params => {
  return request(`${base}/iuclips`, params)
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
const fetchRutCircles = (rutid, params) => {
  return request(`${base}/rut/${rutid}/circles`, params)
}
// post new circle
const postCircle = (rutid, params) => {
  return request(`${base}/newcircle/rut/${rutid}`, params, 'post')
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
  fetchChallengeRut,
  fetchChallengeItems,
  setDeadline,
  fetchProfileRuts,
  fetchRut,
  fetchRutTips,
  fetchRutDemands,
  fetchRutComments,
  fetchRutCircles,
  fetchRutChallengers,
  checkSC,
  scRut,
  checkRutLocked,
  checkEditable,
  lockRut,
  unlockRut,
  editRut,
  editTags,
  addItem,
  itemToRut,
  checkItem,
  editTips,
  deleteTips,
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
  lockItem,
  unlockItem,
  checkItemLocked,
  editItem,
  fetchProfileItems,
  fetchClips,
  fetchIUClips,
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
  postCircle
}
