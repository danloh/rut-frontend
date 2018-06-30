const getters = {
  currentUserID: state => state.currentUserID,
  authed: state => state.authed,
  currentUser: state => state.currentUser,
  whoEdit: state => state.whoEdit,
  heat: state => state.heat,
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
  // item
  currentItem: state => state.item.currentItem,
  searchItems: state => state.item.searchItems,
  itemKeyword: state => state.item.itemKeyword,
  // preload
  createdRuts: state => state.preload.createdRuts,
  onRoads: state => state.preload.onRoads,
  seItems: state => state.preload.seItems,
  // article
  totalArticles: state => state.article.totalArticles,
  currentH: state => state.article.currentH,
  maxH: state => state.article.maxH,
  currentArticle: state => state.article.currentArticle,
  currentArticles: state => state.article.currentArticles
}

export default getters
