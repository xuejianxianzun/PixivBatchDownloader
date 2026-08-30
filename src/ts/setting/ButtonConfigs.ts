import { LangTextKey } from '../langText'

/** 按钮的一级分类 */
type ButtonCategoryLevel1 = 'startCrawl' | 'downloadArea' | 'extraFeatures'

/** 按钮分类的 schema，与设置项的 CategorySchema 结构类似 */
type ButtonCategorySchema = {
  [key in ButtonCategoryLevel1]: {
    /** 一级分类的 ID */
    id: ButtonCategoryLevel1
    /** 一级分类的顺序 */
    order: number
    /** 一级分类的名称的 i18n 的 key */
    nameKey: LangTextKey
    /** 二级分类 */
    level2: {
      /** 二级分类的 ID */
      [key: string]: {
        /** 二级分类的 ID */
        id: string
        /** 二级分类的顺序 */
        order: number
        /** 二级分类的名称的 i18n 的 key */
        nameKey: LangTextKey
      }
    }
  }
}

/** 每个按钮的元数据。新增按钮时在这里添加一条记录，wiki 链接的分类会自动生成 */
type ButtonMeta = {
  /** 按钮的 ID */
  id: string
  /** 按钮名称的 i18n 的 key，与创建该按钮时传入的 text 参数一致 */
  nameKey: LangTextKey
  /** 所属的一级分类 */
  categoryLevel1: ButtonCategoryLevel1
  /** 所属的二级分类 */
  categoryLevel2: string
}

/** 把所有按钮按照分类层级进行组织 */
type ButtonsByCategory = {
  /** 一级分类的 ID */
  [key in ButtonCategoryLevel1]: {
    /** 二级分类的 ID，值是该分类里的所有按钮的 ID 列表 */
    [key: string]: {
      ids: string[]
    }
  }
}

/** 保存所有按钮以及分类的元数据。Wiki.ts 会根据这里的配置自动生成按钮的 Wiki 链接结构 */
class ButtonConfigs {
  /** 所有一级分类和二级分类的 schema 信息 */
  public categorySchema: ButtonCategorySchema = {
    startCrawl: {
      id: 'startCrawl',
      order: 0,
      nameKey: '_开始抓取',
      level2: {
        General: {
          id: 'General',
          order: 0,
          nameKey: '_通用',
        },
        HomePage: {
          id: 'HomePage',
          order: 1,
          nameKey: '_首页',
        },
        WorkPage: {
          id: 'WorkPage',
          order: 2,
          nameKey: '_作品页面',
        },
        NovelSeriesPage: {
          id: 'NovelSeriesPage',
          order: 3,
          nameKey: '_系列小说页面',
        },
        SearchPage: {
          id: 'SearchPage',
          order: 4,
          nameKey: '_搜索页面',
        },
        Ranking: {
          id: 'Ranking',
          order: 5,
          nameKey: '_排行榜',
        },
        Discover: {
          id: 'Discover',
          order: 6,
          nameKey: '_发现',
        },
        FollowingPage: {
          id: 'FollowingPage',
          order: 7,
          nameKey: '_关注页面',
        },
        ContestPage: {
          id: 'ContestPage',
          order: 8,
          nameKey: '_比赛页面',
        },
        Dashboard: {
          id: 'Dashboard',
          order: 9,
          nameKey: '_仪表盘',
        },
        BookmarkDetails: {
          id: 'BookmarkDetails',
          order: 10,
          nameKey: '_书签详情',
        },
        pixivision: {
          id: 'pixivision',
          order: 11,
          nameKey: '_pixivision',
        },
        UserRequest: {
          id: 'UserRequest',
          order: 12,
          nameKey: '_用户的约稿页面',
        },
      },
    },
    downloadArea: {
      id: 'downloadArea',
      order: 1,
      nameKey: '_下载区域',
      level2: {
        CrawlResults: {
          id: 'CrawlResults',
          order: 0,
          nameKey: '_抓取结果',
        },
        DownloadControl: {
          id: 'DownloadControl',
          order: 1,
          nameKey: '_下载控制',
        },
      },
    },
    extraFeatures: {
      id: 'extraFeatures',
      order: 2,
      nameKey: '_附加功能',
      level2: {
        HomePage: {
          id: 'HomePage',
          order: 0,
          nameKey: '_首页',
        },
        UserPage: {
          id: 'UserPage',
          order: 1,
          nameKey: '_用户页面',
        },
        SearchPage: {
          id: 'SearchPage',
          order: 2,
          nameKey: '_搜索页面',
        },
        BookmarkPage: {
          id: 'BookmarkPage',
          order: 3,
          nameKey: '_书签页面',
        },
        FollowingPage: {
          id: 'FollowingPage',
          order: 4,
          nameKey: '_关注页面',
        },
      },
    },
  }

  /** 所有按钮的元数据列表 */
  public buttonList: ButtonMeta[] = [
    // startCrawl - General
    {
      id: 'startCrawling',
      nameKey: '_开始抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'stopCrawling',
      nameKey: '_停止抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'scheduleCrawling',
      nameKey: '_定时抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'cancelScheduledCrawling',
      nameKey: '_取消定时抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'manuallySelectWork',
      nameKey: '_手动选择作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'selectAllWorks',
      nameKey: '_全选当前显示的作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'crawlSelectedWork',
      nameKey: '_抓取选择的作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'clearSelectedWork',
      nameKey: '_清空选择的作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'excludeWork',
      nameKey: '_手动排除作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    {
      id: 'clearExcludedWork',
      nameKey: '_清空排除的作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'General',
    },
    // startCrawl - HomePage
    {
      id: 'crawlById',
      nameKey: '_输入id进行抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'HomePage',
    },
    {
      id: 'crawlIdRange',
      nameKey: '_抓取id区间',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'HomePage',
    },
    {
      id: 'importIDList',
      nameKey: '_导入ID列表',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'HomePage',
    },
    // startCrawl - WorkPage
    {
      id: 'startCrawlingFromCurrentPageNew',
      nameKey: '_从本页开始抓取new',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'WorkPage',
    },
    {
      id: 'startCrawlingFromCurrentPageOld',
      nameKey: '_从本页开始抓取old',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'WorkPage',
    },
    {
      id: 'crawlRelatedWork',
      nameKey: '_抓取相关作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'WorkPage',
    },
    {
      id: 'downloadRecommendedWorks',
      nameKey: '_下载推荐作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'WorkPage',
    },
    // startCrawl - NovelSeriesPage
    {
      id: 'crawlSeriesNovel',
      nameKey: '_抓取系列小说',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'NovelSeriesPage',
    },
    {
      id: 'mergeSeriesNovel',
      nameKey: '_合并系列小说',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'NovelSeriesPage',
    },
    // startCrawl - SearchPage
    {
      id: 'crawlTagList',
      nameKey: '_抓取标签列表',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'SearchPage',
    },
    {
      id: 'filterResults',
      nameKey: '_在结果中筛选',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'SearchPage',
    },
    {
      id: 'clearMultiImageWork',
      nameKey: '_清除多图作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'SearchPage',
    },
    {
      id: 'clearUgoiraWork',
      nameKey: '_清除动图作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'SearchPage',
    },
    {
      id: 'manuallyDeleteWork',
      nameKey: '_手动删除作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'SearchPage',
    },
    // startCrawl - Ranking
    {
      id: 'crawlRankingWork',
      nameKey: '_抓取本排行榜作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'Ranking',
    },
    {
      id: 'crawlDebutWork',
      nameKey: '_抓取首次登场的作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'Ranking',
    },
    {
      id: 'crawlCurrentPageWork',
      nameKey: '_抓取本页作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'Ranking',
    },
    // startCrawl - Discover
    {
      id: 'crawlCurrentWork',
      nameKey: '_抓取当前作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'Discover',
    },
    // startCrawl - FollowingPage
    {
      id: 'startCrawlingInFollowingPage',
      nameKey: '_开始抓取',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'FollowingPage',
    },
    // startCrawl - ContestPage
    {
      id: 'crawlApplicationWork',
      nameKey: '_抓取应募作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'ContestPage',
    },
    {
      id: 'crawlWinningWork',
      nameKey: '_抓取获奖作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'ContestPage',
    },
    // startCrawl - Dashboard
    {
      id: 'exportDashboardData',
      nameKey: '_导出作品数据CSV',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'Dashboard',
    },
    // startCrawl - BookmarkDetails
    {
      id: 'crawlSimilarImage',
      nameKey: '_抓取相似图片',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'BookmarkDetails',
    },
    // startCrawl - pixivision
    {
      id: 'crawlImagesOnThisPage',
      nameKey: '_抓取该页面的图片',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'pixivision',
    },
    // startCrawl - UserRequest
    {
      id: 'startCrawlRequestWorks',
      nameKey: '_抓取约稿作品',
      categoryLevel1: 'startCrawl',
      categoryLevel2: 'UserRequest',
    },
    // downloadArea - CrawlResults
    {
      id: 'importCrawlResults',
      nameKey: '_导入抓取结果',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'CrawlResults',
    },
    {
      id: 'exportCrawlResultsJSON',
      nameKey: '_导出抓取结果',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'CrawlResults',
    },
    {
      id: 'exportCrawlResultsCSV',
      nameKey: '_导出csv',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'CrawlResults',
    },
    {
      id: 'previewFileName',
      nameKey: '_预览文件名',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'CrawlResults',
    },
    {
      id: 'copyURLs',
      nameKey: '_复制url',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'CrawlResults',
    },
    // downloadArea - DownloadControl
    {
      id: 'startDownload',
      nameKey: '_开始下载',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'DownloadControl',
    },
    {
      id: 'pauseDownload',
      nameKey: '_暂停下载',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'DownloadControl',
    },
    {
      id: 'stopDownload',
      nameKey: '_停止下载',
      categoryLevel1: 'downloadArea',
      categoryLevel2: 'DownloadControl',
    },
    // extraFeatures - HomePage
    {
      id: 'clearSavedCrawlResult',
      nameKey: '_清空已保存的抓取结果',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'HomePage',
    },
    // extraFeatures - UserPage
    {
      id: 'saveUserAvatar',
      nameKey: '_保存用户头像',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'UserPage',
    },
    {
      id: 'saveUserAvatarAsIcon',
      nameKey: '_保存用户头像为图标',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'UserPage',
    },
    {
      id: 'saveUserCoverImage',
      nameKey: '_保存用户封面',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'UserPage',
    },
    {
      id: 'bookmarkAllWorksOnPage',
      nameKey: '_收藏本页面的所有作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'UserPage',
    },
    // extraFeatures - SearchPage
    {
      id: 'bookmarkAllWorksOnSearchPage',
      nameKey: '_收藏本页面的所有作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'SearchPage',
    },
    // extraFeatures - BookmarkPage
    {
      id: 'addTagToUnmarkedWork',
      nameKey: '_给未分类作品添加tag',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'removeTagsFromAllWorksOnPage',
      nameKey: '_移除本页面中所有作品的标签',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'removeTagsFromAllWorks',
      nameKey: '_移除所有作品的标签',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'unBookmarkWorksOnThisPage',
      nameKey: '_取消收藏本页面的所有作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'unBookmarkAllWorks',
      nameKey: '_取消收藏所有作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'findBookmark404Works',
      nameKey: '_查找所有已被删除的作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'unBookmarkAll404Works',
      nameKey: '_取消收藏所有已被删除的作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'exportBookmarkList',
      nameKey: '_导出收藏列表',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    {
      id: 'importBookmarkList',
      nameKey: '_导入收藏列表',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'BookmarkPage',
    },
    // extraFeatures - FollowingPage
    {
      id: 'exportFollowingListCSV',
      nameKey: '_导出关注列表CSV',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'FollowingPage',
    },
    {
      id: 'exportFollowingListJSON',
      nameKey: '_导出关注列表JSON',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'FollowingPage',
    },
    {
      id: 'batchFollowUser',
      nameKey: '_批量关注用户',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'FollowingPage',
    },
    {
      id: 'findDeactivatedUsers',
      nameKey: '_查找已注销的用户',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'FollowingPage',
    },
    // extraFeatures - UserRequest
    // 把该按钮在 wiki 里所属的页面设置为用户页面，即 extraFeatures - UserPage。这是有意的
    {
      id: 'bookmarkAllRequestWorks',
      nameKey: '_收藏所有约稿作品',
      categoryLevel1: 'extraFeatures',
      categoryLevel2: 'UserPage',
    },
  ]

  /** 把所有按钮按照分类层级进行组织，初始化时根据 buttonList 自动生成 */
  public buttonsByCategory: ButtonsByCategory = this.getButtonsByCategory()

  /** 根据 buttonList 自动聚合出每个分类里的按钮 id 列表 */
  private getButtonsByCategory(): ButtonsByCategory {
    const buttonsByCategory = {} as ButtonsByCategory
    for (const button of this.buttonList) {
      if (!buttonsByCategory[button.categoryLevel1]) {
        buttonsByCategory[button.categoryLevel1] = {}
      }
      if (!buttonsByCategory[button.categoryLevel1][button.categoryLevel2]) {
        buttonsByCategory[button.categoryLevel1][button.categoryLevel2] = {
          ids: [],
        }
      }
      buttonsByCategory[button.categoryLevel1][button.categoryLevel2].ids.push(
        button.id
      )
    }
    return buttonsByCategory
  }

  /** 检查按钮 id 是否已配置 wiki 分类。注册 wiki 事件的按钮如果未配置，会无法生成链接，开发期通过此方法提醒 */
  public checkButtonRegistered(id: string): boolean {
    for (const button of this.buttonList) {
      if (button.id === id) {
        return true
      }
    }
    return false
  }
}

const buttonConfigs = new ButtonConfigs()
export { buttonConfigs, ButtonCategoryLevel1 }
