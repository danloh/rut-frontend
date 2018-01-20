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
  maxPage: state => state.rut.maxPage,
  currentRuts: state => state.rut.currentRuts,
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
  reviewDetail: state => state.item.reviewDetail
}

export default getters
