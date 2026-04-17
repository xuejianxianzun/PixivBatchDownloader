import { Config } from '../Config'

// 设置项编号从 0 开始，现在最大是 104
// 帮助按钮上的文字有两种：
// - 如果帮助文字使用 MsgBox 显示，则使用“_帮助”
// - 如果帮助文字直接在设置面板上显示，则使用“_提示”
export const formHtml = `
<form class="settingForm">
  <div class="tabsContent">

    <div class="pinnedOptionTarget"></div>

    <span class="optionAnchor" data-for-no="0" aria-hidden="true"></span>
    <p class="option" data-no="0">
      <a href="" target="_blank" class="settingNameStyle">
        <span class="textTip" data-xztext="_抓取多少作品"></span>
      </a>
      <input type="text" name="setWantWork" class="setinput_style1 blue" value="-1">
      <button type="button" class="textButton grayButton mr0" role="setMin"></button>
      <button type="button" class="textButton grayButton" role="setMax"></button>
      <span class="gray1" data-xztext="_负1或者大于0" role="tip"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_抓取多少作品" data-msg="_抓取多少作品的提示" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="1" aria-hidden="true"></span>
    <p class="option" data-no="1">
      <a href="" target="_blank" class="settingNameStyle">
        <span class="textTip" data-xztext="_抓取多少页面"></span>
      </a>
      <input type="text" name="setWantPage" class="setinput_style1 blue" value="-1">
      <button type="button" class="textButton grayButton mr0" role="setMin"></button>
      <button type="button" class="textButton grayButton" role="setMax"></button>
      <span class="gray1" data-xztext="_负1或者大于0" role="tip"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_抓取多少页面" data-msg="_抓取多少页面的提示"" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="2" aria-hidden="true"></span>
    <p class="option" data-no="2">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_作品类型"></span>
      </a>
      <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0" aria-labelledby="setWorkType0"></span>
      <label for="setWorkType0" data-xztext="_插画"></label>
      <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0" data-xztitle="_漫画"></span>
      <label for="setWorkType1" data-xztext="_漫画"></label>
      <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setWorkType2" data-xztext="_动图"></label>
      <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setWorkType3" data-xztext="_小说"></label>
    </p>

    <span class="optionAnchor" data-for-no="44" aria-hidden="true"></span>
    <p class="option" data-no="44">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_年龄限制"></span>
      </a>
      <input type="checkbox" name="downAllAges" id="downAllAges" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="downAllAges" data-xztext="_全年龄"></label>
      <input type="checkbox" name="downR18" id="downR18" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="downR18"> R-18</label>
      <input type="checkbox" name="downR18G" id="downR18G" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="downR18G"> R-18G</label>
    </p>

    <span class="optionAnchor" data-for-no="81" aria-hidden="true"></span>
    <p class="option" data-no="81">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_AI作品"></span>
      </a>
      <input type="checkbox" name="AIGenerated" id="AIGenerated" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="AIGenerated" data-xztext="_AI生成"></label>
      <input type="checkbox" name="notAIGenerated" id="notAIGenerated" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="notAIGenerated" data-xztext="_非AI生成"></label>
      <input type="checkbox" name="UnknownAI" id="UnknownAI" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="UnknownAI" data-xztext="_未知" class="has_tip" data-xztip="_AI未知作品的说明"></label>
    </p>

    <span class="optionAnchor" data-for-no="96" aria-hidden="true"></span>
    <p class="option" data-no="96">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_原创作品"></span>
      </a>
      <input type="checkbox" name="crawlOriginalWork" id="setCrawlOriginalWork" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCrawlOriginalWork" data-xztext="_原创"></label>
      <input type="checkbox" name="crawlNonOriginalWork" id="setCrawlNonOriginalWork" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCrawlNonOriginalWork" data-xztext="_非原创"></label>

      <span class="verticalSplit"></span>
      <input type="checkbox" name="looseMatchOriginal" id="looseMatchOriginal" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="looseMatchOriginal" data-xztext="_宽松匹配"></label>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_原创作品" data-msg="_宽松匹配原创作品的说明" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="6" aria-hidden="true"></span>
    <p class="option" data-no="6">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_收藏状态"></span>
      </a>
      <input type="checkbox" name="downNotBookmarked" id="setDownNotBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownNotBookmarked" data-xztext="_未收藏"></label>
      <input type="checkbox" name="downBookmarked" id="setDownBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownBookmarked" data-xztext="_已收藏"></label>
    </p>

    <span class="optionAnchor" data-for-no="23" aria-hidden="true"></span>
    <p class="option" data-no="23">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_图片色彩"></span>
      </a>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownColorImg" data-xztext="_彩色图片"></label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownBlackWhiteImg" data-xztext="_黑白图片"></label>
    </p>

    <span class="optionAnchor" data-for-no="21" aria-hidden="true"></span>
    <p class="option" data-no="21">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_图片数量"></span>
      </a>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownSingleImg" data-xztext="_单图作品"></label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownMultiImg" data-xztext="_多图作品"></label>
    </p>

    <span class="optionAnchor" data-for-no="51" aria-hidden="true"></span>
    <p class="option" data-no="51">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示高级设置说明">
        <span data-xztext="_显示高级设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="99" aria-hidden="true"></span>
    <p class="option" data-no="99">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_不抓取下载过的作品的说明">
        <span data-xztext="_不抓取下载过的作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="DonotCrawlAlreadyDownloadedWorks" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_不抓取下载过的作品" data-msg="_不抓取下载过的作品的帮助信息" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="15" aria-hidden="true"></span>
    <p class="option" data-no="15">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_必须大于0">
        <span data-xztext="_抓取每个用户最新的几个作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="crawlLatestFewWorks" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="crawlLatestFewWorks">
        <input type="text" name="crawlLatestFewWorksNumber" class="setinput_style1 blue" value="10">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="5" aria-hidden="true"></span>
    <p class="option" data-no="5">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置收藏数量的提示">
        <span data-xztext="_收藏数量"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="BMKNumSwitch">
        &gt;=&nbsp;
        <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
        &lt;=&nbsp;
        <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="${Config.BookmarkCountLimit}">
        &nbsp;<span data-xztext="_或者"></span>
        <span class="has_tip" data-xztip="_日均收藏数量的提示">
          <span data-xztext="_日均收藏数量"></span>
          <span class="gray1"> ? </span>
        </span>
        &nbsp;
        <input type="checkbox" name="BMKNumAverageSwitch" class="need_beautify checkbox_switch">
        <span class="beautify_switch" tabindex="0"></span>
        <span class="subOptionWrap" data-show="BMKNumAverageSwitch">
          &gt;=&nbsp;
          <input type="text" name="BMKNumAverage" class="setinput_style1 blue bmkNum" value="600">
        </span>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="7" aria-hidden="true"></span>
    <p class="option" data-no="7">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_筛选宽高的提示文字">
        <span data-xztext="_图片的宽高"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="setWHSwitch">
        <input type="radio" name="widthHeightLimit" id="widthHeightLimit1" class="need_beautify radio" value=">=" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="widthHeightLimit1">&gt;=</label>
        <input type="radio" name="widthHeightLimit" id="widthHeightLimit2" class="need_beautify radio" value="=">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="widthHeightLimit2">=</label>
        <input type="radio" name="widthHeightLimit" id="widthHeightLimit3" class="need_beautify radio" value="<=">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="widthHeightLimit3">&lt;=</label>
        <span class="verticalSplit"></span>
        <span data-xztext="_宽度"></span>
        <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
        <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="setWidth_AndOr1" data-xztext="_并且"></label>
        <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="setWidth_AndOr2" data-xztext="_或者"></label>
        <span data-xztext="_高度"></span>
        <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="8" aria-hidden="true"></span>
    <p class="option" data-no="8">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置宽高比例Title">
        <span data-xztext="_图片的宽高比例"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="ratioSwitch">
        <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="horizontal">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="ratio1" data-xztext="_横图"></label>
        <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="vertical">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="ratio2" data-xztext="_竖图"></label>
        <input type="radio" name="ratio" id="ratio0" class="need_beautify radio" value="square">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="ratio0" data-xztext="_正方形"></label>
        <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="userSet">
        <span class="beautify_radio" tabindex="0"></span>
        <span class="has_tip settingNameStyle" data-xztip="_宽高比的提示">
          <label for="ratio3" style="padding: 0;" data-xztext="_宽高比"></label>
          <span class="gray1"> ? </span>
        </span>
        <!-- 这里使用了一个不可见的开关 userSetChecked，用来根据 radio 的值来控制子选项的显示或隐藏 -->
        <input type="checkbox" name="userSetChecked" class="need_beautify checkbox_switch" style="display:none;">
        <span class="beautify_switch" tabindex="0" style="display:none;"></span>
        <span class="subOptionWrap" data-show="userSetChecked">
          <input type="radio" name="userRatioLimit" id="userRatioLimit1" class="need_beautify radio" value=">=" checked>
          <span class="beautify_radio" tabindex="0"></span>
          <label for="userRatioLimit1">&gt;=</label>
          <input type="radio" name="userRatioLimit" id="userRatioLimit2" class="need_beautify radio" value="=">
          <span class="beautify_radio" tabindex="0"></span>
          <label for="userRatioLimit2">=</label>
          <input type="radio" name="userRatioLimit" id="userRatioLimit3" class="need_beautify radio" value="<=">
          <span class="beautify_radio" tabindex="0"></span>
          <label for="userRatioLimit3">&lt;=</label>
          <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
        </span>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="9" aria-hidden="true"></span>
    <p class="option" data-no="9">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置id范围提示">
        <span data-xztext="_id范围"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">

        <span data-xztext="_图像作品"></span>
        <input type="radio" name="idRangeComparisonForImageWorks" id="idRangeComparisonForImageWorks1" class="need_beautify radio" value=">" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForImageWorks1">&gt;</label>
        <input type="radio" name="idRangeComparisonForImageWorks" id="idRangeComparisonForImageWorks2" class="need_beautify radio" value="<">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForImageWorks2">&lt;</label>
        <input type="text" name="idRangeValueForImageWorks" class="setinput_style1 w80 blue" value="0" placeholder="0">

        <span data-xztext="_小说"></span>
        <input type="radio" name="idRangeComparisonForNovelWorks" id="idRangeComparisonForNovelWorks1" class="need_beautify radio" value=">" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForNovelWorks1">&gt;</label>
        <input type="radio" name="idRangeComparisonForNovelWorks" id="idRangeComparisonForNovelWorks2" class="need_beautify radio" value="<">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForNovelWorks2">&lt;</label>
        <input type="text" name="idRangeValueForNovelWorks" class="setinput_style1 w80 blue" value="0" placeholder="0">

        <span data-xztext="_系列小说"></span>
        <input type="radio" name="idRangeComparisonForNovelSeries" id="idRangeComparisonForNovelSeries1" class="need_beautify radio" value=">" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForNovelSeries1">&gt;</label>
        <input type="radio" name="idRangeComparisonForNovelSeries" id="idRangeComparisonForNovelSeries2" class="need_beautify radio" value="<">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRangeComparisonForNovelSeries2">&lt;</label>
        <input type="text" name="idRangeValueForNovelSeries" class="setinput_style1 w80 blue" value="0" placeholder="0">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="10" aria-hidden="true"></span>
    <p class="option" data-no="10">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置投稿时间提示">
        <span data-xztext="_投稿时间"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="postDate">
        <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="2009-01-01T00:00">
        <button type="button" class="textButton grayButton mr0" role="setDate" data-for="postDateStart" data-value="2009-01-01T00:00" data-xztext="_过去"></button>
        <button type="button" class="textButton grayButton" role="setDate" data-for="postDateStart" data-value="now" data-xztext="_现在"></button>
        -&nbsp;
        <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="2100-01-01T00:00">
        <button type="button" class="textButton grayButton mr0" role="setDate" data-for="postDateEnd" data-value="now" data-xztext="_现在"></button>
        <button type="button" class="textButton grayButton" role="setDate" data-for="postDateEnd" data-value="2100-01-01T00:00" data-xztext="_未来"></button>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="11" aria-hidden="true"></span>
    <p class="option" data-no="11">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_必须tag的提示文字">
        <span data-xztext="_必须含有tag"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="needTagSwitch">
        <input type="radio" name="needTagMode" id="needTagMode1" class="need_beautify radio" value="all" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="needTagMode1" data-xztext="_全部"></label>
        <input type="radio" name="needTagMode" id="needTagMode2" class="need_beautify radio" value="one">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="needTagMode2" data-xztext="_任一"></label>
        <input type="text" name="needTag" class="setinput_style1 blue setinput_tag" placeholder="tag1,tag2,tag3">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="12" aria-hidden="true"></span>
    <p class="option" data-no="12">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_排除tag的提示文字">
        <span data-xztext="_不能含有tag"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="notNeedTagSwitch">
        <span class="gray1" data-xztext="_任一"></span>
        <span class="verticalSplit"></span>
        <input type="radio" id="tagMatchMode1" class="need_beautify radio" name="tagMatchMode" value="partial" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="tagMatchMode1" data-xztext="_部分一致"></label>
        <input type="radio" id="tagMatchMode2" class="need_beautify radio" name="tagMatchMode" value="whole" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="tagMatchMode2" data-xztext="_完全一致"></label>
        <textarea class="centerPanelTextArea beautify_scrollbar" name="notNeedTag" rows="1" placeholder="tag1,tag2,tag3"></textarea>
      </span>
    </p>
    
    <span class="optionAnchor" data-for-no="94" aria-hidden="true"></span>
    <p class="option" data-no="94">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_标题必须含有的说明">
        <span data-xztext="_标题必须含有"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="titleIncludeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>

      <span class="subOptionWrap" data-show="titleIncludeSwitch">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="titleIncludeList" rows="1" placeholder="word1,word2,word3"></textarea>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="95" aria-hidden="true"></span>
    <p class="option" data-no="95">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_标题不能含有的说明">
        <span data-xztext="_标题不能含有"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="titleExcludeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      
      <span class="subOptionWrap" data-show="titleExcludeSwitch">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="titleExcludeList" rows="1" placeholder="word1,word2,word3"></textarea>

        <label for="alsoCheckSeriesTitle" class="has_tip" data-xztext="_也检查系列标题" data-xztip="_也检查系列标题的说明"></label>
        <span class="gray1 mr4"> ? </span>
        <input type="checkbox" name="alsoCheckSeriesTitle" id="alsoCheckSeriesTitle" class="need_beautify checkbox_switch" checked>
        <span class="beautify_switch" tabindex="0"></span>
      </span>
    </p>

    <div class="centerWrap_btns">
      <slot data-name="stopCrawl"></slot>
      <slot data-name="crawlBtns"></slot>
      <slot data-name="selectWorkBtns"></slot>
    </div>
  </div>
  <div class="tabsContent">

    <div class="pinnedOptionTarget"></div>

    <span class="optionAnchor" data-for-no="13" aria-hidden="true"></span>
    <p class="option" data-no="13">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_命名规则"></a>
      <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="${Config.defaultNameRule}">
      &nbsp;
      <select name="fileNameSelect" class="beautify_scrollbar">
        <option value="default">…</option>
        <option value="{id}">{id}</option>
        <option value="{user}">{user}</option>
        <option value="{user_id}">{user_id}</option>
        <option value="{title}">{title}</option>
        <option value="{page_title}">{page_title}</option>
        <option value="{tags}">{tags}</option>
        <option value="{tags_translate}">{tags_translate}</option>
        <option value="{tags_transl_only}">{tags_transl_only}</option>
        <option value="{page_tag}">{page_tag}</option>
        <option value="{type}">{type}</option>
        <option value="{type_illust}">{type_illust}</option>
        <option value="{type_manga}">{type_manga}</option>
        <option value="{type_ugoira}">{type_ugoira}</option>
        <option value="{type_novel}">{type_novel}</option>
        <option value="{AI}">{AI}</option>
        <option value="{age}">{age}</option>
        <option value="{age_r}">{age_r}</option>
        <option value="{like}">{like}</option>
        <option value="{bmk}">{bmk}</option>
        <option value="{bmk_1000}">{bmk_1000}</option>
        <option value="{bmk_id}">{bmk_id}</option>
        <option value="{view}">{view}</option>
        <option value="{rank}">{rank}</option>
        <option value="{date}">{date}</option>
        <option value="{upload_date}">{upload_date}</option>
        <option value="{task_date}">{task_date}</option>
        <option value="{px}">{px}</option>
        <option value="{char_count}">{char_count}</option>
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{series_id}">{series_id}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        <option value="{sl}">{sl}</option>
        <option value="{multi_image_folder}">{multi_image_folder}</option>
        <option value="{r18_g_folder}">{r18_g_folder}</option>
        <option value="{match_tag_folder}">{match_tag_folder}</option>
      </select>
      &nbsp;
      <slot data-name="saveNamingRule"></slot>
      <button type="button" class="showFileNameTip textButton toggleArea" data-toggle-Target="#fileNameTip" data-for-no="13" data-xztext="_提示"></button>
    </p>

    <p class="fileNameTip tip namingTipArea" id="fileNameTip">
      <span data-xztext="_设置文件夹名的提示"></span>
      <span>{user}<span class="key">/</span>{id}</span>
      <br>
      <span data-xztext="_命名标记提醒"></span>
      <br>
      * <span data-xztext="_有些标记并不总是可用的提醒"></span>
      <br>
      <span data-xztext="_提示点击下方的标记就可以把它复制到剪贴板"></span>
      <br>
      <span class="blue name">{id}</span>
      <span data-xztext="_命名标记id"></span>
      <br>
      <span class="blue name">{user}</span>
      <span data-xztext="_命名标记user"></span>
      <br>
      <span class="blue name">{user_id}</span>
      <span data-xztext="_用户id"></span>
      <br>
      <span class="blue name">{title}</span>
      <span data-xztext="_命名标记title"></span>
      <br>
      <span class="blue name">{tags}</span>
      <span data-xztext="_命名标记tags"></span>
      <br>
      <span class="blue name">{tags_translate}</span>
      <span data-xztext="_命名标记tags_trans"></span>
      <br>
      <span class="blue name">{tags_transl_only}</span>
      <span data-xztext="_命名标记tags_transl_only"></span>
      <br>
      <span class="blue name">{page_title}</span>
      <span data-xztext="_文件夹标记PTitle"></span>
      <br>
      * <span class="blue name">{page_tag}</span>
      <span data-xztext="_文件夹标记PTag"></span>
      <br>
      <span class="blue name">{type}</span>
      <span data-xztext="_命名标记type"></span>
      <br>
      * <span class="blue name">{type_illust}</span>
      <span data-xztext="_命名标记type_illust"></span>
      <br>
      * <span class="blue name">{type_manga}</span>
      <span data-xztext="_命名标记type_manga"></span>
      <br>
      * <span class="blue name">{type_ugoira}</span>
      <span data-xztext="_命名标记type_ugoira"></span>
      <br>
      * <span class="blue name">{type_novel}</span>
      <span data-xztext="_命名标记type_novel"></span>
      <br>
      * <span class="blue name">{AI}</span>
      <span data-xztext="_命名标记AI"></span>
      <br>
      <span class="blue name">{age}</span>
      <span data-xztext="_命名标记age"></span>
      <br>
      * <span class="blue name">{age_r}</span>
      <span data-xztext="_命名标记age_r"></span>
      <br>
      <span class="blue name">{like}</span>
      <span data-xztext="_命名标记like"></span>
      <br>
      <span class="blue name">{bmk}</span>
      <span data-xztext="_命名标记bmk"></span>
      <br>
      <span class="blue name">{bmk_1000}</span>
      <span data-xztext="_命名标记bmk_1000"></span>
      <br>
      <span class="blue name">{bmk_id}</span>
      <span data-xztext="_命名标记bmk_id"></span>
      <br>
      <span class="blue name">{view}</span>
      <span data-xztext="_命名标记view"></span>
      <br>
      * <span class="blue name">{rank}</span>
      <span data-xztext="_命名标记rank"></span>
      <br>
      <span class="blue name">{date}</span>
      <span data-xztext="_命名标记date"></span>
      <br>
      <span class="blue name">{upload_date}</span>
      <span data-xztext="_命名标记upload_date"></span>
      <br>
      <span class="blue name">{task_date}</span>
      <span data-xztext="_命名标记taskDate"></span>
      <br>
      * <span class="blue name">{px}</span>
      <span data-xztext="_命名标记px"></span>
      <br>
      * <span class="blue name">{char_count}</span>
      <span data-xztext="_命名标记char_count"></span>
      <br>
      * <span class="blue name">{series_title}</span>
      <span data-xztext="_命名标记seriesTitle"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      * <span class="blue name">{series_order}</span>
      <span data-xztext="_命名标记seriesOrder"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      * <span class="blue name">{series_id}</span>
      <span data-xztext="_命名标记seriesId"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      <span class="blue name">{id_num}</span>
      <span data-xztext="_命名标记id_num"></span>
      <br>
      * <span class="blue name">{p_num}</span>
      <span data-xztext="_命名标记p_num"></span>
      <br>
      * <span class="blue name">{sl}</span>
      <span data-xztext="_命名标记_sl"></span>
      <br>
      * <span class="blue name">{multi_image_folder}</span>
      <span data-xztext="_命名标记_multi_image_folder"></span>
      <br>
      * <span class="blue name">{r18_g_folder}</span>
      <span data-xztext="_命名标记_r18_g_folder"></span>
      <br>
      * <span class="blue name">{match_tag_folder}</span>
      <span data-xztext="_命名标记_match_tag_folder"></span>
    </p>

    <span class="optionAnchor" data-for-no="50" aria-hidden="true"></span>
    <p class="option" data-no="50">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_在不同的页面类型中使用不同的命名规则"></a>
      <input type="checkbox" name="setNameRuleForEachPageType" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="64" aria-hidden="true"></span>
    <p class="option" data-no="64">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_不创建文件夹的提示">
        <span data-xztext="_不创建文件夹"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="noFolderSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="noFolderSwitch">
        <input type="checkbox" name="noFolderWhenSingleImageWork" id="noFolderWhenSingleImageWork" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="noFolderWhenSingleImageWork" data-xztext="_单图作品"></label>
        <input type="checkbox" name="noFolderWhenMultiImageWork" id="noFolderWhenMultiImageWork" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="noFolderWhenMultiImageWork" data-xztext="_多图作品"></label>
        <input type="checkbox" name="noFolderWhenNovel" id="noFolderWhenNovel" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="noFolderWhenNovel" data-xztext="_小说"></label>
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_不创建文件夹" data-msg="_以下情况不创建文件夹的帮助内容" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="16" aria-hidden="true"></span>
    <p class="option" data-no="16">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_下载线程"></span>
      </a>
      <input type="text" name="downloadThread" class="has_tip setinput_style1 blue" data-xztip="_下载线程的说明" value="5">
    </p>

    <span class="optionAnchor" data-for-no="17" aria-hidden="true"></span>
    <p class="option" data-no="17">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_自动开始下载的提示">
        <span data-xztext="_自动开始下载"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="autoStartDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="33" aria-hidden="true"></span>
    <p class="option" data-no="33">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载之后收藏作品的提示">
        <span data-xztext="_下载之后收藏作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="bmkAfterDL" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <div class="centerWrap_btns">
      <slot data-name="exportResult"></slot>
      <slot data-name="namingBtns"></slot>
    </div>
    <slot data-name="downloadArea"></slot>
    <slot data-name="progressBar"></slot>
  </div>
  <div class="tabsContent">
    <div class="centerWrap_btns">
      <slot data-name="otherBtns"></slot>
    </div>

    <div class="pinnedOptionTarget"></div>

    <span class="optionAnchor" data-for-no="57" aria-hidden="true"></span>
    <p class="option" data-no="57">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示高级设置说明">
        <span data-xztext="_显示高级设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <p class="option settingCategoryName" data-no="59">
      <span data-xztext="_抓取"></span>
    </p>

    <span class="optionAnchor" data-for-no="75" aria-hidden="true"></span>
    <p class="option" data-no="75">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_减慢抓取速度的说明">
        <span data-xztext="_减慢抓取速度"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="slowCrawl" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="slowCrawl">
        <span data-xztext="_当作品数量大于"></span>
        <input type="text" name="slowCrawlOnWorksNumber" class="setinput_style1 blue" value="100">
        <span class="verticalSplit"></span>
        <span data-xztext="_间隔时间"></span>
        <input type="text" name="slowCrawlDealy" class="setinput_style1 blue" value="1600" placeholder="1600"> ms
      </span>
    </p>

    <span class="optionAnchor" data-for-no="47" aria-hidden="true"></span>
    <p class="option" data-no="47">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_多图作品的图片数量上限提示">
        <span data-xztext="_多图作品的图片数量上限"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="multiImageWorkImageLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="multiImageWorkImageLimitSwitch">
        &lt;=&nbsp;
        <input type="text" name="multiImageWorkImageLimit" class="setinput_style1 blue" value="1">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="3" aria-hidden="true"></span>
    <p class="option" data-no="3">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_多图作品只抓取前几张图片"></span>
      </a>
      <input type="checkbox" name="onlyCrawlFirstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="onlyCrawlFirstFewImagesSwitch">
        <input type="text" name="onlyCrawlFirstFewImagesCount" class="setinput_style1 blue" value="1">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_多图作品只抓取前几张图片" data-msg="_多图作品只抓取前几张图片的说明" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="104" aria-hidden="true"></span>
    <p class="option" data-no="104">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_多图作品只抓取后几张图片"></span>
      </a>
      <input type="checkbox" name="onlyCrawlLastFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="onlyCrawlLastFewImagesSwitch">
        <input type="text" name="onlyCrawlLastFewImagesCount" class="setinput_style1 blue" value="1">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_多图作品只抓取后几张图片" data-msg="_多图作品只抓取后几张图片的说明" data-xztext="_帮助"></button>
    </p>
    
    <span class="optionAnchor" data-for-no="103" aria-hidden="true"></span>
    <p class="option" data-no="103">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_多图作品不抓取前几张图片"></span>
      </a>
      <input type="checkbox" name="doNotCrawlFirstImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="doNotCrawlFirstImagesSwitch">
        <input type="text" name="doNotCrawlFirstImagesCount" class="setinput_style1 blue" value="1">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_多图作品不抓取前几张图片" data-msg="_多图作品不抓取前几张图片的说明" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="69" aria-hidden="true"></span>
    <p class="option" data-no="69">      
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_多图作品不抓取后几张图片"></span>
      </a>
      <input type="checkbox" name="doNotCrawlLastImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="doNotCrawlLastImagesSwitch">
        <input type="text" name="doNotCrawlLastImagesCount" class="setinput_style1 blue" value="1">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_多图作品不抓取后几张图片" data-msg="_多图作品不抓取后几张图片的说明" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="79" aria-hidden="true"></span>
    <p class="option" data-no="79">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_特定用户的多图作品不下载最后几张图片"></span>
      </a>
      <slot data-name="DoNotDownloadLastFewImagesSlot"></slot>
    </p>

    <span class="optionAnchor" data-for-no="35" aria-hidden="true"></span>
    <p class="option" data-no="35">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_用户阻止名单的说明">
        <span data-xztext="_用户阻止名单"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="userBlockList" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="userBlockList">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="blockList" rows="1" placeholder="11111,22222,33333"></textarea>
        <br>
        <input type="checkbox" name="removeBlockedUsersWork" id="setRemoveBlockedUsersWork" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="setRemoveBlockedUsersWork" data-xztext="_从页面上移除他们的作品"></label>
        <button type="button" class="gray1 textButton showMsgBtn" data-title="_用户阻止名单" data-msg="_用户阻止名单的说明2" data-xztext="_帮助"></button>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="39" aria-hidden="true"></span>
    <p class="option" data-no="39">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_针对特定用户屏蔽tag的提示">
        <span data-xztext="_针对特定用户屏蔽tag"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="blockTagsForSpecificUser" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="blockTagsForSpecificUser">
        <slot data-name="blockTagsForSpecificUser"></slot>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="74" aria-hidden="true"></span>
    <p class="option" data-no="74">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_定时抓取的间隔时间的说明">
        <span data-xztext="_定时抓取的间隔时间"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="text" name="timedCrawlInterval" class="setinput_style1 blue" value="30">
      <span class="settingNameStyle" data-xztext="_分钟"></span>
    </p>

    <span class="optionAnchor" data-for-no="54" aria-hidden="true"></span>
    <p class="option" data-no="54">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_自动导出抓取结果的说明">
        <span data-xztext="_自动导出抓取结果"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="autoExportResult" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="autoExportResult">
        <span data-xztext="_抓取结果"></span>
        <span>&gt;</span>
        <input type="text" name="autoExportResultNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
        <span class="verticalSplit"></span>
        <span class="settingNameStyle" data-xztext="_文件格式"> </span>
        <input type="checkbox" name="autoExportResultCSV" id="autoExportResultCSV" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="autoExportResultCSV"> CSV </label>
        <input type="checkbox" name="autoExportResultJSON" id="autoExportResultJSON" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="autoExportResultJSON"> JSON </label>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="85" aria-hidden="true"></span>
    <p class="option" data-no="85">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_导出ID列表的说明">
        <span data-xztext="_导出ID列表"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="exportIDList" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <p class="option settingCategoryName" data-no="65">
      <span data-xztext="_命名"></span>
    </p>

    <span class="optionAnchor" data-for-no="19" aria-hidden="true"></span>
    <p class="option" data-no="19">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_为多图作品添加一层文件夹"></a>
      <input type="checkbox" name="folderForMultiImageWorksSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="folderForMultiImageWorksSwitch">
        <label for="folderForMultiImageWorksRule" data-xztext="_文件夹规则"></label>
        <input class="setinput_style1 blue w150 grow" type="text" name="folderForMultiImageWorksRule" id="folderForMultiImageWorksRule" value="{id_num}">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_为多图作品添加一层文件夹" data-msg="为多图作品添加一层文件夹的帮助" data-xztext="_帮助"></button>
    </p>
    
    <span class="optionAnchor" data-for-no="38" aria-hidden="true"></span>
    <p class="option" data-no="38">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_为r18作品添加一层文件夹"></a>
      <input type="checkbox" name="r18Folder" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="r18Folder">
        <span data-xztext="_文件夹规则"></span>
        <input type="text" name="r18FolderName" class="setinput_style1 blue grow" value="[R-18&R-18G]">
      </span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_为r18作品添加一层文件夹" data-msg="_为r18作品添加一层文件夹的帮助" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="43" aria-hidden="true"></span>
    <p class="option" data-no="43">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_使用第一个匹配的标签建立文件夹"></span>
      </a>
      <input type="checkbox" name="createFolderByTag" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_使用第一个匹配的标签建立文件夹" data-msg="_使用第一个匹配的标签建立文件夹的说明" data-xztext="_帮助"></button>
      <span class="subOptionWrap" data-show="createFolderByTag">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="createFolderTagList" rows="1" placeholder="tag1,tag2,tag3"></textarea>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="80" aria-hidden="true"></span>
    <p class="option" data-no="80">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_如果作品含有某些标签则对这个作品使用另一种命名规则"></a>
      <input type="checkbox" name="UseDifferentNameRuleIfWorkHasTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="UseDifferentNameRuleIfWorkHasTagSwitch">
        <slot data-name="UseDifferentNameRuleIfWorkHasTagSlot"></slot>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="98" aria-hidden="true"></span>
    <p class="option" data-no="98">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_序号起始值的说明">
        <span data-xztext="_序号起始值"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="serialNoStart" id="serialNoStart0" class="need_beautify radio" value="0" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="serialNoStart0"> 0 </label>
      <input type="radio" name="serialNoStart" id="serialNoStart1" class="need_beautify radio" value="1">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="serialNoStart1"> 1 </label>
    </p>
    
    <span class="optionAnchor" data-for-no="22" aria-hidden="true"></span>
    <p class="option" data-no="22">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_第一张图不带序号说明">
        <span data-xztext="_第一张图不带序号"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="noSerialNo" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="noSerialNo">
        <input type="checkbox" name="noSerialNoForSingleImg" id="setNoSerialNoForSingleImg" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="setNoSerialNoForSingleImg" data-xztext="_单图作品"></label>
        <input type="checkbox" name="noSerialNoForMultiImg" id="setNoSerialNoForMultiImg" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="setNoSerialNoForMultiImg" data-xztext="_多图作品"></label>
        <input type="checkbox" name="noSerialNoForUgoira" id="setNoSerialNoForUgoira" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="setNoSerialNoForUgoira" data-xztext="_动图"></label>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="46" aria-hidden="true"></span>
    <p class="option" data-no="46">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_在序号前面填充0的说明">
        <span data-xztext="_在序号前面填充0"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="zeroPadding" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="zeroPadding">
        <span data-xztext="_序号总长度"></span>
        <input type="text" name="zeroPaddingLength" class="setinput_style1 blue" value="3" style="width:30px;min-width: 30px;">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="29" aria-hidden="true"></span>
    <p class="option" data-no="29">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_文件名长度限制"></span>
      </a>
      <input type="checkbox" name="fullNameLengthLimitSwitch" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>

      <span class="subOptionWrap" data-show="fullNameLengthLimitSwitch">
        <input type="text" name="fullNameLengthLimit" class="setinput_style1 blue" value="210">
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_文件名长度限制" data-msg="_文件名长度限制的说明" data-xztext="_帮助"></button>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="83" aria-hidden="true"></span>
    <p class="option" data-no="83">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_标签分隔符号"></a>
      <input type="text" name="tagsSeparator" class="setinput_style1 blue" value=",">
      <button type="button" class="gray1 textButton toggleArea" data-toggle-Target="#tagsSeparatorTip" data-for-no="83" data-xztext="_提示"></button>
    </p>

    <p class="tip" id="tagsSeparatorTip">
      <span data-xztext="_标签分隔符号提示"></span>
    </p>
    
    <span class="optionAnchor" data-for-no="97" aria-hidden="true"></span>
    <p class="option" data-no="97">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_移除文件名里的emoji"></span>
      </a>
      <input type="checkbox" name="removeEmoji" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="67" aria-hidden="true"></span>
    <p class="option" data-no="67">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_移除用户名中的at和后续字符的说明">
        <span data-xztext="_移除用户名中的at和后续字符"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="removeAtFromUsername" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="66" aria-hidden="true"></span>
    <p class="option" data-no="66">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_自定义用户名的说明">
        <span data-xztext="_自定义用户名"></span>
        <span class="gray1"> ? </span>
      </a>
      <slot data-name="setUserNameSlot"></slot>
    </p>

    <span class="optionAnchor" data-for-no="31" aria-hidden="true"></span>
    <p class="option" data-no="31">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_日期格式"></a>
      <input type="text" name="dateFormat" class="setinput_style1 blue" style="width:250px;" value="YYYY-MM-DD">
      <button type="button" class="gray1 textButton toggleArea" data-toggle-Target="#dateFormatTip" data-for-no="31" data-xztext="_提示"></button>
    </p>

    <p class="tip" id="dateFormatTip">
      <span data-xztext="_日期格式提示"></span>
      <br>
      <span class="blue">YYYY</span> <span>2021</span>
      <br>
      <span class="blue">YY</span> <span>21</span>
      <br>
      <span class="blue">MM</span> <span>04</span>
      <br>
      <span class="blue">MMM</span> <span>Apr</span>
      <br>
      <span class="blue">MMMM</span> <span>April</span>
      <br>
      <span class="blue">DD</span> <span>30</span>
      <br>
      <span class="blue">hh</span> <span>06</span>
      <br>
      <span class="blue">mm</span> <span>40</span>
      <br>
      <span class="blue">ss</span> <span>08</span>
      <br>
    </p>
    
    <p class="option settingCategoryName" data-no="58">
      <span data-xztext="_下载"></span>
    </p>

    <span class="optionAnchor" data-for-no="101" aria-hidden="true"></span>
    <p class="option" data-no="101">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_管理下载记录"></a>
      <button type="button" class="textButton gray1" id="exportDownloadRecord" data-xztext="_导出"></button>
      <button type="button" class="textButton gray1" id="importDownloadRecord" data-xztext="_导入"></button>
      <button type="button" class="textButton gray1" id="clearDownloadRecord" data-xztext="_清除"></button>
      <button type="button" class="textButton gray1 showMsgBtn" data-title="_管理下载记录" data-msg="_管理下载记录的提示" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="28" aria-hidden="true"></span>
    <p class="option" data-no="28">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_不下载重复文件"></a>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="deduplication">
        <span data-xztext="_策略"></span>
        <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
        <span class="beautify_radio" tabindex="0"></span>
        <label class="has_tip" for="dupliStrategy2" data-xztip="_宽松模式说明" data-xztext="_宽松"></label>
        <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label class="has_tip" for="dupliStrategy1" data-xztip="_严格模式说明" data-xztext="_严格"></label>
      </span>
      <button type="button" class="textButton gray1 showMsgBtn" data-title="_不下载重复文件" data-msg="_不下载重复文件的提示" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="100" aria-hidden="true"></span>
    <p class="option" data-no="100">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_在已下载的作品上显示边框"></a>
      <input type="checkbox" name="showBorderOnDownloadedWorks" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap noGrow" data-show="showBorderOnDownloadedWorks">
        <span data-xztext="_宽度"></span>
        <input type="text" name="borderWidth" class="setinput_style1 blue w20" value="3">
        px
        <span class="verticalSplit"></span>
        <span data-xztext="_颜色"></span> (Hex)
        <input type="text" name="borderColor" class="setinput_style1 blue w80" id="borderColor" value="#ff4060">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="90" aria-hidden="true"></span>
    <p class="option" data-no="90">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载间隔的说明">
        <span data-xztext="_下载间隔"></span>
        <span class="gray1"> ? </span>
      </a>
      <span data-xztext="_当文件数量大于"></span>
      <input type="text" name="downloadIntervalOnWorksNumber" class="setinput_style1 blue" value="150">
      <span class="verticalSplit"></span>
      <span data-xztext="_间隔时间"></span>
      <input type="text" name="downloadInterval" class="setinput_style1 blue" value="0">
      <span data-xztext="_秒"></span>
    </p>

    <span class="optionAnchor" data-for-no="76" aria-hidden="true"></span>
    <p class="option" data-no="76">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_点击收藏按钮时下载作品"></span>
      </a>
      <input type="checkbox" name="downloadOnClickBookmark" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="77" aria-hidden="true"></span>
    <p class="option" data-no="77">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_点击点赞按钮时下载作品"></span>
      </a>
      <input type="checkbox" name="downloadOnClickLike" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="4" aria-hidden="true"></span>
    <p class="option" data-no="4">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_动图保存格式的说明">
        <span data-xztext="_动图保存格式"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs1" data-xztext="_webmVideo"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs3" data-xztext="_gif"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="apng">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-xztip="_无损" data-xztext="_apng"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs2" data-xztext="_zipFile"></label>
    </p>

    <span class="optionAnchor" data-for-no="24" aria-hidden="true"></span>
    <p class="option" data-no="24">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_同时转换多少个动图的说明">
        <span data-xztext="_同时转换多少个动图"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
    </p>

    <span class="optionAnchor" data-for-no="26" aria-hidden="true"></span>
    <p class="option" data-no="26">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_小说保存格式的说明">
        <span data-xztext="_小说保存格式"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="novelSaveAs1"> TXT </label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="novelSaveAs2"> EPUB </label>
    </p>

    <span class="optionAnchor" data-for-no="73" aria-hidden="true"></span>
    <p class="option" data-no="73">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_自动合并系列小说的说明">
        <span data-xztext="_自动合并系列小说"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="autoMergeNovel" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="autoMergeNovel">
        <label for="skipNovelsInSeriesWhenAutoMerge" data-xztext="_不再单独下载系列里的小说" class="has_tip" data-xztip="_不再单独下载系列里的小说的说明"></label>
        <span class="gray1"> ? &nbsp;</span>
        <input type="checkbox" name="skipNovelsInSeriesWhenAutoMerge" id="skipNovelsInSeriesWhenAutoMerge" class="need_beautify checkbox_switch" checked>
        <span class="beautify_switch" tabindex="0"></span>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="91" aria-hidden="true"></span>
    <p class="option" data-no="91">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_合并系列小说时的命名规则"></a>
      <span class="rowWrap">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="seriesNovelNameRule" rows="1"></textarea>
        <button type="button" class="showFileNameTip textButton toggleArea" data-toggle-Target="#seriesNovelNameTip" data-for-no="91" data-xztext="_提示"></button>
      </span>
    </p>

    <p class="fileNameTip tip namingTipArea" id="seriesNovelNameTip">
      <span data-xztext="_系列小说的命名标记提醒"></span>
      <br>
      * <span data-xztext="_有些标记并不总是可用的提醒"></span>
      <br>
      <span data-xztext="_提示点击下方的标记就可以把它复制到剪贴板"></span>
      <br>
      <span class="blue name">{series_title}</span>
      <span data-xztext="_系列小说的命名标记_series_title"></span>
      <br>
      <span class="blue name">{series_id}</span>
      <span data-xztext="_系列小说的命名标记_series_id"></span>
      <br>
      <span class="blue name">{user}</span>
      <span data-xztext="_系列小说的命名标记_user"></span>
      <br>
      <span class="blue name">{user_id}</span>
      <span data-xztext="_系列小说的命名标记_user_id"></span>
      <br>
      * <span class="blue name">{part}</span>
      <span data-xztext="_系列小说的命名标记_part"></span>
      <br>
      <span class="blue name">{ext}</span>
      <span data-xztext="_系列小说的命名标记_ext"></span>
      <br>
      <span class="blue name">{age}</span>
      <span data-xztext="_系列小说的命名标记_age"></span>
      <br>
      * <span class="blue name">{age_r}</span>
      <span data-xztext="_系列小说的命名标记_age_r"></span>
      <br>
      * <span class="blue name">{AI}</span>
      <span data-xztext="_系列小说的命名标记_AI"></span>
      <br>
      <span class="blue name">{lang}</span>
      <span data-xztext="_系列小说的命名标记_lang"></span>
      <br>
      <span class="blue name">{total}</span>
      <span data-xztext="_系列小说的命名标记_total"></span>
      <br>
      <span class="blue name">{char_count}</span>
      <span data-xztext="_系列小说的命名标记_char_count"></span>
      <br>
      <span class="blue name">{create_date}</span>
      <span data-xztext="_系列小说的命名标记_create_date"></span>
      <br>
      <span class="blue name">{last_date}</span>
      <span data-xztext="_系列小说的命名标记_last_date"></span>
      <br>
      <span class="blue name">{task_date}</span>
      <span data-xztext="_系列小说的命名标记_task_date"></span>
      <br>
      <span class="blue name">{first_id}</span>
      <span data-xztext="_系列小说的命名标记_first_id"></span>
      <br>
      <span class="blue name">{latest_id}</span>
      <span data-xztext="_系列小说的命名标记_latest_id"></span>
      <br>
      <span class="blue name">{tags}</span>
      <span data-xztext="_系列小说的命名标记_tags"></span>
      <br>
      * <span class="blue name">{page_tag}</span>
      <span data-xztext="_文件夹标记PTag"></span>
      <br>
      <span class="blue name">{page_title}</span>
      <span data-xztext="_系列小说的命名标记_page_title"></span>
    </p>

    <span class="optionAnchor" data-for-no="27" aria-hidden="true"></span>
    <p class="option" data-no="27">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_在小说里保存元数据提示">
        <span data-xztext="_在小说里保存元数据"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="70" aria-hidden="true"></span>
    <p class="option" data-no="70">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_下载小说的封面图片"></a>
      <input type="checkbox" name="downloadNovelCoverImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="72" aria-hidden="true"></span>
    <p class="option" data-no="72">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_下载小说里的内嵌图片"></a>
      <input type="checkbox" name="downloadNovelEmbeddedImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="49" aria-hidden="true"></span>
    <p class="option" data-no="49">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_保存作品的元数据说明">
        <span data-xztext="_保存作品的元数据"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="saveMetaType0" id="setSaveMetaType0" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setSaveMetaType0" data-xztext="_插画"></label>
      <input type="checkbox" name="saveMetaType1" id="setSaveMetaType1" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setSaveMetaType1" data-xztext="_漫画"></label>
      <input type="checkbox" name="saveMetaType2" id="setSaveMetaType2" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setSaveMetaType2" data-xztext="_动图"></label>
      <input type="checkbox" name="saveMetaType3" id="setSaveMetaType3" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setSaveMetaType3" data-xztext="_小说"></label>
      <span class="verticalSplit"></span>
      <span class="settingNameStyle" data-xztext="_文件格式"> </span>
      <input type="checkbox" name="saveMetaFormatTXT" id="saveMetaFormatTXT" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="saveMetaFormatTXT"> TXT </label>
      <input type="checkbox" name="saveMetaFormatJSON" id="saveMetaFormatJSON" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="saveMetaFormatJSON"> JSON </label>
    </p>

    <span class="optionAnchor" data-for-no="89" aria-hidden="true"></span>
    <p class="option" data-no="89">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_保存作品简介的说明">
        <span data-xztext="_保存作品的简介"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="saveWorkDescription" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="saveWorkDescription">
        <label for="saveEachDescription" data-xztext="_每个作品分别保存" class="has_tip" data-xztip="_简介的Links标记"></label>
        <span class="gray1"> ? &nbsp;</span>
        <input type="checkbox" name="saveEachDescription" id="saveEachDescription" class="need_beautify checkbox_switch">
        <span class="beautify_switch" tabindex="0"></span>
        <span class="verticalSplit"></span>
        <label for="summarizeDescription" data-xztext="_汇总到一个文件"></label>
        <input type="checkbox" name="summarizeDescription" id="summarizeDescription" class="need_beautify checkbox_switch">
        <span class="beautify_switch" tabindex="0"></span>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="30" aria-hidden="true"></span>
    <p class="option" data-no="30">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_图片尺寸"></a>
      <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize1" data-xztext="_原图"></label>
      <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize2" data-xztext="_普通"></label>
      <label for="imageSize2" class="gray1">(1200px)</label>
      <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize3" data-xztext="_小图"></label>
      <label for="imageSize3" class="gray1">(540px)</label>
      <input type="radio" name="imageSize" id="imageSize4" class="need_beautify radio" value="thumb">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize4" data-xztext="_方形缩略图"></label>
      <label for="imageSize4" class="gray1">(250px)</label>
    </p>

    <span class="optionAnchor" data-for-no="25" aria-hidden="true"></span>
    <p class="option" data-no="25">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_文件体积限制的说明">
        <span data-xztext="_文件体积限制"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="sizeSwitch">
        <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MiB
        &nbsp;-&nbsp;
        <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MiB
      </span>
    </p>

    <span class="optionAnchor" data-for-no="82" aria-hidden="true"></span>
    <p class="option" data-no="82">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_文件下载顺序"></a>
      <input type="checkbox" name="setFileDownloadOrder" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="setFileDownloadOrder">
        <span class="settingNameStyle" data-xztext="_排序依据"></span>
        <input type="radio" name="downloadOrderSortBy" id="downloadOrderSortBy1" class="need_beautify radio" value="ID" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="downloadOrderSortBy1" data-xztext="_作品ID"></label>
        <input type="radio" name="downloadOrderSortBy" id="downloadOrderSortBy2" class="need_beautify radio" value="bookmarkCount">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="downloadOrderSortBy2" data-xztext="_收藏数量2"></label>
        <input type="radio" name="downloadOrderSortBy" id="downloadOrderSortBy3" class="need_beautify radio" value="bookmarkID">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="downloadOrderSortBy3" data-xztext="_收藏时间"></label>
        <span class="verticalSplit"></span>
        <input type="radio" name="downloadOrder" id="downloadOrder1" class="need_beautify radio" value="desc" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="downloadOrder1" data-xztext="_降序"></label>
        <input type="radio" name="downloadOrder" id="downloadOrder2" class="need_beautify radio" value="asc">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="downloadOrder2" data-xztext="_升序"></label>
      </span>
    </p>

    
    <span class="optionAnchor" data-for-no="20" aria-hidden="true"></span>
    <p class="option" data-no="20">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_使用前请先查看提示">
        <span data-xztext="_把文件保存到用户上次选择的位置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="rememberTheLastSaveLocation" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_把文件保存到用户上次选择的位置" data-msg="_把文件保存到用户上次选择的位置的说明" data-xztext="_帮助"></button>
    </p>
    
    <span class="optionAnchor" data-for-no="52" aria-hidden="true"></span>
    <p class="option" data-no="52">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载完成后显示通知的说明">
        <span data-xztext="_下载完成后显示通知"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showNotificationAfterDownloadComplete" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <p class="option settingCategoryName" data-no="60">
      <span data-xztext="_增强"></span>
    </p>

    <span class="optionAnchor" data-for-no="84" aria-hidden="true"></span>
    <p class="option" data-no="84">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_高亮关注的用户的说明">
        <span data-xztext="_高亮关注的用户"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="highlightFollowingUsers" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="68" aria-hidden="true"></span>
    <p class="option" data-no="68">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示更大的缩略图的说明">
        <span data-xztext="_显示更大的缩略图"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showLargerThumbnails" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="63" aria-hidden="true"></span>
    <p class="option" data-no="63">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_替换方形缩略图以显示图片比例的说明">
        <span data-xztext="_替换方形缩略图以显示图片比例"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="replaceSquareThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="55" aria-hidden="true"></span>
    <p class="option" data-no="55">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览作品的说明">
        <span data-xztext="_预览作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="PreviewWork" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="PreviewWork">
        <label for="wheelScrollSwitchImageOnPreviewWork" class="has_tip" data-xztext="_使用鼠标滚轮切换作品里的图片" data-xztip="_这可能会阻止页面滚动"></label>
        <input type="checkbox" name="wheelScrollSwitchImageOnPreviewWork" id="wheelScrollSwitchImageOnPreviewWork" class="need_beautify checkbox_switch" checked>
        <span class="beautify_switch" tabindex="0"></span>
        <span class="verticalSplit"></span>
        <label for="swicthImageByKeyboard" class="has_tip" data-xztext="_使用方向键和空格键切换图片" data-xztip="_使用方向键和空格键切换图片的提示"></label>
        <input type="checkbox" name="swicthImageByKeyboard" id="swicthImageByKeyboard" class="need_beautify checkbox_switch" checked>
        <span class="beautify_switch" tabindex="0"></span>
        <span class="verticalSplit"></span>
        <span data-xztext="_等待时间"></span>&nbsp;
        <input type="text" name="previewWorkWait" class="setinput_style1 blue" value="400" style="width:40px;min-width: 40px;">
        <span>&nbsp;ms</span>
        <span class="verticalSplit"></span>
        <label for="showPreviewWorkTip" data-xztext="_显示摘要信息"></label>
        <input type="checkbox" name="showPreviewWorkTip" id="showPreviewWorkTip" class="need_beautify checkbox_switch" checked>
        <span class="beautify_switch" tabindex="0"></span>
        <span class="verticalSplit"></span>
        <span class="settingNameStyle" data-xztext="_图片尺寸2"></span>
        <input type="radio" name="prevWorkSize" id="prevWorkSize1" class="need_beautify radio" value="original">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="prevWorkSize1" data-xztext="_原图"></label>
        <input type="radio" name="prevWorkSize" id="prevWorkSize2" class="need_beautify radio" value="regular" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="prevWorkSize2" data-xztext="_普通"></label>
        <span class="verticalSplit"></span>
        <button type="button" class="gray1 textButton toggleArea" data-toggle-Target="#previewWorkShortcutTip" data-for-no="55" data-xztext="_快捷键列表"></button>
      </span>
    </p>

    <p class="tip" id="previewWorkShortcutTip">
      <span data-xztext="_预览作品的快捷键说明"></span>
    </p>

    <span class="optionAnchor" data-for-no="71" aria-hidden="true"></span>
    <p class="option" data-no="71">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_预览动图"></a>
      <input type="checkbox" name="previewUgoira" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="62" aria-hidden="true"></span>
    <p class="option" data-no="62">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_长按右键显示大图"></a>
      <input type="checkbox" name="showOriginImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="showOriginImage">
        <span class="settingNameStyle" data-xztext="_图片尺寸2"></span>
        <input type="radio" name="showOriginImageSize" id="showOriginImageSize1" class="need_beautify radio" value="original">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="showOriginImageSize1" data-xztext="_原图"></label>
        <input type="radio" name="showOriginImageSize" id="showOriginImageSize2" class="need_beautify radio" value="regular" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="showOriginImageSize2" data-xztext="_普通"></label>
        <span class="verticalSplit"></span>
        <button type="button" class="gray1 textButton toggleArea" data-toggle-Target="#showOriginImageShortcutTip" data-for-no="62" data-xztext="_快捷键列表"></button>
      </span>
    </p>

    <p class="tip" id="showOriginImageShortcutTip">
      <span data-xztext="_查看作品大图时的快捷键"></span>
    </p>

    <span class="optionAnchor" data-for-no="102" aria-hidden="true"></span>
    <p class="option" data-no="102">
      <a href="" target="_blank" class="settingNameStyle has_tip" data-xztip="_缩略图上按钮的位置的说明">
        <span data-xztext="_缩略图上按钮的位置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="magnifierPosition" id="magnifierPosition1" class="need_beautify radio" value="left">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="magnifierPosition1" data-xztext="_左侧"></label>
      <input type="radio" name="magnifierPosition" id="magnifierPosition2" class="need_beautify radio" value="right" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="magnifierPosition2" data-xztext="_右侧"></label>
    </p>

    <span class="optionAnchor" data-for-no="40" aria-hidden="true"></span>
    <p class="option" data-no="40">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_在作品缩略图上显示放大按钮"></a>
      <input type="checkbox" name="magnifier" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="magnifier">
        <span class="settingNameStyle" data-xztext="_查看的图片尺寸"></span>
        <input type="radio" name="magnifierSize" id="magnifierSize1" class="need_beautify radio" value="original">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierSize1" data-xztext="_原图"></label>
        <input type="radio" name="magnifierSize" id="magnifierSize2" class="need_beautify radio" value="regular" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierSize2" data-xztext="_普通"></label>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="56" aria-hidden="true"></span>
    <p class="option" data-no="56">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_在作品缩略图上显示下载按钮"></a>
      <input type="checkbox" name="showDownloadBtnOnThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="14" aria-hidden="true"></span>
    <p class="option" data-no="14">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示复制按钮的提示">
        <span data-xztext="_复制按钮"></span>
        <span class="gray1"> ? </span>
      </a>
      <label for="showCopyBtnOnThumb" data-xztext="_在缩略图上显示"></label>
      <input type="checkbox" name="showCopyBtnOnThumb" id="showCopyBtnOnThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
      <span class="verticalSplit"></span>
      
      <span data-xztext="_复制内容"></span>:&nbsp;
      <input type="checkbox" name="copyFormatImage" id="setCopyFormatImage" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCopyFormatImage">image/png</label>
      <input type="checkbox" name="copyFormatText" id="setCopyFormatText" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCopyFormatText">text/plain</label>
      <input type="checkbox" name="copyFormatHtml" id="setCopyFormatHtml" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCopyFormatHtml">text/html</label>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_复制内容" data-msg="_对复制的内容的说明" data-xztext="_帮助"></button>
      <span class="verticalSplit"></span>

      <span class="settingNameStyle" data-xztext="_图片尺寸2"></span>
      <input type="radio" name="copyImageSize" id="copyImageSize1" class="need_beautify radio" value="original">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="copyImageSize1" data-xztext="_原图"></label>
      <input type="radio" name="copyImageSize" id="copyImageSize2" class="need_beautify radio" value="regular" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="copyImageSize2" data-xztext="_普通"></label>
      <span class="verticalSplit"></span>
      
      <span data-xztext="_文本格式"></span>:&nbsp;
      <input type="text" name="copyWorkInfoFormat" class="setinput_style1 blue" style="width:100%;max-width:350px;" value="id: {id}{n}title: {title}{n}tags: {tags}{n}url: {url}{n}user: {user}">
      <button type="button" class="gray1 textButton toggleArea" data-toggle-Target="#copyWorkInfoFormatTip" data-for-no="14" data-xztext="_提示"></button>
    </p>

    <p class="tip namingTipArea" id="copyWorkInfoFormatTip">
      <span data-xztext="_复制内容的格式的提示"></span>
      <br>
      <span class="blue name">{url}</span>
      <span data-xztext="_url标记的说明"></span>
      <br>
      <span class="blue name">{n}</span>
      <span data-xztext="_换行标记的说明"></span>
      <br>
    </p>

    <span class="optionAnchor" data-for-no="86" aria-hidden="true"></span>
    <p class="option" data-no="86">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_在多图作品页面里显示缩略图列表的说明">
        <span data-xztext="_在多图作品页面里显示缩略图列表"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="displayThumbnailListOnMultiImageWorkPage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="87" aria-hidden="true"></span>
    <p class="option" data-no="87">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览作品的详细信息的说明">
        <span data-xztext="_预览作品的详细信息"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="PreviewWorkDetailInfo" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="PreviewWorkDetailInfo">
        <span data-xztext="_显示区域宽度"></span>&nbsp;
        <input type="text" name="PreviewDetailInfoWidth" class="setinput_style1 blue" value="400" style="width:40px;min-width: 40px;">
        <span>&nbsp;px</span>
      </span>
    </p>

    <span class="optionAnchor" data-for-no="48" aria-hidden="true"></span>
    <p class="option" data-no="48">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_在搜索页面添加快捷搜索区域的说明">
        <span data-xztext="_在搜索页面添加快捷搜索区域"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showFastSearchArea" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="92" aria-hidden="true"></span>
    <p class="option" data-no="92">
      <a href="" target="_blank" class="settingNameStyle">
        <span data-xztext="_过滤搜索页面的作品"></span>
      </a>
      <input type="checkbox" name="filterSearchResults" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <button type="button" class="gray1 textButton showMsgBtn" data-title="_过滤搜索页面的作品" data-msg="_过滤搜索页面的作品的说明" data-xztext="_帮助"></button>
    </p>

    <span class="optionAnchor" data-for-no="88" aria-hidden="true"></span>
    <p class="option" data-no="88">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_在搜索页面里移除已关注用户的作品的说明">
        <span data-xztext="_在搜索页面里移除已关注用户的作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="removeWorksOfFollowedUsersOnSearchPage" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="18" aria-hidden="true"></span>
    <p class="option" data-no="18">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览搜索结果说明">
        <span data-xztext="_预览搜索结果"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="previewResult" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="previewResult">
        <span class="settingNameStyle" data-xztext="_上限"></span>
        <input type="text" name="previewResultLimit" class="setinput_style1 blue" value="1000" style="width:80px;min-width: 80px;">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="34" aria-hidden="true"></span>
    <p class="option" data-no="34">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_收藏设置的说明">
        <span data-xztext="_收藏设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="widthTag" id="widthTag1" class="need_beautify radio" value="yes" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="widthTag1" data-xztext="_添加tag"></label>
      <input type="radio" name="widthTag" id="widthTag2" class="need_beautify radio" value="no">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="widthTag2" data-xztext="_不添加tag"></label>
      <span class="verticalSplit"></span>
      <input type="radio" name="restrict" id="restrict1" class="need_beautify radio" value="no" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="restrict1" data-xztext="_公开"></label>
      <input type="radio" name="restrict" id="restrict2" class="need_beautify radio" value="yes">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="restrict2" data-xztext="_不公开"></label>
    </p>

    <p class="option settingCategoryName" data-no="61">
      <span data-xztext="_其他"></span>
    </p>

    <span class="optionAnchor" data-for-no="93" aria-hidden="true"></span>
    <p class="option" data-no="93">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_日志区域的默认可见性的说明">
        <span data-xztext="_日志区域的默认可见性"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="logVisibleDefault" id="logVisibleDefault1" class="need_beautify radio" value="show" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="logVisibleDefault1" data-xztext="_显示"></label>
      <input type="radio" name="logVisibleDefault" id="logVisibleDefault2" class="need_beautify radio" value="hide">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="logVisibleDefault2" data-xztext="_隐藏"></label>
    </p>

    <span class="optionAnchor" data-for-no="78" aria-hidden="true"></span>
    <p class="option" data-no="78">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_导出日志"></a>
      <input type="checkbox" name="exportLog" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="exportLog">
        <span class="settingNameStyle" data-xztext="_导出时机"></span>
        <input type="radio" name="exportLogTiming" id="exportLogTiming1" class="need_beautify radio" value="crawlComplete">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="exportLogTiming1" data-xztext="_抓取完毕2"></label>
        <input type="radio" name="exportLogTiming" id="exportLogTiming2" class="need_beautify radio" value="downloadComplete" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="exportLogTiming2" data-xztext="_下载完毕"></label>
        <span class="verticalSplit"></span>
        <span class="settingNameStyle" data-xztext="_日志类型"></span>
        <input type="checkbox" name="exportLogNormal" id="exportLogNormal" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="exportLogNormal" data-xztext="_正常"></label>
        <input type="checkbox" name="exportLogError" id="exportLogError" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="exportLogError" data-xztext="_错误"></label>
        <span class="verticalSplit"></span>
        <span data-xztext="_排除关键字"></span>&nbsp;
        <input type="text" name="exportLogExclude" class="setinput_style1 blue setinput_tag">
      </span>
    </p>

    <span class="optionAnchor" data-for-no="36" aria-hidden="true"></span>
    <p class="option" data-no="36">
      <a href="" target="_blank" class="settingNameStyle" data-xztext="_颜色主题"></a>
      <input type="radio" name="theme" id="theme1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="theme1" data-xztext="_自动检测"></label>
      <input type="radio" name="theme" id="theme2" class="need_beautify radio" value="white">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="theme2">White</label>
      <input type="radio" name="theme" id="theme3" class="need_beautify radio" value="dark">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="theme3">Dark</label>
    </p>

    <span class="optionAnchor" data-for-no="41" aria-hidden="true"></span>
    <p class="option" data-no="41">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_背景图片的说明">
        <span data-xztext="_背景图片"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="bgDisplay" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="bgDisplay">
        <button type="button" class="textButton gray1" id="selectBG" data-xztext="_选择文件"></button>
        <button type="button" class="textButton gray1" id="clearBG" data-xztext="_清除"></button>
        &nbsp;
        <span data-xztext="_对齐方式"></span>&nbsp;
        <input type="radio" name="bgPositionY" id="bgPosition1" class="need_beautify radio" value="center" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="bgPosition1" data-xztext="_居中"></label>
        <input type="radio" name="bgPositionY" id="bgPosition2" class="need_beautify radio" value="top">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="bgPosition2" data-xztext="_顶部"></label>
        <span data-xztext="_不透明度"></span>&nbsp;
        <input name="bgOpacity" type="range" />
      </span>
    </p>

    <span class="optionAnchor" data-for-no="45" aria-hidden="true"></span>
    <p class="option" data-no="45">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_选项卡切换方式的说明">
        <span data-xztext="_选项卡切换方式"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="switchTabBar" id="switchTabBar1" class="need_beautify radio" value="over" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="switchTabBar1" data-xztext="_鼠标经过"></label>
      <input type="radio" name="switchTabBar" id="switchTabBar2" class="need_beautify radio" value="click">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="switchTabBar2" data-xztext="_鼠标点击"></label>
    </p>

    <span class="optionAnchor" data-for-no="53" aria-hidden="true"></span>
    <p class="option" data-no="53">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_高亮显示关键字的说明">
        <span data-xztext="_高亮显示关键字"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="boldKeywords" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>

    <span class="optionAnchor" data-for-no="32" aria-hidden="true"></span>
    <p class="option" data-no="32">
      <a href="" target="_blank" class="settingNameStyle"><span class="key">Language</span></a>
      <input type="radio" name="userSetLang" id="userSetLang1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang1" data-xztext="_自动检测"></label>
      <input type="radio" name="userSetLang" id="userSetLang2" class="need_beautify radio" value="zh-cn">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang2">简体中文</label>
      <input type="radio" name="userSetLang" id="userSetLang3" class="need_beautify radio" value="zh-tw">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang3">繁體中文</label>
      <input type="radio" name="userSetLang" id="userSetLang4" class="need_beautify radio" value="ja">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang4">日本語</label>
      <input type="radio" name="userSetLang" id="userSetLang5" class="need_beautify radio" value="en">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang5">English</label>
      <input type="radio" name="userSetLang" id="userSetLang6" class="need_beautify radio" value="ko">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang6">한국어</label>
      <input type="radio" name="userSetLang" id="userSetLang7" class="need_beautify radio" value="ru">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="userSetLang7">Русский</label>
    </p>

    <span class="optionAnchor" data-for-no="37" aria-hidden="true"></span>
    <p class="option" data-no="37">
      <a href="" target="_blank" class="has_tip settingNameStyle" data-xztip="_管理设置的说明">
        <span data-xztext="_管理设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <button type="button" class="textButton gray1" id="exportSettings" data-xztext="_导出设置"></button>
      <button type="button" class="textButton gray1" id="importSettings" data-xztext="_导入设置"></button>
      <button type="button" class="textButton gray1" id="resetSettings" data-xztext="_重置设置"></button>
      <button type="button" class="textButton gray1" id="resetHelpTip" data-xztext="_重新显示帮助"></button>
    </p>

  </div>
</form>`
