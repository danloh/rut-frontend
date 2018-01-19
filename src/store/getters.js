const getters = {
  currentUserID: state => state.currentUserID,
  authed: state => state.authed,
  currentUser: state => state.currentUser,
  nexturl: state => state.route.path,
  whoEdit: state => state.whoEdit,
  // ruts
  allRuts: state => state.rut.allRuts,
  totalRuts: state => state.rut.totalRuts,
  currentPage: state => state.rut.currentPage,
  currentRuts: state => state.rut.currentRuts,
  maxPage: state => state.rut.maxPage,
  showTags: state => state.rut.showTags,
  rutDetail: state => state.rut.rutDetail,
  tagDetail: state => state.rut.tagDetail,
  // Clip
  totalClips: state => state.clip.totalClips,
  currentP: state => state.clip.currentP,
  currentClips: state => state.clip.currentClips,
  maxP: state => state.clip.maxP,
  // Demand
  totalDemands: state => state.demand.totalDemands,
  currentD: state => state.demand.currentD,
  currentDemands: state => state.demand.currentDemands,
  demandDetail: state => state.demand.demandDetail,
  maxD: state => state.demand.maxD,
  // item & reviews
  totalItems: state => state.item.totalItems,
  currentItems: state => state.item.currentItems,
  currentItem: state => state.item.currentItem,
  currentR: state => state.item.currentR,
  maxR: state => state.item.maxR,
  inRuts: state => state.item.inRuts,
  reviewDetail: state => state.item.reviewDetail
}

export default getters
