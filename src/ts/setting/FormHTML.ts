import { Config } from '../Config'
import { wiki } from './Wiki'

// 设置项编号从 0 开始，现在最大是 90
// 目前没有使用的编号: 15, 20, 73
// 有些设置曾经使用过这些编号，但后来被移除了，所以这些编号就空缺了。在以后添加新设置时，可以考虑使用这些空缺的编号
export const formHtml = `
<form class="settingForm">
  <div class="tabsContnet">
    <p class="option" data-no="0">
      <a href="${wiki.link(0)}" target="_blank" class="settingNameStyle">
        <span class="textTip" data-xztext="_抓取多少作品"></span>
      </a>
      <input type="text" name="setWantWork" class="setinput_style1 blue" value="-1">
      &nbsp;
      <button class="textButton grayButton" type="button" role="setMin"></button>
      &nbsp;
      <button class="textButton grayButton" type="button" role="setMax"></button>
      &nbsp;
      <span class="gray1" data-xztext="_负1或者大于0" role="tip"></span>
      <button class="gray1 showSetWantWorkTip textButton" type="button" data-xztext="_提示"></button>
    </p>
    <p class="option" data-no="1">
      <a href="${wiki.link(1)}" target="_blank" class="settingNameStyle">
        <span class="textTip" data-xztext="_抓取多少页面"></span>
      </a>
      <input type="text" name="setWantPage" class="setinput_style1 blue" value="-1">
      &nbsp;
      <button class="textButton grayButton" type="button" role="setMin"></button>
      &nbsp;
      <button class="textButton grayButton" type="button" role="setMax"></button>
      &nbsp;
      <span class="gray1" data-xztext="_负1或者大于0" role="tip"></span>
      <button class="gray1 showSetWantPageTip textButton" type="button" data-xztext="_提示"></button>
    </p>
    <p class="option" data-no="2">
      <a href="${wiki.link(2)}" target="_blank" class="settingNameStyle">
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
    <p class="option" data-no="44">
      <a href="${wiki.link(44)}" target="_blank" class="settingNameStyle">
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
    <p class="option" data-no="81">
      <a href="${wiki.link(81)}" target="_blank" class="settingNameStyle">
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
    <p class="option" data-no="6">
      <a href="${wiki.link(6)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_收藏状态"></span>
      </a>
      <input type="checkbox" name="downNotBookmarked" id="setDownNotBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownNotBookmarked" data-xztext="_未收藏"></label>
      <input type="checkbox" name="downBookmarked" id="setDownBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownBookmarked" data-xztext="_已收藏"></label>
    </p>
    <p class="option" data-no="23">
      <a href="${wiki.link(23)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_图片色彩"></span>
      </a>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownColorImg" data-xztext="_彩色图片"></label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownBlackWhiteImg" data-xztext="_黑白图片"></label>
    </p>
    <p class="option" data-no="21">
      <a href="${wiki.link(21)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_图片数量"></span>
      </a>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownSingleImg" data-xztext="_单图作品"></label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setDownMultiImg" data-xztext="_多图作品"></label>
    </p>
    <p class="option" data-no="51">
      <a href="${wiki.link(51)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示高级设置说明">
        <span data-xztext="_显示高级设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="3">
      <a href="${wiki.link(3)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_必须大于0">
        <span data-xztext="_多图作品只下载前几张图片"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="firstFewImagesSwitch">
        <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
      </span>
    </p>
    <p class="option" data-no="47">
      <a href="${wiki.link(47)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_多图作品的图片数量上限提示">
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
    <p class="option" data-no="5">
      <a href="${wiki.link(5)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置收藏数量的提示">
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
    <p class="option" data-no="7">
      <a href="${wiki.link(7)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_筛选宽高的提示文字">
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
    <p class="option" data-no="8">
      <a href="${wiki.link(8)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置宽高比例Title">
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
    <p class="option" data-no="9">
      <a href="${wiki.link(9)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置id范围提示">
        <span data-xztext="_id范围"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">
        <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value=">" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRange1">&gt;</label>
        <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="<">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="idRange2">&lt;</label>
        <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="" placeholder="100000000">
      </span>
    </p>
    <p class="option" data-no="10">
      <a href="${wiki.link(10)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_设置投稿时间提示">
        <span data-xztext="_投稿时间"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="postDate">
        <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
        &nbsp;-&nbsp;
        <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      </span>
    </p>
    <p class="option" data-no="11">
      <a href="${wiki.link(11)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_必须tag的提示文字">
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
    <p class="option" data-no="12">
      <a href="${wiki.link(12)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_排除tag的提示文字">
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
    <div class="centerWrap_btns">
      <slot data-name="stopCrawl"></slot>
      <slot data-name="crawlBtns"></slot>
      <slot data-name="selectWorkBtns"></slot>
    </div>
  </div>
  <div class="tabsContnet">
    <p class="option" data-no="13">
      <a href="${wiki.link(13)}" target="_blank" class="settingNameStyle" data-xztext="_命名规则"></a>
      <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="pixiv/{user}-{user_id}/{id}-{title}">
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
        <option value="{AI}">{AI}</option>
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
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{series_id}">{series_id}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
      </select>
      &nbsp;
      <slot data-name="saveNamingRule"></slot>
      <button class="showFileNameTip textButton" type="button" data-xztext="_提示"></button>
    </p>
    <p class="fileNameTip tip">
      <span data-xztext="_设置文件夹名的提示"></span>
      <span>{user}<span class="key">/</span>{id}</span>
      <br>
      <span data-xztext="_命名标记提醒"></span>
      <br>
      * <span data-xztext="_有些标记并不总是可用的提醒"></span>
      <br>
      <span class="blue">{id}</span>
      <span data-xztext="_命名标记id"></span>
      <br>
      <span class="blue">{user}</span>
      <span data-xztext="_命名标记user"></span>
      <br>
      <span class="blue">{user_id}</span>
      <span data-xztext="_用户id"></span>
      <br>
      <span class="blue">{title}</span>
      <span data-xztext="_命名标记title"></span>
      <br>
      <span class="blue">{tags}</span>
      <span data-xztext="_命名标记tags"></span>
      <br>
      <span class="blue">{tags_translate}</span>
      <span data-xztext="_命名标记tags_trans"></span>
      <br>
      <span class="blue">{tags_transl_only}</span>
      <span data-xztext="_命名标记tags_transl_only"></span>
      <br>
      <span class="blue">{page_title}</span>
      <span data-xztext="_文件夹标记PTitle"></span>
      <br>
      * <span class="blue">{page_tag}</span>
      <span data-xztext="_文件夹标记PTag"></span>
      <br>
      <span class="blue">{type}</span>
      <span data-xztext="_命名标记type"></span>
      <br>
      * <span class="blue">{AI}</span>
      <span data-xztext="_命名标记AI"></span>
      <br>
      <span class="blue">{like}</span>
      <span data-xztext="_命名标记like"></span>
      <br>
      <span class="blue">{bmk}</span>
      <span data-xztext="_命名标记bmk"></span>
      <br>
      <span class="blue">{bmk_1000}</span>
      <span data-xztext="_命名标记bmk_1000"></span>
      <br>
      <span class="blue">{bmk_id}</span>
      <span data-xztext="_命名标记bmk_id"></span>
      <br>
      <span class="blue">{view}</span>
      <span data-xztext="_命名标记view"></span>
      <br>
      * <span class="blue">{rank}</span>
      <span data-xztext="_命名标记rank"></span>
      <br>
      <span class="blue">{date}</span>
      <span data-xztext="_命名标记date"></span>
      <br>
      <span class="blue">{upload_date}</span>
      <span data-xztext="_命名标记upload_date"></span>
      <br>
      <span class="blue">{task_date}</span>
      <span data-xztext="_命名标记taskDate"></span>
      <br>
      <span class="blue">{px}</span>
      <span data-xztext="_命名标记px"></span>
      <br>
      * <span class="blue">{series_title}</span>
      <span data-xztext="_命名标记seriesTitle"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      * <span class="blue">{series_order}</span>
      <span data-xztext="_命名标记seriesOrder"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      * <span class="blue">{series_id}</span>
      <span data-xztext="_命名标记seriesId"></span>
      <span data-xztext="_当作品属于一个系列时可用"></span>
      <br>
      <span class="blue">{id_num}</span>
      <span data-xztext="_命名标记id_num"></span>
      <br>
      <span class="blue">{p_num}</span>
      <span data-xztext="_命名标记p_num"></span>
    </p>
    <p class="option" data-no="50">
      <a href="${wiki.link(50)}" target="_blank" class="settingNameStyle" data-xztext="_在不同的页面类型中使用不同的命名规则"></a>
      <input type="checkbox" name="setNameRuleForEachPageType" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="64">
      <a href="${wiki.link(64)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_只有一个抓取结果时不建立文件夹的提示">
        <span data-xztext="_只有一个抓取结果时不建立文件夹"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="notFolderWhenOneFile" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="38">
      <a href="${wiki.link(38)}" target="_blank" class="settingNameStyle" data-xztext="_把r18作品存入指定的文件夹里"></a>
      <input type="checkbox" name="r18Folder" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="r18Folder">
        <span data-xztext="_目录名"></span>
        <input type="text" name="r18FolderName" class="setinput_style1 blue" style="width:150px;min-width: 150px;" value="[R-18&R-18G]">
      </span>
    </p>
    <p class="option" data-no="16">
      <a href="${wiki.link(16)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_下载线程"></span>
      </a>
      <input type="text" name="downloadThread" class="has_tip setinput_style1 blue" data-xztip="_下载线程的说明" value="5">
    </p>
    <p class="option" data-no="17">
      <a href="${wiki.link(17)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_自动开始下载的提示">
        <span data-xztext="_自动开始下载"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="autoStartDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="33">
      <a href="${wiki.link(33)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载之后收藏作品的提示">
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
  <div class="tabsContnet">
    <div class="centerWrap_btns">
      <slot data-name="otherBtns"></slot>
    </div>
    <p class="option" data-no="57">
      <a href="${wiki.link(57)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示高级设置说明">
        <span data-xztext="_显示高级设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option settingCategoryName" data-no="59">
      <span data-xztext="_抓取"></span>
    </p>
    <p class="option" data-no="75">
      <a href="${wiki.link(75)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_减慢抓取速度的说明">
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
    <p class="option" data-no="69">
      <a href="${wiki.link(69)}" target="_blank" class="settingNameStyle" data-xztext="_不抓取多图作品的最后一张图片"></a>
      <input type="checkbox" name="doNotDownloadLastImageOfMultiImageWork" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="79">
      <a href="${wiki.link(79)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_特定用户的多图作品不下载最后几张图片"></span>
        <span class="gray1"> ? </span>
      </a>
      <slot data-name="DoNotDownloadLastFewImagesSlot"></slot>
    </p>
    <p class="option" data-no="35">
      <a href="${wiki.link(35)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_用户阻止名单的说明">
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
        <button type="button" class="gray1 textButton" id="showRemoveBlockedUsersWorkTip" data-xztext="_提示"></button>
      </span>
    </p>
    <p class="option" data-no="39">
      <a href="${wiki.link(39)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_针对特定用户屏蔽tag的提示">
        <span data-xztext="_针对特定用户屏蔽tag"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="blockTagsForSpecificUser" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="blockTagsForSpecificUser">
        <slot data-name="blockTagsForSpecificUser"></slot>
      </span>
    </p>
    <p class="option" data-no="74">
      <a href="${wiki.link(74)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_定时抓取的间隔时间的说明">
        <span data-xztext="_定时抓取的间隔时间"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="text" name="timedCrawlInterval" class="setinput_style1 blue" value="120">
      <span class="settingNameStyle" data-xztext="_分钟"></span>
    </p>
    <p class="option" data-no="54">
      <a href="${wiki.link(54)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_自动导出抓取结果的说明">
        <span data-xztext="_自动导出抓取结果"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="autoExportResult" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="autoExportResult">
        <span data-xztext="_抓取结果"></span>
        <span>&gt;</span>
        <input type="text" name="autoExportResultNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
        <span>&nbsp;</span>
        <span class="settingNameStyle" data-xztext="_文件格式"> </span>
        <input type="checkbox" name="autoExportResultCSV" id="autoExportResultCSV" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="autoExportResultCSV"> CSV </label>
        <input type="checkbox" name="autoExportResultJSON" id="autoExportResultJSON" class="need_beautify checkbox_common" checked>
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="autoExportResultJSON"> JSON </label>
      </span>
    </p>
    <p class="option" data-no="85">
      <a href="${wiki.link(85)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_导出ID列表的说明">
        <span data-xztext="_导出ID列表"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="exportIDList" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option settingCategoryName" data-no="65">
      <span data-xztext="_命名"></span>
    </p>
    <p class="option" data-no="19">
      <a href="${wiki.link(19)}" target="_blank" class="settingNameStyle" data-xztext="_为作品建立单独的文件夹"></a>
      <input type="checkbox" name="workDir" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="workDir">
        <label for="workDirFileNumber" data-xztext="_文件数量大于"></label>
        <input type="text" name="workDirFileNumber" id="workDirFileNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
        <span>&nbsp;</span>
        <label for="workDirNameRule" data-xztext="_目录名"></label>
        <input class="has_tip setinput_style1 blue" type="text" data-xztip="_用idm_num代替id" name="workDirNameRule" id="workDirNameRule" value="{id_num}">
      </span>
    </p>
    <p class="option" data-no="42">
      <a href="${wiki.link(42)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_根据作品类型自动建立文件夹的说明">
        <span data-xztext="_根据作品类型自动建立文件夹"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="createFolderByType" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="createFolderByType">
        <input type="checkbox" name="createFolderByTypeIllust" id="createFolderByTypeIllust" class="need_beautify checkbox_common">
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="createFolderByTypeIllust" class="has_tip" data-tip="${Config.worksTypeName[0]}">
          <span data-xztext="_插画"></span>
        </label>
        <input type="checkbox" name="createFolderByTypeManga" id="createFolderByTypeManga" class="need_beautify checkbox_common">
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="createFolderByTypeManga" class="has_tip" data-tip="${Config.worksTypeName[1]}">
          <span data-xztext="_漫画"></span>
        </label>
        <input type="checkbox" name="createFolderByTypeUgoira" id="createFolderByTypeUgoira" class="need_beautify checkbox_common">
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="createFolderByTypeUgoira" class="has_tip" data-tip="${Config.worksTypeName[2]}">
          <span data-xztext="_动图"></span>
        </label>
        <input type="checkbox" name="createFolderByTypeNovel" id="createFolderByTypeNovel" class="need_beautify checkbox_common">
        <span class="beautify_checkbox" tabindex="0"></span>
        <label for="createFolderByTypeNovel" class="has_tip" data-tip="${Config.worksTypeName[3]}">
          <span data-xztext="_小说"></span>
        </label>
      </span>
    </p>
    <p class="option" data-no="43">
      <a href="${wiki.link(43)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_使用匹配的tag建立文件夹的说明">
        <span data-xztext="_使用第一个匹配的tag建立文件夹"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="createFolderByTag" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="createFolderByTag">
        <textarea class="centerPanelTextArea beautify_scrollbar" name="createFolderTagList" rows="1" placeholder="tag1,tag2,tag3"></textarea>
      </span>
    </p>
    <p class="option" data-no="80">
      <a href="${wiki.link(80)}" target="_blank" class="settingNameStyle" data-xztext="_如果作品含有某些标签则对这个作品使用另一种命名规则"></a>
      <input type="checkbox" name="UseDifferentNameRuleIfWorkHasTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="UseDifferentNameRuleIfWorkHasTagSwitch">
        <slot data-name="UseDifferentNameRuleIfWorkHasTagSlot"></slot>
      </span>
    </p>
    <p class="option" data-no="22">
      <a href="${wiki.link(22)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_第一张图不带序号说明">
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
      </span>
    </p>
    <p class="option" data-no="46">
      <a href="${wiki.link(46)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_在序号前面填充0的说明">
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
    <p class="option" data-no="29">
      <a href="${wiki.link(29)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_文件名长度限制的说明">
        <span data-xztext="_文件名长度限制"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
        <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
      </span>
    </p>
    <p class="option" data-no="83">
      <a href="${wiki.link(83)}" target="_blank" class="settingNameStyle" data-xztext="_标签分隔符号"></a>
      <input type="text" name="tagsSeparator" class="setinput_style1 blue" value=",">
      <button type="button" class="gray1 textButton showTagsSeparatorTip" data-xztext="_提示"></button>
    </p>
    <p class="tagsSeparatorTip tip" style="display:none">
      <span data-xztext="_标签分隔符号提示"></span>
    </p>
    <p class="option" data-no="67">
      <a href="${wiki.link(67)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_移除用户名中的at和后续字符的说明">
        <span data-xztext="_移除用户名中的at和后续字符"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="removeAtFromUsername" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="66">
      <a href="${wiki.link(66)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_自定义用户名的说明">
        <span data-xztext="_自定义用户名"></span>
        <span class="gray1"> ? </span>
      </a>
      <slot data-name="setUserNameSlot"></slot>
    </p>
    <p class="option settingCategoryName" data-no="58">
      <span data-xztext="_下载"></span>
    </p>
    <p class="option" data-no="52">
      <a href="${wiki.link(52)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载完成后显示通知的说明">
        <span data-xztext="_下载完成后显示通知"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showNotificationAfterDownloadComplete" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="90">
      <a href="${wiki.link(90)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_下载间隔的说明">
        <span data-xztext="_下载间隔"></span>
        <span class="gray1"> ? </span>
      </a>
      <span data-xztext="_当作品数量大于"></span>
      <input type="text" name="downloadIntervalOnWorksNumber" class="setinput_style1 blue" value="120">
      <span class="verticalSplit"></span>
      <span data-xztext="_间隔时间"></span>
      <input type="text" name="downloadInterval" class="setinput_style1 blue" value="0">
      <span data-xztext="_秒"></span>
    </p>
    <p class="option" data-no="76">
      <a href="${wiki.link(76)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_点击收藏按钮时下载作品"></span>
      </a>
      <input type="checkbox" name="downloadOnClickBookmark" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="77">
      <a href="${wiki.link(77)}" target="_blank" class="settingNameStyle">
        <span data-xztext="_点击点赞按钮时下载作品"></span>
      </a>
      <input type="checkbox" name="downloadOnClickLike" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="4">
      <a href="${wiki.link(4)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_动图保存格式的说明">
        <span data-xztext="_动图保存格式"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs1" data-xztext="_webmVideo"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs3" data-xztext="_gif"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-xztip="_无损" data-xztext="_apng"></label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="ugoiraSaveAs2" data-xztext="_zipFile"></label>
    </p>
    <p class="option" data-no="24">
      <a href="${wiki.link(24)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_同时转换多少个动图的说明">
        <span data-xztext="_同时转换多少个动图"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
    </p>
    <p class="option" data-no="26">
      <a href="${wiki.link(26)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_小说保存格式的说明">
        <span data-xztext="_小说保存格式"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="novelSaveAs1"> TXT </label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="novelSaveAs2"> EPUB </label>
    </p>
    <p class="option" data-no="27">
      <a href="${wiki.link(27)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_在小说里保存元数据提示">
        <span data-xztext="_在小说里保存元数据"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="70">
      <a href="${wiki.link(70)}" target="_blank" class="settingNameStyle" data-xztext="_下载小说的封面图片"></a>
      <input type="checkbox" name="downloadNovelCoverImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="72">
      <a href="${wiki.link(72)}" target="_blank" class="settingNameStyle" data-xztext="_下载小说里的内嵌图片"></a>
      <input type="checkbox" name="downloadNovelEmbeddedImage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="49">
      <a href="${wiki.link(49)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_保存作品的元数据说明">
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
    </p>
    <p class="option" data-no="89">
      <a href="${wiki.link(89)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_保存作品简介的说明">
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
    <p class="option" data-no="30">
      <a href="${wiki.link(30)}" target="_blank" class="settingNameStyle" data-xztext="_图片尺寸"></a>
      <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize1" data-xztext="_原图"></label>
      <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize2" data-xztext="_普通"></label>
      <span class="gray1">(1200px)</span>
      <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize3" data-xztext="_小图"></label>
      <span class="gray1">(540px)</span>
      <input type="radio" name="imageSize" id="imageSize4" class="need_beautify radio" value="thumb">
      <span class="beautify_radio" tabindex="0"></span>
      <label for="imageSize4" data-xztext="_方形缩略图"></label>
      <span class="gray1">(250px)</span>
    </p>
    <p class="option" data-no="25">
      <a href="${wiki.link(25)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_文件体积限制的说明">
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
    <p class="option" data-no="82">
      <a href="${wiki.link(82)}" target="_blank" class="settingNameStyle" data-xztext="_文件下载顺序"></a>
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
    <p class="option" data-no="28">
      <a href="${wiki.link(28)}" target="_blank" class="settingNameStyle" data-xztext="_不下载重复文件"></a>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="deduplication">
        &nbsp; <span data-xztext="_策略"></span>
        <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label class="has_tip" for="dupliStrategy1" data-xztip="_严格模式说明" data-xztext="_严格"></label>
        <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
        <span class="beautify_radio" tabindex="0"></span>
        <label class="has_tip" for="dupliStrategy2" data-xztip="_宽松模式说明" data-xztext="_宽松"></label>
        <button class="textButton gray1" type="button" id="exportDownloadRecord" data-xztext="_导出"></button>
        <button class="textButton gray1" type="button" id="importDownloadRecord" data-xztext="_导入"></button>
        <button class="textButton gray1" type="button" id="clearDownloadRecord" data-xztext="_清除"></button>
        <button class="textButton gray1" type="button" id="deduplicationHelp" data-xztext="_提示"></button>
      </span>
    </p>
    <p class="option settingCategoryName" data-no="60">
      <span data-xztext="_增强"></span>
    </p>
    <p class="option" data-no="84">
      <a href="${wiki.link(84)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_高亮关注的用户的说明">
        <span data-xztext="_高亮关注的用户"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="highlightFollowingUsers" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="87">
      <a href="${wiki.link(87)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览作品的详细信息的说明">
        <span data-xztext="_预览作品的详细信息"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="PreviewWorkDetailInfo" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="PreviewWorkDetailInfo">
        <span data-xztext="_显示区域宽度"></span>&nbsp;
        <input type="text" name="PreviewDetailInfoWidth" class="setinput_style1 blue" value="500" style="width:40px;min-width: 40px;">
        <span>&nbsp;px</span>
      </span>
    </p>
    <p class="option" data-no="68">
      <a href="${wiki.link(68)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示更大的缩略图的说明">
        <span data-xztext="_显示更大的缩略图"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showLargerThumbnails" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="63">
      <a href="${wiki.link(63)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_替换方形缩略图以显示图片比例的说明">
        <span data-xztext="_替换方形缩略图以显示图片比例"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="replaceSquareThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="55">
      <a href="${wiki.link(55)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览作品的说明">
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
        <button type="button" class="gray1 textButton showPreviewWorkTip" data-xztext="_快捷键列表"></button>
      </span>
    </p>
    <p class="previewWorkTip tip" style="display:none">
      <span data-xztext="_预览作品的快捷键说明"></span>
    </p>
    <p class="option" data-no="71">
      <a href="${wiki.link(71)}" target="_blank" class="settingNameStyle" data-xztext="_预览动图"></a>
      <input type="checkbox" name="previewUgoira" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="62">
      <a href="${wiki.link(62)}" target="_blank" class="settingNameStyle" data-xztext="_长按右键显示大图"></a>
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
      </span>
    </p>
    <p class="option" data-no="40">
      <a href="${wiki.link(40)}" target="_blank" class="settingNameStyle" data-xztext="_在作品缩略图上显示放大按钮"></a>
      <input type="checkbox" name="magnifier" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="magnifier">
        <span class="settingNameStyle" data-xztext="_位置"></span>
        <input type="radio" name="magnifierPosition" id="magnifierPosition1" class="need_beautify radio" value="left">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierPosition1" data-xztext="_左"></label>
        <input type="radio" name="magnifierPosition" id="magnifierPosition2" class="need_beautify radio" value="right" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierPosition2" data-xztext="_右"></label>
        <span class="verticalSplit"></span>
        <span class="settingNameStyle" data-xztext="_图片尺寸2"></span>
        <input type="radio" name="magnifierSize" id="magnifierSize1" class="need_beautify radio" value="original">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierSize1" data-xztext="_原图"></label>
        <input type="radio" name="magnifierSize" id="magnifierSize2" class="need_beautify radio" value="regular" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="magnifierSize2" data-xztext="_普通"></label>
      </span>
    </p>
    <p class="option" data-no="56">
      <a href="${wiki.link(56)}" target="_blank" class="settingNameStyle" data-xztext="_在作品缩略图上显示下载按钮"></a>
      <input type="checkbox" name="showDownloadBtnOnThumb" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="14">
      <a href="${wiki.link(14)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_显示复制按钮的提示">
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
      <input type="checkbox" name="copyFormatText" id="setCopyFormatText" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCopyFormatText">text/plain</label>
      <input type="checkbox" name="copyFormatHtml" id="setCopyFormatHtml" class="need_beautify checkbox_common">
      <span class="beautify_checkbox" tabindex="0"></span>
      <label for="setCopyFormatHtml">text/html</label>
      <button type="button" class="gray1 textButton" id="showCopyWorkDataTip" data-xztext="_帮助"></button>
      <span class="verticalSplit"></span>
      
      <span data-xztext="_文本格式"></span>:&nbsp;
      <input type="text" name="copyWorkInfoFormat" class="setinput_style1 blue" style="width:100%;max-width:350px;" value="id: {id}{n}title: {title}{n}tags: {tags}{n}url: {url}{n}user: {user}">
      <button type="button" class="gray1 textButton showCopyWorkInfoFormatTip" data-xztext="_提示"></button>
    </p>
    <p class="copyWorkInfoFormatTip tip" style="display:none">
      <span data-xztext="_复制内容的格式的提示"></span>
      <br>
      <span class="blue">{url}</span>
      <span data-xztext="_url标记的说明"></span>
      <br>
      <span class="blue">{n}</span>
      <span data-xztext="_换行标记的说明"></span>
      <br>
    </p>
    <p class="option" data-no="86">
      <a href="${wiki.link(86)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_在多图作品页面里显示缩略图列表的说明">
        <span data-xztext="_在多图作品页面里显示缩略图列表"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="displayThumbnailListOnMultiImageWorkPage" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="48">
      <a href="${wiki.link(48)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_在搜索页面添加快捷搜索区域的说明">
        <span data-xztext="_在搜索页面添加快捷搜索区域"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="showFastSearchArea" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="88">
      <a href="${wiki.link(88)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_在搜索页面里移除已关注用户的作品的说明">
        <span data-xztext="_在搜索页面里移除已关注用户的作品"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="removeWorksOfFollowedUsersOnSearchPage" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="18">
      <a href="${wiki.link(18)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_预览搜索结果说明">
        <span data-xztext="_预览搜索结果"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="previewResult" class="need_beautify checkbox_switch" checked>
      <span class="subOptionWrap" data-show="previewResult">
        <span class="settingNameStyle" data-xztext="_上限"></span>
        <input type="text" name="previewResultLimit" class="setinput_style1 blue" value="1000" style="width:80px;min-width: 80px;">
      </span>
    </p>
    <p class="option" data-no="34">
      <a href="${wiki.link(34)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_收藏设置的说明">
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
    <p class="option" data-no="31">
      <a href="${wiki.link(31)}" target="_blank" class="settingNameStyle" data-xztext="_日期格式"></a>
      <input type="text" name="dateFormat" class="setinput_style1 blue" style="width:250px;" value="YYYY-MM-DD">
      <button type="button" class="gray1 textButton showDateTip" data-xztext="_提示"></button>
    </p>
    <p class="dateFormatTip tip" style="display:none">
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
    <p class="option" data-no="78">
      <a href="${wiki.link(78)}" target="_blank" class="settingNameStyle" data-xztext="_导出日志"></a>
      <input type="checkbox" name="exportLog" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="exportLog">
        <span class="settingNameStyle" data-xztext="_导出时机"></span>
        <input type="radio" name="exportLogTiming" id="exportLogTiming1" class="need_beautify radio" value="crawlComplete">
        <span class="beautify_radio" tabindex="0"></span>
        <label for="exportLogTiming1" data-xztext="_抓取完毕2"></label>
        <input type="radio" name="exportLogTiming" id="exportLogTiming2" class="need_beautify radio" value="downloadComplete" checked>
        <span class="beautify_radio" tabindex="0"></span>
        <label for="exportLogTiming2" data-xztext="_下载完毕2"></label>
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
    <p class="option" data-no="36">
      <a href="${wiki.link(36)}" target="_blank" class="settingNameStyle" data-xztext="_颜色主题"></a>
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
    <p class="option" data-no="41">
      <a href="${wiki.link(41)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_背景图片的说明">
        <span data-xztext="_背景图片"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="bgDisplay" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
      <span class="subOptionWrap" data-show="bgDisplay">
        <button class="textButton gray1" type="button" id="selectBG" data-xztext="_选择文件"></button>
        <button class="textButton gray1" type="button" id="clearBG" data-xztext="_清除"></button>
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
    <p class="option" data-no="45">
      <a href="${wiki.link(45)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_选项卡切换方式的说明">
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
    <p class="option" data-no="53">
      <a href="${wiki.link(53)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_高亮显示关键字的说明">
        <span data-xztext="_高亮显示关键字"></span>
        <span class="gray1"> ? </span>
      </a>
      <input type="checkbox" name="boldKeywords" class="need_beautify checkbox_switch">
      <span class="beautify_switch" tabindex="0"></span>
    </p>
    <p class="option" data-no="32">
      <a href="${wiki.link(32)}" target="_blank" class="settingNameStyle"><span class="key">Language</span></a>
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
    <p class="option" data-no="37">
      <a href="${wiki.link(37)}" target="_blank" class="has_tip settingNameStyle" data-xztip="_管理设置的说明">
        <span data-xztext="_管理设置"></span>
        <span class="gray1"> ? </span>
      </a>
      <button class="textButton gray1" type="button" id="exportSettings" data-xztext="_导出设置"></button>
      <button class="textButton gray1" type="button" id="importSettings" data-xztext="_导入设置"></button>
      <button class="textButton gray1" type="button" id="resetSettings" data-xztext="_重置设置"></button>
      <button class="textButton gray1" type="button" id="resetHelpTip" data-xztext="_重新显示帮助"></button>
    </p>
  </div>
</form>`
