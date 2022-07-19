import { Config } from '../config/Config'

export const formHtml = `<form class="settingForm">
  <div class="tabsContnet">
    <p class="option" data-no="1">
    <span class="setWantPageWrap">
    <span class="has_tip settingNameStyle1" data-xztip="_抓取多少页面"><span class="setWantPageTip1" data-xztext="_抓取多少页面"></span><span class="gray1"> ? </span></span>
    <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
    value = '-1'>&nbsp;
    <span class="setWantPageTip2 gray1" data-xztext="_数字提示1"></span>
    </span>
    </p>

    <p class="option" data-no="2">
    <span class="settingNameStyle1">
    <span data-xztext="_作品类型"></span>
    </span>
    <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setWorkType0" data-xztext="_插画"></label>
    <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setWorkType1" data-xztext="_漫画"></label>
    <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setWorkType2" data-xztext="_动图"></label>
    <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setWorkType3" data-xztext="_小说"></label>
    </p>

    <p class="option" data-no="44">
    <span class="settingNameStyle1">
    <span data-xztext="_年龄限制"></span>
    </span>
    <input type="checkbox" name="downAllAges" id="downAllAges" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="downAllAges" data-xztext="_全年龄"></label>
    <input type="checkbox" name="downR18" id="downR18" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="downR18"> R-18</label>
    <input type="checkbox" name="downR18G" id="downR18G" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="downR18G"> R-18G</label>
    </p>

    <p class="option" data-no="6">
    <span class="settingNameStyle1">
    <span data-xztext="_收藏状态"></span>
    </span>
    <input type="checkbox" name="downNotBookmarked" id="setDownNotBookmarked" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownNotBookmarked" data-xztext="_未收藏"></label>
    <input type="checkbox" name="downBookmarked" id="setDownBookmarked" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownBookmarked" data-xztext="_已收藏"></label>
    </p>
    
    <p class="option" data-no="23">
    <span class="settingNameStyle1">
    <span data-xztext="_图片色彩"></span>
    </span>
    <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownColorImg" data-xztext="_彩色图片"></label>
    <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownBlackWhiteImg" data-xztext="_黑白图片"></label>
    </p>

    <p class="option" data-no="21">
    <span class="settingNameStyle1">
    <span data-xztext="_图片数量"></span>
    </span>
    <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownSingleImg" data-xztext="_单图作品"></label>
    <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="setDownMultiImg" data-xztext="_多图作品"></label>
    </p>

    <p class="option" data-no="51">
    <span class="has_tip settingNameStyle1" data-xztip="_显示高级设置说明">
    <span data-xztext="_显示高级设置"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="3">
    <span class="has_tip settingNameStyle1" data-xztip="_必须大于0">
    <span data-xztext="_多图作品只下载前几张图片"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="firstFewImagesSwitch">
    <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
    </span>
    </p>

    <p class="option" data-no="47">
    <span class="has_tip settingNameStyle1" data-xztip="_超出此限制的多图作品不会被下载">
    <span data-xztext="_多图作品的图片数量上限"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="multiImageWorkImageLimitSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="multiImageWorkImageLimitSwitch">
    &lt;=&nbsp;
    <input type="text" name="multiImageWorkImageLimit" class="setinput_style1 blue" value="1">
    </span>
    </p>

    <p class="option" data-no="5">
    <span class="has_tip settingNameStyle1" data-xztip="_设置收藏数量的提示">
    <span data-xztext="_收藏数量"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="BMKNumSwitch">
    &gt;=&nbsp;
    <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
    &lt;=&nbsp;
    <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="${Config.BookmarkCountLimit}">
&nbsp;<span data-xztext="_或者"></span>
    <span class="has_tip settingNameStyle1" data-xztip="_日均收藏数量的提示">
    <span data-xztext="_日均收藏数量"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="BMKNumAverageSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="BMKNumAverageSwitch">
      <input type="text" name="BMKNumAverage" class="setinput_style1 blue bmkNum" value="600">
    </span>
    </span>
    </p>

    <p class="option" data-no="7">
    <span class="has_tip settingNameStyle1" data-xztip="_筛选宽高的提示文字">
    <span data-xztext="_图片的宽高"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="setWHSwitch">

    <input type="radio" name="widthHeightLimit" id="widthHeightLimit1" class="need_beautify radio" value=">=" checked>
    <span class="beautify_radio"></span>
    <label for="widthHeightLimit1">&gt;=</label>

    <input type="radio" name="widthHeightLimit" id="widthHeightLimit2" class="need_beautify radio" value="=">
    <span class="beautify_radio"></span>
    <label for="widthHeightLimit2">=</label>
    
    <input type="radio" name="widthHeightLimit" id="widthHeightLimit3" class="need_beautify radio" value="<=">
    <span class="beautify_radio"></span>
    <label for="widthHeightLimit3">&lt;=</label>

    <span data-xztext="_宽度"></span>
    <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
    <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
    <span class="beautify_radio"></span>
    <label for="setWidth_AndOr1" data-xztext="_并且"></label>
    <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
    <span class="beautify_radio"></span>
    <label for="setWidth_AndOr2" data-xztext="_或者"></label>
    <span data-xztext="_高度"></span>
    <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
    </span>
    </p>

    <p class="option" data-no="8">
    <span class="has_tip settingNameStyle1" data-xztip="_设置宽高比例Title">
    <span data-xztext="_图片的宽高比例"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="ratioSwitch">
    <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="horizontal">
    <span class="beautify_radio"></span>
    <label for="ratio1" data-xztext="_横图"></label>

    <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="vertical">
    <span class="beautify_radio"></span>
    <label for="ratio2" data-xztext="_竖图"></label>
    
    <input type="radio" name="ratio" id="ratio0" class="need_beautify radio" value="square">
    <span class="beautify_radio"></span>
    <label for="ratio0" data-xztext="_正方形"></label>

    <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="userSet">
    <span class="beautify_radio"></span>
    <label for="ratio3" data-xztext="_输入宽高比"></label>
    <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
    </span>
    </p>

    <p class="option" data-no="9">
    <span class="has_tip settingNameStyle1" data-xztip="_设置id范围提示">
    <span data-xztext="_id范围"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="idRangeSwitch">
    <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value=">" checked>
    <span class="beautify_radio"></span>
    <label for="idRange1">&gt;</label>
    <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="<">
    <span class="beautify_radio"></span>
    <label for="idRange2">&lt;</label>
    <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
    </span>
    </p>

    <p class="option" data-no="10">
    <span class="has_tip settingNameStyle1" data-xztip="_设置投稿时间提示">
    <span data-xztext="_投稿时间"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="postDate">
    <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
    &nbsp;-&nbsp;
    <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
    </span>
    </p>

    <p class="option" data-no="11">
    <span class="has_tip settingNameStyle1" data-xztip="_必须tag的提示文字">
    <span data-xztext="_必须含有tag"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="needTagSwitch">
    <input type="radio" name="needTagMode" id="needTagMode1" class="need_beautify radio" value="all" checked>
    <span class="beautify_radio"></span>
    <label for="needTagMode1" data-xztext="_全部"></label>
    <input type="radio" name="needTagMode" id="needTagMode2" class="need_beautify radio" value="one">
    <span class="beautify_radio"></span>
    <label for="needTagMode2" data-xztext="_任一"></label>
    <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
    </span>
    </p>

    <p class="option" data-no="12">
    <span class="has_tip settingNameStyle1" data-xztip="_排除tag的提示文字">
    <span data-xztext="_不能含有tag"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="notNeedTagSwitch">
    <span class="gray1" data-xztext="_任一"></span>&nbsp;
    <input type="radio" id="tagMatchMode1" class="need_beautify radio" name="tagMatchMode" value="partial" checked>
    <span class="beautify_radio"></span>
    <label for="tagMatchMode1" data-xztext="_部分一致"></label>
    <input type="radio" id="tagMatchMode2" class="need_beautify radio" name="tagMatchMode" value="whole" checked>
    <span class="beautify_radio"></span>
    <label for="tagMatchMode2" data-xztext="_完全一致"></label>
    <br>
    <textarea class="centerPanelTextArea beautify_scrollbar" name="notNeedTag" rows="1"></textarea>
    </span>
    </p>

    <div class="centerWrap_btns">
      <slot data-name="crawlBtns"></slot>
      <slot data-name="selectWorkBtns"></slot>
    </div>
  </div>
  <div class="tabsContnet">
  <p class="option" data-no="13">
    <span class="settingNameStyle1" data-xztext="_命名规则"></span>
    <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{p_title}/{id}">
    &nbsp;
    <select name="fileNameSelect" class="beautify_scrollbar">
      <option value="default">…</option>
      <option value="{id}">{id}</option>
      <option value="{user}">{user}</option>
      <option value="{user_id}">{user_id}</option>
      <option value="{title}">{title}</option>
      <option value="{p_title}">{p_title}</option>
      <option value="{tags}">{tags}</option>
      <option value="{tags_translate}">{tags_translate}</option>
      <option value="{tags_transl_only}">{tags_transl_only}</option>
      <option value="{p_tag}">{p_tag}</option>
      <option value="{type}">{type}</option>
      <option value="{like}">{like}</option>
      <option value="{bmk}">{bmk}</option>
      <option value="{bmk_id}">{bmk_id}</option>
      <option value="{bmk_1000}">{bmk_1000}</option>
      <option value="{view}">{view}</option>
      <option value="{rank}">{rank}</option>
      <option value="{date}">{date}</option>
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
    <button class="showFileNameTip textButton" type="button" data-xztext="_提示2"></button>
    </p>
    <p class="tip tipWithBtn" id="tipCreateFolder">
      <span class="left">
      <span data-xztext="_设置文件夹名的提示"></span>
      <strong>{user}/{id}</strong>
      </span>
      <span class="right">
        <button type="button" class="textButton gray1" id="tipCreateFolderBtn" data-xztext="_我知道了">
        </button>
      </span>
    </p>
    <p class="fileNameTip tip">
    <span data-xztext="_设置文件夹名的提示"></span>
    <strong>{user}/{id}</strong>
    <br>
    <span data-xztext="_命名标记提醒"></span>
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
    <span class="blue">{p_title}</span>
    <span data-xztext="_文件夹标记PTitle"></span>
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
    <span class="blue">{p_tag}</span>
    <span data-xztext="_文件夹标记PTag"></span>
    <br>
    <span class="blue">{type}</span>
    <span data-xztext="_命名标记type"></span>
    <br>
    <span class="blue">{like}</span>
    <span data-xztext="_命名标记like"></span>
    <br>
    <span class="blue">{bmk}</span>
    <span data-xztext="_命名标记bmk"></span>
    <br>
    <span class="blue">{bmk_id}</span>
    <span data-xztext="_命名标记bmk_id"></span>
    <br>
    <span class="blue">{bmk_1000}</span>
    <span data-xztext="_命名标记bmk_1000"></span>
    <br>
    <span class="blue">{view}</span>
    <span data-xztext="_命名标记view"></span>
    <br>
    <span class="blue">{rank}</span>
    <span data-xztext="_命名标记rank"></span>
    <br>
    <span class="blue">{date}</span>
    <span data-xztext="_命名标记date"></span>
    <br>
    <span class="blue">{task_date}</span>
    <span data-xztext="_命名标记taskDate"></span>
    <br>
    <span class="blue">{px}</span>
    <span data-xztext="_命名标记px"></span>
    <br>
    <span class="blue">{series_title}</span>
    <span data-xztext="_命名标记seriesTitle"></span>
    <br>
    <span class="blue">{series_order}</span>
    <span data-xztext="_命名标记seriesOrder"></span>
    <br>
    <span class="blue">{series_id}</span>
    <span data-xztext="_命名标记seriesId"></span>
    <br>
    <span class="blue">{id_num}</span>
    <span data-xztext="_命名标记id_num"></span>
    <br>
    <span class="blue">{p_num}</span>
    <span data-xztext="_命名标记p_num"></span>
    </p>

    <p class="option" data-no="50">
    <span class="settingNameStyle1" data-xztext="_在不同的页面类型中使用不同的命名规则"></span>
    <input type="checkbox" name="setNameRuleForEachPageType" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>
    
    <p class="option" data-no="64">
    <span class="settingNameStyle1" data-xztext="_只有一个抓取结果时不建立文件夹"></span>
    <input type="checkbox" name="notFolderWhenOneFile" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>
    
    <p class="option" data-no="38">
    <span class="settingNameStyle1" data-xztext="_把r18作品存入指定的文件夹里"></span>
    <input type="checkbox" name="r18Folder" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="r18Folder">
    <span data-xztext="_目录名"></span>
    <input type="text" name="r18FolderName" class="setinput_style1 blue" style="width:150px;min-width: 150px;" value="[R-18&R-18G]">
    </span>
    </p>

    <p class="option" data-no="16">
    <span class="settingNameStyle1"">
    <span data-xztext="_下载线程"></span>
    </span>
    <input type="text" name="downloadThread" class="has_tip setinput_style1 blue" data-xztip="_下载线程的说明" value="5">
    </p>

    <p class="option" data-no="17">
    <span class="has_tip settingNameStyle1" data-xztip="_快速下载的提示">
    <span data-xztext="_自动开始下载"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="33">
    <span class="has_tip settingNameStyle1" data-xztip="_下载之后收藏作品的提示">
    <span data-xztext="_下载之后收藏作品"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="bmkAfterDL" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="52">
    <span class="settingNameStyle1" data-xztext="_下载完成后显示通知"></span>
    <input type="checkbox" name="showNotificationAfterDownloadComplete" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
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
    <span class="has_tip settingNameStyle1" data-xztip="_显示高级设置说明">
    <span data-xztext="_显示高级设置"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option settingCategoryName" data-no="59">
      <span data-xztext="_抓取"></span>
    </p>

    <p class="option" data-no="69">
    <span class="settingNameStyle1" data-xztext="_不抓取多图作品的最后一张图片"></span>
    <input type="checkbox" name="doNotDownloadLastImageOfMultiImageWork" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="35">
    <span class="has_tip settingNameStyle1" data-xztip="_用户阻止名单的说明">
    <span data-xztext="_用户阻止名单"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="userBlockList" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="userBlockList">
    <input type="text" name="blockList" class="setinput_style1 blue setinput_tag" data-xzplaceholder="_用户ID必须是数字">
    </span>
    </p>

    <p class="option" data-no="39">
    <span class="settingNameStyle1" data-xztext="_针对特定用户屏蔽tag"></span>
    <input type="checkbox" name="blockTagsForSpecificUser" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="blockTagsForSpecificUser">
    <slot data-name="blockTagsForSpecificUser"></slot>
    </span>
    </p>
    
    <p class="option" data-no="54">
    <span class="settingNameStyle1" data-xztext="_自动导出抓取结果"></span>
    <input type="checkbox" name="autoExportResult" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="autoExportResult">
    <span data-xztext="_抓取结果"></span>
    <span>&gt;</span>
    <input type="text" name="autoExportResultNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
    <span>&nbsp;</span>
    <span class="settingNameStyle1" data-xztext="_文件格式"> </span>
    <input type="checkbox" name="autoExportResultCSV" id="autoExportResultCSV" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="autoExportResultCSV"> CSV </label>
    <input type="checkbox" name="autoExportResultJSON" id="autoExportResultJSON" class="need_beautify checkbox_common" checked>
    <span class="beautify_checkbox"></span>
    <label for="autoExportResultJSON"> JSON </label>
    </span>
    </p>

    <p class="option settingCategoryName" data-no="65">
      <span data-xztext="_命名"></span>
    </p>

    <p class="option" data-no="42">
    <span class="settingNameStyle1" data-xztext="_根据作品类型自动建立文件夹"></span>
    <input type="checkbox" name="createFolderByType" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="createFolderByType">
    <input type="checkbox" name="createFolderByTypeIllust" id="createFolderByTypeIllust" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="createFolderByTypeIllust" class="has_tip" data-tip="${Config.worksTypeName[0]}">
    <span data-xztext="_插画"></span></label>
    <input type="checkbox" name="createFolderByTypeManga" id="createFolderByTypeManga" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="createFolderByTypeManga" class="has_tip" data-tip="${Config.worksTypeName[1]}">
    <span data-xztext="_漫画"></span></label>
    <input type="checkbox" name="createFolderByTypeUgoira" id="createFolderByTypeUgoira" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="createFolderByTypeUgoira" class="has_tip" data-tip="${Config.worksTypeName[2]}">
    <span data-xztext="_动图"></span></label>
    <input type="checkbox" name="createFolderByTypeNovel" id="createFolderByTypeNovel" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="createFolderByTypeNovel" class="has_tip" data-tip="${Config.worksTypeName[3]}">
    <span data-xztext="_小说"></span></label>
    </p>

    <p class="option" data-no="19">
    <span class="settingNameStyle1" data-xztext="_为作品建立单独的文件夹"></span>
    <input type="checkbox" name="workDir" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="workDir">
    <label for="workDirFileNumber" data-xztext="_文件数量大于"></label>
    <input type="text" name="workDirFileNumber" id="workDirFileNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
    <span>&nbsp;</span>
    <label for="workDirNameRule" data-xztext="_目录名"></label>
    <input class="has_tip setinput_style1 blue" type="text"  data-xztip="_为作品建立单独的文件夹说明" name="workDirNameRule" id="workDirNameRule" value="{id_num}">
    </span>
    </p>

    <p class="option" data-no="43">
    <span class="has_tip settingNameStyle1" data-xztip="_使用匹配的tag建立文件夹的说明">
    <span data-xztext="_使用第一个匹配的tag建立文件夹"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="createFolderByTag" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="createFolderByTag">
    <span class="gray1" data-xztext="_tag用逗号分割"></span>
    <br>
    <textarea class="centerPanelTextArea beautify_scrollbar" name="createFolderTagList" rows="1"></textarea>
    </span>
    </p>

    <p class="option" data-no="22">
    <span class="has_tip settingNameStyle1" data-xztip="_第一张图不带序号说明">
    <span data-xztext="_第一张图不带序号"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="noSerialNo" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="noSerialNo">
      <input type="checkbox" name="noSerialNoForSingleImg" id="setNoSerialNoForSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setNoSerialNoForSingleImg" data-xztext="_单图作品"></label>
      <input type="checkbox" name="noSerialNoForMultiImg" id="setNoSerialNoForMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setNoSerialNoForMultiImg" data-xztext="_多图作品"></label>
    </span>
    </p>
    
    <p class="option" data-no="46">
    <span class="settingNameStyle1" data-xztext="_在序号前面填充0"></span>
    <input type="checkbox" name="zeroPadding" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="zeroPadding">
    <span data-xztext="_序号总长度"></span>
    <input type="text" name="zeroPaddingLength" class="setinput_style1 blue" value="3" style="width:30px;min-width: 30px;">
    </span>
    </p>

    <p class="option" data-no="14">
    <span class="has_tip settingNameStyle1" data-xztip="_添加字段名称提示">
    <span data-xztext="_添加命名标记前缀"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="29">
    <span class="settingNameStyle1" data-xztext="_文件名长度限制"></span>
    <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
    <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
    </span>
    </p>

    <p class="option" data-no="67">
    <span class="has_tip settingNameStyle1" data-xztip="_移除用户名中的at和后续字符的说明">
    <span data-xztext="_移除用户名中的at和后续字符"></span>
    <span class="gray1"> ? </span>
    </span>
    <input type="checkbox" name="removeAtFromUsername" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="66">
    <span class="has_tip settingNameStyle1" data-xztip="_自定义用户名的说明">
    <span data-xztext="_自定义用户名"></span>
    <span class="gray1"> ? </span>
    </span>
    <slot data-name="setUserNameSlot"></slot>
    </p>

    <p class="option settingCategoryName" data-no="58">
      <span data-xztext="_下载"></span>
    </p>

    <p class="option" data-no="4">
    <span class="has_tip settingNameStyle1" data-xztip="_动图保存格式title">
    <span data-xztext="_动图保存格式"></span>
    <span class="gray1"> ? </span></span>
    <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
    <span class="beautify_radio"></span>
    <label for="ugoiraSaveAs1" data-xztext="_webmVideo"></label>
    <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
    <span class="beautify_radio"></span>
    <label for="ugoiraSaveAs3" data-xztext="_gif"></label>
    <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png"> 
    <span class="beautify_radio"></span>
    <label for="ugoiraSaveAs4" class="has_tip" data-xztip="_无损" data-xztext="_apng"></label>
    <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
    <span class="beautify_radio"></span>
    <label for="ugoiraSaveAs2" data-xztext="_zipFile"></label>
    </p>

    <p class="option" data-no="24">
    <span class="settingNameStyle1" data-xztext="_同时转换多少个动图"></span>
    <input type="text" name="convertUgoiraThread" class="has_tip setinput_style1 blue" data-xztip="_同时转换多少个动图警告" value="1">
    </span>
    </p>

    <p class="option" data-no="26">
    <span class="settingNameStyle1" data-xztext="_小说保存格式"></span>
    <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
    <span class="beautify_radio"></span>
    <label for="novelSaveAs1"> TXT </label>
    <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub"> 
    <span class="beautify_radio"></span>
    <label for="novelSaveAs2"> EPUB </label>
    </p>
    
    <p class="option" data-no="27">
    <span class="has_tip settingNameStyle1" data-xztip="_在小说里保存元数据提示">
    <span data-xztext="_在小说里保存元数据"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch" >
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="70">
    <span class="settingNameStyle1" data-xztext="_下载小说的封面图片"></span>
    <input type="checkbox" name="downloadNovelCoverImage" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="49">
    <span class="has_tip settingNameStyle1" data-xztip="_保存作品的元数据说明">
    <span data-xztext="_保存作品的元数据"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="saveMetaType0" id="setSaveMetaType0" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="setSaveMetaType0" data-xztext="_插画"></label>
    <input type="checkbox" name="saveMetaType1" id="setSaveMetaType1" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="setSaveMetaType1" data-xztext="_漫画"></label>
    <input type="checkbox" name="saveMetaType2" id="setSaveMetaType2" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="setSaveMetaType2" data-xztext="_动图"></label>
    <input type="checkbox" name="saveMetaType3" id="setSaveMetaType3" class="need_beautify checkbox_common">
    <span class="beautify_checkbox"></span>
    <label for="setSaveMetaType3" data-xztext="_小说"></label>
    </p>

    <p class="option" data-no="30">
    <span class="settingNameStyle1" data-xztext="_图片尺寸"></span>
    <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
    <span class="beautify_radio"></span>
    <label for="imageSize1" data-xztext="_原图"></label>
    <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
    <span class="beautify_radio"></span>
    <label for="imageSize2" data-xztext="_普通"></label>
    <span class="gray1">(1200px)</span>
    <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
    <span class="beautify_radio"></span>
    <label for="imageSize3" data-xztext="_小图"></label>
    <span class="gray1">(540px)</span>
    <input type="radio" name="imageSize" id="imageSize4" class="need_beautify radio" value="thumb">
    <span class="beautify_radio"></span>
    <label for="imageSize4" data-xztext="_方形缩略图"></label>
    <span class="gray1">(250px)</span>
    </p>

    <p class="option" data-no="25">
    <span class="has_tip settingNameStyle1" data-xztip="_不符合要求的文件不会被保存">
    <span data-xztext="_文件体积限制"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="sizeSwitch">
    <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MiB
    &nbsp;-&nbsp;
    <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MiB
    </span>
    </p>

    <p class="option" data-no="28">
    <span class="has_tip settingNameStyle1" data-xztip="_不下载重复文件的提示">
    <span data-xztext="_不下载重复文件"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    <span class="subOptionWrap" data-show="deduplication">
    &nbsp; <span data-xztext="_策略"></span>
    <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
    <span class="beautify_radio"></span>
    <label class="has_tip" for="dupliStrategy1" data-xztip="_严格模式说明" data-xztext="_严格"></label>
    <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
    <span class="beautify_radio"></span>
    <label class="has_tip" for="dupliStrategy2" data-xztip="_宽松模式说明" data-xztext="_宽松"></label>
    <button class="textButton gray1" type="button" id="exportDownloadRecord" data-xztext="_导出"></button>
    <button class="textButton gray1" type="button" id="importDownloadRecord" data-xztext="_导入"></button>
    <button class="textButton gray1" type="button" id="clearDownloadRecord" data-xztext="_清除"></button>
    </span>
    </p>

    <p class="option settingCategoryName" data-no="60">
      <span data-xztext="_增强"></span>
    </p>
    
    <p class="option" data-no="68">
    <span class="settingNameStyle1" data-xztext="_显示更大的缩略图"></span>
    <input type="checkbox" name="showLargerThumbnails" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="showLargerThumbnails">
    <label for="doubleWidthThumb" data-xztext="_横图占用二倍宽度"></label>
    <input type="checkbox" name="doubleWidthThumb" id="doubleWidthThumb" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </span>
    </p>
    
    <p class="option" data-no="63">
    <span class="settingNameStyle1" data-xztext="_替换方形缩略图以显示图片比例"></span>
    <input type="checkbox" name="replaceSquareThumb" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="55">
    <span class="settingNameStyle1 has_tip" data-xztip="_快捷键AltP">
    <span data-xztext="_预览作品"></span>
    </span>
    <input type="checkbox" name="PreviewWork" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="PreviewWork">

    <label for="wheelScrollSwitchImageOnPreviewWork" class="has_tip" data-xztext="_使用鼠标滚轮切换作品里的图片" data-xztip="_这可能会阻止页面滚动"></label>
    <input type="checkbox" name="wheelScrollSwitchImageOnPreviewWork" id="wheelScrollSwitchImageOnPreviewWork" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="verticalSplit"></span>

    <span data-xztext="_等待时间"></span>&nbsp;
    <input type="text" name="previewWorkWait" class="setinput_style1 blue" value="400" style="width:40px;min-width: 40px;">
    <span>&nbsp;ms</span>

    <span class="verticalSplit"></span>

    <label for="showPreviewWorkTip" data-xztext="_显示摘要信息"></label>
    <input type="checkbox" name="showPreviewWorkTip" id="showPreviewWorkTip" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="verticalSplit"></span>

    <span class="settingNameStyle1" data-xztext="_图片尺寸2"></span>
    <input type="radio" name="prevWorkSize" id="prevWorkSize1" class="need_beautify radio" value="original">
    <span class="beautify_radio"></span>
    <label for="prevWorkSize1" data-xztext="_原图"></label>
    <input type="radio" name="prevWorkSize" id="prevWorkSize2" class="need_beautify radio" value="regular" checked>
    <span class="beautify_radio"></span>
    <label for="prevWorkSize2" data-xztext="_普通"></label>
    </span>
    </p>

    <p class="option" data-no="71">
    <span class="settingNameStyle1" data-xztext="_预览动图"></span>
    <input type="checkbox" name="previewUgoira" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="62">
    <span class="settingNameStyle1" data-xztext="_长按右键显示大图"></span>
    <input type="checkbox" name="showOriginImage" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="showOriginImage">
    
    <span class="settingNameStyle1" data-xztext="_图片尺寸2"></span>
    <input type="radio" name="showOriginImageSize" id="showOriginImageSize1" class="need_beautify radio" value="original">
    <span class="beautify_radio"></span>
    <label for="showOriginImageSize1" data-xztext="_原图"></label>
    <input type="radio" name="showOriginImageSize" id="showOriginImageSize2" class="need_beautify radio" value="regular" checked>
    <span class="beautify_radio"></span>
    <label for="showOriginImageSize2" data-xztext="_普通"></label>
    </p>

    <p class="option" data-no="40">
    <span class="settingNameStyle1" data-xztext="_在作品缩略图上显示放大按钮"></span>
    <input type="checkbox" name="magnifier" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="magnifier">

    <span class="settingNameStyle1" data-xztext="_位置"> </span>
    <input type="radio" name="magnifierPosition" id="magnifierPosition1" class="need_beautify radio" value="left">
    <span class="beautify_radio"></span>
    <label for="magnifierPosition1" data-xztext="_左"></label>
    <input type="radio" name="magnifierPosition" id="magnifierPosition2" class="need_beautify radio" value="right" checked>
    <span class="beautify_radio"></span>
    <label for="magnifierPosition2" data-xztext="_右"></label>

    <span class="verticalSplit"></span>

    <span class="settingNameStyle1" data-xztext="_图片尺寸2"></span>
    <input type="radio" name="magnifierSize" id="magnifierSize1" class="need_beautify radio" value="original">
    <span class="beautify_radio"></span>
    <label for="magnifierSize1" data-xztext="_原图"></label>
    <input type="radio" name="magnifierSize" id="magnifierSize2" class="need_beautify radio" value="regular" checked>
    <span class="beautify_radio"></span>
    <label for="magnifierSize2" data-xztext="_普通"></label>

    </span>
    </p>

    <p class="option" data-no="56">
    <span class="settingNameStyle1" data-xztext="_在作品缩略图上显示下载按钮"></span>
    <input type="checkbox" name="showDownloadBtnOnThumb" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="48">
    <span class="settingNameStyle1" data-xztext="_在搜索页面添加快捷搜索区域"></span>
    <input type="checkbox" name="showFastSearchArea" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="18">
    <span class="has_tip settingNameStyle1" data-xztip="_预览搜索结果说明">
    <span data-xztext="_预览搜索结果"></span>
    <span class="gray1"> ? </span></span>
    <input type="checkbox" name="previewResult" class="need_beautify checkbox_switch" checked>
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="previewResult">
    <span class="settingNameStyle1" data-xztext="_上限"> </span>
    <input type="text" name="previewResultLimit" class="setinput_style1 blue" value="1000" style="width:80px;min-width: 80px;">
    </span>
    </p>

    <p class="option" data-no="34">
    <span class="settingNameStyle1" data-xztext="_收藏设置"></span>
    
    <input type="radio" name="widthTag" id="widthTag1" class="need_beautify radio" value="yes" checked>
    <span class="beautify_radio"></span>
    <label for="widthTag1" data-xztext="_添加tag"></label>
    <input type="radio" name="widthTag" id="widthTag2" class="need_beautify radio" value="no">
    <span class="beautify_radio"></span>
    <label for="widthTag2" data-xztext="_不添加tag"></label>

    <span class="verticalSplit"></span>
    
    <input type="radio" name="restrict" id="restrict1" class="need_beautify radio" value="no" checked>
    <span class="beautify_radio"></span>
    <label for="restrict1" data-xztext="_公开"></label>
    <input type="radio" name="restrict" id="restrict2" class="need_beautify radio" value="yes">
    <span class="beautify_radio"></span>
    <label for="restrict2" data-xztext="_不公开"></label>
    </p>

    <p class="option settingCategoryName" data-no="61">
      <span data-xztext="_其他"></span>
    </p>

    <p class="option" data-no="31">
    <span class="settingNameStyle1" data-xztext="_日期格式"></span>
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

    <p class="option" data-no="36">
    <span class="settingNameStyle1" data-xztext="_颜色主题"></span>
    <input type="radio" name="theme" id="theme1" class="need_beautify radio" value="auto" checked>
    <span class="beautify_radio"></span>
    <label for="theme1" data-xztext="_自动检测"></label>
    <input type="radio" name="theme" id="theme2" class="need_beautify radio" value="white">
    <span class="beautify_radio"></span>
    <label for="theme2">White</label>
    <input type="radio" name="theme" id="theme3" class="need_beautify radio" value="dark">
    <span class="beautify_radio"></span>
    <label for="theme3">Dark</label>
    </p>

    <p class="option" data-no="41">
    <span class="settingNameStyle1" data-xztext="_背景图片"> </span>
    <input type="checkbox" name="bgDisplay" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>

    <span class="subOptionWrap" data-show="bgDisplay">

    <button class="textButton gray1" type="button" id="selectBG" data-xztext="_选择文件"></button>
    <button class="textButton gray1" type="button" id="clearBG" data-xztext="_清除"></button>
    
    &nbsp;
    <span data-xztext="_对齐方式"></span>&nbsp;
    <input type="radio" name="bgPositionY" id="bgPosition1" class="need_beautify radio" value="center" checked>
    <span class="beautify_radio"></span>
    <label for="bgPosition1" data-xztext="_居中"></label>
    <input type="radio" name="bgPositionY" id="bgPosition2" class="need_beautify radio" value="top">
    <span class="beautify_radio"></span>
    <label for="bgPosition2" data-xztext="_顶部"></label>
    <span data-xztext="_不透明度"></span>&nbsp;
    <input name="bgOpacity" type="range" />
    </span>
    </p>
    
    <p class="option" data-no="45">
    <span class="settingNameStyle1" data-xztext="_选项卡切换方式"></span>
    <input type="radio" name="switchTabBar" id="switchTabBar1" class="need_beautify radio" value="over" checked>
    <span class="beautify_radio"></span>
    <label for="switchTabBar1" data-xztext="_鼠标经过"></label>
    <input type="radio" name="switchTabBar" id="switchTabBar2" class="need_beautify radio" value="click">
    <span class="beautify_radio"></span>
    <label for="switchTabBar2" data-xztext="_鼠标点击"></label>
    </p>

    <p class="option" data-no="53">
    <span class="settingNameStyle1" data-xztext="_高亮显示关键字"></span>
    <input type="checkbox" name="boldKeywords" class="need_beautify checkbox_switch">
    <span class="beautify_switch"></span>
    </p>

    <p class="option" data-no="32">
    <span class="settingNameStyle1"><span class="key">Language</span></span>
    <input type="radio" name="userSetLang" id="userSetLang1" class="need_beautify radio" value="auto" checked>
    <span class="beautify_radio"></span>
    <label for="userSetLang1" data-xztext="_自动检测"></label>
    <input type="radio" name="userSetLang" id="userSetLang2" class="need_beautify radio" value="zh-cn">
    <span class="beautify_radio"></span>
    <label for="userSetLang2">简体中文</label>
    <input type="radio" name="userSetLang" id="userSetLang3" class="need_beautify radio" value="zh-tw">
    <span class="beautify_radio"></span>
    <label for="userSetLang3">繁體中文</label>
    <input type="radio" name="userSetLang" id="userSetLang4" class="need_beautify radio" value="ja">
    <span class="beautify_radio"></span>
    <label for="userSetLang4">日本語</label>
    <input type="radio" name="userSetLang" id="userSetLang5" class="need_beautify radio" value="en">
    <span class="beautify_radio"></span>
    <label for="userSetLang5">English</label>
    <input type="radio" name="userSetLang" id="userSetLang6" class="need_beautify radio" value="ko">
    <span class="beautify_radio"></span>
    <label for="userSetLang6">한국어</label>
    </p>

    <p class="option" data-no="37">
    <span class="settingNameStyle1" data-xztext="_管理设置">$</span>
    <button class="textButton gray1" type="button" id="exportSettings" data-xztext="_导出设置"></button>
    <button class="textButton gray1" type="button" id="importSettings" data-xztext="_导入设置"></button>
    <button class="textButton gray1" type="button" id="resetSettings" data-xztext="_重置设置"></button>
    </p>
  </div>
</form>`
