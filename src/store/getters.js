const getters = {
  currentUserID: state => state.currentUserID,
  authed: state => state.authed,
  currentUser: state => state.currentUser,
  whoEdit: state => state.whoEdit,
  // ruts
  indexRuts: state => state.rut.indexRuts,
  showTags: state => state.rut.showTags,
  rutDetail: state => state.rut.rutDetail,
  // Clip
  totalClips: state => state.clip.totalClips,
  currentP: state => state.clip.currentP,
  maxP: state => state.clip.maxP,
  currentClips: state => state.clip.currentClips,
  // Demand
  totalDemands: state => state.demand.totalDemands,
  currentD: state => state.demand.currentD,
  maxD: state => state.demand.maxD,
  currentDemands: state => state.demand.currentDemands,
  demandDetail: state => state.demand.demandDetail,
  // item & reviews
  currentItem: state => state.item.currentItem,
  reviewDetail: state => state.item.reviewDetail,
  searchItems: state => state.item.searchItems,
  itemKeyword: state => state.item.itemKeyword,
  // preload
  createdRuts: state => state.preload.createdRuts,
  onRoads: state => state.preload.onRoads,
  seItems: state => state.preload.seItems,
  // headline
  totalHeadlines: state => state.headline.totalHeadlines,
  currentH: state => state.headline.currentH,
  maxH: state => state.headline.maxH,
  currentHeadlines: state => state.headline.currentHeadlines
}

export default getters
