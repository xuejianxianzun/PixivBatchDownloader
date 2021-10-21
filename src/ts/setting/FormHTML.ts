import { Config } from '../config/Config'
import { lang } from '../Lang'

export const formHtml = `<form class="settingForm">
    <div class="tabsContnet">
      <p class="option" data-no="1">
      <span class="setWantPageWrap">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_页数'
      )}"><span class="setWantPageTip1">${lang.transl(
  '_页数'
)}</span><span class="gray1"> ? </span></span>
      <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
      value = '-1'>&nbsp;
      <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
      </span>
      </p>

      <p class="option" data-no="2">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示'
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType0"> ${lang.transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType1"> ${lang.transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType2"> ${lang.transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType3"> ${lang.transl('_小说')}&nbsp;</label>
      </p>

      <p class="option" data-no="44">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示'
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downAllAges" id="downAllAges" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downAllAges"> ${lang.transl('_全年龄')}&nbsp;</label>
      <input type="checkbox" name="downR18" id="downR18" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downR18"> R-18&nbsp;</label>
      <input type="checkbox" name="downR18G" id="downR18G" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="downR18G"> R-18G&nbsp;</label>
      </p>

      <p class="option" data-no="6">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示'
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downNotBookmarked" id="setDownNotBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownNotBookmarked"> ${lang.transl('_未收藏')}&nbsp;</label>
      <input type="checkbox" name="downBookmarked" id="setDownBookmarked" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBookmarked"> ${lang.transl('_已收藏')}&nbsp;</label>
      </p>
      
      <p class="option" data-no="23">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示'
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownColorImg"> ${lang.transl('_彩色图片')}&nbsp;</label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBlackWhiteImg"> ${lang.transl(
        '_黑白图片'
      )}&nbsp;</label>
      </p>

      <p class="option" data-no="21">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示'
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownSingleImg"> ${lang.transl('_单图作品')}&nbsp;</label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownMultiImg"> ${lang.transl('_多图作品')}&nbsp;</label>
      </p>

      <p class="option" data-no="51">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_显示高级设置说明'
      )}">${lang.transl('_显示高级设置')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="showAdvancedSettings" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="3">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_必须大于0'
      )}" >${lang.transl(
  '_多图作品只下载前几张图片'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="firstFewImagesSwitch">
      <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
      </span>
      </p>

      <p class="option" data-no="47">
      <span class="has_tip settingNameStyle1" data-tip="${
        lang.transl('_超出此限制的多图作品不会被下载') +
        '. ' +
        lang.transl('_必须大于0')
      }" >${lang.transl(
  '_多图作品的图片数量限制'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="multiImageWorkImageLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="multiImageWorkImageLimitSwitch">
      &lt;=&nbsp;
      <input type="text" name="multiImageWorkImageLimit" class="setinput_style1 blue" value="1">
      </span>
      </p>

      <p class="option" data-no="5">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置收藏数量的提示'
      )}">${lang.transl('_设置收藏数量')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumSwitch">
      &gt;=&nbsp;
      <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
      &lt;=&nbsp;
      <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="${
        Config.BookmarkCountLimit
      }">
      <span>&nbsp;${lang.transl('_或者')}</span>
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_日均收藏数量的提示'
      )}">
      ${lang.transl('_日均收藏数量')}
      <span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumAverageSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumAverageSwitch">
        <input type="text" name="BMKNumAverage" class="setinput_style1 blue bmkNum" value="600">
      </span>
      </span>
      </p>

      <p class="option" data-no="8">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置宽高比例Title'
      )}">${lang.transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="ratioSwitch">
      <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="horizontal">
      <span class="beautify_radio"></span>
      <label for="ratio1"> ${lang.transl('_横图')}&nbsp; </label>

      <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="vertical">
      <span class="beautify_radio"></span>
      <label for="ratio2"> ${lang.transl('_竖图')}&nbsp; </label>
      
      <input type="radio" name="ratio" id="ratio0" class="need_beautify radio" value="square">
      <span class="beautify_radio"></span>
      <label for="ratio0"> ${lang.transl('_正方形')}&nbsp; </label>

      <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="userSet">
      <span class="beautify_radio"></span>
      <label for="ratio3"> ${lang.transl('_输入宽高比')}</label>
      <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
      </span>
      </p>

      <p class="option" data-no="7">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_筛选宽高的按钮Title'
      )} ${lang.transl('_筛选宽高的提示文字')}">${lang.transl(
  '_筛选宽高的按钮文字'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="setWHSwitch">

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit1" class="need_beautify radio" value=">=" checked>
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit1">&gt;=&nbsp;</label>

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit2" class="need_beautify radio" value="=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit2">=&nbsp;</label>
      
      <input type="radio" name="widthHeightLimit" id="widthHeightLimit3" class="need_beautify radio" value="<=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit3">&lt;=&nbsp;</label>

      <span class="">${lang.transl('_宽度')}</span>
      <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr1">and&nbsp;</label>
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr2">or&nbsp;</label>
      <span class="">${lang.transl('_高度')}</span>
      <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
      </span>
      </p>

      <p class="option" data-no="9">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置id范围提示'
      )}">${lang.transl(
  '_设置id范围'
)}&nbsp; <span class="gray1"> ? </span></span>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">
      <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value=">" checked>
      <span class="beautify_radio"></span>
      <label for="idRange1">  &gt;&nbsp; </label>
      <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="<">
      <span class="beautify_radio"></span>
      <label for="idRange2">  &lt;&nbsp; </label>
      <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
      </span>
      </p>

      <p class="option" data-no="10">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置投稿时间提示'
      )}">${lang.transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="postDate">
      <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      &nbsp;-&nbsp;
      <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      </span>
      </p>

      <p class="option" data-no="11">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_必须tag的提示文字'
      )}">${lang.transl('_必须含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="needTagSwitch">
      <input type="radio" name="needTagMode" id="needTagMode1" class="need_beautify radio" value="all" checked>
      <span class="beautify_radio"></span>
      <label for="needTagMode1">  ${lang.transl('_全部')}&nbsp; </label>
      <input type="radio" name="needTagMode" id="needTagMode2" class="need_beautify radio" value="one">
      <span class="beautify_radio"></span>
      <label for="needTagMode2">  ${lang.transl('_任一')}&nbsp; </label>
      <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <p class="option" data-no="12">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_排除tag的提示文字'
      )}">${lang.transl('_不能含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="notNeedTagSwitch">
      <span class="gray1">${lang.transl('_任一')}&nbsp;</span>
      <input type="radio" id="tagMatchMode1" class="need_beautify radio" name="tagMatchMode" value="partial" checked>
      <span class="beautify_radio"></span>
      <label for="tagMatchMode1"> ${lang.transl('_部分一致')}&nbsp; </label>
      <input type="radio" id="tagMatchMode2" class="need_beautify radio" name="tagMatchMode" value="whole" checked>
      <span class="beautify_radio"></span>
      <label for="tagMatchMode2"> ${lang.transl('_完全一致')}&nbsp; </label>
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
      <span class="settingNameStyle1">${lang.transl('_命名规则')}</span>
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
        <option value="{bmk_1000}">{bmk_1000}</option>
        <option value="{view}">{view}</option>
        <option value="{rank}">{rank}</option>
        <option value="{date}">{date}</option>
        <option value="{task_date}">{task_date}</option>
        <option value="{px}">{px}</option>
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        </select>
      &nbsp;
      <slot data-name="saveNamingRule"></slot>
      <button class="showFileNameTip textButton" type="button">${lang.transl(
        '_提示2'
      )}</button>
      </p>
      <p class="tip tipWithBtn" id="tipCreateFolder">
        <span class="left">
        ${lang.transl('_设置文件夹名的提示')}<strong>{user}/{id}</strong>
        </span>
        <span class="right">
         <button type="button" class="textButton gray1" id="tipCreateFolderBtn">
         ${lang.transl('_我知道了')}
         </button>
        </span>
      </p>
      <p class="fileNameTip tip">
      ${lang.transl('_设置文件夹名的提示')}<strong>{user}/{id}</strong>
      <br>
      ${lang.transl('_命名标记提醒')}
      <br>
      <span class="blue">{id}</span>
      ${lang.transl('_命名标记id')}
      <br>
      <span class="blue">{user}</span>
      ${lang.transl('_命名标记user')}
      <br>
      <span class="blue">{user_id}</span>
      ${lang.transl('_用户id')}
      <br>
      <span class="blue">{title}</span>
      ${lang.transl('_命名标记title')}
      <br>
      <span class="blue">{p_title}</span>
      ${lang.transl('_文件夹标记PTitle')}
      <br>
      <span class="blue">{tags}</span>
      ${lang.transl('_命名标记tags')}
      <br>
      <span class="blue">{tags_translate}</span>
      ${lang.transl('_命名标记tags_trans')}
      <br>
      <span class="blue">{tags_transl_only}</span>
      ${lang.transl('_命名标记tags_transl_only')}
      <br>
      <span class="blue">{p_tag}</span>
      ${lang.transl('_文件夹标记PTag')}
      <br>
      <span class="blue">{type}</span>
      ${lang.transl('_命名标记type')} ${Config.worksTypeName.join(', ')}
      <br>
      <span class="blue">{like}</span>
      ${lang.transl('_命名标记like')}
      <br>
      <span class="blue">{bmk}</span>
      ${lang.transl('_命名标记bmk')}
      <br>
      <span class="blue">{bmk_1000}</span>
      ${lang.transl('_命名标记bmk_1000')}
      <br>
      <span class="blue">{view}</span>
      ${lang.transl('_命名标记view')}
      <br>
      <span class="blue">{rank}</span>
      ${lang.transl('_命名标记rank')}
      <br>
      <span class="blue">{date}</span>
      ${lang.transl('_命名标记date')}
      <br>
      <span class="blue">{task_date}</span>
      ${lang.transl('_命名标记taskDate')}
      <br>
      <span class="blue">{px}</span>
      ${lang.transl('_命名标记px')}
      <br>
      <span class="blue">{series_title}</span>
      ${lang.transl('_命名标记seriesTitle')}
      <br>
      <span class="blue">{series_order}</span>
      ${lang.transl('_命名标记seriesOrder')}
      <br>
      <span class="blue">{id_num}</span>
      ${lang.transl('_命名标记id_num')}
      <br>
      <span class="blue">{p_num}</span>
      ${lang.transl('_命名标记p_num')}
      </p>

      <p class="option" data-no="50">
      <span class="settingNameStyle1"">
      ${lang.transl('_在不同的页面类型中使用不同的命名规则')}</span>
      <input type="checkbox" name="setNameRuleForEachPageType" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="14">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_添加字段名称提示'
      )}">${lang.transl(
  '_添加命名标记前缀'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="22">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_第一张图不带序号说明'
      )}">${lang.transl(
  '_第一张图不带序号'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="noSerialNo" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      
      <p class="option" data-no="46">
      <span class="settingNameStyle1">${lang.transl('_在序号前面填充0')}</span>
      <input type="checkbox" name="zeroPadding" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="zeroPadding">
      <span>${lang.transl('_序号总长度')}</span>
      <input type="text" name="zeroPaddingLength" class="setinput_style1 blue" value="3" style="width:30px;min-width: 30px;">
      </span>
      </p>
      
      <p class="option" data-no="42">
      <span class="settingNameStyle1">${lang.transl(
        '_根据作品类型自动创建文件夹'
      )}</span>
      <input type="checkbox" name="createFolderByType" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="createFolderByType">
      <input type="checkbox" name="createFolderByTypeIllust" id="createFolderByTypeIllust" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeIllust" class="has_tip" data-tip="${
        Config.worksTypeName[0]
      }"> ${lang.transl('_插画')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeManga" id="createFolderByTypeManga" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeManga" class="has_tip" data-tip="${
        Config.worksTypeName[1]
      }"> ${lang.transl('_漫画')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeUgoira" id="createFolderByTypeUgoira" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeUgoira" class="has_tip" data-tip="${
        Config.worksTypeName[2]
      }"> ${lang.transl('_动图')}&nbsp;</label>

      <input type="checkbox" name="createFolderByTypeNovel" id="createFolderByTypeNovel" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="createFolderByTypeNovel" class="has_tip" data-tip="${
        Config.worksTypeName[3]
      }"> ${lang.transl('_小说')}&nbsp;</label>
      </span>
      </p>

      <p class="option" data-no="43">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_使用匹配的tag建立文件夹的说明'
      )}">${lang.transl(
  '_使用第一个匹配的tag建立文件夹'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="createFolderByTag" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="createFolderByTag">
      <span class="gray1">${lang.transl('_tag用逗号分割')}</span>
      <br>
      <textarea class="centerPanelTextArea beautify_scrollbar" name="createFolderTagList" rows="1"></textarea>
      </span>
      </p>

      <p class="option" data-no="38">
      <span class="settingNameStyle1">${lang.transl(
        '_把r18作品存入指定的文件夹里'
      )}</span>
      <input type="checkbox" name="r18Folder" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="r18Folder">
      <span>${lang.transl('_目录名')}</span>
      <input type="text" name="r18FolderName" class="setinput_style1 blue" style="width:150px;min-width: 150px;" value="[R-18&R-18G]">
      </span>
      </p>

      <p class="option" data-no="19">
      <span class="settingNameStyle1">${lang.transl(
        '_为作品创建单独的文件夹'
      )}</span>
      <input type="checkbox" name="workDir" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="workDir">
      <span>${lang.transl('_文件数量大于')}</span>
      <input type="text" name="workDirFileNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
      <span>&nbsp;</span>
      <span>${lang.transl('_目录名')}</span>
      <input type="text" name="workDirNameRule" class="setinput_style1 blue" value="{id_num}">
      </span>
      </p>

      <div class="centerWrap_btns">
        <slot data-name="namingBtns"></slot>
        <slot data-name="exportResult"></slot>
      </div>

      <p class="option" data-no="16">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_线程数字'
      )}">${lang.transl('_设置下载线程')}<span class="gray1"> ? </span></span>
      <input type="text" name="downloadThread" class="setinput_style1 blue" value="24">
      </p>

      <p class="option" data-no="17">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_快速下载的提示'
      )}">${lang.transl('_自动开始下载')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="33">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载之后收藏作品的提示'
      )}">
      ${lang.transl('_下载之后收藏作品')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="bmkAfterDL" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="52">
      <span class="settingNameStyle1">
      ${lang.transl('_下载完成后显示通知')}</span>
      <input type="checkbox" name="showNotificationAfterDownloadComplete" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="downloadArea"></slot>
      <slot data-name="progressBar"></slot>
    </div>
    
    <div class="tabsContnet">

    <div class="centerWrap_btns">
      <slot data-name="otherBtns"></slot>
    </div>

      <p class="option" data-no="4">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_动图保存格式title'
      )}">${lang.transl('_动图保存格式')}<span class="gray1"> ? </span></span>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs1"> ${lang.transl('_webmVideo')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs3">${lang.transl('_gif')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-tip="${lang.transl(
        '_无损'
      )}">${lang.transl('_apng')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs2">${lang.transl('_zipFile')} &nbsp;</label>
      </p>

      <p class="option" data-no="24">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_同时转换多少个动图警告'
      )}">${lang.transl('_同时转换多少个动图')}</span>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
      <span class="has_tip gray1" data-tip="${lang.transl(
        '_同时转换多少个动图警告'
      )}"> ${lang.transl('_提示')} </span>
      </p>

      <p class="option" data-no="26">
      <span class="settingNameStyle1">${lang.transl(
        '_小说保存格式'
      )}<span class="gray1"> &nbsp; </span></span>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
      <span class="beautify_radio"></span>
      <label for="novelSaveAs1"> TXT &nbsp;</label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub"> 
      <span class="beautify_radio"></span>
      <label for="novelSaveAs2"> EPUB &nbsp;</label>
      </p>
      
      <p class="option" data-no="27">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_在小说里保存元数据提示'
      )}">${lang.transl(
  '_在小说里保存元数据'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="49">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_保存作品的元数据说明'
      )}">${lang.transl(
  '_保存作品的元数据'
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveMetaType0" id="setSaveMetaType0" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType0"> ${lang.transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType1" id="setSaveMetaType1" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType1"> ${lang.transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType2" id="setSaveMetaType2" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType2"> ${lang.transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="saveMetaType3" id="setSaveMetaType3" class="need_beautify checkbox_common">
      <span class="beautify_checkbox"></span>
      <label for="setSaveMetaType3"> ${lang.transl('_小说')}&nbsp;</label>
      </p>

      <p class="option" data-no="29">
      <span class="settingNameStyle1">${lang.transl('_文件名长度限制')}</span>
      <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
      <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
      </span>
      </p>

      <p class="option" data-no="30">
      <span class="settingNameStyle1">${lang.transl('_图片尺寸')} </span>
      <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
      <span class="beautify_radio"></span>
      <label for="imageSize1"> ${lang.transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
      <span class="beautify_radio"></span>
      <label for="imageSize2"> ${lang.transl('_普通')} </label>
      <span class="gray1">(1200px)</span>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
      <span class="beautify_radio"></span>
      <label for="imageSize3"> ${lang.transl('_小图')} </label>
      <span class="gray1">(540px)</span>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize4" class="need_beautify radio" value="thumb">
      <span class="beautify_radio"></span>
      <label for="imageSize4"> ${lang.transl('_方形缩略图')} </label>
      <span class="gray1">(250px)</span>
      </p>
  
      <p class="option" data-no="25">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_不符合要求的文件不会被保存'
      )}">
      ${lang.transl('_文件体积限制')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="sizeSwitch">
      <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MiB
      &nbsp;-&nbsp;
      <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MiB
      </span>
      </p>

      <p class="option" data-no="28">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_不下载重复文件的提示'
      )}">
      ${lang.transl('_不下载重复文件')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="deduplication">
      <span>&nbsp; ${lang.transl('_策略')}</span>
      <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy1" data-tip="${lang.transl(
        '_严格模式说明'
      )}">${lang.transl('_严格')}</label>
      &nbsp;
      <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy2" data-tip="${lang.transl(
        '_宽松模式说明'
      )}">${lang.transl('_宽松')}</label>
      &nbsp;
      <button class="textButton gray1" type="button" id="exportDownloadRecord">${lang.transl(
        '_导出'
      )}</button>
      <button class="textButton gray1" type="button" id="importDownloadRecord">${lang.transl(
        '_导入'
      )}</button>
      <button class="textButton gray1" type="button" id="clearDownloadRecord">${lang.transl(
        '_清除'
      )}</button>
      </span>
      </p>

      <p class="option" data-no="54">
      <span class="settingNameStyle1">${lang.transl(
        '_自动导出抓取结果'
      )} </span>
      <input type="checkbox" name="autoExportResult" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="autoExportResult">
      <span>${lang.transl('_文件数量大于')}</span>
      <input type="text" name="autoExportResultNumber" class="setinput_style1 blue" value="1" style="width:30px;min-width: 30px;">
      <span>&nbsp;</span>
      <span class="settingNameStyle1">${lang.transl('_文件格式')} </span>
      <input type="checkbox" name="autoExportResultCSV" id="autoExportResultCSV" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="autoExportResultCSV"> CSV </label>
      &nbsp;
      <input type="checkbox" name="autoExportResultJSON" id="autoExportResultJSON" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="autoExportResultJSON"> JSON </label>

      </span>
      </p>

      <p class="option" data-no="35">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_用户阻止名单的说明'
      )}">${lang.transl('_用户阻止名单')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="userBlockList" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="userBlockList">
      <input type="text" name="blockList" class="setinput_style1 blue setinput_tag" placeholder="${lang.transl(
        '_用户ID必须是数字'
      )}">
      </span>
      </p>

      <p class="option" data-no="39">
      <span class="settingNameStyle1">${lang.transl(
        '_针对特定用户屏蔽tag'
      )}</span>
      <input type="checkbox" name="blockTagsForSpecificUser" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="blockTagsForSpecificUser">
      <slot data-name="blockTagsForSpecificUser"></slot>
      </span>
      </p>

      <p class="option" data-no="48">
      <span class="settingNameStyle1">${lang.transl(
        '_在搜索页面添加快捷搜索区域'
      )} </span>
      <input type="checkbox" name="showFastSearchArea" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="18">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_预览搜索结果说明'
      )}">${lang.transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="previewResult" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="55">
      <span class="settingNameStyle1">${lang.transl('_预览作品')} </span>
      <input type="checkbox" name="PreviewWork" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="PreviewWork">
      <span>${lang.transl('_尺寸')}</span>
      <input type="text" name="PreviewWorkSize" class="setinput_style1 blue" value="600" style="width:50px;min-width: 50px;">&nbsp;px
      &nbsp;
      <span class="gray1">(Alt+P)&nbsp;${lang.transl(
        '_点击鼠标左键可以关闭预览图'
      )}</span>
      </span>
      </p>

      <p class="option" data-no="40">
      <span class="settingNameStyle1">${lang.transl(
        '_在作品缩略图上显示放大图标'
      )} </span>
      <input type="checkbox" name="magnifier" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="magnifier">

      <span class="settingNameStyle1">${lang.transl('_位置')} </span>
      <input type="radio" name="magnifierPosition" id="magnifierPosition1" class="need_beautify radio" value="left">
      <span class="beautify_radio"></span>
      <label for="magnifierPosition1"> ${lang.transl('_左')} </label>
      &nbsp;
      <input type="radio" name="magnifierPosition" id="magnifierPosition2" class="need_beautify radio" value="right" checked>
      <span class="beautify_radio"></span>
      <label for="magnifierPosition2"> ${lang.transl('_右')} </label>

      <span class="verticalSplit"></span>

      <span class="settingNameStyle1">${lang.transl('_图片尺寸2')} </span>
      <input type="radio" name="magnifierSize" id="magnifierSize1" class="need_beautify radio" value="original">
      <span class="beautify_radio"></span>
      <label for="magnifierSize1"> ${lang.transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="magnifierSize" id="magnifierSize2" class="need_beautify radio" value="regular" checked>
      <span class="beautify_radio"></span>
      <label for="magnifierSize2"> ${lang.transl('_普通')} </label>

      </span>
      </p>

      <p class="option" data-no="34">
      <span class="settingNameStyle1">${lang.transl('_收藏设置')}</span>
      
      <input type="radio" name="widthTag" id="widthTag1" class="need_beautify radio" value="yes" checked>
      <span class="beautify_radio"></span>
      <label for="widthTag1">${lang.transl('_添加tag')}&nbsp;</label>
      <input type="radio" name="widthTag" id="widthTag2" class="need_beautify radio" value="no">
      <span class="beautify_radio"></span>
      <label for="widthTag2">${lang.transl('_不添加tag')}</label>

      <span class="verticalSplit"></span>
      
      <input type="radio" name="restrict" id="restrict1" class="need_beautify radio" value="no" checked>
      <span class="beautify_radio"></span>
      <label for="restrict1">${lang.transl('_公开')}&nbsp;</label>
      <input type="radio" name="restrict" id="restrict2" class="need_beautify radio" value="yes">
      <span class="beautify_radio"></span>
      <label for="restrict2">${lang.transl('_不公开')}</label>
      </p>

      <p class="option" data-no="31">
      <span class="settingNameStyle1">${lang.transl('_日期格式')}</span>
      <input type="text" name="dateFormat" class="setinput_style1 blue" style="width:250px;" value="YYYY-MM-DD">
      <button type="button" class="gray1 textButton showDateTip">${lang.transl(
        '_提示'
      )}</button>
      </p>
      <p class="dateFormatTip tip" style="display:none">
      <span>${lang.transl('_日期格式提示')}</span>
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
      <span class="settingNameStyle1">${lang.transl('_颜色主题')}</span>
      <input type="radio" name="theme" id="theme1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio"></span>
      <label for="theme1">${lang.transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="theme" id="theme2" class="need_beautify radio" value="white">
      <span class="beautify_radio"></span>
      <label for="theme2">White</label>
      &nbsp;
      <input type="radio" name="theme" id="theme3" class="need_beautify radio" value="dark">
      <span class="beautify_radio"></span>
      <label for="theme3">Dark</label>
      </p>

      <p class="option" data-no="41">
      <span class="settingNameStyle1">${lang.transl('_背景图片')} </span>
      <input type="checkbox" name="bgDisplay" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>

      <span class="subOptionWrap" data-show="bgDisplay">

      <button class="textButton gray1" type="button" id="selectBG">${lang.transl(
        '_选择文件'
      )}</button>
      <button class="textButton gray1" type="button" id="clearBG">${lang.transl(
        '_清除'
      )}</button>
      
      &nbsp;
      <span>${lang.transl('_对齐方式')}&nbsp;</span>
      <input type="radio" name="bgPositionY" id="bgPosition1" class="need_beautify radio" value="center" checked>
      <span class="beautify_radio"></span>
      <label for="bgPosition1">${lang.transl('_居中')}</label>
      <input type="radio" name="bgPositionY" id="bgPosition2" class="need_beautify radio" value="top">
      <span class="beautify_radio"></span>
      <label for="bgPosition2">${lang.transl('_顶部')}</label>

      &nbsp;
      <span>${lang.transl('_不透明度')}&nbsp;</span>
      <input name="bgOpacity" type="range" />
      </span>
      </p>
      
      <p class="option" data-no="45">
      <span class="settingNameStyle1">${lang.transl('_选项卡切换方式')}</span>
      <input type="radio" name="switchTabBar" id="switchTabBar1" class="need_beautify radio" value="over" checked>
      <span class="beautify_radio"></span>
      <label for="switchTabBar1">${lang.transl('_鼠标经过')}</label>
      &nbsp;
      <input type="radio" name="switchTabBar" id="switchTabBar2" class="need_beautify radio" value="click">
      <span class="beautify_radio"></span>
      <label for="switchTabBar2">${lang.transl('_鼠标点击')}</label>
      </p>

      <p class="option" data-no="32">
      <span class="settingNameStyle1"><span class="key">Language</span></span>
      <input type="radio" name="userSetLang" id="userSetLang1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio"></span>
      <label for="userSetLang1">${lang.transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang2" class="need_beautify radio" value="zh-cn">
      <span class="beautify_radio"></span>
      <label for="userSetLang2">简体中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang3" class="need_beautify radio" value="zh-tw">
      <span class="beautify_radio"></span>
      <label for="userSetLang3">繁體中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang4" class="need_beautify radio" value="ja">
      <span class="beautify_radio"></span>
      <label for="userSetLang4">日本語</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang5" class="need_beautify radio" value="en">
      <span class="beautify_radio"></span>
      <label for="userSetLang5">English</label>
      &nbsp;
      </p>

      <p class="option" data-no="53">
      <span class="settingNameStyle1">
      ${lang.transl('_以粗体显示关键字')}</span>
      <input type="checkbox" name="boldKeywords" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="37">
      <span class="settingNameStyle1">${lang.transl('_管理设置')}</span>
      <button class="textButton gray1" type="button" id="exportSettings">${lang.transl(
        '_导出设置'
      )}</button>
      <button class="textButton gray1" type="button" id="importSettings">${lang.transl(
        '_导入设置'
      )}</button>
      <button class="textButton gray1" type="button" id="resetSettings">${lang.transl(
        '_重置设置'
      )}</button>
      </p>
    </div>
</form>`
